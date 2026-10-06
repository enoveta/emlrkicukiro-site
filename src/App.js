import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';

import { LanguageProvider } from './i18n/LanguageContext';
import Header from './components/Header1';
import Footer from './components/Footer1';
import ErrorBoundary from './components/ui/ErrorBoundary';
import PageLoader from './components/ui/PageLoader';
import NavigationProgress from './components/ui/NavigationProgress';
import API_BASE from './api/client';
import Home from './pages/Home';

// Every page except Home is split into its own file and loaded on demand.
const PAGE_IMPORTS = {
  About: () => import('./pages/About/About'),
  MissionVision: () => import('./pages/About/MissionVision'),
  Leadership: () => import('./pages/About/Leadership'),
  Location: () => import('./pages/About/Location'),
  Team: () => import('./pages/About/Team'),
  Ministries: () => import('./pages/Ministry/Ministries'),
  MinistryDetail: () => import('./pages/Ministry/MinistryDetail'),
  Events: () => import('./pages/Events/Events'),
  Notices: () => import('./pages/Notices/Notices'),
  News: () => import('./pages/Media/News'),
  NewsDetail: () => import('./pages/Media/NewsDetail'),
  TV: () => import('./pages/Media/TV'),
  Gallery: () => import('./pages/Media/Gallery'),
  Give: () => import('./pages/Give/Give'),
  PrayerRequests: () => import('./pages/PrayerRequests'),
  Volunteer: () => import('./pages/Volunteer'),
  PrivacyPolicy: () => import('./pages/PrivacyPolicy'),
  TermsOfService: () => import('./pages/TermsOfService'),
  NotFound: () => import('./pages/NotFound'),
};
const About = lazy(PAGE_IMPORTS.About);
const MissionVision = lazy(PAGE_IMPORTS.MissionVision);
const Leadership = lazy(PAGE_IMPORTS.Leadership);
const Location = lazy(PAGE_IMPORTS.Location);
const Team = lazy(PAGE_IMPORTS.Team);
const Ministries = lazy(PAGE_IMPORTS.Ministries);
const MinistryDetail = lazy(PAGE_IMPORTS.MinistryDetail);
const Events = lazy(PAGE_IMPORTS.Events);
const Notices = lazy(PAGE_IMPORTS.Notices);
const News = lazy(PAGE_IMPORTS.News);
const NewsDetail = lazy(PAGE_IMPORTS.NewsDetail);
const TV = lazy(PAGE_IMPORTS.TV);
const Gallery = lazy(PAGE_IMPORTS.Gallery);
const Give = lazy(PAGE_IMPORTS.Give);
const PrayerRequests = lazy(PAGE_IMPORTS.PrayerRequests);
const Volunteer = lazy(PAGE_IMPORTS.Volunteer);
const PrivacyPolicy = lazy(PAGE_IMPORTS.PrivacyPolicy);
const TermsOfService = lazy(PAGE_IMPORTS.TermsOfService);
const NotFound = lazy(PAGE_IMPORTS.NotFound);
const AdminApp = lazy(() => import('./admin/AdminApp'));
const ChatBot = lazy(() => import('./components/ChatBot1'));

// Full-height loader keeps the footer below the fold while a page chunk loads (no layout jump).
const PageFallback = () => <PageLoader />;

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

/** After the first page is ready, quietly download the other pages so later clicks open instantly. */
function usePreloadPages() {
  useEffect(() => {
    const run = () => Object.values(PAGE_IMPORTS).forEach((load) => load().catch(() => {}));
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 1500));
    const handle = setTimeout(() => idle(run), 2500);
    return () => clearTimeout(handle);
  }, []);
}

function PublicLayout() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  usePageViews(location.pathname);
  usePreloadPages();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LanguageProvider>
      <div className="site min-h-screen">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-ink-deep focus:text-white focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <Header scrolled={scrolled} />
        <main id="main">
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
      <Suspense fallback={<PageLoader fullScreen />}>
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
      <NavigationProgress />
      <Shell />
    </Router>
  );
}

export default App;
