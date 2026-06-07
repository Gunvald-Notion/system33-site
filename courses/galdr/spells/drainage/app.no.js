/* === DRAINAGE-MOTOR (norsk) === */
/* === FASTE DATA === */
const N = 10, S = 3;

let q1 = null, q2 = null, formula = null;

function factorial(n){ let r=1; for(let i=2;i<=n;i++) r*=i; return r; }
function permut(n,s){ let r=1; for(let i=0;i<s;i++) r*=(n-i); return r; }
function combin(n,s){ return permut(n,s)/factorial(s); }
function fmtBig(v){
    if(v===null) return '—';
    if(v>999999999999) return v.toExponential(4);
    return v.toLocaleString('en-US');
}

/* === STEG-NAV === */
const stepBtns = document.querySelectorAll('.step-btn');
const stepEls = [1,2,3,4].map(i => document.getElementById('step-'+i));
function showStep(n){
    stepBtns.forEach(b => b.classList.remove('active'));
    stepBtns[n-1].classList.add('active');
    stepEls.forEach(s => s.classList.add('hidden'));
    stepEls[n-1].classList.remove('hidden');
    if(n===2) renderProcess();
    if(n===4) showResult();
}
stepBtns.forEach(b => b.addEventListener('click', () => showStep(parseInt(b.dataset.step))));

/* === STEG 1: PLANTEGNING === */
const gridCells = { ns:document.getElementById('g-ns'), npr:document.getElementById('g-npr'), ncr:document.getElementById('g-ncr'), na:document.getElementById('g-na') };
function updateGrid(){
    Object.values(gridCells).forEach(c => { c.classList.remove('cell-active'); c.classList.add('cell-dim'); });
    formula = null;
    if(q1&&q2){
        if(q1==='ordered'&&q2==='refills'){ formula='ns'; gridCells.ns.classList.add('cell-active'); gridCells.ns.classList.remove('cell-dim'); }
        else if(q1==='ordered'&&q2==='drains'){ formula='npr'; gridCells.npr.classList.add('cell-active'); gridCells.npr.classList.remove('cell-dim'); }
        else if(q1==='unordered'&&q2==='drains'){ formula='ncr'; gridCells.ncr.classList.add('cell-active'); gridCells.ncr.classList.remove('cell-dim'); }
        else{ gridCells.na.classList.add('cell-active'); gridCells.na.classList.remove('cell-dim'); }
        const el = document.getElementById('blueprint-result');
        const names={ns:'Nˢ — bassenget fylles på nytt, rekkefølge teller',npr:'nPr — bassenget tømmes, rekkefølge teller',ncr:'nCr — bassenget tømmes, rekkefølge faller bort'};
        if(formula){ el.textContent='Formel: '+names[formula]; el.classList.remove('hidden'); el.style.color='var(--accent)'; stepBtns[0].classList.add('done'); }
        else{ el.textContent='Ikke pensum'; el.classList.remove('hidden'); el.style.color='var(--muted)'; }
        drawTreeViz();
    }
}
document.querySelectorAll('#q1-opts .q-opt').forEach(o=>{
    o.addEventListener('click',()=>{
        document.querySelectorAll('#q1-opts .q-opt').forEach(x=>x.classList.remove('active'));
        o.classList.add('active'); q1=o.dataset.val; updateGrid();
    });
});
document.querySelectorAll('#q2-opts .q-opt').forEach(o=>{
    o.addEventListener('click',()=>{
        document.querySelectorAll('#q2-opts .q-opt').forEach(x=>x.classList.remove('active'));
        o.classList.add('active'); q2=o.dataset.val; updateGrid();
    });
});

