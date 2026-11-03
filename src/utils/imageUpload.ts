/**
 * Image upload and storage utility
 * Supports reading local images as Base64 Data URLs and uploading Base64 images
 * to Supabase Storage ('invitation-images' bucket) to keep invitation share links small and fast.
 */

const SUPABASE_URL = 'https://jeizmcesexdrbzimfzeu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_EQRXdzhaWVwO61jkymHM_g_sGinm7i6';
const IMAGE_BUCKET_NAME = 'invitation-images';
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB per photo

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

/**
 * Reads an image File from the local device/phone gallery as a Base64 Data URL.
 */
export const readImageFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('कृपया केवल एक वैध फ़ोटो चुनें (jpg, png, webp)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('फ़ोटो पढ़ने में विफल'));
      }
    };
    reader.onerror = () => reject(new Error('फ़ाइल लोड करने में त्रुटि'));
    reader.readAsDataURL(file);
  });
};

/**
 * Uploads a Base64 Data URL image to Supabase Storage ('invitation-images' bucket).
 * Replaces heavy Base64 strings with lightweight public HTTPS CDN URLs for share links.
 */
export async function uploadBase64ImageToSupabase(
  dataUrl: string,
  folder: string = 'uploads'
): Promise<string> {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('अमान्य इमेज डेटा');
  }

  // If already an HTTP/HTTPS URL (e.g. Unsplash or Supabase), return directly without uploading
  if (dataUrl.startsWith('http://') || dataUrl.startsWith('https://')) {
    return dataUrl;
  }

  if (!dataUrl.startsWith('data:image/')) {
    throw new Error('केवल वैध Base64 इमेज (JPEG, PNG, WebP) स्वीकार्य है');
  }

  let blob: Blob;
  try {
    const res = await fetch(dataUrl);
    blob = await res.blob();
  } catch {
    throw new Error('इमेज डेटा प्रोसेस करने में विफल');
  }

  if (blob.size === 0) {
    throw new Error('इमेज फ़ाइल खाली है');
  }

  if (blob.size > MAX_IMAGE_SIZE) {
    throw new Error('इमेज का आकार 5 MB से कम होना चाहिए');
  }

  const mimeType = blob.type.toLowerCase();
  const ext = ALLOWED_IMAGE_TYPES[mimeType] || 'jpg';

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, '') || 'uploads';
  const uniqueName = `img_${Date.now()}_${crypto.randomUUID().replace(/-/g, '').slice(0, 8)}.${ext}`;
  const objectPath = `${safeFolder}/${uniqueName}`;

  const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${IMAGE_BUCKET_NAME}/${objectPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

  let response: Response;
  try {
    response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,
        'Content-Type': mimeType,
        'x-upsert': 'false'
      },
      body: blob
    });
  } catch {
    throw new Error('Supabase Storage से कनेक्शन नहीं हो सका। कृपया इंटरनेट जाँचें।');
  }

  if (!response.ok) {
    let details = '';
    try {
      const errorData = await response.json();
      details = errorData.message || errorData.error || errorData.msg || '';
    } catch {
      details = await response.text().catch(() => '');
    }
    throw new Error(
      `फ़ोटो अपलोड नहीं हो सकी (${response.status})। ${details || 'Supabase Storage Policy जाँचें।'}`
    );
  }

  const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${IMAGE_BUCKET_NAME}/${objectPath
    .split('/')
    .map(encodeURIComponent)
    .join('/')}`;

  return publicUrl;
}
