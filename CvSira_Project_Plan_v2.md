# 🚀 CvSira — خطة بناء المنصة الكاملة (v2)
### منصة SaaS سعودية للخدمات الرقمية الذكية

> **Stack:** Next.js 14 (App Router) · Supabase · OpenRouter · Puppeteer API · Tailwind CSS · Redis/BullMQ · Upstash

> **v2 — تحديث:** تم دمج إصلاحات هندسية حرجة تشمل Idempotency · Reserve-Execute-Commit · Rate Limiting · Storage · Retry · Roles · Event Logging · Feature Flags · Upsell Engine

---

## 📋 فهرس المحتويات

1. [نظرة عامة على المنصة](#1-نظرة-عامة)
2. [صفحة الهبوط — Landing Page](#2-صفحة-الهبوط)
3. [المرحلة 1 — البنية التحتية والمصادقة](#المرحلة-1--البنية-التحتية-والمصادقة)
4. [المرحلة 2 — نظام Credits والمدفوعات](#المرحلة-2--نظام-credits-والمدفوعات)
5. [المرحلة 3 — لوحة تحكم المستخدم](#المرحلة-3--لوحة-تحكم-المستخدم)
6. [المرحلة 4 — CV Builder](#المرحلة-4--cv-builder)
7. [المرحلة 5 — Post Generator](#المرحلة-5--post-generator)
8. [المرحلة 6 — Certificate Engine](#المرحلة-6--certificate-engine)
9. [المرحلة 7 — لوحة تحكم الأدمن](#المرحلة-7--لوحة-تحكم-الأدمن)
10. [المرحلة 8 — التحسينات والإطلاق](#المرحلة-8--التحسينات-والإطلاق)
11. [هيكل الملفات الكامل](#هيكل-الملفات-الكامل)
12. [قاعدة البيانات الكاملة](#قاعدة-البيانات-الكاملة)
13. [سجل التغييرات v2](#سجل-التغييرات-v2)

---

## 1. نظرة عامة

### المنتجات الثلاثة

| المنتج | الوصف | تكلفة Credits |
|--------|-------|---------------|
| **CV Builder** | بناء سيرة ذاتية بالذكاء الاصطناعي + PDF | 10 (توليد) · 5 (تحميل) |
| **Post Generator** | توليد منشورات سوشيال ميديا بقوالب + AI | 2 (مسودة) · 1 (AI نص) |
| **Certificate Engine** | شهادات رقمية + توليد جماعي + QR تحقق | 15 / شهادة |

### نموذج الإيرادات

```
Free Trial  → 5 credits عند التسجيل (trial_pdf_used = false)
Starter     → 49 SAR/شهر → 100 credits
Pro         → 129 SAR/شهر → 350 credits + مزايا
Credits Pack → حزم متعددة (10 SAR → 2450 SAR)
```

### ✅ المبادئ الهندسية الثابتة

| المبدأ | التطبيق |
|--------|---------|
| Single Source of Truth | نفس HTML = Preview + PDF |
| Credits via Orders Layer | لا دفع مباشر للـ Wallet |
| Reserve → Execute → Commit | لا خسارة credits عند فشل الخدمة |
| Idempotency | لا credits مضاعفة من Webhooks |
| DB Transaction | لا Race Conditions |
| Event Logging | كل حدث مسجّل للـ Analytics |

---

## 2. صفحة الهبوط

**الملف:** `app/(marketing)/page.tsx`

### 2.1 هيكل الصفحة

#### Section 1 — Hero
```
العنوان:  "سيرتك المهنية، منشوراتك، شهاداتك — في منصة واحدة"
الوصف:   منصة سعودية تجمع الذكاء الاصطناعي مع الأدوات الرقمية الأكثر طلبًا
CTA:     [ابدأ مجانًا — 5 credits هدية] [شاهد كيف تعمل ▶]
خلفية:   gradient داكن مع عناصر SVG متحركة — اتجاه RTL
```

#### Section 2 — المميزات الثلاث
```
🎯 CV Builder    — "سيرة ذاتية ATS-Ready في ثوانٍ"
📱 Post Generator — "منشورات احترافية بقوالب جاهزة"
🏆 Certificate   — "شهادات رقمية موثقة بـ QR"
```

#### Section 3 — كيف تعمل
```
1. سجّل مجانًا → 2. اختر الأداة → 3. خصّص وحمّل
```

#### Section 4 — Pricing
```
Tabs: [اشتراك شهري] [شحن نقاط]
Starter: 49 SAR · Pro: 129 SAR (مميزة "الأكثر شعبية")
حزم: 15 · 80 · 175 · 450 · 1000⭐ · 2450
Slider ديناميكي (5 → 5000) مع حساب live
```

#### Section 5 — Testimonials · Section 6 — FAQ · Section 7 — Footer

### 2.2 الملفات
```
app/(marketing)/
├── page.tsx
├── layout.tsx
└── components/
    ├── Hero.tsx
    ├── FeaturesGrid.tsx
    ├── HowItWorks.tsx
    ├── PricingSection.tsx
    ├── Testimonials.tsx
    ├── FAQ.tsx
    └── Footer.tsx
```

---

## المرحلة 1 — البنية التحتية والمصادقة

```
Phase-1/
├── 1.1-project-setup.md
├── 1.2-supabase-schema.sql
├── 1.3-auth-pages.md
├── 1.4-middleware.md
└── 1.5-roles-system.md          ← جديد v2
```

### 1.1 — إعداد المشروع

```bash
npx create-next-app@latest cvsira --typescript --tailwind --app

npm install @supabase/supabase-js @supabase/ssr
npm install nanoid bullmq ioredis
npm install html-to-image sheetjs
npm install openai
npm install @upstash/ratelimit @upstash/redis   # ← جديد v2: Rate Limiting
npm install posthog-js                           # ← جديد v2: Analytics
```

**`.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENROUTER_API_KEY=
PUPPETEER_API_URL=https://cv-pdf-service-production-a4a4.up.railway.app/generate-pdf

REDIS_URL=
UPSTASH_REDIS_REST_URL=           # للـ Rate Limiting
UPSTASH_REDIS_REST_TOKEN=

PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
CREDIT_DEDUCTION_SECRET=

# Feature Flags
ENABLE_AI_IMAGE=false             # ← جديد v2
ENABLE_BULK_CERTIFICATES=true
ENABLE_JOB_ANALYSIS=true
```

---

### 1.2 — Supabase Schema (المرحلة الأولى)

```sql
-- Wallet & Credits
create table usage_credits (
  user_id uuid primary key references auth.users(id),
  credits_balance int default 5,
  subscription_plan text default 'free',
  trial_pdf_used boolean default false,
  updated_at timestamp default now()
);

-- Credits Log
create table credits_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text,
  amount int,
  metadata jsonb default '{}',
  created_at timestamp default now()
);

-- Orders
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  type text check (type in ('credits', 'subscription')),
  plan text,
  credits int,
  amount numeric,
  currency text default 'SAR',
  status text default 'pending'
    check (status in ('pending','under_review','approved','rejected')),
  payment_method text check (payment_method in ('paypal','bank')),
  proof_url text,
  -- ✅ v2: Idempotency fields
  paypal_capture_id text unique,
  processed boolean default false,
  created_at timestamp default now()
);

-- Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  plan text,
  status text default 'active',
  current_period_end timestamp,
  paypal_subscription_id text unique,    -- ✅ v2: لربط Webhook التجديد
  created_at timestamp default now()
);

-- ✅ v2: User Roles
create table user_roles (
  user_id uuid primary key references auth.users(id),
  role text default 'user' check (role in ('user', 'admin', 'moderator')),
  updated_at timestamp default now()
);

-- ✅ v2: Platform Events (Event-Driven Logging)
create table platform_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  type text,           -- cv_generated | pdf_downloaded | post_created | cert_issued | ...
  payload jsonb default '{}',
  created_at timestamp default now()
);

-- Feedback
create table feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  rating int check (rating between 1 and 5),
  message text,
  created_at timestamp default now()
);
```

---

### 1.3 — صفحات المصادقة

```
app/(auth)/
├── login/page.tsx
├── register/page.tsx     ← منح 5 credits + تسجيل event
├── verify/page.tsx
└── layout.tsx
```

**منطق التسجيل:**
```ts
// بعد إنشاء المستخدم:
await supabase.from('usage_credits').insert({
  user_id: user.id,
  credits_balance: 5,
  subscription_plan: 'free',
  trial_pdf_used: false
})

// Roles
await supabase.from('user_roles').insert({
  user_id: user.id,
  role: 'user'
})

// Credits Log
await supabase.from('credits_log').insert({
  user_id: user.id,
  action: 'signup_bonus',
  amount: 5,
  metadata: { source: 'registration' }
})

// ✅ v2: Event Log
await supabase.from('platform_events').insert({
  user_id: user.id,
  type: 'user_registered',
  payload: { plan: 'free', bonus_credits: 5 }
})
```

---

### 1.4 — Middleware

**`middleware.ts`**
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const supabase = createServerClient(...)

  const { data: { session } } = await supabase.auth.getSession()

  // حماية صفحات التطبيق
  const appRoutes = ['/dashboard', '/cv-builder', '/post-generator',
                     '/certificates', '/payment']

  if (appRoutes.some(r => request.nextUrl.pathname.startsWith(r))) {
    if (!session) return NextResponse.redirect('/login')
  }

  // ✅ v2: حماية Admin عبر user_roles table
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!session) return NextResponse.redirect('/login')

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single()

    if (roleData?.role !== 'admin') {
      return NextResponse.redirect('/dashboard')
    }
  }

  return NextResponse.next()
}
```

---

### 1.5 — Feature Flags System ✅ جديد v2

**`lib/features.ts`**
```ts
export const FEATURES = {
  AI_IMAGE:            process.env.ENABLE_AI_IMAGE === 'true',
  BULK_CERTIFICATES:   process.env.ENABLE_BULK_CERTIFICATES === 'true',
  JOB_ANALYSIS:        process.env.ENABLE_JOB_ANALYSIS === 'true',
  SMART_UPSELL:        process.env.ENABLE_SMART_UPSELL === 'true',
} as const

// الاستخدام:
// if (!FEATURES.AI_IMAGE) return featureDisabledResponse()
```

---

## المرحلة 2 — نظام Credits والمدفوعات

```
Phase-2/
├── 2.1-credits-engine.md
├── 2.2-feature-cost-config.md   ← جديد v2
├── 2.3-pricing-engine.md
├── 2.4-payment-page.md
├── 2.5-paypal-integration.md
├── 2.6-bank-transfer.md
├── 2.7-rate-limiting.md         ← جديد v2
└── 2.8-subscription-renewal.md  ← جديد v2
```

---

### 2.1 — Credits Engine (مُحدَّث v2)

**`lib/credits.ts`**

```ts
export async function getBalance(userId: string): Promise<number> {
  const { data } = await supabase
    .from('usage_credits')
    .select('credits_balance')
    .eq('user_id', userId)
    .single()
  return data?.credits_balance ?? 0
}

// ✅ v2: Pattern صحيح — Execute أولًا، خصم ثانيًا
// لا تخسر Credits لو الخدمة فشلت
export async function withCredits<T>(
  userId: string,
  amount: number,
  action: string,
  metadata: object,
  execute: () => Promise<T>
): Promise<T> {
  // 1. تحقق من الرصيد
  const balance = await getBalance(userId)
  if (balance < amount) {
    throw new Error('INSUFFICIENT_CREDITS')
  }

  // 2. نفّذ العملية أولًا
  const result = await execute()

  // 3. اخصم بعد النجاح فقط (DB Transaction)
  const { data } = await supabase.rpc('deduct_credits_safe', {
    p_user_id: userId,
    p_amount: amount,
    p_action: action,
    p_metadata: metadata
  })

  if (!data) throw new Error('DEDUCTION_FAILED')

  // 4. سجّل Event
  await logEvent(userId, action, { amount, ...metadata })

  return result
}

// تكلفة PDF مع منطق Trial
export function getPdfCost(trialUsed: boolean): number {
  return trialUsed ? 5 : 1
}
```

**`supabase/functions/deduct_credits_safe.sql`** (DB Function — مع Transaction):
```sql
create or replace function deduct_credits_safe(
  p_user_id uuid,
  p_amount int,
  p_action text,
  p_metadata jsonb
) returns boolean as $$
declare
  current_balance int;
begin
  -- Lock row to prevent race conditions
  select credits_balance into current_balance
  from usage_credits
  where user_id = p_user_id
  for update;

  if current_balance < p_amount then
    return false;
  end if;

  update usage_credits
  set credits_balance = credits_balance - p_amount,
      updated_at = now()
  where user_id = p_user_id;

  insert into credits_log (user_id, action, amount, metadata)
  values (p_user_id, p_action, -p_amount, p_metadata);

  return true;
end;
$$ language plpgsql;
```

---

### 2.2 — Feature Cost Config ✅ جديد v2

**`lib/feature-costs.ts`**

```ts
// Abstraction Layer — عدّل الأسعار هنا بدون لمس أي feature code
export const FEATURE_COSTS = {
  cv_generate:          10,
  cv_regenerate_section: 1,
  cv_pdf_download:       5,
  cv_pdf_trial:          1,
  post_draft:            2,
  post_ai_text:          1,
  post_ai_image_1k:      1,
  post_ai_image_2k:      2,
  certificate_single:   15,
  certificate_bulk_mid: 12,  // 10–50
  certificate_bulk_high: 8,  // 50+
} as const

export type FeatureKey = keyof typeof FEATURE_COSTS

export function getCost(feature: FeatureKey): number {
  return FEATURE_COSTS[feature]
}

// حساب تكلفة Bulk
export function getBulkCertCost(count: number): number {
  if (count <= 10) return FEATURE_COSTS.certificate_single * count
  if (count <= 50) return FEATURE_COSTS.certificate_bulk_mid * count
  return FEATURE_COSTS.certificate_bulk_high * count
}
```

---

### 2.3 — Pricing Engine

**`lib/pricing.ts`**

```ts
export const PLANS = {
  starter: { price: 49, credits: 100, name: 'Starter' },
  pro:     { price: 129, credits: 350, name: 'Pro' }
}

export const CREDIT_PACKS = [
  { credits: 15,   price: 10  },
  { credits: 80,   price: 50  },
  { credits: 175,  price: 100 },
  { credits: 450,  price: 250 },
  { credits: 1000, price: 500, highlight: true },
  { credits: 2450, price: 1000 },
]

export function getPricePerCredit(credits: number): number {
  if (credits < 15)    return 1.00
  if (credits <= 80)   return 0.63
  if (credits <= 175)  return 0.58
  if (credits <= 450)  return 0.55
  if (credits <= 1000) return 0.50
  if (credits <= 2450) return 0.42
  return 0.40
}

export function calculatePrice(credits: number): number {
  return Math.round(credits * getPricePerCredit(credits))
}

export function toUSD(sar: number): string {
  return (sar / 3.75).toFixed(2)
}

// إظهار قيمة Credits بلغة الإنجاز
export function creditValueHint(credits: number): string {
  const cvs   = Math.floor(credits / 15)
  const certs = Math.floor(credits / 15)
  const posts = Math.floor(credits / 3)
  return `≈ ${cvs} سيرة ذاتية · ${certs} شهادة · ${posts} منشور`
}
```

---

### 2.4 — Rate Limiting ✅ جديد v2

**`lib/rate-limit.ts`**

```ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export const rateLimiters = {
  cv_generate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 h'),
    prefix: 'rl:cv:generate',
  }),
  cv_download: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '1 h'),
    prefix: 'rl:cv:download',
  }),
  ai_text: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(30, '1 h'),
    prefix: 'rl:ai:text',
  }),
  certificate_generate: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 h'),
    prefix: 'rl:cert:generate',
  }),
}

// Helper لاستخدامه في كل Route
export async function checkRateLimit(
  limiter: Ratelimit,
  userId: string
) {
  const { success, remaining } = await limiter.limit(userId)
  if (!success) {
    throw new Error(`RATE_LIMIT_EXCEEDED:${remaining}`)
  }
}
```

---

### 2.5 — PayPal Integration (مُحدَّث v2 — Idempotency)

**`app/api/paypal/webhook/route.ts`**

```ts
export async function POST(req: Request) {
  const event = await req.json()

  // ✅ v2: Idempotency — منع Credits مضاعفة
  if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
    const captureId = event.resource.id

    // تحقق أن هذا الـ Capture لم يُعالَج مسبقًا
    const { data: existing } = await supabase
      .from('orders')
      .select('id, processed')
      .eq('paypal_capture_id', captureId)
      .single()

    if (!existing) return Response.json({ error: 'Order not found' }, { status: 404 })
    if (existing.processed) {
      // Webhook مكرر — تجاهل بأمان
      return Response.json({ ok: true, note: 'already_processed' })
    }

    // معالجة الطلب
    await supabase.rpc('approve_order_safe', {
      p_order_id: existing.id,
      p_capture_id: captureId
    })
  }

  // ✅ v2: Subscription Renewal Webhook
  if (event.event_type === 'BILLING.SUBSCRIPTION.RENEWED') {
    const subscriptionId = event.resource.id
    await handleSubscriptionRenewal(subscriptionId)
  }

  return Response.json({ ok: true })
}
```

**`supabase/functions/approve_order_safe.sql`**:
```sql
create or replace function approve_order_safe(
  p_order_id uuid,
  p_capture_id text
) returns void as $$
declare
  v_order orders%rowtype;
