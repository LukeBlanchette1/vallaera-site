import { QuartzComponent, QuartzComponentConstructor } from "./types"

// Ported from the Obsidian Publish publish.js: swipe gestures for the phone
// sidebar, and lazy-loading of images.
const VallaeraScripts: QuartzComponent = () => null

VallaeraScripts.afterDOMLoaded = `
(function () {
  var MOBILE_MAX = 800;      // phone-sized screens only (px)
  var MIN_DIST = 60;         // how far the finger must travel (px)
  var MAX_VERT = 50;         // vertical drift that cancels the swipe (px)
  var MAX_TIME = 700;        // swipe must reach MIN_DIST within this many ms
  var EDGE = 24;             // ignore touches at the very screen edge (browser back gesture)

  var startX = 0, startY = 0, startTime = 0, startTarget = null, tracking = false;

  // Open/close the mobile sidebar by pressing the real menu button.
  function setOpen(want) {
    var explorer = document.querySelector(".explorer");
    var button = document.querySelector(".explorer .mobile-explorer");
    if (!explorer || !button) return;
    var isOpen = !explorer.classList.contains("collapsed");
    if (isOpen !== want) button.click();
  }

  // Don't hijack swipes on tables, code blocks, inputs, or anything that scrolls sideways.
  function inHorizontalScroller(el) {
    while (el && el !== document.body && el.nodeType === 1) {
      if (/^(INPUT|TEXTAREA|SELECT|CANVAS|SVG|TABLE|PRE)$/i.test(el.tagName)) return true;
      if (el.scrollWidth > el.clientWidth + 1) {
        var ox = getComputedStyle(el).overflowX;
        if (ox === "auto" || ox === "scroll") return true;
      }
      el = el.parentElement;
    }
    return false;
  }

  document.addEventListener("touchstart", function (e) {
    tracking = false;
    if (window.innerWidth > MOBILE_MAX || e.touches.length !== 1) return;
    var t = e.touches[0];
    if (t.clientX < EDGE) return;
    startX = t.clientX;
    startY = t.clientY;
    startTime = Date.now();
    startTarget = e.target;
    tracking = true;
  }, { passive: true });

  document.addEventListener("touchmove", function (e) {
    if (!tracking) return;
    var t = e.touches[0];
    var dx = t.clientX - startX;
    var dy = t.clientY - startY;

    // Mostly vertical: it's a normal scroll, stop watching
    if (Math.abs(dy) > MAX_VERT && Math.abs(dy) > Math.abs(dx)) { tracking = false; return; }

    if (Math.abs(dx) >= MIN_DIST && Math.abs(dx) > Math.abs(dy) * 2) {
      tracking = false;
      if (Date.now() - startTime > MAX_TIME) return;
      if (inHorizontalScroller(startTarget)) return;
      setOpen(dx > 0);       // swipe right: open, swipe left: close
    }
  }, { passive: true });

  document.addEventListener("touchend", function () { tracking = false; }, { passive: true });
  document.addEventListener("touchcancel", function () { tracking = false; }, { passive: true });
})();

// Lazy-load images so big maps and handouts don't compete with the note text.
(function () {
  var queued = false;

  function tune() {
    queued = false;
    var imgs = document.querySelectorAll("img:not([loading])");
    Array.prototype.forEach.call(imgs, function (img) {
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
    });
  }

  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(tune);
  }

  tune();
  new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
})();
`

export default (() => VallaeraScripts) satisfies QuartzComponentConstructor
