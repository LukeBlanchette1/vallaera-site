import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

// The site title doubles as a menu. For now the Stocks, Calendar and Feedback entries do not
// link anywhere: they open a plain "COMING SOON" box. To turn one back into a link, replace
// its data-coming-soon attribute with the real href (and data-router-ignore).
const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title", "site-switcher")}>
      <button class="site-switcher-btn" type="button" aria-haspopup="menu" aria-expanded="false">
        <span>{title}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      <ul class="site-switcher-menu" role="menu" hidden>
        <li>
          <a role="menuitem" href={baseDir} aria-current="page">
            Vallaera Wiki
          </a>
        </li>
        <li>
          <a role="menuitem" href="#" data-router-ignore data-coming-soon>
            Vallaera Stocks
          </a>
        </li>
        <li>
          <a role="menuitem" href="#" data-router-ignore data-coming-soon>
            Vallaera Calendar
          </a>
        </li>
        <li>
          <a role="menuitem" href="#" data-router-ignore data-coming-soon>
            Feedback
          </a>
        </li>
      </ul>
    </div>
  )
}

PageTitle.afterDOMLoaded = `
function showComingSoon() {
  if (document.getElementById("coming-soon")) return;
  var o = document.createElement("div");
  o.id = "coming-soon";
  o.setAttribute("role", "dialog");
  o.setAttribute("aria-label", "Coming soon");
  var box = document.createElement("div");
  box.className = "coming-soon-box";
  var p = document.createElement("p");
  p.textContent = "COMING SOON";
  var ok = document.createElement("button");
  ok.type = "button";
  ok.textContent = "OK";
  box.appendChild(p);
  box.appendChild(ok);
  o.appendChild(box);
  document.body.appendChild(o);
  function close() { o.remove(); document.removeEventListener("keydown", onKey); }
  function onKey(ev) { if (ev.key === "Escape") close(); }
  ok.addEventListener("click", close);
  o.addEventListener("click", function (ev) { if (ev.target === o) close(); });
  document.addEventListener("keydown", onKey);
  ok.focus();
}
document.addEventListener("click", function (e) {
  var t = e.target;
  if (!(t instanceof Element)) return;
  if (t.closest("[data-coming-soon]")) { e.preventDefault(); showComingSoon(); }
  var btn = t.closest(".site-switcher-btn");
  var all = document.querySelectorAll(".site-switcher");
  for (var i = 0; i < all.length; i++) {
    var sw = all[i];
    var open = !!(btn && sw.contains(btn) && !sw.classList.contains("open"));
    sw.classList.toggle("open", open);
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
`

PageTitle.css = `
.page-title {
  margin: 0;
  position: relative;
}

#coming-soon {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483000;
}

.coming-soon-box {
  background: var(--light);
  color: var(--dark);
  border: 1px solid var(--dark);
  border-radius: 0;
  padding: 1.75rem 3rem 1.5rem;
  text-align: center;
}

.coming-soon-box p {
  margin: 0 0 1.25rem;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: inherit;
}

.coming-soon-box button {
  font: inherit;
  background: none;
  color: inherit;
  border: 1px solid var(--dark);
  border-radius: 0;
  padding: 0.3rem 1.6rem;
  cursor: pointer;
}

.coming-soon-box button:hover {
  background: var(--dark);
  color: var(--light);
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor