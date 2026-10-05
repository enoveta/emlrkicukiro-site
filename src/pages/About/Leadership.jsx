import { FaBalanceScale, FaSearchDollar, FaUsers, FaLandmark, FaArrowDown } from 'react-icons/fa';
import { useLanguage } from '../../i18n/LanguageContext';
import PageHeader from '../../components/ui/PageHeader';
import usePageMeta from '../../hooks/usePageMeta';

/** Assembly at the top of each level. */
const MainNode = ({ icon: Icon, title }) => (
  <div className="w-full md:w-auto md:min-w-[18rem] max-w-md inline-flex items-center gap-3 rounded-xl bg-[#003366] text-white px-5 py-4 shadow-lg">
    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-[#feed17] shrink-0">
      <Icon aria-hidden="true" />
    </span>
    <span className="text-lg font-bold leading-snug">{title}</span>
  </div>
);

/** Body that belongs to the assembly. */
const Node = ({ title, note, highlight }) => (
  <div
    className={`w-full md:max-w-[15rem] rounded-lg border px-3 py-3 text-sm font-semibold leading-snug shadow-sm text-left md:text-center break-words hyphens-auto ${
      highlight ? 'bg-[#fff8c2] border-[#feed17] text-[#001d3a]' : 'bg-white border-[#c9d8e6] text-[#003366]'
    }`}
  >
    {title}
    {note ? <span className="block mt-1 text-xs font-medium text-[#6b5d00]">{note}</span> : null}
  </div>
);

/** Audit / mediation body shown beside the assembly (dashed = not in the line of command). */
const SideNode = ({ icon: Icon, title, text }) => (
  <div className="rounded-xl border-2 border-dashed border-[#9fb7cc] bg-white p-4">
    <p className="flex items-center gap-2 font-bold text-[#003366]">
      <Icon className="text-[#1a6f99] shrink-0" aria-hidden="true" />
      {title}
    </p>
    <p className="mt-1 text-sm text-gray-600">{text}</p>
  </div>
);

function Level({ step, title, main, mainIcon, children, left, right }) {
  return (
    <section className="bg-white/60 rounded-2xl border border-gray-200 p-4 md:p-8" aria-label={title}>
      <h2 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-[#001d3a] mb-6">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#feed17] text-[#001d3a] text-sm font-bold">{step}</span>
        {title}
      </h2>

      {/* Row 1: audit · assembly · mediation (side boxes only on tablet/desktop here) */}
      <div className="grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 md:gap-8 items-center">
        <div className="hidden md:block relative">
          {left}
          <span className="absolute top-1/2 -right-8 w-8 border-t-2 border-dashed border-[#9fb7cc]" aria-hidden="true" />
        </div>
        <div className="flex justify-center">
          <MainNode icon={mainIcon} title={main} />
        </div>
        <div className="hidden md:block relative">
          {right}
          <span className="absolute top-1/2 -left-8 w-8 border-t-2 border-dashed border-[#9fb7cc]" aria-hidden="true" />
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
    <div className="min-h-screen py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto max-w-6xl">
        <PageHeader badge={s('badge')} title={s('title')} subtitle={s('intro')} />

        <div className="flex flex-wrap justify-center gap-2 mb-6 md:mb-8 text-xs md:text-sm text-gray-600" aria-hidden="true">
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1.5">
            <span className="w-5 border-t-2 border-[#9fb7cc]" />
            {s('legendLine')}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-200 px-3 py-1.5">
            <span className="w-5 border-t-2 border-dashed border-[#9fb7cc]" />
            {s('legendSide')}
          </span>
        </div>

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

        <div className="flex justify-center py-3 text-[#9fb7cc]" aria-hidden="true">
          <span className="flex flex-col items-center">
            <span className="h-8 border-l-2 border-[#9fb7cc]" />
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
    </div>
  );
}

export default Leadership;
