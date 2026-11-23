/*
 * English / Amharic, the same way as the real app (react-i18next with the
 * English text as the key). In React this becomes useTranslation().
 */
(function (App) {
  const { AM } = App;

const KEY = "lang";
const listeners = new Set();

function read() {
  try {
    return localStorage.getItem(KEY) === "am" ? "am" : "en";
  } catch {
    return "en";
  }
}

let lang = read();
document.documentElement.lang = lang;

const getLang = () => lang;

function setLang(next) {
  lang = next === "am" ? "am" : "en";
  document.documentElement.lang = lang;
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* private window: the choice lasts for this page only */
  }
  listeners.forEach((fn) => fn(lang));
}

/** Runs fn whenever the language changes (pages re-draw themselves). */
const onLangChange = (fn) => listeners.add(fn);

/** t("Welcome back"), t("{{n}} members", { n: 3 }) */
function t(key, vars) {
  // Place names (Oromia, Jimma, Dedo…) come from AM_PLACES, as placeName() does in the real app.
  let text = lang === "am" ? (AM[key] ?? App.AM_PLACES?.[key] ?? key) : key;
  if (vars) for (const [k, v] of Object.entries(vars)) text = text.replaceAll(`{{${k}}}`, String(v));
  return text;
}

  Object.assign(App, { getLang, setLang, onLangChange, t });
})((window.App = window.App || {}));
