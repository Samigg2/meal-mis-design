/*
 * DESIGN ONLY. Every menu entry or link not designed yet opens this page:
 * pages/next-phase.html?page=<name>. It is removed when the real page exists.
 */
(function (App) {
  const { t, onLangChange, currentUser, signOut, ROUTES, asset, icon, drawIcons, LanguageMenu, bindLanguageMenu } = App;

const app = document.getElementById("app");
const page = new URLSearchParams(location.search).get("page") ?? "";

function render() {
  const user = currentUser();
  app.innerHTML = `
  <div class="flex min-h-screen flex-col bg-background">
    <header class="flex items-center justify-between px-5 py-4">
      <img src="${asset("assets/partners/snv.png")}" alt="SNV" class="h-8 w-auto" />
      ${LanguageMenu()}
    </header>
    <main class="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 pb-16">
      <div class="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl">
        <span class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
          ${icon("hourglass", "h-6 w-6")}
        </span>
        <p class="mt-4 text-[11px] font-semibold uppercase tracking-wider text-brand">${t("Next phase")}</p>
        <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">${page ? t(page) : t("Next phase")}</h1>
        <p class="mt-2 text-sm text-slate-500">${t("This page is designed in the next phase.")}</p>
        ${
          user
            ? `<p class="mt-5 inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                 ${icon(user.clusterId ? "map-pin" : "globe", "h-3.5 w-3.5 text-slate-400")}
                 ${user.fullName} · ${t(user.kind)}
               </p>`
            : ""
        }
        <div class="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button type="button" id="back"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            ${icon("arrow-left", "h-4 w-4")} ${t("Go back")}
          </button>
          ${
            user
              ? `<button type="button" id="signout"
                  class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                  ${icon("log-out", "h-4 w-4")} ${t("Back to sign in")}
                </button>`
              : ""
          }
        </div>
      </div>
    </main>
  </div>`;
  drawIcons();
  bindLanguageMenu(app);
  app.querySelector("#back").addEventListener("click", () =>
    history.length > 1 ? history.back() : location.assign(ROUTES.signIn),
  );
  app.querySelector("#signout")?.addEventListener("click", () => {
    signOut();
    location.assign(ROUTES.signIn);
  });
}

render();
onLangChange(render);
})((window.App = window.App || {}));