begin
  select * into v_order from orders
  where id = p_order_id
  for update;

  -- منع التكرار
  if v_order.processed then return; end if;

  -- تحديث الطلب
  update orders set
    status = 'approved',
    paypal_capture_id = p_capture_id,
    processed = true
  where id = p_order_id;

  -- إضافة Credits
  update usage_credits set
    credits_balance = credits_balance + v_order.credits,
    updated_at = now()
  where user_id = v_order.user_id;

  -- Log
  insert into credits_log (user_id, action, amount, metadata)
  values (v_order.user_id, 'order_approved', v_order.credits,
          jsonb_build_object('order_id', p_order_id));

  -- Event
  insert into platform_events (user_id, type, payload)
  values (v_order.user_id, 'payment_completed',
          jsonb_build_object('amount', v_order.amount, 'credits', v_order.credits));
end;
$$ language plpgsql;
```

---

### 2.6 — Subscription Renewal ✅ جديد v2

**`lib/subscription.ts`**

```ts
// معالجة تجديد الاشتراك (من PayPal Webhook أو Cron)
export async function handleSubscriptionRenewal(paypalSubId: string) {
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*, user_id, plan')
    .eq('paypal_subscription_id', paypalSubId)
    .single()

  if (!sub || sub.status !== 'active') return

  const planCredits = PLANS[sub.plan as keyof typeof PLANS]?.credits ?? 0

  // Reset Credits (لا تتراكم)
  await supabase
    .from('usage_credits')
    .update({
      credits_balance: planCredits,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', sub.user_id)

  // تحديث تاريخ انتهاء الاشتراك
  const nextPeriod = new Date()
  nextPeriod.setMonth(nextPeriod.getMonth() + 1)

  await supabase
    .from('subscriptions')
    .update({ current_period_end: nextPeriod.toISOString() })
    .eq('id', sub.id)

  // Event Log
  await logEvent(sub.user_id, 'subscription_renewed', {
    plan: sub.plan,
    credits_reset: planCredits
  })
}

// Cron Job بديل (يومي) — app/api/cron/renew-subscriptions/route.ts
export async function checkExpiredSubscriptions() {
  const { data: expired } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('status', 'active')
    .lt('current_period_end', new Date().toISOString())

  for (const sub of expired ?? []) {
    await handleSubscriptionRenewal(sub.paypal_subscription_id)
  }
}
```

---

### 2.7 — Storage Strategy ✅ جديد v2

**`lib/storage.ts`**

```ts
// رفع PDF إلى Supabase Storage وحفظ الرابط في DB
export async function uploadAndStorePDF(
  pdfBlob: Blob,
  userId: string,
  entityType: 'cv' | 'certificate',
  entityId: string
): Promise<string> {
  const fileName = `${entityType}/${userId}/${entityId}-${Date.now()}.pdf`

  const { error } = await supabase.storage
    .from('pdfs')
    .upload(fileName, pdfBlob, { contentType: 'application/pdf', upsert: true })

  if (error) throw new Error('STORAGE_UPLOAD_FAILED')

  const { data: { publicUrl } } = supabase.storage
    .from('pdfs')
    .getPublicUrl(fileName)

  // حفظ الرابط في DB
  await supabase
    .from(entityType === 'cv' ? 'cvs' : 'certificates')
    .update({ pdf_url: publicUrl })
    .eq('id', entityId)

  return publicUrl
}
```

**Supabase Storage Buckets:**
```sql
-- يُنشأ في Supabase Dashboard
-- Bucket: pdfs (private)
-- Bucket: certificates (private)
-- Bucket: post-images (public)
-- Bucket: cert-templates (public)
-- Bucket: proof-uploads (private) ← إيصالات البنك
```

---

### 2.8 — Event Logger ✅ جديد v2

**`lib/events.ts`**

```ts
export type EventType =
  | 'user_registered'
  | 'payment_completed'
  | 'subscription_renewed'
  | 'cv_generated'
  | 'pdf_downloaded'
  | 'post_created'
  | 'certificate_issued'
  | 'bulk_started'
  | 'bulk_completed'
  | 'credits_low'
  | 'trial_used'

export async function logEvent(
  userId: string,
  type: EventType,
  payload: object = {}
) {
  await supabase.from('platform_events').insert({
    user_id: userId,
    type,
    payload
  })
}
```

---

## المرحلة 3 — لوحة تحكم المستخدم

```
Phase-3/
├── 3.1-dashboard-layout.md
├── 3.2-wallet-api.md
├── 3.3-stats-api.md
├── 3.4-orders-table.md
├── 3.5-usage-summary.md
└── 3.6-smart-upsell.md         ← جديد v2
```

### هيكل صفحة Dashboard

```
┌─────────────────────────────────────────────────────┐
│  مرحبًا، [اسم المستخدم] 👋                           │
│  [320 Credits ≈ 21 شهادة · 10 سيرة] · [Starter]    │
│  🎁 تحميل مجاني متاح (Trial)                        │
├─────────────────────────────────────────────────────┤
│  [Usage: 1,200] [Orders: 8] [Pending: 1]            │
├─────────────────────────────────────────────────────┤
│  ⚡ إجراءات سريعة                                    │
│  [CV Builder] [Post Generator] [شهادة] [شراء]       │
├─────────────────────────────────────────────────────┤
│  ⚠️  رصيدك منخفض — [اشحن الآن]                      │
│  ⏳  طلب دفع قيد المراجعة                            │
│  🔥  لم تجرب CV Builder بعد — [جرّبه الآن]          │
├─────────────────────────────────────────────────────┤
│  📦 طلباتي (Credits | Amount | Status | Date)       │
├─────────────────────────────────────────────────────┤
│  📊 استخدامي (CV: 50 | Posts: 30 | Certs: 100)     │
├─────────────────────────────────────────────────────┤
│  💬 تقييمك يهمنا ⭐ ⭐ ⭐ ⭐ ⭐                        │
└─────────────────────────────────────────────────────┘
```

### APIs

```ts
GET /api/user/wallet
// { balance, subscription_plan, trial_pdf_used, value_hint }

GET /api/dashboard/stats
// { total_usage, total_orders, pending_orders }

GET /api/orders/user
// orders[]

GET /api/dashboard/usage
// { cv_usage, post_usage, certificate_usage }

POST /api/feedback
// { rating, message }
```

### UX Logic الذكي

```ts
// تحذير رصيد منخفض
if (balance < 20) showAlert('رصيدك منخفض', 'warning')

// تعطيل عند صفر رصيد
if (balance === 0) disableAllFeatureButtons()

// Credit Value Hint
const hint = creditValueHint(balance)  // "≈ 21 شهادة · 10 سيرة"

// Trial Badge
if (!trial_pdf_used) showBadge('🎁 تحميل PDF مجاني متاح')
```

### Smart Upsell Engine ✅ جديد v2

**`lib/upsell.ts`**

```ts
interface UpsellSuggestion {
  message: string
  cta: string
  href: string
}

export function getUpsellSuggestion(
  usage: { cv: number; post: number; cert: number },
  plan: string,
  balance: number
): UpsellSuggestion | null {

  // لو استهلك معظم credits على CV → اقترح Pro
  if (usage.cv > 80 && plan === 'free') {
    return {
      message: 'أنت تستخدم CV Builder كثيرًا 🎯 وفّر مع Pro',
      cta: 'ترقية لـ Pro — 129 SAR',
      href: '/payment?tab=subscription'
    }
  }

  // لو يستخدم Certificates كثيرًا → اقترح Bulk Pack
  if (usage.cert > 100) {
    return {
      message: 'توليد جماعي بسعر أقل — وفّر حتى 47%',
      cta: 'شراء 1000 Credits',
      href: '/payment?credits=1000'
    }
  }

  // لو لم يجرب منتجًا → حثّه
  if (usage.cv === 0) {
    return {
      message: 'لم تجرب CV Builder بعد 📄',
      cta: 'جرّبه الآن — مجانًا',
      href: '/cv-builder'
    }
  }

  // رصيد منخفض
  if (balance < 15) {
    return {
      message: `رصيدك ${balance} credits فقط`,
      cta: 'شحن 80 Credits — 50 SAR',
      href: '/payment?credits=80'
    }
  }

  return null
}
```

---

## المرحلة 4 — CV Builder

```
Phase-4/
├── 4.1-cv-schema.md
├── 4.2-templates.md
├── 4.3-rendering-engine.md
├── 4.4-ai-generate.md
├── 4.5-pdf-api.md              ← مُحدَّث: Reserve-Execute-Commit + Storage
├── 4.6-editor-ui.md
└── 4.7-job-analysis.md
```

### الملفات

```
app/(app)/cv-builder/
├── page.tsx
└── components/
    ├── CVEditor.tsx
    ├── CVPreview.tsx            ← iframe (Single Source of Truth)
    ├── TemplateSelector.tsx
    ├── FontSelector.tsx
    ├── ColorPicker.tsx
    └── JobAnalysisDashboard.tsx

lib/cv/
├── schema.ts
├── renderCV.ts
└── templates/
    ├── classic.ts
    ├── modern.ts
    └── hybrid.ts

app/api/cv/
├── generate/route.ts
├── regenerate-section/route.ts
├── download/route.ts           ← Reserve-Execute-Commit + Storage
└── analyze/route.ts
```

---

### 4.1 — CV Schema

```ts
export type CV = {
  personal: { name: string; title: string; email: string; phone: string; location: string }
  summary: string
  skills: string[]
  experience: { company: string; role: string; start: string; end: string; bullets: string[] }[]
  education: { school: string; degree: string; year: string }[]
}

export type Theme = { primary: string; text: string }
export type Font  = { family: 'Cairo' | 'Tajawal' | 'Inter' | 'Amiri'; direction: 'rtl' | 'ltr' }
```

---

### 4.2 — Rendering Engine

```ts
// lib/cv/renderCV.ts
export function renderCV(
  template: 'classic' | 'modern' | 'hybrid',
  data: CV,
  theme: Theme,
  font: Font
): string {
  // نفس HTML يذهب لـ:
  // 1. iframe Preview
  // 2. Puppeteer PDF
  // لا فرق، لا Tailwind داخله، CSS Inline فقط
}
```

**قواعد HTML الداخلي:**
```css
/* لازم يكون داخل كل template */
body { width: 210mm; min-height: 297mm; direction: rtl; word-break: break-word; }
@media print { body { margin: 0; } }
@font-face { font-family: 'Cairo'; src: url('/fonts/Cairo-Regular.ttf'); }
```

---

### 4.3 — API Generate CV

```ts
// app/api/cv/generate/route.ts
// ✅ v2: Rate Limit + Feature Cost Config

import { checkRateLimit, rateLimiters } from '@/lib/rate-limit'
import { getCost } from '@/lib/feature-costs'
import { withCredits } from '@/lib/credits'

export async function POST(req: Request) {
  const { userId } = await getAuth(req)

  // Rate Limit
  await checkRateLimit(rateLimiters.cv_generate, userId)

  const { jobDescription, userData } = await req.json()

  const cv = await withCredits(
    userId,
    getCost('cv_generate'),  // 10
    'cv_generated',
    { job_title: jobDescription.substring(0, 50) },
    async () => {
      // AI Prompt احترافي
      const prompt = `
Return ONLY valid JSON. No markdown. No explanation.
Based on: ${JSON.stringify(userData)} and job: ${jobDescription}

{
  "personal": { "name": "", "title": "", "email": "", "phone": "", "location": "" },
  "summary": "",
  "skills": [],
  "experience": [{ "company": "", "role": "", "start": "", "end": "", "bullets": [] }],
  "education": [{ "school": "", "degree": "", "year": "" }]
}

Rules:
- ATS-optimized bullets (action verbs)
- Keywords from job description
- Professional Arabic or English
- No hallucination — use only provided data`

      const response = await openrouter.chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      })

      // ✅ v2: Validation + Fallback Parser
      let cvData
      try {
        cvData = JSON.parse(response.choices[0].message.content)
      } catch {
        // محاولة تنظيف الـ response
        const cleaned = response.choices[0].message.content
          .replace(/```json|```/g, '').trim()
        cvData = JSON.parse(cleaned)
      }

      if (!cvData.personal || !cvData.experience) {
        throw new Error('INVALID_AI_RESPONSE')
      }

      return cvData
    }
  )

  // ✅ v2: Event Log
  await logEvent(userId, 'cv_generated', { template: 'ai' })

  return Response.json({ cv })
}
```

---

### 4.4 — API Download PDF (مُحدَّث v2)

```ts
// app/api/cv/download/route.ts
// ✅ v2: Reserve-Execute-Commit Pattern + Storage

