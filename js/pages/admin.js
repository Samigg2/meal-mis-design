/*
 * Administration › Users — a copy of meal-mis-frontend/src/routes/_authenticated/admin.index.tsx:
 * the tiles, then "Users" (or "People in your cluster" for a cluster admin):
 * search, Cluster / Role / Status pills, Invite people, and the table
 * (Person, Role, Cluster, Status, Actions: Edit, Deactivate/Reactivate, Delete).
 * Data: store.list("users", user) — GET /admin/users (cluster-scoped).
 */
(function (App) {
  const { t, icon, esc, store, startPage, page, ROUTES, BTN, DataTable, bindDataTable, AdminTiles, AdminHeading, ADMIN_TRAIL, RolePill, Avatar, toast, confirmDialog, userCluster } = App;

  const table = { q: "", filters: {}, page: 1, size: 8 };

  function render(user) {
    const national = !userCluster(user);
    const rows = store.list("users", user);
    const clusters = store.all("clusters");
    const clusterName = (id) => clusters.find((c) => c.id === id)?.name;
    return `
    <div class="flex flex-col gap-6">
      ${AdminTiles("users")}
      ${AdminHeading({
        title: national ? "Users" : "People in your cluster",
        info: national
          ? "A role decides which modules someone can open; their cluster decides whose records they see. Open a person to change either."
          : "The people in your cluster. Other clusters are managed by their own teams.",
      })}
      ${DataTable(table, {
        rows,
        noun: "users",
        selectable: false,
        searchPlaceholder: "Search by name or email...",
        searchText: (u) => `${u.fullName} ${u.email}`,
        filterMode: "pills",
        filters: [
          ...(national ? [{ key: "cluster", label: "Cluster", options: [["", "National · all clusters"], ...clusters.map((c) => [c.id, c.name])].filter(([v]) => v), test: (u, v) => u.clusterId === v }] : []),
          { key: "role", label: "Role", options: store.all("roles").map((r) => [r.key, r.label]), test: (u, v) => u.role === v },
          { key: "status", label: "Status", options: [["active", "Active"], ["disabled", "Deactivated"]], test: (u, v) => u.status === v },
        ],
        right: `
          <a href="${page("admin-invite.html")}" class="${BTN.primary}">${icon("user-plus", "h-4 w-4")} ${t("Invite people")}</a>
          <a href="${ROUTES.nextPhase("Export CSV")}" class="${BTN.icon}" title="${t("Export CSV")}">${icon("download", "h-4 w-4")}</a>`,
        columns: [
          {
            key: "person", header: "Person",
            cell: (u) => `
              <div class="flex items-center gap-3">
                ${Avatar(u.fullName, "h-8 w-8 text-[11px]")}
                <div class="min-w-0 leading-tight">
                  <p class="truncate text-[13px] font-semibold text-slate-900">${esc(u.fullName)} ${u.id === user.id ? `<span class="font-normal text-slate-500">(${t("you")})</span>` : ""}</p>
                  <p class="truncate text-xs text-slate-500">${esc(u.email)}</p>
                </div>
              </div>`,
          },
          { key: "role", header: "Role", cell: (u) => RolePill(u.role) },
          { key: "cluster", header: "Cluster", cell: (u) => `<span class="text-[13px] text-slate-600">${u.clusterId ? esc(clusterName(u.clusterId) ?? "—") : t("National · all clusters")}</span>` },
          {
            key: "status", header: "Status",
            cell: (u) =>
              u.status === "active"
                ? `<span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600"><span class="h-2 w-2 rounded-full bg-emerald-500"></span>${t("Active")}</span>`
                : `<span class="inline-flex items-center gap-1.5 text-[13px] font-semibold text-slate-500"><span class="h-2 w-2 rounded-full bg-slate-400"></span>${t("Deactivated")}</span>`,
          },
        ],
        actions: (u) => `
          <a href="${ROUTES.nextPhase("Edit user")}" class="${BTN.ghostIcon}" title="${t("Edit")}">${icon("pencil", "h-4 w-4")}</a>
          ${
            u.id === user.id
              ? ""
              : `<button type="button" data-toggle="${u.id}" class="${BTN.ghostIcon}" title="${t(u.status === "active" ? "Deactivate" : "Reactivate")}">${icon("power", "h-4 w-4")}</button>
                 <button type="button" data-delete="${u.id}" class="${BTN.ghostIcon} hover:text-destructive" title="${t("Delete")}">${icon("trash-2", "h-4 w-4")}</button>`
          }`,
      })}
    </div>`;
  }

  function bind(root, user, rerender) {
    bindDataTable(root, table, rerender);
    root.querySelectorAll("[data-toggle]").forEach((b) =>
      b.addEventListener("click", async (e) => {
        e.stopPropagation();
        const u = store.get("users", b.dataset.toggle);
        if (u.status === "active") {
          const ok = await confirmDialog({
            title: t("Deactivate {{name}}?", { name: u.fullName }),
            description: t("They can't sign in until reactivated. Their records stay."),
            confirmLabel: t("Deactivate"),
          });
          if (!ok) return;
          store.update("users", u.id, { status: "disabled" });
          toast(t("Account deactivated"));
        } else {
          store.update("users", u.id, { status: "active" });
          toast(t("Account reactivated"));
        }
        rerender();
      }),
    );
    root.querySelectorAll("[data-delete]").forEach((b) =>
      b.addEventListener("click", async (e) => {
        e.stopPropagation();
        const u = store.get("users", b.dataset.delete);
        const ok = await confirmDialog({
          title: t("Delete {{name}}?", { name: u.fullName }),
          description: t("Only accounts that were never used can be deleted. Otherwise, deactivate."),
          confirmLabel: t("Delete"),
          destructive: true,
        });
        if (!ok) return;
        store.remove("users", u.id);
        toast(t("Account deleted"));
        rerender();
      }),
    );
  }

  startPage({ active: "/admin", module: "admin", title: "Administration", trail: [{ label: "System", href: page("admin.html") }, { label: "Administration" }], render, bind });
  App.showPendingToast();
})((window.App = window.App || {}));
