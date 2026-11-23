/*
 * The floating top bar — a copy of the <header> in
 * meal-mis-frontend/src/components/app-shell.tsx: the trail above the page
 * title, the page's own tools, "Search pages…", the language menu, the bell,
 * and the profile menu (navy band, role, what they see, Dashboard,
 * Notifications, Log out — log out has no confirm box, as in the real app).
 *
 *   trail: [{ label, href? }]  — the last one is the page you are on
 *   crumbsOnly: true           — record pages: the trail alone, larger
 */
(function (App) {
  const { t, icon, LanguageMenu, NAV_GROUPS, can, navLink, initials, userCluster, esc } = App;

  function TopBar({ user, title, trail, tools = "", crumbsOnly = false }) {
    const roleName = App.roles.find((r) => r.key === user.role)?.label ?? "No role";
    const cluster = userCluster(user);
    const n = App.notifications.total;
    return `
    <header class="sticky top-3 z-30 mx-4 mt-3 flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm md:mx-6 md:px-6">
      <button type="button" data-drawer-open aria-label="${t("Open menu")}"
        class="-ml-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-accent md:hidden">
        ${icon("panel-left", "h-4 w-4")}
      </button>
      <div class="flex min-w-0 flex-1 flex-col-reverse">
        ${crumbsOnly ? "" : `<p class="truncate text-lg font-bold leading-snug tracking-tight text-slate-900">${esc(t(title))}</p>`}
        <nav aria-label="Breadcrumb" class="${crumbsOnly ? "text-[13px] font-medium text-slate-500" : "text-[11px] font-medium text-slate-500"}">
          <ol class="flex min-w-0 items-center gap-1.5">
            ${trail
              .map((c, i) => {
                const last = i === trail.length - 1;
                return `
              <li class="flex min-w-0 items-center gap-1 ${i > 0 && !last ? "max-sm:hidden" : ""} ${i === 0 && trail.length > 1 ? "max-sm:hidden" : ""}">
                ${i > 0 ? icon("chevron-right", `shrink-0 text-slate-400 max-sm:hidden ${crumbsOnly ? "h-3.5 w-3.5" : "h-2.5 w-2.5"}`) : ""}
                ${
                  c.href && !last
                    ? `<a href="${c.href}" class="truncate hover:text-foreground hover:underline">${esc(t(c.label))}</a>`
                    : `<span class="truncate ${last ? (crumbsOnly ? "font-semibold text-slate-900" : "font-semibold text-slate-700") : ""}" ${last ? 'aria-current="page"' : ""}>${esc(t(c.label))}</span>`
                }
              </li>`;
              })
              .join("")}
          </ol>
        </nav>
      </div>

      <div class="flex items-center gap-2">${tools}</div>

      <div class="relative hidden w-44 md:block xl:w-48" data-top-search>
        ${icon("search", "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400")}
        <input type="search" aria-label="${t("Search pages")}" placeholder="${t("Search pages…")}"
          class="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 pl-8 pr-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-blue-500" />
        <ul data-search-list hidden class="absolute left-0 right-0 top-11 z-40 overflow-hidden rounded-lg border bg-popover py-1 shadow-md"></ul>
      </div>

      ${LanguageMenu()}

      <a href="${App.ROUTES.nextPhase("Notifications")}" title="${t("Notifications")}"
        aria-label="${n ? t("Notifications, {{n}} new", { n }) : t("Notifications")}"
        class="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 shadow-sm hover:bg-slate-100 hover:text-slate-900">
        ${icon("bell", "h-3.5 w-3.5")}
        ${n > 0 ? `<span class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white ring-2 ring-white">${n > 99 ? "99+" : n}</span>` : ""}
      </a>

      <div class="relative" data-profile>
        <button type="button" data-profile-toggle aria-label="${t("Profile menu")}"
          class="flex items-center gap-2.5 rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-200 2xl:rounded-xl 2xl:py-1 2xl:pl-1 2xl:pr-2 2xl:hover:bg-accent">
          <span class="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-sm ring-2 ring-blue-500/20">${initials(user.fullName)}</span>
          <span class="hidden min-w-0 text-left leading-tight 2xl:block">
            <span class="block max-w-[140px] truncate text-sm font-semibold text-ink">${esc(user.fullName)}</span>
            <span class="block text-xs text-muted-foreground">${t("View profile")}</span>
          </span>
          ${icon("chevron-down", "hidden h-4 w-4 text-muted-foreground 2xl:block")}
        </button>
        <div data-profile-menu hidden
          class="absolute right-0 top-full z-50 mt-1 w-60 overflow-hidden rounded-xl border border-line bg-white p-0 text-slate-700 shadow-[0_8px_30px_rgba(15,23,42,.12)]">
          <div class="flex items-center gap-2.5 bg-[#1e3a5f] px-3 py-2.5">
            <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 text-[13px] font-bold text-white ring-2 ring-white/10">${initials(user.fullName)}</span>
            <div class="min-w-0">
              <p class="truncate text-[13px] font-semibold text-white">${esc(user.fullName)}</p>
              <p class="truncate text-[11px] text-blue-100/80">${esc(user.email)}</p>
            </div>
          </div>
          <dl class="divide-y divide-line-soft px-3 py-0.5 text-xs">
            <div class="flex items-center justify-between gap-3 py-1.5">
              <dt class="text-muted-foreground">${t("Role")}</dt>
              <dd class="truncate font-medium text-ink">${t(roleName)}</dd>
            </div>
            <div class="flex items-center justify-between gap-3 py-1.5">
              <dt class="text-muted-foreground">${t("Sees")}</dt>
              <dd class="truncate font-medium text-ink">${cluster ? t(cluster.region) : t("Every cluster")}</dd>
            </div>
          </dl>
          <div class="h-px bg-slate-100"></div>
          <div class="p-1">
            <a href="${App.asset("pages/dashboard.html")}" class="flex items-center rounded-md px-2.5 py-1.5 text-[13px] hover:bg-slate-100">
              ${icon("layout-dashboard", "mr-2 h-4 w-4 text-muted-foreground")} ${t("Dashboard")}
            </a>
            <a href="${App.ROUTES.nextPhase("Notifications")}" class="flex items-center rounded-md px-2.5 py-1.5 text-[13px] hover:bg-slate-100">
              ${icon("bell", "mr-2 h-4 w-4 text-muted-foreground")} ${t("Notifications")}
            </a>
            <div class="my-1 h-px bg-slate-100"></div>
            <button type="button" data-logout class="flex w-full items-center rounded-md px-2.5 py-1.5 text-left text-[13px] text-red-600 hover:bg-red-50">
              ${icon("log-out", "mr-2 h-4 w-4")} ${t("Log out")}
            </button>
          </div>
        </div>
      </div>
    </header>`;
  }

  function bindTopBar(root, user) {
    // Profile menu
    const wrap = root.querySelector("[data-profile]");
    const menu = wrap.querySelector("[data-profile-menu]");
    wrap.querySelector("[data-profile-toggle]").addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
    });
    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) menu.hidden = true;
    });
    root.querySelector("[data-logout]").addEventListener("click", () => {
      App.signOut();
      location.replace(App.ROUTES.signIn);
    });

    // Search pages: jump to a section this role can open
    const box = root.querySelector("[data-top-search]");
    const input = box.querySelector("input");
    const list = box.querySelector("[data-search-list]");
    const items = NAV_GROUPS.flatMap((g) => g.items).filter((i) => can(user, i.module));
    const draw = () => {
      const q = input.value.trim().toLowerCase();
      if (!q) return (list.hidden = true);
      const hits = items.filter((i) => t(i.name).toLowerCase().includes(q) || i.name.toLowerCase().includes(q)).slice(0, 6);
      list.innerHTML = hits.length
        ? hits
            .map(
              (m) => `<li><a href="${navLink(m)}" class="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent">
                ${icon(m.icon, "h-4 w-4 text-muted-foreground")} ${t(m.name)}</a></li>`,
            )
            .join("")
        : `<li class="px-3 py-2 text-sm text-muted-foreground">${t("No matching page")}</li>`;
      list.hidden = false;
      App.drawIcons();
    };
    input.addEventListener("input", draw);
    input.addEventListener("focus", draw);
    input.addEventListener("blur", () => setTimeout(() => (list.hidden = true), 150));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") list.querySelector("a")?.click();
      if (e.key === "Escape") list.hidden = true;
    });
  }

  Object.assign(App, { TopBar, bindTopBar });
})((window.App = window.App || {}));