import { checkRateLimit, rateLimiters } from '@/lib/rate-limit'
import { withCredits, getPdfCost } from '@/lib/credits'
import { uploadAndStorePDF } from '@/lib/storage'

export async function POST(req: Request) {
  const { userId } = await getAuth(req)

  await checkRateLimit(rateLimiters.cv_download, userId)

  const { html, cvId, trialUsed } = await req.json()
  const cost = getPdfCost(trialUsed)

  // ✅ Pattern صحيح: Execute أولًا، Commit ثانيًا
  const pdfUrl = await withCredits(
    userId,
    cost,
    'cv_pdf_download',
    { cv_id: cvId, cost, was_trial: !trialUsed },
    async () => {
      // 1. توليد PDF
      const res = await fetch(process.env.PUPPETEER_API_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html })
      })

      if (!res.ok) throw new Error('PDF_GENERATION_FAILED')

      const pdfBlob = await res.blob()

      // 2. ✅ v2: رفع وتخزين PDF
      const url = await uploadAndStorePDF(pdfBlob, userId, 'cv', cvId)

      return url
    }
  )

  // تحديث trial flag إن كانت أول مرة
  if (!trialUsed) {
    await supabase.from('usage_credits')
      .update({ trial_pdf_used: true })
      .eq('user_id', userId)
  }

  await logEvent(userId, 'pdf_downloaded', { cv_id: cvId, cost })

  return Response.json({ pdf_url: pdfUrl })
}
```

### 4.5 — تكاليف CV

| الإجراء | Credits | ملاحظة |
|---------|---------|--------|
| AI Generate CV | 10 | يُخصم بعد نجاح AI |
| Regenerate Section | 1 | يُخصم بعد نجاح AI |
| Download PDF (trial) | 1 | مرة واحدة فقط |
| Download PDF | 5 | يُخصم بعد نجاح PDF |

### 4.6 — UI Layout

```
┌──────────────────────┬─────────────────────────────┐
│ Controls (35%)       │ Live Preview (65%)           │
│                      │                              │
│ [Template]           │  ┌───────────────────────┐   │
│  classic             │  │  iframe srcDoc={html}  │   │
│  modern              │  │  A4 — 210mm × 297mm    │   │
│  hybrid              │  │  100% match PDF        │   │
│                      │  └───────────────────────┘   │
│ [Font] [Color]       │                              │
│                      │  📊 Job Match: 78%            │
│ [Job Description]    │  ✅ Strong: JavaScript, React │
│ [Generate ✨ -10cr]  │  ❌ Missing: Docker, GraphQL  │
│                      │                              │
│ [Download PDF]       │                              │
│  Cost: 5 cr          │                              │
│  Trial: 1 cr 🎁      │                              │
└──────────────────────┴─────────────────────────────┘
```

---

## المرحلة 5 — Post Generator

```
Phase-5/
├── 5.1-templates-system.md
├── 5.2-ui-layout.md
├── 5.3-ai-text-api.md
├── 5.4-ai-image-api.md          ← Feature Flag: ENABLE_AI_IMAGE
├── 5.5-export-image.md
└── 5.6-credits-integration.md
```

### الملفات

```
app/(app)/post-generator/
├── page.tsx
└── components/
    ├── PostControls.tsx
    ├── PostPreview.tsx
    ├── TemplateGrid.tsx
    └── AITextSuggestion.tsx

