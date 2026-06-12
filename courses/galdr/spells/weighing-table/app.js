/* === FIXED DATA === */
const VAR_X = [1, 2, 3];
const VAR_P = [0.2, 0.5, 0.3];
const VAR_MU = 2.1;
const VAR_CONTRIBS = [
    { x:1, p:0.2, dist:-1.1, sq:1.21, w:0.242 },
    { x:2, p:0.5, dist:-0.1, sq:0.01, w:0.005 },
    { x:3, p:0.3, dist:0.9,  sq:0.81, w:0.243 }
];

const COV_CELLS = [
    { x:0, y:0, p:0.4, dx:-0.5, dy:-0.5, prod:0.25,  vote:0.10,  zone:'together' },
    { x:0, y:1, p:0.1, dx:-0.5, dy:0.5,  prod:-0.25, vote:-0.025, zone:'opposite' },
    { x:1, y:0, p:0.1, dx:0.5,  dy:-0.5, prod:-0.25, vote:-0.025, zone:'opposite' },
    { x:1, y:1, p:0.4, dx:0.5,  dy:0.5,  prod:0.25,  vote:0.10,  zone:'together' }
];

let mode = 'var', currentStep = 1;

/* === MODE SWITCHING === */
document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        mode = b.dataset.mode;
        currentStep = 1;
        document.querySelectorAll('.step-btn').forEach(s => s.classList.remove('done'));
        renderAll();
    });
});

/* === STEP NAV === */
document.querySelectorAll('.step-btn').forEach(b => {
    b.addEventListener('click', () => {
        currentStep = parseInt(b.dataset.step);
        renderStep();
    });
});

function renderAll(){ drawViz(); renderStep(); }

function renderStep(){
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.step-btn')[currentStep-1].classList.add('active');
    const el = document.getElementById('step-container');
    if(mode === 'var') renderVarStep(el);
    else renderCovStep(el);
}

