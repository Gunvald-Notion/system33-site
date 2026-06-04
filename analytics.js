// System 33 — shared analytics. One file every page points at,
// so measurement is defined once and changed once.
(function () {
  var GA_ID = 'G-ZS0BJG5PFE';
  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  gtag('js', new Date());
  gtag('config', GA_ID);
})();
