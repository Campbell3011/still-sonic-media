#!/usr/bin/env python3
"""
Still Sonic Media - image optimiser
===================================
Runs automatically on GitHub whenever you upload a photo (see
.github/workflows/optimise-images.yml). You can also run it yourself:
    python3 tools/optimise_images.py

What it does (safe to run as often as you like - it only does what's missing):
 0. Shrinks any original over 2000 px on its long edge down to 2000 px
    (phone photos are often 4000 px and 4-6 MB - far bigger than needed).
 1. For every .jpg in the repo root, makes smaller WebP copies in img/
    (640 px and 1280 px wide). Phones download these instead of the
    2000 px original, which is roughly 5-10x smaller.
 2. Adds srcset / sizes / width / height to every <img> on the public
    pages, so the browser picks the right size and the page doesn't jump
    while photos load. The original .jpg stays as the fallback and is
    still what the lightbox opens at full size.
 3. Writes img/manifest.js, which the blog uses to do the same for posts.

Needs Pillow:  pip install Pillow
"""
import glob, json, os, re, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'img')
WIDTHS = [640, 1280]
QUALITY = 80
PAGES = [p for p in glob.glob(os.path.join(ROOT, '*.html')) if not p.endswith('index_prototype.html')]

# How wide each kind of image shows on screen, so the browser picks well.
SIZES = {
    'project-card': '(max-width: 1024px) 50vw, 340px',
    'default': '(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 460px',
}

MAX_EDGE = 2000
PHOTO_EXT = ('.jpg', '.jpeg', '.png')

def find_photos():
    return sorted(p for p in glob.glob(os.path.join(ROOT, '*'))
                  if os.path.isfile(p) and p.lower().endswith(PHOTO_EXT))

def shrink_original(path, im):
    """Cap originals at MAX_EDGE px so the lightbox doesn't pull a 6 MB file."""
    if max(im.size) <= MAX_EDGE:
        return im
    im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
    if path.lower().endswith('.png'):
        im.save(path, 'PNG', optimize=True)
    else:
        im.convert('RGB').save(path, 'JPEG', quality=86, optimize=True, progressive=True)
    print('shrank', os.path.basename(path), 'to', im.size)
    return im

def build_variants():
    manifest = {}
    os.makedirs(OUT, exist_ok=True)
    for path in find_photos():
        name = os.path.basename(path)
        stem = os.path.splitext(name)[0]
        try:
            im = ImageOps.exif_transpose(Image.open(path))
            im.load()
        except Exception as e:
            print(f'SKIPPED {name}: not a readable image ({e.__class__.__name__}). Re-upload it.')
            continue
        im = shrink_original(path, im)
        w, h = im.size
        entries = []
        for target in WIDTHS:
            if target >= w:
                continue
            out = os.path.join(OUT, f'{stem}-{target}.webp')
            if not os.path.exists(out) or os.path.getmtime(out) < os.path.getmtime(path):
                im.convert('RGB').resize((target, round(h * target / w)), Image.LANCZOS).save(out, 'WEBP', quality=QUALITY, method=6)
                print('made', os.path.relpath(out, ROOT))
            entries.append(f'img/{stem}-{target}.webp {target}w')
        entries.append(f'{name} {w}w')
        manifest[name] = {'w': w, 'h': h, 'srcset': ', '.join(entries)}
    with open(os.path.join(OUT, 'manifest.js'), 'w') as f:
        f.write('/* Made by tools/optimise_images.py - do not edit by hand */\n')
        f.write('window.SSM_IMAGES = ' + json.dumps(manifest, indent=1) + ';\n')
    return manifest

IMG_RE = re.compile(r'<img\b[^>]*>', re.S)

def set_attr(tag, attr, value):
    if re.search(rf'\s{attr}="[^"]*"', tag):
        return re.sub(rf'\s{attr}="[^"]*"', f' {attr}="{value}"', tag)
    return tag.replace('<img', f'<img {attr}="{value}"', 1)

def update_pages(manifest):
    for page in PAGES:
        html = open(page).read()
        orig = html
        def fix(m):
            tag = m.group(0)
            src = re.search(r'\ssrc="([^"]+)"', tag)
            if not src or src.group(1) not in manifest:
                return tag
            info = manifest[src.group(1)]
            before = html[max(0, m.start() - 300):m.start()]
            kind = 'project-card' if before.rfind('project-card') > before.rfind('gallery-item') else 'default'
            for attr, val in (('srcset', info['srcset']), ('sizes', SIZES[kind]),
                              ('width', info['w']), ('height', info['h']), ('decoding', 'async')):
                tag = set_attr(tag, attr, val)
            return tag
        html = IMG_RE.sub(fix, html)
        if html != orig:
            open(page, 'w').write(html)
            print('updated', os.path.basename(page))

if __name__ == '__main__':
    update_pages(build_variants())
