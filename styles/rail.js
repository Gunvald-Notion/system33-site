/* System 33, the table of contents line for long pages (notes).
   The list of numbers is fixed on the left, right beside the text column, always fully on screen.
   The page moves to meet it: click a number and that section's heading slides to sit level with it.
   Only the number inside the heading is lit. The line bead goes in toward it with no number of its own,
   so a number never shows twice. Sections with no number (cast, sources) get a dot that lights the same way.
   Rebuilds itself when sections arrive late (the Ed Catmull read fetches its chapters).
   Add: <script src="/styles/rail.js?v=4" defer></script> */
(function () {
    var NS = 'http://www.w3.org/2000/svg';
    var css = '' +
    '.rl{position:fixed;left:0;top:0;height:100vh;z-index:40;pointer-events:none}' +
    '.rl svg{position:absolute;left:0;top:0;overflow:visible}' +
    '.rl-base{position:absolute;width:2px;margin-left:-1px;background:rgba(150,185,255,.22)}' +
    '.rl-fill{position:absolute;width:3px;margin-left:-1.5px;background:#e6efff;border-radius:2px;box-shadow:0 0 8px 1px rgba(150,185,255,.9);transition:height .45s cubic-bezier(.2,.7,.2,1)}' +
    '.rl-link{fill:none;stroke:#eef4ff;stroke-width:2.5;stroke-linecap:round;filter:drop-shadow(0 0 5px rgba(150,185,255,.95))}' +
    '.rl-dot{position:absolute;width:22px;height:22px;margin:-11px 0 0 -11px;padding:0;border-radius:50%;border:1px solid rgba(150,185,255,.3);background:#050b1d;color:#8594b8;font:400 10px "IBM Plex Mono",ui-monospace,Menlo,monospace;line-height:20px;text-align:center;cursor:pointer;pointer-events:auto;transition:background .5s,border-color .5s,color .5s,box-shadow .5s,width .3s,height .3s,margin .3s;-webkit-tap-highlight-color:transparent}' +
    '.rl-dot.past{border-color:rgba(150,185,255,.55);color:#b4c4ea}' +
    '.rl-dot.cur{width:14px;height:14px;margin:-7px 0 0 -7px;background:#f5f8ff;border-color:#f5f8ff;color:transparent;box-shadow:0 0 12px 4px rgba(238,244,255,.75),0 0 34px 12px rgba(150,185,255,.3)}' +
    '.rl-dot:focus-visible{outline:2px solid #96b9ff;outline-offset:3px}' +
    '.rl-n{color:#8594b8;transition:color .5s,text-shadow .5s}' +
    '.rl-sep{color:#8594b8;transition:color .5s}' +
    '.rl-n.rl-dotn::before{content:"";display:inline-block;width:.34em;height:.34em;border-radius:50%;background:currentColor;margin-right:.62em;vertical-align:.14em}' +
    '.rl-n.cur{color:#fff;text-shadow:0 0 10px rgba(238,244,255,.95),0 0 28px rgba(150,185,255,.6)}' +
    '.rl-h{opacity:.55;transition:opacity .6s}' +
    '.rl-h.rl-on{opacity:1}' +
    '@media (max-width:700px){.rl-dot{width:20px;height:20px;margin:-10px 0 0 -10px;font-size:9px;line-height:18px}.rl-dot.cur{width:13px;height:13px;margin:-6px 0 0 -6px}' +
    'body.rl-has .container{padding-left:42px;padding-right:42px}}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var rail, svg, link, base, fill, heads = [], dots = [], nums = [], labels = [], ys = [];
    var n = 0, cur = -2, forced = -1, forcedTarget = 0, arrived = false, ftimer = 0, raf = 0, geo = '', phone = false, lx = 30, gutterW = 60, barH = 54;
    function clean(t) {
        return t.replace(/^\s*\d+\s*·\s*/, '').replace(/^\s*(\d+:)?\d{1,2}:\d{2}\s*[—–-]\s*/, '').trim();
    }
    function collect() {
        return Array.prototype.filter.call(document.querySelectorAll('h2[id]'), function (h) {
            return h.offsetParent !== null && h.textContent.trim();
        });
    }
    // the number is part of the heading text. Numbered headings keep their own number, others get one (or a dot)
    function lead(h, label) {
        var old = h.querySelector('.rl-n');
        if (old) return old;
        var b = document.createElement('span'); b.className = 'rl-n';
        var first = h.firstChild;
        var m = first && first.nodeType === 3 && first.nodeValue.match(/^\s*\d+(?=\s*·)/);
        if (m) {
            first.nodeValue = first.nodeValue.slice(m[0].length);
            b.textContent = label; h.insertBefore(b, first);
        } else if (label === '·') {
            b.className += ' rl-dotn'; h.insertBefore(b, h.firstChild);
        } else {
            var sep = document.createElement('span'); sep.className = 'rl-sep'; sep.textContent = ' \u00b7 ';
            b.textContent = label;
            h.insertBefore(sep, h.firstChild); h.insertBefore(b, sep);
        }
        return b;
    }
    function build(force) {
        var hs = collect(), s = hs.map(function (h) { return h.id; }).join('|');
        phone = innerWidth <= 700;
        var key = s + '|' + innerWidth + '|' + innerHeight;
        if (!force && key === geo) return;
        geo = key;
        if (rail) { rail.remove(); rail = null; }
        heads.forEach(function (h) { h.classList.remove('rl-h', 'rl-on'); });
        heads = hs; n = hs.length;
        if (n < 3) return;
        var numbered = hs.some(function (h) { return /^\s*\d+\s*·/.test(h.textContent); }), seq = 0;
        labels = hs.map(function (h) {
            var m = h.textContent.match(/^\s*(\d+)\s*·/);
            if (numbered) return m ? m[1] : '·';
            seq += 1; return String(seq);
        });
        nums = hs.map(function (h, i) { return lead(h, labels[i]); });
        document.body.classList.add('rl-has');
        var colLeft = Math.min.apply(null, nums.map(function (e) { return e.getBoundingClientRect().left; }));
        lx = phone ? 16 : Math.max(26, colLeft - 58);
        gutterW = Math.max(colLeft, lx + 20);
        var railH = Math.min(innerHeight * (phone ? .8 : .7), n * (phone ? 30 : 34));
        var top = barH + Math.max(10, (innerHeight - barH - railH) / 2);
        ys = hs.map(function (h, i) { return top + (n === 1 ? 0 : i / (n - 1) * railH); });
        rail = document.createElement('nav');
        rail.className = 'rl'; rail.setAttribute('aria-label', 'Contents of this page');
        rail.style.width = gutterW + 'px';
        base = document.createElement('div'); base.className = 'rl-base';
        base.style.left = lx + 'px'; base.style.top = (ys[0] - 14) + 'px'; base.style.height = (ys[n - 1] - ys[0] + 28) + 'px';
        fill = document.createElement('div'); fill.className = 'rl-fill';
        fill.style.left = lx + 'px'; fill.style.top = (ys[0] - 14) + 'px'; fill.style.height = '0px';
        svg = document.createElementNS(NS, 'svg'); svg.setAttribute('width', gutterW); svg.setAttribute('height', innerHeight);
        link = document.createElementNS(NS, 'path'); link.setAttribute('class', 'rl-link'); link.style.display = 'none';
        svg.appendChild(link);
        rail.appendChild(base); rail.appendChild(fill); rail.appendChild(svg);
        dots = hs.map(function (h, i) {
            h.classList.add('rl-h');
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'rl-dot';
            b.style.left = lx + 'px'; b.style.top = ys[i] + 'px';
            b.setAttribute('aria-label', (labels[i] === '·' ? '' : 'Section ' + labels[i] + ': ') + clean(h.textContent));
            b.title = clean(h.textContent);
            b.textContent = labels[i];
            b.addEventListener('click', function () { go(i); });
            rail.appendChild(b); return b;
        });
        document.body.appendChild(rail);
        cur = -2;
        update();
    }
    // slide the page so this heading's number sits level with its number on the line
    function go(i) {
        var r = nums[i].getBoundingClientRect();
        var max = document.documentElement.scrollHeight - innerHeight;
        forcedTarget = Math.max(0, Math.min(max, scrollY + (r.top + r.height / 2) - ys[i]));
        forced = i; arrived = false; clearTimeout(ftimer); ftimer = setTimeout(free, 2500);
        scrollTo({ top: forcedTarget, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        if (window.s33Sky) window.s33Sky.bump(1.2);
        update();
    }
    function center(i) { var r = nums[i].getBoundingClientRect(); return r.top + r.height / 2; }
    function update() {
        raf = 0;
        if (!rail) return;
        var c = -1, f = 0, i;
        if (forced >= 0 && Math.abs(scrollY - forcedTarget) < 4) arrived = true;
        if (forced >= 0 && arrived && Math.abs(scrollY - forcedTarget) > 120) forced = -1;
        if (forced >= 0) c = forced;
        else {
            for (i = 0; i < n; i++) if (center(i) <= ys[i] + 6) c = i;
            if (scrollY + innerHeight >= document.documentElement.scrollHeight - 4) c = n - 1;
        }
        if (c !== cur) {
            cur = c;
            dots.forEach(function (b, k) {
                b.classList.toggle('cur', k === c); b.classList.toggle('past', k < c);
                heads[k].classList.toggle('rl-on', k <= c);
                nums[k].classList.toggle('cur', k === c);
            });
        }
        var fillY = c < 0 ? ys[0] - 14 : ys[c];
        if (c >= 0 && c < n - 1 && forced < 0) {
            var s0 = scrollY + center(c) - ys[c], s1 = scrollY + center(c + 1) - ys[c + 1];
            f = Math.max(0, Math.min(1, (scrollY - s0) / Math.max(1, s1 - s0)));
            fillY += (ys[c + 1] - ys[c]) * f;
        }
        fill.style.height = Math.max(0, fillY - (ys[0] - 14)) + 'px';
        // the link from the bead to the lit number in the heading
        if (c >= 0) {
            var r = nums[c].getBoundingClientRect();
            var hy = Math.max(barH + 12, Math.min(innerHeight - 12, r.top + r.height / 2));
            var ex = Math.max(lx + 14, r.left - 6), sx = lx + 7, k = (ex - sx) * .55;
            link.setAttribute('d', 'M' + sx + ' ' + ys[c] + ' C' + (sx + k) + ' ' + ys[c] + ' ' + (ex - k) + ' ' + hy + ' ' + ex + ' ' + hy);
            link.style.display = ''; link.style.opacity = (hy === r.top + r.height / 2) ? 1 : .45;
        } else link.style.display = 'none';
    }
    function queue() { if (!raf) raf = requestAnimationFrame(update); }
    function free() { forced = -1; clearTimeout(ftimer); }
    var t;
    function later() { clearTimeout(t); t = setTimeout(function () { build(false); }, 200); }
    function init() {
        build(true);
        new MutationObserver(function (m) {
            if (m.every(function (r) { return (rail && rail.contains(r.target)) || r.target.tagName === 'H2' || (r.target.classList && r.target.classList.contains('rl-n')); })) return;
            later();
        }).observe(document.body, { childList: true, subtree: true });
        addEventListener('scroll', queue, { passive: true });
        addEventListener('wheel', free, { passive: true });
        addEventListener('touchstart', free, { passive: true });
        addEventListener('keydown', free);
        addEventListener('resize', later);
        addEventListener('load', later);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
    }
    if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
