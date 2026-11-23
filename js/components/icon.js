/*
 * Icons are Lucide, the same set as the real app (lucide-react). Write
 * icon("mail", "h-4 w-4") in a template, then call drawIcons() after the
 * HTML is on the page. In React: <Mail className="h-4 w-4" />.
 */
(function (App) {
const icon = (name, className = "h-4 w-4", extra = "") =>
  `<i data-lucide="${name}" class="${className}" aria-hidden="true" ${extra}></i>`;

function drawIcons() {
  window.lucide?.createIcons();
}

  Object.assign(App, { icon, drawIcons });
})((window.App = window.App || {}));
