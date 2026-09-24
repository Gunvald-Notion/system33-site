/* System 33 — ambient starfield background, adapted from the homepage's
   #sky canvas (index.html). This is the passive night-sky part only:
   no dragging, no zoom, no rooms. Drop <canvas id="starfield"></canvas>
   as the first element inside <body>, then include this script. */
(() => {
    const cv = document.getElementById('starfield');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0, H = 0, DPR = 1, stars = [];

    function resize() {
        DPR = Math.min(window.devicePixelRatio || 1, 2);
        W = innerWidth; H = innerHeight;
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        makeStars();
    }
    function makeStars() {
        const n = Math.round(Math.max(90, Math.min(280, W * H / 5200)));
        stars = Array.from({ length: n }, () => {
            const z = Math.random() ** 1.6 * .85 + .15, g = Math.random() ** 3;
            return {
                x: Math.random(), y: Math.random(),
                r: Math.max(.4, (.5 + 2 * Math.sqrt(g)) * (.3 + z * 1.1)),
                bright: g > .92,
                op: .18 + Math.random() * .45,
                ph: Math.random() * Math.PI * 2,
                sp: .3 + Math.random() * .5
            };
        });
    }
    function frame(t) {
        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';
        for (const st of stars) {
            const x = st.x * W, y = st.y * H;
            const twinkle = RM ? 1 : (.75 + .25 * Math.sin(t / 1000 * st.sp + st.ph));
            ctx.globalAlpha = Math.min(1, st.op * twinkle);
            ctx.fillStyle = st.bright ? '#eef4ff' : '#c7d6f5';
            if (st.bright) {
                const g = ctx.createRadialGradient(x, y, 0, x, y, st.r * 5);
                g.addColorStop(0, 'rgba(238,244,255,.9)');
                g.addColorStop(1, 'rgba(238,244,255,0)');
                ctx.fillStyle = g;
                ctx.beginPath(); ctx.arc(x, y, st.r * 5, 0, Math.PI * 2); ctx.fill();
            } else {
                ctx.beginPath(); ctx.arc(x, y, st.r, 0, Math.PI * 2); ctx.fill();
            }
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
        requestAnimationFrame(frame);
    }
    addEventListener('resize', resize);
    resize();
    requestAnimationFrame(frame);
})();
