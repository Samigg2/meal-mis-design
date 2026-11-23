# PLAN.md — meal-mis-design, phase by phase

Each phase copies the real page from `../meal-mis-frontend`. After each phase
we stop, the user checks it in the browser, then says "go" for the next.
Requirements may change; when they do, update this file first.

Status: ✅ done · 🔄 in progress · ⏳ not started

---

## Phase 1 — Setup + Sign-in ✅

**Built**
- Folder, git repo, `CLAUDE.md`, this plan.
- `css/tokens.css`, `js/tailwind-theme.js` — colours, fonts, radii from `styles.css`.
- `js/data.js` — programme goals, clusters, 3 demo accounts.
- `js/i18n` — `t()`, EN/AM switch remembered in the browser; Amharic copied from `am.ts`.
- `js/session.js` — demo sign-in, Keep me signed in (browser vs. tab), `scoped()`.
- Components: `icon`, `language-menu`, `demo-accounts` (design only).
- `index.html` + `js/pages/login.js` — copy of `routes/auth.tsx`: photo, navy/green
  background, programme badge, tagline, 1M / 94K / 5 goals, partners, "Image by
  Freepik", card (SNV logo, Welcome back, email, password with eye, Keep me signed
  in, Forgot password?, Sign in with spinner, wrong-password message, Public access
  links), footer. Phone layout = glass card over the photo.
- Small "Demo accounts" pill under the card; click opens a short list upward (National, Oromia cluster, Amhara cluster); picking one fills the form.
- `pages/next-phase.html` — for every page not designed yet; shows who is signed in
  and Back to sign in.

**Data**
| Key | Future API |
|---|---|
| `programmeGoals` | fixed text in the real app |
| `clusters` | `GET /admin/clusters` |
| `demoAccounts` | `POST /auth/login` (design only) |

**Done when**: side by side with the real `/auth`, the only difference is the demo
box; each demo account signs in; a wrong password shows the red message; EN/አማ
changes every word.

Every page shows at 110% on computer screens (user choice 2026-11-22, `--page-zoom` in `css/zoom.css`); phones 100%.
Signing in opens the dashboard.
Opens by double-clicking `index.html` (plain scripts on `window.App`, relative paths) and on Vercel.

---

## Phase 2 — App shell: sidebar + top bar ✅

**Copy from**: `components/app-shell.tsx`, `components/app-sidebar.tsx`, the top bar.

**Build**
- `js/components/app-shell.js` — the page frame every signed-in page uses.
- `js/components/sidebar.js` — navy sidebar, logo, the 7 real groups (Overview,
  Programme data, Accountability, Learning, Evidence, Monitoring & reporting,
  System) with their real entries and icons, fold/unfold groups (remembered),
  picked entry in blue, user box at the bottom, collapse on small screens.
- `js/components/top-bar.js` — page title, search, language menu, bell, user menu
  with Sign out.
- Entries not designed: Employment outcomes, Financial inclusion, Material support,
  Training, Partnerships, YSLA & SACCOs, Governance, Institutions, Women
  empowerment, Mentors & networks, SBCC, Feedback, Safeguarding, Action tracker,
  Learning (4), Evidence (4), Monitoring (5), Audit trail, Compliance → Next phase.
- Signed-out visitor on any page → sign-in.

**Data**: `navGroups` (labels, entries, icons, `module`), notifications count.
**Done when**: every entry opens its page or Next phase; the user box shows the
demo user and their cluster; Sign out returns to sign-in.

**Built (2026-11-22/23)**: `js/app.js` (`startPage`: sign-in check, the real
"Access restricted", layout, redraw on language change) instead of a separate
`app-shell.js`; `sidebar.js`, `top-bar.js` (Log out has no confirm, as in the
real app), `nav.js` (groups copied from `app-sidebar.tsx`).

---

## Phase 3 — Executive dashboard ✅

**Copy from**: `routes/_authenticated/dashboard.index.tsx`,
`components/dashboard/views/executive.tsx` and its panels (`kpi-row`, `trend-panel`,
`sector-panel` as "Enterprises by size", `women-led-panel`, `approvals-panel`,
`reach-map-panel`, `top-regions-panel`, `filter-bar`).

**Build**
- `pages/dashboard.html` + `js/pages/dashboard.js`; sign-in now lands here.
- Cards: Participants, Enterprises, Women-led enterprises, Youth (18–35).
- Charts: participants vs enterprises by month, enterprises by size, women-led,
  map of reach by region, top regions, approvals.
- Filter bar (region, period).
- Numbers worked out from the participants/enterprises in `data.js`, through
  `scoped()` — Oromia user sees Oromia numbers only.
- Charts library: the one the real panels use (check before building).

