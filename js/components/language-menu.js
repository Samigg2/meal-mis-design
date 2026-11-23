/*
 * EN / አማ pill that opens a small menu — a copy of
 * meal-mis-frontend/src/components/language-switch.tsx (LanguageMenu).
 * LanguageMenu() gives the HTML; bindLanguageMenu(root) makes it work.
 *   place     — where the menu sits (e.g. "absolute right-3 top-3")
 *   size      — height/padding of the pill (React merges these with tailwind-merge;
 *               here they are passed apart so two heights never clash)
 *   className — extra classes for the pill, as in the React component
 */
(function (App) {
  const { getLang, setLang, icon } = App;

const OPTIONS = [
  { value: "en", short: "EN" },
  { value: "am", short: "አማ" },
];

function LanguageMenu({ place = "relative", size = "h-8 px-2.5", className = "" } = {}) {
  const current = OPTIONS.find((o) => o.value === getLang()) ?? OPTIONS[0];
  return `
  <div class="${place} z-20" data-lang-menu>
    <button type="button" aria-label="Language / ቋንቋ" aria-haspopup="menu" aria-expanded="false" data-lang-toggle
      class="inline-flex ${size} items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-blue-200 ${className}">
      ${icon("languages", "h-3.5 w-3.5 text-slate-400")}
      ${current.short}
      ${icon("chevron-down", "h-3 w-3 text-slate-400")}
    </button>
    <div role="menu" data-lang-list hidden
      class="absolute right-0 top-full z-50 mt-1 min-w-[90px] overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-700 shadow-md">
      ${OPTIONS.map(
        (o) => `
        <button type="button" role="menuitem" data-lang="${o.value}"
          class="relative flex w-full cursor-pointer select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900">
          <span class="flex-1 text-left font-semibold">${o.short}</span>
          ${getLang() === o.value ? icon("check", "h-4 w-4 text-blue-600") : ""}
        </button>`,
      ).join("")}
    </div>
  </div>`;
}

const closeAll = () =>
  document.querySelectorAll("[data-lang-menu]").forEach((m) => {
    m.querySelector("[data-lang-list]").hidden = true;
    m.querySelector("[data-lang-toggle]").setAttribute("aria-expanded", "false");
  });

let pageListeners = false;

function bindLanguageMenu(root) {
  if (!pageListeners) {
    pageListeners = true;
    document.addEventListener("click", closeAll);
    document.addEventListener("keydown", (e) => e.key === "Escape" && closeAll());
  }
  root.querySelectorAll("[data-lang-menu]").forEach((menu) => {
    const toggle = menu.querySelector("[data-lang-toggle]");
    const list = menu.querySelector("[data-lang-list]");
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = list.hidden;
      closeAll();
      list.hidden = !open;
      toggle.setAttribute("aria-expanded", String(open));
    });
    list.querySelectorAll("[data-lang]").forEach((b) =>
      b.addEventListener("click", () => {
        closeAll();
        setLang(b.dataset.lang);
      }),
    );
  });
}

  Object.assign(App, { LanguageMenu, bindLanguageMenu });
})((window.App = window.App || {}));