lib/posts/
└── templates.ts

app/api/post/
├── ai-text/route.ts
└── ai-image/route.ts            ← محمي بـ Feature Flag
```

---

### 5.1 — AI Text API (مُحدَّث v2)

```ts
// app/api/post/ai-text/route.ts
import { checkRateLimit, rateLimiters } from '@/lib/rate-limit'
import { withCredits } from '@/lib/credits'
import { getCost } from '@/lib/feature-costs'

export async function POST(req: Request) {
  const { userId } = await getAuth(req)

  await checkRateLimit(rateLimiters.ai_text, userId)

  const { type, name } = await req.json()

  const result = await withCredits(
    userId,
    getCost('post_ai_text'),  // 1
    'post_ai_text',
    { type },
    async () => {
      // ✅ v2: Soft Fail — لو AI فشل → fallback
      try {
        const response = await openrouter.chat.completions.create({
          model: 'mistralai/mistral-nemo',
          messages: [{ role: 'user', content:
            `اكتب نصًا عربيًا احترافيًا لمنشور ${type} للاسم ${name}.
             أرجع ONLY JSON: { "variations": ["نص1", "نص2"] }
             القيود: أقل من 20 كلمة، احترافي، جذاب` }]
        })
        return JSON.parse(response.choices[0].message.content)
      } catch {
        // ✅ v2: Soft Fail UX
        return {
          variations: [
            `${name} — نتمنى لكم أجمل الأوقات 🌟`,
            `مع تحيات ${name} بمناسبة هذا اليوم المميز ✨`
          ],
          is_fallback: true
        }
      }
    }
  )

  return Response.json(result)
}
```

---

### 5.2 — AI Image API (مُحدَّث v2 — Feature Flag)

```ts
// app/api/post/ai-image/route.ts
import { FEATURES } from '@/lib/features'

