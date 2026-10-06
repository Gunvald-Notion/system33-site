/* System 33, fixed progress rail for long reading pages (notes).
   One dot per section (every h2 with an id). The rail never moves; the light fills down it as you read,
   passed sections stay lit, click a dot to jump there. Rebuilds itself when sections arrive late
   (the Ed Catmull read fetches its chapters). Add: <script src="/styles/rail.js" defer></script> */
(function () {
    var rail, fill, dots = [], heads = [], labels = [], raf = 0, sig = '', lastCur = null, tipTimer = 0;
    function clean(t) {
        return t.replace(/^\s*\d+\s*·\s*/, '').replace(/^\s*(\d+:)?\d{1,2}:\d{2}\s*[—–-]\s*/, '').trim();
    }
    function collect() {
        return Array.prototype.filter.call(document.querySelectorAll('h2[id]'), function (h) {
            return h.offsetParent !== null && h.textContent.trim();
        });
    }
    function build() {
        var hs = collect(), s = hs.map(function (h) { return h.id; }).join('|');
        if (s === sig) return;
        sig = s; heads = hs;
        // the dot shows the chapter's own number. Pages with numbered chapters keep those numbers and
        // mark unnumbered sections (cast, sources) with a small dot; otherwise we count 1, 2, 3
        var numbered = hs.some(function (h) { return /^\s*\d+\s*·/.test(h.textContent); });
        var seq = 0;
        labels = hs.map(function (h) {
            var m = h.textContent.match(/^\s*(\d+)\s*·/);
            if (numbered) return m ? m[1] : '·';
            seq += 1; return String(seq);
        });
        if (rail) rail.remove();
        if (hs.length < 3) { rail = null; return; }
        rail = document.createElement('nav');
        rail.className = 's33-rail'; rail.setAttribute('aria-label', 'Progress through this page');
        rail.style.setProperty('--n', hs.length);
        var track = document.createElement('div'); track.className = 's33-rail-track';
        fill = document.createElement('div'); fill.className = 's33-rail-fill';
        track.appendChild(fill); rail.appendChild(track);
        dots = hs.map(function (h, i) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 's33-rail-dot';
            b.style.top = (hs.length === 1 ? 0 : i / (hs.length - 1) * 100) + '%';
            var title = clean(h.textContent).replace(/</g, '&lt;');
            b.setAttribute('aria-label', (labels[i] === '·' ? '' : 'Section ' + labels[i] + ': ') + clean(h.textContent));
            b.innerHTML = '<span class="n">' + labels[i] + '</span><span class="tip">' + (labels[i] === '·' ? '' : '<b>' + labels[i] + '</b> ') + title + '</span>';
            b.addEventListener('click', function () {
                var y = h.getBoundingClientRect().top + scrollY - 76;
                scrollTo({ top: y, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                if (window.s33Sky) window.s33Sky.bump(1.2);
            });
            rail.appendChild(b); return b;
        });
        document.body.appendChild(rail);
        document.body.classList.add('s33-has-rail');
        update();
    }
    function update() {
        raf = 0;
        if (!rail || !heads.length) return;
        var line = innerHeight * .35, cur = -1, prog = 0, n = heads.length;
        var tops = heads.map(function (h) { return h.getBoundingClientRect().top; });
        for (var i = 0; i < n; i++) if (tops[i] <= line) cur = i;
        if (cur >= 0) {
            var next = cur + 1 < n ? tops[cur + 1] : null;
            var end = next === null ? document.documentElement.scrollHeight - scrollY - innerHeight + tops[cur] + innerHeight : next;
            var span = next === null ? Math.max(1, document.documentElement.scrollHeight - innerHeight - (scrollY + tops[cur] - line)) : Math.max(1, next - tops[cur]);
            var into = next === null ? scrollY - (scrollY + tops[cur] - line) : line - tops[cur];
            prog = cur + Math.min(1, Math.max(0, into / span));
        }
        var atEnd = scrollY + innerHeight >= document.documentElement.scrollHeight - 4;
        if (atEnd) { cur = n - 1; prog = n - 1; }
        fill.style.height = (n === 1 ? 0 : Math.min(100, prog / (n - 1) * 100)) + '%';
        dots.forEach(function (d, i) { d.classList.toggle('lit', i <= cur); d.classList.toggle('cur', i === cur); });
        // arriving at a section swipes its number and name in beside the rail for a moment
        if (lastCur !== null && cur !== lastCur && cur >= 0 && dots[cur]) {
            dots.forEach(function (d) { d.classList.remove('show'); });
            dots[cur].classList.add('show');
            clearTimeout(tipTimer);
            tipTimer = setTimeout(function () { dots.forEach(function (d) { d.classList.remove('show'); }); }, 2600);
        }
        lastCur = cur;
    }
    function queue() { if (!raf) raf = requestAnimationFrame(update); }
    var mo, t;
    function watch() {
        mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(build, 250); });
        mo.observe(document.body, { childList: true, subtree: true });
    }
    function init() { build(); watch(); addEventListener('scroll', queue, { passive: true }); addEventListener('resize', function () { sig = ''; build(); queue(); }); }
    if (document.readyState !== 'loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
