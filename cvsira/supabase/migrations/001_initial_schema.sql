-- =============================================
-- CvSira — Complete DB Schema v2
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Wallet & Credits
CREATE TABLE IF NOT EXISTS usage_credits (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_balance INT DEFAULT 5,
  subscription_plan TEXT DEFAULT 'free',
  trial_pdf_used BOOLEAN DEFAULT false,
  updated_at TIMESTAMP DEFAULT now()
);

-- 2. Credits Log
CREATE TABLE IF NOT EXISTS credits_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT,
  amount INT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now()
);

-- 3. Orders (with Idempotency)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('credits', 'subscription')),
  plan TEXT,
  credits INT,
  amount NUMERIC,
  currency TEXT DEFAULT 'SAR',
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','under_review','approved','rejected')),
  payment_method TEXT CHECK (payment_method IN ('paypal','bank')),
  proof_url TEXT,
  paypal_capture_id TEXT UNIQUE,
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now()
);

-- 4. Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT,
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMP,
  paypal_subscription_id TEXT UNIQUE,
  created_at TIMESTAMP DEFAULT now()
);

-- 5. User Roles
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user','admin','moderator')),
  updated_at TIMESTAMP DEFAULT now()
);

-- 6. Platform Events (Event-Driven Analytics)
CREATE TABLE IF NOT EXISTS platform_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT,
  payload JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_user ON platform_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON platform_events(type);

-- 7. CVs
CREATE TABLE IF NOT EXISTS cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data JSONB,
  template TEXT,
  theme JSONB,
  font JSONB,
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- 8. Post Drafts
CREATE TABLE IF NOT EXISTS drafts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id TEXT,
  content JSONB,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 9. Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID,
  recipient_name TEXT,
  course_name TEXT,
  issuer_name TEXT,
  issue_date DATE,
  verification_code TEXT UNIQUE DEFAULT nanoid(12),
  verification_hash TEXT,
  qr_url TEXT,
  pdf_url TEXT,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','generated','failed')),
  batch_id UUID,
  created_at TIMESTAMP DEFAULT now()
);

-- 10. Certificate Templates
CREATE TABLE IF NOT EXISTS certificate_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  html TEXT,
  css TEXT,
  preview_image TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now()
);

-- 11. Certificate Batches (with failed_count)
CREATE TABLE IF NOT EXISTS certificate_batches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT,
  total_count INT,
  success_count INT DEFAULT 0,
  failed_count INT DEFAULT 0,
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending','processing','done','partial','failed')),
  created_at TIMESTAMP DEFAULT now()
);

-- 12. Certificate Events
CREATE TABLE IF NOT EXISTS certificate_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id UUID REFERENCES certificates(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('view','download')),
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 13. Feedback
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INT CHECK (rating BETWEEN 1 AND 5),
  message TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- =============================================
-- DB Functions
-- =============================================

-- deduct_credits_safe (Race Condition Safe)
CREATE OR REPLACE FUNCTION deduct_credits_safe(
  p_user_id UUID,
  p_amount INT,
  p_action TEXT,
  p_metadata JSONB
) RETURNS BOOLEAN AS $$
DECLARE
  current_balance INT;
BEGIN
  -- Lock row to prevent race conditions
  SELECT credits_balance INTO current_balance
  FROM usage_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF current_balance < p_amount THEN
    RETURN false;
  END IF;

  UPDATE usage_credits
  SET credits_balance = credits_balance - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO credits_log (user_id, action, amount, metadata)
  VALUES (p_user_id, p_action, -p_amount, p_metadata);

  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- approve_order_safe (Idempotent)
CREATE OR REPLACE FUNCTION approve_order_safe(
  p_order_id UUID,
  p_capture_id TEXT
) RETURNS VOID AS $$
DECLARE
  v_order orders%ROWTYPE;
BEGIN
  SELECT * INTO v_order FROM orders
  WHERE id = p_order_id
  FOR UPDATE;

  -- Prevent duplicate processing
  IF v_order.processed THEN
    RETURN;
  END IF;

  -- Update order
  UPDATE orders
  SET status = 'approved',
      paypal_capture_id = p_capture_id,
      processed = true
  WHERE id = p_order_id;

  -- Add credits
  UPDATE usage_credits
  SET credits_balance = credits_balance + v_order.credits,
      updated_at = now()
  WHERE user_id = v_order.user_id;

  -- Log
  INSERT INTO credits_log (user_id, action, amount, metadata)
  VALUES (v_order.user_id, 'order_approved', v_order.credits,
          jsonb_build_object('order_id', p_order_id));
END;
$$ LANGUAGE plpgsql;

-- Batch Counters
CREATE OR REPLACE FUNCTION increment_batch_success(p_batch_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE certificate_batches
  SET success_count = success_count + 1
  WHERE id = p_batch_id;

  -- Check if complete
  UPDATE certificate_batches
  SET status = 'done'
  WHERE id = p_batch_id
    AND success_count + failed_count >= total_count;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_batch_failure(p_batch_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE certificate_batches
  SET failed_count = failed_count + 1
  WHERE id = p_batch_id;

  -- Update status if partial
  UPDATE certificate_batches
  SET status = 'partial'
  WHERE id = p_batch_id
    AND success_count + failed_count >= total_count
    AND failed_count > 0;
END;
$$ LANGUAGE plpgsql;
