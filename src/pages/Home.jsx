import Hero from '../components/Hero1';
import Stats from '../components/Stats1';
import NoticesStrip from '../components/NoticesStrip';
import Programs from '../components/Programs1';
import News from '../components/News1';
import Events from '../components/Events1';
import Testimonials from '../components/Testimonials1';
import CTA from '../components/CTA1';
import usePageMeta from '../hooks/usePageMeta';

function Home() {
  usePageMeta();
  return (
    <>
      <Hero />
      <Stats />
      <NoticesStrip />
      <Programs />
      <Events />
      <News />
      <CTA />
      <Testimonials />
    </>
  );
}

export default Home;
