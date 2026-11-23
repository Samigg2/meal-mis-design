/*
 * Administration tiles — a copy of meal-mis-frontend/src/components/admin/admin-nav.tsx:
 * eight tiles (Users, Clusters, Registration links, Roles, Access, Reference
 * data, Custom fields, More), the open one in its colour; then the section
 * heading with its (i) tip.
 *   AdminTiles(active)  ·  AdminHeading({ title, info, action })
 * Tiles not designed yet open Next phase.
 */
(function (App) {
  const { t, icon, esc, asset, ROUTES, InfoTip } = App;
  const page = (file) => asset(`pages/${file}`); // loads before app.js, which defines App.page

  const TILES = [
    { key: "users", label: "Users", hint: "Invite people, roles, accounts", icon: "users", color: "#2563eb", href: () => page("admin.html") },
    { key: "clusters", label: "Clusters", hint: "Delivery clusters by region", icon: "building-2", color: "#059669", href: () => page("admin-clusters.html") },
    { key: "links", label: "Registration links", hint: "Let people register themselves", icon: "link-2", color: "#0284c7", href: () => ROUTES.nextPhase("Registration links") },
    { key: "roles", label: "Roles", hint: "The kinds of staff", icon: "user-cog", color: "#9333ea", href: () => page("admin-roles.html") },
    { key: "access", label: "Access", hint: "What each role can do and see", icon: "key-round", color: "#f59e0b", href: () => ROUTES.nextPhase("Access") },
    { key: "reference", label: "Reference data", hint: "Dropdown lists in forms", icon: "list-tree", color: "#0d9488", href: () => page("admin-reference-data.html") },
    { key: "custom", label: "Custom fields", hint: "Extra fields on a record", icon: "sliders-horizontal", color: "#db2777", href: () => page("admin-custom-fields.html") },
    { key: "more", label: "More", hint: "Settings, API keys, National ID, Audit trail", icon: "chevron-down", color: "#475569", href: () => ROUTES.nextPhase("Settings, API keys, National ID, Audit trail") },
  ];

  const tint = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  };
  const TILE = "group flex h-full items-center gap-3 rounded-[14px] border-2 bg-white p-3.5 transition-all";

  function AdminTiles(active) {
    return `
    <ul class="grid grid-cols-2 gap-3 lg:grid-cols-4">
      ${TILES.map((tile) => {
        const on = tile.key === active;
        return `
        <li>
          <a href="${tile.href()}" ${on ? `aria-current="page"` : ""}
            class="${TILE} ${on ? "shadow-md" : "border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,.06)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"}"
            ${on ? `style="border-color:${tile.color};background:${tint(tile.color, 0.05)};box-shadow:0 0 0 1px ${tint(tile.color, 0.3)}"` : ""}>
            <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors"
              style="background:${on ? tile.color : tint(tile.color, 0.09)};color:${on ? "#fff" : tile.color}">${icon(tile.icon, "h-5 w-5")}</span>
            <span class="min-w-0">
              <span class="block text-[15px] font-bold leading-tight text-slate-900" ${on ? `style="color:color-mix(in srgb, ${tile.color} 50%, #0f172a)"` : ""}>${esc(t(tile.label))}</span>
              <span class="mt-0.5 block truncate text-xs text-muted-foreground">${esc(t(tile.hint))}</span>
            </span>
          </a>
        </li>`;
      }).join("")}
    </ul>`;
  }

  const AdminHeading = ({ title, info, action = "" }) => `
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h2 class="flex items-center gap-2 text-xl font-bold text-slate-800">${esc(t(title))} ${info ? InfoTip(t(info)) : ""}</h2>
      ${action}
    </div>`;

  /** A role's coloured pill (Super admin red, Field officer green, …) — admin.index.tsx. */
  const ROLE_TONE = {
    red: "border-red-200 bg-red-50 text-red-700",
    blue: "border-blue-200 bg-blue-50 text-blue-700",
    fuchsia: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    slate: "border-sky-200 bg-sky-50 text-sky-700",
    violet: "border-violet-200 bg-violet-50 text-violet-700",
  };
  function RolePill(key) {
    const role = App.store.all("roles").find((r) => r.key === key);
    return `<span class="inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${ROLE_TONE[role?.color ?? "violet"]}">${esc(t(role?.label ?? key))}</span>`;
  }

  /** The trail every admin page starts with. */
  const ADMIN_TRAIL = [{ label: "System", href: page("admin.html") }, { label: "Administration", href: page("admin.html") }];

  Object.assign(App, { AdminTiles, AdminHeading, ADMIN_TRAIL, tint, RolePill, ROLE_TONE });
})((window.App = window.App || {}));
