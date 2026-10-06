import { useEffect, useState } from 'react';
import { FaPlay, FaYoutube, FaTimes } from 'react-icons/fa';
import { usePublicData, useSettings } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import { PageShell } from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

const PLAYLISTS = [
  { id: 'PL2S6YdqHKn5GUYIGmy6rIUevKGQvD2PRe', key: 'services', image: '/media/amateraniro.webp' },
  { id: 'PL2S6YdqHKn5Eb5dCN9Y__Om-L8itC_J3J', key: 'word', image: '/media/ijambo.webp' },
  { id: 'PL2S6YdqHKn5F_hC_zh4l-_fVzM-5-1_3p', key: 'concerts', image: '/media/ibitaramo.webp' },
  { id: 'PL2S6YdqHKn5GgReX_TBKUPyDwknWAAU_r', key: 'songs', image: '/media/indirimbo.webp' },
  { id: 'PL2S6YdqHKn5E-SpE2HoKudQnMTNIlYRGv', key: 'testimonies', image: '/media/ubuhamya.webp' },
];

function VideoModal({ videoId, onClose, t }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-ink-footer/90 flex justify-center items-center z-[60] p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute -top-11 right-0 text-3xl text-white hover:text-gold-light" aria-label={t('tv.close')}>
          <FaTimes />
        </button>
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video player"
          />
        </div>
      </div>
    </div>
  );
}

function PlaylistVideos({ playlist, onBack, onPlay, t, lang, channel }) {
  // Cached like all public data, so previously loaded videos still show if YouTube or the API fails.
  const { data: videos, loading, error } = usePublicData(`/youtube/playlists/${playlist.id}`, []);
  return (
    <>
      <div className="mb-8 flex flex-col-reverse sm:flex-row sm:items-end sm:justify-between gap-4">
        <h2 className="h-display text-[2.1rem] md:text-[2.6rem] leading-tight">{t(`tv.playlists.${playlist.key}`)}</h2>
        <button type="button" className="small-link self-start sm:self-auto" onClick={onBack}>
          <span aria-hidden="true">←</span> {t('tv.back')}
        </button>
      </div>
      {loading ? <SkeletonCards count={6} className="h-64" /> : null}
      {error && !videos.length ? (
        <div className="bg-paper-featured border border-line text-ink px-5 py-5 mb-8">
          <p className="mb-3">{t('tv.error')}</p>
          <a href={channel} target="_blank" rel="noopener noreferrer" className="small-link">
            <FaYoutube className="mr-2" aria-hidden="true" /> {t('tv.channel')}
          </a>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-[18px]">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            className="group text-left bg-white border border-line overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_17px_35px_rgba(20,54,66,.12)]"
            onClick={() => onPlay(video.id)}
          >
            <div className="relative aspect-video overflow-hidden bg-[#d5d0c4]">
              <img src={video.thumbnail} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="grid place-items-center w-12 h-12 rounded-full bg-white/95 text-ink shadow-lg">
                  <FaPlay className="ml-0.5 text-sm" aria-hidden="true" />
                </span>
              </span>
            </div>
            <div className="p-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-gold-text mb-1.5">{formatDate(video.publishedAt, lang)}</p>
              <h3 className="font-serif text-[1.2rem] leading-snug text-ink line-clamp-2">{video.title}</h3>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

const TV = () => {
  const { t, lang } = useLanguage();
  const settings = useSettings();
  const channel = settings.youtube || 'https://www.youtube.com/@emlrparoissekicukiro';
  usePageMeta('EMLR TV', t('tv.subtitle'));
  const [playlist, setPlaylist] = useState(null);
  const [videoId, setVideoId] = useState('');

  return (
    <PageShell badge="EMLR TV" title="EMLR Kicukiro TV" subtitle={t('tv.subtitle')} tone="paper">
      <div>

        {playlist ? (
          <PlaylistVideos
            playlist={playlist}
            onBack={() => setPlaylist(null)}
            onPlay={setVideoId}
            t={t}
            lang={lang}
            channel={channel}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-[18px]">
            {PLAYLISTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="group relative flex flex-col text-left bg-white border border-line overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_17px_35px_rgba(20,54,66,.12)]"
                onClick={() => setPlaylist(p)}
              >
                <div className="relative h-56 overflow-hidden bg-[#d5d0c4]">
                  <Img src={p.image} alt="" thumb className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  <span className="absolute right-3.5 bottom-3.5 grid place-items-center w-11 h-11 rounded-full bg-white/95 text-ink">
                    <FaPlay className="ml-0.5 text-xs" aria-hidden="true" />
                  </span>
                </div>
                <div className="px-5 pt-5 pb-[18px] md:px-[22px]">
                  <p className="text-[11px] font-bold tracking-[0.08em] text-[#7f8a89] mb-1.5">{String(PLAYLISTS.indexOf(p) + 1).padStart(2, '0')}</p>
                  <h2 className="font-serif text-[1.5rem] leading-[1.18] text-ink mb-3">{t(`tv.playlists.${p.key}`)}</h2>
                  <span className="inline-flex items-center gap-2 text-[13px] font-bold text-gold-dark">
                    {t('tv.browse')}
                    <span className="text-gold" aria-hidden="true">↗</span>
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="mt-12">
          <a href={channel} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            <FaYoutube className="text-gold-light text-lg" aria-hidden="true" /> {t('tv.channel')}
            <span className="text-gold-light" aria-hidden="true">
              ↗
            </span>
          </a>
        </div>
      </div>
      {videoId ? <VideoModal videoId={videoId} onClose={() => setVideoId('')} t={t} /> : null}
    </PageShell>
  );
};

export default TV;
