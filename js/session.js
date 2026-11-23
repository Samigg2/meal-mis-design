/*
 * The signed-in demo user. In the real app this is useAuth() + POST /auth/login;
 * "Keep me signed in" keeps the session after the browser closes, otherwise it
 * lasts for this tab only — the same rule as lib/api/tokens.ts.
 */
(function (App) {
  const { demoAccounts, clusters } = App;

const KEY = "design-session";

function store(keep) {
  try {
    return keep ? localStorage : sessionStorage;
  } catch {
    return null;
  }
}

/** Returns { user } or { error } like the real signIn(). */
function signIn(email, password, keepSignedIn) {
  const user = demoAccounts.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
  );
  if (!user) return { error: "Invalid login credentials" };
  signOut();
  try {
    store(keepSignedIn)?.setItem(KEY, user.id);
  } catch {
    /* storage blocked: the next page asks to sign in again */
  }
  return { user };
}

function currentUser() {
  let id = null;
  try {
    id = sessionStorage.getItem(KEY) ?? localStorage.getItem(KEY);
  } catch {
    id = null;
  }
  return demoAccounts.find((a) => a.id === id) ?? null;
}

function signOut() {
  try {
    sessionStorage.removeItem(KEY);
    localStorage.removeItem(KEY);
  } catch {
    /* nothing stored */
  }
}

/** The user's cluster, or null for a national user (sees every cluster). */
const userCluster = (user) => clusters.find((c) => c.id === user?.clusterId) ?? null;

/** Keeps only the rows the user may see — the real scopeWhere() rule. */
const scoped = (user, rows) =>
  !user?.clusterId ? rows : rows.filter((r) => !r.clusterId || r.clusterId === user.clusterId);

  Object.assign(App, { signIn, currentUser, signOut, userCluster, scoped });
})((window.App = window.App || {}));
