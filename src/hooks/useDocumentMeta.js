import { useEffect } from 'react';

export function useDocumentMeta({ title, description, ogTitle, ogDescription, ogImage, ogUrl, twitterCard }) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', ogTitle, 'property');
    setMeta('og:description', ogDescription, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:url', ogUrl, 'property');
    setMeta('twitter:card', twitterCard);

  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, twitterCard]);
}
