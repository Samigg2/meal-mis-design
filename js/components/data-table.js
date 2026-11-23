/*
 * The list table — a copy of components/data/data-table.tsx + table-toolbar.tsx
 * + pagination.tsx: search box, filters (a "Filters" pop-up or one pill per
 * filter), buttons on the right, tick boxes, sticky Actions column, and
 * "Showing 1 to 8 of N" with Rows per page and page numbers.
 *
 *   const table = { q: "", filters: {}, page: 1, size: 8 };   // the page keeps this
 *   DataTable(table, {
 *     rows,                                   // all rows the user may see
 *     columns: [{ key, header, cell: (row) => html }],
 *     searchText: (row) => "name code phone", // what the search box looks in
 *     searchPlaceholder: "Search by name, ID or phone...",
 *     filters: [{ key, label, options: [[value, label]], test: (row, value) => bool }],
 *     filterMode: "popover" | "pills",
 *     right: html,                            // Add / Export buttons
 *     actions: (row) => html,                 // the Actions column
 *     empty: "No members listed yet.",       // text when there are no rows at all
 *     noun: "participants",
 *   })
 *   bindDataTable(root, table, rerender)
 */
(function (App) {
  const { t, icon, esc, BTN } = App;

  function visible(state, cfg) {
    const q = state.q.trim().toLowerCase();
    return cfg.rows.filter(
      (r) =>
        (!q || (cfg.searchText?.(r) ?? "").toLowerCase().includes(q)) &&
        (cfg.filters ?? []).every((f) => !state.filters[f.key] || f.test(r, state.filters[f.key])),
    );
  }

  function pages(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, 4, "…", last - 1, last];
    if (current >= last - 2) return [1, 2, "…", last - 3, last - 2, last - 1, last];
    return [1, "…", current - 1, current, current + 1, "…", last];
  }

  function filterSelect(f, value, extra = "") {
    // A native select is as wide as its longest option; size the pill to what it shows (as the real pill does).
    const shown = t(value ? f.options.find(([v]) => v === value)?.[1] ?? f.label : f.label);
    const width = extra ? "" : `style="width:calc(${(shown.length * 1.15).toFixed(1)}ch + 3rem)"`;
    return `
      <label class="relative inline-flex ${extra}">
        <span class="sr-only">${t(f.label)}</span>
        <select data-filter="${f.key}" ${width}
          class="h-9 appearance-none rounded-lg border ${value ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700"} pl-3 pr-8 text-[13px] font-semibold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/30">
          <option value="">${t(f.label)}</option>
          ${f.options.map(([v, l]) => `<option value="${v}" ${value === v ? "selected" : ""}>${esc(t(l))}</option>`).join("")}
        </select>
        ${icon("chevron-down", "pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}
      </label>`;
  }

  function DataTable(state, cfg) {
    const rows = visible(state, cfg);
    const last = Math.max(1, Math.ceil(rows.length / state.size));
    state.page = Math.min(state.page, last);
    const start = (state.page - 1) * state.size;
    const shown = rows.slice(start, start + state.size);
    const active = (cfg.filters ?? []).filter((f) => state.filters[f.key]).length;
    const headBg = "bg-slate-50/80";

    const toolbar = `
    <div class="flex flex-wrap items-center gap-2 px-4 pt-4">
      <div class="relative w-full min-w-0 flex-1 sm:w-auto sm:min-w-[260px] lg:min-w-[320px] ${cfg.filterMode === "pills" ? "max-w-md" : "max-w-md"}">
        ${icon("search", "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}
        <input type="search" data-table-search value="${esc(state.q)}" placeholder="${t(cfg.searchPlaceholder ?? "Search…")}"
          class="h-9 w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-10 pr-3 text-[13px] text-slate-800 outline-none placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:ring-2 focus:ring-blue-500/20" />
      </div>
      ${
        (cfg.filters ?? []).length === 0
          ? ""
          : cfg.filterMode === "pills"
            ? cfg.filters.map((f) => filterSelect(f, state.filters[f.key])).join("")
            : `<div class="relative" data-filter-pop>
                <button type="button" data-filter-toggle class="${BTN.outline}">
                  ${icon("sliders-horizontal", "h-4 w-4")} ${t("Filters")}
                  ${active ? `<span class="rounded-full bg-blue-500 px-1.5 text-[11px] text-white">${active}</span>` : ""}
                </button>
                <div data-filter-panel ${state.filtersOpen ? "" : "hidden"} class="absolute left-0 top-full z-30 mt-1.5 flex w-64 flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                  ${cfg.filters.map((f) => filterSelect(f, state.filters[f.key], "w-full [&_select]:w-full")).join("")}
                  ${active ? `<button type="button" data-filter-clear class="text-left text-[13px] font-semibold text-primary hover:underline">${t("Clear filters")}</button>` : ""}
                </div>
              </div>`
      }
      <div class="ml-auto flex flex-wrap items-center gap-2">
        ${cfg.right ?? ""}
        <button type="button" class="${BTN.icon}" title="${t("Columns")}" aria-label="${t("Columns")}">${icon("sliders-horizontal", "h-4 w-4")}</button>
        <button type="button" class="${BTN.icon}" title="${t("Compact rows")}" aria-label="${t("Compact rows")}">${icon("rows-3", "h-4 w-4")}</button>
      </div>
    </div>`;

    const table = `
    <div class="mt-4 overflow-x-auto">
      <table class="w-full border-separate border-spacing-0 text-sm">
        <thead>
          <tr class="${headBg}">
            ${cfg.selectable === false ? "" : `<th class="sticky left-0 z-20 h-10 w-10 border-y border-slate-100 px-4 text-left ${headBg}"><input type="checkbox" data-select-all aria-label="${t("Select all")}" class="h-4 w-4 rounded border-slate-300 accent-blue-600" /></th>`}
            ${cfg.columns.map((c) => `<th class="h-10 whitespace-nowrap border-y border-slate-100 px-3 text-left text-xs font-semibold uppercase tracking-[.04em] text-slate-500 ${headBg}">${t(c.header)}</th>`).join("")}
            ${cfg.actions ? `<th class="sticky right-0 z-20 h-10 whitespace-nowrap border-y border-l border-slate-100 px-3 text-right text-xs font-semibold uppercase tracking-[.04em] text-slate-500 ${headBg}">${t("Actions")}</th>` : ""}
          </tr>
        </thead>
        <tbody>
          ${
            shown.length === 0
              ? `<tr><td colspan="${cfg.columns.length + 2}" class="px-4 py-14 text-center">
                  <div class="mx-auto flex max-w-sm flex-col items-center gap-2">
                    <span class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">${icon("search-x", "h-6 w-6")}</span>
                    <p class="text-sm font-semibold text-slate-700">${t(cfg.empty && !state.q && !Object.values(state.filters).some(Boolean) ? cfg.empty : "No results match your filters")}</p>
                    ${cfg.empty && !state.q ? "" : `<p class="text-xs text-slate-500">${t("Try a different search or remove a filter.")}</p>`}
                  </div></td></tr>`
              : shown
                  .map(
                    (r) => `
          <tr class="group h-12 ${cfg.rowHref ? "cursor-pointer" : ""}" ${cfg.rowHref ? `data-href="${cfg.rowHref(r)}"` : ""}>
            ${cfg.selectable === false ? "" : `<td class="sticky left-0 z-10 border-b border-slate-100 bg-white px-4 group-hover:bg-slate-50"><input type="checkbox" data-select aria-label="${t("Select row")}" class="h-4 w-4 rounded border-slate-300 accent-blue-600" /></td>`}
            ${cfg.columns.map((c) => `<td class="whitespace-nowrap border-b border-slate-100 bg-white px-3 text-sm text-ink group-hover:bg-slate-50 ${c.className ?? ""}">${c.cell(r)}</td>`).join("")}
            ${cfg.actions ? `<td class="sticky right-0 z-10 whitespace-nowrap border-b border-l border-slate-100 bg-white px-2 text-right group-hover:bg-slate-50"><div class="flex items-center justify-end gap-1">${cfg.actions(r)}</div></td>` : ""}
          </tr>`,
                  )
                  .join("")
          }
        </tbody>
      </table>
    </div>`;

    const footer = `
    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3 text-[13px] text-slate-600">
      <div class="flex flex-wrap items-center gap-4">
        <span>${t("Showing")} <b class="font-semibold text-slate-800">${rows.length ? start + 1 : 0}</b> ${t("to")} <b class="font-semibold text-slate-800">${start + shown.length}</b> ${t("of")} <b class="font-semibold text-slate-800">${rows.length}</b> ${t(cfg.noun ?? "records")}</span>
        <label class="flex items-center gap-2">${t("Rows per page")}
          <span class="relative inline-flex">
            <select data-page-size class="h-8 appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[13px] text-slate-700 outline-none">
              ${[8, 15, 25, 50].map((n) => `<option ${state.size === n ? "selected" : ""}>${n}</option>`).join("")}
            </select>
            ${icon("chevron-down", "pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}
          </span>
        </label>
      </div>
      <nav class="flex items-center gap-1" aria-label="${t("Pages")}">
        <button type="button" data-page="${state.page - 1}" ${state.page === 1 ? "disabled" : ""} class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40">${icon("chevron-left", "h-4 w-4")}</button>
        ${pages(state.page, last)
          .map((p) =>
            p === "…"
              ? `<span class="px-1.5 text-slate-400">…</span>`
              : `<button type="button" data-page="${p}" class="inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-[13px] font-semibold ${p === state.page ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}">${p}</button>`,
          )
          .join("")}
        <button type="button" data-page="${state.page + 1}" ${state.page === last ? "disabled" : ""} class="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 disabled:opacity-40">${icon("chevron-right", "h-4 w-4")}</button>
      </nav>
    </div>`;

    return `<section class="rounded-xl border border-slate-200 bg-white shadow-sm" data-table>${toolbar}${table}${footer}</section>`;
  }

  function bindDataTable(root, state, rerender) {
    const box = root.querySelector("[data-table]");
    if (!box) return;
    const search = box.querySelector("[data-table-search]");
    search?.addEventListener("input", () => {
      state.q = search.value;
      state.page = 1;
      rerender();
      const again = document.querySelector("[data-table-search]");
      again?.focus();
      again?.setSelectionRange(again.value.length, again.value.length);
    });
    box.querySelectorAll("[data-filter]").forEach((s) =>
      s.addEventListener("change", () => {
        state.filters[s.dataset.filter] = s.value;
        state.page = 1;
        rerender();
      }),
    );
    box.querySelector("[data-filter-toggle]")?.addEventListener("click", (e) => {
      e.stopPropagation();
      state.filtersOpen = !state.filtersOpen;
      rerender();
    });
    box.querySelector("[data-filter-panel]")?.addEventListener("click", (e) => e.stopPropagation());
    if (state.filtersOpen) {
      const close = () => {
        state.filtersOpen = false;
        document.removeEventListener("click", close);
        rerender();
      };
      setTimeout(() => document.addEventListener("click", close), 0);
    }
    box.querySelector("[data-filter-clear]")?.addEventListener("click", () => {
      state.filters = {};
      rerender();
    });
    box.querySelector("[data-page-size]")?.addEventListener("change", (e) => {
      state.size = Number(e.target.value);
      state.page = 1;
      rerender();
    });
    box.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => {
        state.page = Number(b.dataset.page);
        rerender();
      }),
    );
    const all = box.querySelector("[data-select-all]");
    all?.addEventListener("change", () => box.querySelectorAll("[data-select]").forEach((c) => (c.checked = all.checked)));
    box.querySelectorAll("tr[data-href]").forEach((tr) =>
      tr.addEventListener("click", (e) => {
        if (e.target.closest("a,button,input,select,label")) return;
        location.href = tr.dataset.href;
      }),
    );
  }

  Object.assign(App, { DataTable, bindDataTable });
})((window.App = window.App || {}));
