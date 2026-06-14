/* === STATE === */
var mode='zki',currentStep=1;

var CONF={
    zki:{center:50,se:2,left:46.08,right:53.92,confPct:'95%',tailPct:'2.5%',
         centerL:'x\u0304 = 50',leftL:'46.08',rightL:'53.92',
         resultL:'KI = [46.08 , 53.92]',useT:false,
         vizTitle:'z-Frame',vizDesc:'\u03C3 known \u2014 normal bell. 95% confidence, n = 36.'},
    tki:{center:70,se:2.8,left:62.17,right:77.83,confPct:'99%',tailPct:'0.5%',
         centerL:'x\u0304 = 70',leftL:'62.17',rightL:'77.83',
         resultL:'KI = [62.17 , 77.83]',useT:true,df:24,
         vizTitle:'t-Frame',vizDesc:'\u03C3 unknown \u2014 fatter tails. 99% confidence, df = 24.'},
    pki:{center:35,se:3.373,left:28.39,right:41.61,confPct:'95%',tailPct:'2.5%',
         centerL:'p\u0302 = 35%',leftL:'28.4%',rightL:'41.6%',
         resultL:'KI = [28.4% , 41.6%]',useT:false,
         vizTitle:'Proportion Frame',vizDesc:'Andel \u2014 p\u0302 wobble. 95% confidence, n = 200.'}
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
    if(mode==='zki')el.innerHTML=zkiStep(currentStep);
    else if(mode==='tki')el.innerHTML=tkiStep(currentStep);
    else el.innerHTML=pkiStep(currentStep);
}
function markDone(n){document.querySelectorAll('.step-btn').forEach(function(b,i){if(i<n)b.classList.add('done');});}

/* === z-KI STEPS === */
function zkiStep(s){
    if(s===1)return '<div class="step-content"><h3>Step 1 \u2014 Blueprint</h3>'+
        '<p>Recognize: <strong>\u03C3 is known.</strong> You took a sample of n and got x\u0304. That number wobbles \u2014 draw again and you\'d get a different x\u0304. The wobble piles up into a normal bell (SGS approved).</p>'+
        '<p>You\'re building a <strong>frame on this bell</strong> \u2014 two walls around where your dart landed, wide enough that \u03BC is probably inside.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">x\u0304 \u00B1 z<sub>\u03B1/2</sub> &middot; \u03C3/\u221An</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Step 2 \u2014 The Process</h3>'+
        '<p>Three pieces in the construction.</p>'+
        '<div class="proc-block"><div class="proc-title">Procedure</div>'+
        '<div class="proc-step"><strong>1. x\u0304 \u2014 the center of the frame.</strong> Where your dart landed. The best single guess for \u03BC, but it wobbles every time you draw a new sample.</div>'+
        '<div class="proc-step"><strong>2. \u03C3/\u221An \u2014 the wobble (standardfeil).</strong> \u03C3 is raw chaos. \u221An is the calming force \u2014 averaging smooths out the chaos. Divide and you get how much x\u0304 typically twists from \u03BC.</div>'+
        '<div class="proc-step"><strong>3. z<sub>\u03B1/2</sub> \u2014 the stretch factor.</strong> How many wobbles wide the frame gets. Confidence \u2192 \u03B1 \u2192 \u03B1/2 \u2192 z-table.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">x\u0304 \u00B1 stretch \u00D7 wobble = the frame.</div>'+
        '</div>'+
        '<div class="proc-block"><div class="proc-title">Common stretch factors</div>'+
        '<div class="proc-step">90% confidence: z = 1.645</div>'+
        '<div class="proc-step">95% confidence: z = 1.960</div>'+
        '<div class="proc-step">99% confidence: z = 2.576</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Step 3 \u2014 The Data</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>n</th><th>x\u0304</th><th>\u03C3</th><th>Confidence</th></tr>'+
        '<tr><td>36</td><td>50</td><td>12</td><td>95%</td></tr>'+
        '</table></div>'+
        '<p><strong>Center:</strong> x\u0304 = 50</p>'+
        '<p><strong>Wobble:</strong> \u03C3/\u221An = 12/\u221A36</p>'+
        '<p><strong>Stretch:</strong> 95% \u2192 \u03B1 = 0.05 \u2192 \u03B1/2 = 0.025 \u2192 z = 1.96</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Step 4 \u2014 Walk It</h3>'+
        '<div class="derivation"><div class="d-label">Wobble</div>'+
        '<div class="d-line">\u03C3/\u221An = 12/\u221A36 = 12/6 = <strong>2</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">x\u0304 typically twists 2 units from \u03BC.</div></div>'+
        '<div class="derivation"><div class="d-label">Margin</div>'+
        '<div class="d-line">z \u00D7 wobble = 1.96 \u00D7 2 = <strong>3.92</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Walls</div>'+
        '<div class="d-line">Left: 50 \u2212 3.92 = <strong>46.08</strong></div>'+
        '<div class="d-line">Right: 50 + 3.92 = <strong>53.92</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Konfidensintervall</div>'+
        '<div class="result-box-value">KI = [46.08 , 53.92]</div>'+
        '<div class="result-box-desc">A frame 7.84 units wide around 50. 95% of frames built this way catch \u03BC. This one? You never know.</div>'+
        '</div></div>';
}

