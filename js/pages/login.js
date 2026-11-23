/*
 * Sign-in page — a copy of meal-mis-frontend/src/routes/auth.tsx.
 * Same layout, classes, text and motion. The only addition is the Demo
 * accounts box under the card (components/demo-accounts.js).
 *
 * React: this file becomes the AuthPage component; `state` becomes useState,
 * render() becomes the JSX, and signIn() becomes useAuth().signIn.
 */
(function (App) {
  const { programmeGoals, demoAccounts, t, onLangChange, signIn, currentUser, ROUTES, asset, icon, drawIcons, LanguageMenu, bindLanguageMenu, DemoAccounts, bindDemoAccounts } = App;

const AUTH_FONT = "Figtree, 'Noto Sans Ethiopic', system-ui, sans-serif";

// The real INPUT and LABEL classes, already merged with the base Input/Label
// classes the way tailwind-merge does in React.
const INPUT =
  "block h-auto w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 text-sm text-slate-900 shadow-none placeholder:text-slate-400 transition-all duration-200 focus-visible:border-line focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-0 max-lg:border-white/40 max-lg:bg-white/90";
const LABEL =
  "mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-slate-600 max-lg:text-white/90";
const BUTTON =
  "flex h-auto w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-lg border-0 bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-white disabled:[&_svg]:text-slate-400";

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

const state = {
  email: "",
  password: "",
  showPassword: false,
  keepSignedIn: true,
  error: null,
  loading: false,
  demoOpen: false,
};

const app = document.getElementById("app");

function render() {
  const year = new Date().getFullYear();
  const tagline = t("Dignified work in rural|agriculture for young|women in Ethiopia.");
  app.innerHTML = `
  <div class="relative flex min-h-screen w-full flex-col bg-[#061933] antialiased selection:bg-blue-600 selection:text-white lg:flex-row" style="font-family:${AUTH_FONT}">
    <div aria-hidden="true" class="pointer-events-none fixed inset-0"
      style="background: radial-gradient(ellipse 60% 80% at 68% 55%, #1d4a33 0%, #123a2f 35%, #0b2630 65%, #061933 100%)"></div>
    <img src="${asset("assets/auth-hero.webp")}" alt="" aria-hidden="true" decoding="async"
      class="pointer-events-none fixed inset-y-0 left-0 h-full w-full object-cover object-[50%_65%] lg:left-[8%] lg:w-[66%] lg:[mask-image:linear-gradient(to_right,transparent,black_12%,black_72%,transparent)]" />
    <div class="pointer-events-none fixed inset-0 bg-gradient-to-r from-[#061933]/55 via-[#061933]/15 to-transparent"></div>
    <div class="pointer-events-none fixed inset-0 bg-gradient-to-t from-[#061933]/65 via-transparent to-transparent"></div>
    <div class="pointer-events-none fixed inset-0 bg-[#061933]/20 lg:hidden"></div>

    <section class="relative z-10 hidden min-h-screen w-full shrink-0 flex-col justify-between overflow-hidden p-8 text-white sm:p-12 lg:sticky lg:top-0 lg:flex lg:h-screen lg:min-h-0 lg:w-[58%] lg:self-start lg:p-16"
      aria-label="RAYEE II Digital MEAL Programme">
      <div class="z-10 mx-auto mt-auto w-full max-w-2xl pb-4 pt-4 lg:mx-0">
        <div class="auth-enter-1 auth-shimmer relative mb-6 inline-flex items-center gap-2.5 overflow-hidden rounded-full border border-cyan-400/25 bg-cyan-500/10 px-5 py-2.5 text-xs font-semibold tracking-wide text-cyan-300 shadow-[0_0_22px_-2px_rgba(56,189,248,0.35)] backdrop-blur-md sm:text-sm">
          <span class="inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-cyan-400 shadow-[0_0_10px_#38bdf8]"></span>
          <span class="relative z-10 text-base font-extrabold tracking-tight text-cyan-300 drop-shadow-sm sm:text-lg lg:text-xl">${t("RAYEE II Digital MEAL Programme")}</span>
        </div>
        <h1 class="auth-enter-2 mb-10 text-3xl font-extrabold leading-[1.18] tracking-tight text-white drop-shadow-sm sm:text-4xl lg:text-[2.75rem]">
          ${tagline
            .split("|")
            .map((line, i) => `<span class="lg:block">${i > 0 ? " " : ""}${line}</span>`)
            .join("")}
        </h1>
        <ul class="auth-enter-3 flex flex-wrap gap-3 sm:gap-4">
          ${programmeGoals
            .map(
              (g) => `
            <li class="group relative flex cursor-default items-center gap-3.5 overflow-hidden rounded-xl border border-white/20 bg-white/[0.08] px-4 py-3 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-white/[0.14] hover:shadow-[0_12px_28px_-6px_rgba(56,189,248,0.35)]">
              <span class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-400/25 bg-cyan-500/10 text-cyan-300 shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:border-cyan-400/60">
                ${icon(g.icon, "h-4 w-4")}
              </span>
              <div class="text-left leading-none">
                <span class="block text-xl font-black tracking-tight text-white sm:text-2xl">${g.value}</span>
                <span class="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-slate-300">${t(g.label)}</span>
              </div>
            </li>`,
            )
            .join("")}
        </ul>
      </div>
      <footer class="z-10 mt-8 border-t border-white/15 pt-6">
        <p class="mb-4 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-400/90 lg:text-left">${t("In partnership with")}</p>
        <div class="flex items-center justify-center gap-7 lg:justify-start">
          <div class="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/5 px-3.5 py-1.5 shadow-sm backdrop-blur-sm transition-colors hover:border-white/20">
            <div class="flex -space-x-2">
              <span class="inline-block h-5 w-5 rounded-full bg-[#EB001B] opacity-95"></span>
              <span class="inline-block h-5 w-5 rounded-full bg-[#F79E1B] opacity-90 mix-blend-screen"></span>
            </div>
            <div class="text-left leading-tight">
              <span class="block text-xs font-bold tracking-tight text-white">mastercard</span>
              <span class="-mt-0.5 block text-[9.5px] font-medium tracking-wide text-slate-300">foundation</span>
            </div>
          </div>
          <div class="h-6 w-px bg-white/20"></div>
          <img src="${asset("assets/partners/snv.png")}" alt="SNV" class="h-9 w-auto" />
        </div>
        <p class="mt-4 text-center text-[10px] text-slate-400/70 lg:text-left">${t("Image by Freepik")}</p>
      </footer>
    </section>

    <main class="relative z-10 flex min-h-screen w-full flex-col justify-center overflow-hidden p-6 sm:p-10 lg:w-[42%] lg:p-12">
      <div class="z-10 mx-auto my-auto w-full max-w-[360px] py-6">
        <div class="mb-5 text-center lg:hidden">
          <p class="text-lg font-extrabold tracking-tight text-white [text-shadow:0_1px_4px_rgba(0,0,0,.6)]">${t("RAYEE II Digital MEAL Programme")}</p>
          <p class="mt-1 text-xs text-white/90 [text-shadow:0_1px_3px_rgba(0,0,0,.7)]">${tagline.replace(/\|/g, " ")}</p>
        </div>

        <div class="auth-card relative rounded-2xl border border-slate-200 bg-white p-5 shadow-xl max-lg:border-white/30 max-lg:bg-[#061933]/25 max-lg:shadow-2xl max-lg:backdrop-blur-[2px] sm:p-6">
          ${LanguageMenu({
            place: "absolute right-3 top-3",
            size: "h-7 px-2 sm:h-8 sm:px-2.5",
            className: "max-lg:border-white/40 max-lg:bg-white/85",
          })}
          <div class="mb-5 text-center">
            <img src="${asset("assets/partners/snv.png")}" alt="SNV" class="mx-auto mb-3 mt-6 h-11 w-auto sm:mt-0 sm:h-12" />
            <h2 class="text-2xl font-bold tracking-tight text-slate-900 max-lg:text-white max-lg:drop-shadow-sm sm:text-[1.65rem]">${t("Welcome back")}</h2>
            <p class="mt-1.5 text-xs text-slate-500 max-lg:text-slate-100 sm:text-sm">${t("Sign in to access your programme workspace.")}</p>
          </div>

          <form id="signin" class="space-y-3.5" novalidate>
            <div class="space-y-1.5">
              <label for="signin-email" class="${LABEL}">${t("Email address")}</label>
              <div class="group relative rounded-xl shadow-sm">
                ${icon("mail", "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-150 group-focus-within:text-blue-600")}
                <input id="signin-email" name="email" type="email" autocomplete="username" placeholder="name@organization.org" required
                  value="${esc(state.email)}" class="${INPUT} pl-10 pr-3.5" />
              </div>
            </div>
            <div class="space-y-1.5">
              <label for="signin-password" class="${LABEL}">${t("Password")}</label>
              <div class="group relative rounded-xl shadow-sm">
                ${icon("lock", "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors duration-150 group-focus-within:text-blue-600")}
                <input id="signin-password" name="password" type="${state.showPassword ? "text" : "password"}" autocomplete="current-password"
                  placeholder="${t("Enter your password")}" required value="${esc(state.password)}" class="${INPUT} pl-10 pr-10" />
                <button type="button" id="toggle-password" aria-label="${state.showPassword ? t("Hide password") : t("Show password")}"
                  class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 transition hover:text-slate-600 focus:text-blue-600 focus:outline-none">
                  ${icon(state.showPassword ? "eye-off" : "eye", "h-4 w-4")}
                </button>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pb-1 pt-1 text-xs">
              <label class="flex cursor-pointer select-none items-center gap-2 font-medium text-slate-600 max-lg:text-white">
                <button type="button" role="checkbox" id="keep" aria-checked="${state.keepSignedIn}"
                  class="peer grid h-4 w-4 shrink-0 cursor-pointer place-content-center rounded-[3px] border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring ${
                    state.keepSignedIn ? "border-blue-600 bg-blue-600 text-white" : "border-slate-300 max-lg:border-white/70"
                  }">
                  ${state.keepSignedIn ? icon("check", "h-3 w-3", 'stroke-width="3"') : ""}
                </button>
                ${t("Keep me signed in")}
              </label>
              <a href="${ROUTES.nextPhase("Forgot password?")}"
                class="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline max-lg:text-white max-lg:underline max-lg:underline-offset-2">${t("Forgot password?")}</a>
            </div>
            ${state.keepSignedIn ? "" : `<p class="text-xs text-slate-500 max-lg:text-slate-100">${t("You will be signed out when you close this tab.")}</p>`}

            <button type="submit" class="${BUTTON}" ${state.loading ? "disabled" : ""}>
              ${state.loading ? icon("loader-2", "h-4 w-4 animate-spin") : ""}
              ${t("Sign in")}
              ${state.loading ? "" : icon("arrow-right", "h-4 w-4")}
            </button>

            ${
              state.error
                ? `<div role="alert" class="relative w-full rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-900 shadow-sm">
                     <div class="text-sm">${t(state.error)}</div>
                   </div>`
                : ""
            }
          </form>

          <div class="mt-4 border-t border-slate-100 pt-3 text-center max-lg:border-white/25">
            <div class="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 max-lg:text-slate-200">${t("Public access & assistance")}</div>
            <div class="flex flex-col items-center gap-1.5 text-xs text-slate-500 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-2.5 sm:gap-y-1">
              <a href="${ROUTES.nextPhase("Report a concern / feedback")}"
                class="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-blue-600 hover:underline max-lg:text-white">
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-blue-500"></span>${t("Report a concern / feedback")}
              </a>
              <span class="hidden text-slate-300 sm:inline">•</span>
              <a href="${ROUTES.nextPhase("Register as a participant")}"
                class="inline-flex items-center gap-1 text-slate-600 transition-colors hover:text-emerald-600 hover:underline max-lg:text-white">
                <span class="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"></span>${t("Register as a participant")}
              </a>
            </div>
          </div>
        </div>

        ${DemoAccounts(demoAccounts, state.demoOpen)}
      </div>
      <footer class="z-10 py-2 text-center text-xs text-slate-400/90">&copy; ${year} RAYEE II MEAL MIS. ${t("All rights reserved.")}</footer>
    </main>
  </div>`;
  drawIcons();
  bind();
}

/** Keeps the typed values when the page re-draws (language change). */
function keepTyping() {
  state.email = app.querySelector("#signin-email").value;
  state.password = app.querySelector("#signin-password").value;
}

function bind() {
  bindLanguageMenu(app);
  const email = app.querySelector("#signin-email");
  const password = app.querySelector("#signin-password");
  email.addEventListener("input", () => (state.email = email.value));
  password.addEventListener("input", () => (state.password = password.value));

  app.querySelector("#toggle-password").addEventListener("click", () => {
    keepTyping();
    state.showPassword = !state.showPassword;
    render();
    app.querySelector("#signin-password").focus();
  });
  app.querySelector("#keep").addEventListener("click", () => {
    keepTyping();
    state.keepSignedIn = !state.keepSignedIn;
    render();
  });
  bindDemoAccounts(app, {
    onToggle: () => {
      keepTyping();
      state.demoOpen = !state.demoOpen;
      render();
    },
    onPick: (id) => {
      const a = demoAccounts.find((x) => x.id === id);
      Object.assign(state, { email: a.email, password: a.password, error: null, demoOpen: false });
      render();
      app.querySelector("#signin button[type=submit]").focus();
    },
  });
  app.querySelector("#signin").addEventListener("submit", (e) => {
    e.preventDefault();
    keepTyping();
    if (!state.email || !state.password) {
      // The real inputs are `required`: the browser asks for the empty one.
      (state.email ? password : email).reportValidity();
      return;
    }
    state.error = null;
    state.loading = true;
    render();
    // A short wait so the spinner shows, like the real request.
    setTimeout(() => {
      const result = signIn(state.email, state.password, state.keepSignedIn);
      if (result.error) {
        state.loading = false;
        state.error = result.error;
        render();
      } else {
        window.location.assign(ROUTES.afterSignIn);
      }
    }, 600);
  });
}

// Already signed in: go on, like the real page.
if (currentUser()) window.location.replace(ROUTES.afterSignIn);
else {
  render();
  const closeDemo = () => {
    if (!state.demoOpen) return;
    keepTyping();
    state.demoOpen = false;
    render();
  };
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-demo-menu]")) closeDemo();
  });
  document.addEventListener("keydown", (e) => e.key === "Escape" && closeDemo());
  onLangChange(() => {
    keepTyping();
    render();
  });
}
})((window.App = window.App || {}));
