import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Download from 'yet-another-react-lightbox/plugins/download';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';

function Gallery() {
  const { data: items, loading } = usePublicData('/gallery', []);
  const { t, lang } = useLanguage();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = (items || []).map((item) => ({
    src: mediaUrl(item.imageUrl),
    alt: localized(item, 'alt', lang),
    caption: localized(item, 'caption', lang),
  }));

  return (
    <div className="min-h-screen pt-8 pb-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-[#001d3a]">{t('gallery.title')}</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('gallery.subtitle')}</p>
        </div>

        {loading && <p className="text-center text-gray-500">{t('gallery.loading')}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allImages.map((photo, index) => (
            <div
              key={index}
              className="group relative aspect-square bg-white rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => {
                setCurrentImageIndex(index);
                setLightboxOpen(true);
              }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end">
                <div className="p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="font-medium truncate">{photo.caption}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && allImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('gallery.empty')}</p>
          </div>
        )}

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={currentImageIndex}
          slides={allImages.map((img) => ({ src: img.src, alt: img.alt, title: img.caption }))}
          plugins={[Zoom, Download]}
        />
      </div>
    </div>
  );
}

export default Gallery;
