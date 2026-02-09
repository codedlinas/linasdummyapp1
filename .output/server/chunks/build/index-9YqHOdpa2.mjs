import { createUniqueId, useContext, createRenderEffect, onCleanup, createContext } from 'solid-js';

const i = createContext(), d = (t, e, n) => (s({ tag: t, props: e, setting: n, id: createUniqueId(), get name() {
  return e.name || e.property;
} }), null);
function s(t) {
  const e = useContext(i);
  if (!e) throw new Error("<MetaProvider /> should be in the tree");
  createRenderEffect(() => {
    const n = e.addTag(t);
    onCleanup(() => e.removeTag(t, n));
  });
}
const f = (t) => d("title", t, { escape: true, close: true });

export { f };
//# sourceMappingURL=index-9YqHOdpa2.mjs.map
