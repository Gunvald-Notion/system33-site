/* === TILSTAND === */
var mode='t2',currentStep=1;

var CONF={
    t2:{tobs:2.0,crits:[-2.064,2.064],oneTail:false,useT:true,df:24,
        tobsL:'T_obs = 2.0',result:'behold',
        resultL:'Behold H\u2080 \u2014 nesten innenfor',
        vizTitle:'Tosidig t-test',
        vizDesc:'df = 24, \u03B1 = 0.05. Forkastelse i begge haler (\u03B1/2 = 0.025 i hver).'},
    t1:{tobs:2.0,crits:[1.711],oneTail:true,useT:true,df:24,
        tobsL:'T_obs = 2.0',result:'forkast',
        resultL:'Forkast H\u2080 \u2014 forbi veggen',
        vizTitle:'Ensidig t-test',
        vizDesc:'df = 24, \u03B1 = 0.05. Forkastelse kun i h\u00F8yre hale.'},
    z2:{tobs:1.0,crits:[-1.96,1.96],oneTail:false,useT:false,df:30,
        tobsL:'z_obs = 1.0',result:'behold',
        resultL:'Behold H\u2080 \u2014 godt innenfor',
        vizTitle:'z-test (tosidig)',
        vizDesc:'\u03C3 kjent, \u03B1 = 0.05. Normal klokke, begge haler.'}
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

/* === TOSIDIG t-TEST STEG === */
function t2Step(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p>De hevder <strong>\u03BC = 120\u2009000</strong>. Du har et utvalg. \u03C3 er ukjent \u2192 <strong>t-test</strong>. Sp\u00F8rsm\u00E5let er \"er det en forskjell?\" \u2192 <strong>tosidig</strong>.</p>'+
        '<p><strong>H\u2080:</strong> \u03BC = 120\u2009000 &nbsp;&nbsp; <strong>H\u1D00:</strong> \u03BC \u2260 120\u2009000</p>'+
        '<p>Du tegner en klokke sentrert p\u00E5 kravet. S\u00E5 plasserer du h\u00E5ndfullen din p\u00E5 den og sp\u00F8r: hvor sjelden er der den landet?</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>Fem steg, i rekkef\u00F8lge. Tallblind.</p>'+
        '<div class="proc-block"><div class="proc-title">Konstruksjonen</div>'+
        '<div class="proc-step"><strong>1. Hell ut fundamentet.</strong> Tegn klokken sentrert p\u00E5 \u03BC\u2080. Dette er verden <em>hvis</em> H\u2080 er sann.</div>'+
        '<div class="proc-step"><strong>2. Sett bredden.</strong> Klokken strammes av s/\u221An. Ristingen \u2014 klokken sin egen linjal.</div>'+
        '<div class="proc-step"><strong>3. Merk veggene.</strong> \u03B1 bestemmer st\u00F8rrelsen p\u00E5 forkastelsessonene. Tosidig: \u03B1/2 i hver hale. Veggene sitter p\u00E5 \u00B1t<sub>\u03B1/2, df</sub>.</div>'+
        '<div class="proc-step"><strong>4. Plasser koordinaten.</strong> T<sub>obs</sub> = (x\u0304 \u2212 \u03BC\u2080) / (s/\u221An). Gapet i ristinger.</div>'+
        '<div class="proc-step"><strong>5. Sammenlign.</strong> T<sub>obs</sub> forbi veggen \u2192 forkast. Innenfor \u2192 behold.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<p>Ny markedsstrategi. P\u00E5stand: gjennomsnittlig kvartalsomsetnin er 120\u2009000.</p>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>\u03BC\u2080</th><th>x\u0304</th><th>s</th><th>n</th><th>df</th><th>\u03B1</th></tr>'+
        '<tr><td>120\u2009000</td><td>132\u2009000</td><td>30\u2009000</td><td>25</td><td>24</td><td>0.05</td></tr>'+
        '</table></div>'+
        '<p><strong>Ristingen:</strong> s/\u221An = 30\u2009000/\u221A25</p>'+
        '<p><strong>Gapet:</strong> x\u0304 \u2212 \u03BC\u2080 = 132\u2009000 \u2212 120\u2009000</p>'+
        '<p><strong>Kritisk verdi:</strong> t<sub>0.025, 24</sub> = \u00B12.064</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00E5 formelen</h3>'+
        '<div class="derivation"><div class="d-label">Ristingen (linealen)</div>'+
        '<div class="d-line">s/\u221An = 30\u2009000/\u221A25 = 30\u2009000/5 = <strong>6\u2009000</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Det r\u00E5 gapet</div>'+
        '<div class="d-line">x\u0304 \u2212 \u03BC\u2080 = 132\u2009000 \u2212 120\u2009000 = <strong>12\u2009000</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Koordinaten</div>'+
        '<div class="d-line">T<sub>obs</sub> = 12\u2009000 / 6\u2009000 = <strong>2.0</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">To ristinger fra kravet.</div></div>'+
        '<div class="derivation"><div class="d-label">Sammenlign</div>'+
        '<div class="d-line">|T<sub>obs</sub>| = 2.0 &nbsp;&nbsp; vs &nbsp;&nbsp; t<sub>krit</sub> = 2.064</div>'+
        '<div class="d-line">2.0 < 2.064 \u2192 <strong>innenfor veggen.</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Konklusjon</div>'+
        '<div class="result-box-value" style="color:var(--green)">Behold H\u2080</div>'+
        '<div class="result-box-desc">Nesten. H\u00E5ndfullen sitter 2 ristinger fra kravet, men veggen sitter p\u00E5 2.064. Ikke nok bevis til \u00E5 forkaste. 0.064 ristinger reddet kravet.</div>'+
        '</div></div>';
}

/* === ENSIDIG t-TEST STEG === */
function t1Step(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p>Samme p\u00E5stand, samme data. Men n\u00E5 er sp\u00F8rsm\u00E5let <strong>\"er den h\u00F8yere?\"</strong> \u2192 <strong>ensidig</strong>.</p>'+
        '<p><strong>H\u2080:</strong> \u03BC = 120\u2009000 &nbsp;&nbsp; <strong>H\u1D00:</strong> \u03BC > 120\u2009000</p>'+
        '<p>All \u03B1 g\u00E5r til h\u00F8yre hale. Veggen flytter seg n\u00E6rmere sentrum fordi du bare ser i \u00E9n retning.</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>Samme fem steg. \u00C9n endring: veggens plassering.</p>'+
        '<div class="proc-block"><div class="proc-title">Den ensidige forskjellen</div>'+
        '<div class="proc-step"><strong>Bare \u00E9n vegg.</strong> All \u03B1 = 0.05 g\u00E5r til h\u00F8yre hale. Ingen venstre vegg. Du forkaster kun hvis x\u0304 er <em>over</em> kravet.</div>'+
        '<div class="proc-step"><strong>Veggen sitter p\u00E5 t<sub>\u03B1, df</sub></strong> (ikke \u03B1/2). \u03B1 = 0.05, df = 24 \u2192 t<sub>krit</sub> = 1.711.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">Ensidig er lettere \u00E5 forkaste \u2014 veggen er n\u00E6rmere fordi all \u03B1 g\u00E5r til \u00E9n side.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<p>Eksakt samme tall som den tosidige testen. Bare hypotesen endret seg.</p>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>\u03BC\u2080</th><th>x\u0304</th><th>s</th><th>n</th><th>df</th><th>\u03B1</th></tr>'+
        '<tr><td>120\u2009000</td><td>132\u2009000</td><td>30\u2009000</td><td>25</td><td>24</td><td>0.05</td></tr>'+
        '</table></div>'+
        '<p><strong>Kritisk verdi:</strong> t<sub>0.05, 24</sub> = 1.711 (\u00E9n vegg, h\u00F8yre side)</p>'+
        '<p>T<sub>obs</sub> er fortsatt 2.0 \u2014 samme data, samme beregning. Bare veggen flyttet seg.</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00E5 formelen</h3>'+
        '<div class="derivation"><div class="d-label">Samme T_obs</div>'+
        '<div class="d-line">T<sub>obs</sub> = 12\u2009000 / 6\u2009000 = <strong>2.0</strong> (uendret)</div></div>'+
        '<div class="derivation"><div class="d-label">Sammenlign \u2014 annen vegg</div>'+
        '<div class="d-line">T<sub>obs</sub> = 2.0 &nbsp;&nbsp; vs &nbsp;&nbsp; t<sub>krit</sub> = 1.711</div>'+
        '<div class="d-line">2.0 > 1.711 \u2192 <strong>forbi veggen.</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Konklusjon</div>'+
        '<div class="result-box-value" style="color:var(--red)">Forkast H\u2080</div>'+
        '<div class="result-box-desc">Samme data, samme T<sub>obs</sub> = 2.0. Men veggen flyttet seg fra 2.064 til 1.711 fordi all \u03B1 gikk til \u00E9n side. N\u00E5 er 2.0 forbi veggen. Forkast kravet \u2014 den nye strategien \u00F8kte omsetningen.</div>'+
        '</div></div>';
}

/* === z-TEST STEG === */
function z2Step(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p>De hevder <strong>\u03BC = 50</strong>. Du har et utvalg. <strong>\u03C3 = 12 er kjent</strong> \u2192 z-test. \"Er det en forskjell?\" \u2192 tosidig.</p>'+
        '<p><strong>H\u2080:</strong> \u03BC = 50 &nbsp;&nbsp; <strong>H\u1D00:</strong> \u03BC \u2260 50</p>'+
        '<p>Samme konstruksjon som t-testen, men klokken er normal (ikke t-formet) og ristingen bruker \u03C3 i stedet for s.</p>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>Samme fem steg. To bytter.</p>'+
        '<div class="proc-block"><div class="proc-title">z-test-forskjeller</div>'+
        '<div class="proc-step"><strong>Ristingen:</strong> \u03C3/\u221An (ikke s/\u221An). Den ekte spredningen er kjent \u2014 ingen ekstra risting fra \u00E5 estimere den.</div>'+
        '<div class="proc-step"><strong>Tabell:</strong> z-tabell (ikke t-tabell). Ingen df n\u00F8dvendig \u2014 normalklokken er normalklokken.</div>'+
        '<div class="proc-step"><strong>Formel:</strong> z<sub>obs</sub> = (x\u0304 \u2212 \u03BC\u2080) / (\u03C3/\u221An). Samme struktur, annen bokstav.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">P\u00E5 eksamen: z-test er sjeldnere. De fleste oppgaver gir s, ikke \u03C3. N\u00E5r de gir \u03C3, er det alltid z.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<div class="data-card"><table class="data-table">'+
        '<tr><th>\u03BC\u2080</th><th>x\u0304</th><th>\u03C3</th><th>n</th><th>\u03B1</th></tr>'+
        '<tr><td>50</td><td>52</td><td>12</td><td>36</td><td>0.05</td></tr>'+
        '</table></div>'+
        '<p><strong>Ristingen:</strong> \u03C3/\u221An = 12/\u221A36</p>'+
        '<p><strong>Gapet:</strong> x\u0304 \u2212 \u03BC\u2080 = 52 \u2212 50</p>'+
        '<p><strong>Kritisk verdi:</strong> z<sub>0.025</sub> = \u00B11.96</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00E5 formelen</h3>'+
        '<div class="derivation"><div class="d-label">Ristingen</div>'+
        '<div class="d-line">\u03C3/\u221An = 12/\u221A36 = 12/6 = <strong>2</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Det r\u00E5e gapet</div>'+
        '<div class="d-line">x\u0304 \u2212 \u03BC\u2080 = 52 \u2212 50 = <strong>2</strong></div></div>'+
        '<div class="derivation"><div class="d-label">Koordinaten</div>'+
        '<div class="d-line">z<sub>obs</sub> = 2 / 2 = <strong>1.0</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">\u00C9n risting fra kravet.</div></div>'+
        '<div class="derivation"><div class="d-label">Sammenlign</div>'+
        '<div class="d-line">|z<sub>obs</sub>| = 1.0 &nbsp;&nbsp; vs &nbsp;&nbsp; z<sub>krit</sub> = 1.96</div>'+
        '<div class="d-line">1.0 < 1.96 \u2192 <strong>godt innenfor veggen.</strong></div></div>'+
        '<div class="result-box"><div class="result-box-name">Konklusjon</div>'+
        '<div class="result-box-value" style="color:var(--green)">Behold H\u2080</div>'+
        '<div class="result-box-desc">\u00C9n risting fra kravet. Veggen sitter p\u00E5 1.96. Ikke i n\u00E6rheten. Utvalget gir ikke bevis mot kravet.</div>'+
        '</div></div>';
}

/* === VISUALISERING === */
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

    ctx.beginPath();ctx.moveTo(tx(xMin),ty(pv(xMin)));
    for(var x=xMin;x<=xMax;x+=st)ctx.lineTo(tx(x),ty(pv(x)));
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke();

    ctx.setLineDash([4,3]);ctx.strokeStyle='#fafafa';ctx.lineWidth=1;
    c.crits.forEach(function(cv){
        ctx.beginPath();ctx.moveTo(tx(cv),ty(pv(cv)));ctx.lineTo(tx(cv),ch-padBot);ctx.stroke();
    });
    ctx.setLineDash([]);

    ctx.beginPath();ctx.setLineDash([3,4]);
    ctx.moveTo(tx(0),ty(1)-5);ctx.lineTo(tx(0),ch-padBot);
    ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.stroke();ctx.setLineDash([]);

    var tobsColor=c.result==='forkast'?red:green;
    ctx.strokeStyle=tobsColor;ctx.lineWidth=2.5;
    ctx.beginPath();ctx.moveTo(tx(c.tobs),ty(pv(c.tobs)));ctx.lineTo(tx(c.tobs),ch-padBot);ctx.stroke();

    ctx.fillStyle=accent;ctx.font='bold 10px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText('\u03BC\u2080',tx(0),ch-padBot+4);

    ctx.fillStyle='#fafafa';ctx.font='10px Inter,sans-serif';
    c.crits.forEach(function(cv){
        ctx.textAlign='center';ctx.textBaseline='top';
        var label=cv>0?'+'+cv.toFixed(3):cv.toFixed(3);
        ctx.fillText(label,tx(cv),ch-padBot+4);
    });

    ctx.fillStyle=tobsColor;ctx.font='bold 11px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillText(c.tobsL,tx(c.tobs),ty(pv(c.tobs))-6);

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

    var resColor=c.result==='forkast'?red:green;
    ctx.fillStyle=resColor;ctx.font='bold 13px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText(c.resultL,cw/2,ch-16);
}

/* === INIT === */
renderAll();
