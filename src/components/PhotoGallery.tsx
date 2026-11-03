import React, { useState } from 'react';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight, Heart } from 'lucide-react';

export interface GalleryPhotoItem {
  id: string;
  url: string;
  caption: string;
  category?: string;
}

interface PhotoGalleryProps {
  photos: GalleryPhotoItem[];
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'सभी तस्वीरें' },
    { id: 'couple', label: 'वर एवं वधू' },
    { id: 'rituals', label: 'शुभ रस्में' },
    { id: 'family', label: 'सपरिवार' }
  ];

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter((p) => p.category === selectedCategory);

  const openLightbox = (index: number) => {
    setActivePhotoIdx(index);
  };

  const closeLightbox = () => {
    setActivePhotoIdx(null);
  };

  const nextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((activePhotoIdx + 1) % filteredPhotos.length);
    }
  };

  const prevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (activePhotoIdx !== null) {
      setActivePhotoIdx((activePhotoIdx - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto my-14 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#fdf6e7] rounded-full border border-[#d4af37] shadow-sm mb-2">
          <ImageIcon className="w-3.5 h-3.5 text-[#87091f]" />
          <span className="text-xs font-devanagari-royal font-bold text-[#87091f]">
            मधुर स्मृतियाँ
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-devanagari-royal text-[#630514]">
          वर-वधू फोटो गैलरी
        </h2>
        <p className="text-xs font-devanagari-serif text-stone-700 mt-1 max-w-md mx-auto">
          परिणय सूत्र में बंधने से पूर्व के कुछ अनमोल, स्नेहमयी व खुशहाल पल
        </p>
      </div>

      {/* Category Tabs in Hindi */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-devanagari-serif font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] shadow-md'
                : 'bg-[#fffaf0] border border-[#d4af37]/60 text-stone-800 hover:bg-[#fdf6e7]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredPhotos.map((photo, idx) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(idx)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border-2 border-[#d4af37]/50 shadow-md card-paper-traditional hover:shadow-xl transition-all duration-300"
          >
            <img
              src={photo.url}
              alt={photo.caption}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-[#ffd700] text-xs font-devanagari-serif font-semibold tracking-wide flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                {photo.caption}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhotoIdx !== null && filteredPhotos[activePhotoIdx] && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl max-h-[85vh] flex flex-col items-center"
          >
            <img
              src={filteredPhotos[activePhotoIdx].url}
              alt={filteredPhotos[activePhotoIdx].caption}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border-2 border-[#d4af37]"
            />
            <p className="text-[#ffd700] text-sm font-devanagari-serif mt-4 text-center bg-[#3a0208]/90 px-5 py-2 rounded-full border border-[#d4af37]">
              {filteredPhotos[activePhotoIdx].caption}
            </p>
          </div>

          <button
            onClick={nextPhoto}
            className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
