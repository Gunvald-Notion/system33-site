/* System 33, the reading vine for long pages (notes).
   A line runs down the left side of the text, part of the page itself (it scrolls with it).
   At every section it curves in toward the heading like half a roundabout, a numbered dot sits at
   the tip and lights the heading, then the line goes back out and carries on down. The light
   travels along the whole path as you read. Click a number to jump there.
   Rebuilds itself when sections arrive late (the Ed Catmull read fetches its chapters).
   Add: <script src="/styles/rail.js" defer></script> */
(function () {
    var NS = 'http://www.w3.org/2000/svg';
    var layer, svg, dim, lit, heads = [], labels = [], ys = [], dots = [], total = 0, raf = 0, geo = '';
    function clean(t) {
        return t.replace(/^\s*\d+\s*·\s*/, '').replace(/^\s*(\d+:)?\d{1,2}:\d{2}\s*[—–-]\s*/, '').trim();
    }
    function collect() {
        return Array.prototype.filter.call(document.querySelectorAll('h2[id]'), function (h) {
            return h.offsetParent !== null && h.textContent.trim();
        });
    }
    function el(name, attrs) {
        var e = document.createElementNS(NS, name);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        return e;
    }
    function build(force) {
        var hs = collect(), s = hs.map(function (h) { return h.id; }).join('|');
        var phone = innerWidth <= 700;
        var key = s + '|' + innerWidth + '|' + document.documentElement.scrollHeight;
        if (!force && key === geo) return;
        geo = key;
        if (layer) { layer.remove(); layer = null; }
        heads.forEach(function (h) { h.classList.remove('s33-h', 's33-on'); });
        heads = hs;
        if (hs.length < 3) return;
        // the dot shows the chapter's own number; pages without numbered chapters count 1, 2, 3
        var numbered = hs.some(function (h) { return /^\s*\d+\s*·/.test(h.textContent); }), seq = 0;
        labels = hs.map(function (h) {
            var m = h.textContent.match(/^\s*(\d+)\s*·/);
            if (numbered) return m ? m[1] : '·';
            seq += 1; return String(seq);
        });
        document.body.classList.add('s33-has-rail');
        var sx = scrollX, sy = scrollY;
        var colLeft = Math.min.apply(null, hs.map(function (h) { return h.getBoundingClientRect().left + sx; }));
        var gutter = phone ? 28 : 52, D = phone ? 11 : 17, R = phone ? 17 : 22;
        var lx = Math.max(10, colLeft - gutter);
        ys = hs.map(function (h) {
            var cs = getComputedStyle(h), fs = parseFloat(cs.fontSize) || 20, lh = parseFloat(cs.lineHeight) || fs * 1.25;
            return h.getBoundingClientRect().top + sy + (parseFloat(cs.paddingTop) || 0) + lh / 2;
        });
        var docH = document.documentElement.scrollHeight;
        var d = 'M' + lx + ' ' + Math.max(4, ys[0] - R - 46);
        ys.forEach(function (y) {
            d += ' L' + lx + ' ' + (y - R) + ' C' + (lx + D * 1.33) + ' ' + (y - R * .55) + ' ' + (lx + D * 1.33) + ' ' + (y + R * .55) + ' ' + lx + ' ' + (y + R);
        });
        d += ' L' + lx + ' ' + Math.min(docH - 6, ys[ys.length - 1] + R + 90);
        layer = document.createElement('div'); layer.className = 's33-vine';
        layer.style.height = docH + 'px';
        svg = el('svg', { width: Math.ceil(lx + D + 24), height: docH });
        dim = el('path', { d: d, class: 'dim', fill: 'none' });
        lit = el('path', { d: d, class: 'lit', fill: 'none' });
        svg.appendChild(dim); svg.appendChild(lit); layer.appendChild(svg);
        total = lit.getTotalLength();
        lit.style.strokeDasharray = '0 ' + (total + 10);
        dots = hs.map(function (h, i) {
            h.classList.add('s33-h');
            var b = document.createElement('button');
            b.type = 'button'; b.className = 's33-vine-dot';
            b.style.left = (lx + D) + 'px'; b.style.top = ys[i] + 'px';
            b.setAttribute('aria-label', (labels[i] === '·' ? '' : 'Section ' + labels[i] + ': ') + clean(h.textContent));
            b.textContent = labels[i];
            b.addEventListener('click', function () {
                scrollTo({ top: h.getBoundingClientRect().top + scrollY - 76, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                if (window.s33Sky) window.s33Sky.bump(1.2);
            });
            layer.appendChild(b); return b;
        });
        document.body.appendChild(layer);
        update();
    }
    // the path only ever goes downward, so the length reached by a given page height is found by bisection
    function lengthAtY(y) {
        if (y <= lit.getPointAtLength(0).y) return 0;
        var lo = 0, hi = total;
        for (var i = 0; i < 22; i++) {
            var mid = (lo + hi) / 2;
            if (lit.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
        }
        return hi;
    }
    function update() {
        raf = 0;
        if (!layer) return;
        var atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
        var py = scrollY + innerHeight * .62;
        var len = atEnd ? total : lengthAtY(py);
        lit.style.strokeDasharray = len + ' ' + (total + 10);
        var cur = -1;
        ys.forEach(function (y, i) { if (atEnd || y <= py) cur = i; });
        dots.forEach(function (b, i) {
            b.classList.toggle('lit', i <= cur); b.classList.toggle('cur', i === cur);
            heads[i].classList.toggle('s33-on', i <= cur);
        });
    }
    function queue() { if (!raf) raf = requestAnimationFrame(update); }
    var t;
    function later() { clearTimeout(t); t = setTimeout(function () { build(false); }, 200); }
    function init() {
        build(true);
        new MutationObserver(function (m) {
            if (m.every(function (r) { return layer && (layer.contains(r.target) || r.target === layer); })) return;
            later();
        }).observe(document.body, { childList: true, subtree: true });
        if (window.ResizeObserver) new ResizeObserver(later).observe(document.documentElement);
        addEventListener('scroll', queue, { passive: true });
        addEventListener('resize', later);
        addEventListener('load', later);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
    }
    if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