/* === TRE-VISUALISERING === */
function drawTreeViz(){
    if(!formula) return;

    const names={ns:'Nˢ — bassenget holder seg fullt',npr:'nPr — bassenget tømmes',ncr:'nCr — bassenget tømmes, så faller rekkefølgen bort'};
    document.getElementById('tree-intro').textContent = names[formula];

    const wrap = document.getElementById('tree-wrap');
    const canvas = document.getElementById('tree-canvas');
    const dpr = window.devicePixelRatio || 1;
    const cw = wrap.clientWidth - 18;
    const rowH = 80;
    const topPad = 40;
    const ch = topPad + S * rowH + 60;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = cw + 'px';
    canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, cw, ch);

    const R = 6;
    const accent = '#a78bfa';
    const accentDim = 'rgba(167,139,250,0.12)';
    const accentHi = 'rgba(167,139,250,0.35)';
    const linec = 'rgba(167,139,250,0.15)';
    const lineHi = 'rgba(167,139,250,0.4)';
    const muted = '#71717a';
    const green = '#22c55e';
    const red = '#ef4444';
    const text2 = '#a1a1aa';
    const midX = cw / 2;

    function poolAt(round){ return formula === 'ns' ? N : N - round; }

    // Rotnode
    const rootY = topPad;
    ctx.beginPath();
    ctx.arc(midX, rootY, R + 4, 0, Math.PI * 2);
    ctx.fillStyle = accentHi;
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = '#fafafa';
    ctx.font = 'bold 10px Inter,sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(N.toString(), midX, rootY);

    ctx.fillStyle = muted;
    ctx.font = '10px Inter,sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Basseng: ' + N, midX + R + 10, rootY);

    let prevHiX = midX;
    let prevY = rootY;

    for (let lv = 0; lv < S; lv++) {
        const pool = poolAt(lv);
        const y = topPad + (lv + 1) * rowH;

        // Radbredden krymper for å vise tømmingen
        const baseFrac = 0.88;
        const frac = formula === 'ns' ? baseFrac : baseFrac * (pool / N);
        const rowW = Math.max(cw * frac, 80);
        const startX = midX - rowW / 2;
        const spacing = rowW / (pool + 1);

        // Vifteliner fra forrige markerte node
        for (let i = 0; i < pool; i++) {
            const dotX = startX + spacing * (i + 1);
            ctx.beginPath();
            ctx.moveTo(prevHiX, prevY + R + 2);
            ctx.lineTo(dotX, y - R - 1);
            ctx.strokeStyle = i === 0 ? lineHi : linec;
            ctx.lineWidth = i === 0 ? 1.5 : 0.6;
            ctx.stroke();
        }

        // Tegn prikker
        for (let i = 0; i < pool; i++) {
            const dotX = startX + spacing * (i + 1);
            ctx.beginPath();
            ctx.arc(dotX, y, R, 0, Math.PI * 2);
            ctx.fillStyle = i === 0 ? accentHi : accentDim;
            ctx.fill();
            ctx.strokeStyle = i === 0 ? accent : 'rgba(167,139,250,0.4)';
            ctx.lineWidth = i === 0 ? 1.5 : 1;
            ctx.stroke();
        }

        // Etikett til høyre
        ctx.fillStyle = text2;
        ctx.font = '11px Inter,sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('Runde ' + (lv + 1) + ': ' + pool, cw - 4, y);
        if (formula !== 'ns' && lv > 0) {
            ctx.fillStyle = red;
            ctx.font = '9px Inter,sans-serif';
            ctx.fillText('−1', cw - 4, y + 13);
        }

        prevHiX = startX + spacing;
        prevY = y;
    }

    // Total nederst
    const totalY = topPad + S * rowH + 40;
    let parts = [], total = 1;
    for (let i = 0; i < S; i++) { const p = poolAt(i); parts.push(p); total *= p; }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    if (formula === 'ncr') {
        ctx.fillStyle = green;
        ctx.font = 'bold 13px Inter,sans-serif';
        ctx.fillText(parts.join(' × ') + ' = ' + fmtBig(total) + '  ordnet', midX, totalY - 10);
        const fact = factorial(S);
        ctx.fillStyle = text2;
        ctx.font = '12px Inter,sans-serif';
        ctx.fillText('÷ ' + S + '! = ÷ ' + fmtBig(fact) + ' = ' + fmtBig(total / fact) + ' grupper', midX, totalY + 10);
    } else {
        ctx.fillStyle = green;
        ctx.font = 'bold 13px Inter,sans-serif';
        ctx.fillText(parts.join(' × ') + ' = ' + fmtBig(total) + ' måter', midX, totalY);
    }
}

