#!/usr/bin/env python3
"""
Still Sonic Media - layout sync
================================
Keeps the menu and footer identical on every page, from ONE copy each:
    tools/layout/nav.html      the top menu
    tools/layout/footer.html   the footer
    tools/layout/pages.json    which pages get them + each page's footer back-link
Also:
    photos/alt-text.json       one description per photo, applied to every <img> of it
    sitemap.xml                public pages + every published blog post

Runs automatically on GitHub after every push (see .github/workflows).
To change the menu or footer, edit the files in tools/layout/ - not the pages.
Safe to run as often as you like:  python3 tools/sync_layout.py
"""
import html, json, os, re, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAYOUT = os.path.join(ROOT, 'tools', 'layout')
SITE = 'https://stillsonicmedia.co.uk/'

def read(p): return open(os.path.join(ROOT, p), encoding='utf-8').read()
def write(p, s): open(os.path.join(ROOT, p), 'w', encoding='utf-8').write(s)

NAV_RE = re.compile(r'(<!-- ssm:nav -->\s*)?<nav>.*?</nav>(\s*<!-- /ssm:nav -->)?', re.S)
FOOT_RE = re.compile(r'(<!-- ssm:footer -->\s*)?<footer\b.*?</footer>(\s*<!-- /ssm:footer -->)?', re.S)

def sync_layout():
    nav_t = open(os.path.join(LAYOUT, 'nav.html')).read().strip()
    foot_t = open(os.path.join(LAYOUT, 'footer.html')).read().strip()
    pages = {k: v for k, v in json.load(open(os.path.join(LAYOUT, 'pages.json'))).items() if not k.startswith('_')}
    for page, cfg in pages.items():
        if not os.path.exists(os.path.join(ROOT, page)):
            print('missing page', page); continue
        s = read(page); orig = s
        nav = '<!-- ssm:nav -->\n' + nav_t.replace('{{home}}', cfg.get('home', 'index.html')) + '\n<!-- /ssm:nav -->'
        foot = '<!-- ssm:footer -->\n' + foot_t.replace('{{left}}', cfg.get('left', '')) + '\n<!-- /ssm:footer -->'
        s, n1 = NAV_RE.subn(lambda m: nav, s, count=1)
        s, n2 = FOOT_RE.subn(lambda m: foot, s, count=1)
        if not (n1 and n2): print('no nav/footer found in', page)
        if s != orig: write(page, s); print('layout', page)
    return pages

def sync_alt(pages):
    path = os.path.join(ROOT, 'photos', 'alt-text.json')
    if not os.path.exists(path): return
    alts = {k: v for k, v in json.load(open(path)).items() if not k.startswith('_')}
    for page in pages:
        s = read(page); orig = s
        def fix(m):
            tag = m.group(0)
            src = re.search(r'\ssrc="([^"]+)"', tag)
            if not src or src.group(1) not in alts or 'project-card-alt' in tag: return tag
            alt = html.escape(alts[src.group(1)], quote=True)
            return re.sub(r'\salt="[^"]*"', f' alt="{alt}"', tag) if re.search(r'\salt="', tag) else tag.replace('<img', f'<img alt="{alt}"', 1)
        s = re.sub(r'<img\b[^>]*>', fix, s)
        if s != orig: write(page, s); print('alt text', page)

def sync_sitemap(pages):
    urls = [(SITE if p == 'index.html' else SITE + p) for p in pages]
    try:   # published blog posts, read straight from blog-posts.js
        js = "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.SSM_POSTS.filter(p=>!p.draft).map(p=>p.slug)))"
        slugs = json.loads(subprocess.check_output(['node', '-e', js, os.path.join(ROOT, 'blog-posts.js')], text=True))
        urls += [SITE + 'post.html?p=' + s for s in slugs]
    except Exception as e:
        print('sitemap: could not read blog posts (', e.__class__.__name__, ')')
    pri = lambda u: '1.0' if u == SITE else '0.9' if u.endswith('book.html') else '0.6' if 'post.html' in u else '0.8'
    body = ''.join(f'  <url><loc>{html.escape(u)}</loc><priority>{pri(u)}</priority></url>\n' for u in urls)
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + body + '</urlset>\n'
    if xml != read('sitemap.xml'): write('sitemap.xml', xml); print('sitemap', len(urls), 'urls')

if __name__ == '__main__':
    pages = sync_layout()
    sync_alt(pages)
    sync_sitemap(pages)
