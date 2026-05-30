/* The Cairn — Test station. Self-contained. Relies on globals: mode, currentStep, renderStep. */
(function(){
    let cur = null;

    function rnd(a, b){ return Math.floor(Math.random() * (b - a + 1)) + a; }
    function r2(v){ return Math.round(v * 100) / 100; }
    function f2(v){ return (Math.round(v * 100) / 100).toString(); }
    function ok(got, exp){
        const g = parseFloat(String(got).trim().replace(',', '.'));
        if(isNaN(g)) return false;
        return Math.abs(g - exp) <= Math.max(0.05, Math.abs(exp) * 0.02);
    }

    function genCenter(){
        let a = [];
        while(a.length < 5) a.push(rnd(1, 15));
        a.sort((x, y) => x - y);
        const n = 5, sum = a.reduce((p, c) => p + c, 0);
        return { mode:'center', a:a, n:n, sum:sum, mean:sum / n, median:a[2] };
    }
    function genSpread(){
        let a = [];
        for(let i = 0; i < 4; i++) a.push(rnd(2, 14));
        const n = 4, sum = a.reduce((p, c) => p + c, 0), mean = sum / n;
        const pile = a.reduce((p, c) => p + (c - mean) * (c - mean), 0);
        const svar = pile / (n - 1), sstd = Math.sqrt(svar);
        return { mode:'spread', a:a, n:n, sum:sum, mean:mean, pile:pile, svar:svar, sstd:sstd };
    }
    function genPairs(){
        let x, y, mx, my, sxy, sx, sy, sx2, sy2, sp, tries = 0;
        do {
            x = []; y = [];
            for(let i = 0; i < 3; i++){ x.push(rnd(2, 10)); y.push(rnd(2, 10)); }
            const n = 3;
            mx = x.reduce((p, c) => p + c, 0) / n;
            my = y.reduce((p, c) => p + c, 0) / n;
            sp = 0; sx2 = 0; sy2 = 0;
            for(let i = 0; i < n; i++){ sp += (x[i] - mx) * (y[i] - my); sx2 += (x[i] - mx) ** 2; sy2 += (y[i] - my) ** 2; }
            sxy = sp / (n - 1); sx = Math.sqrt(sx2 / (n - 1)); sy = Math.sqrt(sy2 / (n - 1));
            tries++;
        } while((sx2 === 0 || sy2 === 0) && tries < 30);
        const r = (sx === 0 || sy === 0) ? 0 : sxy / (sx * sy);
        return { mode:'pairs', x:x, y:y, n:3, mx:mx, my:my, sp:sp, sxy:sxy, sx:sx, sy:sy, r:r };
    }

    function genForMode(){
        if(mode === 'center') return genCenter();
        if(mode === 'spread') return genSpread();
        return genPairs();
    }

    const inputStyle = 'background:#0a0a0b;border:1px solid #27272a;border-radius:6px;color:#fafafa;padding:8px 10px;font-family:inherit;font-size:.95rem;width:130px';
    const btnPrimary = 'background:#a78bfa;color:#0a0a0b;border:none;border-radius:8px;padding:10px 20px;font-family:inherit;font-weight:600;font-size:.85rem;cursor:pointer;margin-right:8px';
    const btnGhost = 'background:#18181b;color:#a1a1aa;border:1px solid #27272a;border-radius:8px;padding:10px 20px;font-family:inherit;font-weight:500;font-size:.85rem;cursor:pointer';

    function fieldRow(label, id){
        return '<div style="margin:12px 0"><label style="display:block;color:#a1a1aa;font-size:.85rem;margin-bottom:5px">' + label + '</label>' +
            '<input id="' + id + '" type="text" inputmode="decimal" placeholder="your answer" style="' + inputStyle + '"></div>';
    }

    function header(title, prompt){
        return '<div class="step-content"><h3>Test — Your Turn</h3>' +
            '<p style="color:#a78bfa;font-weight:500">' + title + '</p>' +
            '<p>' + prompt + '</p>';
    }
    function controls(){
        return '<div style="margin-top:16px">' +
            '<button style="' + btnPrimary + '" onclick="cairnCheck()">Check</button>' +
            '<button style="' + btnGhost + '" onclick="cairnNew()">New problem</button></div>' +
            '<div id="cairn-feedback" style="margin-top:16px"></div></div>';
    }

    function renderTest(el){
        if(!cur || cur.mode !== mode) cur = genForMode();
        let h = '';
        if(cur.mode === 'center'){
            h = header('Find the center.', 'For this sample (already sorted), give the <strong>mean</strong> (2 decimals) and the <strong>median</strong>.');
            h += '<div class="data-card"><div class="data-title">Sample, n = 5</div><table class="data-table"><tr><th>xᵢ</th><td>' +
                cur.a.join('</td><td>') + '</td></tr></table></div>';
            h += fieldRow('Mean X̄', 'cn-mean');
            h += fieldRow('Median', 'cn-median');
        } else if(cur.mode === 'spread'){
            h = header('Measure the spread.', 'This is a <strong>sample</strong> (n = 4). Give the sample variance <strong>Sₓ²</strong> and standard deviation <strong>Sₓ</strong> (2 decimals).');
            h += '<div class="data-card"><div class="data-title">Sample, n = 4</div><table class="data-table"><tr><th>xᵢ</th><td>' +
                cur.a.join('</td><td>') + '</td></tr></table></div>';
            h += fieldRow('Sample variance Sₓ²', 'sp-var');
            h += fieldRow('Standard deviation Sₓ', 'sp-std');
        } else {
            h = header('Do they move together?', 'Paired <strong>sample</strong> (n = 3). Give the covariance <strong>Sₓᵧ</strong> and correlation <strong>Rₓᵧ</strong> (2 decimals).');
            h += '<div class="data-card"><div class="data-title">Paired sample, n = 3</div><table class="data-table"><tr><th>xᵢ</th><td>' +
                cur.x.join('</td><td>') + '</td></tr><tr><th>yᵢ</th><td>' + cur.y.join('</td><td>') + '</td></tr></table></div>';
            h += fieldRow('Covariance Sₓᵧ', 'pr-cov');
            h += fieldRow('Correlation Rₓᵧ', 'pr-r');
        }
        h += controls();
        el.innerHTML = h;
    }

    function feedback(good, html){
        const fb = document.getElementById('cairn-feedback');
        if(!fb) return;
        const color = good ? '#22c55e' : '#ef4444';
        const label = good ? 'Correct — the stones line up.' : 'Not quite — walk it again:';
        fb.innerHTML = '<div style="border:1px solid ' + color + '40;background:' + color + '10;border-radius:8px;padding:14px 18px">' +
            '<div style="color:' + color + ';font-weight:600;margin-bottom:8px;font-size:.9rem">' + label + '</div>' +
            '<div style="color:#a1a1aa;font-size:.85rem;line-height:1.8">' + html + '</div></div>';
    }

    window.cairnNew = function(){ cur = genForMode(); currentStep = 5; renderStep(); };

    window.cairnCheck = function(){
        if(!cur) return;
        if(cur.mode === 'center'){
            const gm = document.getElementById('cn-mean').value, gd = document.getElementById('cn-median').value;
            const good = ok(gm, cur.mean) && ok(gd, cur.median);
            feedback(good,
                'X̄ = (' + cur.a.join(' + ') + ') / 5 = ' + cur.sum + ' / 5 = <strong>' + f2(cur.mean) + '</strong><br>' +
                'Median = the 3rd value (position (5+1)/2 = 3) = <strong>' + cur.median + '</strong>');
        } else if(cur.mode === 'spread'){
            const gv = document.getElementById('sp-var').value, gs = document.getElementById('sp-std').value;
            const good = ok(gv, cur.svar) && ok(gs, cur.sstd);
            const sqs = cur.a.map(c => '(' + c + '−' + f2(cur.mean) + ')²').join(' + ');
            feedback(good,
                'X̄ = ' + cur.sum + ' / 4 = <strong>' + f2(cur.mean) + '</strong><br>' +
                'Pile = ' + sqs + ' = <strong>' + f2(cur.pile) + '</strong><br>' +
                'Sₓ² = pile / (n−1) = ' + f2(cur.pile) + ' / 3 = <strong>' + f2(cur.svar) + '</strong><br>' +
                'Sₓ = √' + f2(cur.svar) + ' = <strong>' + f2(cur.sstd) + '</strong>');
        } else {
            const gc = document.getElementById('pr-cov').value, gr = document.getElementById('pr-r').value;
            const good = ok(gc, cur.sxy) && ok(gr, cur.r);
            const prods = cur.x.map((xv, i) => '(' + xv + '−' + f2(cur.mx) + ')(' + cur.y[i] + '−' + f2(cur.my) + ')').join(' + ');
            feedback(good,
                'X̄ = <strong>' + f2(cur.mx) + '</strong>, Ȳ = <strong>' + f2(cur.my) + '</strong><br>' +
                'Pile = ' + prods + ' = <strong>' + f2(cur.sp) + '</strong><br>' +
                'Sₓᵧ = pile / (n−1) = ' + f2(cur.sp) + ' / 2 = <strong>' + f2(cur.sxy) + '</strong><br>' +
                'Sₓ = ' + f2(cur.sx) + ', Sᵧ = ' + f2(cur.sy) + '<br>' +
                'Rₓᵧ = Sₓᵧ / (Sₓ · Sᵧ) = ' + f2(cur.sxy) + ' / ' + f2(cur.sx * cur.sy) + ' = <strong>' + f2(cur.r) + '</strong>');
        }
    };

    function ensureTestBtn(){
        const nav = document.getElementById('step-nav');
        if(!nav || nav.querySelector('[data-step="5"]')) return;
        const btn = document.createElement('button');
        btn.className = 'step-btn';
        btn.setAttribute('data-step', '5');
        btn.textContent = 'Test — Your Turn';
        btn.addEventListener('click', () => { currentStep = 5; renderStep(); });
        nav.appendChild(btn);
    }

    const origRender = window.renderStep;
    window.renderStep = function(){
        ensureTestBtn();
        if(currentStep === 5){
            document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
            const tb = document.querySelector('.step-btn[data-step="5"]');
            if(tb) tb.classList.add('active');
            renderTest(document.getElementById('step-container'));
        } else {
            if(cur && cur.mode !== mode) cur = null;
            origRender();
        }
    };

    ensureTestBtn();
})();