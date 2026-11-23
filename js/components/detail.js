/*
 * Record page pieces — copies of components/data/detail-layout.tsx and
 * components/participant-detail/*:
 *   RecordTabs(tabs, active)        — the underline tabs with counts
 *   InfoCard({ icon, title, side, body })  — "General information · CORE PROFILE"
 *   Rows([[label, value], …])      — lined label/value rows
 *   SubHead(icon, text, side)       — "DEMOGRAPHICS · Verified"
 */
(function (App) {
  const { t, icon, esc, CARD } = App;

  function RecordTabs(tabs, active) {
    return `
    <nav class="flex items-center gap-1 overflow-x-auto overflow-y-hidden border-b border-slate-200" role="tablist">
      ${tabs
        .map((tab) => {
          const on = tab.key === active;
          return `
        <a href="${tab.href}" role="tab" aria-selected="${on}" ${tab.key ? `data-tab="${tab.key}"` : ""}
          class="-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-[15px] font-medium transition-colors ${on ? "border-blue-600 text-blue-600" : "border-transparent text-slate-600 hover:text-slate-900"}">
          ${icon(tab.icon, "h-4 w-4")} ${esc(t(tab.label))}
          ${tab.count !== undefined ? `<span class="rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] font-semibold text-slate-500">${tab.count}</span>` : ""}
          ${tab.more ? icon("chevron-down", "h-4 w-4") : ""}
        </a>`;
        })
        .join("")}
    </nav>`;
  }

  function InfoCard({ iconName, title, side = "", body, className = "" }) {
    return `
    <section class="${CARD} p-5 ${className}">
      <header class="mb-2 flex items-center justify-between gap-3">
        <h2 class="flex items-center gap-2.5 text-lg font-bold text-slate-800">${icon(iconName, "h-5 w-5 text-blue-600")} ${esc(t(title))}</h2>
        ${side ? `<span class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">${esc(side)}</span>` : ""}
      </header>
      ${body}
    </section>`;
  }

  /** value: html; empty values show "—" (or a grey "Not provided" when given as { none }). */
  const Rows = (rows) => `
    <dl class="divide-y divide-slate-100">
      ${rows
        .filter(Boolean)
        .map(
          ([label, value]) => `
        <div class="flex items-start justify-between gap-6 py-2.5 text-sm">
          <dt class="min-w-0 flex-1 text-slate-600">${esc(t(label))}</dt>
          <dd class="max-w-[65%] text-right font-medium text-slate-800">${value === null || value === undefined || value === "" ? `<span class="text-slate-400">—</span>` : value}</dd>
        </div>`,
        )
        .join("")}
    </dl>`;

  const none = (text = "Not provided") => `<span class="font-normal text-slate-400">${esc(t(text))}</span>`;

  const SubHead = (iconName, text, side = "") => `
    <div class="mt-4 flex items-center justify-between border-b border-slate-100 pb-2">
      <p class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">${icon(iconName, "h-3.5 w-3.5")} ${esc(t(text))}</p>
      ${side ? `<span class="text-[11px] text-slate-400">${esc(t(side))}</span>` : ""}
    </div>`;

  Object.assign(App, { RecordTabs, InfoCard, Rows, none, SubHead });
})((window.App = window.App || {}));
