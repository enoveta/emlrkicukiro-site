import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header1';
import Footer from './components/Footer1';

import Home from './pages/Home';
import About from './pages/About/About';
import MissionVision from './pages/About/MissionVision';
import Leadership from './pages/About/Leadership';
import Location from './pages/About/Location';
import Team from './pages/About/Team';
import Ministries from './pages/Ministry/Ministries';
import MinistryDetail from './pages/Ministry/MinistryDetail';
import Events from './pages/Events/Events';
import Media from './pages/Media/Media';
import News from './pages/Media/News';
import TV from './pages/Media/TV';
import Gallery from './pages/Media/Gallery';
import Give from './pages/Give/Give';
import PrayerRequests from './pages/PrayerRequests';
import Volunteer from './pages/Volunteer';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import AdminApp from './admin/AdminApp';

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isAdmin) {
    return (
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    );
  }

  return (
    <LanguageProvider>
    <div className="font-sans text-gray-800">
      <Header scrolled={scrolled} />
      {/* Offset fixed header (top bar + main nav) so inner pages don't sit under it */}
      <div className={isHome ? '' : 'pt-24 md:pt-[9.5rem]'}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/mission-vision" element={<MissionVision />} />
          <Route path="/about/leadership" element={<Leadership />} />
          <Route path="/about/location" element={<Location />} />
          <Route path="/about/team" element={<Team />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/ministries/:slug" element={<MinistryDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/media" element={<Media />} />
          <Route path="/media/news" element={<News />} />
          <Route path="/media/gallery" element={<Gallery />} />
          <Route path="/media/TV" element={<TV />} />
          <Route path="/media/tv" element={<TV />} />
          <Route path="/give" element={<Give />} />
          <Route path="/prayer-requests" element={<PrayerRequests />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
    </LanguageProvider>
  );
}

function App() {
  return (
    <Router>
      <PublicLayout />
    </Router>
  );
}

export default App;
