/*
 * Administration › Roles › <role> (or New role without ?key) — a copy of
 * admin.roles.$key.tsx / admin.roles.new.tsx: Role (Name, Key) and Purpose
 * (What it is for). A built-in role can be renamed but not deleted; a new role
 * starts with no access. Super admin only.
 * Data: store.update / store.add("roles") — PATCH /admin/roles/:key, POST /admin/roles
 */
(function (App) {
  const { t, store, startPage, page, createForm, toastNext, ADMIN_TRAIL } = App;

  const key = new URLSearchParams(location.search).get("key");
  const role = key ? store.all("roles").find((r) => r.key === key) : null;
  const toKey = (name) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 40);
  let form;

  function build() {
    return [
      {
        title: "Role",
        sections: [
          {
            title: "Role",
            description: "The name people see, and the key the system stores.",
            columns: 2,
            fields: [
              {
                name: "label", label: "Name", required: true,
                onChange: (v, all) => {
                  if (!role) all.key = toKey(v);
                },
              },
              role
                ? { name: "key", label: "Key", type: "custom", help: "Permanent. Can't be changed.", html: (v) => `<input disabled value="${v.key}" class="${App.CONTROL} cursor-not-allowed font-mono text-slate-400" />` }
                : {
                    name: "key", label: "Key", required: true, help: "Lower case letters, digits and _; it can't be changed later.",
                    check: (v) => (/^[a-z][a-z0-9_]{2,40}$/.test(v) ? (store.all("roles").some((r) => r.key === v) ? t("A role with this key already exists") : null) : t("Lower case letters, digits and _; it can't be changed later.")),
                  },
            ],
          },
          {
            title: "Purpose",
            description: "A line so other administrators know who should hold this role.",
            columns: 1,
            fields: [{ name: "description", label: "What it is for" }],
          },
        ],
      },
    ];
  }

  startPage({
    active: "/admin",
    module: "admin",
    superAdminOnly: true,
    title: role ? role.label : "New role",
    trail: [...ADMIN_TRAIL, { label: "Roles", href: page("admin-roles.html") }, { label: role ? role.label : "New role" }],
    render() {
      const people = role ? store.all("users").filter((u) => u.role === role.key).length : 0;
      form ??= createForm({
        steps: build(),
        values: role ? { label: role.label, key: role.key, description: role.description ?? "" } : {},
        note: () =>
          role
            ? `${t(people === 1 ? "1 person holds this role" : "{{n}} people hold this role", { n: people })}${role.isSystem ? ` · ${t("built-in: it can be renamed but not deleted.")}` : ""}`
            : t("A new role starts with no access: decide what it can do under Access."),
        saveLabel: "Save role",
        onCancel: () => (location.href = page("admin-roles.html")),
        onSave: (v) => {
          if (role) store.update("roles", role.key, { label: v.label.trim(), description: v.description });
          else store.add("roles", { id: v.key, key: v.key, label: v.label.trim(), description: v.description, isSystem: false, color: "violet" });
          toastNext(t(role ? "Role saved" : "Role created"));
          location.href = page("admin-roles.html");
        },
      });
      return form.html();
    },
    bind: (root, user, rerender) => form.bind(root, rerender),
  });
})((window.App = window.App || {}));
