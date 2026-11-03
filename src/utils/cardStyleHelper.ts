import { DesignSettings } from '../types/invitation';
import { AVAILABLE_FONTS, PRESET_BACKGROUNDS, getDefaultDesign } from './defaultDesign';
import { getThemeById } from './themes';

export interface ComputedCardStyles {
  containerStyle: React.CSSProperties;
  overlayStyle: React.CSSProperties;
  cardPaperStyle: React.CSSProperties;
  fontFamilyStyle: string;
  isUrdu: boolean;
  textAlignmentClass: string;
  textColorStyle: string;
  accentColorStyle: string;
  textShadowStyle: string | undefined;
  textOutlineStyle: string | undefined;
  photoTransformStyle: React.CSSProperties;
  fontSizeScaleClass: string;
  borderColorStyle: string;
  cardBgColorStyle: string;
}

export const computeCardStyles = (
  design?: DesignSettings,
  category: 'hindu_wedding' | 'muslim_wedding' | 'birthday' = 'hindu_wedding',
  themeId?: string,
  formFontFamily?: string
): ComputedCardStyles => {
  const d = design || getDefaultDesign(category);
  const theme = getThemeById(themeId);

  // 1. Font resolution (prioritize formFontFamily, or theme font, or design typography font)
  let fontKey = formFontFamily || theme.fontFamily || d.typography.fontFamily;
  if (fontKey === 'royal') fontKey = 'rozha';
  if (fontKey === 'classic') fontKey = 'yatra';
  if (fontKey === 'serif') fontKey = 'noto_serif';

  const fontMeta = AVAILABLE_FONTS.find((f) => f.id === fontKey || f.family.toLowerCase().includes(fontKey.toLowerCase())) || AVAILABLE_FONTS[0];
  const fontFamilyStyle = fontMeta.family;
  const isUrdu = fontMeta.type === 'urdu';

  // 2. Alignment class
  let textAlignmentClass = 'text-center';
  if (d.typography.textAlignment === 'left') textAlignmentClass = 'text-left';
  if (d.typography.textAlignment === 'right') textAlignmentClass = 'text-right';

  // 3. Text & Accent & Border & Bg colors (Theme vs Custom Design)
  const textColorStyle = d.typography.textColor && d.typography.textColor !== '#3d0c15' && d.typography.textColor !== '#382e1c' 
    ? d.typography.textColor 
    : theme.textColor;
    
  const accentColorStyle = d.typography.accentColor && d.typography.accentColor !== '#d4af37' 
    ? d.typography.accentColor 
    : theme.accentColor;

  const borderColorStyle = theme.borderColor || '#d4af37';
  const cardBgColorStyle = theme.cardBgColor || theme.plainColor || '#fffaf0';

  // 4. Text Shadow & Outline
  const textShadowStyle = d.typography.textShadow
    ? '0 2px 10px rgba(0,0,0,0.4), 0 0 15px rgba(212,175,55,0.4)'
    : undefined;

  const textOutlineStyle = d.typography.textOutline
    ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.8))'
    : undefined;

  // 5. Font size scale
  let fontSizeScaleClass = 'text-xs';
  if (d.typography.fontSizeScale === 'sm') fontSizeScaleClass = 'text-[11px]';
  if (d.typography.fontSizeScale === 'lg') fontSizeScaleClass = 'text-sm';
  if (d.typography.fontSizeScale === 'xl') fontSizeScaleClass = 'text-base';

  // 6. Photo transform
  const pt = d.photoTransform || { zoom: 1, panX: 0, panY: 0, rotation: 0, fitMode: 'cover', brightness: 100, contrast: 100 };
  const photoTransformStyle: React.CSSProperties = {
    transform: `scale(${pt.zoom}) translate(${pt.panX}%, ${pt.panY}%) rotate(${pt.rotation}deg)`,
    transformOrigin: 'center center',
    objectFit: pt.fitMode,
    filter: `brightness(${pt.brightness}%) contrast(${pt.contrast}%)`,
    transition: 'transform 0.15s ease-out'
  };

  // 7. Background resolution
  const bgType = d.background.bgType;
  let bgImageUrl: string | undefined;
  let bgSolidColor = d.background.plainColor || cardBgColorStyle;

  if (bgType === 'custom_image' && d.background.customBgUrl) {
    bgImageUrl = d.background.customBgUrl;
  } else if (bgType && bgType !== 'plain_color') {
    const preset = PRESET_BACKGROUNDS.find((b) => b.id === bgType);
    if (preset?.imageUrl) {
      bgImageUrl = preset.imageUrl;
    }
  }

  const containerStyle: React.CSSProperties = {
    fontFamily: fontFamilyStyle,
    color: textColorStyle,
    backgroundColor: bgType === 'plain_color' || !bgImageUrl ? bgSolidColor : undefined,
    backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    direction: isUrdu ? 'rtl' : 'ltr'
  };

  const overlayOpacity = (d.background.overlayOpacity ?? 85) / 100;

  const overlayStyle: React.CSSProperties = {
    backgroundColor: bgType === 'blackboard' || bgType === 'chalkboard'
      ? `rgba(15, 23, 42, ${overlayOpacity})`
      : `rgba(255, 253, 249, ${overlayOpacity})`
  };

  const cardPaperStyle: React.CSSProperties = {
    fontFamily: fontFamilyStyle,
    color: bgType === 'blackboard' || bgType === 'chalkboard' ? '#f8fafc' : textColorStyle,
    backgroundColor: bgType === 'blackboard'
      ? '#1e293b'
      : bgType === 'chalkboard'
      ? '#064e3b'
      : bgSolidColor,
    borderColor: borderColorStyle
  };

  return {
    containerStyle,
    overlayStyle,
    cardPaperStyle,
    fontFamilyStyle,
    isUrdu,
    textAlignmentClass,
    textColorStyle,
    accentColorStyle,
    textShadowStyle,
    textOutlineStyle,
    photoTransformStyle,
    fontSizeScaleClass,
    borderColorStyle,
    cardBgColorStyle
  };
};
