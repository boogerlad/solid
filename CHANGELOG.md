# Changelog

## 0.15.0 - 2019-12-16
A lot fixes and new features:
* Suspense improvements: `SuspenseList`, `useTransition`, trigger on read. Update API, and added `reload` and retry capability. Removed need for `awaitSuspense` by making `Show` and `Switch` control flows `Susepnse` aware.
* Sample all Components. No more fear of nesting Components in JSX expressions. Top level in a Component will always be inert now.
* Support for safe boolean and logical operators. This allows for the same optimization as the `Show` control flow for simple inline JSX conditionals like `<div>{state.count > 5 && <MyComp />}</div>`.
* Removed `transform` from control flow. `selectWhen` and `selectEach` have been updated to more generalized `select` and `selectAll`, used off `forwardRef`.
* Support for non-curried operator forms. All operators now support an accessor first form as well as the functional curried form. Ex `map(() => state.list, item => item)`
* Fix issues with spreading over `children` props.
* Better Type Definitions.

## 0.14.0 - 2019-11-16
v0.14.0 brings changes to the render runtime and `setState` API

* Adds diffing to batched computations to improve update performance
* Supports support for mutable(TypeScript safe) `setState` API inspired by Immer. Function setters in Solid now pass a mutable version of state. Modifying will schedule updates. This form must not return a value. It can still be used immutably simply by returning the new value.
* Changes how `force` and `reconcile` helpers work. They can now be used on nested paths.
* Removes support for multi-path `setState`.

## 0.13.0 - 2019-10-27
v0.13.0 contains large changes to the reactive system and compiler.

The main update is to simplify reactivity by removing computation recycling. While this was a useful feature to avoid unnecessary computation nodes, Solid now uses batching as a different approach to get similar results. Most templating libraries can offer breakneck update speeds without fine grained updates. The real cost of these top down approaches is the need to redo structural reconciliation. The current approach is that different computations will be created for each:
* Dynamic insert expression (any expression between tags)
* Spread operator
* JSX template entry point(Top level tag, Fragment, or Component Children)

To aid in performance simple text inserts the `textContent` binding is now optimized so they can be batched.

In addition there are some improvements to template cloning and SVG handing in SSR.

## 0.12.0 - 2019-10-18

v0.12.0 contains a breaking change to the reactive rendering system

- Removal of explicit dynamic binding, bindings will default to reactive unless impossible to be so (literal, function declaration, simple variable)
- SVG Camelcase attribute Support
- Prettier now supported!

## 0.11.0 - 2019-09-27

v0.11.0 continues to add updates to the reactive system as well as some new features:

- Fix reactivity resolution ordering on downstream conditionals
- Add basic (non-namespaced) SVG support
- Add experimental Server Side Rendering and Client Side Hydration capabilities
- Add Suspense aware control flow transformation (`awaitSuspense`)
- Allow state objects to track functions
- More TypeScript definition improvments and fixes

## 0.10.0 - 2019-08-11

v0.10.0 makes significant changes to the reactive system. Key updates:

- Fixed synchronicity on all hooks/control flows.
- Adds the ability to use comparators on `createMemo`.
- Fixes bugs with nested control flows.
- Fixes bugs with Suspense.
- Update Suspense `delayMs` to `maxDuration` to match React. (Usage of `maxDuration` still experimental)

## 0.9.0 - 2019-07-20

v0.9.0 makes signifigant changes to underlying reconciler.

- New Control Flow
- Removes Custom Directives
- New Functional Operators

## 0.8.0 - 2019-06-14

v0.8.0 brings further improvements in reducing bundle size and optimizations in reactivity. New Features:

- Universal loadResource API
- afterEffects hook
- Switch Control Flow

## 0.7.0 - 2019-05-25

v0.7.0 brings further improvements in tree shaking, Context API including Provide control flow, and suspense helpers for loading Async Components and Data.

This is a breaking change as in order to support this version, Solid has forked S.js the underlying library and now ships with it built in. This means Solid will no longer be compatible other S.js libraries. It is a turning point but enables the powerful new features.

## 0.6.0 - 2019-05-07

v0.6.0 brings a Tree Shakeable runtime. This means when Solid used with JSX the compiler can intelligently only include the code that is being used.

This is a breaking change in that:

- No longer need to import 'r' and selectWhen and selectEach directives have been moved to solid-js from solid-js/dom. You should not need to import from 'solid-js/dom' directly anymore as your compiled code will do it automatically.
- HyperScript and Lit imports have been made the default import now.. ex:

```js
import html from "solid-js/html";
```

- Tidied up the compiled template code. This should make it much nicer to debug when not minified.

## 0.5.0 - 2019-04-14

- Add support for multiple renderers (JSX, Tagged Template Literals, HyperScript). Added direct imports or 'solid-js/dom' alternatives 'solid-js/html' and 'solid-js/h'.
- Reorganized dependencies work.

## 0.4.2 - 2019-03-18

- Add fallbacks for control flow
- Add new Portal Control Flow - This allows nodes to be rendered outside of the component tree with support for satelite ShadowRoots.
- Add new Suspend Control Flow - This renders content to a isolated document and display fallback content in its place until ready. Good for nested Async Data Fetching.
- Default node placeholders to comments (improved text interpolation)
- Added events binding for irregular event names

## 0.4.0 - 2019-02-16

- Rename API to create\_\_ to be semantically correct
- Added implicit event delegation

## 0.3.8 - 2019-01-31

- Add support for HyperScript

## 0.3.7 - 2019-01-16

- Improved data reconciler performance
- Added data reconciler options

## 0.3.4 - 2019-01-04

- Added optional comparator for signals.
- Removed redundant type checks and extra function calls.
- Changed S.js to a dependency instead of a peer dependency.

## 0.3.2 - 2018-12-30

- Separated useSignal getter/setters for clearer more consistent API

## 0.3.1 - 2018-12-29

- Remove operators from core package since are auxilliary with new API.
- Updated JSX Dom Expressions to use new control flow JSX and JSX Fragment support.

## 0.3.0 - 2018-12-25

- New setState API inspired by Falcor paths to handle ranges.
- Reduction in API to remove State object functions and change to explicit methods.
- Expose reconcile method to do deep differences against immutable data sources (previously automatically done for selectors).
- Removed 'from' operators as limited usefulness with new patterns.

## 0.2.0 - 2018-11-13

- Large simplifications to remove inconsistency around wrapping and unwrapping values. State values are always wrapped get, and fully unwrapped on set.
- Updated binding syntax. Dynamic expressions are now bound with an inner parenthesis `{( )}`js
- Removed Immutable State object. May attempt something similar in the future but at this time it wasn't worth the effort trying to attempt both. There are better approaches to Proxy Immutable data structures.
