/*
 * People picker — a copy of meal-mis-frontend/src/components/people-picker.tsx:
 * search, filters (Region, Zone, Woreda, Sex, Disability, Priority sector),
 * "Select the N shown", "N selected", Clear, and a ticked list of approved
 * participants (name, ID, Woreda, Zone, sex).
 *
 *   PeoplePicker(state, { people, max, exclude, priorityFilter, idPrefix })
 *   bindPeoplePicker(root, state, rerender, { onChange })
 *   state = { selected: [ids], q, region, zone, woreda, sex, disability, priority }
 * `people` is already scoped to the user's cluster (store.list).
 */
(function (App) {
  const { t, esc, lookups, places } = App;

  const SELECT = "h-8 w-full rounded-md border border-slate-200 bg-slate-50/50 px-2 text-xs text-slate-700";

  function matches(p, s) {
    const q = (s.q ?? "").trim().toLowerCase();
    if (q && !`${p.fullName} ${p.code}`.toLowerCase().includes(q)) return false;
    if (s.region && p.region !== s.region) return false;
    if (s.zone && p.zone !== s.zone) return false;
    if (s.woreda && p.woreda !== s.woreda) return false;
    if (s.sex && p.sex !== s.sex) return false;
    if (s.disability && p.disability !== (s.disability === "yes")) return false;
    if (s.priority && !p.priorities.includes(s.priority)) return false;
    return true;
  }

  function PeoplePicker(s, { people, exclude = [], priorityFilter = false, idPrefix = "people", max }) {
    const pool = people.filter((p) => p.review === "approved" && !exclude.includes(p.id));
    const listed = pool.filter((p) => matches(p, s)).slice(0, 50);
    const regions = [...new Set(people.map((p) => p.region))];
    const filter = (key, labelText, options, disabled = false) => `
      <div class="space-y-0.5">
        <label class="text-[10px] font-medium text-slate-500">${t(labelText)}</label>
        <select data-pp-filter="${key}" ${disabled ? "disabled" : ""} class="${SELECT} ${disabled ? "opacity-50" : ""}">
          <option value="">${t("All")}</option>
          ${options.map(([v, l]) => `<option value="${esc(v)}" ${s[key] === v ? "selected" : ""}>${esc(t(l))}</option>`).join("")}
        </select>
      </div>`;
    const allListed = listed.length > 0 && listed.every((p) => s.selected.includes(p.id));
    const full = max !== undefined && s.selected.length >= max;
    return `
    <div class="space-y-3" data-pp="${idPrefix}">
      <input data-pp-search aria-label="${t("Search by name")}" value="${esc(s.q ?? "")}" placeholder="${t("Search by name or ID…")}"
        class="h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30" />
      <div class="grid grid-cols-2 gap-2 sm:grid-cols-3 ${priorityFilter ? "xl:grid-cols-6" : "xl:grid-cols-5"}">
        ${filter("region", "Region", regions.map((r) => [r, r]), regions.length < 2)}
        ${filter("zone", "Zone", Object.keys(places[s.region] ?? {}).map((z) => [z, z]), !s.region)}
        ${filter("woreda", "Woreda", (places[s.region]?.[s.zone] ?? []).map((w) => [w, w]), !s.zone)}
        ${filter("sex", "Sex", [["male", "Male"], ["female", "Female"]])}
        ${filter("disability", "Disability", [["yes", "Yes"], ["no", "No"]])}
        ${priorityFilter ? filter("priority", "Priority sector", lookups["participants.priority_sector"]) : ""}
      </div>
      <div class="space-y-2">
        <div class="flex flex-wrap items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
          <label class="flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-700">
            <input type="checkbox" data-pp-all ${allListed ? "checked" : ""} class="h-4 w-4 accent-blue-600" />
            ${t("Select the {{n}} shown", { n: listed.length })}
          </label>
          <span class="ml-auto text-xs font-semibold text-slate-500">${t("{{n}} selected", { n: `<span class="text-blue-600">${s.selected.length}</span>` })}</span>
          ${s.selected.length ? `<button type="button" data-pp-clear class="h-7 rounded-md px-2 text-xs font-medium hover:bg-slate-200/60">${t("Clear")}</button>` : ""}
        </div>
        <div class="max-h-[360px] divide-y divide-slate-100 overflow-y-auto pr-1">
          ${
            listed.length === 0
              ? `<p class="p-4 text-center text-xs text-slate-500">${t("No approved participants match these filters.")}</p>`
              : listed
                  .map((p) => {
                    const on = s.selected.includes(p.id);
                    return `
              <label class="flex cursor-pointer items-center gap-3 rounded px-2 py-2.5 text-xs transition hover:bg-slate-50/80 ${on ? "bg-blue-50/70" : ""} ${full && !on ? "opacity-50" : ""}">
                <input type="checkbox" data-pp-person="${p.id}" ${on ? "checked" : ""} ${full && !on ? "disabled" : ""} class="h-4 w-4 accent-blue-600" />
                <span class="min-w-0 flex-1 truncate font-medium text-slate-900">${esc(p.fullName)}</span>
                <span class="hidden w-28 shrink-0 truncate font-mono text-[11px] text-slate-400 sm:block">${esc(p.code)}</span>
                <span class="hidden w-44 shrink-0 truncate text-slate-600 md:block">${esc(p.woreda)}, ${esc(p.zone)}</span>
                <span class="w-16 shrink-0 text-right text-slate-500">${t(p.sex === "male" ? "Male" : "Female")}</span>
              </label>`;
                  })
                  .join("")
          }
        </div>
      </div>
    </div>`;
  }

  function bindPeoplePicker(root, s, rerender, { idPrefix = "people", people = [], max, onChange = () => {} } = {}) {
    const box = root.querySelector(`[data-pp="${idPrefix}"]`);
    if (!box) return;
    const changed = () => {
      onChange(s.selected);
      rerender();
    };
    const search = box.querySelector("[data-pp-search]");
    search.addEventListener("input", () => {
      s.q = search.value;
      const pos = search.selectionStart;
      rerender();
      const again = root.querySelector(`[data-pp="${idPrefix}"] [data-pp-search]`);
      again?.focus();
      again?.setSelectionRange(pos, pos);
    });
    box.querySelectorAll("[data-pp-filter]").forEach((sel) =>
      sel.addEventListener("change", () => {
        const key = sel.dataset.ppFilter;
        s[key] = sel.value;
        if (key === "region") s.zone = s.woreda = "";
        if (key === "zone") s.woreda = "";
        rerender();
      }),
    );
    box.querySelectorAll("[data-pp-person]").forEach((c) =>
      c.addEventListener("change", () => {
        const id = c.dataset.ppPerson;
        s.selected = c.checked ? [...s.selected, id] : s.selected.filter((x) => x !== id);
        changed();
      }),
    );
    box.querySelector("[data-pp-all]")?.addEventListener("change", (e) => {
      const shown = [...box.querySelectorAll("[data-pp-person]")].map((c) => c.dataset.ppPerson);
      if (e.target.checked) {
        const room = max === undefined ? Infinity : max - s.selected.length;
        s.selected = [...s.selected, ...shown.filter((id) => !s.selected.includes(id)).slice(0, room)];
      } else s.selected = s.selected.filter((id) => !shown.includes(id));
      changed();
    });
    box.querySelector("[data-pp-clear]")?.addEventListener("click", () => {
      s.selected = [];
      changed();
    });
  }

  Object.assign(App, { PeoplePicker, bindPeoplePicker });
})((window.App = window.App || {}));
