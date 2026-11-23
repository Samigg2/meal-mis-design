/*
 * Administration › Clusters › Details (or Add a cluster without ?id) — a copy of
 * components/admin/cluster-card.tsx: Cluster (Name, Code) and Reporting
 * (Region, Description). Only a super admin changes a cluster.
 * Data: store.update / store.add("clusters") — PATCH/POST /admin/clusters
 */
(function (App) {
  const { t, store, startPage, page, createForm, toastNext, ADMIN_TRAIL, places } = App;

  const id = new URLSearchParams(location.search).get("id");
  const cluster = id ? store.get("clusters", id) : null;
  let form;

  function build(user) {
    const locked = user.role !== "super_admin";
    const ro = (name) => ({ name, type: "custom", html: (v) => `<input disabled value="${v[name] ?? ""}" class="${App.CONTROL} cursor-not-allowed text-slate-500" />` });
    return [
      {
        title: "Cluster",
        sections: [
          {
            title: "Cluster",
            description: "How the cluster is named in lists and reports.",
            columns: 2,
            fields: [
              locked ? { ...ro("name"), label: "Name" } : { name: "name", label: "Name", required: true, placeholder: "Oromia West" },
              locked
                ? { ...ro("code"), label: "Code" }
                : {
                    name: "code", label: "Code", placeholder: "CL-10", help: "Short and unique, e.g. CL-10.",
                    check: (v) => (store.all("clusters").some((c) => c.code === v.trim() && c.id !== id) ? t("Another cluster has this code") : null),
                  },
            ],
          },
          {
            title: "Reporting",
            description: "The region groups the cluster in dashboards and exports. A region can hold several clusters.",
            columns: 1,
            fields: [
              locked ? { ...ro("region"), label: "Region" } : { name: "region", label: "Region", type: "select", placeholder: "Choose a region", options: Object.keys(places).map((r) => [r, r]) },
              { name: "description", label: "Description", type: "textarea", help: "Optional: woredas, partner…" },
            ],
          },
        ],
      },
    ];
  }

  startPage({
    active: "/admin",
    module: "admin",
    title: cluster ? "Details" : "Add a cluster",
    trail: [...ADMIN_TRAIL, { label: "Clusters", href: page("admin-clusters.html") }, { label: cluster ? "Details" : "Add a cluster" }],
    render(user) {
      if (!cluster && user.role !== "super_admin") return `<p class="text-sm text-muted-foreground">${t("Only a super admin adds clusters.")}</p>`;
      if (cluster && user.clusterId && user.clusterId !== cluster.id) return `<p class="text-sm text-muted-foreground">${t("This cluster is outside yours.")}</p>`;
      const people = cluster ? store.all("users").filter((u) => u.clusterId === cluster.id).length : 0;
      form ??= createForm({
        steps: build(user),
        values: cluster ? { ...cluster } : {},
        note: cluster
          ? () => t("{{n}} people work in this cluster. Its name, code and region are what every dashboard and export rolls up under.", { n: people })
          : "The cluster owns the records its team collects. Fields marked * are required.",
        saveLabel: "Save cluster",
        onCancel: () => (location.href = page("admin-clusters.html")),
        onSave: (v) => {
          const row = { name: v.name.trim(), code: (v.code ?? "").trim(), region: v.region ?? null, description: v.description ?? "" };
          if (cluster) store.update("clusters", cluster.id, row);
          else store.add("clusters", { id: store.newId("cl"), ...row });
          toastNext(t(cluster ? "Cluster saved" : "Cluster added"));
          location.href = page("admin-clusters.html");
        },
      });
      return form.html();
    },
    bind: (root, user, rerender) => form?.bind(root, rerender),
  });
})((window.App = window.App || {}));
