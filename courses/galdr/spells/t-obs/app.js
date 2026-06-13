/* === STATE === */
var mode='t2',currentStep=1;

var CONF={
    t2:{tobs:2.0,crits:[-2.064,2.064],oneTail:false,useT:true,df:24,
        tobsL:'T_obs = 2.0',result:'behold',
        resultL:'Behold H\u2080 \u2014 barely inside',
        vizTitle:'Tosidig t-test',
        vizDesc:'df = 24, \u03B1 = 0.05. Rejection in both tails (\u03B1/2 = 0.025 each).'},
    t1:{tobs:2.0,crits:[1.711],oneTail:true,useT:true,df:24,
        tobsL:'T_obs = 2.0',result:'forkast',
        resultL:'Forkast H\u2080 \u2014 past the wall',
        vizTitle:'Ensidig t-test',
        vizDesc:'df = 24, \u03B1 = 0.05. Rejection in right tail only.'},
    z2:{tobs:1.0,crits:[-1.96,1.96],oneTail:false,useT:false,df:30,
        tobsL:'z_obs = 1.0',result:'behold',
        resultL:'Behold H\u2080 \u2014 well inside',
        vizTitle:'z-test (tosidig)',
        vizDesc:'\u03C3 known, \u03B1 = 0.05. Normal bell, both tails.'}
};

/* === NAV === */
document.querySelectorAll('.mode-btn').forEach(function(b){
    b.addEventListener('click',function(){
        document.querySelectorAll('.mode-btn').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
        mode=b.dataset.mode;
        currentStep=1;
        document.querySelectorAll('.step-btn').forEach(function(s){s.classList.remove('done');});
        renderAll();
    });
});
document.querySelectorAll('.step-btn').forEach(function(b){
    b.addEventListener('click',function(){
        currentStep=parseInt(b.dataset.step);
        renderStep();
    });
});

function renderAll(){drawViz();renderStep();}
function renderStep(){
    document.querySelectorAll('.step-btn').forEach(function(b){b.classList.remove('active');});
    document.querySelectorAll('.step-btn')[currentStep-1].classList.add('active');
    var el=document.getElementById('step-container');
    if(mode==='t2')el.innerHTML=t2Step(currentStep);
    else if(mode==='t1')el.innerHTML=t1Step(currentStep);
    else el.innerHTML=z2Step(currentStep);
}
function markDone(n){document.querySelectorAll('.step-btn').forEach(function(b,i){if(i<n)b.classList.add('done');});}

