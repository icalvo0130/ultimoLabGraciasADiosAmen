import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'SUPABASE_URL';
const supabaseKey: string = 'SUPABASE_KEY';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export async function uploadFile(file: File): Promise<string> {
    const uniqueName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('memes').upload(uniqueName, file);
    if (error) throw error;

    const { data } = supabase.storage.from('memes').getPublicUrl(uniqueName);
    if (!data.publicUrl) throw new Error('Failed to obtain public URL');
    return data.publicUrl;
}

export async function getFiles(): Promise<{ url: string }[]> {
    const { data, error } = await supabase.storage.from('memes').list();
    if (error) throw error;
    const files = data ?? [];
    return files
        .map(({ name }) => {
            const { data } = supabase.storage.from('memes').getPublicUrl(name);
            return data.publicUrl ? { url: data.publicUrl } : null;
        })
        .filter((f): f is { url: string } => f !== null);
}