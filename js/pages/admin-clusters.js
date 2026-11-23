/*
 * Administration › Clusters — a copy of admin.clusters.index.tsx: the tiles,
 * "Clusters" (or "Your cluster" for a cluster admin), Region pill, Add cluster,
 * and the list (Cluster + description, Code, Region, People, Edit).
 * Data: store.list("clusters", user) — GET /admin/clusters
 */
(function (App) {
  const { t, icon, esc, store, startPage, page, ROUTES, BTN, DataTable, bindDataTable, AdminTiles, AdminHeading, ADMIN_TRAIL, Avatar, userCluster } = App;

  const table = { q: "", filters: {}, page: 1, size: 8 };

  function render(user) {
    const national = !userCluster(user);
    const users = store.all("users");
    const rows = store.all("clusters").filter((c) => national || c.id === user.clusterId);
    return `
    <div class="flex flex-col gap-6">
      ${AdminTiles("clusters")}
      ${AdminHeading({
        title: national ? "Clusters" : "Your cluster",
        info: national
          ? "The programme runs through clusters, grouped by region for reporting. A cluster owns the records its team collects."
          : "Your cluster owns the records your team collects. Its name and region are programme-wide, so only a super admin changes them.",
      })}
      ${DataTable(table, {
        rows,
        noun: "records",
        selectable: false,
        searchPlaceholder: "Search by cluster name or code...",
        searchText: (c) => `${c.name} ${c.code}`,
        filterMode: "pills",
        filters: [{ key: "region", label: "Region", options: [...new Set(rows.map((c) => c.region))].map((r) => [r, r]), test: (c, v) => c.region === v }],
        right: `
          ${user.role === "super_admin" ? `<a href="${page("admin-cluster.html")}" class="${BTN.primary}">${icon("plus", "h-4 w-4")} ${t("Add cluster")}</a>` : ""}
          <a href="${ROUTES.nextPhase("Export CSV")}" class="${BTN.icon}" title="${t("Export CSV")}">${icon("download", "h-4 w-4")}</a>`,
        rowHref: (c) => page(`admin-cluster.html?id=${c.id}`),
        columns: [
          {
            key: "name", header: "Cluster",
            cell: (c) => `<div class="flex items-center gap-3">${Avatar(c.name, "h-8 w-8 text-[11px]")}<div class="leading-tight"><p class="text-[13px] font-semibold text-slate-900">${esc(c.name)}</p><p class="text-xs font-medium text-slate-500">${esc(c.description ?? "")}</p></div></div>`,
          },
          { key: "code", header: "Code", cell: (c) => `<span class="font-mono text-[13px] text-slate-700">${esc(c.code)}</span>` },
          { key: "region", header: "Region", cell: (c) => `<span class="text-[13px] text-slate-600">${esc(t(c.region))}</span>` },
          { key: "people", header: "People", className: "text-right", cell: (c) => `<span class="text-[13px] font-semibold text-slate-800">${users.filter((u) => u.clusterId === c.id).length}</span>` },
        ],
        actions: (c) => `<a href="${page(`admin-cluster.html?id=${c.id}`)}" class="${BTN.ghostIcon}" title="${t("Edit")}">${icon("pencil", "h-4 w-4")}</a>`,
      })}
    </div>`;
  }

  startPage({
    active: "/admin",
    module: "admin",
    title: "Clusters",
    trail: [...ADMIN_TRAIL, { label: "Clusters" }],
    render,
    bind: (root, user, rerender) => bindDataTable(root, table, rerender),
  });
  App.showPendingToast();
})((window.App = window.App || {}));
