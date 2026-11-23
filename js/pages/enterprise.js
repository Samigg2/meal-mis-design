/*
 * Enterprise page — a copy of meal-mis-frontend/src/routes/_authenticated/enterprises.$id.tsx
 * (record-detail.tsx layout): "Led by …, aged …", tabs (Overview, Performance,
 * Members, Loans, Attachments, More), the profile card, Identification,
 * Location, Classification & value chain, Leadership & ownership, Contact.
 * Members tab = components/enterprise-members.tsx: picked as people (0117).
 * Data: store.get("enterprises", id) + enterpriseMembers — GET /records/enterprises/:id
 */
(function (App) {
  const { t, icon, esc, store, scoped, startPage, page, ROUTES, can, label, fmtDate, num, StatusBadge, ReviewBadge, pill, RecordTabs, InfoCard, Rows, none, CARD, BTN, DataTable, bindDataTable, PersonCell, toast, toastNext, confirmDialog, enterpriseFacts, SIZE_RANGE, PeoplePicker, bindPeoplePicker, ageFrom } = App;

  const params = new URLSearchParams(location.search);
  const id = params.get("id");
  const tab = params.get("tab") ?? "overview";
  const table = { q: "", filters: {}, page: 1, size: 8 };
  const picker = { open: false, selected: [], q: "" };
  const yn = (v) => t(v ? "Yes" : "No");

  function overview(e, f, user) {
    const people = Object.fromEntries(store.all("participants").map((p) => [p.id, p]));
    const contact = people[e.contactId];
    const canWrite = can(user, "enterprises", "write");
    const profile = `
    <section class="${CARD} p-5">
      <div class="text-center">
        <span class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-md ring-4 ring-blue-100">${icon("store", "h-9 w-9")}</span>
        <h1 class="mt-3 text-xl font-bold tracking-tight text-slate-900">${esc(e.name)}</h1>
        <p class="mt-1 flex items-center justify-center gap-2 text-[13px] text-slate-500">${t("Enterprise")} ${StatusBadge(e.status)}</p>
        <div class="mt-2 flex justify-center">${ReviewBadge(e.review)}</div>
      </div>
      <dl class="mt-4 space-y-2.5 border-y border-slate-100 py-4 text-[13px]">
        ${[
          ["Enterprise size", e.size ? label("enterprises.enterprise_size", e.size) : "—"],
          ["Registration status", label("enterprises.registration_status", e.registrationStatus)],
          ...(e.tinNumber ? [["TIN Number", e.tinNumber]] : []),
          ["Establishment date", fmtDate(e.establishedDate)],
          ["Which one", label("enterprises.certificate_kind", e.certificateKind)],
        ]
          .map(([k, v]) => `<div class="flex justify-between gap-4"><dt class="shrink-0 text-slate-500">${t(k)}</dt><dd class="text-right font-semibold text-slate-900">${esc(v)}</dd></div>`)
          .join("")}
      </dl>
      ${
        canWrite
          ? `<div class="mt-4 grid grid-cols-2 gap-2">
              <a href="${page(`enterprise-new.html?edit=${e.id}`)}" class="${BTN.outline} w-full">${icon("pencil", "h-4 w-4")} ${t("Edit")}</a>
              <button type="button" data-delete class="${BTN.danger} w-full">${icon("trash-2", "h-4 w-4")} ${t("Delete")}</button>
            </div>`
          : ""
      }
    </section>`;

    const identification = InfoCard({
      iconName: "layout-list", title: "Identification",
      body: Rows([
        ["Enterprise name", esc(e.name)],
        ["Has a bylaw?", yn(true)],
        ["Has a business plan?", yn(true)],
        ["Has an acknowledgement certificate or business licence?", yn(true)],
      ]),
    });
    const location_ = InfoCard({
      iconName: "map-pin", title: "Location", side: t(e.region),
      body: Rows([["Region", esc(t(e.region))], ["Zone", esc(e.zone)], ["Woreda", esc(e.woreda)], ["Kebele", esc(e.kebele)], ["Last updated", fmtDate(e.registeredAt)]]),
    });
    const classification = InfoCard({
      iconName: "layout-list", title: "Classification & value chain",
      body: Rows([
        ["Premises", label("enterprises.premises", e.premises)],
        ["Enterprise type", label("enterprises.ownership_type", e.ownershipType)],
        ["Establishment supported by", label("enterprises.supported_by", e.supportedBy)],
        ["Initial capital (ETB)", num(e.initialCapital)],
        ["RAYEE II pathway", label("enterprises.rayee_pathway", e.rayeePathway)],
        ["Value chain to engage with", label("enterprises.value_chain", e.valueChain)],
        ["Sub business types", e.subBusinessTypes.map((s) => `<span class="ml-1 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">${esc(label("enterprises.sub_business_types", s))}</span>`).join("")],
        ["Value chain function", label("enterprises.value_chain_function", e.valueChainFunction)],
      ]),
    });
    const leadership = InfoCard({
      iconName: "layout-list", title: "Leadership & ownership",
      body: Rows([
        ["Owner", f.lead ? `<a href="${page(`participant.html?id=${f.lead.id}`)}" class="text-blue-600 hover:underline">${esc(f.lead.fullName)}</a>` : ""],
        ["Female members", String(f.female)],
        ["Male members", String(f.male)],
        ["Members with a disability", String(f.disability)],
        ["Returnee members", String(f.returnees)],
        ["IDP members", String(f.idps)],
        ["Youth-led?", yn(f.youthLed)],
        ["Women-led?", yn(f.womenLed)],
        ["Led by a person with a disability?", yn(f.pwdLed)],
        ["Returnee-led?", yn(f.returneeLed)],
        ["IDP-led?", yn(f.idpLed)],
      ]),
    });
    const contactCard = InfoCard({
      iconName: "contact", title: "Contact",
      body: Rows([
        ["Contact person", contact ? esc(contact.fullName) : ""],
        ["Contact person's role", label("enterprises.contact_role", e.contactRole)],
        ["Phone", esc(e.phone)],
        ["Email", ""],
      ]),
    });
    return `
    <div class="grid grid-cols-1 gap-5 xl:grid-cols-[290px_1fr_1fr]">
      <div>${profile}</div>
      <div class="flex flex-col gap-5">${identification}${location_}${classification}</div>
      <div class="flex flex-col gap-5">${leadership}${contactCard}</div>
    </div>`;
  }

  function membersTab(e, f, user) {
    const canWrite = can(user, "enterprises", "write");
    const range = SIZE_RANGE[e.size];
    const room = range ? range.max - f.total : Infinity;
    const rows = f.members.filter((p) => p.id !== e.leadId);
    const people = store.list("participants", user).filter((p) => !f.members.some((m) => m.id === p.id));
    return `
    <section class="${CARD} p-5">
      <header class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="flex items-center gap-2 text-lg font-bold text-slate-800">${icon("users", "h-5 w-5 text-blue-600")} ${t("Members")}
            <span class="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500">${t("{{n}} with the lead", { n: f.total })}</span></h2>
          <p class="mt-1 text-xs text-muted-foreground">${t("Lead")}: <span class="font-semibold text-ink">${esc(f.lead?.fullName ?? "—")}</span>
            ${range ? ` · ${t(range.text)}` : ""}</p>
        </div>
        ${canWrite && !picker.open ? `<button type="button" data-add-members class="${BTN.primary}" ${room <= 0 ? "disabled title='" + t(range.text) + "'" : ""}>${icon("plus", "h-4 w-4")} ${t("Add members")}</button>` : ""}
      </header>
      ${
        picker.open
          ? `<div class="mb-5 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
              <p class="mb-3 text-sm font-semibold text-slate-800">${t("Add members")}</p>
              ${PeoplePicker(picker, { people, max: room, priorityFilter: true, idPrefix: "members" })}
              <div class="mt-3 flex justify-end gap-2">
                <button type="button" data-picker-cancel class="${BTN.outline}">${t("Cancel")}</button>
                <button type="button" data-picker-save class="${BTN.solid} h-9" ${picker.selected.length ? "" : "disabled"}>${t("Add {{n}} selected", { n: picker.selected.length })}</button>
              </div>
            </div>`
          : ""
      }
      ${DataTable(table, {
        rows,
        noun: "members",
        selectable: false,
        searchPlaceholder: "Search by name or ID…",
        searchText: (p) => `${p.fullName} ${p.code}`,
        empty: "No members listed yet.",
        columns: [
          { key: "p", header: "Participant", cell: (p) => PersonCell(p.fullName, p.code, page(`participant.html?id=${p.id}`)) },
          { key: "s", header: "Sex", cell: (p) => t(p.sex === "female" ? "Female" : "Male") },
          { key: "a", header: "Age", cell: (p) => String(ageFrom(p.dateOfBirth)) },
          { key: "d", header: "Disability", cell: (p) => yn(p.disability) },
          { key: "r", header: "Returnee / IDP", cell: (p) => (p.targetStatus === "neither" ? "—" : label("participants.target_status", p.targetStatus)) },
        ],
        actions: canWrite
          ? (p) => `<button type="button" data-remove="${p.id}" data-name="${esc(p.fullName)}" class="inline-flex h-7 w-7 items-center justify-center rounded-md text-destructive hover:bg-accent" title="${t("Remove {{name}}", { name: esc(p.fullName) })}">${icon("trash-2", "h-3.5 w-3.5")}</button>`
          : undefined,
      })}
    </section>`;
  }

  function render(user) {
    const e = store.get("enterprises", id);
    if (!e || scoped(user, [e]).length === 0) {
      return `<div class="mx-auto max-w-md rounded-lg border border-dashed p-12 text-center text-sm text-muted-foreground">${t("not found")}</div>`;
    }
    const f = enterpriseFacts(e);
    const here = (k) => page(`enterprise.html?id=${e.id}${k === "overview" ? "" : `&tab=${k}`}`);
    const tabs = [
      { key: "overview", label: "Overview", icon: "store", href: here("overview") },
      { label: "Performance", icon: "trending-up", href: ROUTES.nextPhase("Performance") },
      { key: "members", label: "Members", icon: "users", count: f.total, href: here("members") },
      { label: "Loans", icon: "hand-coins", count: 0, href: ROUTES.nextPhase("Loans") },
      { label: "Attachments", icon: "paperclip", href: ROUTES.nextPhase("Attachments") },
      { label: "More", icon: "", count: 1, more: true, href: ROUTES.nextPhase("More") },
    ];
    return `
    <div class="flex flex-col gap-4">
      ${f.lead ? `<p class="text-sm text-slate-600">${t("Led by {{name}}, aged {{age}}.", { name: `<b class="font-semibold text-slate-900">${esc(f.lead.fullName)}</b>`, age: f.leadAge })}</p>` : ""}
      ${RecordTabs(tabs, tab)}
      ${tab === "members" ? membersTab(e, f, user) : overview(e, f, user)}
    </div>`;
  }

  function bind(root, user, rerender) {
    bindDataTable(root, table, rerender);
    const e = store.get("enterprises", id);
    if (!e) return;
    const f = enterpriseFacts(e);
    root.querySelector("[data-add-members]")?.addEventListener("click", () => {
      picker.open = true;
      picker.selected = [];
      picker.region = e.region; // defaultRegion = the lead's region, as in the real picker
      rerender();
    });
    root.querySelector("[data-picker-cancel]")?.addEventListener("click", () => {
      picker.open = false;
      rerender();
    });
    root.querySelector("[data-picker-save]")?.addEventListener("click", () => {
      picker.selected.forEach((pid, k) => store.add("enterpriseMembers", { id: store.newId(`em${k}`), enterpriseId: e.id, participantId: pid }));
      toast(t("{{n}} members added", { n: picker.selected.length }));
      picker.open = false;
      rerender();
    });
    if (picker.open) {
      const range = SIZE_RANGE[e.size];
      bindPeoplePicker(root, picker, rerender, { idPrefix: "members", max: range ? range.max - f.total : undefined });
    }
    root.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", async () => {
        const ok = await confirmDialog({
          title: t("Remove {{name}}", { name: b.dataset.name }),
          description: t("{{name}} will be removed from this enterprise's members.", { name: b.dataset.name }),
          confirmLabel: t("Remove"),
          destructive: true,
        });
        if (!ok) return;
        const link = store.all("enterpriseMembers").find((m) => m.enterpriseId === e.id && m.participantId === b.dataset.remove);
        if (link) store.remove("enterpriseMembers", link.id);
        toast(t("Member removed"));
        rerender();
      }),
    );
    root.querySelector("[data-delete]")?.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: t("Delete {{name}}?", { name: e.name }), description: t("This cannot be undone."), destructive: true });
      if (!ok) return;
      store.remove("enterprises", e.id);
      toastNext(t("Record deleted"));
      location.href = page("enterprises.html");
    });
  }

  const record = store.get("enterprises", id);
  startPage({
    active: "/enterprises",
    module: "enterprises",
    crumbsOnly: true,
    title: record?.name ?? "Enterprise",
    trail: [{ label: "Programme data", href: page("enterprises.html") }, { label: "Enterprises", href: page("enterprises.html") }, { label: record?.name ?? "Details" }],
    render,
    bind,
  });
  App.showPendingToast();
})((window.App = window.App || {}));
