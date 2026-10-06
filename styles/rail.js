/* System 33, the contents river for long pages (notes).
   A line runs down the left, right beside the text column, with every number in a dot on it.
   When you reach a section the line swings in toward the number at the start of that heading, lights it,
   and swings back out and carries on. As the heading climbs toward the top of the screen the swing
   settles back into the line, which stays lit. Click a number and the page slides that heading level with it.
   Sections with no number (cast, sources) get a dot in the heading that lights the same way.
   Rebuilds itself when sections arrive late (the Ed Catmull read fetches its chapters).
   Add: script src="/styles/rail.js?v=12" defer */
(function () {
    var NS = 'http://www.w3.org/2000/svg';
    var css = '' +
    '.rl{position:fixed;left:0;top:0;height:100vh;z-index:40;pointer-events:none}' +
    '.rl svg{position:absolute;left:0;top:0;overflow:visible}' +
    '.rl-dim{fill:none;stroke:rgba(150,185,255,.16);stroke-width:1.5;stroke-linejoin:round}' +
    '.rl-lit{fill:none;stroke:url(#rlgrad);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 7px rgba(150,185,255,.85))}' +
    '.rl-ring{fill:none;stroke:#eef4ff;stroke-width:2.4;filter:drop-shadow(0 0 6px rgba(150,185,255,.95))}' +
    '.rl-dc{fill:rgba(6,12,32,.86);stroke:rgba(150,185,255,.34);stroke-width:1;cursor:pointer;pointer-events:all;transition:fill .5s,stroke .5s,filter .5s}' +
    '.rl-dc:focus{outline:none}.rl-dc:focus-visible{stroke:#fff;stroke-width:2}' +
    '.rl-dc.past{stroke:rgba(190,212,255,.8);fill:rgba(13,26,62,.88)}' +
    '.rl-dc.cur{stroke:#f5f8ff;stroke-width:1.6;fill:rgba(13,26,62,.9);filter:drop-shadow(0 0 5px rgba(238,244,255,.95)) drop-shadow(0 0 16px rgba(150,185,255,.6))}' +
    '.rl-dt{fill:#8594b8;font:500 10px "IBM Plex Mono",ui-monospace,Menlo,monospace;text-anchor:middle;dominant-baseline:central;pointer-events:none;paint-order:stroke;stroke:rgba(4,9,26,.95);stroke-width:2.6px;stroke-linejoin:round;transition:fill .5s}' +
    '.rl-dt.past{fill:#cfdcff}' +
    '.rl-dt.cur{fill:#fff}' +
    '.rl-n{display:inline-block;width:0;overflow:hidden;visibility:hidden;vertical-align:baseline}' +
    '.rl-sep{color:#8594b8;transition:color .5s}' +
    '.rl-n.rl-dotn::before{content:"";display:inline-block;width:.34em;height:.34em;border-radius:50%;background:currentColor;vertical-align:.14em}' +
            '.rl-h{opacity:.55;transition:opacity .6s}' +
    '.rl-h.rl-on{opacity:1}' +
    '@media (max-width:700px){.rl-dt{font-size:9px}' +
    'body.rl-has .container{padding-left:42px;padding-right:42px}}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var rail, svg, dimP, litP, bumpP, dcs = [], dts = [], rings = [], wts = [], clipR, heads = [], dots = [], nums = [], labels = [], ys = [];
    var n = 0, cur = -2, forced = -1, forcedTarget = 0, arrived = false, ftimer = 0, raf = 0, geo = '', phone = false;
    var lx = 30, A = 24, W = 52, y0 = 0, y1 = 0, gutterW = 60, barH = 54, clipId = 'rlclip';
    function clean(t) {
        return t.replace(/^\s*(\d+\s*)?·\s*/, '').replace(/^\s*(\d+:)?\d{1,2}:\d{2}\s*[—–-]\s*/, '').trim();
    }
    function headText(h) {
        var c = h.cloneNode(true);
        Array.prototype.forEach.call(c.querySelectorAll('.rl-n'), function (e) { e.remove(); });
        return c.textContent.trim();
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
        var b = document.createElement('span'); b.className = 'rl-n'; b.dataset.l = label; b.textContent = label === '·' ? '' : label;
        var first = h.firstChild;
        var m = first && first.nodeType === 3 && first.nodeValue.match(/^\s*\d+(?=\s*·)/);
        if (m) first.nodeValue = first.nodeValue.slice(m[0].length);
        h.insertBefore(b, h.firstChild);
        if (!m && label !== '·') {
            var sep = document.createElement('span'); sep.className = 'rl-sep'; sep.textContent = '\u00b7 ';
            h.insertBefore(sep, b.nextSibling);
        }
        return b;
    }
    function el(name, attrs) {
        var e = document.createElementNS(NS, name);
        for (var k in attrs) e.setAttribute(k, attrs[k]);
        return e;
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
        var numbered = hs.some(function (h) { var o = h.querySelector('.rl-n'); return o ? /^\d+$/.test(o.dataset.l) : /^\s*\d+\s*·/.test(h.textContent); }), seq = 0;
        labels = hs.map(function (h) {
            var old = h.querySelector('.rl-n');
            if (old) return old.dataset.l;
            var m = h.textContent.match(/^\s*(\d+)\s*·/);
            if (numbered) return m ? m[1] : '·';
            seq += 1; return String(seq);
        });
        nums = hs.map(function (h, i) { return lead(h, labels[i]); });
        document.body.classList.add('rl-has');
        var colLeft = Math.min.apply(null, nums.map(function (e) { return e.getBoundingClientRect().left; }));
        // the line sits close to the text; the swing reaches the ring around the heading number
        var nr = nums[0].getBoundingClientRect();
        lx = phone ? 12 : Math.max(24, colLeft - 36);
        A = 0; W = phone ? 20 : 24;
        gutterW = Math.max(colLeft + 60, lx + 24); wts = hs.map(function () { return 0; });
        var railH = Math.min(innerHeight * (phone ? .8 : .7), n * (phone ? 30 : 34));
        var top = barH + Math.max(10, (innerHeight - barH - railH) / 2);
        ys = hs.map(function (h, i) { return top + (n === 1 ? 0 : i / (n - 1) * railH); });
        y0 = ys[0] - 14; y1 = ys[n - 1] + 14;
        rail = document.createElement('nav');
        rail.className = 'rl'; rail.setAttribute('aria-label', 'Contents of this page');
        rail.style.width = gutterW + 'px';
        svg = el('svg', { width: gutterW, height: innerHeight });
        var defs = el('defs', {}), cp = el('clipPath', { id: clipId });
        clipR = el('rect', { x: -40, y: 0, width: gutterW + 80, height: 0 });
        cp.appendChild(clipR); defs.appendChild(cp);
        var gr = el('linearGradient', { id: 'rlgrad', gradientUnits: 'userSpaceOnUse', x1: 0, y1: y0, x2: 0, y2: y1 });
        gr.appendChild(el('stop', { offset: '0', 'stop-color': '#f2f6ff' })); gr.appendChild(el('stop', { offset: '1', 'stop-color': '#96b9ff' }));
        defs.appendChild(gr); svg.appendChild(defs);
        dimP = el('path', { class: 'rl-dim' });
        litP = el('path', { class: 'rl-lit', 'clip-path': 'url(#' + clipId + ')' });
        bumpP = el('path', { class: 'rl-lit' });
        svg.appendChild(dimP); svg.appendChild(litP); svg.appendChild(bumpP);
        rings = [];
        var DR = phone ? 9 : 10;
        dcs = hs.map(function (h, i) {
            h.classList.add('rl-h');
            var c = el('circle', { class: 'rl-dc', r: DR, cx: lx, cy: ys[i], tabindex: 0, role: 'button' });
            c.setAttribute('aria-label', (labels[i] === '·' ? '' : 'Section ' + labels[i] + ': ') + clean(headText(h)));
            var tt = el('title', {}); tt.textContent = clean(headText(h)); c.appendChild(tt);
            c.addEventListener('click', function () { go(i); });
            c.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(i); } });
            return c;
        });
        // order: circles, then the line through their centres, then the numbers on top
        dcs.forEach(function (c) { svg.insertBefore(c, dimP); });
        dts = hs.map(function (h, i) {
            var t = el('text', { class: 'rl-dt', x: lx, y: ys[i] }); t.textContent = labels[i]; svg.appendChild(t); return t;
        });
        
        dots = dcs;
        rail.appendChild(svg);
        document.body.appendChild(rail);
        cur = -2;
        update();
    }
    // slide the page so this heading's number sits level with its number on the line
    function go(i) {
        var max = document.documentElement.scrollHeight - innerHeight;
        forcedTarget = Math.max(0, Math.min(max, scrollY + center(i) - ys[i]));
        forced = i; arrived = false; clearTimeout(ftimer); ftimer = setTimeout(free, 2500);
        scrollTo({ top: forcedTarget, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        if (window.s33Sky) window.s33Sky.bump(1.2);
        update();
    }
    // the height of the first letter of the heading text, so the ring sits level with what you read
    var rng = document.createRange();
    function center(i) {
        var h = heads[i], w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT, null), t, m;
        while ((t = w.nextNode())) {
            if (nums[i].contains(t)) continue;
            m = t.nodeValue.search(/\S/);
            if (m >= 0) {
                rng.setStart(t, m); rng.setEnd(t, m + 1);
                var r = rng.getBoundingClientRect();
                if (r.height) return r.top + r.height / 2;
            }
        }
        var q = nums[i].getBoundingClientRect(); return q.top + q.height / 2;
    }
    // how far the line has swung in at height y: a smooth bell around each reached heading
    function swing(y, bumps) {
        var o = 0;
        for (var k = 0; k < bumps.length; k++) {
            var d = Math.abs(y - bumps[k].y);
            if (d < W) { var v = bumps[k].amp * .5 * (1 + Math.cos(Math.PI * d / W)); if (v > o) o = v; }
        }
        return o;
    }
    function poly(from, to, bumps) {
        var d = '', y, first = true;
        from = Math.max(from, y0); to = Math.min(to, y1);
        if (to <= from) return '';
        for (y = from; y < to; y += 3) { d += (first ? 'M' : 'L') + (lx + swing(y, bumps)).toFixed(1) + ' ' + y.toFixed(1); first = false; }
        d += 'L' + (lx + swing(to, bumps)).toFixed(1) + ' ' + to.toFixed(1);
        return d;
    }
    function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    function update() {
        raf = 0;
        if (!rail) return;
        var c = -1, i, d, DR = phone ? 9 : 10, fs0 = phone ? 9 : 10;
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
                b.classList.toggle('past', k < c); b.classList.toggle('cur', k === c);
                dts[k].classList.toggle('past', k < c); dts[k].classList.toggle('cur', k === c);
                heads[k].classList.toggle('rl-on', k <= c);
            });
        }
        // Each number stays on its own height on the line and only moves sideways. As its heading comes level with it,
        // it drifts toward the text, then swishes in to the start of the heading, and goes back out as the heading passes.
        var bumps = [], xs = [], rads = [], strongest = null;
        for (i = 0; i < n; i++) {
            var hy = center(i);
            var ady = Math.abs(hy - ys[i]);
            // eases in slowly as the heading comes level, then eases back out as it passes
            var a = clamp01(1 - ady / 170); a = a * a * (3 - 2 * a);
            var rr = DR + 4;
            var rad = DR + a * (rr - DR);
            var x = lx + a * (DR + 2);
            xs[i] = x; rads[i] = rad;
            dcs[i].setAttribute('r', rad.toFixed(1));
            dts[i].style.fontSize = (fs0 + a * 4).toFixed(1) + 'px';
            if (x - lx > .5) { var o = { y: ys[i], amp: x - lx, i: i, a: a, rad: rad }; bumps.push(o); if (!strongest || o.amp > strongest.amp) strongest = o; }
        }
        var fillY = c < 0 ? y0 : ys[c];
        if (c >= 0 && c < n - 1 && forced < 0) {
            var s0 = scrollY + center(c) - ys[c], s1 = scrollY + center(c + 1) - ys[c + 1];
            fillY += (ys[c + 1] - ys[c]) * clamp01((scrollY - s0) / Math.max(1, s1 - s0));
        }
        dimP.setAttribute('d', poly(y0, y1, bumps));
        litP.setAttribute('d', poly(y0, y1, bumps));
        clipR.setAttribute('height', Math.max(0, fillY));
        var cbump = bumps.filter(function (b) { return b.i === c; })[0];
        bumpP.setAttribute('d', cbump ? poly(cbump.y - W, cbump.y + W, bumps) : '');
        for (i = 0; i < n; i++) {
            var op = 1;
            for (var k = 0; k < bumps.length; k++) {
                if (bumps[k].i === i) continue;
                d = Math.abs(ys[i] - bumps[k].y);
                op = Math.min(op, clamp01((d - (bumps[k].rad + DR - 4)) / 8));
            }
            var dx = bumps.some(function (b) { return b.i === i; }) ? (lx + bumps.filter(function (b) { return b.i === i; })[0].amp) : lx + swing(ys[i], bumps);
            dcs[i].setAttribute('cx', dx.toFixed(1)); dts[i].setAttribute('x', dx.toFixed(1));
            dcs[i].style.opacity = dts[i].style.opacity = op.toFixed(2);
            dcs[i].style.pointerEvents = op < .35 ? 'none' : '';
        }
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
