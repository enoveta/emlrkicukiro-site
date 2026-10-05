import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useSettings } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import PageHeader from '../../components/ui/PageHeader';
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
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <PageHeader badge={t('location.badge')} title={t('location.title')} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="rounded-xl overflow-hidden shadow-lg bg-white">
            <iframe
              src={MAP_EMBED}
              title="EMLR Kicukiro map"
              className="w-full h-80 md:h-[420px] border-0"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-5 space-y-3">
              <p className="flex items-start text-gray-700">
                <FaMapMarkerAlt className="mt-1 mr-3 text-[#1a6f99] shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-[#001d3a]">EMLR Kicukiro</strong>
                  <br />
                  {address}
                </span>
              </p>
              <a
                href={DIRECTIONS}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2.5 rounded-lg bg-[#001d3a] text-white font-medium hover:bg-[#003366]"
              >
                {t('location.directions')}
              </a>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-[#001d3a] mb-6">{t('location.contactTitle')}</h2>
            <ul className="space-y-6">
              {CONTACTS.map((c) => (
                <li key={c.name} className="flex items-start">
                  <span className="bg-[#e8f5fb] p-3 rounded-full mr-4">
                    <FaUser className="text-[#1a6f99]" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-[#001d3a]">{c.name}</h3>
                    <p className="text-gray-600">{t(`location.${c.role}`)}</p>
                    <a href={tel(c.phone)} className="inline-flex items-center mt-1 text-[#1a6f99] hover:text-[#001d3a]">
                      <FaPhone className="mr-2 text-sm" aria-hidden="true" />
                      {c.phone}
                    </a>
                  </div>
                </li>
              ))}
              <li className="flex items-start pt-5 border-t border-gray-100">
                <span className="bg-[#e8f5fb] p-3 rounded-full mr-4">
                  <FaEnvelope className="text-[#1a6f99]" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-semibold text-[#001d3a]">{t('location.email')}</h3>
                  <a href={`mailto:${email}`} className="text-[#1a6f99] hover:text-[#001d3a] break-all">
                    {email}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Location;
