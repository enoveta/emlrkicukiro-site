import { usePublicData } from '../../api/usePublicData';
import { useLanguage } from '../../i18n/LanguageContext';
import { localized } from '../../i18n/translations';
import Img from '../../components/ui/Img';
import { PageShell } from '../../components/ui/PageHeader';
import { SkeletonCards } from '../../components/ui/Skeleton';
import usePageMeta from '../../hooks/usePageMeta';

function PastorCard({ member, lang, featured = false }) {
  const position = localized(member, 'position', lang);
  return (
    <article
      className={`group bg-white border border-line overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_17px_35px_rgba(20,54,66,.12)] ${
        featured ? 'grid sm:grid-cols-[minmax(0,.9fr)_minmax(0,1.1fr)]' : 'flex flex-col'
      }`}
    >
      <div className={`relative overflow-hidden bg-paper-tint ${featured ? 'aspect-[4/4] sm:aspect-auto sm:min-h-[340px]' : 'aspect-[4/5]'}`}>
        <Img
          src={member.imageUrl}
          alt={member.name}
          thumb
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className={`flex flex-col ${featured ? 'justify-center p-7 md:p-10' : 'p-4 md:p-5'}`}>
        {position ? (
          <p className={`font-bold uppercase tracking-[0.1em] text-gold-text ${featured ? 'text-xs mb-3' : 'text-[10px] md:text-[11px] mb-1.5'}`}>
            {position}
          </p>
        ) : null}
        <h2 className={`font-serif font-normal leading-[1.2] text-ink ${featured ? 'text-[1.9rem] md:text-[2.3rem]' : 'text-[1.1rem] md:text-[1.35rem]'}`}>
          {member.name}
        </h2>
        {featured ? <span className="mt-5 block w-10 h-px bg-gold" aria-hidden="true" /> : null}
      </div>
    </article>
  );
}

function Team() {
  const { data: people, loading } = usePublicData('/people', []);
  const { t, lang } = useLanguage();
  usePageMeta(t('team.title'), t('team.subtitle'));
  const national = (people || []).filter((p) => p.team === 'NATIONAL');
  const others = (people || []).filter((p) => p.team !== 'NATIONAL');

  return (
    <PageShell title={t('team.title')} subtitle={t('team.subtitle')} tone="paper">
      {loading ? <SkeletonCards count={3} /> : null}

      {national.length ? (
        <div className="grid gap-4 mb-6 md:mb-8">
          {national.map((member) => (
            <PastorCard key={member.id} member={member} lang={lang} featured />
          ))}
        </div>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-4">
        {others.map((member) => (
          <PastorCard key={member.id} member={member} lang={lang} />
        ))}
      </div>
    </PageShell>
  );
}

export default Team;
