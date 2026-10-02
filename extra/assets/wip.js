// "WORK IN PROGRESS" banner shown across the Stocks and Calendar pages.
// It is see-through and ignores clicks, so the page underneath stays visible and usable.
// To remove it everywhere: delete the <script src="/assets/wip.js"> line from those pages.
(function () {
  var css =
    ".wip-band{position:fixed;left:-25vw;width:150vw;height:clamp(60px,10vw,112px);display:flex;align-items:center;" +
    "overflow:hidden;pointer-events:none;z-index:2147483000;transform:rotate(-11deg);background:rgba(12,12,12,0.58);" +
    "box-shadow:0 0 0 1px rgba(255,255,255,0.08);}" +
    ".wip-band::before,.wip-band::after{content:'';position:absolute;left:0;right:0;height:9px;" +
    "background:repeating-linear-gradient(45deg,#111 0 12px,#f5c518 12px 24px);}" +
    ".wip-band::before{top:0}.wip-band::after{bottom:0}" +
    ".wip-band span{display:block;white-space:nowrap;font:900 clamp(24px,5.6vw,60px)/1 Inter,Arial,sans-serif;" +
    "letter-spacing:0.14em;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,0.5);padding-left:2vw;}";

  var s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);

  function band(top) {
    var b = document.createElement("div");
    b.className = "wip-band";
    b.setAttribute("aria-hidden", "true");
    b.style.top = top;
    var t = document.createElement("span");
    t.textContent = new Array(8).join("WORK IN PROGRESS   •   ");
    b.appendChild(t);
    return b;
  }

  function add() {
    document.body.appendChild(band("26%"));
    document.body.appendChild(band("62%"));
  }
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