export async function POST(req: Request) {
  // ✅ v2: Feature Flag Check
  if (!FEATURES.AI_IMAGE) {
    return Response.json({
      error: 'FEATURE_DISABLED',
      message: 'ميزة توليد الصور قيد التطوير'
    }, { status: 503 })
  }

  // ... باقي المنطق
}
```

### 5.3 — تكاليف Post Generator

| الإجراء | Credits |
|---------|---------|
| إنشاء مسودة | 2 |
| AI نص | 1 |
| AI صورة 1K | 1 |
| AI صورة 2K | 2 |
| تصدير PNG | مجاني |

---

## المرحلة 6 — Certificate Engine

```
Phase-6/
├── 6.1-db-schema.md
├── 6.2-template-system.md
├── 6.3-certificate-builder-ui.md
├── 6.4-pdf-generation.md         ← Reserve-Execute-Commit + Storage
├── 6.5-qr-verification.md
├── 6.6-bulk-generation.md        ← BullMQ + Retry Strategy
└── 6.7-credits-integration.md
```

### قاعدة البيانات

```sql
create table certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  template_id uuid,
  recipient_name text,
  course_name text,
  issuer_name text,
  issue_date date,
  verification_code text unique default nanoid(),
  verification_hash text,
  qr_url text,
  pdf_url text,                    -- ✅ v2: URL من Supabase Storage
  status text default 'pending'
    check (status in ('pending','generated','failed')),
  batch_id uuid,
  created_at timestamp default now()
);