/* === t-KI STEPS === */
function tkiStep(s){
    if(s===1)return '<div class="step-content"><h3>Step 1 \u2014 Blueprint</h3>'+
        '<p>Recognize: <strong>\u03C3 is unknown.</strong> You must use s \u2014 the sample\'s own estimate of the spread. Both the average AND the spread-estimate wobble.</p>'+
        '<p>Extra uncertainty \u2192 the stretch factor comes from the <strong>t-table</strong>, not the z-table. The t is always bigger than z \u2014 wider frame \u2014 the honesty tax for not knowing \u03C3.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">x\u0304 \u00B1 t<sub>\u03B1/2, df</sub> &middot; s/\u221An</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Step 2 \u2014 The Process</h3>'+
        '<p>Same three pieces. One substitution, one adjustment.</p>'+
        '<div class="proc-block"><div class="proc-title">Procedure</div>'+
        '<div class="proc-step"><strong>1. x\u0304 \u2014 same center.</strong> Where your dart landed.</div>'+
        '<div class="proc-step"><strong>2. s/\u221An \u2014 the wobble.</strong> s stands in for \u03C3. Because s itself wobbles, the bell has fatter tails \u2014 more probability in the extremes.</div>'+
        '<div class="proc-step"><strong>3. t<sub>\u03B1/2, df</sub> \u2014 the stretch factor.</strong> Same bridge but through the t-table with df = n\u22121. t is always bigger than z. Small n \u2192 thick tails \u2192 wide frame. As n grows, t shrinks toward z.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">On eksamen: if \u03C3 is ukjent, use t \u2014 always.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Step 3 \u2014 The Data</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>n</th><th>x\u0304</th><th>s</th><th>Confidence</th><th>df</th></tr>'+
        '<tr><td>25</td><td>70</td><td>14</td><td>99%</td><td>24</td></tr>'+
        '</table></div>'+
        '<p><strong>Center:</strong> x\u0304 = 70</p>'+
        '<p><strong>Wobble:</strong> s/\u221An = 14/\u221A25</p>'+
        '<p><strong>Stretch:</strong> 99% \u2192 \u03B1/2 = 0.005, df = 24 \u2192 t = 2.797</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Step 4 \u2014 Walk It</h3>'+
        '<div class="derivation"><div class="d-label">Wobble</div>'+
        '<div class="d-line">s/\u221An = 14/\u221A25 = 14/5 = <strong>2.8</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">x\u0304 typically twists 2.8 minutes from \u03BC.</div></div>'+
        '<div class="derivation"><div class="d-label">Margin</div>'+
        '<div class="d-line">t \u00D7 wobble = 2.797 \u00D7 2.8 = <strong>7.83</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Walls</div>'+
        '<div class="d-line">Left: 70 \u2212 7.83 = <strong>62.17</strong></div>'+
        '<div class="d-line">Right: 70 + 7.83 = <strong>77.83</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Konfidensintervall</div>'+
        '<div class="result-box-value">KI = [62.17 , 77.83]</div>'+
        '<div class="result-box-desc">15.66 minutes wide. If you\'d wrongly used z = 2.576 instead of t = 2.797, the margin would be 7.21 \u2014 walls 0.62 tighter each side. That 0.62 is the honesty tax for not knowing \u03C3.</div>'+
        '</div></div>';
}