/* === TOSIDIG t-TEST STEPS === */
function t2Step(s){
    if(s===1)return '<div class="step-content"><h3>Step 1 \u2014 Blueprint</h3>'+
        '<p>They claim <strong>\u03BC = 120\u2009000</strong>. You have a sample. \u03C3 is unknown \u2192 <strong>t-test</strong>. The question is "is there a difference?" \u2192 <strong>two-tailed</strong>.</p>'+
        '<p><strong>H\u2080:</strong> \u03BC = 120\u2009000 &nbsp;&nbsp; <strong>H\u1D00:</strong> \u03BC \u2260 120\u2009000</p>'+
        '<p>You\'re drawing a bell centered on the claim. Then placing your handful on it and asking: how rare is where it landed?</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Step 2 \u2014 The Process</h3>'+
        '<p>Five steps, in order. Number-blind.</p>'+
        '<div class="proc-block"><div class="proc-title">Construction</div>'+
        '<div class="proc-step"><strong>1. Pour the foundation.</strong> Draw the bell centered on \u03BC\u2080. This is the world <em>if</em> H\u2080 is true.</div>'+
        '<div class="proc-step"><strong>2. Set the width.</strong> The bell\'s tightness comes from s/\u221An. The wobble \u2014 the bell\'s own ruler.</div>'+
        '<div class="proc-step"><strong>3. Mark the walls.</strong> \u03B1 determines the size of the rejection zones. Two-tailed: \u03B1/2 in each tail. The walls sit at \u00B1t<sub>\u03B1/2, df</sub>.</div>'+
        '<div class="proc-step"><strong>4. Place the coordinate.</strong> T<sub>obs</sub> = (x\u0304 \u2212 \u03BC\u2080) / (s/\u221An). The gap in wobbles.</div>'+
        '<div class="proc-step"><strong>5. Compare.</strong> T<sub>obs</sub> past the wall \u2192 forkast. Inside \u2192 behold.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Step 3 \u2014 The Data</h3>'+
        '<p>Ny markedsstrategi. Claim: gjennomsnittlig kvartalsomsetnin is 120\u2009000.</p>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>\u03BC\u2080</th><th>x\u0304</th><th>s</th><th>n</th><th>df</th><th>\u03B1</th></tr>'+
        '<tr><td>120\u2009000</td><td>132\u2009000</td><td>30\u2009000</td><td>25</td><td>24</td><td>0.05</td></tr>'+
        '</table></div>'+
        '<p><strong>Wobble:</strong> s/\u221An = 30\u2009000/\u221A25</p>'+
        '<p><strong>Gap:</strong> x\u0304 \u2212 \u03BC\u2080 = 132\u2009000 \u2212 120\u2009000</p>'+
        '<p><strong>Critical value:</strong> t<sub>0.025, 24</sub> = \u00B12.064</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Step 4 \u2014 Walk It</h3>'+
        '<div class="derivation"><div class="d-label">The wobble (ruler)</div>'+
        '<div class="d-line">s/\u221An = 30\u2009000/\u221A25 = 30\u2009000/5 = <strong>6\u2009000</strong></div></div>'+
        '<div class="derivation"><div class="d-label">The raw gap</div>'+
        '<div class="d-line">x\u0304 \u2212 \u03BC\u2080 = 132\u2009000 \u2212 120\u2009000 = <strong>12\u2009000</strong></div></div>'+
        '<div class="derivation"><div class="d-label">The coordinate</div>'+
        '<div class="d-line">T<sub>obs</sub> = 12\u2009000 / 6\u2009000 = <strong>2.0</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">Two wobbles from the claim.</div></div>'+
        '<div class="derivation"><div class="d-label">Compare</div>'+
        '<div class="d-line">|T<sub>obs</sub>| = 2.0 &nbsp;&nbsp; vs &nbsp;&nbsp; t<sub>crit</sub> = 2.064</div>'+
        '<div class="d-line">2.0 < 2.064 \u2192 <strong>inside the wall.</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Conclusion</div>'+
        '<div class="result-box-value" style="color:var(--green)">Behold H\u2080</div>'+
        '<div class="result-box-desc">Barely. The handful sits 2 wobbles from the claim, but the wall sits at 2.064. Not enough evidence to reject. 0.064 wobbles saved the claim.</div>'+
        '</div></div>';
}

