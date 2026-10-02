// "WORK IN PROGRESS" banner shown across the Stocks and Calendar pages.
// It is see-through and ignores clicks, so the page underneath stays visible and usable.
// To remove it everywhere: delete the <script src="/assets/wip.js"> line from those pages.
(function () {
  var css =
    ".wip-band{position:fixed;left:0;width:100%;height:clamp(46px,6.5vw,76px);display:flex;align-items:center;" +
    "justify-content:space-around;overflow:hidden;pointer-events:none;z-index:2147483000;" +
    "background:rgba(12,12,12,0.58);}" +
    ".wip-band span{display:block;white-space:nowrap;font:700 clamp(16px,2.7vw,32px)/1 Inter,Arial,sans-serif;" +
    "letter-spacing:0.08em;color:#fff;}" +
    "@media (max-width:700px){.wip-band span{font-size:clamp(14px,4.2vw,20px)}.wip-band span:nth-child(3){display:none}}";

  var s = document.createElement("style");
  s.textContent = css;
  document.head.appendChild(s);

  function band(top) {
    var b = document.createElement("div");
    b.className = "wip-band";
    b.setAttribute("aria-hidden", "true");
    b.style.top = top;
    for (var i = 0; i < 3; i++) {
      var t = document.createElement("span");
      t.textContent = "WORK IN PROGRESS";
      b.appendChild(t);
    }
    return b;
  }

  function add() {
    document.body.appendChild(band("26%"));
    document.body.appendChild(band("62%"));
  }
  if (document.body) add(); else document.addEventListener("DOMContentLoaded", add);
})();
