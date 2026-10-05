import { useEffect } from 'react';

const SITE = 'EMLR Kicukiro';
const DEFAULT_DESCRIPTION =
  'Eglise Methodiste Libre au Rwanda, Kicukiro Parish: Sunday services, ministries, events and announcements.';

const setMeta = (attr, key, value) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

/** Sets the browser title, description and share-preview tags for the current page. */
export default function usePageMeta(title, description, image) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE}` : `${SITE} | Eglise Methodiste Libre au Rwanda`;
    const desc = (description || DEFAULT_DESCRIPTION).slice(0, 180);
    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', window.location.href);
    if (image) setMeta('property', 'og:image', new URL(image, window.location.origin).href);
  }, [title, description, image]);
}