/* === PROPORTION STEPS === */
function pkiStep(s){
    if(s===1)return '<div class="step-content"><h3>Step 1 \u2014 Blueprint</h3>'+
        '<p>Recognize: you\'re measuring an <strong>andel (proportion)</strong>. p\u0302 is the estimate. Not a mean of continuous values \u2014 a fraction of yes/no outcomes.</p>'+
        '<p>p\u0302 has its own wobble formula built in. Always z-frame \u2014 proportions have built-in variance.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">p\u0302 \u00B1 z<sub>\u03B1/2</sub> &middot; \u221A(p\u0302(1\u2212p\u0302)/n)</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Step 2 \u2014 The Process</h3>'+
        '<p>Same three pieces, same construction.</p>'+
        '<div class="proc-block"><div class="proc-title">Procedure</div>'+
        '<div class="proc-step"><strong>1. p\u0302 \u2014 the center.</strong> Your sample\'s proportion. The fraction of yes-answers.</div>'+
        '<div class="proc-step"><strong>2. \u221A(p\u0302(1\u2212p\u0302)/n) \u2014 the wobble.</strong> p\u0302(1\u2212p\u0302) is the built-in spread \u2014 max at 0.5, shrinks toward 0 or 1. Divide by n, take the root.</div>'+
        '<div class="proc-step"><strong>3. z<sub>\u03B1/2</sub> \u2014 the stretch factor.</strong> Same z-table as z-KI. Same bridge.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">p\u0302 \u00B1 stretch \u00D7 wobble = the frame.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Step 3 \u2014 The Data</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>n</th><th>p\u0302</th><th>Confidence</th></tr>'+
        '<tr><td>200</td><td>0.35 (35%)</td><td>95%</td></tr>'+
        '</table></div>'+
        '<p><strong>Center:</strong> p\u0302 = 0.35</p>'+
        '<p><strong>Wobble:</strong> \u221A(0.35 \u00D7 0.65 / 200)</p>'+
        '<p><strong>Stretch:</strong> 95% \u2192 z = 1.96</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Step 4 \u2014 Walk It</h3>'+
        '<div class="derivation"><div class="d-label">Wobble</div>'+
        '<div class="d-line">p\u0302(1\u2212p\u0302) = 0.35 \u00D7 0.65 = 0.2275</div>'+
        '<div class="d-line">0.2275 / 200 = 0.001138</div>'+
        '<div class="d-line">\u221A0.001138 = <strong>0.0337</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Margin</div>'+
        '<div class="d-line">z \u00D7 wobble = 1.96 \u00D7 0.0337 = <strong>0.066</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Walls</div>'+
        '<div class="d-line">Left: 0.35 \u2212 0.066 = <strong>0.284</strong> (28.4%)</div>'+
        '<div class="d-line">Right: 0.35 + 0.066 = <strong>0.416</strong> (41.6%)</div></div>'+
        '<div class="result-box"><div class="result-box-name">Konfidensintervall</div>'+
        '<div class="result-box-value">KI = [28.4% , 41.6%]</div>'+
        '<div class="result-box-desc">The true proportion is framed between 28.4% and 41.6% with 95% confidence. The wobble is about 3.4 percentage points \u2014 not bad for n = 200.</div>'+
        '</div></div>';
}

/* === VISUALIZATION === */
function drawViz(){
    var c=CONF[mode];
    document.getElementById('viz-title').textContent=c.vizTitle;
    document.getElementById('viz-desc').textContent=c.vizDesc;
    drawFrame();
}

