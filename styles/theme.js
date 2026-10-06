/* System 33 theme runtime. Pair with /styles/theme.css.
   1) adds the starfield canvas if the page has none,
   2) adds the beating light-core under the hero badge on legacy pages,
   3) lights .stage items in a .stages list as you scroll (same behaviour as the reading page). */
(function () {
    function ready(fn) { if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
    ready(function () {
        if (!document.getElementById('starfield')) {
            var c = document.createElement('canvas');
            c.id = 'starfield'; c.setAttribute('aria-hidden', 'true');
            document.body.insertBefore(c, document.body.firstChild);
            var s = document.createElement('script'); s.src = '/styles/starfield.js';
            document.body.appendChild(s);
        }
        // reading pages (notes): one fixed bar, "Return to System 33 →" pointing at the pulsing dot in the middle
        var oldNav = document.querySelector('nav.nav');
        if (oldNav && document.documentElement.classList.contains('s33-legacy') && !document.querySelector('.s33-bar')) {
            var bar = document.createElement('div'); bar.className = 's33-bar';
            bar.innerHTML = '<a class="s33-bar-back" href="/">Return to System 33 <span aria-hidden="true">→</span></a>' +
                '<a class="light-core" href="/" aria-label="Return to System 33"></a>';
            document.body.insertBefore(bar, document.body.firstChild);
            document.body.classList.add('s33-has-bar');
            oldNav.style.display = 'none';
        }
        if (document.documentElement.classList.contains('s33-legacy') && !document.querySelector('.light-core')) {
            var badge = document.querySelector('.hero .hero-badge');
            var hero = document.querySelector('.hero');
            var a = document.createElement('a');
            a.className = 'light-core'; a.href = '/'; a.setAttribute('aria-label', 'Back to system33.io');
            a.style.marginBottom = '22px';
            if (badge && badge.parentNode) {
                badge.parentNode.insertBefore(a, badge);
            } else if (hero) {
                // reading pages: left aligned hero, so the dot sits on the left above the title
                if (getComputedStyle(hero).textAlign !== 'center') a.style.marginLeft = '4px';
                a.style.marginTop = '8px';
                hero.insertBefore(a, hero.firstChild);
            }
        }
        var lists = document.querySelectorAll('.stages');
        if (!lists.length) return;
        function light() {
            var lim = window.innerHeight * .78;
            lists.forEach(function (list) {
                var fill = list.querySelector('.vinefill'), reach = 0;
                list.querySelectorAll('.stage').forEach(function (el) {
                    if (el.getBoundingClientRect().top < lim) el.classList.add('lit');
                    if (el.classList.contains('lit')) reach = el.offsetTop + 14;
                });
                if (fill) fill.style.height = reach + 'px';
            });
        }
        window.addEventListener('scroll', light, { passive: true });
        window.addEventListener('resize', light);
        setTimeout(light, 300);
    });
})();
