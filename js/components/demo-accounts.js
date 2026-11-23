/*
 * DESIGN ONLY — not part of the real system. A small "Demo accounts" pill
 * under the sign-in card; clicking it opens a short list (upward, over the
 * card), and picking an account fills the form. Drop it when this becomes the real app.
 *   DemoAccounts(accounts, open) — the HTML
 *   bindDemoAccounts(root, { onToggle, onPick }) — the clicks
 */
(function (App) {
  const { t, icon } = App;

  const SEES = {
    National: "Sees every cluster",
    "Oromia cluster": "Sees Oromia only",
    "Amhara cluster": "Sees Amhara only",
  };

  function DemoAccounts(accounts, open) {
    return `
    <div class="relative mt-3 flex justify-center" data-demo-menu>
      <button type="button" data-demo-toggle aria-haspopup="menu" aria-expanded="${open}"
        class="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-md transition-colors hover:border-cyan-400/60 hover:text-white">
        ${icon("user-round", "h-3.5 w-3.5 text-cyan-300")}
        ${t("Demo accounts")}
        ${icon("chevron-down", `h-3 w-3 transition-transform ${open ? "" : "rotate-180"}`)}
      </button>
      ${
        open
          ? `<div role="menu"
              class="absolute bottom-full left-1/2 z-30 mb-1.5 w-64 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-slate-700 shadow-xl">
              ${accounts
                .map(
                  (a) => `
                <button type="button" role="menuitem" data-demo="${a.id}"
                  class="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-100">
                  ${icon(a.clusterId ? "map-pin" : "globe", "h-4 w-4 shrink-0 text-blue-600")}
                  <span class="min-w-0 flex-1 leading-tight">
                    <span class="block text-xs font-semibold text-slate-900">${t(a.kind)}</span>
                    <span class="block truncate text-[11px] text-slate-500">${t(SEES[a.kind] ?? "")}</span>
                  </span>
                </button>`,
                )
                .join("")}
            </div>`
          : ""
      }
    </div>`;
  }

  function bindDemoAccounts(root, { onToggle, onPick }) {
    const menu = root.querySelector("[data-demo-menu]");
    if (!menu) return;
    menu.querySelector("[data-demo-toggle]").addEventListener("click", (e) => {
      e.stopPropagation();
      onToggle();
    });
    menu.querySelectorAll("[data-demo]").forEach((b) =>
      b.addEventListener("click", () => onPick(b.dataset.demo)),
    );
  }

  Object.assign(App, { DemoAccounts, bindDemoAccounts });
})((window.App = window.App || {}));
