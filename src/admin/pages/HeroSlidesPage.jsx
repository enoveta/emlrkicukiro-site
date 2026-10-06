import { useEffect, useState } from 'react';
import { adminApi, mediaUrl } from '../../api/client';
import MediaPicker from '../ui/MediaPicker';
import { useToast } from '../ui/Toast';
import { FiArrowDown, FiArrowUp, FiCheck, FiImage, FiPlus, FiSave, FiTrash2, FiUpload, FiVideo } from 'react-icons/fi';
import { StatusPill, Skeleton } from '../ui/StatusPill';
import { PageHeader, Card, ErrorNote, Field, Toggle } from '../ui/kit';

const emptySlide = (order = 0) => ({
  imageUrl: '',
  mediaType: 'image',
  title: 'Welcome to',
  titleRw: 'Murakaza neza muri',
  highlight: 'EMLR Kicukiro',
  highlightRw: 'EMLR Kicukiro',
  subtitle: '',
  subtitleRw: '',
  cta1: 'About Us',
  cta1Rw: 'Abo turi bo',
  cta1Link: '/about',
  cta2: 'Visit Us',
  cta2Rw: 'Tugane',
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
            titleRw: s.titleRw || '',
            highlight: s.highlight || '',
            highlightRw: s.highlightRw || '',
            subtitle: s.subtitle || '',
            subtitleRw: s.subtitleRw || '',
            cta1: s.cta1 || '',
            cta1Rw: s.cta1Rw || '',
            cta1Link: s.cta1Link || '',
            cta2: s.cta2 || '',
            cta2Rw: s.cta2Rw || '',
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
          ...Object.fromEntries(
            ['titleRw', 'highlightRw', 'subtitleRw', 'cta1Rw', 'cta2Rw'].map((k) => [k, s[k] || null])
          ),
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

  const input = (key, placeholder, extra = {}) => (
    <input
      className="a-input"
      value={current?.[key] ?? ''}
      placeholder={placeholder}
      onChange={(e) => updateSlide(active, { [key]: e.target.value })}
      {...extra}
    />
  );
  const pair = (label, key, hint) => (
    <Field label={label} hint={hint}>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="relative">
          {input(key, 'English')}
          <span className="pointer-events-none absolute right-2.5 top-2.5 rounded bg-[#f1ede4] px-1.5 py-0.5 text-[10px] font-bold text-[#7a5a22]">EN</span>
        </div>
        <div className="relative">
          {input(`${key}Rw`, 'Ikinyarwanda', { lang: 'rw' })}
          <span className="pointer-events-none absolute right-2.5 top-2.5 rounded bg-[#f1ede4] px-1.5 py-0.5 text-[10px] font-bold text-[#7a5a22]">RW</span>
        </div>
      </div>
    </Field>
  );

  const thumb = (slide, className) =>
    slide.imageUrl ? (
      slide.mediaType === 'video' ? (
        <video src={mediaUrl(slide.imageUrl)} className={`${className} object-cover`} muted />
      ) : (
        <img src={mediaUrl(slide.imageUrl)} alt="" className={`${className} object-cover`} />
      )
    ) : (
      <span className={`${className} grid place-items-center bg-[#f3f1ec] text-[#c3cbcb]`}>
        <FiImage aria-hidden="true" />
      </span>
    );

  return (
    <div>
      <PageHeader
        title="Home slides"
        description="The large rotating banner at the top of the home page: media, titles and buttons in both languages."
        badge={banner?.status ? <StatusPill status={banner.status} /> : null}
        actions={
          <>
            <button type="button" disabled={saving} onClick={() => save(false)} className="a-btn a-btn-secondary">
              <FiSave aria-hidden="true" /> Save draft
            </button>
            <button type="button" disabled={saving} onClick={() => save(true)} className="a-btn a-btn-primary">
              <FiCheck aria-hidden="true" /> {saving ? 'Saving…' : 'Save & publish'}
            </button>
          </>
        }
      />

      <ErrorNote>{error}</ErrorNote>
      {loading ? (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Skeleton className="h-80" />
          <Skeleton className="h-[520px]" />
        </div>
      ) : null}

      {!loading && (
        <div className="grid items-start gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card title="Slides" description={`${slides.length} in rotation`} padded={false} className="xl:sticky xl:top-24">
            <ul className="space-y-1.5 p-3">
              {slides.map((slide, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => setActive(index)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-2 text-left transition-colors ${
                      active === index ? 'border-gold bg-[#fbf7ee]' : 'border-transparent hover:bg-[#faf9f6]'
                    }`}
                  >
                    <span className="relative flex-none">
                      {thumb(slide, 'h-12 w-[72px] rounded-md')}
                      {slide.mediaType === 'video' ? (
                        <span className="absolute bottom-1 right-1 grid h-4 w-4 place-items-center rounded bg-ink/80 text-[9px] text-white">
                          <FiVideo aria-hidden="true" />
                        </span>
                      ) : null}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-[#9aa6a7]">Slide {index + 1}</span>
                      <span className="block truncate text-[13px] font-semibold text-ink">
                        {slide.title} {slide.highlight}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#f0ede6] p-3">
              <button
                type="button"
                onClick={() => {
                  setSlides([...slides, emptySlide(slides.length)]);
                  setActive(slides.length);
                }}
                className="a-btn a-btn-secondary w-full border-dashed"
              >
                <FiPlus aria-hidden="true" /> Add slide
              </button>
            </div>
          </Card>

          {current ? (
            <div className="space-y-6">
              {/* Preview in the website's own style */}
              <div className="a-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-[#f0ede6] px-5 py-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#9aa6a7]">Preview · slide {active + 1}</span>
                  <div className="flex items-center gap-1">
                    <button type="button" className="a-icon-btn" onClick={() => moveSlide(active, -1)} disabled={active === 0} aria-label="Move up" title="Move up">
                      <FiArrowUp aria-hidden="true" />
                    </button>
                    <button type="button" className="a-icon-btn" onClick={() => moveSlide(active, 1)} disabled={active === slides.length - 1} aria-label="Move down" title="Move down">
                      <FiArrowDown aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="a-icon-btn hover:!bg-[#fef3f2] hover:!text-[#b42318]"
                      disabled={slides.length <= 1}
                      aria-label="Remove slide"
                      title="Remove slide"
                      onClick={() => {
                        if (slides.length <= 1 || !window.confirm('Remove this slide?')) return;
                        setSlides(slides.filter((_, i) => i !== active));
                        setActive(Math.max(0, active - 1));
                      }}
                    >
                      <FiTrash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="relative grid items-center gap-6 bg-paper p-6 md:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)] md:p-8">
                  <span className="absolute inset-y-0 right-0 hidden w-[42%] bg-paper-tint md:block" aria-hidden="true" />
                  <div className="relative">
                    <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-gold-text">EMLR Kicukiro Parish</p>
                    <h2 className="font-serif text-[2rem] leading-[1.02] tracking-[-0.02em] text-ink md:text-[2.4rem]">
                      {current.title} <em className="text-gold">{current.highlight}</em>
                    </h2>
                    {current.subtitle ? <p className="mt-3 text-sm leading-relaxed text-[#435b60]">{current.subtitle}</p> : null}
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <span className="inline-flex h-9 items-center bg-ink px-4 text-xs font-bold text-white">{current.cta1 || 'Button 1'} ↗</span>
                      <span className="border-b border-ink/30 pb-1 text-xs font-bold text-ink">{current.cta2 || 'Button 2'} →</span>
                    </div>
                  </div>
                  <div className="relative pb-2.5 pr-2.5">
                    <span className="absolute bottom-0 right-0 h-1/2 w-1/2 bg-gold-light" aria-hidden="true" />
                    {thumb(current, 'relative block aspect-[16/11] w-full')}
                  </div>
                </div>
              </div>

              <Card title="Media">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {thumb(current, 'h-24 w-full flex-none rounded-lg border border-[#efebe3] sm:w-40')}
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex rounded-lg border border-[#e3ded3] bg-white p-1">
                        {[
                          ['image', 'Image', FiImage],
                          ['video', 'Video', FiVideo],
                        ].map(([v, label, Icon]) => (
                          <button
                            key={v}
                            type="button"
                            onClick={() => updateSlide(active, { mediaType: v })}
                            className={`inline-flex h-8 items-center gap-1.5 rounded-md px-3 text-[13px] font-semibold ${
                              current.mediaType === v ? 'bg-ink text-white' : 'text-[#4b5d61] hover:bg-[#f6f5f1]'
                            }`}
                          >
                            <Icon aria-hidden="true" /> {label}
                          </button>
                        ))}
                      </div>
                      <button type="button" onClick={() => setPickerOpen(true)} className="a-btn a-btn-secondary">
                        <FiUpload aria-hidden="true" /> {current.imageUrl ? 'Change media' : 'Choose media'}
                      </button>
                    </div>
                    {current.imageUrl ? (
                      <p className="truncate text-xs text-[#9aa6a7]">{current.imageUrl}</p>
                    ) : (
                      <p className="text-xs font-medium text-[#b54708]">No media selected for this slide yet.</p>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="Text">
                <div className="space-y-5">
                  {pair('Title', 'title')}
                  {pair('Highlighted words', 'highlight', 'Shown in gold italic after the title.')}
                  {pair('Subtitle', 'subtitle')}
                </div>
              </Card>

              <Card title="Buttons">
                <div className="space-y-5">
                  {pair('Main button', 'cta1')}
                  {pair('Second link', 'cta2')}
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <Field label="Main button goes to" hint="A page like /amatangazo or a full https:// link">
                      {input('cta1Link', '/about')}
                    </Field>
                    <Field label="Second link goes to">{input('cta2Link', '/about/location')}</Field>
                  </div>
                </div>
              </Card>

              <Card title="Display">
                <div className="grid grid-cols-1 items-start gap-5 md:grid-cols-2">
                  <Field label="Time on screen" hint="In milliseconds: 8000 = 8 seconds">
                    {input('duration', '8000', { type: 'number', min: 2000, step: 500 })}
                  </Field>
                  <div className="rounded-lg border border-[#e3ded3] bg-[#fcfbf8] px-4 py-3 md:mt-7">
                    <Toggle checked={current.hasBlur} onChange={(v) => updateSlide(active, { hasBlur: v })} label="Soft overlay" />
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
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
