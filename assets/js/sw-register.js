/* Registers the service worker for offline support + installability.
   Only runs on http(s) (never file://) and where the API exists. Safe no-op
   otherwise. Delete this file + the sw.js link if you don't want a PWA. */
(function () {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'http:' && location.protocol !== 'https:') return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => { /* offline support unavailable; ignore */ });
  });
})();
