/*
 * Dashboard charts drawn as plain SVG, looking like the real recharts ones
 * (components/dashboard-donut.tsx, people-panel.tsx, trend-panel.tsx,
 * top-regions-panel.tsx). In React, swap each for the recharts component
 * named beside it; the data shapes are the same.
 *
 *   Donut(slices, centreLabel)        — PieChart, innerRadius 72%
 *   Legend(slices)                    — dot · label · value · %
 *   GroupedBars(groups, series)       — BarChart (Who we reach)
 *   HBars(rows, total)                — the Top 5 regions bars
 *   TrendLines(months, series)        — AreaChart (registration trend)
 */
(function (App) {
  const { t, num, fmtPct, pctOf, esc } = App;

  function Donut(slices, centreLabel = "Total", size = 176) {
    const total = slices.reduce((n, s) => n + s.value, 0);
    const r = 50;
    const inner = 36;
    const mid = (r + inner) / 2;
    const width = r - inner;
    const C = 2 * Math.PI * mid;
    const gap = slices.filter((s) => s.value > 0).length > 1 ? 1.2 : 0;
    let offset = 0;
    const arcs = slices
      .filter((s) => s.value > 0)
      .map((s) => {
        const len = (s.value / total) * C;
        const seg = `<circle r="${mid}" cx="60" cy="60" fill="none" stroke="${s.color}" stroke-width="${width}"
          stroke-dasharray="${Math.max(0, len - gap)} ${C}" stroke-dashoffset="${-offset}" stroke-linecap="butt">
          <title>${esc(t(s.label))}: ${num(s.value)} (${fmtPct(pctOf(s.value, total))})</title></circle>`;
        offset += len;
        return seg;
      })
      .join("");
    return `
    <div class="relative shrink-0" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90">${total ? arcs : `<circle r="${mid}" cx="60" cy="60" fill="none" stroke="#e2e8f0" stroke-width="${width}"/>`}</svg>
      <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span class="font-bold leading-tight text-ink ${size < 180 ? "text-xl" : "text-2xl"}">${num(total)}</span>
        <span class="max-w-[70%] text-center text-[11px] font-medium leading-tight text-muted-foreground">${esc(t(centreLabel))}</span>
      </div>
    </div>`;
  }

  function Legend(slices) {
    const total = slices.reduce((n, s) => n + s.value, 0);
    return `
    <ul class="w-full space-y-1.5">
      ${slices
        .map(
          (s) => `
        <li class="flex items-center gap-2.5 text-[13px]">
          <span class="h-2.5 w-2.5 shrink-0 rounded-full" style="background:${s.color}"></span>
          <span class="min-w-0 flex-1 truncate text-slate-700">${esc(t(s.label))}</span>
          <span class="w-10 text-right font-semibold tabular-nums text-slate-900">${num(s.value)}</span>
          <span class="w-12 text-right text-xs tabular-nums text-slate-400">${fmtPct(pctOf(s.value, total))}</span>
        </li>`,
        )
        .join("")}
    </ul>`;
  }

  /** Nice round top for an axis: 0, 40, 80, 120, 160. */
  function niceMax(v, steps = 4) {
    if (v <= 0) return steps;
    const raw = v / steps;
    const mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
    return step * steps;
  }

  function GroupedBars(groups, series, height = 170) {
    const max = niceMax(Math.max(1, ...groups.flatMap((g) => series.map((s) => g[s.key]))));
    const W = 300;
    const H = height;
    const left = 32;
    const bottom = 22;
    const plotH = H - bottom - 8;
    const gw = (W - left) / groups.length;
    const bw = Math.min(22, gw / (series.length + 2));
    const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
    return `
    <svg viewBox="0 0 ${W} ${H}" class="w-full" style="height:${height}px">
      ${ticks
        .map((v) => {
          const y = 8 + plotH - (v / max) * plotH;
          return `<line x1="${left}" x2="${W}" y1="${y}" y2="${y}" stroke="#e2e8f0" stroke-dasharray="3 3"/>
                  <text x="${left - 8}" y="${y + 4}" text-anchor="end" font-size="10.5" fill="#64748B">${num(v)}</text>`;
        })
        .join("")}
      ${groups
        .map((g, i) => {
          const cx = left + gw * i + gw / 2;
          const totalW = series.length * bw + (series.length - 1) * (bw * 0.9);
          return (
            series
              .map((s, k) => {
                const h = (g[s.key] / max) * plotH;
                const x = cx - totalW / 2 + k * bw * 1.9;
                return `<rect x="${x}" y="${8 + plotH - h}" width="${bw}" height="${h}" rx="3" fill="${s.color}"><title>${esc(t(s.label))}: ${num(g[s.key])}</title></rect>`;
              })
              .join("") +
            `<text x="${cx}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#64748B">${esc(g.label)}</text>`
          );
        })
        .join("")}
    </svg>`;
  }

  function HBars(rows, total) {
    const max = Math.max(1, ...rows.map((r) => r.value));
    return `
    <ul class="space-y-4">
      ${rows
        .map(
          (r, i) => `
        <li class="grid grid-cols-[88px_1fr_auto] items-center gap-3 text-[13px]">
          <span class="truncate font-medium text-slate-700">${esc(t(r.label))}</span>
          <span class="h-6 overflow-hidden rounded-md bg-slate-100">
            <span class="block h-full rounded-md ${i < 2 ? "bg-blue-600" : "bg-blue-500/70"}" style="width:${(r.value / max) * 100}%"></span>
          </span>
          <span class="w-20 text-right text-xs"><b class="text-slate-900">${num(r.value)}</b> <span class="text-slate-400">(${fmtPct(pctOf(r.value, total))})</span></span>
        </li>`,
        )
        .join("")}
    </ul>`;
  }

  function TrendLines(points, series, height = 220) {
    const W = 640;
    const H = height;
    const left = 36;
    const right = 30;
    const bottom = 24;
    const top = 10;
    const plotW = W - left - right;
    const plotH = H - top - bottom;
    const max = niceMax(Math.max(1, ...points.flatMap((p) => series.map((s) => p[s.key]))));
    const x = (i) => left + (points.length === 1 ? plotW / 2 : (plotW * i) / (points.length - 1));
    const y = (v) => top + plotH - (v / max) * plotH;
    const ticks = [0, 1, 2, 3, 4].map((i) => (max / 4) * i);
    const every = Math.max(1, Math.ceil(points.length / 6));
    return `
    <svg viewBox="0 0 ${W} ${H}" class="h-auto w-full">
      <defs>${series.map((s) => `<linearGradient id="g-${s.key}" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="${s.color}" stop-opacity=".22"/><stop offset="100%" stop-color="${s.color}" stop-opacity="0"/></linearGradient>`).join("")}</defs>
      ${ticks.map((v) => `<line x1="${left}" x2="${W - right}" y1="${y(v)}" y2="${y(v)}" stroke="#e2e8f0" stroke-dasharray="3 3"/><text x="${left - 8}" y="${y(v) + 4}" text-anchor="end" font-size="11" fill="#64748B">${num(v)}</text>`).join("")}
      ${points.map((p, i) => (i % every === 0 || i === points.length - 1 ? `<text x="${x(i)}" y="${H - 6}" text-anchor="middle" font-size="11" fill="#64748B">${esc(p.label)}</text>` : "")).join("")}
      ${series
        .map((s) => {
          const line = points.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[s.key])}`).join(" ");
          const area = `${line} L${x(points.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
          return `${s.fill ? `<path d="${area}" fill="url(#g-${s.key})"/>` : ""}
            <path d="${line}" fill="none" stroke="${s.color}" stroke-width="2.2" stroke-linejoin="round"/>
            ${points.map((p, i) => `<circle cx="${x(i)}" cy="${y(p[s.key])}" r="3.2" fill="#fff" stroke="${s.color}" stroke-width="2"><title>${esc(p.label)} · ${esc(t(s.label))}: ${num(p[s.key])}</title></circle>`).join("")}`;
        })
        .join("")}
    </svg>`;
  }

  Object.assign(App, { Donut, Legend, GroupedBars, HBars, TrendLines });
})((window.App = window.App || {}));
