/*
 * Programme Executive dashboard — a copy of
 * meal-mis-frontend/src/components/dashboard/views/executive.tsx and its panels
 * (kpi-row, people-panel, sector-panel as "Enterprises by size", top-regions-panel,
 * trend-panel, women-led-panel, quick-actions-panel, reach-map-panel), with the
 * top-bar tools of dashboard-page.tsx (dashboard picker, Filters, More).
 *
 * Every figure is worked out here from store.list(...), so a cluster user sees
 * their cluster's numbers only — in the real app the API does this sum
 * (GET /dashboard/executive).
 */
(function (App) {
  const { t, icon, esc, num, fmtPct, pctOf, ageFrom, store, Panel, Donut, Legend, GroupedBars, HBars, TrendLines, startPage, page, can, ROUTES, BTN, MONTHS, places, regionPoints, userCluster } = App;

  const DASHBOARDS = ["Programme Executive", "Operational", "Enterprise Performance", "Youth Employment", "Gender & Inclusion", "Financial Ecosystem", "Governance", "Safeguarding", "Linkages"];
  const COLORS = { participants: "#2563EB", enterprises: "#059669", employment: "#9333EA", indicators: "#F59E0B" };
  const filters = { region: "", sex: "", valueChain: "", open: false };

  function figures(user) {
    let ps = store.list("participants", user);
    let es = store.list("enterprises", user);
    if (filters.region) {
      ps = ps.filter((p) => p.region === filters.region);
      es = es.filter((e) => e.region === filters.region);
    }
    if (filters.sex) ps = ps.filter((p) => p.sex === filters.sex);
    if (filters.valueChain) es = es.filter((e) => e.valueChain === filters.valueChain);
    const byId = Object.fromEntries(store.all("participants").map((p) => [p.id, p]));
    const female = ps.filter((p) => p.sex === "female").length;
    const youth = ps.filter((p) => {
      const a = ageFrom(p.dateOfBirth);
      return a >= 18 && a <= 35;
    }).length;
    const womenLed = es.filter((e) => byId[e.leadId]?.sex === "female").length;
    return { ps, es, byId, female, youth, womenLed };
  }

  function StatCard({ href, iconName, color, label, value, sub }) {
    return `
    <a href="${href}" class="flex items-center gap-3.5 rounded-xl border bg-white p-4 shadow-sm transition-all"
      style="border-color:${color}40" onmouseover="this.style.borderColor='${color}80'" onmouseout="this.style.borderColor='${color}40'">
      <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-sm" style="background:${color}">${icon(iconName, "h-5 w-5")}</span>
      <div class="min-w-0 flex-1">
        <div class="text-xs font-bold uppercase tracking-wider text-slate-500">${esc(t(label))}</div>
        <div class="my-1 text-2xl font-black leading-none tracking-tight text-slate-900">${value}</div>
        <div class="mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs">${sub}</div>
      </div>
    </a>`;
  }
  const muted = (s) => `<span class="font-medium text-slate-600">${s}</span>`;

  function render(user) {
    const { ps, es, byId, female, youth, womenLed } = figures(user);
    const active = ps.filter((p) => p.status === "active").length;
    const disab = ps.filter((p) => p.disability).length;
    const cluster = userCluster(user);

    // Cards
    const kpis = `
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      ${StatCard({
        href: page("participants.html"), iconName: "users", color: COLORS.participants, label: "Participants", value: num(ps.length),
        sub: `${muted(`${t("Active {{n}}", { n: num(active) })} · ${fmtPct(pctOf(active, ps.length))}`)}
          <span class="text-slate-300">|</span>
          <span class="rounded border border-purple-200 bg-purple-50 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">${t("F")} ${num(female)}</span>
          <span class="rounded border border-blue-100 bg-blue-50 px-1.5 py-0.5 text-[10px] font-bold text-blue-600">${t("M")} ${num(ps.length - female)}</span>`,
      })}
      ${StatCard({
        href: page("enterprises.html"), iconName: "store", color: COLORS.enterprises, label: "Enterprises", value: num(es.length),
        sub: muted(es.length ? t("{{pct}} operational", { pct: fmtPct(pctOf(es.filter((e) => e.status === "active").length, es.length)) }) : t("None yet")),
      })}
      ${StatCard({
        href: page("enterprises.html"), iconName: "store", color: COLORS.employment, label: "Women-led enterprises", value: num(womenLed),
        sub: muted(es.length ? t("{{pct}} of enterprises", { pct: fmtPct(pctOf(womenLed, es.length)) }) : t("None yet")),
      })}
      ${StatCard({
        href: page("participants.html"), iconName: "users", color: COLORS.indicators, label: "Youth (18–35)", value: num(youth),
        sub: muted(`${t("{{pct}} of participants", { pct: fmtPct(pctOf(youth, ps.length)) })} · ${t("{{n}} with a disability", { n: num(disab) })}`),
      })}
    </section>`;

    // Who we reach
    const groups = [
      ["18–24", 18, 24],
      ["25–35", 25, 35],
    ].map(([label, lo, hi]) => {
      const inGroup = ps.filter((p) => {
        const a = ageFrom(p.dateOfBirth);
        return a >= lo && a <= hi;
      });
      return { label, all: inGroup.length, women: inGroup.filter((p) => p.sex === "female").length };
    });
    const reach = Panel({
      title: "Who we reach",
      caps: true,
      info: "Participants by age group, all and women. People with a disability (PWD) are in every group, so they are shown as a share of everyone.",
      body: `
        ${GroupedBars(groups, [
          { key: "all", label: "Participants", color: "#2563EB" },
          { key: "women", label: "Women", color: "#0D9488" },
        ])}
        <ul class="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-600">
          <li class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-blue-600"></span>${t("Participants")} <b class="text-slate-900">${num(ps.length)}</b></li>
          <li class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-teal-600"></span>${t("Women")} <b class="text-slate-900">${fmtPct(pctOf(female, ps.length))}</b></li>
          <li class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-slate-900"></span>${t("PWD")} <b class="text-slate-900">${t("{{pct}} of all", { pct: fmtPct(pctOf(disab, ps.length)) })}</b></li>
        </ul>`,
    });

    // Enterprises by size
    const sizeSlices = [
      ["micro", "Micro", "#2563EB"],
      ["medium", "Medium", "#059669"],
      ["small", "Small", "#D97706"],
      ["large", "Large", "#9333EA"],
    ].map(([k, label, color]) => ({ label, color, value: es.filter((e) => e.size === k).length }));
    const sizes = Panel({
      title: "Enterprises by size",
      info: "Micro, medium, small and large, by members",
      body: `<div class="flex flex-1 flex-col items-center gap-5">${Donut(sizeSlices, "Enterprises")}${Legend(sizeSlices)}</div>`,
    });

    // Top 5 regions (national) / zones (cluster)
    const byZone = !!cluster || !!filters.region;
    const counts = {};
    ps.forEach((p) => {
      const k = byZone ? p.zone : p.region;
      counts[k] = (counts[k] ?? 0) + 1;
    });
    const top = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([label, value]) => ({ label, value }));
    const topPanel = Panel({
      title: byZone ? "Top 5 zones" : "Top 5 regions",
      caps: true,
      info: byZone
        ? "The zones with the most participants; each bar is scaled to the biggest, so the gaps show; the share of everyone reached is in brackets"
        : "The regions with the most participants; each bar is scaled to the biggest, so the gaps show; the share of everyone reached is in brackets",
      action: `<span class="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">${top.length} ${t(byZone ? "Zones" : "Regions")}</span>`,
      body: `<div class="pt-2">${HBars(top, ps.length)}</div>`,
    });

    // Trend: Jan–Nov 2026
    const months = Array.from({ length: 11 }, (_, i) => i + 1).map((m) => {
      const key = `2026-${String(m).padStart(2, "0")}`;
      return {
        label: `${MONTHS[m - 1]} 2026`,
        participants: ps.filter((p) => p.registeredAt.startsWith(key)).length,
        enterprises: es.filter((e) => e.registeredAt.startsWith(key)).length,
      };
    });
    const trend = Panel({
      title: "Participant & enterprise registration trend",
      caps: true,
      info: "Participants and enterprises registered, per month (last 12 months)",
      action: `<div class="flex items-center gap-4 text-[11px] font-medium text-slate-600">
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-blue-600"></span>${t("Registered participants")}</span>
        <span class="flex items-center gap-1.5"><span class="h-2.5 w-2.5 rounded-full bg-teal-600"></span>${t("Registered enterprises")}</span></div>`,
      body: TrendLines(months, [
        { key: "participants", label: "Registered participants", color: "#2563EB", fill: true },
        { key: "enterprises", label: "Registered enterprises", color: "#0D9488" },
      ]),
    });

    // Women-led
    const wl = [
      { label: "Women-led", value: womenLed, color: "#DB2777" },
      { label: "Not women-led", value: es.length - womenLed, color: "#3B82F6" },
    ];
    const womenPanel = Panel({
      title: "Women-led enterprises",
      info: "Enterprises led by women, of all enterprises",
      body: `<div class="flex flex-1 flex-col items-center gap-5">${Donut(wl, "Enterprises")}${Legend(wl)}</div>`,
    });

    // Quick actions
    const actions = [
      { label: "Register participant", href: page("participant-new.html"), module: "participants", icon: "users", color: "#2563EB" },
      { label: "Register enterprise", href: page("enterprise-new.html"), module: "enterprises", icon: "store", color: "#059669" },
      { label: "Log training event", href: ROUTES.nextPhase("Log training event"), module: "training", icon: "graduation-cap", color: "#9333EA" },
      { label: "Record feedback", href: ROUTES.nextPhase("Record feedback"), module: "feedback", icon: "message-square", color: "#D97706" },
      { label: "Report indicator value", href: ROUTES.nextPhase("Report indicator value"), module: "monitoring", icon: "trending-up", color: "#2563EB" },
      { label: "Add action item", href: ROUTES.nextPhase("Add action item"), module: "actions", icon: "list-checks", color: "#475569" },
    ].filter((a) => can(user, a.module, "write"));
    const quick = Panel({
      title: "Quick actions",
      caps: true,
      info: "Shortcuts to the forms your role may fill in",
      action: `<span class="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">${t("{{n}} Shortcuts", { n: actions.length })}</span>`,
      body: actions.length
        ? `<div class="flex flex-col gap-1.5">${actions
            .map(
              (a) => `
          <a href="${a.href}" class="group flex items-center justify-between rounded-lg border border-slate-200/70 bg-slate-50 p-2 transition-all hover:border-slate-300 hover:bg-white">
            <span class="flex min-w-0 items-center gap-2.5">
              <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md" style="background:${a.color}1a;color:${a.color}">${icon(a.icon, "h-3 w-3")}</span>
              <span class="truncate text-[11px] font-semibold text-slate-700 group-hover:text-slate-900">${t(a.label)}</span>
            </span>
            ${icon("chevron-right", "mr-1 h-3 w-3 text-slate-400 group-hover:text-slate-700")}
          </a>`,
            )
            .join("")}</div>`
        : `<p class="text-sm text-muted-foreground">${t("Your role is read-only. Explore the modules from the sidebar.")}</p>`,
    });

    // Reach by region (map)
    const regions = Object.keys(places).filter((r) => ps.some((p) => p.region === r));
    const mapPanel = Panel({
      title: "Reach by region",
      caps: true,
      info: "Participants per region: larger, darker circles mean more. Hover a circle for its counts.",
      action: `<span class="rounded-full border border-blue-100 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">${t("{{n}} Active regions", { n: regions.length })}</span>`,
      body: `<div id="reach-map" class="h-64 overflow-hidden rounded-lg border border-slate-200 bg-slate-100"></div>
             <p class="mt-3 text-[11px] text-slate-500">${t("{{n}} regions on the map", { n: regions.length })}</p>`,
    });

    return `
    <div class="flex flex-col gap-4">
      ${kpis}
      <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">${reach}${sizes}</div>
        <div class="lg:col-span-5">${topPanel}</div>
      </section>
      <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div class="lg:col-span-8">${trend}</div>
        <div class="lg:col-span-4">${womenPanel}</div>
      </section>
      <section class="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div class="lg:col-span-4">${quick}</div>
        <div class="lg:col-span-8">${mapPanel}</div>
      </section>
    </div>`;
  }

  function tools(user) {
    const cluster = userCluster(user);
    const regionOptions = cluster ? [cluster.region] : Object.keys(places);
    const on = [filters.region, filters.sex, filters.valueChain].filter(Boolean).length;
    const sel = (key, label, options) => `
      <label class="flex flex-col gap-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">${t(label)}
        <select data-dash-filter="${key}" class="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[13px] font-medium normal-case tracking-normal text-slate-700">
          <option value="">${t("All")}</option>
          ${options.map(([v, l]) => `<option value="${v}" ${filters[key] === v ? "selected" : ""}>${esc(t(l))}</option>`).join("")}
        </select></label>`;
    return `
      <label class="relative hidden lg:inline-flex">
        <span class="sr-only">${t("Dashboard")}</span>
        <select data-dashboard title="${t("Dashboard")}" class="h-8 max-w-[160px] appearance-none truncate rounded-lg border border-slate-200 bg-white pl-3 pr-7 text-[13px] font-medium text-slate-700 shadow-sm">
          ${DASHBOARDS.map((d) => `<option>${t(d)}</option>`).join("")}
        </select>
        ${icon("chevron-down", "pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400")}
      </label>
      <div class="relative" data-dash-filters>
        <button type="button" data-dash-filters-toggle class="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          ${icon("sliders-horizontal", "h-3.5 w-3.5 text-slate-500")} ${t("Filters")}
          ${on ? `<span class="rounded-full bg-blue-500 px-1.5 text-[11px] text-white">${on}</span>` : ""}
        </button>
        <div data-dash-filters-panel ${filters.open ? "" : "hidden"} class="absolute right-0 top-full z-40 mt-1.5 flex w-64 flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
          ${sel("region", "Region", regionOptions.map((r) => [r, r]))}
          ${sel("sex", "Sex", [["female", "Female"], ["male", "Male"]])}
          ${sel("valueChain", "Value chain", App.lookups["enterprises.value_chain"])}
          ${on ? `<button type="button" data-dash-clear class="text-left text-[13px] font-semibold text-primary hover:underline">${t("Clear filters")}</button>` : ""}
        </div>
      </div>
      <div class="relative" data-dash-more>
        <button type="button" data-dash-more-toggle aria-label="${t("More")}" title="${t("More")}" class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50">${icon("ellipsis", "h-4 w-4")}</button>
        <div data-dash-more-menu hidden class="absolute right-0 top-full z-40 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1 text-slate-700 shadow-md">
          <button type="button" data-print class="flex w-full items-center rounded-lg px-2.5 py-2 text-sm hover:bg-slate-100">${icon("printer", "mr-2 h-4 w-4")} ${t("Print / PDF")}</button>
          <a href="${ROUTES.nextPhase("Export CSV")}" class="flex w-full items-center rounded-lg px-2.5 py-2 text-sm hover:bg-slate-100">${icon("download", "mr-2 h-4 w-4")} ${t("Export CSV")}</a>
        </div>
      </div>`;
  }

  function drawMap(user) {
    const el = document.getElementById("reach-map");
    if (!el || !window.L) return;
    const { ps } = figures(user);
    const map = L.map(el, { scrollWheelZoom: false, attributionControl: true }).setView([9.6, 39.2], 5);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 12,
    }).addTo(map);
    const max = Math.max(1, ...Object.keys(regionPoints).map((r) => ps.filter((p) => p.region === r).length));
    Object.entries(regionPoints).forEach(([region, [lat, lng]]) => {
      const n = ps.filter((p) => p.region === region).length;
      if (!n) return;
      L.circleMarker([lat, lng], {
        radius: 10 + (n / max) * 18,
        color: "#2563EB",
        weight: 1.5,
        fillColor: "#3B82F6",
        fillOpacity: 0.25 + (n / max) * 0.35,
      })
        .bindTooltip(`<b>${t(region)}</b><br>${t("{{n}} participants", { n })}`)
        .addTo(map);
    });
    const legend = L.control({ position: "topright" });
    legend.onAdd = () => {
      const d = L.DomUtil.create("div");
      d.innerHTML = `<div style="display:flex;align-items:center;gap:6px;background:#fff;border-radius:8px;padding:4px 10px;font-size:11px;font-weight:600;color:#334155;box-shadow:0 1px 3px rgba(0,0,0,.15)"><span style="width:8px;height:8px;border-radius:9999px;background:#2563EB"></span>${t("Participants per region")}</div>`;
      return d;
    };
    legend.addTo(map);
  }

  function bind(root, user, rerender) {
    drawMap(user);
    root.querySelector("[data-dashboard]")?.addEventListener("change", (e) => {
      if (e.target.selectedIndex > 0) location.href = ROUTES.nextPhase(DASHBOARDS[e.target.selectedIndex]);
    });
    const fWrap = root.querySelector("[data-dash-filters]");
    fWrap.querySelector("[data-dash-filters-toggle]").addEventListener("click", (e) => {
      e.stopPropagation();
      filters.open = !filters.open;
      rerender();
    });
    fWrap.querySelector("[data-dash-filters-panel]").addEventListener("click", (e) => e.stopPropagation());
    fWrap.querySelectorAll("[data-dash-filter]").forEach((s) =>
      s.addEventListener("change", () => {
        filters[s.dataset.dashFilter] = s.value;
        rerender();
      }),
    );
    fWrap.querySelector("[data-dash-clear]")?.addEventListener("click", () => {
      Object.assign(filters, { region: "", sex: "", valueChain: "" });
      rerender();
    });
    const more = root.querySelector("[data-dash-more]");
    const menu = more.querySelector("[data-dash-more-menu]");
    more.querySelector("[data-dash-more-toggle]").addEventListener("click", (e) => {
      e.stopPropagation();
      menu.hidden = !menu.hidden;
    });
    root.querySelector("[data-print]").addEventListener("click", () => window.print());
    document.onclick = (e) => {
      if (!more.contains(e.target)) menu.hidden = true;
      if (filters.open && !fWrap.contains(e.target)) {
        filters.open = false;
        rerender();
      }
    };
  }

  startPage({
    active: "/dashboard",
    title: "Executive",
    trail: [{ label: "Overview", href: page("dashboard.html") }, { label: "Dashboard", href: page("dashboard.html") }, { label: "Executive" }],
    tools,
    render,
    bind,
  });
  App.showPendingToast();
})((window.App = window.App || {}));
