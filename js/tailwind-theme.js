/*
 * Tailwind theme for the design pages (a classic script, loaded in <head>
 * BEFORE the Tailwind CDN script). It is the "@theme inline" and "@layer base"
 * blocks of meal-mis-frontend/src/styles.css, so the same class names
 * (bg-brand, text-ink, font-heading, rounded-xl …) work here and in React.
 * The colour values themselves live in css/tokens.css.
 */
(function () {
  const css = `
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-ink-faint: var(--ink-faint);
  --color-line: var(--line);
  --color-line-soft: var(--line-soft);
  --color-surface-subtle: var(--surface-subtle);
  --color-surface-sunken: var(--surface-sunken);
  --color-brand: var(--brand);
  --color-brand-hover: var(--brand-hover);
  --color-brand-soft: var(--brand-soft);
  --color-danger: var(--danger);

  --color-banner: var(--banner);
  --color-banner-accent: var(--banner-accent);
  --color-banner-muted: var(--banner-muted);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-heading: "Plus Jakarta Sans", "Noto Sans Ethiopic", system-ui, sans-serif;
  --font-body: "Inter", "Noto Sans Ethiopic", system-ui, -apple-system, "Segoe UI", sans-serif;
}

@layer base {
  * { border-color: var(--color-border); }
  body {
    background-color: var(--color-background);
    color: var(--color-foreground);
    font-family: var(--font-body);
    font-feature-settings: "rlig" 1, "calt" 1;
    text-align: left;
  }
  h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
  button { cursor: pointer; }
}
`;
  const style = document.createElement("style");
  style.type = "text/tailwindcss";
  style.textContent = css;
  document.head.appendChild(style);
})();
