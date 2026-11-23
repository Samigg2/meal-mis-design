/*
 * New enterprise (and Edit, with ?edit=<id>) — a copy of
 * meal-mis-frontend/src/routes/_authenticated/enterprises.new.tsx (DMIS form F02A):
 * Identification, Classification & value chain, Leadership & contact, Location.
 * 2026-11-20 rules: TIN only when Formal; the certificate follows the status;
 * size first, then the members are picked as people, limited by the size
 * (the lead counts); counts and "-led" are worked out, not typed; the cluster
 * is the lead's.
 * Data: store.add("enterprises", …) + enterpriseMembers — POST /enterprises
 */
(function (App) {
  const { t, esc, store, startPage, page, lookups, places, userCluster, createForm, toastNext, TODAY, ageFrom, SIZE_RANGE, PeoplePicker, bindPeoplePicker, enterpriseFacts } = App;

  const editId = new URLSearchParams(location.search).get("edit");
  const editing = editId ? store.get("enterprises", editId) : null;
  const picker = { selected: [], q: "" };
  let form;

  const PHONE_HINT = "e.g. 0912345678 or 0712345678 (or 251…/+251…)";
  const phoneCheck = (v) => (/^(?:\+?251|0)[79]\d{8}$/.test(v) ? null : t(`Enter an Ethiopian phone number, ${PHONE_HINT}`));
  const yesNo = (name, labelText, extra = {}) => ({ name, label: labelText, type: "yesno", ...extra });

  function build(user) {
    const people = store.list("participants", user).filter((p) => p.review === "approved");
    const byId = Object.fromEntries(people.map((p) => [p.id, p]));
    const regions = userCluster(user) ? [userCluster(user).region] : Object.keys(places);

    const leadField = {
      name: "owner_participant_id", label: "Lead (owner)", type: "select", required: true, placeholder: "Select",
      requiredMessage: "Choose the participant who leads the enterprise from the list",
      options: () => people.map((p) => [p.id, `${p.fullName} · ${p.code}`]),
      onChange: (id, v) => {
        const p = byId[id];
        picker.selected = picker.selected.filter((x) => x !== id);
        v.member_ids = picker.selected;
        if (p) Object.assign(v, { region: p.region, zone: p.zone, woreda: p.woreda, kebele: p.kebele, phone: v.phone || p.phone });
      },
    };
    Object.defineProperty(leadField, "help", {
      get: () => {
        const p = byId[form?.state.values.owner_participant_id];
        return p ? t("Age {{age}}, from their registration.", { age: ageFrom(p.dateOfBirth) }) : "Search approved participants by name or ID.";
      },
    });

    return [
      {
        title: "Identification",
        hint: "",
        sections: [
          {
            title: "Identification",
            columns: 2,
            fields: [
              { name: "enterprise_name", label: "Enterprise name", required: true, requiredMessage: "Enterprise name is required" },
              {
                name: "registration_status", label: "Registration status", type: "select", required: true, span: "full", placeholder: "Select...",
                options: lookups["enterprises.registration_status"],
                help: "Formal: has a TIN and a business licence. Semi-formal and informal: have an acknowledgement certificate, but no TIN or business licence.",
              },
              {
                name: "tin_number", label: "TIN Number", required: true, help: "The 10-digit TIN.", maxLength: 10,
                showWhen: (v) => v.registration_status === "formal",
                requiredMessage: "The TIN must be exactly 10 digits",
                check: (v) => (/^\d{10}$/.test(v.trim()) ? null : t("The TIN must be exactly 10 digits")),
              },
              {
                name: "established_date", label: "Establishment date", type: "date", required: true, max: TODAY,
                requiredMessage: "Establishment date is required",
                check: (v) => (v > TODAY ? t("Establishment date cannot be in the future") : null),
              },
              yesNo("has_bylaw", "Has a bylaw?", { required: true }),
              yesNo("has_business_plan", "Has a business plan?", { required: true }),
              {
                name: "certificate_file", type: "file", required: true, span: "full",
                showWhen: (v) => !!v.registration_status,
                get label() {
                  return form?.state.values.registration_status === "formal" ? "Upload the business licence" : "Upload the acknowledgement certificate";
                },
                get requiredMessage() {
                  return this.label; // the real form shows the label itself as the error
                },
                help: "A PDF or a photo. Saved offline, upload it on the Attachments tab once online.",
              },
              { name: "status", label: "Status", type: "select", options: [["active", "Active"], ["inactive", "Inactive"]] },
            ],
          },
        ],
      },
      {
        title: "Classification & value chain",
        hint: "",
        sections: [
          {
            title: "Classification",
            columns: 2,
            fields: [
              { name: "ownership_type", label: "Enterprise type", type: "select", options: lookups["enterprises.ownership_type"] },
              { name: "premises", label: "Premises", type: "select", options: lookups["enterprises.premises"] },
              { name: "supported_by", label: "Establishment supported by", type: "select", required: true, options: lookups["enterprises.supported_by"] },
              { name: "supported_by_other", label: "Other, please specify", required: true, requiredMessage: "Say who supported it", showWhen: (v) => v.supported_by === "other" },
              { name: "initial_capital", label: "Initial capital (ETB)", type: "number", help: "Own contribution + loan/credit + grant + in-kind/productive assets + other start-up capital." },
              { name: "baseline_revenue", label: "Initial / baseline revenue (ETB)", type: "number" },
            ],
          },
          {
            title: "Pathways & value chain",
            columns: 2,
            fields: [
              { name: "rayee_pathway", label: "RAYEE II pathway", type: "select", options: lookups["enterprises.rayee_pathway"] },
              { name: "value_chain", label: "Value chain to engage with", type: "select", options: lookups["enterprises.value_chain"] },
              { name: "value_chain_function", label: "Value chain function", type: "select", required: true, options: lookups["enterprises.value_chain_function"] },
              {
                name: "sub_business_types", label: "Sub business types", type: "checkboxes", required: true, span: "full", help: "Tick every one that applies.",
                requiredMessage: "Choose at least one sub business type", options: lookups["enterprises.sub_business_types"],
              },
            ],
          },
        ],
      },
      {
        title: "Leadership & contact",
        hint: "",
        sections: [
          {
            title: "Leadership & ownership",
            columns: 2,
            fields: [
              leadField,
              {
                name: "cluster", label: "Cluster", type: "custom", help: "Worked out, not chosen.",
                html: (v) => {
                  const p = byId[v.owner_participant_id];
                  return `<div class="flex h-11 items-center rounded-lg border border-slate-200 bg-slate-100 px-3 text-sm text-slate-600">${
                    p ? `${t("The lead's cluster")} (${esc(t(p.region))})` : t("The lead's cluster, once chosen")
                  }</div>`;
                },
              },
              {
                name: "enterprise_size", label: "Enterprise size", type: "select", required: true, span: "full",
                options: lookups["enterprises.enterprise_size"],
                help: "Choose the size, then pick the members: Micro 1–5, Medium 6–10, Small 11–30, Large more than 30 (the lead counts).",
              },
              {
                name: "member_ids", label: "Members", type: "custom", required: true, span: "full", always: true,
                showWhen: (v) => !!v.enterprise_size,
                help: "Women, men, disability, returnees and IDPs, and youth-, women-, disability-, returnee- or IDP-led, are worked out from the members and the lead.",
                check: (ids, v) => {
                  const range = SIZE_RANGE[v.enterprise_size];
                  const total = (ids ?? []).filter((id) => id !== v.owner_participant_id).length + 1;
                  return range && (total < range.min || total > range.max) ? `${t(range.text)}: ${total} ${t("with the lead")}` : null;
                },
                html: (v) => {
                  const range = SIZE_RANGE[v.enterprise_size];
                  const n = picker.selected.length + 1;
                  const ok = n >= range.min && n <= range.max;
                  return `<div class="rounded-xl border border-slate-200 p-3">
                    <p class="mb-2 text-xs font-semibold ${ok ? "text-emerald-700" : "text-amber-700"}">${t("{{n}} members with the lead · {{range}}", { n, range: t(range.text) })}</p>
                    ${PeoplePicker(picker, { people, exclude: v.owner_participant_id ? [v.owner_participant_id] : [], max: range.max - 1, priorityFilter: true, idPrefix: "members" })}
                  </div>`;
                },
                bind: (root, state, rerender) => {
                  const range = SIZE_RANGE[state.values.enterprise_size];
                  if (!range) return;
                  bindPeoplePicker(root, picker, rerender, {
                    idPrefix: "members",
                    max: range.max - 1,
                    onChange: (ids) => {
                      state.values.member_ids = ids;
                      delete state.errors.member_ids;
                    },
                  });
                },
              },
              yesNo("is_model", "Model enterprise?"),
              yesNo("in_eysla", "In an E-YSLA?"),
              { name: "clustering_name", label: "Enterprise clustering name", showWhen: (v) => v.in_eysla === "false" },
            ],
          },
          {
            title: "Workers at registration",
            columns: 2,
            fields: [
              { name: "employees_male", label: "Male employees", type: "number", required: true },
              { name: "employees_female", label: "Female employees", type: "number", required: true },
            ],
          },
          {
            title: "Contact",
            columns: 2,
            fields: [
              {
                name: "contact_id", label: "Contact person", type: "select", help: "A registered participant.",
                options: (v) => [v.owner_participant_id, ...picker.selected].filter(Boolean).map((id) => [id, byId[id]?.fullName ?? id]),
              },
              { name: "contact_role", label: "Contact person's role", type: "select", options: lookups["enterprises.contact_role"] },
              { name: "phone", label: "Telephone", type: "tel", required: true, help: PHONE_HINT, check: phoneCheck },
              { name: "email", label: "Email", type: "email", check: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : t("Enter a valid email address")) },
            ],
          },
        ],
      },
      {
        title: "Location",
        hint: "",
        sections: [
          {
            title: "Location",
            columns: 4,
            fields: [
              { name: "region", label: "Region", type: "select", required: true, requiredMessage: "Region is required", options: regions.map((r) => [r, r]) },
              { name: "zone", label: "Zone", type: "select", required: true, requiredMessage: "Zone is required", options: (v) => Object.keys(places[v.region] ?? {}).map((z) => [z, z]) },
              { name: "woreda", label: "Woreda", type: "select", required: true, requiredMessage: "Woreda is required", options: (v) => (places[v.region]?.[v.zone] ?? []).map((w) => [w, w]) },
              { name: "kebele", label: "Kebele" },
            ],
          },
        ],
      },
    ];
  }

  function startValues() {
    if (!editing) return { status: "active", member_ids: [] };
    const e = editing;
    const f = enterpriseFacts(e);
    picker.selected = f.members.filter((p) => p.id !== e.leadId).map((p) => p.id);
    return {
      enterprise_name: e.name, registration_status: e.registrationStatus, tin_number: e.tinNumber ?? "", established_date: e.establishedDate,
      has_bylaw: "true", has_business_plan: "true", certificate_file: "certificate.pdf", status: e.status,
      ownership_type: e.ownershipType, premises: e.premises, supported_by: e.supportedBy, initial_capital: e.initialCapital,
      rayee_pathway: e.rayeePathway, value_chain: e.valueChain, value_chain_function: e.valueChainFunction, sub_business_types: e.subBusinessTypes,
      owner_participant_id: e.leadId, enterprise_size: e.size, member_ids: [...picker.selected],
      employees_male: f.male, employees_female: f.female, contact_id: e.contactId, contact_role: e.contactRole, phone: e.phone,
      region: e.region, zone: e.zone, woreda: e.woreda, kebele: e.kebele,
    };
  }

  function save(v) {
    const lead = store.get("participants", v.owner_participant_id);
    const row = {
      name: v.enterprise_name.trim(), leadId: v.owner_participant_id, contactId: v.contact_id || v.owner_participant_id, contactRole: v.contact_role || null,
      region: v.region, zone: v.zone, woreda: v.woreda, kebele: v.kebele, clusterId: lead?.clusterId ?? null, phone: v.phone,
      status: v.status || "active", registrationStatus: v.registration_status, tinNumber: v.registration_status === "formal" ? v.tin_number : null,
      certificateKind: v.registration_status === "formal" ? "business_licence" : "acknowledgement_certificate",
      size: v.enterprise_size, valueChain: v.value_chain || null, valueChainFunction: v.value_chain_function, subBusinessTypes: v.sub_business_types,
      ownershipType: v.ownership_type || null, premises: v.premises || null, establishedDate: v.established_date,
      initialCapital: Number(v.initial_capital) || null, supportedBy: v.supported_by, rayeePathway: v.rayee_pathway || null,
    };
    const id = editing ? editing.id : store.newId("e");
    if (editing) {
      store.update("enterprises", id, row);
      store.all("enterpriseMembers").filter((m) => m.enterpriseId === id).forEach((m) => store.remove("enterpriseMembers", m.id));
    } else {
      store.add("enterprises", { ...row, id, code: `EN-26-${String(Date.now() % 100000).padStart(5, "0")}`, review: "approved", registeredAt: TODAY });
    }
    picker.selected.forEach((pid, k) => store.add("enterpriseMembers", { id: store.newId(`em${k}`), enterpriseId: id, participantId: pid }));
    toastNext(t(editing ? "Enterprise updated" : "Saved and approved."));
    location.href = page(`enterprise.html?id=${id}`);
  }

  startPage({
    active: "/enterprises",
    module: "enterprises",
    action: "write",
    title: editing ? "Edit" : "New",
    trail: [
      { label: "Programme data", href: page("enterprises.html") },
      { label: "Enterprises", href: page("enterprises.html") },
      ...(editing ? [{ label: editing.name, href: page(`enterprise.html?id=${editing.id}`) }] : []),
      { label: editing ? "Edit" : "New" },
    ],
    render(user) {
      form ??= createForm({
        steps: build(user),
        values: startValues(),
        note: editing ? null : "DMIS form F02A. The enterprise is approved when saved.",
        saveLabel: "Save enterprise",
        onCancel: () => (location.href = editing ? page(`enterprise.html?id=${editing.id}`) : page("enterprises.html")),
        onSave: save,
      });
      return form.html();
    },
    bind: (root, user, rerender) => form.bind(root, rerender),
  });
})((window.App = window.App || {}));
