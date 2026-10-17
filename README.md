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
├── skate.html          ("Coming soon" placeholder)
├── skull-rose.html     ("Coming soon" placeholder)
├── blog.html           Blog list — filter by Photos / Words / Stories
├── post.html           Single blog post page (post.html?p=<slug>)
├── blog-posts.js       All blog posts live here — edit this file to add one
├── blog.css            Styles for the two blog pages
├── book.html           Booking page — pricing tiers + enquiry form (Formspree,
│                       submissions arrive by email). Linked from the home nav.
├── prints.html         Print sales page (not linked from anywhere yet)
├── site.css            Small shared stylesheet (loaded by every page)
├── brand.css           SSM brand layer — colours, Space Mono labels (loaded last)
├── site.js             Shared JavaScript — GSAP scroll animations
├── favicon.svg         The "SSM" browser-tab icon
├── CNAME               Tells GitHub Pages to serve the site at stillsonicmedia.co.uk.
│                       ⚠ Don't delete or edit this file.
├── sitemap.xml         List of public pages for search engines
├── fonts/              Redaction webfonts (the site's display typeface)
├── *.jpg               All photos, kept loose at the repo root. Numbered by project
│                       (01–03 camels = Tunisia, 04–08 = PTV/portrait, fl_* = florida, etc.)
└── private/            Unlisted client pages — NOT linked from any menu or the sitemap,
    └── josh-garside/   and marked noindex so search engines skip them.
        ├── index.html      Client viewing page (access code inside the file's CONFIG block)
        ├── calendar.html   "Add to calendar" helper used by the booking email
        └── images/         Photos for this client page only
```

## Common jobs

**Write a blog post** — open `blog-posts.js`, copy an existing post to the top of
the list and edit it. Pick a `type`: `'image'` (photo + caption), `'text'` (words
only) or `'image-text'` (photo + paragraphs). Set `draft: true` to hide it until
it's ready. Instructions are at the top of the file.

**Add a photo to a gallery page** — upload the .jpg to the repo root, then add a
`<div class="gallery-item">…</div>` block to that page's `#galleryGrid`, copying
an existing one and changing the filename, alt text, and label.

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
