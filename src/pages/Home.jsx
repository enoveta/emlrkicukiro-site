// src/pages/Home.jsx
import Hero from '../components/Hero1';
import Stats from '../components/Stats1';
import Programs from '../components/Programs1';
import News from '../components/News1';
import Events from '../components/Events1';
import Testimonials from '../components/Testimonials1';
import CTA from '../components/CTA1';
import AI from '../components/ChatBot1';

function Home() {
  return (
    <div>
      <Hero />
      <Stats />
      <Programs />
      <News />
      <Events />
      <CTA />
      <Testimonials />
      <AI/>
    </div>
  );
}

export default Home;