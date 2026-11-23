/*
 * Administration › Roles — a copy of meal-mis-frontend/src/routes/_authenticated/admin.roles.index.tsx:
 * the tiles, "Roles" with New role, then the list (role pill + BUILT-IN,
 * code, people, Edit). Super admin only.
 * Data: store.all("roles") + users per role — GET /admin/roles
 */
(function (App) {
  const { t, icon, esc, store, startPage, page, BTN, DataTable, bindDataTable, AdminTiles, AdminHeading, ADMIN_TRAIL, RolePill, ROLE_TONE } = App;

  const table = { q: "", filters: {}, page: 1, size: 10 };
  const ROLE_ICON = { super_admin: "shield", programme_manager: "circle-check", monitoring_officer: "chart-line", field_officer: "clipboard-list", finance_officer: "wallet", donor_viewer: "eye" };

  function render() {
    const users = store.all("users");
    const rows = [...store.all("roles")].sort((a, b) => t(a.label).localeCompare(t(b.label)));
    return `
    <div class="flex flex-col gap-6">
      ${AdminTiles("roles")}
      ${AdminHeading({
        title: "Roles",
        info: "The kinds of staff in the programme. A new role starts with no access: decide what it can do and which dashboards it sees under Access.",
        action: `<a href="${page("admin-role.html")}" class="${BTN.primary}">${icon("plus", "h-4 w-4")} ${t("New role")}</a>`,
      })}
      ${DataTable(table, {
        rows,
        noun: "roles",
        selectable: false,
        searchPlaceholder: "Search by role name or code...",
        searchText: (r) => `${t(r.label)} ${r.key}`,
        right: `<span class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-700">${t("{{n}} total", { n: rows.length })}</span>`,
        rowHref: (r) => page(`admin-role.html?key=${r.key}`),
        columns: [
          {
            key: "role", header: "Role",
            cell: (r) => `
              <div class="flex items-center gap-3">
                <span class="flex h-7 w-7 items-center justify-center rounded-md border ${ROLE_TONE[r.color ?? "violet"]}">${icon(ROLE_ICON[r.key] ?? "user-cog", "h-3.5 w-3.5")}</span>
                ${RolePill(r.key)}
                ${r.isSystem ? `<span class="text-[11px] font-medium uppercase text-slate-400">${t("Built-in")}</span>` : ""}
              </div>`,
          },
          { key: "code", header: "Code", cell: (r) => `<code class="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[11px] text-slate-500">${esc(r.key)}</code>` },
          {
            key: "people", header: "People", className: "text-center",
            cell: (r) => {
              const n = users.filter((u) => u.role === r.key).length;
              return `<span class="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">${icon("users", "h-3.5 w-3.5")} ${t(n === 1 ? "1 person" : "{{n}} people", { n })}</span>`;
            },
          },
        ],
        actions: (r) => `<a href="${page(`admin-role.html?key=${r.key}`)}" class="${BTN.ghostIcon}" title="${t("Edit")}">${icon("pencil", "h-4 w-4")}</a>`,
      })}
    </div>`;
  }

  startPage({
    active: "/admin",
    module: "admin",
    superAdminOnly: true,
    title: "Roles",
    trail: [...ADMIN_TRAIL, { label: "Roles" }],
    render,
    bind: (root, user, rerender) => bindDataTable(root, table, rerender),
  });
  App.showPendingToast();
})((window.App = window.App || {}));
