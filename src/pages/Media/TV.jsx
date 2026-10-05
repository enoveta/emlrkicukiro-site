import { useEffect, useState } from 'react';
import { FaPlay, FaArrowLeft, FaArrowRight, FaYoutube, FaTimes } from 'react-icons/fa';
import { usePublicData, useSettings } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { formatDate } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import PageHeader from '../../components/ui/PageHeader';
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
    <div className="fixed inset-0 bg-black/85 flex justify-center items-center z-[60] p-4" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute -top-11 right-0 text-3xl text-white hover:text-[#fae924]" aria-label={t('tv.close')}>
          <FaTimes />
        </button>
        <div className="relative pt-[56.25%]">
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg"
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
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <button type="button" className="inline-flex items-center text-[#003366] hover:text-[#1f7fae] font-medium" onClick={onBack}>
          <FaArrowLeft className="mr-2" aria-hidden="true" /> {t('tv.back')}
        </button>
        <h2 className="text-2xl font-bold text-[#003366]">{t(`tv.playlists.${playlist.key}`)}</h2>
      </div>
      {loading ? <SkeletonCards count={6} className="h-64" /> : null}
      {error && !videos.length ? (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-4 rounded-lg mb-8 text-center">
          <p className="mb-3">{t('tv.error')}</p>
          <a href={channel} target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-semibold text-red-700">
            <FaYoutube className="mr-2" aria-hidden="true" /> {t('tv.channel')}
          </a>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <button
            key={video.id}
            type="button"
            className="group text-left bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
            onClick={() => onPlay(video.id)}
          >
            <div className="relative aspect-video overflow-hidden">
              <img src={video.thumbnail} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="bg-[#fae924] text-[#003366] p-3 rounded-full shadow-lg">
                  <FaPlay aria-hidden="true" />
                </span>
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-gray-800 line-clamp-2 mb-1">{video.title}</h3>
              <p className="text-xs text-gray-500">{formatDate(video.publishedAt, lang)}</p>
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
    <section className="py-12 md:py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        <PageHeader title="EMLR Kicukiro TV" subtitle={t('tv.subtitle')} />

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PLAYLISTS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="group relative text-left bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100"
                onClick={() => setPlaylist(p)}
              >
                <div className="relative h-52 overflow-hidden">
                  <Img src={p.image} alt="" thumb className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute top-4 right-4 bg-[#fae924] text-[#003366] p-2 rounded-full">
                    <FaPlay aria-hidden="true" />
                  </span>
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-[#001d3a] mb-2">{t(`tv.playlists.${p.key}`)}</h2>
                  <span className="inline-flex items-center font-medium text-[#1f7fae]">
                    {t('tv.browse')}
                    <FaArrowRight className="ml-2 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#fae924] to-[#5fb9e2]" />
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <a
            href={channel}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-6 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700"
          >
            <FaYoutube className="mr-2" aria-hidden="true" /> {t('tv.channel')}
          </a>
        </div>
      </div>
      {videoId ? <VideoModal videoId={videoId} onClose={() => setVideoId('')} t={t} /> : null}
    </section>
  );
};

export default TV;
