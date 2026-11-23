/*
 * New participant (and Edit, with ?edit=<id>) — a copy of
 * meal-mis-frontend/src/routes/_authenticated/participants.new.tsx and
 * components/participant-fields.tsx (PARTICIPANT_STEPS): Identification,
 * Personal details, Location and contact, Livelihood, Consent.
 * A cluster user can only register in their cluster's region.
 * Data: store.add("participants", …) — POST /participants
 */
(function (App) {
  const { t, store, startPage, page, lookups, places, userCluster, createForm, toastNext, TODAY } = App;

  const editId = new URLSearchParams(location.search).get("edit");
  const editing = editId ? store.get("participants", editId) : null;
  let form;

  const yes = (v) => v === "true" || v === true;
  const phoneCheck = (v) => (/^(?:\+?251|0)[79]\d{8}$/.test(v) ? null : t("Enter an Ethiopian phone number, e.g. 0912345678 or 0712345678 (or 251…/+251…)"));

  function build(user) {
    const cluster = userCluster(user);
    const regions = cluster ? [cluster.region] : Object.keys(places);
    const steps = [
      {
        title: "Identification",
        hint: "ID and name",
        sections: [
          {
            title: "Identification",
            description: "A National ID or a Kebele ID is required.",
            fields: [
              { name: "has_fayida", label: "Has a National ID (Fayida)?", type: "yesno", required: true, requiredMessage: "Say whether they have a Fayida ID" },
              {
                name: "national_id", label: "National ID (Fayida)", required: true, maxLength: 12, requiredMessage: "Enter the Fayida number (FAN)",
                showWhen: (v) => yes(v.has_fayida),
                check: (v) => (/^\d{12}$/.test(v) ? null : t("National ID must be exactly 12 digits")),
              },
              { name: "labour_id", label: "JCMIS Labour ID", help: "If they have one" },
              { name: "kebele_id", label: "Kebele ID", placeholder: "e.g. KB-2023/445", required: true, requiredMessage: "You must provide either a National ID or a Kebele ID", showWhen: (v) => v.has_fayida === "false" },
              { name: "kebele_id_scan", label: "Kebele ID scan", type: "file", required: true, showWhen: (v) => v.has_fayida === "false" },
            ],
          },
          {
            title: "Name",
            fields: [
              { name: "first_name", label: "First name", required: true, placeholder: "e.g. Hirut" },
              { name: "father_name", label: "Father's name", required: true, placeholder: "e.g. Alemu" },
              { name: "grandfather_name", label: "Grandfather's name", required: true, placeholder: "e.g. Bekele" },
            ],
          },
        ],
      },
      {
        title: "Personal details",
        hint: "Age, household, inclusion",
        sections: [
          {
            title: "Personal details",
            fields: [
              {
                name: "date_of_birth", label: "Date of birth", type: "date", required: true, max: TODAY,
                check: (v) => (v > TODAY ? t("Date of birth cannot be in the future") : null),
              },
              { name: "sex", label: "Sex", type: "select", required: true, placeholder: "Select sex", options: [["female", "Female"], ["male", "Male"]] },
              { name: "marital_status", label: "Marital status", type: "select", required: true, options: lookups["participants.marital_status"] },
              { name: "education_level", label: "Education level", type: "select", required: true, options: lookups["participants.education_level"] },
              { name: "field_of_study", label: "Field of study", type: "select", options: lookups["participants.field_of_study"] },
            ],
          },
          {
            title: "Inclusion and household",
            fields: [
              { name: "disability", label: "Disability", type: "yesno", required: true },
              { name: "disability_type", label: "Impairment type", type: "checkboxes", required: true, requiredMessage: "Tick at least one impairment type", span: "full", options: lookups["participants.disability_type"], showWhen: (v) => yes(v.disability) },
              { name: "disability_type_other", label: "Other impairment", required: true, requiredMessage: "Say what the other impairment is", showWhen: (v) => yes(v.disability) && (v.disability_type ?? []).includes("other") },
              { name: "target_status", label: "Target status", type: "select", required: true, options: lookups["participants.target_status"] },
              { name: "female_headed", label: "Female-headed household?", type: "yesno", required: true, requiredMessage: "Say whether it is a female-headed household" },
              { name: "has_dependents", label: "Has dependents?", type: "yesno", required: true, requiredMessage: "Say whether they have dependents" },
              { name: "dependents_count", label: "How many dependents", type: "number", required: true, requiredMessage: "How many dependents?", showWhen: (v) => yes(v.has_dependents) },
              {
                name: "children_under_5", label: "Children under 5", type: "number", placeholder: "If any", required: true, requiredMessage: "How many children under 5? (0 if none)", showWhen: (v) => yes(v.has_dependents),
                check: (v, all) => (Number(v) > Number(all.dependents_count || 0) ? t("Children under 5 cannot be more than the dependents") : null),
              },
            ],
          },
        ],
      },
      {
        title: "Location and contact",
        hint: "Where and how to reach them",
        sections: [
          {
            title: "Location",
            fields: [
              { name: "region", label: "Region", type: "select", required: true, options: regions.map((r) => [r, r]) },
              { name: "zone", label: "Zone", type: "select", required: true, options: (v) => Object.keys(places[v.region] ?? {}).map((z) => [z, z]) },
              { name: "woreda", label: "Woreda", type: "select", required: true, options: (v) => (places[v.region]?.[v.zone] ?? []).map((w) => [w, w]) },
              { name: "kebele", label: "Kebele", required: true, requiredMessage: "Kebele is required" },
              { name: "residence_type", label: "Residence location type", type: "select", required: true, options: lookups["participants.residence_type"], requiredMessage: "Choose rural, peri-urban or urban" },
            ],
          },
          {
            title: "Contact",
            fields: [
              { name: "phone", label: "Phone", type: "tel", required: true, placeholder: "0912345678", check: phoneCheck },
              { name: "alternative_phone", label: "Alternative contact", type: "tel", placeholder: "0912345678", check: phoneCheck },
              { name: "email", label: "Email", type: "email", check: (v) => (/^\S+@\S+\.\S+$/.test(v) ? null : t("Enter a valid email address")) },
            ],
          },
          { title: "Registration site", fields: [{ name: "registration_site", label: "Site name" }] },
        ],
      },
      {
        title: "Livelihood",
        hint: "Work and priorities",
        sections: [
          {
            title: "Livelihood",
            fields: [
              { name: "agri_experience", label: "Agri-business experience", type: "select", required: true, options: lookups["participants.agri_experience"] },
              { name: "employment_preference", label: "Employment preference", type: "select", required: true, requiredMessage: "Choose Self or Wage", options: [["self", "Self (in a group)"], ["wage", "Wage"]] },
              ...[1, 2, 3].map((n) => ({
                name: `priority_${n}`, label: ["1st priority", "2nd priority", "3rd priority"][n - 1], type: "select", required: true, placeholder: "Select sector",
                requiredMessage: ["1st priority is required", "2nd priority is required", "3rd priority is required"][n - 1],
                options: (v) => lookups["participants.priority_sector"].filter(([c]) => ![1, 2, 3].some((k) => k !== n && v[`priority_${k}`] === c)),
              })),
            ],
          },
        ],
      },
      {
        title: "Consent",
        hint: "Required to save",
        sections: [
          {
            title: "Consent",
            description: "Required before any personal data is recorded.",
            columns: 1,
            fields: [
              {
                name: "consent_given", required: true, type: "custom", label: "",
                requiredMessage: "Informed consent must be obtained before registering. Explain how the data will be used, then tick the consent box.",
                html: (v) => `
                  <label class="flex items-start gap-3 rounded-[10px] border border-line bg-white p-4">
                    <input type="checkbox" data-consent ${v.consent_given ? "checked" : ""} ${editing ? "disabled" : ""} class="mt-0.5 h-4 w-4 accent-blue-600" />
                    <span class="text-sm leading-snug text-slate-700">
                      <span class="font-semibold text-ink">${t("Informed consent obtained *")}</span>
                      <span class="mt-1 block text-muted-foreground">${t("In plain words, tell the person: we record their details to follow their progress in RAYEE II; only programme staff see them; they can say no or withdraw at any time, and their details are then removed.")}</span>
                      ${editing ? `<span class="mt-1 block text-muted-foreground">${t("Consent is a record of what the person agreed to, so an edit cannot untick it.")}</span>` : ""}
                    </span>
                  </label>`,
                bind: (root, state, rerender) =>
                  root.querySelector("[data-consent]")?.addEventListener("change", (e) => {
                    state.values.consent_given = e.target.checked || "";
                    delete state.errors.consent_given;
                    rerender();
                  }),
              },
            ],
          },
        ],
      },
    ];
    return steps;
  }

  function startValues(user) {
    const cluster = userCluster(user);
    if (!editing) return { region: cluster?.region ?? "" };
    const p = editing;
    return {
      has_fayida: p.nationalId ? "true" : "false", national_id: p.nationalId ?? "", kebele_id: p.kebeleId ?? "", kebele_id_scan: p.kebeleId ? "kebele-id.jpg" : "",
      first_name: p.firstName, father_name: p.fatherName, grandfather_name: p.grandfatherName,
      date_of_birth: p.dateOfBirth, sex: p.sex, marital_status: p.maritalStatus, education_level: p.education,
      disability: String(p.disability), disability_type: p.disabilityTypes, target_status: p.targetStatus,
      female_headed: String(p.femaleHeaded), has_dependents: String(p.dependents > 0), dependents_count: p.dependents || "",
      region: p.region, zone: p.zone, woreda: p.woreda, kebele: p.kebele, residence_type: p.residence, phone: p.phone,
      agri_experience: p.agriExperience, priority_1: p.priorities[0], priority_2: p.priorities[1], priority_3: p.priorities[2],
      consent_given: p.consent,
    };
  }

  function save(v, user) {
    const cluster = App.clusters.find((c) => c.region === v.region);
    const row = {
      firstName: v.first_name, fatherName: v.father_name, grandfatherName: v.grandfather_name,
      fullName: `${v.first_name} ${v.father_name} ${v.grandfather_name}`,
      sex: v.sex, dateOfBirth: v.date_of_birth, phone: v.phone,
      nationalId: yes(v.has_fayida) ? v.national_id : null, kebeleId: yes(v.has_fayida) ? null : v.kebele_id, faydaChecked: false,
      region: v.region, zone: v.zone, woreda: v.woreda, kebele: v.kebele, clusterId: cluster?.id ?? null,
      residence: v.residence_type, disability: yes(v.disability), disabilityTypes: yes(v.disability) ? v.disability_type : [],
      targetStatus: v.target_status, education: v.education_level, maritalStatus: v.marital_status,
      femaleHeaded: yes(v.female_headed), dependents: yes(v.has_dependents) ? Number(v.dependents_count) : 0,
      agriExperience: v.agri_experience, priorities: [v.priority_1, v.priority_2, v.priority_3], consent: true,
    };
    if (editing) {
      store.update("participants", editing.id, row);
      toastNext(t("Participant updated"));
      location.href = page(`participant.html?id=${editing.id}`);
    } else {
      const id = store.newId("p");
      store.add("participants", {
        ...row, id, code: `RY-26-${String(Date.now() % 1000000).padStart(6, "0")}`,
        status: "active", review: "approved", registeredAt: TODAY,
      });
      toastNext(t("Registered and approved."));
      location.href = page(`participant.html?id=${id}`);
    }
  }

  startPage({
    active: "/participants",
    module: "participants",
    action: "write",
    title: editing ? "Edit" : "New",
    trail: [
      { label: "Programme data", href: page("participants.html") },
      { label: "Participants", href: page("participants.html") },
      ...(editing ? [{ label: editing.fullName, href: page(`participant.html?id=${editing.id}`) }] : []),
      { label: editing ? "Edit" : "New" },
    ],
    render(user) {
      form ??= createForm({
        steps: build(user),
        values: startValues(user),
        note: editing ? null : "The registration is approved when saved.",
        saveLabel: editing ? "Save changes" : "Register participant",
        onCancel: () => (location.href = editing ? page(`participant.html?id=${editing.id}`) : page("participants.html")),
        onSave: (v) => save(v, user),
      });
      return form.html();
    },
    bind: (root, user, rerender) => form.bind(root, rerender),
  });
})((window.App = window.App || {}));
