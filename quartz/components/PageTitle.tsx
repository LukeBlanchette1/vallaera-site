import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

// The site title doubles as a switcher between the wiki, the stock market and the
// feedback page. The extra pages live outside Quartz, so their links skip the SPA router.
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
          <a role="menuitem" href="/stocks/" data-router-ignore>
            Vallaera Stocks
          </a>
        </li>
        <li>
          <a role="menuitem" href="/calendar/" data-router-ignore>
            Vallaera Calendar
          </a>
        </li>
        <li>
          <a role="menuitem" href="/feedback/" data-router-ignore>
            Feedback
          </a>
        </li>
      </ul>
    </div>
  )
}

PageTitle.afterDOMLoaded = `
document.addEventListener("click", function (e) {
  var t = e.target;
  if (!(t instanceof Element)) return;
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
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
