/*
 * The navy sidebar — a copy of AppSidebar in
 * meal-mis-frontend/src/components/app-sidebar.tsx: SNV logo, RAYEE II /
 * MEAL MIS, the menu groups (fold and unfold, remembered in this browser),
 * the picked entry in blue, the signed-in person at the bottom. The button
 * beside the logo shrinks it to icons (remembered too). On phones it is a
 * drawer opened from the top bar.
 */
(function (App) {
  const { t, icon, asset, NAV_GROUPS, can, navLink, initials } = App;

  const FOLD_KEY = "sidebar-groups";
  const COLLAPSE_KEY = "sidebar-collapsed";

  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback;
    } catch {
      return fallback;
    }
  };
  const write = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage blocked: works until the page reloads */
    }
  };

  let folded = read(FOLD_KEY, {});
  let collapsed = read(COLLAPSE_KEY, false);

  function Sidebar({ user, active }) {
    const roleName = App.roles.find((r) => r.key === user.role)?.label ?? "";
    return `
    <aside data-sidebar class="${collapsed ? "md:w-[4.5rem]" : "md:w-64"} fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col bg-sidebar text-sidebar-foreground transition-[transform,width] duration-200 md:sticky md:top-0 md:h-screen md:translate-x-0 data-[open=true]:translate-x-0">
      <div class="border-b border-slate-800/80 ${collapsed ? "flex items-center justify-center p-2" : "px-5 py-4"}">
        <div class="flex items-center ${collapsed ? "flex-col justify-center gap-2" : "gap-3"}">
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
            <img src="${asset("assets/partners/snv.png")}" alt="SNV" class="h-full w-auto" />
          </span>
          ${
            collapsed
              ? ""
              : `<div class="min-w-0 leading-tight">
                  <p class="truncate text-sm font-bold tracking-wider text-white">RAYEE II</p>
                  <p class="truncate text-[11px] font-semibold uppercase tracking-wider text-slate-400">MEAL MIS</p>
                </div>`
          }
          <button type="button" data-collapse aria-label="${t("Toggle Sidebar")}"
            class="hidden rounded-md p-1 text-slate-400 hover:text-white md:inline-flex ${collapsed ? "" : "ml-auto"}">
            ${icon("panel-left", "h-4 w-4")}
          </button>
          <button type="button" data-drawer-close aria-label="${t("Close menu")}"
            class="ml-auto rounded-md p-1 text-slate-400 hover:text-white md:hidden">
            ${icon("x", "h-4 w-4")}
          </button>
        </div>
      </div>

      <nav class="sidebar-scroll flex min-h-0 flex-1 flex-col overflow-y-auto pb-4">
        ${NAV_GROUPS.map((group) => {
          const items = group.items.filter((i) => can(user, i.module));
          if (items.length === 0) return "";
          const foldable = items.length > 1;
          const open = collapsed || !foldable || !folded[group.label] || items.some((i) => i.href === active);
          return `
          <div class="${collapsed ? "pt-2" : "px-3 pt-5"}">
            ${
              collapsed
                ? ""
                : foldable
                  ? `<button type="button" data-fold="${group.label}" aria-expanded="${open}"
                      class="flex h-auto w-full items-center justify-between px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200">
                      ${t(group.label)}
                      ${icon("chevron-down", `h-3 w-3 transition-transform ${open ? "" : "-rotate-90"}`)}
                    </button>`
                  : `<p class="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">${t(group.label)}</p>`
            }
            ${
              open
                ? `<ul class="mt-2 flex flex-col gap-1">
                    ${items
                      .map((item) => {
                        const on = item.href === active;
                        return `
                      <li class="${collapsed ? "mb-1 flex justify-center" : ""}">
                        <a href="${navLink(item)}" title="${t(item.name)}"
                          class="group/nav flex items-center rounded-lg transition-colors ${collapsed ? "h-10 w-10 justify-center p-0" : "gap-3 px-3 py-2 text-xs"} ${
                            on
                              ? "bg-blue-600/20 font-medium text-white shadow-sm hover:bg-blue-600/25"
                              : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                          }">
                          ${icon(item.icon, `h-4 w-4 shrink-0 ${on ? "text-blue-400" : "text-slate-400 group-hover/nav:text-slate-200"}`)}
                          ${collapsed ? "" : `<span>${t(item.name)}</span>`}
                        </a>
                      </li>`;
                      })
                      .join("")}
                  </ul>`
                : ""
            }
          </div>`;
        }).join("")}
      </nav>

      <div class="border-t border-slate-800/80 bg-[#071322] p-3">
        <div class="flex items-center ${collapsed ? "justify-center" : "gap-3"}">
          <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow ring-2 ring-blue-500/20">${initials(user.fullName)}</div>
          ${
            collapsed
              ? ""
              : `<div class="min-w-0 flex-1">
                  <p class="truncate text-xs font-semibold text-white">${user.fullName}</p>
                  <p class="truncate text-[10px] text-slate-400">${t(roleName)}</p>
                </div>`
          }
        </div>
      </div>
    </aside>
    <div data-drawer-backdrop hidden class="fixed inset-0 z-40 bg-black/50 md:hidden"></div>`;
  }

  function bindSidebar(root, rerender) {
    root.querySelectorAll("[data-fold]").forEach((b) =>
      b.addEventListener("click", () => {
        const g = b.dataset.fold;
        folded = { ...folded, [g]: !folded[g] };
        write(FOLD_KEY, folded);
        rerender();
      }),
    );
    root.querySelector("[data-collapse]")?.addEventListener("click", () => {
      collapsed = !collapsed;
      write(COLLAPSE_KEY, collapsed);
      rerender();
    });
    const aside = root.querySelector("[data-sidebar]");
    const backdrop = root.querySelector("[data-drawer-backdrop]");
    const setOpen = (open) => {
      aside.dataset.open = String(open);
      backdrop.hidden = !open;
    };
    root.querySelector("[data-drawer-open]")?.addEventListener("click", () => setOpen(true));
    root.querySelector("[data-drawer-close]")?.addEventListener("click", () => setOpen(false));
    backdrop?.addEventListener("click", () => setOpen(false));
  }

  Object.assign(App, { Sidebar, bindSidebar });
})((window.App = window.App || {}));
