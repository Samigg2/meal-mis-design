/*
 * Administration › Custom fields — a copy of admin.custom-fields.tsx with
 * components/custom-fields/add-field-form.tsx and fields-table.tsx:
 * record types on the left (Entities, Programme activities, Governance &
 * learning), "Add a field to <type>" (label, help, stored name, type, required,
 * options for a choice), then its fields (Label, Stored name, Type, Required,
 * Status). National only: set by national administrators.
 * Data: store.list("customFields") — GET/POST /admin/custom-fields
 */
(function (App) {
  const { t, icon, esc, store, startPage, page, BTN, AdminTiles, AdminHeading, ADMIN_TRAIL, CARD, toast, confirmDialog } = App;

  // Only the record types seen in the real left panel (admin.custom-fields.tsx RECORD_TYPE_GROUPS).
  const GROUPS = [
    { title: "Entities", icon: "boxes", items: [["participants", "Participant"], ["enterprises", "Enterprise"], ["institutions", "Institution"], ["providers", "Financial service provider"], ["employment", "Employment outcome"], ["ysla", "YSLA"], ["material", "Support received"]] },
    { title: "Programme activities", icon: "activity", items: [["training", "Training event"], ["partnerships", "Partnership"], ["empowerment", "Empowerment activity"], ["support_networks", "Mentor or network"], ["sbcc", "SBCC activity"]] },
    { title: "Governance & learning", icon: "landmark", items: [["governance", "Engagement"], ["feedback", "Feedback"], ["safeguarding", "Safeguarding case"], ["actions", "Action item"]] },
  ];
  const TYPES = [
    ["text", "Short text", "Name, ID", "type"],
    ["textarea", "Long text", "Paragraph", "align-left"],
    ["number", "Number", "Quantity, age", "hash"],
    ["date", "Date", "Calendar", "calendar"],
    ["select", "Choice", "Dropdown", "list"],
    ["email", "Email", "Address", "at-sign"],
    ["boolean", "Yes / no", "Boolean", "toggle-left"],
  ];
  const typeLabel = (k) => TYPES.find((x) => x[0] === k)?.[1] ?? k;
  const toKey = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/^(\d)/, "f_$1").slice(0, 60);

  const ui = { module: "participants", find: "", q: "", show: "all", draft: { label: "", help: "", key: "", type: "text", required: false, options: "" }, error: "" };

  const SEARCH = "h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white";
  const SMALL_LABEL = "text-[11px] font-bold uppercase tracking-wider text-slate-700";

  function rail() {
    const f = ui.find.trim().toLowerCase();
    return `
    <aside class="${CARD} flex max-h-[680px] flex-col p-4">
      <h3 class="text-[15px] font-bold text-slate-900">${t("Record types")}</h3>
      <div class="relative mt-3">${icon("search", "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}
        <input data-find value="${esc(ui.find)}" placeholder="${t("Find a record type…")}" aria-label="${t("Find a record type")}" class="${SEARCH}" /></div>
      <nav class="mt-3 flex-1 space-y-4 overflow-y-auto pr-1">
        ${GROUPS.map((g) => {
          const items = g.items.filter(([, l]) => !f || t(l).toLowerCase().includes(f));
          if (!items.length) return "";
          return `<div>
            <p class="mb-1 flex items-center gap-1.5 px-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">${icon(g.icon, "h-3.5 w-3.5")} ${t(g.title)}</p>
            ${items
              .map(([k, l]) => {
                const n = store.all("customFields").filter((c) => c.module === k).length;
                const on = k === ui.module;
                return `<button type="button" data-module="${k}" class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${on ? "border border-blue-100 bg-blue-50 font-semibold text-blue-700" : "text-slate-700 hover:bg-slate-50"}">
                  <span>${esc(t(l))}</span>${n ? `<span class="text-xs ${on ? "text-blue-600" : "text-slate-400"}">${n}</span>` : ""}</button>`;
              })
              .join("")}
          </div>`;
        }).join("") || `<p class="p-3 text-xs text-slate-500">${t("No record type matches.")}</p>`}
      </nav>
    </aside>`;
  }

  function addForm(typeName) {
    const d = ui.draft;
    return `
    <section class="${CARD} p-5">
      <div class="border-b border-slate-100 pb-4">
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-lg font-bold tracking-tight text-slate-900">${t("Add a field to {{type}}", { type: t(typeName) })}</h3>
          <code class="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-[11px] text-slate-600">${ui.module}</code>
        </div>
        <p class="text-xs text-slate-500">${t("Extra information collected on every {{type}} record across all clusters.", { type: t(typeName) })}</p>
      </div>
      <div class="space-y-5 pt-5">
        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1.5"><label for="cf-label" class="${SMALL_LABEL}">${t("Label (what the form asks)")}</label>
            <input id="cf-label" data-draft="label" value="${esc(d.label)}" placeholder="${t("Head of household")}" class="${App.CONTROL} h-10" /></div>
          <div class="space-y-1.5"><label for="cf-help" class="${SMALL_LABEL}">${t("Help text (optional)")}</label>
            <input id="cf-help" data-draft="help" value="${esc(d.help)}" placeholder="${t("Shown under the field, e.g. what counts as head of household")}" class="${App.CONTROL} h-10" /></div>
        </div>
        <details class="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
          <summary class="cursor-pointer">${t("Advanced: stored name")} <code class="ml-1">${esc(d.key || toKey(d.label) || "…")}</code></summary>
          <input data-draft="key" value="${esc(d.key)}" placeholder="head_of_household" class="${App.CONTROL} mt-2 h-9 font-mono" />
          <p class="mt-1 text-xs text-slate-500">${t("Made from the label. Used in exports and Power BI; it cannot change later.")}</p>
        </details>
        <div>
          <p class="${SMALL_LABEL} mb-2">${t("Type")}</p>
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
            ${TYPES.map(([k, l, s, ic]) => {
              const on = d.type === k;
              return `<button type="button" data-type="${k}" class="flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-center ${on ? "border-blue-500 bg-blue-50/50 text-blue-700 ring-1 ring-blue-500" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}">
                ${icon(ic, "h-4 w-4")}<span class="text-[13px] font-semibold">${t(l)}</span><span class="text-[10px] ${on ? "text-blue-600" : "text-slate-400"}">${t(s)}</span></button>`;
            }).join("")}
          </div>
        </div>
        ${
          d.type === "select"
            ? `<div class="space-y-1.5"><label class="${SMALL_LABEL}">${t("Options")}</label>
                <textarea data-draft="options" rows="4" placeholder="${t("One per line or comma separated")}&#10;${t("Yes")}&#10;${t("No")}&#10;${t("Not sure")}" class="${App.CONTROL} h-auto py-2">${esc(d.options)}</textarea></div>`
            : ""
        }
        ${ui.error ? `<p role="alert" class="flex items-center gap-1 text-xs font-medium text-danger">${icon("circle-alert", "h-3.5 w-3.5")} ${esc(ui.error)}</p>` : ""}
        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <label class="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" data-required ${d.required ? "checked" : ""} class="h-4 w-4 accent-blue-600" /> ${t("Required on every {{type}} record", { type: t(typeName) })}</label>
          <button type="button" data-add class="${BTN.primary}">${icon("plus", "h-4 w-4")} ${t("Add field")}</button>
        </div>
      </div>
    </section>`;
  }

  function fieldList(typeName) {
    const all = store.all("customFields").filter((c) => c.module === ui.module);
    const q = ui.q.trim().toLowerCase();
    const rows = all.filter((c) => (ui.show === "active" ? c.active : ui.show === "required" ? c.required : true)).filter((c) => !q || `${c.label} ${c.key}`.toLowerCase().includes(q));
    const tab = (k, l, n) => `<button type="button" data-show="${k}" class="rounded-md px-3 py-1 text-xs font-semibold ${ui.show === k ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}">${t(l)} ${n}</button>`;
    return `
    <section class="${CARD} overflow-hidden">
      <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-4">
        <div class="relative w-full max-w-md">${icon("search", "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}
          <input data-q value="${esc(ui.q)}" placeholder="${t("Search fields…")}" aria-label="${t("Search fields")}" class="${SEARCH}" /></div>
        <div class="flex rounded-lg bg-slate-100 p-1">${tab("all", "All", all.length)}${tab("active", "Active", all.filter((c) => c.active).length)}${tab("required", "Required", all.filter((c) => c.required).length)}</div>
      </div>
      ${
        all.length === 0
          ? `<div class="flex flex-col items-center gap-2 px-6 py-14 text-center">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">${icon("sliders-horizontal", "h-5 w-5")}</span>
              <p class="text-sm font-medium text-slate-800">${t("No custom fields on this record type yet")}</p>
              <p class="text-xs text-muted-foreground">${t("Add one above and it will appear on every {{type}} record.", { type: t(typeName) })}</p></div>`
          : `<div class="overflow-x-auto"><table class="w-full text-sm">
              <thead><tr class="bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th class="px-6 py-2.5">${t("Label")}</th><th class="px-3 py-2.5">${t("Stored name")}</th><th class="px-3 py-2.5">${t("Type")}</th><th class="px-3 py-2.5">${t("Required")}</th><th class="w-[1%] px-6 py-2.5 text-right">${t("Status")}</th></tr></thead>
              <tbody>${rows
                .map(
                  (c) => `
                <tr class="border-t border-slate-100 ${c.active ? "" : "opacity-60"}">
                  <td class="px-6 py-3"><p class="font-medium text-slate-900">${esc(c.label)}</p>${c.help ? `<p class="mt-0.5 text-xs text-slate-500">${esc(c.help)}</p>` : ""}</td>
                  <td class="px-3 py-3"><code class="font-mono text-[11px] text-slate-500">${esc(c.key)}</code></td>
                  <td class="px-3 py-3"><span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">${t(typeLabel(c.type))}</span>
                    ${c.options?.length ? `<p class="mt-1 max-w-[200px] truncate text-[10px] text-slate-500" title="${esc(c.options.join(", "))}">${esc(c.options.join(", "))}</p>` : ""}</td>
                  <td class="px-3 py-3">${c.required ? `<span class="font-medium text-slate-800">${t("Yes")}</span>` : `<span class="text-slate-400">${t("Optional")}</span>`}</td>
                  <td class="whitespace-nowrap px-6 py-3 text-right">
                    <button type="button" role="switch" aria-checked="${c.active}" data-toggle="${c.id}" aria-label="${t(c.active ? "Hide {{label}}" : "Show {{label}}", { label: esc(c.label) })}"
                      class="relative inline-flex h-5 w-9 items-center rounded-full align-middle transition-colors ${c.active ? "bg-slate-800" : "bg-slate-200"}"><span class="inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${c.active ? "translate-x-4" : "translate-x-0.5"}"></span></button>
                    <button type="button" data-remove="${c.id}" class="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-md align-middle text-destructive hover:bg-red-50" title="${t("Remove")}">${icon("trash-2", "h-3.5 w-3.5")}</button>
                  </td>
                </tr>`,
                )
                .join("") || `<tr><td colspan="5" class="px-6 py-8 text-center text-xs text-slate-500">${t("No results match your filters")}</td></tr>`}</tbody></table></div>`
      }
    </section>`;
  }

  function render() {
    const typeName = GROUPS.flatMap((g) => g.items).find(([k]) => k === ui.module)[1];
    return `
    <div class="flex flex-col gap-6">
      ${AdminTiles("custom")}
      ${AdminHeading({
        title: "Custom fields",
        info: "Add fields to a record type for the whole programme. Every cluster sees them on its forms straight away, without a deploy. Custom fields are national: set by national administrators, filled by every cluster, and included in report exports and Power BI. A choice field can filter lists and break down reports; an indicator can count it. Removing a field keeps the values already captured.",
      })}
      <div class="grid grid-cols-1 gap-5 lg:grid-cols-[290px_1fr]">
        ${rail()}
        <div class="flex min-w-0 flex-col gap-5">${addForm(typeName)}${fieldList(typeName)}</div>
      </div>
    </div>`;
  }

  function keepFocus(root, sel, rerender) {
    const el = root.querySelector(sel);
    const pos = el.selectionStart;
    rerender();
    const again = document.querySelector(sel);
    again?.focus();
    again?.setSelectionRange?.(pos, pos);
  }

  function bind(root, user, rerender) {
    root.querySelector("[data-find]").addEventListener("input", (e) => {
      ui.find = e.target.value;
      keepFocus(root, "[data-find]", rerender);
    });
    root.querySelector("[data-q]").addEventListener("input", (e) => {
      ui.q = e.target.value;
      keepFocus(root, "[data-q]", rerender);
    });
    root.querySelectorAll("[data-module]").forEach((b) =>
      b.addEventListener("click", () => {
        ui.module = b.dataset.module;
        ui.error = "";
        ui.q = "";
        rerender();
      }),
    );
    root.querySelectorAll("[data-draft]").forEach((el) =>
      el.addEventListener("input", () => {
        ui.draft[el.dataset.draft] = el.value;
        ui.error = "";
        if (el.dataset.draft === "label") {
          const code = root.querySelector("details summary code");
          if (code && !ui.draft.key) code.textContent = toKey(el.value) || "…";
        }
      }),
    );
    root.querySelectorAll("[data-type]").forEach((b) =>
      b.addEventListener("click", () => {
        ui.draft.type = b.dataset.type;
        rerender();
      }),
    );
    root.querySelector("[data-required]").addEventListener("change", (e) => (ui.draft.required = e.target.checked));
    root.querySelectorAll("[data-show]").forEach((b) =>
      b.addEventListener("click", () => {
        ui.show = b.dataset.show;
        rerender();
      }),
    );
    root.querySelector("[data-add]").addEventListener("click", () => {
      const d = ui.draft;
      const key = (d.key || toKey(d.label)).trim();
      if (!d.label.trim()) ui.error = t("Label is required");
      else if (!/^[a-z][a-z0-9_]*$/.test(key)) ui.error = t("Start with a letter; use only lowercase letters, numbers and underscores.");
      else if (store.all("customFields").some((c) => c.module === ui.module && c.key === key)) ui.error = t("This record type already has a field with this key.");
      else if (d.type === "select" && !d.options.trim()) ui.error = t("Give at least one option");
      if (ui.error) return rerender();
      store.add("customFields", {
        id: store.newId("cf"), module: ui.module, label: d.label.trim(), help: d.help.trim(), key, type: d.type, required: d.required, active: true,
        options: d.type === "select" ? d.options.split(/[\n,]/).map((s) => s.trim()).filter(Boolean) : [],
      });
      ui.draft = { label: "", help: "", key: "", type: "text", required: false, options: "" };
      toast(t("Field added: every cluster now sees it on that record type"));
      rerender();
    });
    root.querySelectorAll("[data-toggle]").forEach((b) =>
      b.addEventListener("click", () => {
        const c = store.get("customFields", b.dataset.toggle);
        store.update("customFields", c.id, { active: !c.active });
        rerender();
      }),
    );
    root.querySelectorAll("[data-remove]").forEach((b) =>
      b.addEventListener("click", async () => {
        const c = store.get("customFields", b.dataset.remove);
        const ok = await confirmDialog({ title: t("Remove {{name}}", { name: c.label }), description: t("Removing a field keeps the values already captured."), confirmLabel: t("Remove"), destructive: true });
        if (!ok) return;
        store.remove("customFields", c.id);
        toast(t("Field removed — values already recorded are kept"));
        rerender();
      }),
    );
  }

  startPage({ active: "/admin", module: "admin", nationalOnly: true, title: "Custom fields", trail: [...ADMIN_TRAIL, { label: "Custom fields" }], render, bind });
})((window.App = window.App || {}));
