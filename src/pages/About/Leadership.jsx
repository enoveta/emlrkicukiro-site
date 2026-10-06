import { FaBalanceScale, FaSearchDollar, FaUsers, FaLandmark, FaArrowDown } from 'react-icons/fa';
import { useLanguage } from '../../i18n/LanguageContext';
import { PageShell } from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

/** Assembly at the top of each level. */
const MainNode = ({ icon: Icon, title }) => (
  <div className="w-full md:w-auto md:min-w-[19rem] max-w-md inline-flex items-center gap-3.5 bg-ink text-white px-5 py-4 shadow-[0_14px_30px_rgba(20,54,66,.18)]">
    <span className="flex items-center justify-center w-10 h-10 rounded-full border border-gold-light/50 text-gold-light shrink-0">
      <Icon aria-hidden="true" />
    </span>
    <span className="font-serif text-[1.3rem] leading-snug">{title}</span>
  </div>
);

/** Body that belongs to the assembly. */
const Node = ({ title, note, highlight }) => (
  <div
    className={`w-full md:max-w-[15rem] border px-3 py-3 text-[15px] font-semibold leading-snug text-left md:text-center break-words hyphens-auto ${
      highlight ? 'bg-paper-featured border-gold text-ink' : 'bg-white border-line text-ink'
    }`}
  >
    {title}
    {note ? <span className="block mt-1 text-xs font-bold uppercase tracking-[0.06em] text-gold-text">{note}</span> : null}
  </div>
);

/** Audit / mediation body shown beside the assembly (dashed = not in the line of command). */
const SideNode = ({ icon: Icon, title, text }) => (
  <div className="border border-dashed border-[#c8b98e] bg-paper-card p-4 md:p-5">
    <p className="flex items-center gap-2 font-serif text-[1.15rem] text-ink">
      <Icon className="text-gold shrink-0 text-sm" aria-hidden="true" />
      {title}
    </p>
    <p className="mt-1.5 text-sm leading-relaxed text-[#596c70]">{text}</p>
  </div>
);

function Level({ step, title, main, mainIcon, children, left, right }) {
  return (
    <section className="bg-white border border-line p-4 md:p-8" aria-label={title}>
      <h2 className="flex items-center gap-3.5 font-serif text-[1.6rem] md:text-[2rem] leading-tight text-ink mb-6 md:mb-8">
        <span className="font-serif text-gold">{String(step).padStart(2, '0')}</span>
        {title}
      </h2>

      {/* Row 1: audit · assembly · mediation (side boxes only on tablet/desktop here) */}
      <div className="grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 md:gap-8 items-center">
        <div className="hidden md:block relative">
          {left}
          <span className="absolute top-1/2 -right-8 w-8 border-t border-dashed border-[#c8b98e]" aria-hidden="true" />
        </div>
        <div className="flex justify-center">
          <MainNode icon={mainIcon} title={main} />
        </div>
        <div className="hidden md:block relative">
          {right}
          <span className="absolute top-1/2 -left-8 w-8 border-t border-dashed border-[#c8b98e]" aria-hidden="true" />
        </div>
      </div>

      {/* Row 2: bodies under the assembly, full width */}
      <div className="org-tree mt-0 md:-mt-px">
        <ul>
          <li>
            <ul>{children}</ul>
          </li>
        </ul>
      </div>

      {/* Phones: side boxes after the tree */}
      <div className="md:hidden grid gap-4 mt-6">
        {left}
        {right}
      </div>
    </section>
  );
}

function Leadership() {
  const { t } = useLanguage();
  const s = (key) => t(`structure.${key}`);
  usePageMeta(s('title'), s('intro'));

  return (
    <PageShell badge={s('badge')} title={s('title')} subtitle={s('intro')} tone="paper">
      <div>
        <Level
          step="1"
          title={s('national')}
          main={s('generalConference')}
          mainIcon={FaLandmark}
          left={<SideNode icon={FaSearchDollar} title={s('nationalAudit')} text={s('nationalAuditText')} />}
          right={<SideNode icon={FaBalanceScale} title={s('nationalConflict')} text={s('nationalConflictText')} />}
        >
          <li>
            <Node title={s('gcCouncil')} />
          </li>
          <li>
            <Node title={s('gcBishop')} />
          </li>
        </Level>

        <div className="flex justify-center py-3 text-gold" aria-hidden="true">
          <span className="flex flex-col items-center">
            <span className="h-8 border-l border-[#c8b98e]" />
            <FaArrowDown />
          </span>
        </div>

        <Level
          step="2"
          title={s('conference')}
          main={s('annualConference')}
          mainIcon={FaUsers}
          left={<SideNode icon={FaSearchDollar} title={s('confAudit')} text={s('confAuditText')} />}
          right={<SideNode icon={FaBalanceScale} title={s('confConflict')} text={s('confConflictText')} />}
        >
          <li>
            <Node title={s('acExecutive')} />
          </li>
          <li>
            <Node title={s('acSuperintendent')} />
          </li>
          <li>
            <Node title={s('acParishes')} note={s('parishNote')} highlight />
          </li>
          <li>
            <Node title={s('acSchool')} />
          </li>
          <li>
            <Node title={s('acEvangelism')} />
          </li>
        </Level>
      </div>
    </PageShell>
  );
}

export default Leadership;
