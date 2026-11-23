/*
 * What the real system works out from an enterprise's lead and members
 * (migration 0117, 2026-11-20): women/men, disability, returnees, IDPs and
 * youth-, women-, disability-, returnee- or IDP-led. Nobody types these.
 * Real app: the API fills these columns when members change.
 */
(function (App) {
  const { store, ageFrom } = App;

  function enterpriseFacts(e) {
    const people = Object.fromEntries(store.all("participants").map((p) => [p.id, p]));
    const lead = people[e.leadId] ?? null;
    const memberIds = store.all("enterpriseMembers").filter((m) => m.enterpriseId === e.id).map((m) => m.participantId);
    const all = [lead, ...memberIds.filter((id) => id !== e.leadId).map((id) => people[id])].filter(Boolean);
    const count = (f) => all.filter(f).length;
    const age = lead ? ageFrom(lead.dateOfBirth) : null;
    return {
      lead,
      leadAge: age,
      members: all,
      total: all.length,
      female: count((p) => p.sex === "female"),
      male: count((p) => p.sex === "male"),
      disability: count((p) => p.disability),
      returnees: count((p) => p.targetStatus === "returnee"),
      idps: count((p) => p.targetStatus === "idp"),
      youthLed: !!lead && age >= 15 && age <= 35,
      womenLed: lead?.sex === "female",
      pwdLed: !!lead?.disability,
      returneeLed: lead?.targetStatus === "returnee",
      idpLed: lead?.targetStatus === "idp",
    };
  }

  /** Members allowed per size — SIZE_RANGE in enterprises.new.tsx (the lead counts). */
  const SIZE_RANGE = {
    micro: { min: 1, max: 5, text: "Micro takes 1 to 5 members" },
    medium: { min: 6, max: 10, text: "Medium takes 6 to 10 members" },
    small: { min: 11, max: 30, text: "Small takes 11 to 30 members" },
    large: { min: 31, max: 2000, text: "Large takes more than 30 members" },
  };

  Object.assign(App, { enterpriseFacts, SIZE_RANGE });
})((window.App = window.App || {}));
