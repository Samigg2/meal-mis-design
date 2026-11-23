# Writes pages/*.html with the shared head and the scripts in dependency order.
# Run from meal-mis-design/:  python3 tools/make-pages.py
# Add a new page to PAGES (name: (title, extra scripts, needs the map)), then run it.
FONTS = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Figtree:wght@400;500;600;700&family=Noto+Sans+Ethiopic:wght@400;500;600;700&display=swap"
CORE = ["js/data.js", "js/i18n/am.js", "js/i18n/am-lookups.js", "js/i18n/index.js", "js/lib/format.js", "js/session.js", "js/store.js", "js/routes.js", "js/nav.js",
        "js/components/icon.js", "js/components/language-menu.js", "js/components/ui.js", "js/components/sidebar.js", "js/components/top-bar.js", "js/app.js"]
FORM = ["js/components/form.js", "js/components/people-picker.js"]
PAGES = {
  "dashboard": ("Dashboard", ["js/components/charts.js"], True),
  "participants": ("Participants", ["js/components/data-table.js"], False),
  "participant": ("Participant", ["js/components/data-table.js", "js/components/detail.js"], False),
  "participant-new": ("New participant", FORM, False),
  "enterprises": ("Enterprises", ["js/lib/enterprise-facts.js", "js/components/data-table.js"], False),
  "enterprise": ("Enterprise", ["js/lib/enterprise-facts.js", "js/components/data-table.js", "js/components/detail.js", "js/components/people-picker.js"], False),
  "enterprise-new": ("New enterprise", ["js/lib/enterprise-facts.js"] + FORM, False),
  "admin": ("Administration", ["js/components/data-table.js", "js/components/admin-nav.js"], False),
  "admin-invite": ("Invite people", ["js/components/admin-nav.js", "js/components/form.js"], False),
  "admin-roles": ("Roles", ["js/components/admin-nav.js", "js/components/data-table.js"], False),
  "admin-role": ("Role", ["js/components/admin-nav.js", "js/components/form.js"], False),
  "admin-clusters": ("Clusters", ["js/components/admin-nav.js", "js/components/data-table.js"], False),
  "admin-cluster": ("Cluster", ["js/components/admin-nav.js", "js/components/form.js"], False),
  "admin-custom-fields": ("Custom fields", ["js/components/admin-nav.js"], False),
  "admin-reference-data": ("Reference data", ["js/components/admin-nav.js"], False),
}
def head(title, base, extra=""):
    return f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title} — RAYEE II MEAL MIS</title>
    <link rel="icon" type="image/svg+xml" href="{base}assets/favicon.svg" />
    <link rel="icon" type="image/png" href="{base}assets/favicon.png" />
    <!-- Same fonts as meal-mis-frontend/index.html -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <!-- Loaded without blocking the page; the text shows in the system font until they arrive -->
    <link href="{FONTS}" rel="stylesheet" media="print" onload="this.media='all'" />
    <link rel="stylesheet" href="{base}css/tokens.css" />
    <link rel="stylesheet" href="{base}css/app.css" />
    <link rel="stylesheet" href="{base}css/zoom.css" />{extra}
    <!-- Theme first, then Tailwind v4 (same as the real app), then Lucide icons; local copies in vendor/ -->
    <script src="{base}js/tailwind-theme.js"></script>
    <script src="{base}vendor/tailwindcss-browser-4.1.11.js"></script>
    <script src="{base}vendor/lucide-0.575.0.min.js"></script>
  </head>'''
def body(base, scripts):
    tags = "\n".join(f'    <script src="{base}{s}"></script>' for s in scripts)
    return f'''
  <body>
    <div id="app"></div>
    <!-- The way back to the folder root, for links and images (js/routes.js) -->
    <script>window.BASE = "{base}";</script>
    <!-- Plain scripts in dependency order (see CLAUDE.md, "How the scripts work"). -->
{tags}
  </body>
</html>
'''
LEAFLET = '''
    <!-- Leaflet for the Reach by region map (the real app uses react-leaflet) -->
    <link rel="stylesheet" href="../vendor/leaflet/leaflet.css" />
    <script src="../vendor/leaflet/leaflet.js"></script>'''
QR = '''
    <!-- QR code on the ID card -->
    <script src="../vendor/qrcode-generator-1.4.4.js"></script>'''
for name, (title, extra, leaflet) in PAGES.items():
    scripts = CORE[:-1] + extra + ["js/app.js", f"js/pages/{name}.js"]
    more = (LEAFLET if leaflet else "") + (QR if name == "participant" else "")
    open(f"pages/{name}.html", "w").write(head(title, "../", more) + body("../", scripts))
# next-phase keeps its small list
np = ["js/data.js", "js/i18n/am.js", "js/i18n/index.js", "js/session.js", "js/routes.js", "js/components/icon.js", "js/components/language-menu.js", "js/pages/next-phase.js"]
open("pages/next-phase.html", "w").write(head("Next phase", "../") + body("../", np))
print("ok", len(PAGES))
