/*
 * The design's stand-in for the API. Pages read lists through here, never
 * from data.js directly, so swapping in the real API later touches one file.
 *
 *   list("participants", user)  → GET /participants (cluster-scoped)
 *   get("participants", id)     → GET /participants/:id
 *   add("participants", row)    → POST /participants
 *   remove("enterpriseMembers", id) → DELETE …
 *
 * What a visitor adds or removes is kept for this browser tab only
 * (sessionStorage), so a demo never changes the data for the next person.
 */
(function (App) {
  const { scoped } = App;
  const KEY = "design-changes";

  function changes() {
    try {
      return JSON.parse(sessionStorage.getItem(KEY) ?? "{}");
    } catch {
      return {};
    }
  }
  function save(c) {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      /* storage blocked: the change lasts until the page reloads */
    }
  }

  function all(name) {
    const c = changes()[name] ?? { added: [], removed: [], edited: {} };
    return [...c.added, ...(App[name] ?? [])]
      .filter((r) => !c.removed.includes(r.id))
      .map((r) => (c.edited[r.id] ? { ...r, ...c.edited[r.id] } : r));
  }

  const list = (name, user) => scoped(user, all(name));
  const get = (name, id) => all(name).find((r) => r.id === id) ?? null;

  function add(name, row) {
    const c = changes();
    c[name] ??= { added: [], removed: [], edited: {} };
    c[name].added.unshift(row);
    save(c);
    return row;
  }
  function update(name, id, patch) {
    const c = changes();
    c[name] ??= { added: [], removed: [], edited: {} };
    c[name].edited[id] = { ...(c[name].edited[id] ?? {}), ...patch };
    save(c);
  }
  function remove(name, id) {
    const c = changes();
    c[name] ??= { added: [], removed: [], edited: {} };
    c[name].removed.push(id);
    save(c);
  }
  const newId = (prefix) => `${prefix}-new-${Date.now().toString(36)}`;

  App.store = { list, get, add, update, remove, newId, all };
})((window.App = window.App || {}));
