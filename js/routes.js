/*
 * Every page address in one place. In React these become TanStack Router
 * routes with the same names (/auth, /dashboard, /participants …).
 *
 * Paths are relative so the design opens by double-clicking index.html AND
 * on Vercel. Each HTML page sets window.BASE to the way back to the folder
 * root ("" for index.html, "../" for pages/*.html) before loading the scripts.
 */
(function (App) {
  const BASE = window.BASE ?? "";

  /** A file in the folder, from any page: asset("assets/auth-hero.webp"). */
  const asset = (path) => BASE + path;

  const ROUTES = {
    signIn: BASE + "index.html",
    afterSignIn: BASE + "pages/dashboard.html",
    nextPhase: (page) => `${BASE}pages/next-phase.html?page=${encodeURIComponent(page)}`,
  };

  Object.assign(App, { ROUTES, asset });
})((window.App = window.App || {}));
