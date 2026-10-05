import { useEffect, useState } from 'react';
import { adminApi, mediaUrl } from '../../api/client';
import MediaPicker from '../ui/MediaPicker';
import { useToast } from '../ui/Toast';
import { StatusPill, Skeleton } from '../ui/StatusPill';

const emptySlide = (order = 0) => ({
  imageUrl: '',
  mediaType: 'image',
  title: 'Welcome to',
  highlight: 'EMRL Kicukiro',
  subtitle: '',
  cta1: 'Learn About Us',
  cta1Link: '/about',
  cta2: 'Visit Us',
  cta2Link: '/about/location',
  duration: 8000,
  hasBlur: true,
  order,
});

export default function HeroSlidesPage() {
  const { push } = useToast();
  const [banner, setBanner] = useState(null);
  const [slides, setSlides] = useState([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const list = await adminApi.get('/banners', { cache: false });
      const first = list?.[0] || null;
      setBanner(first);
      if (first) {
        setSlides(
          (first.slides || []).map((s, i) => ({
            imageUrl: s.imageUrl || '',
            mediaType: s.mediaType || 'image',
            title: s.title || '',
            highlight: s.highlight || '',
            subtitle: s.subtitle || '',
            cta1: s.cta1 || '',
            cta1Link: s.cta1Link || '',
            cta2: s.cta2 || '',
            cta2Link: s.cta2Link || '',
            duration: s.duration || 8000,
            hasBlur: s.hasBlur !== false,
            order: s.order ?? i,
          }))
        );
      } else {
        setSlides([emptySlide(0)]);
      }
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateSlide = (index, patch) => {
    setSlides((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const moveSlide = (index, dir) => {
    const next = index + dir;
    if (next < 0 || next >= slides.length) return;
    const copy = [...slides];
    const tmp = copy[index];
    copy[index] = copy[next];
    copy[next] = tmp;
    setSlides(copy);
    setActive(next);
  };

  const save = async (andPublish = false) => {
    setSaving(true);
    setError('');
    try {
      const body = {
        slides: slides.map((s, i) => ({
          ...s,
          order: i,
          duration: Number(s.duration || 8000),
        })),
      };

      let current = banner;
      if (!current) {
        current = await adminApi.post('/banners', body);
        setBanner(current);
      } else {
        current = await adminApi.put(`/banners/${current.id}`, body);
        setBanner(current);
      }

      if (andPublish && current.status !== 'PUBLISHED') {
        current = await adminApi.post(`/banners/${current.id}/publish`, {});
        setBanner(current);
        push('Home slides saved & published');
      } else {
        push(andPublish ? 'Home slides updated on live site' : 'Home slides saved');
      }
      await load();
    } catch (err) {
      setError(err.message);
      push(err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const current = slides[active] || slides[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#001d3a]">Home slides</h1>
          <p className="text-slate-500 mt-1">
            Manage the homepage hero carousel — media, titles, and buttons.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {banner?.status ? <StatusPill status={banner.status} /> : null}
          <button
            type="button"
            disabled={saving}
            onClick={() => save(false)}
            className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Save draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => save(true)}
            className="px-4 py-2.5 rounded-xl bg-[#001d3a] text-white text-sm font-medium hover:bg-[#5fb9e2] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save & publish'}
          </button>
        </div>
      </div>

      {error ? <p className="text-red-600 text-sm">{error}</p> : null}
      {loading ? <Skeleton className="h-80" /> : null}

      {!loading && (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <div className="xl:col-span-2 space-y-3">
            {slides.map((slide, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActive(index)}
                className={`w-full text-left rounded-2xl border p-3 flex gap-3 transition ${
                  active === index ? 'border-[#5fb9e2] bg-[#e8f5fb] shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                  {slide.imageUrl ? (
                    slide.mediaType === 'video' ? (
                      <video src={mediaUrl(slide.imageUrl)} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={mediaUrl(slide.imageUrl)} alt="" className="w-full h-full object-cover" />
                    )
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-[#001d3a] truncate">
                    {slide.title} {slide.highlight}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{slide.subtitle || 'No subtitle'}</div>
                </div>
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setSlides([...slides, emptySlide(slides.length)]);
                setActive(slides.length);
              }}
              className="w-full py-3 rounded-2xl border border-dashed border-slate-300 text-sm text-[#001d3a] hover:bg-white"
            >
              + Add slide
            </button>
          </div>

          <div className="xl:col-span-3 space-y-4">
            <div
              className="relative rounded-2xl overflow-hidden min-h-[280px] bg-[#001d3a] text-white flex items-end"
              style={
                current?.mediaType !== 'video' && current?.imageUrl
                  ? {
                      backgroundImage: `linear-gradient(rgba(0,51,102,.35), rgba(0,51,102,.7)), url(${mediaUrl(current.imageUrl)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            >
              {current?.mediaType === 'video' && current?.imageUrl ? (
                <video
                  src={mediaUrl(current.imageUrl)}
                  className="absolute inset-0 w-full h-full object-cover"
                  muted
                  autoPlay
                  loop
                  playsInline
                />
              ) : null}
              <div className="relative z-10 p-8 max-w-xl">
                <div className="text-xs uppercase tracking-wider text-white/70 mb-2">Live preview</div>
                <h2 className="text-3xl font-bold leading-tight">
                  {current?.title} <span className="text-[#5eb9df]">{current?.highlight}</span>
                </h2>
                <p className="text-white/85 mt-3">{current?.subtitle}</p>
                <div className="flex gap-2 mt-5">
                  <span className="px-3 py-1.5 rounded-lg bg-[#001d3a] text-xs">{current?.cta1 || 'CTA 1'}</span>
                  <span className="px-3 py-1.5 rounded-lg border border-white/40 text-xs">{current?.cta2 || 'CTA 2'}</span>
                </div>
              </div>
            </div>

            {current ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                <div className="flex flex-wrap gap-2 justify-between">
                  <h3 className="font-semibold text-[#001d3a]">Edit slide {active + 1}</h3>
                  <div className="flex gap-2">
                    <button type="button" className="text-xs px-2 py-1 border rounded-lg" onClick={() => moveSlide(active, -1)}>
                      ↑ Move up
                    </button>
                    <button type="button" className="text-xs px-2 py-1 border rounded-lg" onClick={() => moveSlide(active, 1)}>
                      ↓ Move down
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 border rounded-lg text-red-600"
                      onClick={() => {
                        if (slides.length <= 1) return;
                        const next = slides.filter((_, i) => i !== active);
                        setSlides(next);
                        setActive(Math.max(0, active - 1));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    ['title', 'Title'],
                    ['highlight', 'Highlight'],
                    ['subtitle', 'Subtitle'],
                    ['cta1', 'Primary button'],
                    ['cta1Link', 'Primary link'],
                    ['cta2', 'Secondary button'],
                    ['cta2Link', 'Secondary link'],
                    ['duration', 'Duration (ms)'],
                  ].map(([key, label]) => (
                    <div key={key} className={key === 'subtitle' ? 'md:col-span-2' : ''}>
                      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
                      <input
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
                        value={current[key] ?? ''}
                        onChange={(e) => updateSlide(active, { [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <select
                    className="border border-slate-200 rounded-xl px-3 py-2 text-sm"
                    value={current.mediaType}
                    onChange={(e) => updateSlide(active, { mediaType: e.target.value })}
                  >
                    <option value="image">Image</option>
                    <option value="video">Video</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#e8f5fb] text-[#001d3a] text-sm font-medium hover:bg-[#5fb9e2] hover:text-white transition"
                  >
                    Choose media
                  </button>
                  <label className="text-sm text-slate-600 flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={current.hasBlur}
                      onChange={(e) => updateSlide(active, { hasBlur: e.target.checked })}
                    />
                    Soft overlay
                  </label>
                </div>
                {current.imageUrl ? (
                  <p className="text-xs text-slate-500 break-all">{current.imageUrl}</p>
                ) : (
                  <p className="text-xs text-amber-700">No media selected for this slide.</p>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}

      <MediaPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        accept={current?.mediaType === 'video' ? 'video' : 'image'}
        onSelect={(url) => updateSlide(active, { imageUrl: url })}
      />
    </div>
  );
}
