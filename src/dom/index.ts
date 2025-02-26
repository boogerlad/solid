export * from "./runtime";
export * from "./Suspense";
export * from "./directives";
import { insert, hydration, startSSR } from "./runtime";
import {
  createRoot,
  createMemo,
  onCleanup,
  sample,
  map,
  awaitSuspense
} from "../index.js";

type MountableElement = Element | Document | ShadowRoot | DocumentFragment;

const equalFn = <T>(a: T, b: T) => a === b;

export function render(code: () => any, element: MountableElement): () => void {
  let disposer: () => void;
  createRoot(dispose => {
    disposer = dispose;
    insert(element, code());
  });
  return disposer!;
}

/* istanbul ignore next */
export function renderSSR(
  code: () => any,
  element: MountableElement
): () => void {
  startSSR();
  return render(code, element);
}

/* istanbul ignore next */
export function hydrate(
  code: () => any,
  element: MountableElement
): () => void {
  let disposer: () => void;
  hydration(() => {
    disposer = render(code, element);
  }, element);
  return disposer!;
}

export function wrapCondition<T>(fn: () => T): () => T {
  return createMemo(fn, undefined, equalFn);
}

export function For<T, U>(props: {
  each: T[];
  fallback?: any;
  children: (item: T, index: number) => U;
}) {
  const fallback = "fallback" in props && { fallback: () => props.fallback };
  return createMemo(
    map<T, U>(() => props.each, props.children, fallback ? fallback : undefined)
  );
}

export function Show<T>(props: { when: boolean; fallback?: T; children: T }) {
  const useFallback = "fallback" in props,
    condition = createMemo(() => !!props.when, undefined, equalFn);
  return awaitSuspense(
    createMemo(() =>
      condition()
        ? sample(() => props.children)
        : useFallback
        ? sample(() => props.fallback)
        : undefined
    )
  );
}

export function Switch<T>(props: { fallback?: T; children: any }) {
  let conditions = props.children;
  Array.isArray(conditions) || (conditions = [conditions]);
  const useFallback = "fallback" in props,
    evalConditions = createMemo(
      () => {
        for (let i = 0; i < conditions.length; i++) {
          if (conditions[i].when) return i;
        }
        return -1;
      },
      undefined,
      equalFn
    );
  return awaitSuspense(
    createMemo(() => {
      const index = evalConditions();
      return sample(() =>
        index < 0 ? useFallback && props.fallback : conditions[index].children
      );
    })
  );
}

type MatchProps = { when: boolean; children: any };
export function Match(props: MatchProps) {
  return props;
}

export function Portal(props: {
  mount?: MountableElement;
  useShadow?: boolean;
  ref?: (e: HTMLDivElement) => void;
  children: any;
}) {
  const { useShadow } = props,
    container = document.createElement("div"),
    marker = document.createTextNode(""),
    mount = props.mount || document.body,
    renderRoot =
      useShadow && container.attachShadow
        ? container.attachShadow({ mode: "open" })
        : container;

  Object.defineProperty(container, "host", {
    get() {
      return marker.parentNode;
    }
  });
  insert(
    renderRoot,
    sample(() => props.children)
  );
  mount.appendChild(container);
  props.ref && props.ref(container);
  onCleanup(() => mount.removeChild(container));
  return marker;
}
