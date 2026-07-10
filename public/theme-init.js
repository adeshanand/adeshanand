/*
 * Runs blocking in <head> so an explicit theme choice applies before first
 * paint (no flash). With no stored choice, CSS prefers-color-scheme rules
 * decide, so this stays a no-op for first-time visitors.
 * Ships as a file because the CSP forbids inline scripts.
 */
(function () {
  try {
    var t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') {
      document.documentElement.dataset.theme = t;
      // Browser chrome (tab bar, toolbar) must follow the explicit choice,
      // not the OS scheme the media-scoped metas default to
      var color = t === 'dark' ? '#070b14' : '#ffffff';
      var metas = document.querySelectorAll('meta[name="theme-color"]');
      for (var i = 0; i < metas.length; i++) {
        metas[i].setAttribute('content', color);
      }
    }
  } catch (e) {
    /* storage unavailable — fall back to system preference */
  }
})();
