# Crocs · WhatsApp delivery demo

An interactive WhatsApp-style demo of a parcel-delivery journey (pick-up points,
QR collection, review, flash sale, and AI-charm customisation).

**Live page:** served from `index.html` (GitHub Pages).

## Project layout

| File | Purpose |
|------|---------|
| `index.html` | Page markup + bootstrap (the entry point) |
| `styles.css` | All styling |
| `engine.js`  | Generic chat engine — renders any `flow`, reusable across demos |
| `journey.js` | The journey: the `flow` state machine + image paths (edit this) |
| `assets/`    | Images / GIFs |
| `build.js`   | Bundles everything into a single self-contained `crocs-demo.html` |
| `crocs-demo.html` | Built single-file version — works via `file://`, easy to share |

## Editing

Edit `journey.js` (content) / `styles.css` / `engine.js`, then rebuild the
self-contained file:

```
node build.js
```

Open `index.html` over a local server (or the live page) — or open the built
`crocs-demo.html` directly by double-click.

## Journey state shape (`journey.js`)

```js
stateName: {
  m: [ 'message HTML', ... ],          // bot message(s)
  o: [ ['Label', 'nextState'], ... ],  // tappable options
  // ['Label','https://…']            -> external link
  // ['Label','nextState','https://…'] -> link AND advance
  // auto: 'nextState'                 -> auto-advance (optional `delay` ms)
}
```
