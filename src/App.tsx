import { Routes, Route, useLocation } from 'react-router';
import { Suspense, lazy, useEffect } from 'react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import CookieBanner from '@/components/CookieBanner';
import Home from '@/pages/Home';

// code splitting: ogni pagina non-home viene caricata solo quando serve
const ArticlePage = lazy(() => import('@/pages/ArticlePage'));
const CategoryPage = lazy(() => import('@/pages/CategoryPage'));
const FormatPage = lazy(() => import('@/pages/ListingPages').then((m) => ({ default: m.FormatPage })));
const ArchivePage = lazy(() => import('@/pages/ListingPages').then((m) => ({ default: m.ArchivePage })));
const PrivacyPage = lazy(() => import('@/pages/LegalPages').then((m) => ({ default: m.PrivacyPage })));
const CookiePolicyPage = lazy(() => import('@/pages/LegalPages').then((m) => ({ default: m.CookiePolicyPage })));
const ChiSiamoPage = lazy(() => import('@/pages/LegalPages').then((m) => ({ default: m.ChiSiamoPage })));
const ContattiPage = lazy(() => import('@/pages/LegalPages').then((m) => ({ default: m.ContattiPage })));
const TagPage = lazy(() => import('@/pages/TagSearchPages').then((m) => ({ default: m.TagPage })));
const SearchPage = lazy(() => import('@/pages/TagSearchPages').then((m) => ({ default: m.SearchPage })));
const ChecklistPage = lazy(() => import('@/pages/ChecklistPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <SiteHeader />
      <div className="flex-1">
        <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-24 font-serif text-lg text-neutral-500">Caricamento…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/articolo/:slug" element={<ArticlePage />} />
            <Route path="/categoria/:slug" element={<CategoryPage />} />
            <Route path="/top-5" element={<FormatPage format="top5" />} />
            <Route path="/top-10" element={<FormatPage format="top10" />} />
            <Route path="/news" element={<FormatPage format="news" />} />
            <Route path="/archivio" element={<ArchivePage />} />
            <Route path="/checklist" element={<ChecklistPage />} />
            <Route path="/tag/:slug" element={<TagPage />} />
            <Route path="/ricerca" element={<SearchPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/cookie-policy" element={<CookiePolicyPage />} />
            <Route path="/chi-siamo" element={<ChiSiamoPage />} />
            <Route path="/contatti" element={<ContattiPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <SiteFooter />
      <CookieBanner />
    </div>
  );
}
