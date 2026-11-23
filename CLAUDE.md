# CLAUDE.md — meal-mis-design

Guidance for Claude Code when working **inside this folder only**. This is not
the main system: it has its own rules and does not follow
`GubaTech/CLAUDE.md` (backend/frontend). Do not mix the two.

## What this is

A clickable **UI design** of the RAYEE II MEAL MIS web app, shown to the
programme officials through a Vercel link. It is plain HTML, CSS and JS with no
build step. Its job is to show how the system looks and moves **before** the
requirements settle. Later it is turned into the real React app
(`meal-mis-frontend`) and NestJS API (`meal-mis-backend`).

- Web only. No phone app.
- The phase plan, what is done and what is next: **`PLAN.md`**. Read it first.

## Hard rules

1. **Copy the real app, never invent.** Colours, fonts, spacing, classes, icons
   and text come from `../meal-mis-frontend`. When a page exists there, open its
   file (routes/…tsx, components/…tsx) and copy the layout and the classes.
   No made-up headings, slogans, help text or filler.
2. **Design-only things are marked.** Anything that is not in the real app (the
   Demo accounts box, the Next phase page) says `DESIGN ONLY` in its header
   comment, and its words sit under "Design only" in `js/i18n/am.js`.
3. **No data in the pages.** Every name, number, list and option comes from
   `js/data.js`. Pages and components only take data and draw it.
4. **One component per file** in `js/components/`. A component is a function
   that returns an HTML string (like JSX), plus a `bind…(root)` function when it
   needs clicks.
5. **Every word goes through `t()`.** English is the key, the same as the real
   app's `src/locales/am.ts`. Copy the Amharic from there; if a word is not
   there, ask the user instead of making up a translation.
6. **Cluster scoping like the real system.** A national user (no cluster) sees
   everything; a cluster user sees only rows with their `clusterId` (or none).
   Always filter lists with `scoped(user, rows)` from `js/session.js`.
7. **Not designed yet → Next phase.** Any menu entry, tab or link without a
   page goes to `ROUTES.nextPhase("<name>")`.
8. Plan first, wait for the user's "go", stop after each phase so they can
   check it. Short plain answers with one example.
9. Git: no Claude or AI attribution lines in commits.

## Folder layout

```
index.html              sign-in page (the first page Vercel opens)
pages/*.html            one HTML file per page; each loads one js/pages/*.js
css/tokens.css          colour tokens  = :root of meal-mis-frontend/src/styles.css
css/auth.css            sign-in motion = AUTH_CSS of routes/auth.tsx
css/zoom.css            110% on computer screens, every page (phones 100%)
css/app.css             sidebar scroll bar, map layer, print
js/tailwind-theme.js    Tailwind @theme + base layer = styles.css (load BEFORE Tailwind)
js/data.js              ALL sample data; each key = a future API call
js/routes.js            every page address
js/session.js           demo sign-in, current user, scoped()
js/i18n/index.js        t(), getLang(), setLang(), onLangChange()
js/i18n/am.js           Amharic words (English text is the key)
js/i18n/am-lookups.js   Amharic for dropdown values and place names (= am-lookups.ts)
js/lib/*.js             format (numbers, dates, Ethiopian calendar), enterprise-facts
js/store.js             lists + this visitor's changes (sessionStorage) — the future API
js/nav.js               sidebar groups (= app-sidebar.tsx), can(user, module, action)
js/app.js               startPage(): sign-in check, Access restricted, layout
js/components/*.js      one component per file
js/pages/*.js           one file per page: reads data, draws, binds clicks
assets/                 images copied from meal-mis-frontend/public
vendor/                 local copies of Tailwind browser, Lucide, Leaflet, QR code
tools/make-pages.py     writes pages/*.html (same head, scripts in order)
```

Every HTML page loads, in this order: Google Fonts (non-blocking) → `css/*.css` →
`js/tailwind-theme.js` → `vendor/tailwindcss-browser-4.1.11.js` →
`vendor/lucide-0.575.0.min.js` → `window.BASE` → the shared scripts → its page
script. The libraries are kept in `vendor/` (not CDN links) so the design opens
fast and offline; only the fonts and map tiles come from the internet.

Do not hand-write a page's `<head>`/script list: add the page to `PAGES` in
`tools/make-pages.py` and run `python3 tools/make-pages.py` from this folder.
Shared order: data → i18n (am, am-lookups, index) → lib/format → session →
store → routes → nav → components (icon, language-menu, ui, sidebar, top-bar,
then the page's own: data-table, detail, form, people-picker, charts, admin-nav)
→ app.js → the page.

## How the scripts work (no modules — keep it that way)

The design must open by **double-clicking `index.html`** (file://), where
browsers block ES modules. So there are no `import`/`export`:

- Each JS file is wrapped in `(function (App) { … })(window.App = window.App || {});`
- It takes what it needs with `const { t, icon } = App;` (its "imports") and
  ends with `Object.assign(App, { … })` (its "exports").
- The HTML loads files in dependency order (see above). A new file goes into
  `tools/make-pages.py`, after what it needs. A component that loads before
  `app.js` cannot use `App.page` — use `asset("pages/…")`.
- All paths are relative. Each HTML page sets `window.BASE` ("" for
  `index.html`, "../" for `pages/*.html`); JS builds links with `ROUTES` and
  images with `asset("assets/…")`. Never write a path starting with `/`.

## Running it

- Double-click `index.html`, or
- `npx serve .` / `python3 -m http.server 8080` inside the folder.
- Vercel: import the repo, framework "Other", no build command, output = root.

## Turning it into React + NestJS later

| Here | Real app |
|---|---|
| `const { x } = App` / `Object.assign(App, …)` | `import { x } from …` / `export` |
| `js/data.js` key (e.g. `clusters`) | API call named beside it (`GET /admin/clusters`) + a NestJS service |
| `js/components/x.js` | `src/components/x.tsx` (same classes, `class` → `className`) |
| `js/pages/x.js` | `src/routes/x.tsx` (TanStack Router file route) |
| `state` object + `render()` | `useState` + JSX |
| `t()` from `js/i18n` | `useTranslation()`; `am.js` entries go into `src/locales/am.ts` |
| `session.js` `signIn` / `scoped` | `useAuth().signIn` / backend `scopeWhere()` |
| `ROUTES` | router paths |
| `icon("mail")` | `<Mail />` from lucide-react |

Classes in the pages are already merged the way `tailwind-merge` (`cn()`) does
in React, so they can be pasted as they are.
