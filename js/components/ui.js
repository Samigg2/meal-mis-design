/*
 * Small shared pieces, each copied from the real app:
 *   StatusBadge / ReviewBadge — components/data/status-badge.tsx (crisp pills)
 *   StatCards                 — the four tinted cards on list pages (color-stats.tsx)
 *   Avatar / PersonCell       — components/data/cells.tsx
 *   Panel / InfoTip           — components/dashboard-widgets.tsx, data/info-tip.tsx
 *   BTN                       — the button looks (ui/button.tsx and list toolbars)
 */
(function (App) {
  const { t, icon, initials, esc } = App;

  const TONES = {
    green: { fg: "#047857", bg: "#ECFDF5", border: "#A7F3D099", dot: "#10B981" },
    amber: { fg: "#B45309", bg: "#FFFBEB", border: "#FDE68A", dot: "#D97706" },
    red: { fg: "#B91C1C", bg: "#FEF2F2", border: "#FECACA", dot: "#EF4444" },
    grey: { fg: "#475569", bg: "#F8FAFC", border: "#E2E8F0", dot: "#94A3B8" },
    blue: { fg: "#1D4ED8", bg: "#EFF6FF", border: "#BFDBFE", dot: "#2563EB" },
  };

  function pill(tone, text, iconName) {
    const c = TONES[tone];
    return `<span class="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none"
      style="color:${c.fg};background:${c.bg};border-color:${c.border}">
      ${iconName ? `<span class="inline-flex" style="color:${c.dot}">${icon(iconName, "h-3 w-3")}</span>` : `<span class="h-1.5 w-1.5 rounded-full" style="background:${c.dot}"></span>`}
      ${esc(text)}</span>`;
  }

  /** Active / Inactive (and other plain statuses). */
  const StatusBadge = (status) =>
    status === "active" ? pill("green", t("Active")) : status === "inactive" ? pill("grey", t("Inactive")) : pill("blue", t(status));

  /** Approved / Pending / Rejected — the review pill with its icon. */
  const ReviewBadge = (review) =>
    review === "approved"
      ? pill("blue", t("Approved"), "badge-check")
      : review === "pending"
        ? pill("amber", t("Pending"), "clock")
        : pill("red", t("Rejected"), "circle-x");

  /** The four tinted cards over a list (Total, Active, Female, With disability …). */
  const CARD_TONES = {
    blue: { card: "border-blue-500 bg-blue-100/70", icon: "bg-blue-200/80 text-blue-600", bar: "bg-blue-500", track: "bg-blue-200" },
    green: { card: "border-emerald-100 bg-emerald-50/70", icon: "bg-emerald-100 text-emerald-600", bar: "bg-emerald-400", track: "bg-emerald-100" },
    purple: { card: "border-purple-100 bg-purple-50/70", icon: "bg-purple-100 text-purple-600", bar: "bg-purple-400", track: "bg-purple-100" },
    amber: { card: "border-amber-100 bg-amber-50/70", icon: "bg-amber-100 text-amber-500", bar: "bg-amber-300", track: "bg-amber-100" },
  };
  function StatCards(cards) {
    return `
    <section class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      ${cards
        .map((c) => {
          const k = CARD_TONES[c.tone];
          return `
        <div class="rounded-xl border ${k.card} p-4 shadow-sm">
          <div class="flex items-center gap-3">
            <span class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${k.icon}">${icon(c.icon, "h-5 w-5")}</span>
            <div class="min-w-0">
              <p class="text-[13px] font-medium text-slate-600">${esc(t(c.label))}</p>
              <p class="text-2xl font-bold leading-tight tracking-tight text-slate-900">${esc(c.value)}</p>
            </div>
          </div>
          ${
            c.sub !== undefined
              ? `<p class="mt-2 text-xs text-slate-600">${esc(c.sub)}</p>
                 <div class="mt-2 h-1 overflow-hidden rounded-full ${k.track}"><div class="h-full rounded-full ${k.bar}" style="width:${Math.min(100, c.pct ?? 100)}%"></div></div>`
              : ""
          }
        </div>`;
        })
        .join("")}
    </section>`;
  }

  /** Round initials, as in the tables. */
  const Avatar = (name, size = "h-7 w-7 text-[11px]") =>
    `<span class="flex ${size} shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 font-semibold text-slate-600">${initials(name)}</span>`;

  /** Name with the code under it (tables). */
  const PersonCell = (name, code, href) => `
    <div class="flex min-w-0 items-center gap-2.5">
      ${Avatar(name)}
      <div class="min-w-0 max-w-[210px] leading-tight">
        ${href ? `<a href="${href}" class="block truncate text-xs font-semibold text-slate-900 hover:text-blue-600">${esc(name)}</a>` : `<p class="truncate text-xs font-semibold text-slate-900">${esc(name)}</p>`}
        ${code ? `<p class="mt-0.5 truncate font-mono text-[10px] text-slate-400">${esc(code)}</p>` : ""}
      </div>
    </div>`;

  /** The small (i) with its text on hover. */
  const InfoTip = (text) => `
    <span class="group/tip relative inline-flex">
      <span tabindex="0" aria-label="${esc(text)}" class="inline-flex text-slate-400 hover:text-slate-600">${icon("info", "h-3.5 w-3.5")}</span>
      <span role="tooltip" class="pointer-events-none absolute left-1/2 top-full z-40 mt-1.5 hidden w-60 -translate-x-1/2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-normal normal-case tracking-normal text-slate-600 shadow-md group-hover/tip:block group-focus-within/tip:block">${esc(text)}</span>
    </span>`;

  /** Dashboard panel: caps = the executive look (small uppercase title). */
  function Panel({ title, info, action = "", body, caps = false, className = "" }) {
    return `
    <section class="flex min-w-0 flex-col h-full rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm ${className}">
      <header class="mb-3 flex items-start justify-between gap-3">
        <div class="flex min-w-0 items-center gap-1.5">
          <h2 class="${caps ? "text-sm font-bold uppercase tracking-tight text-slate-900" : "text-base font-bold text-ink"}">${esc(t(title))}</h2>
          ${info ? InfoTip(t(info)) : ""}
        </div>
        ${action}
      </header>
      <div class="flex min-h-0 flex-1 flex-col">${body}</div>
    </section>`;
  }

  /** Card used by detail pages and forms. */
  const CARD = "rounded-[14px] border border-line bg-white shadow-[0_1px_2px_rgba(28,25,23,.05),0_6px_16px_rgba(28,25,23,.04)]";

  const BTN = {
    /** The light-blue main button (ui/button.tsx default). */
    primary:
      "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#3B82F6]/40 bg-[#E8F0FE] px-3.5 text-[13px] font-semibold text-slate-900 shadow-sm transition-colors hover:bg-[#DBE7FD] [&_svg]:text-[#3B82F6] disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500",
    /** Solid blue (form Next / Save). */
    solid:
      "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-blue-500 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
    outline:
      "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50",
    danger:
      "inline-flex h-9 items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-red-200 bg-white px-3.5 text-[13px] font-semibold text-red-600 shadow-sm transition-colors hover:bg-red-50",
    icon: "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50",
    ghostIcon: "inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800",
  };

  /** A short message at the bottom of the screen (sonner toast). */
  function toast(message, tone = "success") {
    const el = document.createElement("div");
    el.setAttribute("role", "status");
    el.className = `fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-lg border bg-white px-4 py-3 text-sm font-medium shadow-lg ${tone === "error" ? "border-red-200 text-red-700" : "border-slate-200 text-slate-800"}`;
    el.innerHTML = `${icon(tone === "error" ? "circle-x" : "circle-check", `h-4 w-4 ${tone === "error" ? "text-red-500" : "text-emerald-500"}`)}<span>${esc(message)}</span>`;
    document.body.appendChild(el);
    App.drawIcons();
    setTimeout(() => el.remove(), 3200);
  }

  /** A message carried to the next page (shown once there). */
  function toastNext(message) {
    try {
      sessionStorage.setItem("design-toast", message);
    } catch {
      /* no storage: no message */
    }
  }
  function showPendingToast() {
    try {
      const m = sessionStorage.getItem("design-toast");
      if (m) {
        sessionStorage.removeItem("design-toast");
        toast(m);
      }
    } catch {
      /* nothing to show */
    }
  }

  /**
   * Confirm box — components/confirm-dialog.tsx: title, description, Cancel and
   * a red button when destructive. Returns a promise of true / false.
   */
  function confirmDialog({ title, description = "", confirmLabel, destructive = false }) {
    return new Promise((resolve) => {
      const wrap = document.createElement("div");
      wrap.className = "fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4";
      wrap.innerHTML = `
        <div role="dialog" aria-modal="true" class="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start">
            ${destructive ? `<span class="mx-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-danger sm:mx-0">${icon("triangle-alert", "h-5 w-5")}</span>` : ""}
            <div class="space-y-1.5 text-center sm:text-left">
              <h2 class="text-lg font-semibold text-slate-900">${esc(title)}</h2>
              ${description ? `<p class="text-sm text-muted-foreground">${esc(description)}</p>` : ""}
            </div>
          </div>
          <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button type="button" data-no class="${BTN.outline}">${t("Cancel")}</button>
            <button type="button" data-yes class="inline-flex h-9 items-center justify-center rounded-lg px-4 text-[13px] font-semibold shadow-sm ${destructive ? "bg-destructive text-white hover:bg-destructive/90" : "bg-blue-600 text-white hover:bg-blue-700"}">${esc(confirmLabel ?? (destructive ? t("Delete") : t("Confirm")))}</button>
          </div>
        </div>`;
      const done = (v) => {
        wrap.remove();
        resolve(v);
      };
      wrap.addEventListener("click", (e) => e.target === wrap && done(false));
      wrap.querySelector("[data-no]").addEventListener("click", () => done(false));
      wrap.querySelector("[data-yes]").addEventListener("click", () => done(true));
      document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") {
          document.removeEventListener("keydown", esc);
          done(false);
        }
      });
      document.body.appendChild(wrap);
      App.drawIcons();
      wrap.querySelector("[data-yes]").focus();
    });
  }

  Object.assign(App, { confirmDialog, pill, StatusBadge, ReviewBadge, StatCards, Avatar, PersonCell, InfoTip, Panel, CARD, BTN, toast, toastNext, showPendingToast });
})((window.App = window.App || {}));