/* === VARIANCE STEPS === */
function renderVarStep(el){
    if(currentStep === 1){
        el.innerHTML = '<div class="step-content"><h3>Step 1 — Blueprint</h3>'+
            '<p>Recognize the question: <strong>how far do the values spread from the center?</strong></p>'+
            '<p>Not any single value’s distance — the average squared distance across all values, weighted by probability. That is the house you’re in.</p>'+
            '<p style="color:var(--accent);font-weight:500;margin-top:12px">Var[X] = Σ (xᵢ − μ)² · P(xᵢ)</p>'+
            '<p style="margin-top:12px">The spell ends in <strong>two</strong> numbers: <strong>μ</strong>, the center — where the values balance — and <strong>σ</strong>, how far they typically sit from it. Var[X] is the pile you build on the way; σ is the answer you can pace out on the line.</p>'+
            '</div>';
    } else if(currentStep === 2){
        el.innerHTML = '<div class="step-content"><h3>Step 2 — The Process</h3>'+
            '<p>Three stages, in sequence — the exact same three you will walk in Step 4. Each stage maps onto one piece of the formula.</p>'+
            '<div class="proc-block"><div class="proc-title">Procedure</div>'+
            '<div class="proc-step"><strong>Stage 1 — Find the center (μ).</strong> E[X] = μ. You need this before anything else, because the whole formula measures distance <em>from</em> this point.</div>'+
            '<div class="proc-step"><strong>Stage 2 — Build the pile (Var).</strong> For each value: subtract μ to get its distance, square it — squaring removes direction (you only care about <em>how far</em>, not <em>which side</em>) and amplifies big gaps — then multiply by P(xᵢ) to weight it. Sum every weighted square with Σ. That pile is Var[X].</div>'+
            '<div class="proc-step"><strong>Stage 3 — Fold back to σ.</strong> The pile is in <em>squared</em>-units — an area floating off the line, not a length. Take its square root to land back on the axis. √Var = σ, the standard deviation: the typical distance from center, in the same units as the values.</div>'+
            '<div class="proc-step" style="margin-top:10px;color:var(--accent)">Stage 2: &nbsp; Var[X] = Σ (xᵢ − μ)² · P(xᵢ)</div>'+
            '<div class="proc-step" style="margin-top:4px;color:var(--accent)">Stage 3: &nbsp; σ = √Var[X]</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">The room</div>'+
            '<div class="proc-step">You’re standing at the center of a room. Each possible value is a person standing somewhere. Some are close, some are far. Each person has a weight — how likely they are to show up. Measure distance, square it, multiply by weight, throw on the pile. The pile is how spread the room is — and its square root is how far, on average, a person stands from you.</div>'+
            '</div></div>';
    } else if(currentStep === 3){
        el.innerHTML = '<div class="step-content"><h3>Step 3 — The Data</h3>'+
            '<p>This station is only for <strong>reading</strong> what you have been handed. No solving yet — look at the table and understand what it describes.</p>'+
            '<div class="data-card"><table class="data-table">'+
            '<tr><th>xᵢ</th><td>1</td><td>2</td><td>3</td></tr>'+
            '<tr><th>P(xᵢ)</th><td>0.2</td><td>0.5</td><td>0.3</td></tr>'+
            '</table></div>'+
            '<p>X can land on three values — 1, 2, or 3 — each with its own probability. The weights add to 1 (0.2 + 0.5 + 0.3 = 1), so this is a complete distribution: nothing is missing, nothing is left over.</p>'+
            '<p>The middle value carries the most weight (0.5), and the two ends are lighter. So before any arithmetic you can already <em>feel</em> where this will balance — somewhere near 2, tugged a little toward 3. That hunch is all you take from this station. Actually finding the center is the first move of the solve — Step 4.</p>'+
            '</div>';
        markDone(2);
    } else if(currentStep === 4){
        let html = '<div class="step-content"><h3>Step 4 — Run the Formula</h3>'+
            '<p>Now the solve — the same three stages from the Process, always in this order. Each stage leans on the one before it, so you never start in the middle.</p>';
        html += '<div class="derivation"><div class="d-label">Stage 1 — Find the center (μ)</div>'+
            '<div class="d-line">You cannot measure a distance until you know the point you measure <em>from</em>. So the first move, every time, is to find the center.</div>'+
            '<div class="d-line">μ = 1×0.2 + 2×0.5 + 3×0.3 = 0.2 + 1.0 + 0.9 = <strong>2.1</strong></div></div>';
        html += '<div class="result-box"><div class="result-box-name">Stage 1 result — the center</div>'+
            '<div class="result-box-formula">μ = Σ xᵢ · P(xᵢ)</div>'+
            '<div class="result-box-value">μ = 2.1</div></div>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Stage 2 — Build the pile.</strong> Now stand at μ = 2.1 and walk to each value: measure the distance, square it, weight it by probability, throw it on the pile.</p>';
        let pile = 0;
        VAR_CONTRIBS.forEach((c, i) => {
            pile += c.w;
            html += '<div class="derivation"><div class="d-label">Round '+(i+1)+': x = '+c.x+'</div>'+
                '<div class="d-line">Distance from center: '+c.x+' − 2.1 = <strong>'+c.dist.toFixed(1)+'</strong></div>'+
                '<div class="d-line">Square: ('+c.dist.toFixed(1)+')² = '+c.sq.toFixed(2)+'</div>'+
                '<div class="d-line">Weight: '+c.sq.toFixed(2)+' × '+c.p+' = <strong>'+c.w.toFixed(3)+'</strong></div>'+
                '<div class="d-line">Pile = '+pile.toFixed(3)+'</div></div>';
        });
        html += '<div class="result-box"><div class="result-box-name">Stage 2 result — the pile, Var[X]</div>'+
            '<div class="result-box-formula">0.242 + 0.005 + 0.243</div>'+
            '<div class="result-box-value">Var[X] = 0.49</div></div>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Stage 3 — Fold back to σ.</strong> The pile lives in squared-units. Undo the squaring to land back on the number line as a real distance.</p>';
        html += '<div class="derivation"><div class="d-label">Stage 3 — Fold the pile back onto the line</div>'+
            '<div class="d-line">The pile is <strong>0.49</strong> — but look at the units. We <em>squared</em> every distance, so 0.49 lives in squared-space: an area floating off the number line, not a distance you can walk.</div>'+
            '<div class="d-line">Undo the square. Take the root: <strong>√0.49 = 0.7</strong>.</div>'+
            '<div class="d-line">That 0.7 is <strong>σ</strong> (sigma) — the <strong>standard deviation</strong>. It is the typical distance a value sits from the center μ = 2.1, measured back on the same axis as the values themselves. Not the gap between the values — the spread, folded back into a real step.</div></div>';
        html += '<div class="result-box"><div class="result-box-name">Stage 3 result — σ, standard deviation</div>'+
            '<div class="result-box-formula">σ = √Var[X] = √0.49</div>'+
            '<div class="result-box-value">σ = 0.7 — typical distance from center</div></div>';
        html += '<p style="color:var(--text2);font-size:.85rem;margin-top:14px">So the distribution <strong>breathes</strong>: from 2.1 − 0.7 = <strong>1.4</strong> out to 2.1 + 0.7 = <strong>2.8</strong>. That band around the center is where the weight mostly sits.</p>';
        html += '<p style="color:var(--text2);font-size:.85rem;margin-top:10px">Values 1 and 3 contribute almost equally (0.242 and 0.243) even though 3 is closer to center — because 1 has a bigger distance and the squaring amplified it. Value 2 contributes almost nothing (0.005) because it sits right next to the center.</p>';
        html += '</div>';
        el.innerHTML = html;
        markDone(3);
    }
}

