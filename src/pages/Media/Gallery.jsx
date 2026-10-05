import { lazy, Suspense, useState } from 'react';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import PageHeader from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

// The lightbox is only downloaded when a photo is opened.
const GalleryLightbox = lazy(() => import('./GalleryLightbox'));

function Gallery() {
  const { data: items, loading } = usePublicData('/gallery', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('gallery.title'), t('gallery.subtitle'));
  const [openIndex, setOpenIndex] = useState(-1);

  const photos = (items || []).map((item) => ({
    path: item.imageUrl,
    src: mediaUrl(item.imageUrl),
    alt: localized(item, 'alt', lang) || localized(item, 'caption', lang),
    caption: localized(item, 'caption', lang),
  }));

  return (
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <PageHeader title={t('gallery.title')} subtitle={t('gallery.subtitle')} />
        {loading ? <SkeletonCards count={6} className="aspect-square" /> : null}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {photos.map((photo, index) => (
            <button
              key={photo.path + index}
              type="button"
              className="group relative aspect-square bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow"
              onClick={() => setOpenIndex(index)}
              aria-label={photo.caption || photo.alt}
            >
              <Img
                src={photo.path}
                alt={photo.alt}
                thumb
                width="400"
                height="400"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {photo.caption ? (
                <span className="absolute inset-x-0 bottom-0 p-3 text-left text-sm font-medium text-white bg-gradient-to-t from-black/70 to-transparent">
                  {photo.caption}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {!loading && photos.length === 0 && <p className="text-center text-gray-500 py-12">{t('gallery.empty')}</p>}
        {openIndex >= 0 && (
          <Suspense fallback={null}>
            <GalleryLightbox photos={photos} index={openIndex} onClose={() => setOpenIndex(-1)} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

export default Gallery;
