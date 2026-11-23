/*
 * Stepped forms — a copy of components/data/form-layout.tsx (the "crisp" look):
 * the navy step bar with numbered circles and dashed lines, a white card with
 * sections (blue uppercase title, grey line), a 3-column grid of fields, the
 * error under each field, and the footer (Cancel/Back · Next step / Save).
 *
 *   const form = createForm({ steps, values, onSave })
 *   steps: [{ title, hint, sections: [{ title, description?, fields: [spec] }] }]
 *   spec:  { name, label, type: "text"|"tel"|"email"|"number"|"select"|"date"|"yesno"|"checkboxes"|"textarea"|"file"|"custom",
 *            required, options: [[value, label]] | (values) => [...], placeholder, help,
 *            showWhen: (values) => bool, check: (value, values) => "error" | null,
 *            always: true (run check even when empty), onChange: (value, values) => void,
 *            span: "full", html: (values, errors) => html (type "custom") }
 *   form.html()  → the page body;  form.bind(root, rerender)
 *
 * Dates follow the language: Gregorian in English, Ethiopian (E.C.) in Amharic.
 */
(function (App) {
  const { t, icon, esc, getLang, toEthiopian, BTN } = App;

  const CONTROL =
    "h-11 w-full rounded-lg border border-slate-300/70 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/30";
  const BAD = "border-red-400 bg-red-50/40";

  const EC_MONTHS_AM = ["መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"];

  /** Ethiopian → "YYYY-MM-DD" (the inverse of toEthiopian). */
  function fromEthiopian(y, m, d) {
    const jdn = 1723856 + 365 + 365 * (y - 1) + Math.floor(y / 4) + 30 * m + d - 31;
    const a = jdn + 32044;
    const b = Math.floor((4 * a + 3) / 146097);
    const c = a - Math.floor((146097 * b) / 4);
    const dd = Math.floor((4 * c + 3) / 1461);
    const e = c - Math.floor((1461 * dd) / 4);
    const mm = Math.floor((5 * e + 2) / 153);
    const day = e - Math.floor((153 * mm + 2) / 5) + 1;
    const month = mm + 3 - 12 * Math.floor(mm / 10);
    const year = 100 * b + dd - 4800 + Math.floor(mm / 10);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const optionsOf = (spec, values) => (typeof spec.options === "function" ? spec.options(values) : spec.options ?? []);

  function control(spec, values, bad) {
    const v = values[spec.name] ?? "";
    const id = `f-${spec.name}`;
    const cls = `${CONTROL} ${bad ? BAD : ""}`;
    switch (spec.type) {
      case "select":
        return `<div class="relative"><select id="${id}" data-name="${spec.name}" class="${cls} appearance-none pr-9 ${v ? "" : "text-slate-400"}">
          <option value="">${t(spec.placeholder ?? "Select")}</option>
          ${optionsOf(spec, values).map(([o, l]) => `<option value="${esc(o)}" ${String(v) === String(o) ? "selected" : ""} class="text-slate-900">${esc(t(l))}</option>`).join("")}
        </select>${icon("chevron-down", "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400")}</div>`;
      case "yesno":
        return control({ ...spec, type: "select", options: [["true", "Yes"], ["false", "No"]] }, { ...values, [spec.name]: v === "" ? "" : String(v) }, bad);
      case "textarea":
        return `<textarea id="${id}" data-name="${spec.name}" rows="3" placeholder="${esc(t(spec.placeholder ?? ""))}" class="${cls} h-auto py-2.5">${esc(v)}</textarea>`;
      case "checkboxes":
        return `<div class="flex flex-wrap gap-2">${optionsOf(spec, values)
          .map(([o, l]) => {
            const on = (v || []).includes(o);
            return `<label class="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${on ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-300/70 bg-slate-50 text-slate-700"}">
              <input type="checkbox" data-multi="${spec.name}" value="${esc(o)}" ${on ? "checked" : ""} class="h-4 w-4 accent-blue-600" /> ${esc(t(l))}</label>`;
          })
          .join("")}</div>`;
      case "file":
        return `<label class="flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-dashed ${bad ? "border-red-400 bg-red-50/40" : "border-slate-300 bg-slate-50"} px-3 text-sm text-slate-600 hover:bg-white">
          ${icon("upload", "h-4 w-4 text-slate-400")}
          <span class="truncate">${v ? esc(v) : t(spec.placeholder ?? "Choose a file")}</span>
          <input type="file" data-file="${spec.name}" class="sr-only" accept="image/*,application/pdf" /></label>`;
      case "date":
        if (getLang() === "am") {
          const e = v ? toEthiopian(v) : null;
          const sel = (part, opts, cur) => `<select data-ec="${spec.name}" data-part="${part}" class="${cls} appearance-none px-2">${opts.map(([o, l]) => `<option value="${o}" ${cur === o ? "selected" : ""}>${l}</option>`).join("")}</select>`;
          return `<div class="grid grid-cols-[1fr_1.6fr_1.2fr] gap-2">
            ${sel("d", [["", "ቀን"], ...Array.from({ length: 30 }, (_, i) => [i + 1, String(i + 1)])], e?.day ?? "")}
            ${sel("m", [["", "ወር"], ...EC_MONTHS_AM.map((n, i) => [i + 1, n])], e?.month ?? "")}
            ${sel("y", [["", "ዓመት"], ...Array.from({ length: 60 }, (_, i) => [2019 - i, String(2019 - i)])], e?.year ?? "")}
          </div>`;
        }
        return `<input id="${id}" type="date" data-name="${spec.name}" value="${esc(v)}" max="${spec.max ?? ""}" class="${cls}" />`;
      case "custom":
        return spec.html(values);
      default:
        return `<input id="${id}" type="${spec.type ?? "text"}" data-name="${spec.name}" value="${esc(v)}" placeholder="${esc(t(spec.placeholder ?? ""))}" ${spec.maxLength ? `maxlength="${spec.maxLength}"` : ""} class="${cls}" />`;
    }
  }

  function field(spec, values, errors) {
    if (spec.showWhen && !spec.showWhen(values)) return "";
    const err = errors[spec.name];
    const dateLabel = spec.type === "date" && getLang() === "am" ? ` (${t("E.C.")})` : "";
    return `
    <div data-field="${spec.name}" class="flex flex-col gap-2 ${spec.span === "full" ? "col-span-full" : ""}">
      ${spec.label ? `<label for="f-${spec.name}" class="text-sm font-semibold text-slate-700">${esc(t(spec.label))}${dateLabel}${spec.required ? ` <span class="text-red-500">*</span>` : ""}</label>` : ""}
      ${control(spec, values, !!err)}
      ${spec.help ? `<p class="text-xs text-slate-500">${esc(t(spec.help))}</p>` : ""}
      ${err ? `<p role="alert" class="flex items-center gap-1 text-xs font-medium text-danger">${icon("circle-alert", "h-3.5 w-3.5")} ${esc(t(err))}</p>` : ""}
    </div>`;
  }

  function validate(specs, values) {
    const errors = {};
    for (const s of specs) {
      if (s.showWhen && !s.showWhen(values)) continue;
      const v = values[s.name];
      const empty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
      if (s.required && empty) errors[s.name] = s.requiredMessage ? t(s.requiredMessage) : t("{{field}} is required", { field: t(s.label) });
      else if ((!empty || s.always) && s.check) {
        const m = s.check(v, values);
        if (m) errors[s.name] = m;
      }
    }
    return errors;
  }

  function Steps(steps, current) {
    return `
    <ol class="grid rounded-t-2xl bg-[#1e3a5f] px-4 pb-12 pt-6 shadow-md sm:px-8" style="grid-template-columns:repeat(${steps.length},minmax(0,1fr))" aria-label="${t("Steps")}">
      ${steps
        .map((s, i) => {
          const done = i < current;
          const now = i === current;
          return `
        <li class="relative flex flex-col items-center text-center">
          ${i < steps.length - 1 ? `<span class="absolute left-1/2 top-5 w-full border-t-2 border-dashed border-white/20" aria-hidden="true"></span>` : ""}
          <button type="button" data-goto="${i}" ${i > current ? "disabled" : ""} class="flex flex-col items-center gap-2 outline-none">
            <span class="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-md ${now ? "bg-blue-600 text-white shadow-lg ring-4 ring-white/10" : done ? "bg-blue-500 text-white" : "bg-white text-[#1e3a5f]"}">
              ${done ? icon("check", "h-4 w-4") : i + 1}</span>
            <span class="text-sm font-semibold text-white">${esc(t(s.title))}</span>
          </button>
          <span class="mt-0.5 hidden text-[11px] leading-snug sm:block ${now ? "text-blue-200/80" : "text-slate-400"}">${esc(t(s.hint))}</span>
        </li>`;
        })
        .join("")}
    </ol>`;
  }

  function createForm({ steps, values = {}, onSave, onCancel, note, saveLabel = "Save" }) {
    const state = { step: 0, values, errors: {}, banner: null, saving: false };
    const specsOf = (i) => steps[i].sections.flatMap((s) => s.fields);

    function html() {
      const s = steps[state.step];
      const last = state.step === steps.length - 1;
      return `
      <div class="mx-auto max-w-4xl">
        ${steps.length > 1 ? Steps(steps, state.step) : ""}
        <form novalidate data-form class="relative z-10 ${steps.length > 1 ? "-mt-6" : ""}">
          <div class="rounded-2xl border border-slate-200/60 bg-white px-5 pt-6 shadow-sm sm:px-8 sm:pt-8">
            <div class="space-y-8">
              ${s.sections
                .map(
                  (sec) => `
                <section class="space-y-6">
                  <div class="border-b border-slate-200/60 pb-4">
                    <h2 class="text-xs font-bold uppercase tracking-wider text-blue-600">${esc(t(sec.title))}</h2>
                    ${sec.description ? `<p class="mt-1 text-sm text-slate-500">${esc(t(sec.description))}</p>` : ""}
                  </div>
                  <div class="grid grid-cols-1 gap-x-6 gap-y-5 md:grid-cols-${sec.columns ?? 3}">
                    ${sec.fields.map((f) => field(f, state.values, state.errors)).join("")}
                  </div>
                </section>`,
                )
                .join("")}
            </div>
            ${note ? `<p class="mt-6 flex items-center gap-2 text-xs text-slate-500">${icon("info", "h-4 w-4 shrink-0")} ${esc(typeof note === "function" ? note(state.values) : t(note))}</p>` : ""}
            ${state.banner ? `<div class="mt-4 flex items-start gap-2 rounded-[10px] bg-red-100 px-4 py-3 text-sm font-medium text-danger">${icon("circle-alert", "mt-0.5 h-4 w-4 shrink-0")} ${esc(state.banner)}</div>` : ""}
            <div class="sticky bottom-0 z-20 -mx-5 mt-6 flex items-center justify-between gap-3 rounded-b-2xl border-t border-slate-200/70 bg-white/95 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
              ${
                state.step > 0
                  ? `<button type="button" data-back class="${BTN.outline} h-10">${icon("arrow-left", "h-4 w-4")} ${t("Back")}</button>`
                  : `<button type="button" data-cancel class="${BTN.outline} h-10">${t("Cancel")}</button>`
              }
              <button type="submit" class="${BTN.solid}" ${state.saving ? "disabled" : ""}>
                ${state.saving ? icon("loader-2", "h-4 w-4 animate-spin") : ""}
                ${last ? t(saveLabel) : t("Next step")} ${last ? "" : icon("arrow-right", "h-4 w-4")}
              </button>
            </div>
          </div>
        </form>
      </div>`;
    }

    function bind(root, rerender) {
      const specs = steps.flatMap((st) => st.sections.flatMap((sec) => sec.fields));
      const set = (name, value) => {
        state.values[name] = value;
        delete state.errors[name];
        specs.find((f) => f.name === name)?.onChange?.(value, state.values);
      };
      root.querySelectorAll("[data-name]").forEach((el) => {
        const ev = el.tagName === "SELECT" || el.type === "date" ? "change" : "input";
        el.addEventListener(ev, () => {
          set(el.dataset.name, el.value);
          if (ev === "change") rerender(); // follow-up questions may appear
        });
        el.addEventListener("blur", () => {
          if (state.errors[el.dataset.name] === undefined && el.tagName !== "SELECT") rerender();
        });
      });
      root.querySelectorAll("[data-multi]").forEach((el) =>
        el.addEventListener("change", () => {
          const name = el.dataset.multi;
          const cur = new Set(state.values[name] ?? []);
          el.checked ? cur.add(el.value) : cur.delete(el.value);
          set(name, [...cur]);
          rerender();
        }),
      );
      root.querySelectorAll("[data-file]").forEach((el) =>
        el.addEventListener("change", () => {
          set(el.dataset.file, el.files[0]?.name ?? "");
          rerender();
        }),
      );
      root.querySelectorAll("[data-ec]").forEach((el) =>
        el.addEventListener("change", () => {
          const name = el.dataset.ec;
          const parts = Object.fromEntries([...root.querySelectorAll(`[data-ec="${name}"]`)].map((s) => [s.dataset.part, Number(s.value)]));
          if (parts.d && parts.m && parts.y) set(name, fromEthiopian(parts.y, parts.m, parts.d));
          rerender();
        }),
      );
      root.querySelectorAll("[data-goto]").forEach((b) =>
        b.addEventListener("click", () => {
          const to = Number(b.dataset.goto);
          if (to < state.step) {
            state.step = to;
            state.banner = null;
            rerender();
          }
        }),
      );
      root.querySelector("[data-back]")?.addEventListener("click", () => {
        state.step -= 1;
        state.banner = null;
        rerender();
        window.scrollTo(0, 0);
      });
      root.querySelector("[data-cancel]")?.addEventListener("click", () => onCancel?.());
      root.querySelector("[data-form]").addEventListener("submit", (e) => {
        e.preventDefault();
        const errors = validate(specsOf(state.step), state.values);
        state.errors = errors;
        if (Object.keys(errors).length) {
          // Same words as lib/field-errors.ts summaryFor(): one error as it is, more as a list.
          const keys = Object.keys(errors);
          const labelOf = (k) => t(specsOf(state.step).find((f) => f.name === k)?.label || k);
          state.banner = keys.length === 1 ? errors[keys[0]] : t("Fill in or correct: {{fields}}.", { fields: keys.map(labelOf).join(", ") });
          rerender();
          root.querySelector(`[data-field="${Object.keys(errors)[0]}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
          return;
        }
        state.banner = null;
        if (state.step < steps.length - 1) {
          state.step += 1;
          rerender();
          window.scrollTo(0, 0);
          return;
        }
        state.saving = true;
        rerender();
        setTimeout(() => onSave(state.values), 500);
      });
      // Custom controls (pickers) hook in here.
      steps[state.step].sections.flatMap((s) => s.fields).forEach((f) => f.bind?.(root, state, rerender));
    }

    return { state, html, bind };
  }

  Object.assign(App, { createForm, validate, fromEthiopian, CONTROL });
})((window.App = window.App || {}));
