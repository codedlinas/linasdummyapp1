import { createComponent, ssr, ssrHydrationKey, ssrStyleProperty, isServer, getRequestEvent, delegateEvents } from 'solid-js/web';
import { x as xt } from '../nitro/nitro.mjs';
import { Suspense, createSignal, onCleanup, children, createMemo, getOwner, createRenderEffect, on, useContext, runWithOwner, createContext, untrack, Show, createRoot, startTransition, resetErrorBoundaries, batch, createComponent as createComponent$1 } from 'solid-js';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:async_hooks';
import 'vinxi/lib/invariant';
import 'vinxi/lib/path';
import 'node:url';
import 'seroval';
import 'seroval-plugins/web';
import 'solid-js/web/storage';

function te() {
  let e = /* @__PURE__ */ new Set();
  function n(t) {
    return e.add(t), () => e.delete(t);
  }
  let o = false;
  function r(t, a) {
    if (o) return !(o = false);
    const s = { to: t, options: a, defaultPrevented: false, preventDefault: () => s.defaultPrevented = true };
    for (const c of e) c.listener({ ...s, from: c.location, retry: (f) => {
      f && (o = true), c.navigate(t, { ...a, resolve: false });
    } });
    return !s.defaultPrevented;
  }
  return { subscribe: n, confirm: r };
}
let K;
function H() {
  (!window.history.state || window.history.state._depth == null) && window.history.replaceState({ ...window.history.state, _depth: window.history.length - 1 }, ""), K = window.history.state._depth;
}
isServer || H();
function Oe(e) {
  return { ...e, _depth: window.history.state && window.history.state._depth };
}
function Ue(e, n) {
  let o = false;
  return () => {
    const r = K;
    H();
    const t = r == null ? null : K - r;
    if (o) {
      o = false;
      return;
    }
    t && n(t) ? (o = true, window.history.go(-t)) : e();
  };
}
const ke = /^(?:[a-z0-9]+:)?\/\//i, Fe = /^\/+|(\/)\/+$/g, ne = "http://sr";
function I(e, n = false) {
  const o = e.replace(Fe, "$1");
  return o ? n || /^[?#]/.test(o) ? o : "/" + o : "";
}
function _(e, n, o) {
  if (ke.test(n)) return;
  const r = I(e), t = o && I(o);
  let a = "";
  return !t || n.startsWith("/") ? a = r : t.toLowerCase().indexOf(r.toLowerCase()) !== 0 ? a = r + t : a = t, (a || "/") + I(n, !a);
}
function qe(e, n) {
  return I(e).replace(/\/*(\*.*)?$/g, "") + I(n);
}
function re(e) {
  const n = {};
  return e.searchParams.forEach((o, r) => {
    n[r] = o;
  }), n;
}
function De(e, n, o) {
  const [r, t] = e.split("/*", 2), a = r.split("/").filter(Boolean), s = a.length;
  return (c) => {
    const f = c.split("/").filter(Boolean), i = f.length - s;
    if (i < 0 || i > 0 && t === void 0 && !n) return null;
    const m = { path: s ? "" : "/", params: {} }, v = (w) => o === void 0 ? void 0 : o[w];
    for (let w = 0; w < s; w++) {
      const p = a[w], P = f[w], u = p[0] === ":", l = u ? p.slice(1) : p;
      if (u && W(P, v(l))) m.params[l] = P;
      else if (u || !W(P, p)) return null;
      m.path += `/${P}`;
    }
    if (t) {
      const w = i ? f.slice(-i).join("/") : "";
      if (W(w, v(t))) m.params[t] = w;
      else return null;
    }
    return m;
  };
}
function W(e, n) {
  const o = (r) => r.localeCompare(e, void 0, { sensitivity: "base" }) === 0;
  return n === void 0 ? true : typeof n == "string" ? o(n) : typeof n == "function" ? n(e) : Array.isArray(n) ? n.some(o) : n instanceof RegExp ? n.test(e) : false;
}
function Ie(e) {
  const [n, o] = e.pattern.split("/*", 2), r = n.split("/").filter(Boolean);
  return r.reduce((t, a) => t + (a.startsWith(":") ? 2 : 3), r.length - (o === void 0 ? 0 : 1));
}
function oe(e) {
  const n = /* @__PURE__ */ new Map(), o = getOwner();
  return new Proxy({}, { get(r, t) {
    return n.has(t) || runWithOwner(o, () => n.set(t, createMemo(() => e()[t]))), n.get(t)();
  }, getOwnPropertyDescriptor() {
    return { enumerable: true, configurable: true };
  }, ownKeys() {
    return Reflect.ownKeys(e());
  } });
}
function ae(e) {
  let n = /(\/?\:[^\/]+)\?/.exec(e);
  if (!n) return [e];
  let o = e.slice(0, n.index), r = e.slice(n.index + n[0].length);
  const t = [o, o += n[1]];
  for (; n = /^(\/\:[^\/]+)\?/.exec(r); ) t.push(o += n[1]), r = r.slice(n[0].length);
  return ae(r).reduce((a, s) => [...a, ...t.map((c) => c + s)], []);
}
const je = 100, Be = createContext(), se = createContext();
function _e(e, n = "") {
  const { component: o, load: r, children: t, info: a } = e, s = !t || Array.isArray(t) && !t.length, c = { key: e, component: o, load: r, info: a };
  return ie(e.path).reduce((f, i) => {
    for (const m of ae(i)) {
      const v = qe(n, m);
      let w = s ? v : v.split("/*", 1)[0];
      w = w.split("/").map((p) => p.startsWith(":") || p.startsWith("*") ? p : encodeURIComponent(p)).join("/"), f.push({ ...c, originalPath: i, pattern: w, matcher: De(w, !s, e.matchFilters) });
    }
    return f;
  }, []);
}
function $e(e, n = 0) {
  return { routes: e, score: Ie(e[e.length - 1]) * 1e4 - n, matcher(o) {
    const r = [];
    for (let t = e.length - 1; t >= 0; t--) {
      const a = e[t], s = a.matcher(o);
      if (!s) return null;
      r.unshift({ ...s, route: a });
    }
    return r;
  } };
}
function ie(e) {
  return Array.isArray(e) ? e : [e];
}
function ce(e, n = "", o = [], r = []) {
  const t = ie(e);
  for (let a = 0, s = t.length; a < s; a++) {
    const c = t[a];
    if (c && typeof c == "object") {
      c.hasOwnProperty("path") || (c.path = "");
      const f = _e(c, n);
      for (const i of f) {
        o.push(i);
        const m = Array.isArray(c.children) && c.children.length === 0;
        if (c.children && !m) ce(c.children, i.pattern, o, r);
        else {
          const v = $e([...o], r.length);
          r.push(v);
        }
        o.pop();
      }
    }
  }
  return o.length ? r : r.sort((a, s) => s.score - a.score);
}
function j(e, n) {
  for (let o = 0, r = e.length; o < r; o++) {
    const t = e[o].matcher(n);
    if (t) return t;
  }
  return [];
}
function Te(e, n) {
  const o = new URL(ne), r = createMemo((f) => {
    const i = e();
    try {
      return new URL(i, o);
    } catch {
      return console.error(`Invalid path ${i}`), f;
    }
  }, o, { equals: (f, i) => f.href === i.href }), t = createMemo(() => r().pathname), a = createMemo(() => r().search, true), s = createMemo(() => r().hash), c = () => "";
  return { get pathname() {
    return t();
  }, get search() {
    return a();
  }, get hash() {
    return s();
  }, get state() {
    return n();
  }, get key() {
    return c();
  }, query: oe(on(a, () => re(r()))) };
}
let O;
function We() {
  return O;
}
function Ke(e, n, o, r = {}) {
  const { signal: [t, a], utils: s = {} } = e, c = s.parsePath || ((h) => h), f = s.renderPath || ((h) => h), i = s.beforeLeave || te(), m = _("", r.base || "");
  if (m === void 0) throw new Error(`${m} is not a valid base path`);
  m && !t().value && a({ value: m, replace: true, scroll: false });
  const [v, w] = createSignal(false);
  let p;
  const P = (h, y) => {
    y.value === u() && y.state === g() || (p === void 0 && w(true), O = h, p = y, startTransition(() => {
      p === y && (l(p.value), d(p.state), resetErrorBoundaries(), isServer || A[1]([]));
    }).finally(() => {
      p === y && batch(() => {
        O = void 0, h === "navigate" && de(p), w(false), p = void 0;
      });
    }));
  }, [u, l] = createSignal(t().value), [g, d] = createSignal(t().state), U = Te(u, g), S = [], A = createSignal(isServer ? pe() : []), F = createMemo(() => typeof r.transformUrl == "function" ? j(n(), r.transformUrl(U.pathname)) : j(n(), U.pathname)), le = oe(() => {
    const h = F(), y = {};
    for (let R = 0; R < h.length; R++) Object.assign(y, h[R].params);
    return y;
  }), M = { pattern: m, path: () => m, outlet: () => null, resolvePath(h) {
    return _(m, h);
  } };
  return createRenderEffect(on(t, (h) => P("native", h), { defer: true })), { base: M, location: U, params: le, isRouting: v, renderPath: f, parsePath: c, navigatorFactory: he, matches: F, beforeLeave: i, preloadRoute: me, singleFlight: r.singleFlight === void 0 ? true : r.singleFlight, submissions: A };
  function fe(h, y, R) {
    untrack(() => {
      if (typeof y == "number") {
        y && (s.go ? s.go(y) : console.warn("Router integration does not support relative routing"));
        return;
      }
      const { replace: B, resolve: T, scroll: C, state: q } = { replace: false, resolve: true, scroll: true, ...R }, E = T ? h.resolvePath(y) : _("", y);
      if (E === void 0) throw new Error(`Path '${y}' is not a routable path`);
      if (S.length >= je) throw new Error("Too many redirects");
      const z = u();
      if (E !== z || q !== g()) if (isServer) {
        const V = getRequestEvent();
        V && (V.response = { status: 302, headers: new Headers({ Location: E }) }), a({ value: E, replace: B, scroll: C, state: q });
      } else i.confirm(E, R) && (S.push({ value: z, replace: B, scroll: C, state: g() }), P("navigate", { value: E, state: q }));
    });
  }
  function he(h) {
    return h = h || useContext(se) || M, (y, R) => fe(h, y, R);
  }
  function de(h) {
    const y = S[0];
    y && (a({ ...h, replace: y.replace, scroll: y.scroll }), S.length = 0);
  }
  function me(h, y = {}) {
    const R = j(n(), h.pathname), B = O;
    O = "preload";
    for (let T in R) {
      const { route: C, params: q } = R[T];
      C.component && C.component.preload && C.component.preload();
      const { load: E } = C;
      y.preloadData && E && runWithOwner(o(), () => E({ params: q, location: { pathname: h.pathname, search: h.search, hash: h.hash, query: re(h), state: null, key: "" }, intent: "preload" }));
    }
    O = B;
  }
  function pe() {
    const h = getRequestEvent();
    return h && h.router && h.router.submission ? [h.router.submission] : [];
  }
}
function Ne(e, n, o, r) {
  const { base: t, location: a, params: s } = e, { pattern: c, component: f, load: i } = r().route, m = createMemo(() => r().path);
  f && f.preload && f.preload();
  const v = i ? i({ params: s, location: a, intent: O || "initial" }) : void 0;
  return { parent: n, pattern: c, path: m, outlet: () => f ? createComponent$1(f, { params: s, location: a, data: v, get children() {
    return o();
  } }) : o(), resolvePath(p) {
    return _(t.path(), p, m());
  } };
}
const ue = (e) => (n) => {
  const { base: o } = n, r = children(() => n.children), t = createMemo(() => ce(r(), n.base || ""));
  let a;
  const s = Ke(e, t, () => a, { base: o, singleFlight: n.singleFlight, transformUrl: n.transformUrl });
  return e.create && e.create(s), createComponent(Be.Provider, { value: s, get children() {
    return createComponent(He, { routerState: s, get root() {
      return n.root;
    }, get load() {
      return n.rootLoad;
    }, get children() {
      return [(a = getOwner()) && null, createComponent(Me, { routerState: s, get branches() {
        return t();
      } })];
    } });
  } });
};
function He(e) {
  const n = e.routerState.location, o = e.routerState.params, r = createMemo(() => e.load && untrack(() => {
    e.load({ params: o, location: n, intent: We() || "initial" });
  }));
  return createComponent(Show, { get when() {
    return e.root;
  }, keyed: true, get fallback() {
    return e.children;
  }, children: (t) => createComponent(t, { params: o, location: n, get data() {
    return r();
  }, get children() {
    return e.children;
  } }) });
}
function Me(e) {
  if (isServer) {
    const t = getRequestEvent();
    if (t && t.router && t.router.dataOnly) {
      ze(t, e.routerState, e.branches);
      return;
    }
    t && ((t.router || (t.router = {})).matches || (t.router.matches = e.routerState.matches().map(({ route: a, path: s, params: c }) => ({ path: a.originalPath, pattern: a.pattern, match: s, params: c, info: a.info }))));
  }
  const n = [];
  let o;
  const r = createMemo(on(e.routerState.matches, (t, a, s) => {
    let c = a && t.length === a.length;
    const f = [];
    for (let i = 0, m = t.length; i < m; i++) {
      const v = a && a[i], w = t[i];
      s && v && w.route.key === v.route.key ? f[i] = s[i] : (c = false, n[i] && n[i](), createRoot((p) => {
        n[i] = p, f[i] = Ne(e.routerState, f[i - 1] || e.routerState.base, J(() => r()[i + 1]), () => e.routerState.matches()[i]);
      }));
    }
    return n.splice(t.length).forEach((i) => i()), s && c ? s : (o = f[0], f);
  }));
  return J(() => r() && o)();
}
const J = (e) => () => createComponent(Show, { get when() {
  return e();
}, keyed: true, children: (n) => createComponent(se.Provider, { value: n, get children() {
  return n.outlet();
} }) });
function ze(e, n, o) {
  const r = new URL(e.request.url), t = j(o, new URL(e.router.previousUrl || e.request.url).pathname), a = j(o, r.pathname);
  for (let s = 0; s < a.length; s++) {
    (!t[s] || a[s].route !== t[s].route) && (e.router.dataOnly = true);
    const { route: c, params: f } = a[s];
    c.load && c.load({ params: f, location: n.location, intent: "preload" });
  }
}
function Ve([e, n], o, r) {
  return [e, r ? (t) => n(r(t)) : n];
}
function Je(e) {
  if (e === "#") return null;
  try {
    return document.querySelector(e);
  } catch {
    return null;
  }
}
function Xe(e) {
  let n = false;
  const o = (t) => typeof t == "string" ? { value: t } : t, r = Ve(createSignal(o(e.get()), { equals: (t, a) => t.value === a.value && t.state === a.state }), void 0, (t) => (!n && e.set(t), t));
  return e.init && onCleanup(e.init((t = e.get()) => {
    n = true, r[1](o(t)), n = false;
  })), ue({ signal: r, create: e.create, utils: e.utils });
}
function Ge(e, n, o) {
  return e.addEventListener(n, o), () => e.removeEventListener(n, o);
}
function Qe(e, n) {
  const o = Je(`#${e}`);
  o ? o.scrollIntoView() : n && window.scrollTo(0, 0);
}
function Ye(e) {
  const n = new URL(e);
  return n.pathname + n.search;
}
function Ze(e) {
  let n;
  const o = e.url || (n = getRequestEvent()) && Ye(n.request.url) || "", r = { value: e.transformUrl ? e.transformUrl(o) : o };
  return ue({ signal: [() => r, (t) => Object.assign(r, t)] })(e);
}
const et = /* @__PURE__ */ new Map();
function tt(e = true, n = false, o = "/_server", r) {
  return (t) => {
    const a = t.base.path(), s = t.navigatorFactory(t.base);
    let c = {};
    function f(u) {
      return u.namespaceURI === "http://www.w3.org/2000/svg";
    }
    function i(u) {
      if (u.defaultPrevented || u.button !== 0 || u.metaKey || u.altKey || u.ctrlKey || u.shiftKey) return;
      const l = u.composedPath().find((F) => F instanceof Node && F.nodeName.toUpperCase() === "A");
      if (!l || n && !l.hasAttribute("link")) return;
      const g = f(l), d = g ? l.href.baseVal : l.href;
      if ((g ? l.target.baseVal : l.target) || !d && !l.hasAttribute("state")) return;
      const S = (l.getAttribute("rel") || "").split(/\s+/);
      if (l.hasAttribute("download") || S && S.includes("external")) return;
      const A = g ? new URL(d, document.baseURI) : new URL(d);
      if (!(A.origin !== window.location.origin || a && A.pathname && !A.pathname.toLowerCase().startsWith(a.toLowerCase()))) return [l, A];
    }
    function m(u) {
      const l = i(u);
      if (!l) return;
      const [g, d] = l, U = t.parsePath(d.pathname + d.search + d.hash), S = g.getAttribute("state");
      u.preventDefault(), s(U, { resolve: false, replace: g.hasAttribute("replace"), scroll: !g.hasAttribute("noscroll"), state: S && JSON.parse(S) });
    }
    function v(u) {
      const l = i(u);
      if (!l) return;
      const [g, d] = l;
      typeof r == "function" && (d.pathname = r(d.pathname)), c[d.pathname] || t.preloadRoute(d, { preloadData: g.getAttribute("preload") !== "false" });
    }
    function w(u) {
      const l = i(u);
      if (!l) return;
      const [g, d] = l;
      typeof r == "function" && (d.pathname = r(d.pathname)), !c[d.pathname] && (c[d.pathname] = setTimeout(() => {
        t.preloadRoute(d, { preloadData: g.getAttribute("preload") !== "false" }), delete c[d.pathname];
      }, 200));
    }
    function p(u) {
      const l = i(u);
      if (!l) return;
      const [, g] = l;
      typeof r == "function" && (g.pathname = r(g.pathname)), c[g.pathname] && (clearTimeout(c[g.pathname]), delete c[g.pathname]);
    }
    function P(u) {
      if (u.defaultPrevented) return;
      let l = u.submitter && u.submitter.hasAttribute("formaction") ? u.submitter.getAttribute("formaction") : u.target.getAttribute("action");
      if (!l) return;
      if (!l.startsWith("https://action/")) {
        const d = new URL(l, ne);
        if (l = t.parsePath(d.pathname + d.search), !l.startsWith(o)) return;
      }
      if (u.target.method.toUpperCase() !== "POST") throw new Error("Only POST forms are supported for Actions");
      const g = et.get(l);
      if (g) {
        u.preventDefault();
        const d = new FormData(u.target);
        u.submitter && u.submitter.name && d.append(u.submitter.name, u.submitter.value), g.call({ r: t, f: u.target }, d);
      }
    }
    delegateEvents(["click", "submit"]), document.addEventListener("click", m), e && (document.addEventListener("mouseover", w), document.addEventListener("mouseout", p), document.addEventListener("focusin", v), document.addEventListener("touchstart", v)), document.addEventListener("submit", P), onCleanup(() => {
      document.removeEventListener("click", m), e && (document.removeEventListener("mouseover", w), document.removeEventListener("mouseout", p), document.removeEventListener("focusin", v), document.removeEventListener("touchstart", v)), document.removeEventListener("submit", P);
    });
  };
}
function nt(e) {
  if (isServer) return Ze(e);
  const n = () => {
    const r = window.location.pathname + window.location.search;
    return { value: e.transformUrl ? e.transformUrl(r) + window.location.hash : r + window.location.hash, state: window.history.state };
  }, o = te();
  return Xe({ get: n, set({ value: r, replace: t, scroll: a, state: s }) {
    t ? window.history.replaceState(Oe(s), "", r) : window.history.pushState(s, "", r), Qe(decodeURIComponent(window.location.hash.slice(1)), a), H();
  }, init: (r) => Ge(window, "popstate", Ue(r, (t) => {
    if (t && t < 0) return !o.confirm(t);
    {
      const a = n();
      return !o.confirm(a.value, { state: a.state });
    }
  })), create: tt(e.preload, e.explicitLinks, e.actionBase, e.transformUrl), utils: { go: (r) => window.history.go(r), beforeLeave: o } })(e);
}
var rt = ["<nav", ' style="', '"><div style="', '"><a href="/" style="', '">Home</a><a href="/features" style="', '">Features</a><a href="/contact" style="', '">Contact</a></div></nav>'];
function pt() {
  return createComponent(nt, { root: (e) => [ssr(rt, ssrHydrationKey(), ssrStyleProperty("background:", "linear-gradient(135deg, #c77a5a 0%, #a0522d 100%)") + ssrStyleProperty(";padding:", "1rem 2rem") + ssrStyleProperty(";box-shadow:", "0 2px 8px rgba(0,0,0,0.15)"), ssrStyleProperty("max-width:", "1200px") + ssrStyleProperty(";margin:", "0 auto") + ssrStyleProperty(";display:", "flex") + ssrStyleProperty(";gap:", "2rem") + ssrStyleProperty(";align-items:", "center"), ssrStyleProperty("color:", "#faf6f1") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-weight:", "600") + ssrStyleProperty(";font-size:", "1.25rem"), ssrStyleProperty("color:", "#faf6f1") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-weight:", "500"), ssrStyleProperty("color:", "#faf6f1") + ssrStyleProperty(";text-decoration:", "none") + ssrStyleProperty(";font-weight:", "500")), createComponent(Suspense, { get children() {
    return e.children;
  } })], get children() {
    return createComponent(xt, {});
  } });
}

export { pt as default };
//# sourceMappingURL=app-Pu6v3RqB.mjs.map
