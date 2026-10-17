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
 1. For every photo in photos/ (one folder per gallery page, e.g.
    photos/concert/), makes smaller WebP copies in img/ using the same
    folders (640 px and 1280 px wide). Phones download these instead of the
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
# Size limits: grainy or very detailed shots get re-encoded at a lower quality
# until they fit. Keeps every page light without visibly hurting the photo.
CAP_KB = {640: 70, 1280: 190}       # phone copies in img/
ORIGINAL_CAP_KB = 550               # the full-size original used by the lightbox
PAGES = [p for p in glob.glob(os.path.join(ROOT, '*.html')) if not p.endswith('index_prototype.html')]

# How wide each kind of image shows on screen, so the browser picks well.
SIZES = {
    'project-card': '(max-width: 1024px) 50vw, 340px',
    'default': '(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 460px',
}

MAX_EDGE = 2000
PHOTO_EXT = ('.jpg', '.jpeg', '.png')

PHOTO_DIR = os.path.join(ROOT, 'photos')

def find_photos():
    # photos/<page>/<file>; anything left loose in the repo root is picked up too
    found = glob.glob(os.path.join(PHOTO_DIR, '**', '*'), recursive=True) + glob.glob(os.path.join(ROOT, '*'))
    return sorted(p for p in found if os.path.isfile(p) and p.lower().endswith(PHOTO_EXT))

import hashlib

def file_hash(path):
    return hashlib.sha1(open(path, 'rb').read()).hexdigest()[:16]

def load_previous():
    """Last run's manifest, so each photo is only processed once."""
    try:
        txt = open(os.path.join(OUT, 'manifest.js')).read()
        return json.loads(txt[txt.index('{'):txt.rindex('}') + 1])
    except Exception:
        return {}

def shrink_original(path, im):
    """New photos only: cap at MAX_EDGE px and ORIGINAL_CAP_KB so the lightbox stays quick."""
    if max(im.size) > MAX_EDGE:
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.LANCZOS)
        if path.lower().endswith('.png'):
            im.save(path, 'PNG', optimize=True)
        else:
            im.convert('RGB').save(path, 'JPEG', quality=86, optimize=True, progressive=True)
        print('shrank', os.path.basename(path), 'to', im.size)
    if not path.lower().endswith('.png') and os.path.getsize(path) > ORIGINAL_CAP_KB * 1024:
        import io
        for q in (84, 80, 76, 72):
            buf = io.BytesIO()
            im.convert('RGB').save(buf, 'JPEG', quality=q, optimize=True, progressive=True)
            if buf.tell() <= ORIGINAL_CAP_KB * 1024:
                break
        if buf.tell() < os.path.getsize(path):
            old = os.path.getsize(path) // 1024
            open(path, 'wb').write(buf.getvalue())
            print('lightened', os.path.basename(path), f'{old} KB -> {buf.tell()//1024} KB (q{q})')
    return im

def make_webp(im, out, target):
    w, h = im.size
    small = im.convert('RGB').resize((target, round(h * target / w)), Image.LANCZOS)
    for q in (QUALITY, 74, 68, 62, 56):
        small.save(out, 'WEBP', quality=q, method=6)
        if os.path.getsize(out) <= CAP_KB[target] * 1024:
            break
    print('made', os.path.relpath(out, ROOT), f'q{q}', f'{os.path.getsize(out)//1024} KB')

def build_variants():
    previous = load_previous()
    manifest = {}
    os.makedirs(OUT, exist_ok=True)
    for path in find_photos():
        name = os.path.relpath(path, ROOT).replace(os.sep, '/')   # e.g. photos/concert/18_concert_stage.jpg
        sub = os.path.dirname(os.path.relpath(path, PHOTO_DIR)) if path.startswith(PHOTO_DIR) else ''
        stem = os.path.splitext(os.path.basename(path))[0]
        out_dir = os.path.join(OUT, sub)
        os.makedirs(out_dir, exist_ok=True)
        try:
            im = ImageOps.exif_transpose(Image.open(path))
            im.load()
        except Exception as e:
            print(f'SKIPPED {name}: not a readable image ({e.__class__.__name__}). Re-upload it.')
            continue
        prev = previous.get(name, {})
        # Already processed and unchanged? Then leave it alone (no repeated re-compression).
        # Entries from before hashes were recorded count as processed.
        unchanged = (prev.get('hash') == file_hash(path)) if prev.get('hash') else bool(prev)
        if not unchanged:
            im = shrink_original(path, im)
        w, h = im.size
        entries = []
        for target in WIDTHS:
            if target >= w:
                continue
            out = os.path.join(out_dir, f'{stem}-{target}.webp')
            if not unchanged or not os.path.exists(out):
                make_webp(im, out, target)
            entries.append(os.path.relpath(out, ROOT).replace(os.sep, '/') + f' {target}w')
        entries.append(f'{name} {w}w')
        manifest[name] = {'w': w, 'h': h, 'srcset': ', '.join(entries), 'hash': file_hash(path)}
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
