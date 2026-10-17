/* ============================================
   Still Sonic Media — Blog posts
   ============================================

   This is the ONLY file you need to edit to add a blog post.
   blog.html (the list) and post.html (a single post) both read from it.

   HOW TO ADD A POST
   1. Upload the photo into its folder in photos/ (e.g. photos/wildlife/).
   2. Copy one of the posts below, paste it at the TOP of the list,
      and change the details. Newest posts go first.
   3. Commit. It's live in a minute or two.

   THE THREE POST TYPES  (set with  type: '...')
   · 'image'       — a single photo with a short caption. No body text.
   · 'text'        — words only. No image.
   · 'image-text'  — a header photo followed by written paragraphs.

   FIELDS
   slug      Short unique id used in the web address, lowercase-with-dashes.
             e.g. 'foo-fighters-2026' → post.html?p=foo-fighters-2026
   type      'image', 'text' or 'image-text' (see above)
   title     Post headline
   date      'YYYY-MM-DD'
   tag       One short category label, e.g. 'Live', 'Travel', 'News', 'Wildlife'
   image     Photo path, e.g. 'photos/wildlife/tiger_spotlight.jpg'
             (image and image-text posts only)
   imageAlt  Short description of the photo, for screen readers and Google
   caption   One line under the photo (optional)
   excerpt   One or two sentences shown on the blog list card (optional —
             the first paragraph is used if you leave it out)
   body      List of paragraphs, each in quotes, separated by commas.
             Use \n inside quotes for a line break. Basic HTML like
             <a href="...">link</a> and <em>italic</em> works.
   draft     true hides the post from the site until you're ready (optional)

   Watch the punctuation: every post is wrapped in { }, followed by a comma,
   and every text value sits inside 'single quotes'. If you need an
   apostrophe inside a value, type it as \' (e.g. 'Cam\'s first gig').
   ============================================ */

window.SSM_POSTS = [
   {
    slug: 'tiger-under-the-spotlight',
    type: 'image-text',
    title: 'Tiger Under The Spotlight',
    date: '2026-10-17',
    tag: 'Wildlife',
    image: 'photos/wildlife/tiger_spotlight.JPEG',
    imageAlt: 'Tiger Eating Meat with soft highlight through trees on left cheek',
    caption: 'Yorkshire Wildlife Park, Doncaster, United Kingdom',
    excerpt: 'There are sometimes certain photos I obsess over...',
    body: [
      'There are sometimes certain photos I obsess over...sometimes its the memory of it and sometimes its just the way it came out after some post production on it...this image, is one of them, outside of recent news that somehow changed from local to global news so fast. Thank you social media.',
      'This image is on a surface level a tiger feeding at dinner time, the part that shocks and captivates me about it is the light on his face, the small highlight brings your attention to the cheek and then your eyes are free to explore locally at the lovely pattern down to the teeth clinging to the food its feeding on.',
      'This shoot came out with many amazing shots both fresh off the sensor and some, like this one, that were refined after the fact. Most from this shoot will be on the website before long I just wanted to give this image its spotlight it deserves.'
    ]
  },
  {
    slug: 'next-up-animals-and-wildlife',
    type: 'image-text',
    title: 'Next up: Animals & Wildlife',
    date: '2026-10-17',
    tag: 'News',
    image: 'photos/tunisia/03_camel_face.jpg',
    imageAlt: 'Close-up of a camel\'s face in the Tunisian desert',
    caption: 'Tunisia, 2024',
    excerpt: 'A new gallery is in the works. Here\'s what\'s coming and where it starts.',
    body: [
      'The next project on Still Sonic Media is an Animals & Wildlife gallery. You\'ll spot its card on the homepage already, marked as coming soon.',
      'Until it\'s ready, here\'s a familiar face from the Tunisia set. More to follow as the new work comes together.'
    ]
  },

  {
    slug: 'cleethorpes-at-dusk',
    type: 'image',
    title: 'Cleethorpes at dusk',
    date: '2026-10-10',
    tag: 'Street',
    image: 'photos/cleethorpes/39_cleethorpes_dusk.jpg',
    imageAlt: 'Cleethorpes seafront at dusk',
    caption: 'Cleethorpes seafront, 2024. From the <a href="cleethorpes.html">Cleethorpes</a> set.'
  },

  {
    slug: 'welcome-to-the-blog',
    type: 'text',
    title: 'Welcome to the blog',
    date: '2026-10-03',
    tag: 'News',
    body: [
      'This is the new home for everything that doesn\'t fit neatly into a gallery: gig write-ups, single frames I keep coming back to, and notes from the road.',
      'Posts will come in three shapes. Some are just a photo, some are just words, and some are both.',
      'If you\'d like something shot, the <a href="book.html">booking page</a> is the quickest way to reach me.'
    ]
  }

];
