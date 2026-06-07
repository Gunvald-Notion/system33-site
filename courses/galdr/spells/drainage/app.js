/* === DRAINAGE ENGINE (English, canonical) === */
/* === FIXED DATA === */
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

/* === STEP NAV === */
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

/* === STEP 1: BLUEPRINT === */
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
        const names={ns:'Nˢ — pool refills, order matters',npr:'nPr — pool drains, order matters',ncr:'nCr — pool drains, order collapsed'};
        if(formula){ el.textContent='Formula: '+names[formula]; el.classList.remove('hidden'); el.style.color='var(--accent)'; stepBtns[0].classList.add('done'); }
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

/* === TREE VISUALIZATION === */
function drawTreeViz(){
    if(!formula) return;

    const names={ns:'Nˢ — pool stays full',npr:'nPr — pool drains',ncr:'nCr — pool drains, then collapse order'};
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

    // Root node
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
    ctx.fillText('Pool: ' + N, midX + R + 10, rootY);

    let prevHiX = midX;
    let prevY = rootY;

    for (let lv = 0; lv < S; lv++) {
        const pool = poolAt(lv);
        const y = topPad + (lv + 1) * rowH;

        // Row width shrinks to show drainage
        const baseFrac = 0.88;
        const frac = formula === 'ns' ? baseFrac : baseFrac * (pool / N);
        const rowW = Math.max(cw * frac, 80);
        const startX = midX - rowW / 2;
        const spacing = rowW / (pool + 1);

        // Fan lines from previous highlighted node
        for (let i = 0; i < pool; i++) {
            const dotX = startX + spacing * (i + 1);
            ctx.beginPath();
            ctx.moveTo(prevHiX, prevY + R + 2);
            ctx.lineTo(dotX, y - R - 1);
            ctx.strokeStyle = i === 0 ? lineHi : linec;
            ctx.lineWidth = i === 0 ? 1.5 : 0.6;
            ctx.stroke();
        }

        // Draw dots
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

        // Right label
        ctx.fillStyle = text2;
        ctx.font = '11px Inter,sans-serif';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText('Round ' + (lv + 1) + ': ' + pool, cw - 4, y);
        if (formula !== 'ns' && lv > 0) {
            ctx.fillStyle = red;
            ctx.font = '9px Inter,sans-serif';
            ctx.fillText('−1', cw - 4, y + 13);
        }

        prevHiX = startX + spacing;
        prevY = y;
    }

    // Total at bottom
    const totalY = topPad + S * rowH + 40;
    let parts = [], total = 1;
    for (let i = 0; i < S; i++) { const p = poolAt(i); parts.push(p); total *= p; }

    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    if (formula === 'ncr') {
        ctx.fillStyle = green;
        ctx.font = 'bold 13px Inter,sans-serif';
        ctx.fillText(parts.join(' × ') + ' = ' + fmtBig(total) + '  ordered', midX, totalY - 10);
        const fact = factorial(S);
        ctx.fillStyle = text2;
        ctx.font = '12px Inter,sans-serif';
        ctx.fillText('÷ ' + S + '! = ÷ ' + fmtBig(fact) + ' = ' + fmtBig(total / fact) + ' groups', midX, totalY + 10);
    } else {
        ctx.fillStyle = green;
        ctx.font = 'bold 13px Inter,sans-serif';
        ctx.fillText(parts.join(' × ') + ' = ' + fmtBig(total) + ' ways', midX, totalY);
    }
}

/* === STEP 2: PROCESS (pure procedure, no numbers) === */
function renderProcess(){
    const body = document.getElementById('process-body');
    if(!formula){
        document.getElementById('process-desc').textContent = 'Select a formula in Step 1 first.';
        body.innerHTML = ''; return;
    }
    document.getElementById('process-desc').textContent = '';

    if(formula==='npr'){
        document.getElementById('process-title').textContent = 'Step 2 — nPr Process';
        body.innerHTML = '<div class="proc-block"><div class="proc-title">Procedure</div>'+
            '<div class="proc-step"><strong>1.</strong> Write N! — the full factorial, every item drains.</div>'+
            '<div class="proc-step"><strong>2.</strong> Divide by (N−S)! — cancel the rounds you didn’t use.</div>'+
            '<div class="proc-step"><strong>3.</strong> What survives: S consecutive factors, each one smaller than the last.</div>'+
            '<div class="proc-step" style="margin-top:8px;color:var(--accent)">nPr = N! / (N−S)!</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">Why it works</div>'+
            '<div class="proc-step">Each round picks from a shrinking pool. Round 1 has N choices, round 2 has N−1, round 3 has N−2, and so on. Multiplying S shrinking rounds gives the ordered count.</div>'+
            '</div>';
    } else if(formula==='ncr'){
        document.getElementById('process-title').textContent = 'Step 2 — nCr Process';
        body.innerHTML = '<div class="proc-block"><div class="proc-title">Procedure</div>'+
            '<div class="proc-step"><strong>1.</strong> Do the nPr process — S rounds drain from the pool.</div>'+
            '<div class="proc-step"><strong>2.</strong> Divide by S! — the costume-count. S items can be ordered S! ways, but order doesn’t matter here.</div>'+
            '<div class="proc-step" style="margin-top:8px;color:var(--accent)">nCr = N! / (S! × (N−S)!) = nPr / S!</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">Why it works</div>'+
            '<div class="proc-step">nPr counts every arrangement. But if order doesn’t matter, each group of S was counted S! times (once per permutation). Dividing collapses those duplicates into one group.</div>'+
            '</div>';
    } else if(formula==='ns'){
        document.getElementById('process-title').textContent = 'Step 2 — Nˢ Process';
        body.innerHTML = '<div class="proc-block"><div class="proc-title">Procedure</div>'+
            '<div class="proc-step"><strong>1.</strong> Every round has N choices. The pool refills after each pick.</div>'+
            '<div class="proc-step"><strong>2.</strong> Multiply N by itself, S times.</div>'+
            '<div class="proc-step" style="margin-top:8px;color:var(--accent)">Nˢ = N × N × … (S times)</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">Why it works</div>'+
            '<div class="proc-step">No drainage. The pool stays full. Every round is independent with the same N options, so the total is N multiplied S times.</div>'+
            '</div>';
    }
}