/* === ENSIDIG t-TEST STEPS === */
function t1Step(s){
    if(s===1)return '<div class="step-content"><h3>Step 1 \u2014 Blueprint</h3>'+
        '<p>Same claim, same data. But now the question is <strong>"is it higher?"</strong> \u2192 <strong>one-tailed</strong>.</p>'+
        '<p><strong>H\u2080:</strong> \u03BC = 120\u2009000 &nbsp;&nbsp; <strong>H\u1D00:</strong> \u03BC > 120\u2009000</p>'+
        '<p>All \u03B1 goes to the right tail. The wall moves closer to center because you\'re only watching one direction.</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Step 2 \u2014 The Process</h3>'+
        '<p>Same five steps. One change: the wall placement.</p>'+
        '<div class="proc-block"><div class="proc-title">The one-tailed difference</div>'+
        '<div class="proc-step"><strong>Only one wall.</strong> All \u03B1 = 0.05 goes to the right tail. No left wall. You only reject if x\u0304 is <em>above</em> the claim.</div>'+
        '<div class="proc-step"><strong>Wall sits at t<sub>\u03B1, df</sub></strong> (not \u03B1/2). \u03B1 = 0.05, df = 24 \u2192 t<sub>crit</sub> = 1.711.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">One-tailed is easier to reject \u2014 the wall is closer because all \u03B1 goes to one side.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Step 3 \u2014 The Data</h3>'+
        '<p>Exact same numbers as the two-tailed test. Only the hypothesis changed.</p>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>\u03BC\u2080</th><th>x\u0304</th><th>s</th><th>n</th><th>df</th><th>\u03B1</th></tr>'+
        '<tr><td>120\u2009000</td><td>132\u2009000</td><td>30\u2009000</td><td>25</td><td>24</td><td>0.05</td></tr>'+
        '</table></div>'+
        '<p><strong>Critical value:</strong> t<sub>0.05, 24</sub> = 1.711 (one wall, right side)</p>'+
        '<p>T<sub>obs</sub> is still 2.0 \u2014 same data, same calculation. Only the wall moved.</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Step 4 \u2014 Walk It</h3>'+
        '<div class="derivation"><div class="d-label">Same T_obs</div>'+
        '<div class="d-line">T<sub>obs</sub> = 12\u2009000 / 6\u2009000 = <strong>2.0</strong> (unchanged)</div></div>'+
        '<div class="derivation"><div class="d-label">Compare \u2014 different wall</div>'+
        '<div class="d-line">T<sub>obs</sub> = 2.0 &nbsp;&nbsp; vs &nbsp;&nbsp; t<sub>crit</sub> = 1.711</div>'+
        '<div class="d-line">2.0 > 1.711 \u2192 <strong>past the wall.</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Conclusion</div>'+
        '<div class="result-box-value" style="color:var(--red)">Forkast H\u2080</div>'+
        '<div class="result-box-desc">Same data, same T<sub>obs</sub> = 2.0. But the wall moved from 2.064 to 1.711 because all \u03B1 went to one side. Now 2.0 is past the wall. Reject the claim \u2014 the new strategy increased revenue.</div>'+
        '</div></div>';
}

