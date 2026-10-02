// Shared behaviour for the Stocks and Feedback pages: theme + site switcher.
(function () {
  var root = document.documentElement;

  // Same storage key as the wiki, so the chosen theme carries across.
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  var pref = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  root.setAttribute("saved-theme", saved || pref);

  document.addEventListener("click", function (e) {
    var t = e.target;
    if (!(t instanceof Element)) return;

    var toggle = t.closest(".theme-switch");
    if (toggle) {
      var next = root.getAttribute("saved-theme") === "dark" ? "light" : "dark";
      root.setAttribute("saved-theme", next);
      try { localStorage.setItem("theme", next); } catch (err) {}
      document.dispatchEvent(new CustomEvent("themechange", { detail: { theme: next } }));
      return;
    }

    var btn = t.closest(".site-switcher-btn");
    var all = document.querySelectorAll(".site-switcher");
    for (var i = 0; i < all.length; i++) {
      var sw = all[i];
      var open = btn && sw.contains(btn) && !sw.classList.contains("open");
      sw.classList.toggle("open", !!open);
      var b = sw.querySelector(".site-switcher-btn");
      var m = sw.querySelector(".site-switcher-menu");
      if (b) b.setAttribute("aria-expanded", open ? "true" : "false");
      if (m) m.hidden = !open;
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    var all = document.querySelectorAll(".site-switcher.open");
    for (var i = 0; i < all.length; i++) {
      all[i].classList.remove("open");
      var m = all[i].querySelector(".site-switcher-menu");
      if (m) m.hidden = true;
    }
  });
})();
