/*
 * The sidebar menu — a copy of NAV_GROUPS in
 * meal-mis-frontend/src/components/app-sidebar.tsx (same groups, names, icons
 * and permission modules). `page` is the design page; entries without one
 * open Next phase.
 */
(function (App) {
  const NAV_GROUPS = [
    { label: "Overview", items: [{ name: "Dashboard", href: "/dashboard", icon: "layout-dashboard", page: "pages/dashboard.html" }] },
    {
      label: "Programme data",
      items: [
        { name: "Participants", href: "/participants", icon: "users", module: "participants", page: "pages/participants.html" },
        { name: "Enterprises", href: "/enterprises", icon: "building-2", module: "enterprises", page: "pages/enterprises.html" },
        { name: "Employment outcomes", href: "/participants/employment", icon: "briefcase", module: "employment" },
        { name: "Financial inclusion", href: "/finance/loans", icon: "banknote", module: "finance" },
        { name: "Material support", href: "/material", icon: "package", module: "material" },
        { name: "Training", href: "/training", icon: "graduation-cap", module: "training" },
        { name: "Partnerships", href: "/partnerships", icon: "landmark", module: "partnerships" },
        { name: "YSLA & SACCOs", href: "/finance/ysla", icon: "users-round", module: "ysla" },
        { name: "Governance", href: "/governance", icon: "gavel", module: "governance" },
        { name: "Institutions", href: "/governance/institutions", icon: "building", module: "institutions" },
        { name: "Women empowerment", href: "/empowerment", icon: "heart-handshake", module: "empowerment" },
        { name: "Mentors & networks", href: "/empowerment/networks", icon: "network", module: "empowerment" },
        { name: "SBCC activities", href: "/sbcc", icon: "megaphone", module: "sbcc" },
      ],
    },
    {
      label: "Accountability",
      items: [
        { name: "Feedback", href: "/feedback", icon: "message-square", module: "feedback" },
        { name: "Safeguarding", href: "/safeguarding", icon: "shield", module: "safeguarding" },
        { name: "Action tracker", href: "/actions", icon: "list-checks", module: "actions" },
      ],
    },
    {
      label: "Learning",
      items: [
        { name: "Lessons learned", href: "/learning", icon: "lightbulb", module: "learning" },
        { name: "Knowledge library", href: "/learning/knowledge", icon: "book-open", module: "learning" },
        { name: "Learning agenda", href: "/learning/agenda", icon: "circle-help", module: "learning" },
        { name: "Reflection meetings", href: "/learning/meetings", icon: "users-round", module: "learning" },
      ],
    },
    {
      label: "Evidence",
      items: [
        { name: "Evaluations", href: "/evaluations", icon: "file-search", module: "evaluations" },
        { name: "Surveys", href: "/surveys", icon: "clipboard-list", module: "surveys" },
        { name: "GIS map", href: "/surveys/map", icon: "map", module: "surveys" },
        { name: "Waiting to send", href: "/surveys/offline", icon: "cloud-off", module: "surveys" },
      ],
    },
    {
      label: "Monitoring & reporting",
      items: [
        { name: "Monitoring & KPIs", href: "/monitoring", icon: "gauge", module: "monitoring" },
        { name: "Indicator register", href: "/monitoring/register", icon: "target", module: "monitoring" },
        { name: "Performance table", href: "/monitoring/performance", icon: "file-spreadsheet", module: "monitoring" },
        { name: "Workplan", href: "/monitoring/workplan", icon: "calendar-range", module: "monitoring" },
        { name: "Reports", href: "/reports", icon: "file-text", module: "reports" },
      ],
    },
    {
      label: "System",
      items: [
        { name: "Administration", href: "/admin", icon: "settings", module: "admin", page: "pages/admin.html" },
        { name: "Audit trail", href: "/admin/audit", icon: "history", module: "audit" },
        { name: "Compliance", href: "/compliance", icon: "shield-check", module: "admin" },
      ],
    },
  ];

  /** What a role may do — the real can(module, action). */
  const can = (user, module, action = "read") =>
    !module || (App.permissions[user?.role]?.[module] ?? []).includes(action);

  /** The address an entry opens in the design. */
  const navLink = (item) => (item.page ? App.asset(item.page) : App.ROUTES.nextPhase(item.name));

  Object.assign(App, { NAV_GROUPS, can, navLink });
})((window.App = window.App || {}));