function drawFrame(){
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

    var accent='#a78bfa',green='#22c55e',muted='#71717a',border='#27272a';
    var padL=25,padR=25,padTop=20,padBot=48;
    var plotW=cw-padL-padR;
    var plotH=ch-padTop-padBot;
    var range=c.se*4;
    var xMin=c.center-range,xMax=c.center+range;

    function tx(x){return padL+(x-xMin)/(xMax-xMin)*plotW;}
    function pv(x){
        var t=(x-c.center)/c.se;
        if(c.useT) return Math.pow(1+t*t/c.df,-(c.df+1)/2);
        return Math.exp(-0.5*t*t);
    }
    function ty(p){return ch-padBot-p*(plotH-10);}
    var step=(xMax-xMin)/300;

    ctx.fillStyle='rgba(239,68,68,0.05)';
    ctx.beginPath();ctx.moveTo(tx(xMin),ch-padBot);
    for(var x=xMin;x<=c.left;x+=step)ctx.lineTo(tx(x),ty(pv(x)));
    ctx.lineTo(tx(c.left),ch-padBot);ctx.closePath();ctx.fill();
    ctx.beginPath();ctx.moveTo(tx(c.right),ch-padBot);
    for(var x=c.right;x<=xMax;x+=step)ctx.lineTo(tx(x),ty(pv(x)));
    ctx.lineTo(tx(xMax),ch-padBot);ctx.closePath();ctx.fill();

    ctx.fillStyle='rgba(167,139,250,0.14)';
    ctx.beginPath();ctx.moveTo(tx(c.left),ch-padBot);
    for(var x=c.left;x<=c.right;x+=step)ctx.lineTo(tx(x),ty(pv(x)));
    ctx.lineTo(tx(c.right),ch-padBot);ctx.closePath();ctx.fill();

    ctx.beginPath();ctx.moveTo(tx(xMin),ty(pv(xMin)));
    for(var x=xMin;x<=xMax;x+=step)ctx.lineTo(tx(x),ty(pv(x)));
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke();

    ctx.strokeStyle='#fafafa';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.moveTo(tx(c.left),ty(pv(c.left)));ctx.lineTo(tx(c.left),ch-padBot);ctx.stroke();
    ctx.beginPath();ctx.moveTo(tx(c.right),ty(pv(c.right)));ctx.lineTo(tx(c.right),ch-padBot);ctx.stroke();

    ctx.beginPath();ctx.setLineDash([4,3]);
    ctx.moveTo(tx(c.center),ty(1)-5);ctx.lineTo(tx(c.center),ch-padBot);
    ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);

    ctx.fillStyle=accent;ctx.font='bold 11px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText(c.centerL,tx(c.center),ch-padBot+18);

    ctx.fillStyle='#fafafa';ctx.font='bold 10px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText(c.leftL,tx(c.left),ch-padBot+4);
    ctx.fillText(c.rightL,tx(c.right),ch-padBot+4);

    ctx.fillStyle=muted;ctx.font='9px Inter,sans-serif';
    ctx.textBaseline='bottom';
    ctx.fillText('left wall',tx(c.left),ty(pv(c.left))-4);
    ctx.fillText('right wall',tx(c.right),ty(pv(c.right))-4);

    ctx.fillStyle='rgba(167,139,250,0.55)';ctx.font='bold 18px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(c.confPct,tx(c.center),ty(0.45));

    ctx.fillStyle='rgba(239,68,68,0.5)';ctx.font='10px Inter,sans-serif';
    var tailX1=tx(c.center-c.se*3.3),tailX2=tx(c.center+c.se*3.3);
    ctx.fillText(c.tailPct,tailX1,ty(0.08));
    ctx.fillText(c.tailPct,tailX2,ty(0.08));

    ctx.fillStyle=green;ctx.font='bold 12px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText(c.resultL,cw/2,ch-16);
}

/* === INIT === */
renderAll();
