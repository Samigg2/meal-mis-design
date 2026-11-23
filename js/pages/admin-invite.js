/*
 * Administration › Users › Invite — a copy of components/admin/invite-form.tsx:
 * Who (One person / Many at once), Access (Role, Cluster or National).
 * A cluster admin invites into their own cluster only.
 * Data: store.add("users", …) — POST /admin/users/invite
 */
(function (App) {
  const { t, icon, esc, store, startPage, page, createForm, toastNext, ADMIN_TRAIL, userCluster } = App;

  let form;
  const NO_ORG = "__national__";

  function build(user) {
    const own = userCluster(user);
    const clusters = store.all("clusters");
    const many = (v) => v.mode === "many";
    return [
      {
        title: "Invite",
        sections: [
          {
            title: "Who",
            description: "Invite one person, or a whole team in one go.",
            columns: 2,
            fields: [
              {
                name: "mode", type: "custom", span: "full",
                html: (v) => `
                  <div role="radiogroup" aria-label="${t("How many people")}" class="grid gap-3 sm:grid-cols-2">
                    ${[
                      ["one", "user", "One person", "Type their name and email"],
                      ["many", "users", "Many at once", "Paste a list, one per line"],
                    ]
                      .map(([val, ic, title, text]) => {
                        const on = (v.mode ?? "one") === val;
                        return `<button type="button" role="radio" aria-checked="${on}" data-mode="${val}"
                          class="flex items-center gap-3 rounded-[12px] border-2 px-4 py-3 text-left transition-colors ${on ? "border-brand bg-brand/5" : "border-line bg-white hover:border-slate-300"}">
                          <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${on ? "bg-brand text-white" : "bg-slate-100 text-slate-500"}">${icon(ic, "h-4 w-4")}</span>
                          <span><span class="block text-sm font-semibold text-slate-800">${t(title)}</span><span class="block text-xs text-slate-500">${t(text)}</span></span>
                        </button>`;
                      })
                      .join("")}
                  </div>`,
                bind: (root, state, rerender) =>
                  root.querySelectorAll("[data-mode]").forEach((b) =>
                    b.addEventListener("click", () => {
                      state.values.mode = b.dataset.mode;
                      state.errors = {};
                      rerender();
                    }),
                  ),
              },
              { name: "full_name", label: "Full name", required: true, placeholder: "Dawit Bekele", showWhen: (v) => !many(v) },
              {
                name: "email", label: "Email", type: "email", required: true, placeholder: "dawit@example.org", help: "The invitation goes here.", showWhen: (v) => !many(v),
                check: (v) => (/^\S+@\S+\.\S+$/.test(v) ? (store.all("users").some((u) => u.email === v.trim()) ? t("Someone already has this email") : null) : t("Enter a valid email address")),
              },
              {
                name: "bulk", type: "textarea", required: true, span: "full", showWhen: many,
                label: own ? "One person per line: email, full name" : "One person per line: email, full name, cluster code",
                placeholder: own ? "dawit@example.org, Dawit Bekele\nalmaz@example.org, Almaz Tadesse" : "dawit@example.org, Dawit Bekele, CL-01\nalmaz@example.org, Almaz Tadesse, CL-02",
                help: `${own ? t("Everyone joins {{name}}.", { name: own.name }) : t("A line without a cluster code uses the cluster below.")} ${t("A bad line is reported and the rest still go out.")}`,
              },
            ],
          },
          {
            title: "Access",
            description: "The role decides which modules they can open; the cluster decides whose records they see.",
            columns: 2,
            fields: [
              { name: "role", label: "Role", type: "select", required: true, options: store.all("roles").filter((r) => user.role === "super_admin" || r.key !== "super_admin").map((r) => [r.key, r.label]) },
              own
                ? { name: "cluster", label: "Cluster", type: "custom", html: () => `<input disabled value="${esc(own.name)}" class="${App.CONTROL} cursor-not-allowed text-slate-500" />` }
                : {
                    name: "cluster", label: "Cluster", type: "select", required: true, placeholder: "Choose a cluster…", requiredMessage: "Choose a cluster, or National",
                    help: "No cluster: sees every cluster.",
                    options: [[NO_ORG, "National (sees all clusters)"], ...clusters.map((c) => [c.id, c.name])],
                  },
            ],
          },
        ],
      },
    ];
  }

  function save(v, user) {
    const own = userCluster(user);
    const clusterOf = (code) => (own ? own.id : code ? store.all("clusters").find((c) => c.code === code.trim())?.id ?? null : v.cluster === NO_ORG ? null : v.cluster);
    const people =
      v.mode === "many"
        ? v.bulk.split("\n").map((l) => l.split(",").map((x) => x.trim())).filter(([e, n]) => e && n)
        : [[v.email.trim(), v.full_name.trim()]];
    people.forEach(([email, fullName, code]) =>
      store.add("users", { id: store.newId("u"), fullName, email, role: v.role, clusterId: clusterOf(code), status: "active" }),
    );
    toastNext(t(people.length === 1 ? "Invitation sent" : "{{n}} invitations sent", { n: people.length }));
    location.href = page("admin.html");
  }

  startPage({
    active: "/admin",
    module: "admin",
    action: "write",
    title: "Invite",
    trail: [...ADMIN_TRAIL, { label: "Users", href: page("admin.html") }, { label: "Invite" }],
    render(user) {
      form ??= createForm({
        steps: build(user),
        values: { mode: "one", role: "field_officer" },
        note: "The account is created with the role and cluster you choose, and the person gets an email with a link to set their password. Self-registration is off, so this is how people get in.",
        saveLabel: "Send invitation",
        onCancel: () => (location.href = page("admin.html")),
        onSave: (v) => save(v, user),
      });
      return form.html();
    },
    bind: (root, user, rerender) => form.bind(root, rerender),
  });
})((window.App = window.App || {}));
