/* === STATE === */
var mode='zki',currentStep=1;

var CONF={
    zki:{center:50,se:2,left:46.08,right:53.92,confPct:'95%',tailPct:'2.5%',
         centerL:'x\u0304 = 50',leftL:'46.08',rightL:'53.92',
         resultL:'KI = [46.08 , 53.92]',useT:false,
         vizTitle:'z-Ramme',vizDesc:'\u03C3 kjent \u2014 normal klokke. 95% konfidens, n = 36.'},
    tki:{center:70,se:2.8,left:62.17,right:77.83,confPct:'99%',tailPct:'0.5%',
         centerL:'x\u0304 = 70',leftL:'62.17',rightL:'77.83',
         resultL:'KI = [62.17 , 77.83]',useT:true,df:24,
         vizTitle:'t-Ramme',vizDesc:'\u03C3 ukjent \u2014 tykkere haler. 99% konfidens, df = 24.'},
    pki:{center:35,se:3.373,left:28.39,right:41.61,confPct:'95%',tailPct:'2.5%',
         centerL:'p\u0302 = 35%',leftL:'28.4%',rightL:'41.6%',
         resultL:'KI = [28.4% , 41.6%]',useT:false,
         vizTitle:'Andelramme',vizDesc:'Andel \u2014 p\u0302 risting. 95% konfidens, n = 200.'}
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

/* === z-KI STEG === */
function zkiStep(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p>Gjenkjenn: <strong>\u03C3 er kjent.</strong> Du tok et utvalg p\u00E5 n og fikk x\u0304. Det tallet rister \u2014 trekk igjen og du f\u00E5r en annen x\u0304. Ristingen hoper seg opp til en normal klokke (SGS godkjent).</p>'+
        '<p>Du bygger en <strong>ramme p\u00E5 denne klokken</strong> \u2014 to vegger rundt der pilen din landet, bred nok til at \u03BC sannsynligvis er innenfor.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">x\u0304 \u00B1 z<sub>\u03B1/2</sub> &middot; \u03C3/\u221An</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>Tre deler i konstruksjonen.</p>'+
        '<div class="proc-block"><div class="proc-title">Prosedyre</div>'+
        '<div class="proc-step"><strong>1. x\u0304 \u2014 sentrum av rammen.</strong> Der pilen din landet. Det beste enkeltgjettet for \u03BC, men det rister hver gang du trekker et nytt utvalg.</div>'+
        '<div class="proc-step"><strong>2. \u03C3/\u221An \u2014 ristingen (standardfeil).</strong> \u03C3 er r\u00E5 kaos. \u221An er den roende kraften \u2014 gjennomsnitt jevner ut kaos. Del og du f\u00E5r hvor mye x\u0304 typisk rister fra \u03BC.</div>'+
        '<div class="proc-step"><strong>3. z<sub>\u03B1/2</sub> \u2014 strekkfaktoren.</strong> Hvor mange ristinger bred rammen blir. Konfidens \u2192 \u03B1 \u2192 \u03B1/2 \u2192 z-tabell.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">x\u0304 \u00B1 strekk \u00D7 risting = rammen.</div>'+
        '</div>'+
        '<div class="proc-block"><div class="proc-title">Vanlige strekkfaktorer</div>'+
        '<div class="proc-step">90% konfidens: z = 1.645</div>'+
        '<div class="proc-step">95% konfidens: z = 1.960</div>'+
        '<div class="proc-step">99% konfidens: z = 2.576</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>n</th><th>x\u0304</th><th>\u03C3</th><th>Konfidens</th></tr>'+
        '<tr><td>36</td><td>50</td><td>12</td><td>95%</td></tr>'+
        '</table></div>'+
        '<p><strong>Sentrum:</strong> x\u0304 = 50</p>'+
        '<p><strong>Risting:</strong> \u03C3/\u221An = 12/\u221A36</p>'+
        '<p><strong>Strekk:</strong> 95% \u2192 \u03B1 = 0.05 \u2192 \u03B1/2 = 0.025 \u2192 z = 1.96</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00E5 formelen</h3>'+
        '<div class="derivation"><div class="d-label">Risting</div>'+
        '<div class="d-line">\u03C3/\u221An = 12/\u221A36 = 12/6 = <strong>2</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">x\u0304 rister typisk 2 enheter fra \u03BC.</div></div>'+
        '<div class="derivation"><div class="d-label">Margin</div>'+
        '<div class="d-line">z \u00D7 risting = 1.96 \u00D7 2 = <strong>3.92</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Vegger</div>'+
        '<div class="d-line">Venstre: 50 \u2212 3.92 = <strong>46.08</strong></div>'+
        '<div class="d-line">H\u00F8yre: 50 + 3.92 = <strong>53.92</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Konfidensintervall</div>'+
        '<div class="result-box-value">KI = [46.08 , 53.92]</div>'+
        '<div class="result-box-desc">En ramme 7.84 enheter bred rundt 50. 95% av rammer bygd slik fanger \u03BC. Denne? Det vet du aldri.</div>'+
        '</div></div>';
}

/* === t-KI STEG === */
function tkiStep(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p>Gjenkjenn: <strong>\u03C3 er ukjent.</strong> Du m\u00E5 bruke s \u2014 utvalgets eget estimat av spredningen. B\u00E5de gjennomsnittet OG spredningsestimatet rister.</p>'+
        '<p>Ekstra usikkerhet \u2192 strekkfaktoren kommer fra <strong>t-tabellen</strong>, ikke z-tabellen. t er alltid st\u00F8rre enn z \u2014 bredere ramme \u2014 \u00E6rlighetsskatten for ikke \u00E5 kjenne \u03C3.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">x\u0304 \u00B1 t<sub>\u03B1/2, df</sub> &middot; s/\u221An</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>Samme tre deler. \u00C9n erstatning, \u00E9n justering.</p>'+
        '<div class="proc-block"><div class="proc-title">Prosedyre</div>'+
        '<div class="proc-step"><strong>1. x\u0304 \u2014 samme sentrum.</strong> Der pilen din landet.</div>'+
        '<div class="proc-step"><strong>2. s/\u221An \u2014 ristingen.</strong> s erstatter \u03C3. Fordi s selv rister, har klokken tykkere haler \u2014 mer sannsynlighet i ytterkantene.</div>'+
        '<div class="proc-step"><strong>3. t<sub>\u03B1/2, df</sub> \u2014 strekkfaktoren.</strong> Samme bro men gjennom t-tabellen med df = n\u22121. t er alltid st\u00F8rre enn z. Liten n \u2192 tykke haler \u2192 bred ramme. N\u00E5r n vokser, krymper t mot z.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">P\u00E5 eksamen: hvis \u03C3 er ukjent, bruk t \u2014 alltid.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>n</th><th>x\u0304</th><th>s</th><th>Konfidens</th><th>df</th></tr>'+
        '<tr><td>25</td><td>70</td><td>14</td><td>99%</td><td>24</td></tr>'+
        '</table></div>'+
        '<p><strong>Sentrum:</strong> x\u0304 = 70</p>'+
        '<p><strong>Risting:</strong> s/\u221An = 14/\u221A25</p>'+
        '<p><strong>Strekk:</strong> 99% \u2192 \u03B1/2 = 0.005, df = 24 \u2192 t = 2.797</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00E5 formelen</h3>'+
        '<div class="derivation"><div class="d-label">Risting</div>'+
        '<div class="d-line">s/\u221An = 14/\u221A25 = 14/5 = <strong>2.8</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">x\u0304 rister typisk 2.8 minutter fra \u03BC.</div></div>'+
        '<div class="derivation"><div class="d-label">Margin</div>'+
        '<div class="d-line">t \u00D7 risting = 2.797 \u00D7 2.8 = <strong>7.83</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Vegger</div>'+
        '<div class="d-line">Venstre: 70 \u2212 7.83 = <strong>62.17</strong></div>'+
        '<div class="d-line">H\u00F8yre: 70 + 7.83 = <strong>77.83</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Konfidensintervall</div>'+
        '<div class="result-box-value">KI = [62.17 , 77.83]</div>'+
        '<div class="result-box-desc">15.66 minutter bred. Hadde du feilaktig brukt z = 2.576 i stedet for t = 2.797, ville marginen v\u00E6rt 7.21 \u2014 vegger 0.62 tettere p\u00E5 hver side. De 0.62 er \u00E6rlighetsskatten for ikke \u00E5 kjenne \u03C3.</div>'+
        '</div></div>';
}

/* === ANDEL STEG === */
function pkiStep(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p>Gjenkjenn: du m\u00E5ler en <strong>andel (proporsjonen)</strong>. p\u0302 er estimatet. Ikke et gjennomsnitt av kontinuerlige verdier \u2014 en brøk av ja/nei-utfall.</p>'+
        '<p>p\u0302 har sin egen ristingsformel innebygd. Alltid z-ramme \u2014 andeler har innebygd varians.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">p\u0302 \u00B1 z<sub>\u03B1/2</sub> &middot; \u221A(p\u0302(1\u2212p\u0302)/n)</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>Samme tre deler, samme konstruksjon.</p>'+
        '<div class="proc-block"><div class="proc-title">Prosedyre</div>'+
        '<div class="proc-step"><strong>1. p\u0302 \u2014 sentrum.</strong> Utvalgets andel. Brøken av ja-svar.</div>'+
        '<div class="proc-step"><strong>2. \u221A(p\u0302(1\u2212p\u0302)/n) \u2014 ristingen.</strong> p\u0302(1\u2212p\u0302) er den innebygde spredningen \u2014 maks ved 0.5, krymper mot 0 eller 1. Del p\u00E5 n, ta roten.</div>'+
        '<div class="proc-step"><strong>3. z<sub>\u03B1/2</sub> \u2014 strekkfaktoren.</strong> Samme z-tabell som z-KI. Samme bro.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">p\u0302 \u00B1 strekk \u00D7 risting = rammen.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>n</th><th>p\u0302</th><th>Konfidens</th></tr>'+
        '<tr><td>200</td><td>0.35 (35%)</td><td>95%</td></tr>'+
        '</table></div>'+
        '<p><strong>Sentrum:</strong> p\u0302 = 0.35</p>'+
        '<p><strong>Risting:</strong> \u221A(0.35 \u00D7 0.65 / 200)</p>'+
        '<p><strong>Strekk:</strong> 95% \u2192 z = 1.96</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00E5 formelen</h3>'+
        '<div class="derivation"><div class="d-label">Risting</div>'+
        '<div class="d-line">p\u0302(1\u2212p\u0302) = 0.35 \u00D7 0.65 = 0.2275</div>'+
        '<div class="d-line">0.2275 / 200 = 0.001138</div>'+
        '<div class="d-line">\u221A0.001138 = <strong>0.0337</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Margin</div>'+
        '<div class="d-line">z \u00D7 risting = 1.96 \u00D7 0.0337 = <strong>0.066</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Vegger</div>'+
        '<div class="d-line">Venstre: 0.35 \u2212 0.066 = <strong>0.284</strong> (28.4%)</div>'+
        '<div class="d-line">H\u00F8yre: 0.35 + 0.066 = <strong>0.416</strong> (41.6%)</div></div>'+
        '<div class="result-box"><div class="result-box-name">Konfidensintervall</div>'+
        '<div class="result-box-value">KI = [28.4% , 41.6%]</div>'+
        '<div class="result-box-desc">Den sanne andelen er rammet inn mellom 28.4% og 41.6% med 95% konfidens. Ristingen er omtrent 3.4 prosentpoeng \u2014 ikke verst for n = 200.</div>'+
        '</div></div>';
}

/* === VISUALISERING === */
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
    ctx.fillText('venstre vegg',tx(c.left),ty(pv(c.left))-4);
    ctx.fillText('h\u00F8yre vegg',tx(c.right),ty(pv(c.right))-4);

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
