/*
 * Participant page — a copy of meal-mis-frontend/src/routes/_authenticated/participants.$id.tsx
 * and components/participant-detail/*: tabs (Overview, Enterprise, Trainings,
 * Financial inclusion, Material support, More), the profile card, the ID card
 * with its QR code, General information + Demographics, Contact & location,
 * Programme. The Enterprise tab lists the enterprises they lead or belong to.
 * Data: store.get("participants", id) — GET /participants/:id
 */
(function (App) {
  const { t, icon, esc, store, scoped, startPage, page, ROUTES, can, label, fmtDate, fmtDateBoth, ageFrom, isYouth, initials, StatusBadge, ReviewBadge, pill, RecordTabs, InfoCard, Rows, none, SubHead, CARD, BTN, DataTable, bindDataTable, PersonCell, toast, toastNext } = App;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const tab = params.get("tab") ?? "overview";
  const table = { q: "", filters: {}, page: 1, size: 8 };

  function enterprisesOf(p, user) {
    const memberOf = store.all("enterpriseMembers").filter((m) => m.participantId === p.id).map((m) => m.enterpriseId);
    return store.list("enterprises", user).filter((e) => e.leadId === p.id || memberOf.includes(e.id));
  }

  function overview(p, user) {
    const ents = enterprisesOf(p, user);
    const age = ageFrom(p.dateOfBirth);
    const prios = p.priorities.map((c) => label("participants.priority_sector", c)).join(` <span class="text-slate-400">→</span> `);
    const canWrite = can(user, "participants", "write");

    const profile = `
    <section class="${CARD} p-5 text-center">
      <span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white shadow-md ring-4 ring-blue-100">${initials(p.fullName)}</span>
      <h1 class="mt-3 text-xl font-bold tracking-tight text-slate-900">${esc(p.fullName)}</h1>
      <p class="mt-1 inline-flex items-center gap-1.5 text-[13px] text-slate-500">${esc(p.code)}
        <button type="button" data-copy="${esc(p.code)}" class="text-slate-400 hover:text-slate-700" title="${t("Copy")}">${icon("copy", "h-3.5 w-3.5")}</button></p>
      <div class="mt-3 flex flex-wrap justify-center gap-1.5">
        ${StatusBadge(p.status)} ${p.consent ? pill("green", t("Consent on file"), "shield-check") : ""} ${ReviewBadge(p.review)}
      </div>
      <dl class="mt-4 space-y-2 border-y border-slate-100 py-4 text-left text-[13px]">
        <div class="flex justify-between"><dt class="text-slate-500">${t("Phone")}</dt><dd class="font-semibold text-slate-900">${esc(p.phone)}</dd></div>
        <div class="flex justify-between"><dt class="text-slate-500">${t("Region")}</dt><dd class="font-semibold text-slate-900">${esc(t(p.region))}</dd></div>
        <div class="flex justify-between"><dt class="text-slate-500">${t("Age")}</dt><dd class="font-semibold text-slate-900">${t("{{n}} yrs", { n: age })}</dd></div>
      </dl>
      ${
        canWrite
          ? `<div class="mt-4 grid grid-cols-2 gap-2">
              <a href="${page(`participant-new.html?edit=${p.id}`)}" class="${BTN.outline} w-full">${icon("pencil", "h-4 w-4")} ${t("Edit")}</a>
              <button type="button" data-delete class="${BTN.danger} w-full">${icon("trash-2", "h-4 w-4")} ${t("Delete")}</button>
            </div>`
          : ""
      }
    </section>`;

    const idCard = `
    <section class="${CARD} p-5">
      <header class="mb-3 flex items-center justify-between">
        <h2 class="flex items-center gap-2.5 text-lg font-bold text-slate-800">${icon("qr-code", "h-5 w-5 text-blue-600")} ${t("ID card")}</h2>
        <button type="button" data-print class="${BTN.outline}">${icon("printer", "h-4 w-4")} ${t("Print card")}</button>
      </header>
      <div class="mx-auto w-fit rounded-lg border border-slate-200 p-2" id="qr"></div>
      <p class="mt-3 text-center text-xs text-slate-500">${t("Holds the ID, name, sex and cluster.")}</p>
    </section>`;

    const general = InfoCard({
      iconName: "id-card",
      title: "General information",
      side: t("Core profile"),
      body: `
        ${Rows([
          ["National ID (Fayida)", p.nationalId ? `<span class="tabular-nums">${esc(p.nationalId)}</span>` : none()],
          [
            "ID check",
            p.nationalId
              ? p.faydaChecked
                ? pill("green", t("Verified by Fayida"), "circle-check")
                : `<div class="flex flex-col items-end gap-1.5">${pill("amber", t("Not checked with Fayida"), "triangle-alert")}
                   <a href="${ROUTES.nextPhase("Verify with Fayida")}" class="inline-flex items-center gap-1 text-[13px] font-semibold text-blue-600 hover:underline">${t("Verify with Fayida")} ${icon("external-link", "h-3.5 w-3.5")}</a></div>`
              : none("No National ID"),
          ],
          ["Kebele ID", p.kebeleId ? esc(p.kebeleId) : none()],
          ["JCMIS Labour ID", none()],
          ["Name", `${esc(p.firstName)} · ${esc(p.fatherName)} · ${esc(p.grandfatherName)}`],
          ["Registered", fmtDate(p.registeredAt)],
        ])}
        ${SubHead("users", "Demographics", "Verified")}
        ${Rows([
          ["Sex", t(p.sex === "female" ? "Female" : "Male")],
          ["Date of birth", `${esc(fmtDateBoth(p.dateOfBirth))} · ${t("{{n}} yrs", { n: age })}`],
          ["Youth (15–35)", t(isYouth(p) ? "Yes" : "No")],
          ["Disability", p.disability ? p.disabilityTypes.map((d) => label("participants.disability_type", d)).join(", ") : t("No")],
          ["Education level", label("participants.education_level", p.education)],
          ["Marital status", label("participants.marital_status", p.maritalStatus)],
          ["Target status", label("participants.target_status", p.targetStatus)],
          ["Female-headed household", t(p.femaleHeaded ? "Yes" : "No")],
          ["Dependents", String(p.dependents)],
        ])}`,
    });

    const contact = InfoCard({
      iconName: "map-pin",
      title: "Contact & location",
      side: t(p.region),
      body: Rows([
        ["Alternative contact", ""],
        ["Email", none("Not registered")],
        ["Zone", esc(p.zone)],
        ["Woreda", esc(p.woreda)],
        ["Kebele", esc(p.kebele)],
        ["Residence", label("participants.residence_type", p.residence)],
        ["Registration site", ""],
      ]),
    });

    const programme = InfoCard({
      iconName: "network",
      title: "Programme",
      side: t("Enrolment"),
      body: Rows([
        ["Enterprise", ents.length ? ents.map((e) => `<a href="${page(`enterprise.html?id=${e.id}`)}" class="text-blue-600 hover:underline">${esc(e.name)}</a>`).join(", ") : ""],
        ["Agri-business experience", label("participants.agri_experience", p.agriExperience)],
        ["Priorities", prios],
        ["Notes", ""],
      ]),
    });

    return `
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[290px_1fr_1fr]">
      <div class="flex flex-col gap-5">${profile}${idCard}</div>
      <div>${general}</div>
      <div class="flex flex-col gap-5">${contact}${programme}</div>
    </div>`;
  }

  function enterpriseTab(p, user) {
    const byId = Object.fromEntries(store.all("participants").map((x) => [x.id, x]));
    return DataTable(table, {
      rows: enterprisesOf(p, user),
      noun: "enterprises",
      selectable: false,
      searchPlaceholder: "Search enterprises by name or owner...",
      searchText: (e) => `${e.name} ${byId[e.leadId]?.fullName ?? ""}`,
      columns: [
        { key: "e", header: "Enterprise", cell: (e) => PersonCell(e.name, e.code, page(`enterprise.html?id=${e.id}`)) },
        { key: "r", header: "Their part", cell: (e) => (e.leadId === p.id ? pill("blue", t("Lead")) : pill("grey", t("Member"))) },
        { key: "s", header: "Size", cell: (e) => label("enterprises.enterprise_size", e.size).split(" (")[0] },
        { key: "st", header: "Status", cell: (e) => App.StatusBadge(e.status) },
      ],
      rowHref: (e) => page(`enterprise.html?id=${e.id}`),
    });
  }

  function render(user) {
    const p = store.get("participants", id);
    if (!p || scoped(user, [p]).length === 0) {
      return `<div class="mx-auto max-w-md rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">${t("Person not found")}</div>`;
    }
    const ents = enterprisesOf(p, user).length;
    const here = (k) => page(`participant.html?id=${p.id}${k === "overview" ? "" : `&tab=${k}`}`);
    const tabs = [
      { key: "overview", label: "Overview", icon: "user", href: here("overview") },
      { key: "enterprise", label: "Enterprise", icon: "building-2", count: ents, href: here("enterprise") },
      { label: "Trainings", icon: "graduation-cap", count: 0, href: ROUTES.nextPhase("Trainings") },
      { label: "Financial inclusion", icon: "wallet", count: 0, href: ROUTES.nextPhase("Financial inclusion") },
      { label: "Material support", icon: "package", count: 0, href: ROUTES.nextPhase("Material support") },
      { label: "More", icon: "", count: 3, more: true, href: ROUTES.nextPhase("More") },
    ];
    return `<div class="flex flex-col gap-5">${RecordTabs(tabs, tab)}${tab === "enterprise" ? enterpriseTab(p, user) : overview(p, user)}</div>`;
  }

  function bind(root, user, rerender) {
    bindDataTable(root, table, rerender);
    const p = store.get("participants", id);
    if (!p) return;
    const qr = root.querySelector("#qr");
    if (qr && window.qrcode) {
      const q = window.qrcode(0, "M");
      q.addData(JSON.stringify({ id: p.code, name: p.fullName, sex: p.sex, cluster: p.clusterId }));
      q.make();
      qr.innerHTML = q.createSvgTag({ cellSize: 3, margin: 0 });
    }
    root.querySelector("[data-copy]")?.addEventListener("click", (e) => {
      navigator.clipboard?.writeText(e.currentTarget.dataset.copy);
      toast(t("Copied"));
    });
    root.querySelector("[data-print]")?.addEventListener("click", () => window.print());
    root.querySelector("[data-delete]")?.addEventListener("click", async () => {
      const ok = await App.confirmDialog({
        title: t("Delete {{name}}?", { name: p.fullName }),
        description: t("This cannot be undone."),
        destructive: true,
      });
      if (!ok) return;
      store.remove("participants", p.id);
      toastNext(t("Participant deleted"));
      location.href = page("participants.html");
    });
  }

  const record = store.get("participants", id);
  startPage({
    active: "/participants",
    module: "participants",
    crumbsOnly: true,
    title: record?.fullName ?? "Participant",
    trail: [{ label: "Programme data", href: page("participants.html") }, { label: "Participants", href: page("participants.html") }, { label: record?.fullName ?? "Details" }],
    render,
    bind,
  });
  App.showPendingToast();
})((window.App = window.App || {}));
