/*
 * Number, date and label helpers shared by every page. The real app has the
 * same ones in src/components/dashboard-widgets.tsx (nf, fmtPct, pctOf) and
 * src/lib/ethiopian-date.ts (the EC calendar).
 */
(function (App) {
  const { t, getLang, lookups } = App;

  const nf = new Intl.NumberFormat("en");
  const num = (n) => nf.format(n ?? 0);
  const pctOf = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);
  const fmtPct = (p) => `${p >= 10 || p === 0 ? Math.round(p) : p.toFixed(1)}%`;

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const EC_MONTHS = ["Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit", "Megabit", "Miyazia", "Ginbot", "Sene", "Hamle", "Nehase", "Pagume"];
  const EC_MONTHS_AM = ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"];

  /** "2026-11-20" → Ethiopian { year, month, day } (Amete Mihret). */
  function toEthiopian(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const a = Math.floor((14 - m) / 12);
    const yy = y + 4800 - a;
    const mm = m + 12 * a - 3;
    const jdn = d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
    const EPOCH = 1723856;
    const r = (jdn - EPOCH) % 1461;
    const n = (r % 365) + 365 * Math.floor(r / 1460);
    return {
      year: 4 * Math.floor((jdn - EPOCH) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460),
      month: Math.floor(n / 30) + 1,
      day: (n % 30) + 1,
    };
  }

  /** 20 Nov 2026 in English, ኅዳር 11 2019 ዓ.ም. in Amharic (dates follow the language). */
  function fmtDate(iso) {
    if (!iso) return "—";
    if (getLang() === "am") {
      const e = toEthiopian(iso);
      return `${EC_MONTHS_AM[e.month - 1]} ${e.day} ${e.year} ዓ.ም.`;
    }
    const [y, m, d] = iso.split("-").map(Number);
    return `${d} ${MONTHS[m - 1]} ${y}`;
  }

  /** "17 Hamle 1990 EC (24 Jul 1998)" — the participant page's date of birth. */
  function fmtDateBoth(iso) {
    if (!iso) return "—";
    const e = toEthiopian(iso);
    const [y, m, d] = iso.split("-").map(Number);
    return `${e.day} ${EC_MONTHS[e.month - 1]} ${e.year} EC (${d} ${MONTHS[m - 1]} ${y})`;
  }

  const TODAY = "2026-11-22";
  function ageFrom(iso) {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    const [ty, tm, td] = TODAY.split("-").map(Number);
    return ty - y - (tm < m || (tm === m && td < d) ? 1 : 0);
  }
  const isYouth = (p) => {
    const a = ageFrom(p.dateOfBirth);
    return a !== null && a >= 15 && a <= 35;
  };

  /** A dropdown code → its label, through t(): label("participants.education_level", "tvet"). */
  function label(category, code) {
    const hit = (lookups[category] ?? []).find(([c]) => c === code);
    // Amharic for a dropdown value comes from AM_LOOKUPS by its code (am-lookups.ts).
    const am = App.getLang() === "am" ? App.AM_LOOKUPS?.[category]?.[code] : null;
    if (am) return am;
    return hit ? t(hit[1]) : code ? code.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()) : "—";
  }

  const initials = (name) =>
    (name || "")
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  Object.assign(App, { num, pctOf, fmtPct, fmtDate, fmtDateBoth, toEthiopian, ageFrom, isYouth, label, initials, esc, MONTHS, TODAY });
})((window.App = window.App || {}));