/* === z-TEST STEPS === */
function z2Step(s){
    if(s===1)return '<div class="step-content"><h3>Step 1 \u2014 Blueprint</h3>'+
        '<p>They claim <strong>\u03BC = 50</strong>. You have a sample. <strong>\u03C3 = 12 is known</strong> \u2192 z-test. "Is there a difference?" \u2192 two-tailed.</p>'+
        '<p><strong>H\u2080:</strong> \u03BC = 50 &nbsp;&nbsp; <strong>H\u1D00:</strong> \u03BC \u2260 50</p>'+
        '<p>Same construction as the t-test, but the bell is normal (not t-shaped) and the wobble uses \u03C3 instead of s.</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Step 2 \u2014 The Process</h3>'+
        '<p>Same five steps. Two substitutions.</p>'+
        '<div class="proc-block"><div class="proc-title">z-test differences</div>'+
        '<div class="proc-step"><strong>Wobble:</strong> \u03C3/\u221An (not s/\u221An). The true spread is known \u2014 no extra wobble from estimating it.</div>'+
        '<div class="proc-step"><strong>Table:</strong> z-table (not t-table). No df needed \u2014 the normal bell is the normal bell.</div>'+
        '<div class="proc-step"><strong>Formula:</strong> z<sub>obs</sub> = (x\u0304 \u2212 \u03BC\u2080) / (\u03C3/\u221An). Same structure, different letter.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">On eksamen: z-test is rarer. Most problems give s, not \u03C3. When they give \u03C3, it\'s always z.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Step 3 \u2014 The Data</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>\u03BC\u2080</th><th>x\u0304</th><th>\u03C3</th><th>n</th><th>\u03B1</th></tr>'+
        '<tr><td>50</td><td>52</td><td>12</td><td>36</td><td>0.05</td></tr>'+
        '</table></div>'+
        '<p><strong>Wobble:</strong> \u03C3/\u221An = 12/\u221A36</p>'+
        '<p><strong>Gap:</strong> x\u0304 \u2212 \u03BC\u2080 = 52 \u2212 50</p>'+
        '<p><strong>Critical value:</strong> z<sub>0.025</sub> = \u00B11.96</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Step 4 \u2014 Walk It</h3>'+
        '<div class="derivation"><div class="d-label">The wobble</div>'+
        '<div class="d-line">\u03C3/\u221An = 12/\u221A36 = 12/6 = <strong>2</strong></div></div>'+
        '<div class="derivation"><div class="d-label">The raw gap</div>'+
        '<div class="d-line">x\u0304 \u2212 \u03BC\u2080 = 52 \u2212 50 = <strong>2</strong></div></div>'+
        '<div class="derivation"><div class="d-label">The coordinate</div>'+
        '<div class="d-line">z<sub>obs</sub> = 2 / 2 = <strong>1.0</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">One wobble from the claim.</div></div>'+
        '<div class="derivation"><div class="d-label">Compare</div>'+
        '<div class="d-line">|z<sub>obs</sub>| = 1.0 &nbsp;&nbsp; vs &nbsp;&nbsp; z<sub>crit</sub> = 1.96</div>'+
        '<div class="d-line">1.0 < 1.96 \u2192 <strong>well inside the wall.</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Conclusion</div>'+
        '<div class="result-box-value" style="color:var(--green)">Behold H\u2080</div>'+
        '<div class="result-box-desc">One wobble from the claim. The wall sits at 1.96. Not even close. The sample doesn\'t provide evidence against the claim.</div>'+
        '</div></div>';
}

/* === VISUALIZATION === */
function drawViz(){
    var c=CONF[mode];
    document.getElementById('viz-title').textContent=c.vizTitle;
    document.getElementById('viz-desc').textContent=c.vizDesc;
    drawTest();
}

