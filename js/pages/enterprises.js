/*
 * Enterprises list — a copy of meal-mis-frontend/src/routes/_authenticated/enterprises.index.tsx:
 * cards (Total enterprises, Active, Women-led, Inactive), filter pills (Status,
 * Review, Women-led, Led by), and the table with the amber "Same name" flag.
 * Data: store.list("enterprises", user) — GET /enterprises (cluster-scoped).
 */
(function (App) {
  const { t, icon, esc, num, fmtPct, pctOf, store, StatCards, DataTable, bindDataTable, StatusBadge, ReviewBadge, BTN, startPage, page, ROUTES, can, label, initials, enterpriseFacts } = App;

  const table = { q: "", filters: {}, page: 1, size: 8 };

  function render(user) {
    const rows = store.list("enterprises", user);
    const people = Object.fromEntries(store.all("participants").map((p) => [p.id, p]));
    const facts = Object.fromEntries(rows.map((e) => [e.id, enterpriseFacts(e)]));
    const active = rows.filter((e) => e.status === "active").length;
    const inactive = rows.length - active;
    const womenLed = rows.filter((e) => facts[e.id].womenLed).length;
    const names = {};
    store.all("enterprises").forEach((e) => (names[e.name.trim().toLowerCase()] = (names[e.name.trim().toLowerCase()] ?? 0) + 1));
    const share = (n) => t("{{pct}} of total", { pct: fmtPct(pctOf(n, rows.length)) });

    return `
    <div class="flex flex-col gap-5">
      ${StatCards([
        { tone: "blue", icon: "store", label: "Total enterprises", value: num(rows.length), sub: t("All registered"), pct: 100 },
        { tone: "green", icon: "circle-check", label: "Active", value: num(active), sub: share(active), pct: pctOf(active, rows.length) },
        { tone: "purple", icon: "venus", label: "Women-led", value: num(womenLed), sub: share(womenLed), pct: pctOf(womenLed, rows.length) },
        { tone: "amber", icon: "circle-pause", label: "Inactive", value: num(inactive), sub: share(inactive), pct: pctOf(inactive, rows.length) },
      ])}
      ${DataTable(table, {
        rows,
        noun: "enterprises",
        searchPlaceholder: "Search enterprises by name or owner…",
        searchText: (e) => `${e.name} ${e.code} ${people[e.leadId]?.fullName ?? ""}`,
        filterMode: "pills",
        filters: [
          { key: "status", label: "Status", options: [["active", "Active"], ["inactive", "Inactive"]], test: (e, v) => e.status === v },
          { key: "review", label: "Review", options: [["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"]], test: (e, v) => e.review === v },
          { key: "women", label: "Women-led", options: [["yes", "Women-led"], ["no", "Not women-led"]], test: (e, v) => facts[e.id].womenLed === (v === "yes") },
          {
            key: "led", label: "Led by",
            options: [["youth", "Youth"], ["women", "Women"], ["pwd", "A person with a disability"], ["returnee", "A returnee"], ["idp", "An IDP"]],
            test: (e, v) => ({ youth: facts[e.id].youthLed, women: facts[e.id].womenLed, pwd: facts[e.id].pwdLed, returnee: facts[e.id].returneeLed, idp: facts[e.id].idpLed })[v],
          },
        ],
        right: `
          <a href="${ROUTES.nextPhase("Export CSV")}" class="${BTN.icon}" title="${t("Export CSV")}" aria-label="${t("Export CSV")}">${icon("download", "h-4 w-4")}</a>
          ${can(user, "enterprises", "write") ? `<a href="${page("enterprise-new.html")}" class="${BTN.primary}">${icon("plus", "h-4 w-4")} ${t("Add enterprise")}</a>` : ""}`,
        rowHref: (e) => page(`enterprise.html?id=${e.id}`),
        columns: [
          {
            key: "name", header: "Enterprise",
            cell: (e) => `
              <a href="${page(`enterprise.html?id=${e.id}`)}" class="flex items-center gap-3">
                <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[12px] font-bold text-emerald-700">${initials(e.name)}</span>
                <span class="min-w-0">
                  <span class="block truncate text-[13px] font-semibold text-slate-900">${esc(e.name)}
                    ${names[e.name.trim().toLowerCase()] > 1 ? `<span class="ml-1 inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 align-middle text-[10px] font-semibold text-amber-700" title="${t("Another enterprise has the same name")}">${icon("flag", "h-3 w-3")} ${t("Same name")}</span>` : ""}</span>
                  <span class="block font-mono text-[11px] text-slate-400">${esc(e.code)}</span>
                </span>
              </a>`,
          },
          { key: "owner", header: "Owner", cell: (e) => `<span class="text-[13px] text-slate-600">${esc(people[e.leadId]?.fullName ?? "—")}</span>` },
          { key: "size", header: "Size", cell: (e) => `<span class="text-[13px] text-slate-600">${e.size ? esc(label("enterprises.enterprise_size", e.size).split(" (")[0]) : "—"}</span>` },
          { key: "where", header: "Location", cell: (e) => `<span class="block max-w-[170px] truncate text-[13px] text-slate-600" title="${esc(e.woreda)}, ${esc(e.zone)}, ${esc(t(e.region))}">${esc(e.woreda)}, ${esc(e.zone)}, ${esc(t(e.region))}</span>` },
          { key: "status", header: "Status", cell: (e) => StatusBadge(e.status) },
          { key: "review", header: "Review", cell: (e) => ReviewBadge(e.review) },
        ],
        actions: (e) => `<a href="${page(`enterprise.html?id=${e.id}`)}" class="${BTN.ghostIcon}" title="${t("View")}" aria-label="${t("View")}">${icon("eye", "h-4 w-4")}</a>`,
      })}
    </div>`;
  }

  startPage({
    active: "/enterprises",
    module: "enterprises",
    title: "Enterprises",
    trail: [{ label: "Programme data", href: page("enterprises.html") }, { label: "Enterprises" }],
    render,
    bind: (root, user, rerender) => bindDataTable(root, table, rerender),
  });
  App.showPendingToast();
})((window.App = window.App || {}));