create table certificate_templates (
  id uuid primary key default uuid_generate_v4(),
  name text,
  html text,
  css text,
  preview_image text,
  is_active boolean default true
);

create table certificate_batches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  file_url text,
  total_count int,
  success_count int default 0,
  failed_count int default 0,       -- ✅ v2: تتبع الفشل
  status text default 'pending'
    check (status in ('pending','processing','done','partial','failed')),
  created_at timestamp default now()
);
```

---

### 6.1 — PDF Generation (مُحدَّث v2)

```ts
// app/api/certificate/generate/route.ts
// ✅ v2: Reserve-Execute-Commit + Storage

export async function POST(req: Request) {
  const { userId } = await getAuth(req)
  const { templateId, data } = await req.json()

  const cost = getCost('certificate_single')  // 15

  const certId = uuid()

  const pdfUrl = await withCredits(
    userId, cost, 'certificate_issued',
    { template_id: templateId, recipient: data.recipient_name },
    async () => {
      // 1. توليد QR
      const verificationCode = nanoid(12)
      const qrUrl = `${process.env.NEXT_PUBLIC_URL}/verify/${verificationCode}`

      // 2. بناء HTML
      const html = buildCertificateHTML(templateId, data, qrUrl)

      // 3. توليد PDF عبر Puppeteer
      const res = await fetch(process.env.PUPPETEER_API_URL!, {
        method: 'POST',
        body: JSON.stringify({ html })
      })
      if (!res.ok) throw new Error('PDF_FAILED')

      const pdfBlob = await res.blob()

      // 4. ✅ Storage
      const url = await uploadAndStorePDF(pdfBlob, userId, 'certificate', certId)

      // 5. حفظ في DB
      await supabase.from('certificates').insert({
        id: certId,
        user_id: userId,
        ...data,
        verification_code: verificationCode,
        pdf_url: url,
        status: 'generated'
      })

      return url
    }
  )

  await logEvent(userId, 'certificate_issued', { cert_id: certId })

  return Response.json({ pdf_url: pdfUrl, cert_id: certId })
}
```

---

### 6.2 — Bulk Generation (مُحدَّث v2 — Retry)

**`lib/queue/certificate.ts`**

```ts
import { Queue } from 'bullmq'

export const certificateQueue = new Queue('certificate-generation', {
  connection: { url: process.env.REDIS_URL }
})

// إضافة Job مع Retry Strategy
export async function queueCertificateJob(data: object) {
  await certificateQueue.add('generate', data, {
    attempts: 3,                    // ✅ v2: 3 محاولات
    backoff: {
      type: 'exponential',          // ✅ v2: Exponential Backoff
      delay: 2000                   // 2s → 4s → 8s
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 }
  })
}
```

**`workers/certificate-worker.ts`**

```ts
import { Worker } from 'bullmq'

const worker = new Worker('certificate-generation', async (job) => {
  const { certData, userId, batchId } = job.data

  try {
    // توليد الشهادة
    await generateSingleCertificate(certData, userId)

    // تحديث عداد النجاح
    await supabase.rpc('increment_batch_success', { p_batch_id: batchId })

  } catch (error) {
    // ✅ v2: تحديث عداد الفشل
    await supabase.rpc('increment_batch_failure', { p_batch_id: batchId })

    // إعادة رمي الخطأ ليقوم BullMQ بالـ Retry
    throw error
  }
}, {
  connection: { url: process.env.REDIS_URL },
  concurrency: 5
})

worker.on('failed', (job, err) => {
  console.error(`Certificate job failed: ${job?.id}`, err.message)
})
```

### 6.3 — تكاليف الشهادات

| العدد | Credits / شهادة |
|-------|----------------|
| 1 – 10 | 15 |
| 11 – 50 | 12 |
| 51+ | 8 |

---

## المرحلة 7 — لوحة تحكم الأدمن

```
Phase-7/
├── 7.1-admin-layout.md
├── 7.2-orders-management.md     ← approve_order_safe (Idempotent)
├── 7.3-users-management.md      ← role management
└── 7.4-analytics.md             ← platform_events
```

### الملفات

```
app/(admin)/admin/
├── layout.tsx
├── page.tsx                     ← Overview + Stats
├── orders/page.tsx              ← إدارة الطلبات
├── users/page.tsx               ← إدارة المستخدمين + Roles
└── analytics/page.tsx           ← platform_events charts
```

---

### 7.1 — Admin Orders

```ts
// POST /api/admin/orders/approve
// ✅ v2: يستخدم approve_order_safe (Idempotent)
export async function POST(req: Request) {
  const { orderId } = await req.json()

  await supabase.rpc('approve_order_safe', {
    p_order_id: orderId,
    p_capture_id: `admin_manual_${orderId}`  // unique capture ID للـ manual approval
  })

  return Response.json({ ok: true })
}
```

### 7.2 — User Roles Management

```ts
// POST /api/admin/users/role
export async function POST(req: Request) {
  const { targetUserId, role } = await req.json()

  // ✅ v2: تحديث roles من user_roles table
  await supabase
    .from('user_roles')
    .upsert({ user_id: targetUserId, role })

  return Response.json({ ok: true })
}
```

### 7.3 — Analytics (من platform_events)

```ts
// GET /api/admin/analytics
// يقرأ من platform_events للتحليلات

// Queries مفيدة:
// - أكثر features استخداماً
// - معدل تحويل Trial → Paid
// - وقت ذروة الاستخدام
// - users قريبون من upgrade

const { data: topEvents } = await supabase
  .from('platform_events')
  .select('type, count(*)')
  .gte('created_at', lastMonth)
  .group('type')
  .order('count', { ascending: false })
```

---

## المرحلة 8 — التحسينات والإطلاق

```
Phase-8/
├── 8.1-performance.md
├── 8.2-seo.md
├── 8.3-anti-abuse.md
├── 8.4-error-handling.md        ← جديد v2
└── 8.5-launch-checklist.md
```

### 8.1 — Performance

```ts
// CV Builder
const debouncedRender = useMemo(
  () => debounce((data) => setHTML(renderCV(template, data, theme, font)), 300),
  [template, theme, font]
)

// Post Generator
const memoizedPreview = useMemo(() => renderPost(template, content), [template, content])
```

### 8.2 — Anti-Abuse

```ts
// 3 طبقات حماية:

// 1. Frontend (UX فقط)
if (balance < cost) disableButton()

// 2. API Guard
await checkRateLimit(rateLimiter, userId)
if (balance < cost) return insufficientCreditsError()

// 3. DB Transaction (الأهم)
// → deduct_credits_safe بـ FOR UPDATE lock

