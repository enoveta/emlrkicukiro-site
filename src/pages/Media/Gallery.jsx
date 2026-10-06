import { lazy, Suspense, useState } from 'react';
import { usePublicData } from '../../api/usePublicData';
import { mediaUrl } from '../../api/client';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import { PageShell } from '../../components/ui/PageHeader';
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
    <PageShell title={t('gallery.title')} subtitle={t('gallery.subtitle')} tone="paper">
      <div>
        {loading ? <SkeletonCards count={6} className="aspect-square" /> : null}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3.5">
          {photos.map((photo, index) => (
            <button
              key={photo.path + index}
              type="button"
              className="group relative aspect-square bg-[#d5d0c4] overflow-hidden transition-shadow hover:shadow-[0_17px_35px_rgba(20,54,66,.16)]"
              onClick={() => setOpenIndex(index)}
              aria-label={photo.caption || photo.alt}
            >
              <Img
                src={photo.path}
                alt={photo.alt}
                thumb
                width="400"
                height="400"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {photo.caption ? (
                <span className="absolute inset-x-0 bottom-0 p-3 md:p-4 text-left text-sm md:text-[15px] font-medium text-white bg-gradient-to-t from-[rgba(7,25,31,.75)] to-transparent">
                  {photo.caption}
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {!loading && photos.length === 0 && <p className="text-[17px] text-[#596c70] py-12">{t('gallery.empty')}</p>}
        {openIndex >= 0 && (
          <Suspense fallback={null}>
            <GalleryLightbox photos={photos} index={openIndex} onClose={() => setOpenIndex(-1)} />
          </Suspense>
        )}
      </div>
    </PageShell>
  );
}

export default Gallery;
