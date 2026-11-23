/*
 * Starts a signed-in page: the frame of meal-mis-frontend/src/components/app-shell.tsx
 * (sidebar + top bar + <main>), the sign-in check, the permission check
 * (RequirePermission's "Access restricted"), and re-drawing on a language change.
 *
 *   App.startPage({
 *     active: "/participants",          // which sidebar entry is picked
 *     module: "participants",           // permission needed to see the page
 *     title: "Participants",
 *     trail: [{ label: "Programme data", href }, { label: "Participants" }],
 *     crumbsOnly: false,
 *     tools: (user) => html,            // extra top-bar buttons (optional)
 *     render: (user) => html,           // the page content
 *     bind: (root, user, rerender) => {}// clicks (optional)
 *   })
 *
 * In React this is the _authenticated layout route + AppShell.
 */
(function (App) {
  const { t, icon, currentUser, can, Sidebar, bindSidebar, TopBar, bindTopBar, onLangChange, drawIcons, bindLanguageMenu, ROUTES, asset } = App;

  const MODULE_LABELS = {
    participants: "Participants",
    enterprises: "Enterprises",
    admin: "Administration",
  };

  function restricted(user, module) {
    return `
    <div class="mx-auto flex max-w-md flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
      ${icon("shield-alert", "h-10 w-10 text-muted-foreground")}
      <h2 class="mt-4 text-lg font-medium text-foreground">${t("Access restricted")}</h2>
      <p class="mt-1 text-sm text-muted-foreground">${t("Your role does not grant access to {{module}}. Contact a system administrator if you need it.", { module: t(MODULE_LABELS[module] ?? module) })}</p>
      <a href="${asset("pages/dashboard.html")}" class="mt-6 inline-flex h-9 items-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm hover:bg-accent">${t("Back to dashboard")}</a>
    </div>`;
  }

  function startPage(opts) {
    const user = currentUser();
    if (!user) {
      location.replace(ROUTES.signIn);
      return;
    }
    const app = document.getElementById("app");

    const rerender = () => {
      const scrollY = window.scrollY;
      // superAdminOnly: Roles (admin-nav.tsx); nationalOnly: what only a user with no cluster sets (custom fields).
      const allowed =
        can(user, opts.module, opts.action ?? "read") &&
        (!opts.superAdminOnly || user.role === "super_admin") &&
        (!opts.nationalOnly || !user.clusterId);
      const title = typeof opts.title === "function" ? opts.title(user) : opts.title;
      const trail = typeof opts.trail === "function" ? opts.trail(user) : opts.trail;
      app.innerHTML = `
      <div class="flex min-h-screen w-full bg-background">
        ${Sidebar({ user, active: opts.active })}
        <div class="flex min-w-0 flex-1 flex-col">
          ${TopBar({ user, title, trail, crumbsOnly: opts.crumbsOnly, tools: allowed && opts.tools ? opts.tools(user) : "" })}
          <main class="flex-1 p-4 md:p-6">
            ${allowed ? opts.render(user) : restricted(user, opts.module)}
          </main>
        </div>
      </div>`;
      drawIcons();
      bindLanguageMenu(app);
      bindSidebar(app, rerender);
      bindTopBar(app, user);
      if (allowed) opts.bind?.(app, user, rerender);
      window.scrollTo(0, scrollY);
    };

    rerender();
    onLangChange(rerender);
    return rerender;
  }

  /** The address of a design page, from any page: page("participant.html?id=p-1"). */
  const page = (file) => asset(`pages/${file}`);

  Object.assign(App, { startPage, page });
})((window.App = window.App || {}));