/* === STEP 4: RESULT (always N=10, S=3) === */
function showResult(){
    if(!formula){
        document.getElementById('formula-desc').textContent = 'Select a formula in Step 1 first.';
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
        name='Nˢ — Pool Refills';
        desc=s+' rounds, each with '+n+' choices.';
        fStr=n+'ˢ = '+fmtBig(value);
        dHTML='<div class="derivation"><div class="d-label">Computation</div>';
        dHTML+='<div class="d-line">'+Array(s).fill(n).join(' × ')+'</div>';
        dHTML+='<div class="d-line"><strong>= '+fmtBig(value)+'</strong></div></div>';
    } else if(formula==='npr'){
        value=permut(n,s);
        name='nPr — Ordered Drainage';
        desc=s+' items leave a pool of '+n+'. Order matters.';
        let parts=[];
        for(let i=0;i<s;i++) parts.push(n-i);
        fStr=parts.join(' × ')+' = '+fmtBig(value);
        dHTML='<div class="derivation"><div class="d-label">Where each round comes from</div>';
        dHTML+='<div class="d-line">N! / (N−S)! = '+n+'! / '+(n-s)+'!</div>';
        dHTML+='<div class="d-line">Cancel '+(n-s)+'! from bottom. Surviving rounds:</div>';
        for(let i=0;i<s;i++) dHTML+='<div class="d-line">Round '+(i+1)+': <strong>'+(n-i)+'</strong> ← pool lost '+i+'</div>';
        dHTML+='<div class="d-line" style="margin-top:6px"><strong>'+parts.join(' × ')+' = '+fmtBig(value)+'</strong></div></div>';
    } else if(formula==='ncr'){
        const perm=permut(n,s), cost=factorial(s);
        value=combin(n,s);
        name='nCr — Unordered Drainage';
        desc='Same '+s+' drainage rounds, then ÷ '+s+'! to collapse order.';
        let parts=[];
        for(let i=0;i<s;i++) parts.push(n-i);
        fStr=fmtBig(perm)+' ÷ '+fmtBig(cost)+' = '+fmtBig(value);
        dHTML='<div class="derivation"><div class="d-label">Drainage (same as nPr)</div>';
        for(let i=0;i<s;i++) dHTML+='<div class="d-line">Round '+(i+1)+': <strong>'+(n-i)+'</strong></div>';
        dHTML+='<div class="d-line"><strong>'+parts.join(' × ')+' = '+fmtBig(perm)+' ordered</strong></div></div>';
        dHTML+='<div class="derivation"><div class="d-label">Costume-count</div>';
        let cp=[]; for(let i=s;i>=1;i--) cp.push(i);
        dHTML+='<div class="d-line">'+s+'! = '+cp.join(' × ')+' = '+fmtBig(cost)+'</div>';
        dHTML+='<div class="d-line">Each group of '+s+' appeared '+fmtBig(cost)+' times in different orders.</div></div>';
        dHTML+='<div class="derivation"><div class="d-label">Result</div>';
        dHTML+='<div class="d-line"><strong>'+fmtBig(perm)+' ÷ '+fmtBig(cost)+' = '+fmtBig(value)+' groups</strong></div></div>';
    }
    dbox.innerHTML=dHTML;
    document.getElementById('formula-title').textContent='Step 4 — '+(formula==='ns'?'Nˢ':formula==='npr'?'nPr':'nCr');
    document.getElementById('formula-desc').textContent=desc;
    document.getElementById('result-name').textContent=name;
    document.getElementById('result-formula').textContent=fStr;
    document.getElementById('result-value').textContent=fmtBig(value);
    rbox.classList.remove('hidden');
    stepBtns[3].classList.add('done');
    stepBtns[2].classList.add('done');
}

/* === RESET === */
document.getElementById('btn-reset').addEventListener('click',()=>{
    q1=null;q2=null;formula=null;
    document.querySelectorAll('.q-opt').forEach(o=>o.classList.remove('active'));
    Object.values(gridCells).forEach(c=>{c.classList.remove('cell-active');c.classList.add('cell-dim');});
    document.getElementById('blueprint-result').classList.add('hidden');
    document.getElementById('process-body').innerHTML='';
    document.getElementById('derivation-box').innerHTML='';
    document.getElementById('result-box').classList.add('hidden');
    document.getElementById('tree-intro').textContent='Pick a formula in Step 1 to see how the pool fans out.';
    const canvas=document.getElementById('tree-canvas');
    const ctx=canvas.getContext('2d');
    ctx.setTransform(1,0,0,1,0,0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stepBtns.forEach(b=>b.classList.remove('done'));
    showStep(1);
});

showStep(1);
