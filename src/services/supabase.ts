export type Meme = {
    url: string;
    created_at: string;
    type: 'image' | 'video';
};

const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_KEY = 'YOUR_SUPABASE_KEY';
const BUCKET = 'memes';

export async function uploadMeme(file: File, onProgress: (p:number)=>void): Promise<string> {
    const filePath = `${Date.now()}_${file.name}`;
    const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`;

    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'x-upsert': 'true'
        },
        body: file
    });
    if(!resp.ok) throw new Error('Upload failed');
    return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;
}

export async function listMemes(): Promise<Meme[]> {
    const url = `${SUPABASE_URL}/storage/v1/object/list/${BUCKET}`;
    const resp = await fetch(url, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    if(!resp.ok) throw new Error('Error listing');
    const data = await resp.json();
    return data.map((item: any)=>({
        url: `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${item.name}`,
        created_at: item.created_at,
        type: item.metadata.mimetype.startsWith('video') ? 'video':'image'
    }));
}