// Anti Trial Abuse
// - Email Verification قبل Credits
// - trial_pdf_used flag مستقل في DB
// - لا يمكن reset بأي طريقة
```

### 8.3 — Unified Error Handling ✅ جديد v2

**`lib/errors.ts`**

```ts
export const ERRORS = {
  INSUFFICIENT_CREDITS: { code: 'INSUFFICIENT_CREDITS', status: 402 },
  RATE_LIMIT_EXCEEDED:  { code: 'RATE_LIMIT_EXCEEDED',  status: 429 },
  PDF_FAILED:           { code: 'PDF_FAILED',           status: 503 },
  INVALID_AI_RESPONSE:  { code: 'INVALID_AI_RESPONSE',  status: 500 },
  FEATURE_DISABLED:     { code: 'FEATURE_DISABLED',     status: 503 },
  UNAUTHORIZED:         { code: 'UNAUTHORIZED',          status: 401 },
} as const

export function errorResponse(key: keyof typeof ERRORS, extra?: object) {
  const err = ERRORS[key]
  return Response.json({ error: err.code, ...extra }, { status: err.status })
}

// مثال:
// return errorResponse('INSUFFICIENT_CREDITS', { required: 5, balance: 2 })
```

**Frontend Soft Fail:**
```ts
// في كل feature — لو AI فشل لا تُوقف المستخدم
try {
  const result = await callAI()
  return result
} catch {
  // ✅ Soft Fail: Template افتراضي
  showToast('تعذّر الاتصال بالذكاء الاصطناعي — يمكنك التحرير يدويًا', 'warning')
  return getDefaultTemplate()
}
```

### 8.4 — Launch Checklist

**Critical (قبل الإطلاق):**
- [ ] Email Verification مفعّل في Supabase
- [ ] `deduct_credits_safe` DB Function مختبرة
- [ ] `approve_order_safe` Idempotency مختبرة
- [ ] PayPal Webhook يعمل في Production
- [ ] Puppeteer API يعمل على Railway
- [ ] Redis/BullMQ للـ Bulk جاهز
- [ ] Supabase Storage Buckets مُنشأة
- [ ] Rate Limiting مفعّل (Upstash)
- [ ] Admin Role في `user_roles` مُعيَّن
- [ ] الخطوط مُضمَّنة في HTML للـ PDF
- [ ] HTTPS + Domain مُعدّ

**Pre-Launch Tests (اختبر هذه السيناريوهات):**
- [ ] User عنده 1 credit + trial unused → يُسمح (cost = 1)
- [ ] User عنده 4 credits + trial used → يُحجب (cost = 5)
- [ ] 5 طلبات تحميل متزامنة → 1 ينجح فقط
- [ ] PayPal Webhook ينضرب مرتين → Credits تُضاف مرة واحدة
- [ ] Puppeteer يفشل → Credits لا تُخصم
- [ ] AI يرجع JSON خربان → Fallback يعمل
- [ ] Bulk 100 شهادة + فشل 5 منها → Retry يعمل

---

## هيكل الملفات الكامل

```
cvsira/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── components/
│   │       ├── Hero.tsx
│   │       ├── FeaturesGrid.tsx
│   │       ├── HowItWorks.tsx
│   │       ├── PricingSection.tsx
│   │       ├── Testimonials.tsx
│   │       ├── FAQ.tsx
│   │       └── Footer.tsx
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx
│   │
│   ├── (app)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── payment/page.tsx
│   │   ├── cv-builder/page.tsx
│   │   ├── post-generator/page.tsx
│   │   └── certificates/page.tsx
│   │
│   ├── (admin)/
│   │   └── admin/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── orders/page.tsx
│   │       ├── users/page.tsx
│   │       └── analytics/page.tsx
│   │
│   ├── (public)/
│   │   └── verify/[code]/page.tsx
│   │
│   └── api/
│       ├── user/wallet/route.ts
│       ├── dashboard/
│       │   ├── stats/route.ts
│       │   └── usage/route.ts
│       ├── credits/deduct/route.ts
│       ├── orders/
│       │   ├── create/route.ts
│       │   └── user/route.ts
│       ├── paypal/
│       │   ├── create-order/route.ts
│       │   └── webhook/route.ts          ← Idempotency
│       ├── bank/upload-proof/route.ts
│       ├── cv/
│       │   ├── generate/route.ts         ← Rate Limit + withCredits
│       │   ├── regenerate-section/route.ts
│       │   ├── download/route.ts         ← Reserve-Execute-Commit + Storage
│       │   └── analyze/route.ts
│       ├── post/
│       │   ├── ai-text/route.ts          ← Soft Fail
│       │   └── ai-image/route.ts         ← Feature Flag
│       ├── certificate/
│       │   ├── generate/route.ts         ← Reserve-Execute-Commit + Storage
│       │   └── bulk/route.ts             ← BullMQ Queue
│       ├── admin/
│       │   ├── orders/route.ts
│       │   ├── users/route.ts
│       │   └── analytics/route.ts
│       ├── cron/
│       │   └── renew-subscriptions/route.ts  ← v2: Subscription Renewal
│       └── feedback/route.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   ├── credits.ts              ← withCredits + Reserve-Execute-Commit
│   ├── feature-costs.ts        ← v2: Centralized Cost Config
│   ├── pricing.ts
│   ├── features.ts             ← v2: Feature Flags
│   ├── events.ts               ← v2: Event Logger
│   ├── errors.ts               ← v2: Unified Error Handling
│   ├── rate-limit.ts           ← v2: Upstash Rate Limiting
│   ├── storage.ts              ← v2: PDF Storage
│   ├── upsell.ts               ← v2: Smart Upsell Engine
│   ├── subscription.ts         ← v2: Renewal Logic
│   ├── cv/
│   │   ├── schema.ts
│   │   ├── renderCV.ts
│   │   └── templates/
│   │       ├── classic.ts
│   │       ├── modern.ts
│   │       └── hybrid.ts
│   └── posts/
│       └── templates.ts
│
├── components/
│   ├── ui/
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── CreditsBadge.tsx
│   ├── UpsellBanner.tsx        ← v2
│   └── LoadingSpinner.tsx
│
├── workers/
│   └── certificate-worker.ts   ← v2: BullMQ + Retry
│
├── public/
│   └── fonts/
│       ├── Cairo-Regular.ttf
│       ├── Tajawal-Regular.ttf
│       └── Amiri-Regular.ttf
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_certificates.sql
│   │   ├── 003_functions.sql             ← deduct_credits_safe
│   │   ├── 004_approve_order_safe.sql    ← v2: Idempotency
│   │   ├── 005_platform_events.sql       ← v2: Event Logging
│   │   └── 006_user_roles.sql            ← v2: Roles
│   └── seed.sql
│
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
└── .env.local
```

---

## قاعدة البيانات الكاملة

```sql
-- =============================================
-- CvSira — Complete DB Schema v2
-- =============================================

-- 1. Wallet & Credits
create table usage_credits (
  user_id uuid primary key references auth.users(id),
  credits_balance int default 5,
  subscription_plan text default 'free',
  trial_pdf_used boolean default false,
  updated_at timestamp default now()
);

-- 2. Credits Log
create table credits_log (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  action text,
  amount int,
  metadata jsonb default '{}',
  created_at timestamp default now()
);

