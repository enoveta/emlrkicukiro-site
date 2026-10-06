import { useSettings } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { PageShell } from '../../components/ui/PageHeader';
import { PhoneIcon } from '../../components/Header1';
import usePageMeta from '../../hooks/usePageMeta';

const MAP_EMBED =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.4610160248685!2d30.09513407589272!3d-1.9696555367567457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca70009849dad%3A0xf18b0ddc989f39e0!2sEglise%20Mthodiste%20Libre%20au%20rwanda%20(%20EMLR-%20Kicukiro)%20%2F%20Free%20Methodist%20Church%20in%20Rwanda%20(Kicukiro%20Parish)%20%2F!5e0!3m2!1sen!2srw!4v1758233462336!5m2!1sen!2srw';
const DIRECTIONS =
  'https://www.google.com/maps/search/?api=1&query=Eglise+Methodiste+Libre+au+Rwanda+EMLR+Kicukiro';

const CONTACTS = [
  { name: 'Rev NDAGIJIMANA Jean Baptiste', role: 'seniorPastor', phone: '+250 788 524 792' },
  { name: 'Rev Dr RUTIMIRWA Benjamin', role: 'associatePastor', phone: '+250 788 300 839' },
];

const tel = (phone) => `tel:${phone.replace(/\s/g, '')}`;

function Location() {
  const { t } = useLanguage();
  const settings = useSettings();
  usePageMeta(t('location.title'), t('location.subtitle'));
  const email = settings.email || 'info@emlrkicukiroparish.org';
  const address = settings.address || 'Kicukiro, Kigali, Rwanda';

  return (
    <PageShell badge={t('location.badge')} title={t('location.title')}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,.85fr)] lg:gap-14">
        <div>
          <div className="relative pr-3 pb-3 md:pr-4 md:pb-4">
            <span className="absolute right-0 bottom-0 w-[56%] h-[46%] bg-gold-light" aria-hidden="true" />
            <div className="relative bg-[#d5d0c4] shadow-[0_18px_50px_rgba(20,54,66,.12)]">
              <iframe
                src={MAP_EMBED}
                title="EMLR Kicukiro map"
                className="block w-full h-80 md:h-[460px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[17px] leading-relaxed text-[#435b60]">
              <strong className="block font-serif font-normal text-[1.35rem] text-ink">EMLR Kicukiro</strong>
              {address}
            </p>
            <a href={DIRECTIONS} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-none">
              {t('location.directions')}
              <span className="text-gold-light" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-3">{t('location.badge')}</p>
          <h2 className="h-display text-[2.2rem] md:text-[2.6rem] leading-tight mb-6">{t('location.contactTitle')}</h2>
          <ul className="border-t border-line">
            {CONTACTS.map((c) => (
              <li key={c.name} className="py-5 border-b border-line">
                <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] text-gold-text">{t(`location.${c.role}`)}</p>
                <h3 className="mt-1 font-serif text-[1.35rem] leading-snug text-ink">{c.name}</h3>
                <a href={tel(c.phone)} className="mt-1.5 inline-flex items-center gap-2 text-[15px] font-semibold text-[#334c51] hover:text-gold">
                  <PhoneIcon className="w-4 h-4 text-gold" />
                  {c.phone}
                </a>
              </li>
            ))}
            <li className="py-5 border-b border-line">
              <p className="text-[11px] md:text-xs font-bold uppercase tracking-[0.1em] text-gold-text">{t('location.email')}</p>
              <a href={`mailto:${email}`} className="mt-1 inline-block font-serif text-[1.25rem] text-ink hover:text-gold break-all">
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </PageShell>
  );
}

export default Location;
