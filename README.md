# Still Sonic Media — stillsonicmedia.co.uk

_Last maintenance pass: 5 July 2026._

Photography portfolio site for Campbell Downie. Hosted free on **GitHub Pages**:
every commit to `main` automatically deploys to https://stillsonicmedia.co.uk
(custom domain set by the `CNAME` file) within a minute or two.

## How the site is organised

```
├── index.html          Home — hero, project cards, featured gallery, vlogs carousel,
│                       about & contact. This is the front door; every page links back here.
├── concert.html        Project pages, one per gallery. Each is self-contained
├── jimbo.html          (own <style> block) and linked from the project cards
├── scotland.html       on the home page.
├── tunisia.html
├── cleethorpes.html
├── florida.html
├── blog.html           Blog list — filter by Photos / Words / Stories
├── post.html           Single blog post page (post.html?p=<slug>)
├── blog-posts.js       All blog posts live here — edit this file to add one
├── blog.css            Styles for the two blog pages
├── book.html           Booking page — pricing tiers + enquiry form (Formspree,
│                       submissions arrive by email). Linked from the home nav.
├── prints.html         Print sales page (not linked from anywhere yet)
├── site.css            Small shared stylesheet (loaded by every page)
├── gallery-page.css    Shared layout for the 7 gallery pages (nav, hero, grid, lightbox)
├── ui.js               Shared mobile menu + lightbox for the gallery pages
├── consent.js          Cookie banner; loads Google Analytics only after Accept
├── brand.css           SSM brand layer — colours, Space Mono labels (loaded last)
├── site.js             Shared JavaScript — GSAP scroll animations
├── favicon.svg         The "SSM" browser-tab icon
├── CNAME               Tells GitHub Pages to serve the site at stillsonicmedia.co.uk.
│                       ⚠ Don't delete or edit this file.
├── sitemap.xml         List of public pages for search engines
├── fonts/              Redaction (display) + Space Mono (labels) webfonts
├── img/                Auto-made WebP sizes of every photo + manifest.js (don't edit)
├── 404.html            Branded 'page not found' page (GitHub Pages uses it automatically)
├── tools/
│   ├── optimise_images.py   Phone-sized WebP copies of photos (runs automatically)
│   ├── sync_layout.py       Copies the menu + footer into every page, applies photo
│   │                        descriptions, rebuilds sitemap.xml (runs automatically)
│   └── layout/              nav.html, footer.html, pages.json — THE menu and footer
├── photos/             All photos, one folder per gallery page:
│   ├── concert/  jimbo/  scotland/  tunisia/  cleethorpes/  florida/  food/
│   ├── wildlife/       Animals & Wildlife (page coming soon)
│   └── unused/         Shots not on any page yet
└── private/            Unlisted client pages — NOT linked from any menu or the sitemap,
    └── josh-garside/   and marked noindex so search engines skip them.
        ├── index.html      Client viewing page (access code inside the file's CONFIG block)
        ├── calendar.html   "Add to calendar" helper used by the booking email
        └── images/         Photos for this client page only
```

## Common jobs

**Change the menu or footer** — edit `tools/layout/nav.html` or `tools/layout/footer.html`
(not the pages). Push, and GitHub copies it into every page within a minute.
A new page? Add it to `tools/layout/pages.json` with its footer back-link.

**Describe a photo** — add a line to `photos/alt-text.json`:
`"photos/food/59_food_brunch.jpg": "Pancakes stacked with berries on a white plate"`.
Every page showing that photo picks it up automatically.

**Write a blog post (easy way)** — go to `stillsonicmedia.co.uk/private/post-builder.html`
(bookmark it; it's not linked anywhere). Fill in the form, check the preview, press
**Copy post code**, then paste it into `blog-posts.js` on GitHub right after
`window.SSM_POSTS = [` and commit. To edit a post, pick it under "Start from".

**Write a blog post (by hand)** — open `blog-posts.js`, copy an existing post to the top of
the list and edit it. Pick a `type`: `'image'` (photo + caption), `'text'` (words
only) or `'image-text'` (photo + paragraphs). Set `draft: true` to hide it until
it's ready. Instructions are at the top of the file.

**Add a photo to a gallery page** — open that page's folder in `photos/` on GitHub
(e.g. `photos/food/`), upload the photo there, then add a
`<div class="gallery-item">…</div>` block to that page's `#galleryGrid`, copying
an existing one and changing the filename, alt text, and label.
Upload with **Add file → Upload files** while inside the folder (drag the photo in,
wait for the bar to finish, then Commit). The `src` is the full path, e.g.
`photos/food/59_food_brunch.jpg`. Within about a minute, GitHub automatically makes small WebP copies in
`img/`, shrinks the original if it's over 2000 px, and updates every page (see the
**Actions** tab). Nothing to run yourself. Tip: name photos in lowercase with
no spaces, e.g. `tiger_spotlight.jpg`.

**Add a new project** — copy an existing project page (e.g. `cleethorpes.html`),
swap the images and text, then add a project card for it on `index.html`.

**New private client page** — copy the `private/josh-garside/` folder to
`private/<new-name>/`, then edit the CONFIG block (client name + access code)
near the bottom of its `index.html`. Send the client the URL and code.
Don't link it from any menu and don't add it to `sitemap.xml`.

**Booking enquiries** — the form on `book.html` posts via Formspree to your email.
The private client pages compose an email directly instead.

## Things to know

- Photos should ideally be exported at ≤ 500 KB (2000 px longest edge is plenty).
- The `?v=3` on `site.css` links is cache-busting — bump the number if you change
  the CSS and don't see the update.
- Google Analytics tag ID: `G-GQ900SQ106` (in each page's `<head>`).
