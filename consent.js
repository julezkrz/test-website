/* Kerstin Kreis Beauty – Consent-Manager
   Externe Inhalte (Bilder via Wix-CDN, Schriften via Google Fonts) werden erst
   nach ausdrücklicher Einwilligung geladen. Die Auswahl wird ausschließlich
   lokal im Browser gespeichert (localStorage, kein Tracking). */
(function () {
  "use strict";
  var KEY = "kk-consent";
  var FONTS_CSS = "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap";

  function read() {
    try {
      var v = JSON.parse(localStorage.getItem(KEY));
      return v && typeof v.media === "boolean" ? v : null;
    } catch (e) { return null; }
  }
  function write(media) {
    try {
      localStorage.setItem(KEY, JSON.stringify({ v: 1, media: media, ts: new Date().toISOString() }));
    } catch (e) {}
  }

  var fontsOn = false;
  function enableMedia() {
    if (!fontsOn) {
      fontsOn = true;
      [["https://fonts.gstatic.com", true], ["https://static.wixstatic.com", false]].forEach(function (h) {
        var l = document.createElement("link");
        l.rel = "preconnect"; l.href = h[0];
        if (h[1]) l.crossOrigin = "";
        document.head.appendChild(l);
      });
      var f = document.createElement("link");
      f.rel = "stylesheet"; f.href = FONTS_CSS;
      document.head.appendChild(f);
    }
    document.documentElement.classList.add("kkc-on");
    hydrate();
  }
  function hydrate() {
    if (!document.body) return;
    var els = document.querySelectorAll("[data-consent-src]");
    for (var i = 0; i < els.length; i++) {
      els[i].src = els[i].getAttribute("data-consent-src");
      els[i].removeAttribute("data-consent-src");
    }
  }

  /* ---------- UI ---------- */
  var css = "" +
    ".kkc{position:fixed;inset:auto 0 0 0;z-index:200;padding:14px;display:flex;justify-content:center}" +
    ".kkc-box{width:min(720px,100%);background:rgba(15,14,12,.96);backdrop-filter:blur(14px);border:1px solid rgba(233,200,126,.34);border-radius:20px;padding:24px 26px;box-shadow:0 -20px 60px -20px rgba(0,0,0,.8),0 0 50px -18px rgba(213,171,95,.35);color:#c9c4b8;font:400 14px/1.65 'Outfit',system-ui,sans-serif}" +
    ".kkc-box h3{font:700 15px/1.3 'Syne',system-ui,sans-serif;text-transform:uppercase;letter-spacing:.08em;color:#f6f3ec;margin:0 0 8px}" +
    ".kkc-box p{margin:0 0 16px}" +
    ".kkc-box a{color:#f2d998;text-decoration:underline}" +
    ".kkc-btns{display:flex;gap:10px;flex-wrap:wrap}" +
    ".kkc-btns button{flex:1 1 180px;cursor:pointer;border-radius:999px;padding:14px 22px;font:600 12px/1 'Outfit',system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;transition:.3s}" +
    ".kkc-accept{border:none;background:linear-gradient(120deg,#b8893f,#d5ab5f 45%,#f2d998);color:#1c1305}" +
    ".kkc-accept:hover{box-shadow:0 10px 30px -10px rgba(213,171,95,.7)}" +
    ".kkc-decline{background:none;border:1px solid rgba(233,200,126,.34);color:#f6f3ec}" +
    ".kkc-decline:hover{background:rgba(233,200,126,.1)}" +
    ".kkc-fab{position:fixed;left:14px;bottom:14px;z-index:199;width:44px;height:44px;border-radius:50%;border:1px solid rgba(233,200,126,.34);background:rgba(11,11,13,.75);backdrop-filter:blur(8px);color:#f2d998;cursor:pointer;display:grid;place-items:center;transition:.3s}" +
    ".kkc-fab:hover{background:rgba(213,171,95,.18)}" +
    ".kkc-fab svg{width:20px;height:20px}" +
    "@media(max-width:700px){.kkc-fab{bottom:88px}}" +
    /* Noch nicht freigegebene Bilder ausblenden (kein Broken-Image/Alt-Text) */
    "img[data-consent-src]{display:none!important}" +
    /* Platzhalter-Hinweis für blockierte Bilder */
    "html:not(.kkc-on) .pic::before,html:not(.kkc-on) .about-pic::before,html:not(.kkc-on) .caro figure::before{" +
    "content:'Bild wird erst nach Einwilligung geladen (Cookie-Einstellungen)';position:absolute;left:50%;top:50%;" +
    "transform:translate(-50%,-50%);z-index:1;width:82%;text-align:center;color:#94907f;" +
    "font:500 12px/1.6 'Outfit',system-ui,sans-serif;letter-spacing:.04em}";

  var banner = null, fab = null;

  function hideBanner() {
    if (banner) { banner.remove(); banner = null; }
    showFab();
  }
  function showFab() {
    if (fab || !read()) return;
    fab = document.createElement("button");
    fab.className = "kkc-fab";
    fab.type = "button";
    fab.setAttribute("aria-label", "Cookie-Einstellungen öffnen");
    fab.title = "Cookie-Einstellungen";
    fab.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/><path d="M9.5 12l2 2 3.5-4"/></svg>';
    fab.onclick = openBanner;
    document.body.appendChild(fab);
  }
  function openBanner() {
    if (banner) return;
    if (fab) { fab.remove(); fab = null; }
    banner = document.createElement("div");
    banner.className = "kkc";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Datenschutz-Einstellungen");
    banner.innerHTML =
      '<div class="kkc-box">' +
      '<h3>Ihre Privatsphäre</h3>' +
      '<p>Diese Website bindet externe Inhalte ein: Bilder über das Wix-CDN (Wix.com Ltd.) und Schriften von Google Fonts (Google Ireland Ltd.). ' +
      'Diese Inhalte werden <strong>erst nach Ihrer Einwilligung</strong> geladen – dabei wird Ihre IP-Adresse an die Anbieter übertragen. ' +
      'Ihre Auswahl wird nur lokal in Ihrem Browser gespeichert und kann jederzeit über „Cookie-Einstellungen“ (Footer bzw. Schild-Symbol) geändert werden. ' +
      '<a href="datenschutz.html">Datenschutzerklärung</a> · <a href="impressum.html">Impressum</a></p>' +
      '<div class="kkc-btns">' +
      '<button type="button" class="kkc-accept">Alle akzeptieren</button>' +
      '<button type="button" class="kkc-decline">Nur notwendige</button>' +
      '</div></div>';
    banner.querySelector(".kkc-accept").onclick = function () {
      write(true); enableMedia(); hideBanner();
    };
    banner.querySelector(".kkc-decline").onclick = function () {
      var had = read(); var hadMedia = had && had.media;
      write(false); hideBanner();
      if (hadMedia) location.reload(); // bereits geladene externe Inhalte entfernen
    };
    document.body.appendChild(banner);
  }

  /* Früh (synchron im <head>): Klasse & Fonts setzen, damit nichts flackert */
  var stored = read();
  if (stored && stored.media) enableMedia();

  function init() {
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
    if (stored && stored.media) hydrate();
    if (!read()) openBanner(); else showFab();
    document.querySelectorAll("[data-kkc-open]").forEach(function (a) {
      a.addEventListener("click", function (e) { e.preventDefault(); openBanner(); });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else { init(); }

  window.KKC = { open: openBanner, get: read };
})();
