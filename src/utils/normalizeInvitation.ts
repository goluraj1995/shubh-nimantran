import { AnyInvitationData } from '../types/invitation';

export const computeCardTitle = (data: any): string => {
  if (!data || typeof data !== 'object') return 'शुभ निमंत्रण';
  const category = data.category || 'hindu_wedding';

  if (category === 'hindu_wedding') {
    const groom = data.groomName ? String(data.groomName).trim() : '';
    const bride = data.brideName ? String(data.brideName).trim() : '';
    if (groom && bride) return `${groom} संग ${bride} का शुभ विवाह`;
    if (groom) return `${groom} का शुभ विवाह`;
    if (bride) return `${bride} का शुभ विवाह`;
  } else if (category === 'muslim_wedding') {
    const groom = data.groomName ? String(data.groomName).trim() : '';
    const bride = data.brideName ? String(data.brideName).trim() : '';
    if (groom && bride) return `${groom} संग ${bride} - दावत-ए-निकाह`;
    if (groom) return `${groom} का निकाह`;
    if (bride) return `${bride} का निकाह`;
  } else if (category === 'birthday') {
    const name = data.celebrantName ? String(data.celebrantName).trim() : '';
    if (name) return `${name} का जन्मदिन`;
  }

  return (data.title && data.title !== 'चि. कबीर एवं आयु. आर्या का शुभ विवाह')
    ? data.title
    : 'शुभ निमंत्रण';
};

export const normalizeInvitation = (data: any): AnyInvitationData | null => {
  if (!data || typeof data !== 'object') return null;

  // Ensure category and basic fields have safe fallbacks
  const category = data.category || 'hindu_wedding';
  const id = data.id || 'card_' + Math.random().toString(36).substring(2, 9);
  const computedTitle = computeCardTitle(data);
  const title = (data.title && data.title !== 'चि. कबीर एवं आयु. आर्या का शुभ विवाह' && !data.groomName)
    ? data.title
    : computedTitle;
  const updatedAt = data.updatedAt || new Date().toISOString();

  // Normalize arrays safely
  const safeCeremonies = Array.isArray(data.ceremonies)
    ? data.ceremonies.map((c: any) => ({
        id: c?.id || Math.random().toString(36).substring(2, 9),
        name: c?.name || '',
        date: c?.date || '',
        time: c?.time || '',
        location: c?.location || '',
        description: c?.description || '',
        enabled: c?.enabled !== false
      }))
    : [];

  const safeEvents = Array.isArray(data.events)
    ? data.events.map((e: any) => ({
        id: e?.id || Math.random().toString(36).substring(2, 9),
        name: e?.name || '',
        date: e?.date || '',
        time: e?.time || '',
        location: e?.location || '',
        description: e?.description || '',
        enabled: e?.enabled !== false
      }))
    : [];

  const safeActivities = Array.isArray(data.activities)
    ? data.activities.map((a: any) => ({
        id: a?.id || Math.random().toString(36).substring(2, 9),
        title: a?.title || '',
        time: a?.time || '',
        description: a?.description || '',
        enabled: a?.enabled !== false
      }))
    : [];

  const safePhotos = Array.isArray(data.photos) ? data.photos : [];
  const safeBlessings = Array.isArray(data.blessings) ? data.blessings : [];

  const personalGuestName = data.personalGuestName ? String(data.personalGuestName).trim() : undefined;

  // Merge with original data to preserve all properties while ensuring arrays are safe
  const normalized: any = {
    ...data,
    personalGuestName,
    category,
    id,
    title,
    updatedAt,
    ceremonies: safeCeremonies,
    events: safeEvents,
    activities: safeActivities,
    photos: safePhotos,
    blessings: safeBlessings
  };

  return normalized as AnyInvitationData;
};