/* === COVARIANCE STEPS === */
function renderCovStep(el){
    if(currentStep === 1){
        el.innerHTML = '<div class="step-content"><h3>Step 1 — Blueprint</h3>'+
            '<p>Recognize the question: <strong>when X moves, does Y move with it?</strong></p>'+
            '<p>Two variables on a plane. X runs along the bottom, Y up the side. Every observation has both an X-value and a Y-value. The formula checks whether they move in the same direction. <em>(Y is just the name for the second variable — we deliberately use Y, never E, so it can’t be mistaken for Euler’s e from Kap 7.)</em></p>'+
            '<p style="color:var(--accent);font-weight:500;margin-top:12px">Cov(X,Y) = ΣΣ (xᵢ − μ<sub>X</sub>)(yⱼ − μ<sub>Y</sub>) · P(xᵢ, yⱼ)</p>'+
            '<p style="margin-top:12px">The spell ends in <strong>two</strong> numbers: <strong>Cov</strong>, the raw pile of together-vs-apart votes, and <strong>ρ</strong> (rho), that same signal folded onto a fixed −1 to +1 scale so you can judge how <em>strong</em> the link is, not just its direction.</p>'+
            '</div>';
    } else if(currentStep === 2){
        el.innerHTML = '<div class="step-content"><h3>Step 2 — The Process</h3>'+
            '<p>Three stages, in sequence — the exact same three you will walk in Step 4. Each stage maps onto one piece of the formula.</p>'+
            '<div class="proc-block"><div class="proc-title">Procedure</div>'+
            '<div class="proc-step"><strong>Stage 1 — Find both centers (μ<sub>X</sub>, μ<sub>Y</sub>).</strong> Each variable has its own center, found the Kap 5 way — μ = Σ value · P(value) along its own margin. You need both before anything else, because the whole formula measures distance <em>from</em> these two points.</div>'+
            '<div class="proc-step"><strong>Stage 2 — Build the pile (Cov).</strong> Walk every cell of the joint table. At each one: measure X’s distance from μ<sub>X</sub> and Y’s distance from μ<sub>Y</sub>, multiply the two (the direction-detector — same side gives +, opposite sides gives −), then weight by the joint probability P(xᵢ, yⱼ). Sum every weighted vote with ΣΣ. That pile is Cov(X,Y).</div>'+
            '<div class="proc-step"><strong>Stage 3 — Fold to ρ.</strong> Raw covariance is in mixed units and has no fixed ceiling, so its size is hard to read. Divide by each variable’s own spread — σ<sub>X</sub> · σ<sub>Y</sub> — to fold it onto a fixed scale from −1 to +1. ρ is the pure direction signal: how tightly they move together, stripped of units.</div>'+
            '<div class="proc-step" style="margin-top:10px;color:var(--accent)">Stage 2: &nbsp; Cov(X,Y) = ΣΣ (xᵢ − μ<sub>X</sub>)(yⱼ − μ<sub>Y</sub>) · P(xᵢ, yⱼ)</div>'+
            '<div class="proc-step" style="margin-top:4px;color:var(--accent)">Stage 3: &nbsp; ρ = Cov(X,Y) / (σ<sub>X</sub> · σ<sub>Y</sub>)</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">The four zones</div>'+
            '<div class="proc-step">The center point (μ<sub>X</sub>, μ<sub>Y</sub>) splits the plane into four zones. Top-right and bottom-left are “together” zones (same side, positive product). Top-left and bottom-right are “opposite” zones (different sides, negative product). Stage 2 walks every cell, checks which zone it lands in, weights by probability, and piles up.</div>'+
            '</div></div>';
    } else if(currentStep === 3){
        el.innerHTML = '<div class="step-content"><h3>Step 3 — The Data</h3>'+
            '<p>This station is only for <strong>reading</strong> what you have been handed. No solving yet — look at the joint table and understand what it describes.</p>'+
            '<div class="data-card"><div class="data-title">Joint probability table</div><table class="data-table">'+
            '<tr><th></th><th>X = 0</th><th>X = 1</th></tr>'+
            '<tr><th>Y = 1</th><td>0.1</td><td>0.4</td></tr>'+
            '<tr><th>Y = 0</th><td>0.4</td><td>0.1</td></tr>'+
            '</table></div>'+
            '<p>X and Y each land on 0 or 1, so the table has four cells — one for every (X, Y) combination. The four probabilities add to 1 (0.4 + 0.1 + 0.1 + 0.4 = 1), so this is a complete joint distribution: nothing is missing.</p>'+
            '<p>Look at where the mass sits. The heavy cells (0.4 each) are the ones where X and Y <em>agree</em> — both 0, or both 1. The light cells (0.1 each) are where they disagree. So before any arithmetic you can already <em>feel</em> the lean: these two seem to rise and fall together. That hunch is all you take from this station. Finding the two centers, and then proving the lean with a number, is the solve — Step 4.</p>'+
            '</div>';
        markDone(2);
    } else if(currentStep === 4){
        let html = '<div class="step-content"><h3>Step 4 — Run the Formula</h3>'+
            '<p>Now the solve — the same three stages from the Process, always in this order. Each stage leans on the one before it, so you never start in the middle.</p>';
        html += '<div class="derivation"><div class="d-label">Stage 1 — Find both centers (μ<sub>X</sub>, μ<sub>Y</sub>)</div>'+
            '<div class="d-line">You cannot measure a distance until you know the points you measure <em>from</em>. Each variable has its own center, found along its own margin (add across the row or column).</div>'+
            '<div class="d-line">P(X=0) = 0.4 + 0.1 = 0.5, &nbsp; P(X=1) = 0.1 + 0.4 = 0.5 &nbsp;→&nbsp; μ<sub>X</sub> = 0×0.5 + 1×0.5 = <strong>0.5</strong></div>'+
            '<div class="d-line">P(Y=0) = 0.4 + 0.1 = 0.5, &nbsp; P(Y=1) = 0.1 + 0.4 = 0.5 &nbsp;→&nbsp; μ<sub>Y</sub> = 0×0.5 + 1×0.5 = <strong>0.5</strong></div></div>';
        html += '<div class="result-box"><div class="result-box-name">Stage 1 result — the two centers</div>'+
            '<div class="result-box-formula">μ<sub>X</sub> = Σ xᵢ · P(xᵢ) &nbsp;&nbsp; μ<sub>Y</sub> = Σ yⱼ · P(yⱼ)</div>'+
            '<div class="result-box-value">μ<sub>X</sub> = 0.5 &nbsp;&middot;&nbsp; μ<sub>Y</sub> = 0.5</div></div>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Stage 2 — Build the pile.</strong> Now stand at the center point (0.5, 0.5) and walk each cell: measure both distances, multiply them (direction-detector), weight by the joint probability, throw the vote on the pile.</p>';
        const labels = ['Bottom-left (X=0, Y=0)', 'Top-left (X=0, Y=1)', 'Bottom-right (X=1, Y=0)', 'Top-right (X=1, Y=1)'];
        let pile = 0;
        [0,1,2,3].forEach((idx, i) => {
            const c = COV_CELLS[idx];
            pile += c.vote;
            const dir = c.zone === 'together' ? 'Same side → positive' : 'Opposite sides → negative';
            const voteColor = c.vote > 0 ? 'var(--green)' : 'var(--red)';
            const voteWord = c.vote > 0 ? 'together' : 'apart';
            html += '<div class="derivation"><div class="d-label">'+labels[i]+'</div>'+
                '<div class="d-line">X distance: '+c.x+' − 0.5 = '+c.dx.toFixed(1)+' &nbsp; Y distance: '+c.y+' − 0.5 = '+c.dy.toFixed(1)+'</div>'+
                '<div class="d-line">Direction-detector: ('+c.dx.toFixed(1)+')('+c.dy.toFixed(1)+') = '+c.prod.toFixed(2)+' &nbsp; <span style="color:var(--muted)">'+dir+'</span></div>'+
                '<div class="d-line">Weight: '+c.prod.toFixed(2)+' × '+c.p+' = <strong style="color:'+voteColor+'">'+c.vote.toFixed(3)+'</strong> — vote <em>'+voteWord+'</em></div>'+
                '<div class="d-line">Pile = '+pile.toFixed(3)+'</div></div>';
        });
        html += '<div class="result-box"><div class="result-box-name">Stage 2 result — the pile, Cov(X,Y)</div>'+
            '<div class="result-box-formula">+0.10 − 0.025 − 0.025 + 0.10</div>'+
            '<div class="result-box-value" style="color:var(--green)">Cov(X,Y) = +0.15</div></div>';
        html += '<p style="color:var(--text2);font-size:.85rem;margin-top:14px">Positive — the together votes won. But +0.15 on its own is hard to read: is that a strong link or a weak one? The raw number is in mixed X·Y units and has no fixed ceiling. That’s what Stage 3 fixes.</p>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Stage 3 — Fold to ρ.</strong> Scale the raw pile by each variable’s own spread so it lands on a fixed, readable range.</p>';
        html += '<div class="derivation"><div class="d-label">Stage 3 — Fold the covariance onto the [−1, 1] scale</div>'+
            '<div class="d-line">First, each variable’s own spread — the Kap 5 table applied to each margin. Both X and Y are 0/1 variables centered at 0.5:</div>'+
            '<div class="d-line">Var = (0−0.5)²×0.5 + (1−0.5)²×0.5 = 0.25 &nbsp;→&nbsp; σ<sub>X</sub> = σ<sub>Y</sub> = √0.25 = <strong>0.5</strong></div>'+
            '<div class="d-line">Now divide the covariance by the product of the spreads: ρ = 0.15 / (0.5 × 0.5) = 0.15 / 0.25 = <strong>0.6</strong></div>'+
            '<div class="d-line">ρ = 0.6 is unitless and bounded: 0 means no linear link, +1 perfectly locked together, −1 perfectly opposed. So +0.6 is a <strong>moderately strong positive</strong> link — now you can judge the <em>size</em>, which the raw covariance never let you do.</div></div>';
        html += '<div class="result-box"><div class="result-box-name">Stage 3 result — ρ, correlation</div>'+
            '<div class="result-box-formula">ρ = Cov(X,Y) / (σ<sub>X</sub> · σ<sub>Y</sub>) = 0.15 / 0.25</div>'+
            '<div class="result-box-value" style="color:var(--green)">ρ = 0.6 — moderately strong, positive</div></div>';
        html += '</div>';
        el.innerHTML = html;
        markDone(3);
    }
}

