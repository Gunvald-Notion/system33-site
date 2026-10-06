/* System 33, the reading line for long pages (notes).
   The whole line is on screen all the time, right beside the text column, with every number on it.
   Click a number to go there. The light fills down the line as you read, and the section you are in
   pushes in toward the text. The number in the heading text is what lights up, and the bead on the line
   goes in without a number, so a number never shows twice side by side.
   Rebuilds itself when sections arrive late (the Ed Catmull read fetches its chapters).
   Add: <script src="/styles/rail.js" defer></script> */
(function () {
    var NS = 'http://www.w3.org/2000/svg';
    var rail, svg, dim, lit, heads = [], labels = [], dots = [], nums = [], ys = [];
    var n = 0, railH = 0, D = 10, R = 15, total = 0, cur = -2, prog = -1, raf = 0, geo = '', phone = false;
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
    // the number is part of the heading text: it stays there all the time and lights when the line reaches it
    function badge(h, label) {
        if (label === '·') return null;
        var old = h.querySelector('.s33-hnum');
        if (old) return old;
        var b = document.createElement('span');
        b.className = 's33-hnum'; b.textContent = label;
        var first = h.firstChild;
        var m = first && first.nodeType === 3 && first.nodeValue.match(/^\s*\d+(?=\s*·)/);
        if (m) {
            first.nodeValue = first.nodeValue.slice(m[0].length);
            h.insertBefore(b, first);
        } else {
            var sep = document.createElement('span');
            sep.className = 's33-hsep'; sep.textContent = ' \u00b7 ';
            h.insertBefore(sep, h.firstChild);
            h.insertBefore(b, sep);
        }
        return b;
    }
    function pathD(c) {
        var x = 30, d = 'M' + x + ' -14';
        for (var i = 0; i < n; i++) {
            if (i === c) {
                var y = ys[i];
                d += ' L' + x + ' ' + (y - R) + ' C' + (x + D * 1.33) + ' ' + (y - R * .55) + ' ' + (x + D * 1.33) + ' ' + (y + R * .55) + ' ' + x + ' ' + (y + R);
            }
        }
        return d + ' L' + x + ' ' + (railH + 14);
    }
    function build(force) {
        var hs = collect(), s = hs.map(function (h) { return h.id; }).join('|');
        phone = innerWidth <= 700;
        var key = s + '|' + innerWidth + '|' + innerHeight;
        if (!force && key === geo) return;
        geo = key;
        if (rail) { rail.remove(); rail = null; }
        heads.forEach(function (h) { h.classList.remove('s33-h', 's33-on'); });
        heads = hs; n = hs.length;
        if (n < 3) return;
        var numbered = hs.some(function (h) { return /^\s*\d+\s*·/.test(h.textContent); }), seq = 0;
        labels = hs.map(function (h) {
            var m = h.textContent.match(/^\s*(\d+)\s*·/);
            if (numbered) return m ? m[1] : '·';
            seq += 1; return String(seq);
        });
        nums = hs.map(function (h, i) { return badge(h, labels[i]); });
        document.body.classList.add('s33-has-rail');
        var sx = scrollX;
        var colLeft = Math.min.apply(null, hs.map(function (h) { return h.getBoundingClientRect().left + sx; }));
        var lx = phone ? 18 : Math.max(26, colLeft - 56);
        var barH = 54;
        railH = Math.min(innerHeight * (phone ? .8 : .68), n * (phone ? 30 : 34));
        var top = barH + Math.max(8, (innerHeight - barH - railH) / 2);
        D = phone ? 8 : 14; R = phone ? 13 : 15;
        ys = hs.map(function (h, i) { return n === 1 ? 0 : i / (n - 1) * railH; });
        rail = document.createElement('nav');
        rail.className = 's33-rail'; rail.setAttribute('aria-label', 'Sections of this page');
        rail.style.cssText = 'left:' + (lx - 30) + 'px;top:' + top + 'px;height:' + railH + 'px';
        svg = el('svg', { width: 60, height: railH, viewBox: '0 0 60 ' + railH });
        svg.style.overflow = 'visible';
        dim = el('path', { class: 'dim', fill: 'none' });
        lit = el('path', { class: 'lit', fill: 'none' });
        svg.appendChild(dim); svg.appendChild(lit); rail.appendChild(svg);
        dots = hs.map(function (h, i) {
            h.classList.add('s33-h');
            var b = document.createElement('button');
            b.type = 'button'; b.className = 's33-rail-dot';
            b.style.left = '30px'; b.style.top = ys[i] + 'px';
            b.setAttribute('aria-label', (labels[i] === '·' ? '' : 'Section ' + labels[i] + ': ') + clean(h.textContent));
            b.title = clean(h.textContent);
            b.textContent = labels[i];
            b.addEventListener('click', function () {
                scrollTo({ top: h.getBoundingClientRect().top + scrollY - 76, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                if (window.s33Sky) window.s33Sky.bump(1.2);
            });
            rail.appendChild(b); return b;
        });
        document.body.appendChild(rail);
        cur = -2; prog = -1;
        update();
    }
    function lengthAtY(y) {
        if (y <= 0) return 0;
        var lo = 0, hi = total;
        for (var i = 0; i < 20; i++) {
            var mid = (lo + hi) / 2;
            if (lit.getPointAtLength(mid).y < y) lo = mid; else hi = mid;
        }
        return hi;
    }
    function update() {
        raf = 0;
        if (!rail) return;
        var line = innerHeight * .45, c = -1, f = 0;
        var tops = heads.map(function (h) { return h.getBoundingClientRect().top; });
        for (var i = 0; i < n; i++) if (tops[i] <= line) c = i;
        var atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
        if (atEnd) c = n - 1;
        if (c >= 0 && c < n - 1 && !atEnd) f = Math.max(0, Math.min(1, (line - tops[c]) / Math.max(1, tops[c + 1] - tops[c])));
        if (c !== cur) {
            cur = c;
            var d = pathD(c);
            dim.setAttribute('d', d); lit.setAttribute('d', d);
            total = lit.getTotalLength();
            dots.forEach(function (b, i) {
                b.style.left = (i === c ? 30 + D : 30) + 'px';
                b.classList.toggle('lit', i <= c); b.classList.toggle('cur', i === c);
                heads[i].classList.toggle('s33-on', i <= c);
                if (nums[i]) nums[i].classList.toggle('lit', i <= c), nums[i].classList.toggle('cur', i === c);
            });
        }
        var p = c < 0 ? 0 : c + f;
        var targetY = n === 1 ? 0 : p / (n - 1) * railH;
        lit.style.strokeDasharray = (c < 0 ? 0 : lengthAtY(targetY + (c >= 0 && f === 0 ? 0 : 0))) + ' ' + (total + 10);
    }
    function queue() { if (!raf) raf = requestAnimationFrame(update); }
    var t;
    function later() { clearTimeout(t); t = setTimeout(function () { build(false); }, 200); }
    function init() {
        build(true);
        new MutationObserver(function (m) {
            if (m.every(function (r) { return (rail && rail.contains(r.target)) || (r.target.classList && (r.target.classList.contains('s33-hnum') || r.target.classList.contains('s33-h'))) || (r.target.tagName === 'H2'); })) return;
            later();
        }).observe(document.body, { childList: true, subtree: true });
        addEventListener('scroll', queue, { passive: true });
        addEventListener('resize', later);
        addEventListener('load', later);
        if (document.fonts && document.fonts.ready) document.fonts.ready.then(later);
    }
    if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
