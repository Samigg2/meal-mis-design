/*
 * ALL the sample data the design pages show. Nothing is typed into the pages.
 *
 * Each top-level key stands for a future API call of the real system
 * (meal-mis-backend), named beside it. When this becomes React + NestJS,
 * replace the key with that call and keep the shape.
 *
 * Everything about people is made up: names, phones, IDs. Places are real
 * Ethiopian regions, zones and woredas. Dropdown lists (lookups) are copied
 * from the real database (lookup_values) so the words match the system.
 *
 * Participants and enterprises are built by a small seeded generator at the
 * bottom so the list is long enough to page through and always the same.
 */
(function (App) {
  /** The programme's goals on the sign-in page (from the TOR). Fixed text in the real app. */
  const programmeGoals = [
    { icon: "users", value: "1M", label: "Youth" },
    { icon: "building-2", value: "94K", label: "Enterprises" },
    { icon: "layers", value: "5", label: "Pillars" },
  ];

  /** Clusters — GET /admin/organizations */
  const clusters = [
    {
      id: "cl-oromia",
      name: "Oromia cluster",
      code: "CL-01",
      region: "Oromia",
      description: "Oromia delivery cluster",
    },
    {
      id: "cl-amhara",
      name: "Amhara cluster",
      code: "CL-02",
      region: "Amhara",
      description: "Amhara delivery cluster",
    },
  ];

  /** Region → zone → woreda (real names). Kebeles are numbered in the system. — GET /places */
  const places = {
    Oromia: {
      "East Shewa": ["Adama", "Bishoftu", "Lume", "Ada'a"],
      "West Arsi": ["Shashemene", "Arsi Negele", "Kofele"],
      Jimma: ["Seka Chekorsa", "Mana", "Dedo"],
    },
    Amhara: {
      "West Gojjam": ["Bahir Dar Zuria", "Mecha", "Yilmana Densa"],
      "North Gondar": ["Gondar Zuria", "Dembia", "Wogera"],
      "South Wollo": ["Dessie Zuria", "Kalu", "Tehuledere"],
    },
  };

  /** Map points for the Reach by region map (region centres). */
  const regionPoints = {
    Oromia: [8.55, 39.27],
    Amhara: [11.59, 37.39],
  };

  /** Built-in roles — GET /admin/roles (labels as in the real system). */
  const roles = [
    { id: "super_admin", key: "super_admin", label: "Super admin", isSystem: true, color: "red" },
    { id: "programme_manager", key: "programme_manager", label: "Programme manager", isSystem: true, color: "blue" },
    { id: "monitoring_officer", key: "monitoring_officer", label: "Monitoring officer", isSystem: true, color: "fuchsia" },
    { id: "field_officer", key: "field_officer", label: "Field officer", isSystem: true, color: "emerald" },
    { id: "finance_officer", key: "finance_officer", label: "Finance officer", isSystem: true, color: "amber" },
    { id: "donor_viewer", key: "donor_viewer", label: "Donor viewer", isSystem: true, color: "slate" },
  ];

  /** Permission modules shown on a role page — src/common/permissions.ts */
  const permissionModules = [
    "participants", "enterprises", "training", "partnerships", "governance", "actions",
    "finance", "feedback", "safeguarding", "monitoring", "surveys", "learning", "reports",
    "admin", "material", "empowerment", "sbcc", "employment", "ysla", "institutions",
    "support_networks", "audit", "compliance", "evaluations",
  ];
  const ACTIONS = ["read", "write", "approve", "delete"];

  /** Role × module × action — the built-in MATRIX of src/common/permissions.ts, copied as it is. */
  const permissions = {
      super_admin: Object.fromEntries(permissionModules.map((m) => [m, [...ACTIONS]])),
      programme_manager: {"participants": ["read", "write", "approve"], "enterprises": ["read", "write", "approve", "delete"], "training": ["read", "write", "delete"], "partnerships": ["read", "write", "delete"], "governance": ["read", "write", "delete"], "actions": ["read", "write", "delete", "approve"], "finance": ["read", "write", "approve"], "feedback": ["read", "write", "delete"], "safeguarding": ["read", "write"], "monitoring": ["read", "write", "approve", "delete"], "surveys": ["read", "write", "approve", "delete"], "learning": ["read", "write", "delete"], "reports": ["read"], "admin": ["read", "write"], "material": ["read", "write", "delete", "approve"], "empowerment": ["read", "write", "delete"], "sbcc": ["read", "write", "delete"], "employment": ["read", "write", "approve"], "ysla": ["read", "write", "approve"], "institutions": ["read", "write", "delete"], "support_networks": ["read", "write", "delete"], "audit": ["read"], "compliance": ["read"], "evaluations": ["read", "write", "approve", "delete"]},
      monitoring_officer: {"participants": ["read", "write", "approve"], "enterprises": ["read", "write", "approve", "delete"], "training": ["read"], "partnerships": ["read"], "governance": ["read", "write", "delete"], "actions": ["read", "write", "delete", "approve"], "feedback": ["read", "write", "delete"], "monitoring": ["read", "write", "approve", "delete"], "surveys": ["read", "write", "approve", "delete"], "learning": ["read", "write", "delete"], "reports": ["read"], "material": ["read"], "empowerment": ["read", "write", "delete"], "sbcc": ["read", "write", "delete"], "employment": ["read", "write", "approve"], "institutions": ["read", "write", "delete"], "support_networks": ["read", "write", "delete"], "compliance": ["read"], "evaluations": ["read", "write", "delete"]},
      field_officer: {"participants": ["read", "write"], "enterprises": ["read", "write", "delete"], "training": ["read", "write", "delete"], "governance": ["read"], "actions": ["read", "write", "delete"], "feedback": ["read", "write", "delete"], "monitoring": ["read"], "surveys": ["read", "write", "delete"], "learning": ["read", "write", "delete"], "material": ["read", "write", "delete"], "empowerment": ["read", "write", "delete"], "sbcc": ["read", "write", "delete"], "employment": ["read", "write"], "institutions": ["read"], "support_networks": ["read", "write", "delete"], "compliance": ["read"], "evaluations": ["read"]},
      finance_officer: {"actions": ["read"], "finance": ["read", "write"], "monitoring": ["read"], "learning": ["read"], "reports": ["read"], "ysla": ["read", "write"]},
      donor_viewer: {"participants": ["read"], "enterprises": ["read"], "training": ["read"], "partnerships": ["read"], "governance": ["read"], "finance": ["read"], "monitoring": ["read"], "surveys": ["read"], "learning": ["read"], "reports": ["read"], "material": ["read"], "empowerment": ["read"], "sbcc": ["read"], "employment": ["read"], "ysla": ["read"], "institutions": ["read"], "support_networks": ["read"], "compliance": ["read"], "evaluations": ["read"]},
  };

  /** Dropdown lists — GET /lookups (copied from the real lookup_values). */
  const lookups = {
    "participants.priority_sector": [
      ["poultry", "Poultry"], ["sheep_goat_fattening", "Sheep/Goat fattening"], ["dairy", "Dairy"], ["horticulture", "Horticulture"],
    ],
    "participants.education_level": [
      ["unable_to_read_write", "Unable to read and write"], ["primary", "Primary"], ["secondary", "Secondary"], ["tvet", "TVET"], ["university", "College or university"],
    ],
    "participants.marital_status": [
      ["single", "Single"], ["married", "Married"], ["divorced", "Divorced"], ["separated", "Separated"], ["widowed", "Widowed"],
    ],
    "participants.residence_type": [["rural", "Rural"], ["peri_urban", "Peri-urban"], ["urban", "Urban"]],
    "participants.agri_experience": [["new", "New"], ["re_entry", "Re-entry"], ["additional", "Additional"], ["improved", "Improved"]],
    "participants.disability_type": [["physical", "Physical"], ["visual", "Visual"], ["hearing", "Hearing"], ["intellectual", "Intellectual"], ["other", "Other"]],
    "participants.field_of_study": [
      ["agronomy", "Agronomy / Plant science"], ["animal_science", "Animal science"], ["agricultural_economics", "Agricultural economics"], ["accounting", "Accounting / Finance"], ["management", "Management / Business"], ["ict", "ICT"], ["other", "Other"],
    ],
    "participants.target_status": [["idp", "IDP"], ["returnee", "Returnee"], ["neither", "Not IDP or returnee"]],
    "enterprises.registration_status": [["formal", "Formal"], ["semi_formal", "Semi-formal"], ["informal", "Informal"]],
    "enterprises.enterprise_size": [
      ["micro", "Micro (up to 5 members, capital under 50,000 ETB)"],
      ["medium", "Medium (6-10 members, capital 50,000 to under 100,000 ETB)"],
      ["small", "Small (11-30 members, capital 100,000-500,000 ETB)"],
      ["large", "Large (over 30 members, capital over 500,000 ETB)"],
    ],
    "enterprises.value_chain": [["poultry", "Poultry"], ["dairy", "Dairy"], ["sheep_goat_fattening", "Sheep-Goat fattening"], ["horticulture", "Horticulture"]],
    "enterprises.value_chain_function": [
      ["production", "Production"], ["processing", "Processing"], ["collection_aggregation", "Collection and aggregation"], ["input_supply", "Input supply"], ["trading", "Trading (marketing – retailing, wholesaling and export)"], ["transportation", "Transportation"],
    ],
    "enterprises.sub_business_types": [
      ["egg_production", "Egg production"], ["broiler_production", "Broiler production"], ["day_old_chicks", "Day old chicks"], ["milk_production", "Milk production"], ["milk_processing", "Milk processing"], ["cattle_fattening", "Cattle fattening"], ["cabbage_production", "Cabbage production"], ["garlic_production", "Garlic production"],
    ],
    "enterprises.ownership_type": [["family", "Family"], ["hybrid", "Hybrid"], ["other", "Other"]],
    "enterprises.premises": [["own", "Own"], ["rental", "Rental"], ["government_support", "Government support"], ["other", "Other"]],
    "enterprises.contact_role": [["chair_person", "Chair person"], ["secretary", "Secretary"], ["cashier", "Cashier"], ["member", "Member"]],
    "enterprises.certificate_kind": [["business_licence", "Business licence"], ["acknowledgement_certificate", "Acknowledgement certificate"]],
    "enterprises.supported_by": [["rayee_ii", "RAYEE II"], ["other", "Other"]],
    "enterprises.rayee_pathway": [["pathway_1", "Pathway 1"], ["pathway_2", "Pathway 2 (A & B)"], ["pathway_3", "Pathway 3"]],
  };

  /** Reference data page: the lists, grouped by module — GET /admin/lookups */
  const lookupCategories = Object.keys(lookups).map((key) => ({
    key,
    module: key.split(".")[0],
    name: key.split(".")[1].replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
  }));

  /**
   * Reference data rows — GET /admin/reference-data. Every lookup value plus the
   * locations (region → zone → woreda), one row each, so they can be retired
   * (offered: false) or added to on the Reference data page.
   */
  const referenceValues = [
    ...Object.keys(places).map((r) => ({ id: `rv-region-${r}`, category: "region", value: r, label: r, parent: null, point: regionPoints[r] ?? null, active: true })),
    ...Object.entries(places).flatMap(([r, zones]) => Object.keys(zones).map((z) => ({ id: `rv-zone-${z}`, category: "zone", value: z, label: z, parent: r, active: true }))),
    ...Object.values(places).flatMap((zones) => Object.entries(zones).flatMap(([z, ws]) => ws.map((w) => ({ id: `rv-woreda-${w}`, category: "woreda", value: w, label: w, parent: z, active: true })))),
    ...Object.entries(lookups).flatMap(([category, opts]) => opts.map(([value, label]) => ({ id: `rv-${category}-${value}`, category, value, label, parent: null, active: true }))),
  ];

  /** Custom fields — GET /admin/custom-fields (design sample). */
  const customFields = [
    { id: "cf-1", module: "participants", label: "Mobile money account", key: "mobile_money", type: "boolean", required: false, options: [], active: true },
    { id: "cf-2", module: "participants", label: "Preferred training day", key: "training_day", type: "select", required: false, options: ["Monday", "Wednesday", "Saturday"], active: true },
    { id: "cf-3", module: "participants", label: "Household land size (ha)", key: "land_size", type: "number", required: false, options: [], active: true },
    { id: "cf-4", module: "enterprises", label: "Market linkage partner", key: "market_partner", type: "text", required: false, options: [], active: true },
    { id: "cf-5", module: "enterprises", label: "Has a bank account", key: "bank_account", type: "boolean", required: true, options: [], active: true },
    { id: "cf-6", module: "enterprises", label: "Water source", key: "water_source", type: "select", required: false, options: ["Tap", "Well", "River"], active: false },
  ];

  /**
   * Demo sign-ins (design only — the real system signs in through POST /auth/login).
   * clusterId null = national: sees every cluster, like the real scoping rule.
   */
  const demoAccounts = [
    { id: "u-national", kind: "National", fullName: "Meron Tesfaye", email: "national@rayee-demo.org", password: "Demo@2026", role: "super_admin", clusterId: null },
    { id: "u-oromia", kind: "Oromia cluster", fullName: "Lensa Gudeta", email: "oromia@rayee-demo.org", password: "Demo@2026", role: "monitoring_officer", clusterId: "cl-oromia" },
    { id: "u-amhara", kind: "Amhara cluster", fullName: "Yohannes Alemu", email: "amhara@rayee-demo.org", password: "Demo@2026", role: "monitoring_officer", clusterId: "cl-amhara" },
  ];

  /** Staff — GET /admin/users (the demo accounts plus colleagues). */
  const users = [
    ...demoAccounts.map((a) => ({ id: a.id, fullName: a.fullName, email: a.email, role: a.role, clusterId: a.clusterId, status: "active" })),
    { id: "u-4", fullName: "Abdi Hussen", email: "oromia.manager@rayee-demo.org", role: "programme_manager", clusterId: "cl-oromia", status: "active" },
    { id: "u-5", fullName: "Chaltu Bekele", email: "oromia.field1@rayee-demo.org", role: "field_officer", clusterId: "cl-oromia", status: "active" },
    { id: "u-6", fullName: "Gemechu Tola", email: "oromia.field2@rayee-demo.org", role: "field_officer", clusterId: "cl-oromia", status: "active" },
    { id: "u-7", fullName: "Hana Girma", email: "oromia.finance@rayee-demo.org", role: "finance_officer", clusterId: "cl-oromia", status: "disabled" },
    { id: "u-8", fullName: "Tigist Mengistu", email: "amhara.manager@rayee-demo.org", role: "programme_manager", clusterId: "cl-amhara", status: "active" },
    { id: "u-9", fullName: "Dawit Mekonnen", email: "amhara.field1@rayee-demo.org", role: "field_officer", clusterId: "cl-amhara", status: "active" },
    { id: "u-10", fullName: "Selam Ayele", email: "amhara.field2@rayee-demo.org", role: "field_officer", clusterId: "cl-amhara", status: "active" },
    { id: "u-11", fullName: "Birtukan Asfaw", email: "amhara.finance@rayee-demo.org", role: "finance_officer", clusterId: "cl-amhara", status: "active" },
    { id: "u-12", fullName: "Martha Haile", email: "donor@rayee-demo.org", role: "donor_viewer", clusterId: null, status: "active" },
  ];

  /** Bell count in the top bar — GET /notifications */
  const notifications = { total: 12 };

  // ───────────────────── generated participants and enterprises ─────────────────────

  let seed = 20261122;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
  const pick = (list) => list[Math.floor(rnd() * list.length)];

  const FIRST_F = ["Hirut", "Meseret", "Tigist", "Almaz", "Chaltu", "Lensa", "Hawi", "Bontu", "Selam", "Marta", "Kidist", "Aster", "Genet", "Yeshi", "Ayantu", "Mahlet", "Liya", "Bethlehem", "Eden", "Frehiwot"];
  const FIRST_M = ["Abebe", "Dawit", "Biruk", "Gemechu", "Tesfaye", "Yonas", "Lemma", "Kebede", "Fikadu", "Tadesse", "Abdi", "Henok", "Natnael", "Bekele", "Getachew"];
  const FATHERS = ["Alemu", "Bekele", "Tolosa", "Girma", "Haile", "Mengistu", "Asfaw", "Desta", "Tadesse", "Gudeta", "Wolde", "Abera", "Kebede", "Ayele", "Shiferaw", "Negash"];
  const SECTORS = lookups["participants.priority_sector"].map(([c]) => c);

  const regionOf = (clusterId) => clusters.find((c) => c.id === clusterId).region;

  const participants = Array.from({ length: 120 }, (_, i) => {
    const female = rnd() < 0.64;
    const clusterId = i % 2 === 0 ? "cl-oromia" : "cl-amhara";
    const region = regionOf(clusterId);
    const zone = pick(Object.keys(places[region]));
    const woreda = pick(places[region][zone]);
    const first = pick(female ? FIRST_F : FIRST_M);
    const father = pick(FATHERS);
    const grand = pick(FATHERS);
    const year = 1988 + Math.floor(rnd() * 19);
    const month = 1 + Math.floor(rnd() * 12);
    const day = 1 + Math.floor(rnd() * 28);
    const prio = [...SECTORS].sort(() => rnd() - 0.5).slice(0, 3);
    const regMonth = 1 + Math.floor(rnd() * 11);
    const review = i % 17 === 5 ? "pending" : i % 23 === 7 ? "rejected" : "approved";
    const hasNid = rnd() < 0.7;
    return {
      id: `p-${i + 1}`,
      code: `RY-26-${String(2201 + i * 7).padStart(6, "0")}`,
      firstName: first,
      fatherName: father,
      grandfatherName: grand,
      fullName: `${first} ${father} ${grand}`,
      sex: female ? "female" : "male",
      dateOfBirth: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      phone: `09${String(11000000 + Math.floor(rnd() * 88999999)).slice(0, 8)}`,
      nationalId: hasNid ? `${8998766}${String(10000 + i).slice(-5)}` : null,
      faydaChecked: hasNid && rnd() < 0.6,
      kebeleId: hasNid ? null : `KB-${2020 + (i % 5)}/${100 + i}`,
      region,
      zone,
      woreda,
      kebele: `Kebele ${String(1 + (i % 12)).padStart(2, "0")}`,
      clusterId,
      residence: pick(["rural", "rural", "peri_urban", "urban"]),
      status: i % 13 === 4 ? "inactive" : "active",
      review,
      disability: rnd() < 0.13,
      disabilityTypes: ["physical"],
      targetStatus: pick(["neither", "neither", "neither", "returnee", "idp"]),
      education: pick(lookups["participants.education_level"]).at(0),
      maritalStatus: pick(["single", "single", "married"]),
      femaleHeaded: female && rnd() < 0.3,
      dependents: 1 + Math.floor(rnd() * 6),
      agriExperience: pick(["new", "new", "re_entry", "additional", "improved"]),
      priorities: prio,
      registeredAt: `2026-${String(regMonth).padStart(2, "0")}-${String(1 + Math.floor(rnd() * 27)).padStart(2, "0")}`,
      consent: true,
    };
  });

  // Enterprises: a lead (owner), a contact person and members from the same cluster.
  const ENT_NAMES = [
    ["Poultry farm", "poultry", ["egg_production", "broiler_production"]],
    ["Egg aggregation", "poultry", ["egg_production"]],
    ["Dairy cooperative", "dairy", ["milk_production"]],
    ["Milk processing", "dairy", ["milk_processing"]],
    ["Sheep fattening", "sheep_goat_fattening", ["cattle_fattening"]],
    ["Goat fattening", "sheep_goat_fattening", ["cattle_fattening"]],
    ["Vegetable farm", "horticulture", ["cabbage_production", "garlic_production"]],
    ["Garlic growers", "horticulture", ["garlic_production"]],
  ];
  const SIZE_FOR = (n) => (n <= 5 ? "micro" : n <= 10 ? "medium" : n <= 30 ? "small" : "large");

  const enterprises = [];
  const enterpriseMembers = [];
  const free = { "cl-oromia": [], "cl-amhara": [] };
  participants.filter((p) => p.review === "approved").forEach((p) => free[p.clusterId].push(p));

  for (let i = 0; i < 24; i++) {
    const clusterId = i % 2 === 0 ? "cl-oromia" : "cl-amhara";
    const pool = free[clusterId];
    const want = [2, 3, 3, 6, 7, 2, 12, 2][i % 8];
    if (pool.length < want + 1) break;
    const lead = pool.shift();
    const members = pool.splice(0, want - 1);
    const [label, chain, subs] = ENT_NAMES[i % ENT_NAMES.length];
    // Two enterprises share a name, to show the "Same name" flag.
    const name = i === 3 ? enterprises[1].name : `${lead.firstName}'s ${label}`;
    const reg = pick(["formal", "semi_formal", "informal", "informal"]);
    const total = members.length + 1;
    const e = {
      id: `e-${i + 1}`,
      code: `EN-26-${String(301 + i * 3).padStart(5, "0")}`,
      name,
      leadId: lead.id,
      contactId: members[0]?.id ?? lead.id,
      contactRole: pick(["chair_person", "secretary", "cashier"]),
      region: lead.region,
      zone: lead.zone,
      woreda: lead.woreda,
      kebele: lead.kebele,
      clusterId,
      phone: lead.phone,
      status: i % 7 === 6 ? "inactive" : "active",
      review: i % 11 === 9 ? "pending" : "approved",
      registrationStatus: reg,
      tinNumber: reg === "formal" ? `00${String(12345670 + i * 13).slice(0, 8)}` : null,
      certificateKind: reg === "formal" ? "business_licence" : "acknowledgement_certificate",
      size: SIZE_FOR(total),
      valueChain: chain,
      valueChainFunction: pick(["production", "production", "processing", "trading"]),
      subBusinessTypes: subs,
      ownershipType: pick(["family", "hybrid", "other"]),
      premises: pick(["own", "rental", "government_support"]),
      establishedDate: `20${String(18 + (i % 8)).padStart(2, "0")}-${String(1 + (i % 12)).padStart(2, "0")}-15`,
      registeredAt: `2026-${String(1 + (i % 11)).padStart(2, "0")}-${String(3 + i).padStart(2, "0")}`,
      initialCapital: 20000 + (i % 6) * 15000,
      supportedBy: "rayee_ii",
      rayeePathway: pick(["pathway_1", "pathway_2", "pathway_3"]),
    };
    enterprises.push(e);
    members.forEach((m, k) => enterpriseMembers.push({ id: `em-${i + 1}-${k + 1}`, enterpriseId: e.id, participantId: m.id }));
  }

  Object.assign(App, {
    programmeGoals,
    clusters,
    places,
    regionPoints,
    roles,
    permissionModules,
    ACTIONS,
    permissions,
    lookups,
    lookupCategories,
    customFields,
    referenceValues,
    demoAccounts,
    users,
    notifications,
    participants,
    enterprises,
    enterpriseMembers,
  });
})((window.App = window.App || {}));
