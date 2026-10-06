import { EventsColumn } from './Events1';
import { NewsColumn } from './News1';

/** Home page: upcoming events and latest church news side by side. */
const Updates = () => (
  <section className="defer-render section-pad bg-white" aria-label="Events & News">
    <div className="site-container grid gap-12 md:gap-14 lg:grid-cols-[.92fr_1.08fr] lg:gap-[clamp(45px,7vw,95px)]">
      <EventsColumn />
      <NewsColumn />
    </div>
  </section>
);

export default Updates;
