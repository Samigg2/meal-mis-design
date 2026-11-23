/*
 * Participants list — a copy of meal-mis-frontend/src/routes/_authenticated/participants.index.tsx:
 * four tinted cards (Total, Active, Female, With disability), then the table
 * with search, Filters (Status, Review, Sex, Disability, Region, Priority sector),
 * Bulk import, Export CSV and Add participant.
 * Data: store.list("participants", user) — GET /participants (cluster-scoped).
 */
(function (App) {
  const { t, icon, esc, num, fmtPct, pctOf, store, StatCards, DataTable, bindDataTable, PersonCell, StatusBadge, ReviewBadge, BTN, startPage, page, ROUTES, can, lookups, places, userCluster } = App;

  const table = { q: "", filters: {}, page: 1, size: 8 };

  function render(user) {
    const rows = store.list("participants", user);
    const active = rows.filter((p) => p.status === "active").length;
    const female = rows.filter((p) => p.sex === "female").length;
    const disab = rows.filter((p) => p.disability).length;
    const cluster = userCluster(user);
    const regions = cluster ? [cluster.region] : Object.keys(places);
    const canWrite = can(user, "participants", "write");

    return `
    <div class="flex flex-col gap-5">
      ${StatCards([
        { tone: "blue", icon: "users", label: "Total participants", value: num(rows.length), sub: t("All registered"), pct: 100 },
        { tone: "green", icon: "user-check", label: "Active", value: num(active), sub: t("{{pct}} of total", { pct: fmtPct(pctOf(active, rows.length)) }), pct: pctOf(active, rows.length) },
        { tone: "purple", icon: "venus", label: "Female", value: num(female), sub: t("{{pct}} of total", { pct: fmtPct(pctOf(female, rows.length)) }), pct: pctOf(female, rows.length) },
        { tone: "amber", icon: "accessibility", label: "With disability", value: num(disab), sub: t("{{pct}} of total", { pct: fmtPct(pctOf(disab, rows.length)) }), pct: pctOf(disab, rows.length) },
      ])}
      ${DataTable(table, {
        rows,
        noun: "participants",
        searchPlaceholder: "Search by name, ID or phone...",
        searchText: (p) => `${p.fullName} ${p.code} ${p.phone} ${p.nationalId ?? ""}`,
        filterMode: "popover",
        filters: [
          { key: "status", label: "Status", options: [["active", "Active"], ["inactive", "Inactive"]], test: (p, v) => p.status === v },
          { key: "review", label: "Review", options: [["pending", "Pending"], ["approved", "Approved"], ["rejected", "Rejected"]], test: (p, v) => p.review === v },
          { key: "sex", label: "Sex", options: [["male", "Male"], ["female", "Female"]], test: (p, v) => p.sex === v },
          { key: "disability", label: "Disability", options: [["yes", "With disability"], ["no", "No disability"]], test: (p, v) => p.disability === (v === "yes") },
          { key: "region", label: "Region", options: regions.map((r) => [r, r]), test: (p, v) => p.region === v },
          { key: "priority", label: "Priority sector", options: lookups["participants.priority_sector"], test: (p, v) => p.priorities.includes(v) },
        ],
        right: `
          ${canWrite ? `<a href="${ROUTES.nextPhase("Bulk import")}" class="${BTN.outline}">${icon("upload", "h-4 w-4")} ${t("Bulk import")}</a>` : ""}
          <a href="${ROUTES.nextPhase("Export CSV")}" class="${BTN.outline}">${icon("download", "h-4 w-4")} ${t("Export CSV")}</a>
          ${canWrite ? `<a href="${page("participant-new.html")}" class="${BTN.primary}">${icon("plus", "h-4 w-4")} ${t("Add participant")}</a>` : ""}`,
        rowHref: (p) => page(`participant.html?id=${p.id}`),
        columns: [
          { key: "who", header: "Participant", cell: (p) => PersonCell(p.fullName, p.code, page(`participant.html?id=${p.id}`)) },
          { key: "sex", header: "Sex", cell: (p) => `<span class="text-[13px] text-slate-600">${t(p.sex === "female" ? "Female" : "Male")}</span>` },
          { key: "phone", header: "Phone", cell: (p) => `<span class="font-mono text-[13px] text-slate-600">${esc(p.phone)}</span>` },
          { key: "where", header: "Location", cell: (p) => `<span class="block max-w-[160px] truncate text-[13px] text-slate-600">${esc(p.woreda)}, ${esc(t(p.region))}</span>` },
          { key: "status", header: "Status", cell: (p) => StatusBadge(p.status) },
          { key: "review", header: "Review", cell: (p) => ReviewBadge(p.review) },
        ],
        actions: (p) => `
          <a href="${page(`participant.html?id=${p.id}`)}" class="${BTN.ghostIcon}" title="${t("View")}" aria-label="${t("View")}">${icon("eye", "h-4 w-4")}</a>
          ${canWrite ? `<a href="${page(`participant-new.html?edit=${p.id}`)}" class="${BTN.ghostIcon}" title="${t("Edit")}" aria-label="${t("Edit")}">${icon("pencil", "h-4 w-4")}</a>` : ""}
          <a href="${ROUTES.nextPhase("More actions")}" class="${BTN.ghostIcon}" title="${t("More")}" aria-label="${t("More")}">${icon("ellipsis", "h-4 w-4")}</a>`,
      })}
    </div>`;
  }

  startPage({
    active: "/participants",
    module: "participants",
    title: "Participants",
    trail: [{ label: "Programme data", href: page("participants.html") }, { label: "Participants" }],
    render,
    bind: (root, user, rerender) => bindDataTable(root, table, rerender),
  });
  App.showPendingToast();
})((window.App = window.App || {}));