/* === STEG 2: PROSESS (ren framgangsmåte, ingen tall) === */
function renderProcess(){
    const body = document.getElementById('process-body');
    if(!formula){
        document.getElementById('process-desc').textContent = 'Velg en formel i Steg 1 først.';
        body.innerHTML = ''; return;
    }
    document.getElementById('process-desc').textContent = '';

    if(formula==='npr'){
        document.getElementById('process-title').textContent = 'Steg 2 — nPr-prosessen';
        body.innerHTML = '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
            '<div class="proc-step"><strong>1.</strong> Skriv N! — hele fakultetet, hvert element renner ut.</div>'+
            '<div class="proc-step"><strong>2.</strong> Del på (N−S)! — stryk rundene du ikke brukte.</div>'+
            '<div class="proc-step"><strong>3.</strong> Det som står igjen: S faktorer på rad, hver mindre enn den forrige.</div>'+
            '<div class="proc-step" style="margin-top:8px;color:var(--accent)">nPr = N! / (N−S)!</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">Hvorfor det virker</div>'+
            '<div class="proc-step">Hver runde velger fra et basseng som krymper. Runde 1 har N valg, runde 2 har N−1, runde 3 har N−2, og så videre. Å gange sammen S krympende runder gir det ordnede antallet.</div>'+
            '</div>';
    } else if(formula==='ncr'){
        document.getElementById('process-title').textContent = 'Steg 2 — nCr-prosessen';
        body.innerHTML = '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
            '<div class="proc-step"><strong>1.</strong> Gjør nPr-prosessen — S runder tømmer bassenget.</div>'+
            '<div class="proc-step"><strong>2.</strong> Del på S! — antall rekkefølger. S elementer kan ordnes på S! måter, men rekkefølgen teller ikke her.</div>'+
            '<div class="proc-step" style="margin-top:8px;color:var(--accent)">nCr = N! / (S! × (N−S)!) = nPr / S!</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">Hvorfor det virker</div>'+
            '<div class="proc-step">nPr teller hver oppstilling. Men hvis rekkefølgen ikke teller, ble hver gruppe på S talt S! ganger (én gang per rekkefølge). Å dele slår sammen disse duplikatene til én gruppe.</div>'+
            '</div>';
    } else if(formula==='ns'){
        document.getElementById('process-title').textContent = 'Steg 2 — Nˢ-prosessen';
        body.innerHTML = '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
            '<div class="proc-step"><strong>1.</strong> Hver runde har N valg. Bassenget fylles på nytt etter hvert valg.</div>'+
            '<div class="proc-step"><strong>2.</strong> Gang N med seg selv, S ganger.</div>'+
            '<div class="proc-step" style="margin-top:8px;color:var(--accent)">Nˢ = N × N × … (S ganger)</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">Hvorfor det virker</div>'+
            '<div class="proc-step">Ingen tømming. Bassenget holder seg fullt. Hver runde er uavhengig med de samme N valgene, så totalen er N ganget S ganger.</div>'+
            '</div>';
    }
}