-- 3. Orders (مع Idempotency)
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  type text check (type in ('credits', 'subscription')),
  plan text,
  credits int,
  amount numeric,
  currency text default 'SAR',
  status text default 'pending'
    check (status in ('pending','under_review','approved','rejected')),
  payment_method text check (payment_method in ('paypal','bank')),
  proof_url text,
  paypal_capture_id text unique,    -- Idempotency
  processed boolean default false,  -- Idempotency
  created_at timestamp default now()
);

-- 4. Subscriptions
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  plan text,
  status text default 'active',
  current_period_end timestamp,
  paypal_subscription_id text unique,  -- لربط Webhook
  created_at timestamp default now()
);

-- 5. User Roles
create table user_roles (
  user_id uuid primary key references auth.users(id),
  role text default 'user' check (role in ('user','admin','moderator')),
  updated_at timestamp default now()
);

-- 6. Platform Events (Event-Driven Analytics)
create table platform_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  type text,
  payload jsonb default '{}',
  created_at timestamp default now()
);
create index idx_events_user on platform_events(user_id);
create index idx_events_type on platform_events(type);

-- 7. CVs
create table cvs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  data jsonb,
  template text,
  theme jsonb,
  font jsonb,
  pdf_url text,                      -- Supabase Storage
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- 8. Post Drafts
create table drafts (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  template_id text,
  content jsonb,
  image_url text,
  created_at timestamp default now()
);

-- 9. Certificates
create table certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  template_id uuid,
  recipient_name text,
  course_name text,
  issuer_name text,
  issue_date date,
  verification_code text unique,
  verification_hash text,
  qr_url text,
  pdf_url text,                      -- Supabase Storage
  status text default 'pending'
    check (status in ('pending','generated','failed')),
  batch_id uuid,
  created_at timestamp default now()
);

-- 10. Certificate Templates
create table certificate_templates (
  id uuid primary key default uuid_generate_v4(),
  name text,
  html text,
  css text,
  preview_image text,
  is_active boolean default true,
  created_at timestamp default now()
);

-- 11. Certificate Batches (مع failed_count)
create table certificate_batches (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  file_url text,
  total_count int,
  success_count int default 0,
  failed_count int default 0,        -- v2: تتبع الفشل
  status text default 'pending'
    check (status in ('pending','processing','done','partial','failed')),
  created_at timestamp default now()
);

-- 12. Certificate Events
create table certificate_events (
  id uuid primary key default uuid_generate_v4(),
  certificate_id uuid references certificates(id),
  event_type text check (event_type in ('view','download')),
  ip_address text,
  created_at timestamp default now()
);

-- 13. Feedback
create table feedback (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id),
  rating int check (rating between 1 and 5),
  message text,
  created_at timestamp default now()
);

-- =============================================
-- DB Functions
-- =============================================

-- deduct_credits_safe (Race Condition Safe)
create or replace function deduct_credits_safe(
  p_user_id uuid, p_amount int, p_action text, p_metadata jsonb
) returns boolean as $$
declare current_balance int;
begin
  select credits_balance into current_balance
  from usage_credits where user_id = p_user_id for update;
  if current_balance < p_amount then return false; end if;
  update usage_credits set credits_balance = credits_balance - p_amount,
    updated_at = now() where user_id = p_user_id;
  insert into credits_log (user_id, action, amount, metadata)
  values (p_user_id, p_action, -p_amount, p_metadata);
  return true;
end;
$$ language plpgsql;

-- approve_order_safe (Idempotent)
create or replace function approve_order_safe(
  p_order_id uuid, p_capture_id text
) returns void as $$
declare v_order orders%rowtype;
begin
  select * into v_order from orders where id = p_order_id for update;
  if v_order.processed then return; end if;
  update orders set status = 'approved', paypal_capture_id = p_capture_id,
    processed = true where id = p_order_id;
  update usage_credits set credits_balance = credits_balance + v_order.credits,
    updated_at = now() where user_id = v_order.user_id;
  insert into credits_log (user_id, action, amount, metadata)
  values (v_order.user_id, 'order_approved', v_order.credits,
          jsonb_build_object('order_id', p_order_id));
end;
$$ language plpgsql;

-- Batch Counters
create or replace function increment_batch_success(p_batch_id uuid)
returns void as $$
begin
  update certificate_batches set success_count = success_count + 1 where id = p_batch_id;
  -- تحقق إن اكتمل
  update certificate_batches set status = 'done'
  where id = p_batch_id
    and success_count + failed_count >= total_count;
end;
$$ language plpgsql;

create or replace function increment_batch_failure(p_batch_id uuid)
returns void as $$
begin
  update certificate_batches set failed_count = failed_count + 1 where id = p_batch_id;
  update certificate_batches set status = 'partial'
  where id = p_batch_id
    and success_count + failed_count >= total_count
    and failed_count > 0;
end;
$$ language plpgsql;
```

---

## سجل التغييرات v2

| التغيير | النوع | السبب |
|---------|-------|-------|
| `paypal_capture_id` + `processed` في orders | 🔴 حرجة | منع Credits مضاعفة من Webhooks |
| `withCredits` — Execute قبل Deduct | 🔴 حرجة | منع خسارة Credits عند فشل الخدمة |
| `approve_order_safe` DB Function | 🔴 حرجة | Idempotent Order Approval |
| `user_roles` Table | 🔴 حرجة | Admin Protection حقيقية |
| Rate Limiting عبر Upstash | 🟡 مهمة | منع Abuse وحماية API |
| `uploadAndStorePDF` → Supabase Storage | 🟡 مهمة | إمكانية إعادة التحميل |
| `FEATURE_COSTS` Config | 🟡 مهمة | تعديل الأسعار بدون كسر الكود |
| BullMQ Retry (attempts: 3, exponential) | 🟡 مهمة | استقرار Bulk Certificates |
| `handleSubscriptionRenewal` + Cron | 🟡 مهمة | تجديد Subscriptions تلقائيًا |
| `platform_events` Table | 🟢 تحسين | Analytics حقيقية |
| `FEATURES` Feature Flags | 🟢 تحسين | إطلاق تدريجي |
| `getUpsellSuggestion` Engine | 🟢 تحسين | رفع معدل الإيرادات |
| Soft Fail UX في AI | 🟢 تحسين | تجربة مستخدم أفضل |
| `errorResponse` Unified Errors | 🟢 تحسين | Debugging أسهل |

---

## ملخص المراحل والأولويات

| المرحلة | المحتوى | الأولوية |
|---------|---------|---------|
| 1 | البنية التحتية + Auth + DB + Roles | 🔴 حرجة |
| 2 | Credits Engine + Payment + Idempotency + Rate Limit | 🔴 حرجة |
| Landing | صفحة الهبوط | 🔴 حرجة (مع M1) |
| 3 | Dashboard + Smart Upsell | 🟡 عالية |
| 4 | CV Builder — الميزة الرئيسية | 🔴 حرجة |
| 5 | Post Generator | 🟡 عالية |
| 6 | Certificate Engine + Bulk + Retry | 🟡 عالية |
| 7 | Admin Dashboard + Analytics | 🟢 متوسطة |
| 8 | Performance + Anti-Abuse + Checklist | 🟢 متوسطة |

---

> **ترتيب التنفيذ المقترح:**
> `M1` → `M2` → `Landing` → `M4` → `M3` → `M5` → `M6` → `M7` → `M8`

---

*CvSira — صُنع في السعودية 🇸🇦 · v2*
