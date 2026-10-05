// src/App.jsx
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Programs from './components/Programs';
import News from './components/News';
import Events from './components/Events';
import Testimonials from './components/Testimonials';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="font-sans text-gray-800">
      <Header scrolled={scrolled} toggleSidebar={toggleSidebar} />
      <Hero />
      <Stats />
      <Programs />
      <News />
      <Events />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}

export default App;