function markDone(upTo){
    document.querySelectorAll('.step-btn').forEach((b,i) => {
        if(i < upTo) b.classList.add('done');
    });
}

/* === VISUALIZATIONS === */
function drawViz(){
    if(mode === 'var') drawVarianceViz();
    else drawCovarianceViz();
}

function drawVarianceViz(){
    document.getElementById('viz-label').textContent = 'The Spread';
    document.getElementById('viz-title').textContent = 'Distance from Center';
    document.getElementById('viz-desc').textContent = 'Three values measured from μ = 2.1. The green span is σ = 0.7 — one typical step from center. Bars = each value’s contribution to the pile.';

    const wrap = document.getElementById('viz-wrap');
    const canvas = document.getElementById('viz-canvas');
    const dpr = window.devicePixelRatio || 1;
    const cw = wrap.clientWidth - 18;
    const ch = 400;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, cw, ch);

    const accent = '#a78bfa', green = '#22c55e', text2 = '#a1a1aa', muted = '#71717a', border = '#27272a';

    const lineY = 55;
    const padL = 50, padR = 50;
    const rangeW = cw - padL - padR;
    const xMin = 0.5, xMax = 3.5;
    function toX(v){ return padL + (v - xMin) / (xMax - xMin) * rangeW; }

    ctx.beginPath(); ctx.moveTo(padL, lineY); ctx.lineTo(cw - padR, lineY);
    ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.stroke();

    [1, 2, 3].forEach(v => {
        const x = toX(v);
        ctx.beginPath(); ctx.moveTo(x, lineY - 5); ctx.lineTo(x, lineY + 5);
        ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 1; ctx.stroke();
    });

    const muX = toX(VAR_MU);
    ctx.beginPath(); ctx.setLineDash([4, 3]);
    ctx.moveTo(muX, lineY - 28); ctx.lineTo(muX, lineY + 28);
    ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = accent; ctx.font = 'bold 12px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('μ = 2.1', muX, lineY - 30);

    VAR_CONTRIBS.forEach(c => {
        const x = toX(c.x);
        const r = 14;
        ctx.beginPath(); ctx.arc(x, lineY, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.2)'; ctx.fill();
        ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#fafafa'; ctx.font = 'bold 12px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(c.x.toString(), x, lineY);
    });

    const sig = 0.7;
    const sLeft = toX(VAR_MU - sig), sRight = toX(VAR_MU + sig);
    const bandY = 90;
    ctx.strokeStyle = 'rgba(34,197,94,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(muX, lineY + 14); ctx.lineTo(muX, bandY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(sLeft, bandY); ctx.lineTo(sRight, bandY);
    ctx.strokeStyle = green; ctx.lineWidth = 1.5; ctx.stroke();
    [sLeft, muX, sRight].forEach(xx => {
        ctx.beginPath(); ctx.moveTo(xx, bandY - 5); ctx.lineTo(xx, bandY + 5);
        ctx.strokeStyle = green; ctx.lineWidth = 1.5; ctx.stroke();
    });
    ctx.fillStyle = green; ctx.font = 'bold 10px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('← σ = 0.7', (sLeft + muX) / 2, bandY - 4);
    ctx.fillText('σ = 0.7 →', (sRight + muX) / 2, bandY - 4);
    ctx.fillStyle = text2; ctx.font = '10px Inter,sans-serif'; ctx.textBaseline = 'top';
    ctx.fillText('1.4', sLeft, bandY + 7);
    ctx.fillText('2.8', sRight, bandY + 7);

    const cardTop = 124;
    const cardH = 52;
    const cardW = Math.min((cw - 40) / 3 - 8, 200);
    const totalCardsW = 3 * cardW + 2 * 12;
    const cardStartX = (cw - totalCardsW) / 2;

    VAR_CONTRIBS.forEach((c, i) => {
        const cx = cardStartX + i * (cardW + 12);
        const cy = cardTop;
        ctx.fillStyle = 'rgba(167,139,250,0.05)';
        ctx.strokeStyle = 'rgba(167,139,250,0.15)';
        ctx.lineWidth = 1;
        roundRect(ctx, cx, cy, cardW, cardH, 6);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fafafa'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('x = ' + c.x, cx + 8, cy + 7);
        ctx.fillStyle = muted; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('P = ' + c.p, cx + cardW - 8, cy + 7);
        ctx.fillStyle = text2; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('dist: ' + c.dist.toFixed(1) + '  →  sq: ' + c.sq.toFixed(2), cx + 8, cy + 25);
        ctx.fillStyle = accent; ctx.font = 'bold 10px Inter,sans-serif';
        ctx.fillText('×' + c.p + ' = ' + c.w.toFixed(3), cx + 8, cy + 38);
    });

    const barTop = 199;
    const barH = 28;
    const barSpacing = 42;
    const maxBarW = cw - 160;
    const maxW = 0.243;

    ctx.fillStyle = muted; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('Contribution to pile', cw / 2, barTop - 6);

    VAR_CONTRIBS.forEach((c, i) => {
        const by = barTop + i * barSpacing;
        const bw = (c.w / maxW) * maxBarW;
        ctx.fillStyle = text2; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText('x = ' + c.x, 55, by + barH / 2);
        const barX = 65;
        ctx.fillStyle = c.w > 0.1 ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.08)';
        roundRect(ctx, barX, by, Math.max(bw, 4), barH, 4);
        ctx.fill();
        ctx.strokeStyle = c.w > 0.1 ? accent : 'rgba(167,139,250,0.3)';
        ctx.lineWidth = 1;
        roundRect(ctx, barX, by, Math.max(bw, 4), barH, 4);
        ctx.stroke();
        ctx.fillStyle = '#fafafa'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(c.w.toFixed(3), barX + Math.max(bw, 4) + 8, by + barH / 2);
    });

    const totalY = barTop + 3 * barSpacing + 5;
    ctx.fillStyle = green; ctx.font = 'bold 14px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('Pile = 0.49', cw / 2, totalY);
    ctx.fillStyle = text2; ctx.font = '12px Inter,sans-serif';
    ctx.fillText('σ = √0.49 = 0.7 = typical step from μ', cw / 2, totalY + 22);
}

function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function drawCovarianceViz(){
    document.getElementById('viz-label').textContent = 'The Plane';
    document.getElementById('viz-title').textContent = 'Four Zones';
    document.getElementById('viz-desc').textContent = 'Together zones (green) vs opposite zones (red). Dot size = probability.';

    const wrap = document.getElementById('viz-wrap');
    const canvas = document.getElementById('viz-canvas');
    const dpr = window.devicePixelRatio || 1;
    const cw =