function drawTest(){
    var c=CONF[mode];
    var wrap=document.getElementById('viz-wrap');
    var canvas=document.getElementById('viz-canvas');
    var dpr=window.devicePixelRatio||1;
    var cw=wrap.clientWidth-18;
    var ch=300;
    canvas.width=cw*dpr;canvas.height=ch*dpr;
    canvas.style.width=cw+'px';canvas.style.height=ch+'px';
    var ctx=canvas.getContext('2d');
    ctx.scale(dpr,dpr);ctx.clearRect(0,0,cw,ch);

    var accent='#a78bfa',green='#22c55e',red='#ef4444',muted='#71717a',border='#27272a';
    var padL=30,padR=30,padTop=20,padBot=48;
    var plotW=cw-padL-padR;
    var plotH=ch-padTop-padBot;
    var xMin=-4,xMax=4;

    function tx(x){return padL+(x-xMin)/(xMax-xMin)*plotW;}
    function pv(x){
        if(c.useT) return Math.pow(1+x*x/c.df,-(c.df+1)/2);
        return Math.exp(-0.5*x*x);
    }
    function ty(p){return ch-padBot-p*(plotH-10);}
    var st=0.025;

    // Rejection shading
    ctx.fillStyle='rgba(239,68,68,0.08)';
    if(c.oneTail){
        ctx.beginPath();ctx.moveTo(tx(c.crits[0]),ch-padBot);
        for(var x=c.crits[0];x<=xMax;x+=st)ctx.lineTo(tx(x),ty(pv(x)));
        ctx.lineTo(tx(xMax),ch-padBot);ctx.closePath();ctx.fill();
    } else {
        ctx.beginPath();ctx.moveTo(tx(xMin),ch-padBot);
        for(var x=xMin;x<=c.crits[0];x+=st)ctx.lineTo(tx(x),ty(pv(x)));
        ctx.lineTo(tx(c.crits[0]),ch-padBot);ctx.closePath();ctx.fill();
        ctx.beginPath();ctx.moveTo(tx(c.crits[1]),ch-padBot);
        for(var x=c.crits[1];x<=xMax;x+=st)ctx.lineTo(tx(x),ty(pv(x)));
        ctx.lineTo(tx(xMax),ch-padBot);ctx.closePath();ctx.fill();
    }

    // Acceptance shading
    ctx.fillStyle='rgba(167,139,250,0.05)';
    if(c.oneTail){
        ctx.beginPath();ctx.moveTo(tx(xMin),ch-padBot);
        for(var x=xMin;x<=c.crits[0];x+=st)ctx.lineTo(tx(x),ty(pv(x)));
        ctx.lineTo(tx(c.crits[0]),ch-padBot);ctx.closePath();ctx.fill();
    } else {
        ctx.beginPath();ctx.moveTo(tx(c.crits[0]),ch-padBot);
        for(var x=c.crits[0];x<=c.crits[1];x+=st)ctx.lineTo(tx(x),ty(pv(x)));
        ctx.lineTo(tx(c.crits[1]),ch-padBot);ctx.closePath();ctx.fill();
    }

    // Full curve
    ctx.beginPath();ctx.moveTo(tx(xMin),ty(pv(xMin)));
    for(var x=xMin;x<=xMax;x+=st)ctx.lineTo(tx(x),ty(pv(x)));
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke();

    // Critical value walls
    ctx.setLineDash([4,3]);ctx.strokeStyle='#fafafa';ctx.lineWidth=1;
    c.crits.forEach(function(cv){
        ctx.beginPath();ctx.moveTo(tx(cv),ty(pv(cv)));ctx.lineTo(tx(cv),ch-padBot);ctx.stroke();
    });
    ctx.setLineDash([]);

    // Center dashed line
    ctx.beginPath();ctx.setLineDash([3,4]);
    ctx.moveTo(tx(0),ty(1)-5);ctx.lineTo(tx(0),ch-padBot);
    ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);

    // T_obs line
    var tobsColor=c.result==='forkast'?red:green;
    ctx.strokeStyle=tobsColor;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(tx(c.tobs),ty(pv(c.tobs)));ctx.lineTo(tx(c.tobs),ch-padBot);ctx.stroke();

    // Labels: center
    ctx.fillStyle=accent;ctx.font='bold 10px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText('\u03BC\u2080',tx(0),ch-padBot+4);

    // Labels: critical values
    ctx.fillStyle='#fafafa';ctx.font='10px Inter,sans-serif';
    c.crits.forEach(function(cv){
        ctx.textAlign='center';ctx.textBaseline='top';
        var label=cv>0?'+'+cv.toFixed(3):cv.toFixed(3);
        ctx.fillText(label,tx(cv),ch-padBot+4);
    });

    // Label: T_obs
    ctx.fillStyle=tobsColor;ctx.font='bold 11px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillText(c.tobsL,tx(c.tobs),ty(pv(c.tobs))-6);

    // Zone labels
    ctx.font='9px Inter,sans-serif';
    ctx.fillStyle='rgba(239,68,68,0.6)';
    if(c.oneTail){
        ctx.fillText('Forkast',tx(3),ty(0.06));
        ctx.fillStyle='rgba(167,139,250,0.4)';ctx.fillText('Behold',tx(-1),ty(0.3));
    } else {
        ctx.fillText('Forkast',tx(-3),ty(0.06));
        ctx.fillText('Forkast',tx(3),ty(0.06));
        ctx.fillStyle='rgba(167,139,250,0.4)';ctx.fillText('Behold',tx(0),ty(0.3));
    }

    // Result
    var resColor=c.result==='forkast'?red:green;
    ctx.fillStyle=resColor;ctx.font='bold 13px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText(c.resultL,cw/2,ch-16);
}

/* === INIT === */
renderAll();
