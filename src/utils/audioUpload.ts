
const SUPABASE_URL = 'https://jeizmcesexdrbzimfzeu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_EQRXdzhaWVwO61jkymHM_g_sGinm7i6';

const BUCKET_NAME = 'invitation-music';
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

const ALLOWED_TYPES: Record<string, string> = {
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  m4a: 'audio/mp4',
  ogg: 'audio/ogg',
  aac: 'audio/aac',
  mp4: 'audio/mp4',
  webm: 'audio/webm',
};

export interface AudioUploadResult {
  audioUrl: string;
  isStoredPermanently: boolean;
  fileSizeBytes: number;
}

export function formatAudioFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 Bytes';

  if (bytes < 1024) return `${bytes} Bytes`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export async function readAudioFile(
  file: File
): Promise<AudioUploadResult> {
  if (!file) {
    throw new Error('कृपया ऑडियो फाइल चुनें।');
  }

  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const contentType = ALLOWED_TYPES[extension];

  if (!contentType) {
    throw new Error(
      'केवल MP3, WAV, M4A, OGG, AAC, MP4 और WEBM फाइल स्वीकार हैं।'
    );
  }

  if (file.size === 0) {
    throw new Error('चुनी गई ऑडियो फाइल खाली है।');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('ऑडियो फाइल 20 MB से छोटी होनी चाहिए।');
  }

  const safeExtension = extension.replace(/[^a-z0-9]/g, '');
  const uniqueName =
    `${Date.now()}-${crypto.randomUUID()}.${safeExtension}`;

  const objectPath = `uploads/${uniqueName}`;

  const uploadUrl =
    `${SUPABASE_URL}/storage/v1/object/` +
    `${BUCKET_NAME}/${objectPath
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
        'Content-Type': contentType,
        'x-upsert': 'false',
      },
      body: file,
    });
  } catch {
    throw new Error(
      'Supabase से कनेक्शन नहीं हो पाया। इंटरनेट जाँचकर दोबारा कोशिश करें।'
    );
  }

  if (!response.ok) {
    let details = '';

    try {
      const errorData = await response.json();
      details =
        errorData.message ||
        errorData.error ||
        errorData.msg ||
        '';
    } catch {
      details = await response.text().catch(() => '');
    }

    throw new Error(
      `ऑडियो अपलोड नहीं हुआ (${response.status})। ` +
      (details || 'Supabase Storage की Policy और MIME सेटिंग जाँचें।')
    );
  }

  const publicUrl =
    `${SUPABASE_URL}/storage/v1/object/public/` +
    `${BUCKET_NAME}/${objectPath
      .split('/')
      .map(encodeURIComponent)
      .join('/')}`;

  return {
    audioUrl: publicUrl,
    isStoredPermanently: true,
    fileSizeBytes: file.size,
  };
}
