# expo-image: no `<img>` in server or static rendering on web

Reproducer for an `expo-image` web bug. Without a `placeholder`, `<Image>` adds its `<img>` in an effect. Effects do not run in server rendering, so a page exported with `web.output: 'static'` (or `'server'`) has an empty image container in its HTML. Crawlers do not see the image, the browser cannot load it before the JavaScript runs (LCP), and the page shifts when it appears.

`app/index.tsx` renders two `<Image>`: one without a transition, one with `transition={500}`.

## Versions

- expo 58.0.19, expo-router 58.0.26, expo-image 58.0.17 (latest)
- react / react-dom 19.3.0, react-native-web 0.21.4
- Bun 1.x (`npm` works too)

## Steps

```sh
bun install
bun run export          # expo export -p web --clear
grep -o '<img[^>]*>' dist/index.html
```

Or serve it and use curl:

```sh
bun run serve           # http://localhost:8099
curl -s http://localhost:8099/ | grep -o '<img[^>]*>'
```

### What you see

No output: the HTML has the two `<div data-expoimage="true" ...>` containers, empty.

### What you expect

Two `<img src="/assets/assets/icon....png" ...>` elements, like a plain `<img>` or React Native's `<Image>` would render.

## With the fix

`fix-patch/expo-image@58.0.17.patch` is the fix of the pull request, applied to the published build (`build/web/AnimationManager.js`).

```sh
bun run fix             # applies the patch to node_modules/expo-image
bun run export
grep -o '<img[^>]*>' dist/index.html    # two <img> elements
bun run unfix           # reverts it
```

In the browser, the image with the transition still fades in: it is rendered with the `cross-dissolve-start` class, and React fires its `onLoad` after hydration, also when the image loaded before the JavaScript.

To test the branch itself instead of the patch, build `packages/expo-image` of the expo repository (`pnpm run build` in it) and copy its `build/` over `node_modules/expo-image/build/`.