**Data**: `participants`, `enterprises` (shared with phases 4–5), `regions` with
map positions.
**Done when**: National, Oromia and Amhara each see their own numbers.

**Built**: 4 cards, Who we reach, Enterprises by size, Top 5 regions (zones for a
cluster user), registration trend, Women-led, Quick actions (by the role's write
rights), Reach by region map (Leaflet, OpenStreetMap tiles). Top bar: dashboard
picker (other dashboards → Next phase), Filters (Region, Sex, Value chain), More
(Print / PDF, Export CSV → Next phase). Charts are hand-drawn SVG
(`js/components/charts.js`); the real app uses Recharts. Approvals panel left out
(no pending flow in the design).

---

## Phase 4 — Participants ✅

**Copy from**: `routes/_authenticated/participants.index.tsx`, `participants.$id.tsx`,
`participants.new.tsx`, `components/participant-detail/*`, `participant-fields.tsx`,
`people-list.tsx`.

**Build**
- List: stat cards, search, filters (region, zone, woreda, sex, status, priority
  sector, disability), table with paging, status badges (Pending / Approved /
  Rejected), Add participant button.
- Details: header with status, tabs (Details, Documents, Enterprises, Training →
  Next phase where not designed), lined detail rows.
- Registration form: the F01 steps, Fayda check button (opens the design Fayda
  page or Next phase — ask), Ethiopian/Gregorian date by language, errors under
  fields. Saving adds to the list for this visit only.

**Data**: `participants` (~60 rows over both clusters), `lookups` (sex, priority
sectors, education, target status …), `places` (region → zone → woreda → kebele).
**Done when**: Oromia user sees only Oromia participants; a new registration
appears in the list.

**Built**: list (cards, Filters popover: Status, Review, Sex, Disability, Region,
Priority sector; Bulk import / Export CSV → Next phase); page
(`participant.html?id=`) with Overview + Enterprise tabs (others → Next phase),
profile card, ID card with QR, General information, Contact & location,
Programme; form (`participant-new.html`, `?edit=` to edit) with the 5 real steps,
the real error words from `participant-schema.ts`, Ethiopian dates in Amharic.
Verify with Fayida → Next phase.

---

## Phase 5 — Enterprises ✅

**Copy from**: `enterprises.index.tsx`, `enterprises.$id.tsx`, `enterprises.new.tsx`,
`components/enterprise-members.tsx`, `people-picker.tsx`.

**Build**
- List: Size column, Led by filter, Same name flag, search, paging.
- Details: tabs Details, Members, Loans (Next phase), worked-out counts read-only.
- Form: steps; lead + contact person search; size first, then the Members picker
  (enrol style, priority filter, limited by size, "N with the lead" line);
  certificate by registration status; TIN only when formal.

**Data**: `enterprises` (~25), `enterpriseMembers`.
**Done when**: picking members updates women/men counts and the -led answers the
same way as the real system.

**Built**: list (cards, pills Status / Review / Women-led / Led by, Same name
flag); page with Overview + Members tabs (Add members with the people picker,
Remove); form with the 4 real steps. Counts and "-led" are worked out in
`js/lib/enterprise-facts.js`. The lead is a dropdown of approved participants
(the real one is a search box).

---

## Phase 6 — Administration ✅

**Copy from**: `routes/_authenticated/admin.*.tsx`, `components/admin/*`.

**Build** (admin pill tabs as in the real app)
- **Users** — table, role badges, cluster, status; Invite user form.
- **Roles** — role cards, role page with the module × action permission grid.
- **Clusters** — cluster cards, cluster page (regions, users), New cluster.
- **Custom fields** — list per module, add/edit field (type, options, required).
- **Reference data** — lookup lists (sectors, sizes …) with their values, add value.
- Other admin tabs (API keys, Audit, National ID, Registration links, Settings,
  Access) → Next phase.
- Only the National admin sees Administration; cluster users get the real "no
  access" behaviour (check the real route rule).

**Data**: `users`, `roles`, `permissions`, `customFields`, `lookups`.
**Done when**: each of the 5 pages works with the demo data.

**Built**: the 8 real tiles (Registration links, Access, More → Next phase);
Users (+ Invite: one person / many at once), Roles (Super admin only) + role
page (Name, Key, Purpose: the real role page has no grid; the grid is under
Access, next phase), Clusters + cluster page, Custom fields (national only),
Reference data (locations + every lookup list, offer/retire, add, delete).
`permissions` is now the real built-in matrix copied from
`meal-mis-backend/src/common/permissions.ts`, so the two cluster demo users
(monitoring officers) get Access restricted on Administration, as in the real app.

---

## Later (when the user gives the requirements)

Everything now on Next phase, page by page, in the order the user chooses.
Then: turn the design into React + NestJS (see "Turning it into React" in
`CLAUDE.md`).
