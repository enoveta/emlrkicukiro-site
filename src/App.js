import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header1';
import Footer from './components/Footer1';
import ErrorBoundary from './components/ui/ErrorBoundary';
import API_BASE from './api/client';
import Home from './pages/Home';

// Every page except Home is split into its own file and loaded on demand.
const About = lazy(() => import('./pages/About/About'));
const MissionVision = lazy(() => import('./pages/About/MissionVision'));
const Leadership = lazy(() => import('./pages/About/Leadership'));
const Location = lazy(() => import('./pages/About/Location'));
const Team = lazy(() => import('./pages/About/Team'));
const Ministries = lazy(() => import('./pages/Ministry/Ministries'));
const MinistryDetail = lazy(() => import('./pages/Ministry/MinistryDetail'));
const Events = lazy(() => import('./pages/Events/Events'));
const Notices = lazy(() => import('./pages/Notices/Notices'));
const News = lazy(() => import('./pages/Media/News'));
const NewsDetail = lazy(() => import('./pages/Media/NewsDetail'));
const TV = lazy(() => import('./pages/Media/TV'));
const Gallery = lazy(() => import('./pages/Media/Gallery'));
const Give = lazy(() => import('./pages/Give/Give'));
const PrayerRequests = lazy(() => import('./pages/PrayerRequests'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminApp = lazy(() => import('./admin/AdminApp'));
const ChatBot = lazy(() => import('./components/ChatBot1'));

// Full-height placeholder keeps the footer below the fold while a page chunk loads (no layout jump).
const PageFallback = () => <div className="min-h-screen" aria-busy="true" />;

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** Counts a page view (no cookies, no personal data). Failures are ignored. */
function usePageViews(pathname) {
  useEffect(() => {
    let lang = 'en';
    try {
      lang = localStorage.getItem('emlr_lang') === 'rw' ? 'rw' : 'en';
    } catch {
      /* ignore */
    }
    fetch(`${API_BASE}/api/public/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname, lang }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname]);
}

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  usePageViews(location.pathname);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LanguageProvider>
      <div className="font-sans text-gray-800 bg-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-[#001d3a] focus:px-4 focus:py-2 focus:rounded"
        >
          Skip to content
        </a>
        <Header scrolled={scrolled} />
        {/* Offset the fixed header so inner pages don't sit under it */}
        <main id="main" className={isHome ? '' : 'pt-24 md:pt-[9.5rem]'}>
          <ErrorBoundary resetKey={location.pathname}>
            <Suspense fallback={<PageFallback />}>
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
                <Route path="/amatangazo" element={<Notices />} />
                <Route path="/announcements" element={<Navigate to="/amatangazo" replace />} />
                <Route path="/media" element={<Navigate to="/tv" replace />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/tv" element={<TV />} />
                <Route path="/give" element={<Give />} />
                <Route path="/prayer-requests" element={<PrayerRequests />} />
                <Route path="/volunteer" element={<Volunteer />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </main>
        <Footer />
        <Suspense fallback={null}>
          <ChatBot />
        </Suspense>
      </div>
    </LanguageProvider>
  );
}

function Shell() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
      </Suspense>
    );
  }
  return <PublicLayout />;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Shell />
    </Router>
  );
}

export default App;