/* === STEG 4: RESULTAT (alltid N=10, S=3) === */
function showResult(){
    if(!formula){
        document.getElementById('formula-desc').textContent = 'Velg en formel i Steg 1 først.';
        document.getElementById('derivation-box').innerHTML = '';
        document.getElementById('result-box').classList.add('hidden');
        return;
    }
    const n=N, s=S;
    const dbox = document.getElementById('derivation-box');
    const rbox = document.getElementById('result-box');
    let dHTML='', name='', fStr='', value=0, desc='';

    if(formula==='ns'){
        value=Math.pow(n,s);
        name='Nˢ — Bassenget fylles på nytt';
        desc=s+' runder, hver med '+n+' valg.';
        fStr=n+'ˢ = '+fmtBig(value);
        dHTML='<div class="derivation"><div class="d-label">Utregning</div>';
        dHTML+='<div class="d-line">'+Array(s).fill(n).join(' × ')+'</div>';
        dHTML+='<div class="d-line"><strong>= '+fmtBig(value)+'</strong></div></div>';
    } else if(formula==='npr'){
        value=permut(n,s);
        name='nPr — Ordnet tømming';
        desc=s+' elementer forlater et basseng på '+n+'. Rekkefølgen teller.';
        let parts=[];
        for(let i=0;i<s;i++) parts.push(n-i);
        fStr=parts.join(' × ')+' = '+fmtBig(value);
        dHTML='<div class="derivation"><div class="d-label">Hvor hver runde kommer fra</div>';
        dHTML+='<div class="d-line">N! / (N−S)! = '+n+'! / '+(n-s)+'!</div>';
        dHTML+='<div class="d-line">Stryk '+(n-s)+'! fra nevneren. Rundene som står igjen:</div>';
        for(let i=0;i<s;i++) dHTML+='<div class="d-line">Runde '+(i+1)+': <strong>'+(n-i)+'</strong> ← bassenget mistet '+i+'</div>';
        dHTML+='<div class="d-line" style="margin-top:6px"><strong>'+parts.join(' × ')+' = '+fmtBig(value)+'</strong></div></div>';
    } else if(formula==='ncr'){
        const perm=permut(n,s), cost=factorial(s);
        value=combin(n,s);
        name='nCr — Uordnet tømming';
        desc='Samme '+s+' tømmingsrunder, så ÷ '+s+'! for å fjerne rekkefølgen.';
        let parts=[];
        for(let i=0;i<s;i++) parts.push(n-i);
        fStr=fmtBig(perm)+' ÷ '+fmtBig(cost)+' = '+fmtBig(value);
        dHTML='<div class="derivation"><div class="d-label">Tømming (samme som nPr)</div>';
        for(let i=0;i<s;i++) dHTML+='<div class="d-line">Runde '+(i+1)+': <strong>'+(n-i)+'</strong></div>';
        dHTML+='<div class="d-line"><strong>'+parts.join(' × ')+' = '+fmtBig(perm)+' ordnet</strong></div></div>';
        dHTML+='<div class="derivation"><div class="d-label">Antall rekkefølger</div>';
        let cp=[]; for(let i=s;i>=1;i--) cp.push(i);
        dHTML+='<div class="d-line">'+s+'! = '+cp.join(' × ')+' = '+fmtBig(cost)+'</div>';
        dHTML+='<div class="d-line">Hver gruppe på '+s+' dukket opp '+fmtBig(cost)+' ganger i ulike rekkefølger.</div></div>';
        dHTML+='<div class="derivation"><div class="d-label">Resultat</div>';
        dHTML+='<div class="d-line"><strong>'+fmtBig(perm)+' ÷ '+fmtBig(cost)+' = '+fmtBig(value)+' grupper</strong></div></div>';
    }
    dbox.innerHTML=dHTML;
    document.getElementById('formula-title').textContent='Steg 4 — '+(formula==='ns'?'Nˢ':formula==='npr'?'nPr':'nCr');
    document.getElementById('formula-desc').textContent=desc;
    document.getElementById('result-name').textContent=name;
    document.getElementById('result-formula').textContent=fStr;
    document.getElementById('result-value').textContent=fmtBig(value);
    rbox.classList.remove('hidden');
    stepBtns[3].classList.add('done');
    stepBtns[2].classList.add('done');
}

/* === NULLSTILL === */
document.getElementById('btn-reset').addEventListener('click',()=>{
    q1=null;q2=null;formula=null;
    document.querySelectorAll('.q-opt').forEach(o=>o.classList.remove('active'));
    Object.values(gridCells).forEach(c=>{c.classList.remove('cell-active');c.classList.add('cell-dim');});
    document.getElementById('blueprint-result').classList.add('hidden');
    document.getElementById('process-body').innerHTML='';
    document.getElementById('derivation-box').innerHTML='';
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('tree-intro').textContent='Velg en formel i Steg 1 for å se hvordan bassenget greiner seg ut.';
    const canvas=document.getElementById('tree-canvas');
    const ctx=canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stepBtns.forEach(b=>b.classList.remove('done'));
    showStep(1);
});

showStep(1);
