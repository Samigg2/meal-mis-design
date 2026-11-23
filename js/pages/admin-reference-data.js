/*
 * Administration › Reference data — a copy of admin.reference-data.tsx with
 * components/reference-data/* : lists on the left (Locations, then each
 * module's lists), the list header "<name> <key> · N offered on forms · N
 * retired", Value / Label / Add value, then the values (Label, Stored value,
 * Map centre for regions, Scope, Offered switch, delete).
 * Data: store.all("referenceValues") — GET/POST/PATCH /admin/reference-data
 */
(function (App) {
  const { t, icon, esc, store, startPage, AdminTiles, AdminHeading, ADMIN_TRAIL, CARD, BTN, toast, confirmDialog } = App;

  const LOCATION_LISTS = [["region", "Regions"], ["zone", "Zones"], ["woreda", "Woredas"]];
  const PARENT = { zone: "region", woreda: "zone" };
  const title = (cat) => LOCATION_LISTS.find(([k]) => k === cat)?.[1] ?? cat.split(".").pop().replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const groupTitle = (module) => ({ participants: "Participants", enterprises: "Enterprises" })[module] ?? module;

  const ui = { cat: "region", find: "", q: "", show: "all", value: "", label: "", parent: "", error: "", page: 1 };
  const SEARCH = "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white";

  function groups() {
    const cats = [...new Set(store.all("referenceValues").map((v) => v.category))].filter((c) => c.includes("."));
    const byModule = {};
    cats.forEach((c) => (byModule[c.split(".")[0]] ??= []).push(c));
    return [{ title: "Locations", icon: "map-pin", items: LOCATION_LISTS.map(([k]) => k) }, ...Object.entries(byModule).map(([m, items]) => ({ title: groupTitle(m), icon: "list-tree", items }))];
  }

  function rail() {
    const f = ui.find.trim().toLowerCase();
    const all = store.all("referenceValues");
    return `
    <aside class="${CARD} flex max-h-[680px] flex-col p-4 lg:col-span-3">
      <h3 class="text-[15px] font-bold text-slate-900">${t("Lists")}</h3>
      <div class="relative mt-3">${icon("search", "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}
        <input data-find value="${esc(ui.find)}" placeholder="${t("Find a list…")}" aria-label="${t("Find a list")}" class="${SEARCH}" /></div>
      <nav class="mt-3 flex-1 space-y-4 overflow-y-auto pr-1">
        ${groups()
          .map((g) => {
            const items = g.items.filter((c) => !f || t(title(c)).toLowerCase().includes(f));
            if (!items.length) return "";
            return `<div>
              <p class="mb-1 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">${icon(g.icon, "h-3.5 w-3.5")} ${t(g.title)}</p>
              ${items
                .map((c) => {
                  const on = c === ui.cat;
                  const n = all.filter((v) => v.category === c).length;
                  return `<button type="button" data-cat="${c}" class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${on ? "border border-blue-100 bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"}">
                    <span>${esc(t(title(c)))}</span><span class="${on ? "rounded-full border border-blue-200 bg-white px-2 text-xs text-blue-600" : "text-xs text-slate-400"}">${n}</span></button>`;
                })
                .join("")}
            </div>`;
          })
          .join("") || `<p class="p-3 text-xs text-slate-500">${t("No list matches.")}</p>`}
      </nav>
    </aside>`;
  }

  function header(values) {
    const active = values.filter((v) => v.active).length;
    const retired = values.length - active;
    const parent = PARENT[ui.cat];
    const parents = parent ? store.all("referenceValues").filter((v) => v.category === parent && v.active) : [];
    return `
    <section class="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-lg font-bold capitalize tracking-tight text-slate-900">${esc(t(title(ui.cat)))}</h2>
          <code class="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">${esc(ui.cat)}</code>
        </div>
        <p class="mt-0.5 text-xs text-slate-500">${t("{{n}} offered on forms", { n: active })}${retired ? ` · ${t("{{n}} retired", { n: retired })}` : ""}${parent ? ` · ${t("each belongs to a {{parent}}", { parent: t(parent) })}` : ""}</p>
      </div>
      <div class="grid items-end gap-3 pt-1 ${parent ? "md:grid-cols-[1fr_1fr_1fr_auto]" : "md:grid-cols-[1fr_1fr_auto]"}">
        ${
          parent
            ? `<div class="space-y-1.5"><label class="text-[11px] font-bold uppercase tracking-wider text-slate-700">${t(parent)}</label>
                <select data-new="parent" class="${App.CONTROL} h-10"><option value="">${t("Select")}</option>${parents.map((p) => `<option ${ui.parent === p.value ? "selected" : ""}>${esc(p.label)}</option>`).join("")}</select></div>`
            : ""
        }
        <div class="space-y-1.5"><label class="text-[11px] font-bold uppercase tracking-wider text-slate-700">${t("Value")}</label>
          <input data-new="value" value="${esc(ui.value)}" placeholder="${t("stored value")}" class="${App.CONTROL} h-10" /></div>
        <div class="space-y-1.5"><label class="text-[11px] font-bold uppercase tracking-wider text-slate-700">${t("Label (optional)")}</label>
          <input data-new="label" value="${esc(ui.label)}" placeholder="${t("shown in the form")}" class="${App.CONTROL} h-10" /></div>
        <button type="button" data-add class="${BTN.primary} h-10">${icon("plus", "h-4 w-4")} ${t("Add value")}</button>
      </div>
      ${ui.error ? `<p role="alert" class="flex items-center gap-1 text-xs font-medium text-danger">${icon("circle-alert", "h-3.5 w-3.5")} ${esc(ui.error)}</p>` : ""}
    </section>`;
  }

  function valuesCard(values) {
    const q = ui.q.trim().toLowerCase();
    const rows = values.filter((v) => (ui.show === "offered" ? v.active : ui.show === "retired" ? !v.active : true)).filter((v) => !q || `${v.label} ${v.value}`.toLowerCase().includes(q));
    const size = 8;
    const pages = Math.max(1, Math.ceil(rows.length / size));
    ui.page = Math.min(ui.page, pages);
    const shown = rows.slice((ui.page - 1) * size, ui.page * size);
    const tab = (k, l, n) => `<button type="button" data-show="${k}" class="rounded-md px-3 py-1 text-xs font-semibold ${ui.show === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}">${t(l)} ${n}</button>`;
    const isRegion = ui.cat === "region";
    const parent = PARENT[ui.cat];
    return `
    <section class="${CARD} overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
        <div class="relative w-full max-w-md">${icon("search", "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}
          <input data-q value="${esc(ui.q)}" placeholder="${t("Search values…")}" class="${SEARCH}" /></div>
        <div class="flex rounded-lg bg-slate-100 p-1">${tab("all", "All", values.length)}${tab("offered", "Offered", values.filter((v) => v.active).length)}${tab("retired", "Retired", values.filter((v) => !v.active).length)}</div>
      </div>
      <div class="overflow-x-auto"><table class="w-full text-sm">
        <thead><tr class="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
          <th class="px-4 py-2.5">${t("Label")}</th><th class="px-3 py-2.5">${t("Stored value")}</th>
          ${parent ? `<th class="px-3 py-2.5">${t(parent)}</th>` : ""}${isRegion ? `<th class="px-3 py-2.5">${t("Map centre")}</th>` : ""}
          <th class="px-3 py-2.5">${t("Scope")}</th><th class="px-4 py-2.5 text-right">${t("Offered")}</th></tr></thead>
        <tbody>${
          shown
            .map(
              (v) => `
          <tr class="border-t border-slate-100">
            <td class="px-4 py-3">${v.active ? `<span class="font-semibold text-slate-900">${esc(t(v.label))}</span>` : `<span class="text-slate-400 line-through">${esc(t(v.label))}</span> <span class="ml-1 rounded border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-500">${t("retired")}</span>`}</td>
            <td class="px-3 py-3"><code class="font-mono text-[11px] text-slate-500">${esc(v.value)}</code></td>
            ${parent ? `<td class="px-3 py-3 text-[13px] text-slate-600">${esc(v.parent ?? "—")}</td>` : ""}
            ${isRegion ? `<td class="px-3 py-3 text-[13px] text-slate-700">${v.point ? `${icon("map-pin", "mr-1 inline h-3.5 w-3.5 text-slate-500")}${v.point[0].toFixed(3)}, ${v.point[1].toFixed(3)}` : "—"}</td>` : ""}
            <td class="px-3 py-3"><span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">${t("shared")}</span></td>
            <td class="whitespace-nowrap px-4 py-3 text-right">
              <button type="button" role="switch" aria-checked="${v.active}" data-toggle="${v.id}" aria-label="${t("Offered")}"
                class="relative inline-flex h-5 w-9 items-center rounded-full align-middle transition-colors ${v.active ? "bg-slate-800" : "bg-slate-200"}"><span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${v.active ? "translate-x-4" : "translate-x-0.5"}"></span></button>
              <button type="button" data-remove="${v.id}" class="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-md align-middle text-red-500 hover:bg-red-50" title="${t("Delete")}">${icon("trash-2", "h-3.5 w-3.5")}</button>
            </td>
          </tr>`,
            )
            .join("") || `<tr><td colspan="6" class="px-6 py-8 text-center text-xs text-slate-500">${t("No results match your filters")}</td></tr>`
        }</tbody></table></div>
      <div class="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        <span>${t("Showing {{from}} to {{to}} of {{n}} entries", { from: rows.length ? (ui.page - 1) * size + 1 : 0, to: Math.min(ui.page * size, rows.length), n: rows.length })}</span>
        <div class="flex gap-1">${Array.from({ length: pages }, (_, i) => `<button type="button" data-page="${i + 1}" class="h-8 min-w-8 rounded-md px-2 text-xs font-semibold ${ui.page === i + 1 ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-100"}">${i + 1}</button>`).join("")}</div>
      </div>
    </section>`;
  }

  function render() {
    const values = store.all("referenceValues").filter((v) => v.category === ui.cat);
    return `
    <div class="flex flex-col gap-6">
      ${AdminTiles("reference")}
      ${AdminHeading({ title: "Reference data", info: "The locations and option lists the data-entry forms offer. Changes take effect without a redeploy." })}
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-12">
        ${rail()}
        <div class="min-w-0 space-y-4 lg:col-span-9">${header(values)}${valuesCard(values)}</div>
      </div>
    </div>`;
  }

  function bind(root, user, rerender) {
    const typing = (sel, key) =>
      root.querySelector(sel)?.addEventListener("input", (e) => {
        ui[key] = e.target.value;
        ui.page = 1;
        const pos = e.target.selectionStart;
        rerender();
        const again = document.querySelector(sel);
        again?.focus();
        again?.setSelectionRange(pos, pos);
      });
    typing("[data-find]", "find");
    typing("[data-q]", "q");
    root.querySelectorAll("[data-new]").forEach((el) =>
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", () => {
        ui[el.dataset.new] = el.value;
        ui.error = "";
      }),
    );
    root.querySelectorAll("[data-cat]").forEach((b) =>
      b.addEventListener("click", () => {
        Object.assign(ui, { cat: b.dataset.cat, q: "", show: "all", value: "", label: "", parent: "", error: "", page: 1 });
        rerender();
      }),
    );
    root.querySelectorAll("[data-show]").forEach((b) =>
      b.addEventListener("click", () => {
        ui.show = b.dataset.show;
        ui.page = 1;
        rerender();
      }),
    );
    root.querySelectorAll("[data-page]").forEach((b) =>
      b.addEventListener("click", () => {
        ui.page = Number(b.dataset.page);
        rerender();
      }),
    );
    root.querySelector("[data-add]")?.addEventListener("click", () => {
      const value = ui.value.trim();
      if (!value) ui.error = t("Value is required");
      else if (PARENT[ui.cat] && !ui.parent) ui.error = t("Choose the {{parent}} it belongs to", { parent: t(PARENT[ui.cat]) });
      else if (store.all("referenceValues").some((v) => v.category === ui.cat && v.value.toLowerCase() === value.toLowerCase())) ui.error = t("This list already has that value");
      if (ui.error) return rerender();
      store.add("referenceValues", { id: store.newId("rv"), category: ui.cat, value, label: ui.label.trim() || value, parent: ui.parent || null, active: true });
      Object.assign(ui, { value: "", label: "" });
      toast(t("Value added"));
      rerender();
    });
    root.querySelectorAll("[data-toggle]").forEach((b) =>
      b.addEventListener("click", () => {
        const v = store.get("referenceValues", b.dataset.toggle);
        store.update("referenceValues", v.id, { active: !v.active });
        toast(t(v.active ? "Retired: no longer offered on forms" : "Offered on forms again"));
        rerender();
      }),
    );
    root.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", async () => {
        const v = store.get("referenceValues", b.dataset.remove);
        const ok = await confirmDialog({ title: t("Delete {{name}}?", { name: t(v.label) }), description: t("A value already used on records can only be retired."), destructive: true });
        if (!ok) return;
        store.remove("referenceValues", v.id);
        toast(t("Value deleted"));
        rerender();
      }),
    );
  }

  startPage({ active: "/admin", module: "admin", title: "Reference data", trail: [...ADMIN_TRAIL, { label: "Reference data" }], render, bind });
})((window.App = window.App || {}));
