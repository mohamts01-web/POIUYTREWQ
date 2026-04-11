import { createClient } from '@/lib/supabase/server';

export async function uploadAndStorePDF(
    pdfBlob: Blob,
    userId: string,
    entityType: 'cv' | 'certificate',
    entityId: string
): Promise<string> {
    const supabase = await createClient();
    const fileName = `${entityType}/${userId}/${entityId}-${Date.now()}.pdf`;

    const { error } = await supabase.storage
        .from(entityType === 'cv' ? 'pdfs' : 'certificates')
        .upload(fileName, pdfBlob, { contentType: 'application/pdf', upsert: true });

    if (error) {
        console.error('Storage upload failed', error);
        throw new Error('STORAGE_UPLOAD_FAILED');
    }

    const { data: { publicUrl } } = supabase.storage
        .from(entityType === 'cv' ? 'pdfs' : 'certificates')
        .getPublicUrl(fileName);

    return publicUrl;
}
