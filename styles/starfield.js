/* System 33, the living sky for every page except the home page's own canvas.
   Ported from the home page (index.html): temperature coloured stars, a field of
   dust that is lit by rings of light travelling out from the heart, and a heartbeat.
   The heart is the page's .light-core dot when there is one (rings are synced to its
   beat), otherwise the top centre of the screen.
   Moving makes it faster: scrolling, dragging, wheel, touch and keys all add "boost",
   which speeds up the beat, the rings and the drift, then eases back to normal.
   Usage: <canvas id="starfield"></canvas> as the first element in <body>, then this script. */
(() => {
    const cv = document.getElementById('starfield');
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const POOL = '150,185,255';
    const V = 520, PERIOD = 3, MAXB = 4;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    // sprites, the same temperatures as the home sky
    const TEMPS = [[155,176,255],[170,191,255],[202,215,255],[228,232,255],[248,247,255],[255,244,234],[255,226,196],[255,204,150]];
    const TW = [.14,.16,.2,.18,.14,.08,.06,.04];
    const pickTemp = () => { let r = Math.random(), a = 0; for (let k = 0; k < TW.length; k++) { a += TW[k]; if (r < a) return k; } return 2; };
    const sprite = (size, draw) => { const c = document.createElement('canvas'); c.width = c.height = size; draw(c.getContext('2d'), size / 2); return c; };
    const DOT = TEMPS.map(t => sprite(32, (g, h) => {
        const p = g.createRadialGradient(h, h, 0, h, h, h);
        p.addColorStop(0, 'rgba(255,255,255,1)'); p.addColorStop(.12, `rgba(${t},.95)`); p.addColorStop(.35, `rgba(${t},.28)`); p.addColorStop(1, `rgba(${t},0)`);
        g.fillStyle = p; g.fillRect(0, 0, h * 2, h * 2);
    }));
    const BRIGHT = TEMPS.map(t => sprite(128, (g, h) => {
        const halo = g.createRadialGradient(h, h, 0, h, h, h * .55);
        halo.addColorStop(0, `rgba(${t},.28)`); halo.addColorStop(.3, `rgba(${t},.07)`); halo.addColorStop(1, `rgba(${t},0)`);
        g.fillStyle = halo; g.fillRect(0, 0, h * 2, h * 2);
        const spike = (len, wid, alpha, rot) => {
            g.save(); g.translate(h, h); g.rotate(rot);
            const s = g.createLinearGradient(0, -len, 0, len);
            s.addColorStop(0, `rgba(${t},0)`); s.addColorStop(.5, `rgba(255,255,255,${alpha})`); s.addColorStop(1, `rgba(${t},0)`);
            g.fillStyle = s; g.beginPath(); g.moveTo(0, -len); g.lineTo(wid, 0); g.lineTo(0, len); g.lineTo(-wid, 0); g.closePath(); g.fill(); g.restore();
        };
        spike(h * .85, .9, .24, 0); spike(h * .5, .8, .17, Math.PI / 2);
        const c2 = g.createRadialGradient(h, h, 0, h, h, h * .12);
        c2.addColorStop(0, 'rgba(255,255,255,1)'); c2.addColorStop(.5, `rgba(${t},.8)`); c2.addColorStop(1, `rgba(${t},0)`);
        g.fillStyle = c2; g.fillRect(0, 0, h * 2, h * 2);
    }));

    let W = 0, H = 0, DPR = 1, stars = [], dust = [];
    let DD = 1, time = 0, boost = 0, flare = 0, pending = 0, nextBeat = .4, last = 0, lastY = scrollY;
    const fronts = [];
    let coreEl = null, anim = null, lastPhase = 0;

    function resize() {
        DPR = Math.min(devicePixelRatio || 1, 2);
        W = innerWidth; H = innerHeight;
        cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        const n = Math.round(clamp(W * H / 3400, 110, 420));
        stars = Array.from({ length: n }, () => {
            const z = Math.random() ** 1.6 * .85 + .15, g = Math.random() ** 3;
            return { x: Math.random(), y: Math.random(), z, temp: pickTemp(),
                     r: Math.max(.3, (.45 + 2.4 * Math.sqrt(g)) * (.3 + z * 1.1) * .8), bright: g > .92,
                     op: .22 + Math.random() * .5, lit: 0 };
        });
        dust = Array.from({ length: Math.round(clamp(W * H / 1700, 160, 520)) }, () => ({ x: Math.random(), y: Math.random(), lit: 0, base: .05 + Math.random() * .1 }));
        if (RM) paint();
    }

    function findCore() {
        coreEl = document.querySelector('.light-core');
        anim = null;
        if (coreEl && coreEl.getAnimations) { const a = coreEl.getAnimations(); if (a.length) anim = a[0]; }
    }
    function heart() {
        if (coreEl) { const r = coreEl.getBoundingClientRect(); if (r.width) return [r.left + r.width / 2, r.top + r.height / 2]; }
        return [W / 2, 96];
    }
    function bump(n) { if (!RM) boost = clamp(boost + n, 0, MAXB); }
    window.s33Sky = { bump };

    function beat(str) { flare = Math.max(flare, str); fronts.push({ t0: time, str }); }

    function paint() {
        const sy = scrollY, [hx, hy] = heart();
        ctx.clearRect(0, 0, W, H);
        // a soft pool of light around the heart, breathing with the beat
        const hr = 300 + 90 * flare, ha = .05 + .10 * flare;
        const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
        g.addColorStop(0, `rgba(${POOL},${ha})`); g.addColorStop(1, `rgba(${POOL},0)`);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        // dust, lit by the rings
        for (const d of dust) {
            const x = d.x * W, y = (((d.y * H - sy * .2) % H) + H) % H;
            const dist = Math.hypot(x - hx, y - hy);
            d.lit *= DD;
            for (const f of fronts) {
                const diff = Math.abs((time - f.t0) * V - dist);
                if (diff < 34) d.lit = Math.max(d.lit, f.str * (1 - diff / 34) / (1 + dist / 900));
            }
            ctx.fillStyle = `rgba(${POOL},${Math.min(.9, Math.max(d.lit, d.base))})`;
            ctx.beginPath(); ctx.arc(x, y, 1.15, 0, Math.PI * 2); ctx.fill();
        }
        // stars, drifting a little with the page and blinking when a ring passes
        ctx.globalCompositeOperation = 'lighter';
        for (const st of stars) {
            const x = st.x * W, y = (((st.y * H - sy * (.04 + .12 * st.z)) % H) + H) % H;
            const dist = Math.hypot(x - hx, y - hy);
            st.lit *= DD;
            for (const f of fronts) {
                const diff = Math.abs((time - f.t0) * V - dist);
                if (diff < 40) st.lit = Math.max(st.lit, f.str * (1 - diff / 40) / (1 + dist / 1100));
            }
            ctx.globalAlpha = Math.min(1, st.op * .78 + st.lit * .9);
            if (st.bright) { const sz = st.r * 14 * (1 + st.lit * .5); ctx.drawImage(BRIGHT[st.temp], x - sz / 2, y - sz / 2, sz, sz); }
            else { const sz = st.r * 5.6 * (1 + st.lit * .9); ctx.drawImage(DOT[st.temp], x - sz / 2, y - sz / 2, sz, sz); }
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }

    function frame(now) {
        const dtR = Math.min(.05, (now - last) / 1000); last = now;
        // scrolling anywhere on the page adds speed
        const y = scrollY; if (y !== lastY) { bump(Math.abs(y - lastY) / 600); lastY = y; }
        const ts = 1 + boost;
        boost *= Math.exp(-dtR * .55);
        const dt = dtR * ts;
        time += dt;
        DD = Math.exp(-dt * 1.3);
        flare *= Math.exp(-dt * 2.2);
        if (!coreEl || !coreEl.isConnected) findCore();
        if (anim) {
            // the dot's own CSS beat is the clock: faster when moving, rings born on each beat
            if (anim.playbackRate !== undefined && Math.abs(anim.playbackRate - ts) > .02) { try { anim.updatePlaybackRate(ts); } catch (e) {} }
            const phase = (anim.currentTime || 0) % (PERIOD * 1000);
            if (phase < lastPhase - 500) { beat(1); pending = time + .36; }
            lastPhase = phase;
        } else if (time >= nextBeat) { beat(1); pending = time + .36; nextBeat += PERIOD; }
        if (pending && time >= pending) { beat(.55); pending = 0; }
        for (let i = fronts.length - 1; i >= 0; i--) if ((time - fronts[i].t0) * V > Math.hypot(W, H) + 200) fronts.splice(i, 1);
        paint();
        requestAnimationFrame(frame);
    }

    // anything that moves adds speed
    addEventListener('wheel', e => bump(Math.abs(e.deltaY) / 500), { passive: true });
    let tx = null, ty = null;
    addEventListener('touchstart', e => { const t = e.touches[0]; tx = t.clientX; ty = t.clientY; }, { passive: true });
    addEventListener('touchmove', e => { const t = e.touches[0]; if (tx !== null) bump(Math.hypot(t.clientX - tx, t.clientY - ty) / 350); tx = t.clientX; ty = t.clientY; }, { passive: true });
    addEventListener('pointermove', e => { if (e.pointerType === 'mouse' && e.buttons) bump((Math.abs(e.movementX) + Math.abs(e.movementY)) / 350); }, { passive: true });
    addEventListener('keydown', e => { if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End'].includes(e.key)) bump(.4); });
    addEventListener('resize', resize);

    resize();
    findCore();
    if (RM) { DD = .98; paint(); return; }
    requestAnimationFrame(t => { last = t; frame(t); });
})();
