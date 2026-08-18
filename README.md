# pitilezard.github.io

Landing page for [pitilezard.github.io](https://pitilezard.github.io) — a topographic sheet
listing everywhere I keep things: trails, radio, code, photographs.

Plain static site. No build, no dependencies.

| File | What it is |
| --- | --- |
| `index.html` | All the content, including every link |
| `styles.css` | Palette, type, layout |
| `contours.js` | The contour background: seeded noise, marching squares, drawn on load |
| `sheet.js` | Scroll reveal for legend entries |

## Run it

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. Opening `index.html` from the filesystem works too.

## Add a link

Copy a card into the right `<section class="entry">` in `index.html` and bump the count in
`entry__code`:

```html
<li class="card">
    <a href="https://example.com/me">
        <span class="card__name">Service</span>
        <span class="card__desc">What I actually do there.</span>
        <span class="card__id">handle or id</span>
    </a>
</li>
```

A whole new section is the same block one level up: symbol SVG, `h2`, code, note, cards.

## Change the terrain

`SEED` at the top of `contours.js`. Any other number is a different set of hills.

## Deploy

GitHub Pages serves `master` from the repository root — push and it is live. (The old
`gh-pages` + `docs/` build is gone; set Pages source to **master / (root)** in the
repository settings if it is still pointing at the branch.)
