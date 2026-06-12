/* === MATEMATIKK === */
function C(n,k){
    if(k<0||k>n)return 0;
    if(k===0||k===n)return 1;
    if(k>n-k)k=n-k;
    var r=1;for(var i=0;i<k;i++)r=r*(n-i)/(i+1);return Math.round(r);
}
function fac(n){var r=1;for(var i=2;i<=n;i++)r*=i;return r;}
function binP(k){return C(10,k)*Math.pow(0.6,k)*Math.pow(0.4,10-k);}
function hypP(k){return C(13,k)*C(13,8-k)/C(26,8);}
function poiP(k){return Math.pow(4,k)*Math.exp(-4)/fac(k);}
function norPDF(x){return Math.exp(-0.5*Math.pow((x-180)/7,2))/(7*Math.sqrt(2*Math.PI));}

/* === TILSTAND === */
var mode='bin',currentStep=1;

/* === MODUSBYTTE === */
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

/* === STEGNAVIGASJON === */
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
    if(mode==='bin')el.innerHTML=binStep(currentStep);
    else if(mode==='hyp')el.innerHTML=hypStep(currentStep);
    else if(mode==='poi')el.innerHTML=poiStep(currentStep);
    else el.innerHTML=norStep(currentStep);
}

function markDone(n){document.querySelectorAll('.step-btn').forEach(function(b,i){if(i<n)b.classList.add('done');});}

/* === FORMELVISNING === */
function brace(){return '<svg class="piece-brace" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M 0 0 Q 4 0 4 4 L 46 4 Q 50 4 50 9 Q 50 4 54 4 L 96 4 Q 100 4 100 0"/></svg>';}
function pc(t,l,c){return '<span class="piece" data-c="'+c+'"><span class="piece-text">'+t+'</span>'+brace()+'<span class="piece-label">'+l+'</span></span>';}
function binFormula(filled){
    var m1=filled?'210':'C(n, k)';
    var m2=filled?'0.0467':'p<sup>k</sup>';
    var m3=filled?'0.0256':'(1\u2212p)<sup>n\u2212k</sup>';
    var m4=filled?'0.2508':'P(X=k)';
    return '<div class="formula-viz">'+
        '<span class="formula-lhs">P(X = k) =</span>'+
        pc(m1,'Trekk 1 \u00B7 m\u00f8nstre','m')+
        '<span class="formula-op">\u00D7</span>'+
        pc(m2,'Trekk 2 \u00B7 suksess','o')+
        '<span class="formula-op">\u00D7</span>'+
        pc(m3,'Trekk 3 \u00B7 fiasko','b')+
        '<span class="formula-op">=</span>'+
        pc(m4,'Trekk 4 \u00B7 vekt','a')+
        '</div>';
}
function hypFormula(filled){
    var m1=filled?'715':'C(M, k)';
    var m2=filled?'715':'C(N\u2212M, n\u2212k)';
    var m3=filled?'1\u202F562\u202F275':'C(N, n)';
    var m4=filled?'0.3272':'P(X=k)';
    return '<div class="formula-viz">'+
        '<span class="formula-lhs">P(X = k) =</span>'+
        pc(m1,'Trekk 1 \u00B7 lysende','m')+
        '<span class="formula-op">\u00D7</span>'+
        pc(m2,'Trekk 2 \u00B7 m\u00f8rk','o')+
        '<span class="formula-op">\u00F7</span>'+
        pc(m3,'Trekk 3 \u00B7 alle hender','b')+
        '<span class="formula-op">=</span>'+
        pc(m4,'Trekk 4 \u00B7 vekt','a')+
        '</div>';
}
function poiFormula(filled){
    var m1=filled?'4096':'\u03BB<sup>k</sup>';
    var m2=filled?'0.0183':'e<sup>\u2212\u03BB</sup>';
    var m3=filled?'720':'k!';
    var m4=filled?'0.1042':'P(X=k)';
    return '<div class="formula-viz">'+
        '<span class="formula-lhs">P(X = k) =</span>'+
        pc(m1,'Trekk 1 \u00B7 r\u00e5 energi','m')+
        '<span class="formula-op">\u00D7</span>'+
        pc(m2,'Trekk 2 \u00B7 tomrommet','o')+
        '<span class="formula-op">\u00F7</span>'+
        pc(m3,'Trekk 3 \u00B7 fakultet','b')+
        '<span class="formula-op">=</span>'+
        pc(m4,'Trekk 4 \u00B7 vekt','a')+
        '</div>';
}
function norFormula(filled){
    var m1=filled?'10':'X\u2212\u03BC';
    var m2=filled?'7':'\u03C3';
    var m3=filled?'1.43':'z';
    var m4=filled?'0.9236':'areal';
    return '<div class="formula-viz">'+
        '<span class="formula-lhs">z =</span>'+
        pc(m1,'Trekk 1 \u00B7 avstand','m')+
        '<span class="formula-op">\u00F7</span>'+
        pc(m2,'Trekk 2 \u00B7 strekk','o')+
        '<span class="formula-op">=</span>'+
        pc(m3,'Trekk 3 \u00B7 z-sk\u00e5r','b')+
        '<span class="formula-op">\u2192</span>'+
        pc(m4,'Trekk 4 \u00B7 areal','a')+
        '</div>';
}

/* === BINOMISK-STEG === */
function binStep(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p><strong>Hva denne fordelingen er til.</strong> De ga deg et fast <strong>antall fors\u00f8k</strong> (n) og en <strong>sannsynlighet per fors\u00f8k</strong> (p) som er den samme hver gang. Antall pluss prosent, med uavhengige fors\u00f8k, er signaturen til binomisk. Jobben er \u00e5 finne hvor mye vekt som ligger p\u00e5 ett eksakt utfall: k suksesser av n fors\u00f8k.</p>'+
        '<p><strong>Hvordan den virker.</strong> Hvert fors\u00f8k er den samme skjeve mynten. Du sp\u00f8r om sjansen for \u00e5 lande n\u00f8yaktig k suksesser. Tre krefter avgj\u00f8r den vekten: hvor mange arrangementer som gir k suksesser, hvor mye de k suksessene koster, og hvor mye de n\u2212k fiaskoene koster. Gang de tre og du har vekten p\u00e5 d\u00f8r k.</p>'+
        '<p><strong>Hvorfor den klarer det.</strong> Fordi fors\u00f8kene ikke p\u00e5virker hverandre, er sjansen for \u00e9n bestemt sekvens bare p ganget k ganger og (1\u2212p) ganget n\u2212k ganger. Hver sekvens med k suksesser b\u00e6rer den samme sjansen, s\u00e5 du teller hvor mange slike sekvenser som finnes og ganger. Det antallet er C(n, k).</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(X = k) = C(n,k) &middot; p<sup>k</sup> &middot; (1\u2212p)<sup>n\u2212k</sup></p>'+
        '<div class="derivation"><div class="d-label">Delene av formelen</div>'+
        '<div class="d-line"><strong>n</strong> \u2014 antall fors\u00f8k (her 10 vandringer)</div>'+
        '<div class="d-line"><strong>p</strong> \u2014 sjansen for suksess i ett fors\u00f8k (her 0.6)</div>'+
        '<div class="d-line"><strong>k</strong> \u2014 antall suksesser du sp\u00f8r om (her 6)</div>'+
        '<div class="d-line"><strong>1\u2212p</strong> \u2014 sjansen for fiasko, p snudd (her 0.4)</div>'+
        '<div class="d-line"><strong>C(n, k)</strong> \u2014 hvor mange arrangementer som gir k suksesser blant n fors\u00f8k</div>'+
        '<div class="d-line"><strong>P(X = k)</strong> \u2014 vekten som ligger p\u00e5 d\u00f8r k</div></div>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>Tre deler ganget sammen til \u00e9n vekt. Her er formen f\u00f8r noen tall lander.</p>'+
        binFormula(false)+
        '<div class="proc-block"><div class="proc-title">De fire trekkene</div>'+
        '<div class="proc-step"><strong>Trekk 1 \u2014 C(n, k), m\u00f8nstre.</strong> Hvor mange m\u00e5ter kan k suksesser ordnes blant n fors\u00f8k? Dette er Drainage fra Kap 3. Bassenget er fors\u00f8kene, trekket er suksessene.</div>'+
        '<div class="proc-step"><strong>Trekk 2 \u2014 p<sup>k</sup>, suksess-energi.</strong> Hver suksess koster sannsynlighet. \u00c5 gange dem sammen krymper vekten.</div>'+
        '<div class="proc-step"><strong>Trekk 3 \u2014 (1\u2212p)<sup>n\u2212k</sup>, fiasko-energi.</strong> Samme logikk for den andre siden. Hver fiasko b\u00e6rer ogs\u00e5 vekt.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">Trekk 4 \u2014 gang sammen. M\u00f8nstre \u00D7 suksess-energi \u00D7 fiasko-energi = vekten som ligger p\u00e5 den d\u00f8ren.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<p>Hvert tall i formelen kommer rett fra oppgaveteksten. Her er hvor hvert av dem finnes.</p>'+
        '<div class="data-card"><div class="data-title">Fra oppgaven</div><table class="data-table">'+
        '<tr><th>n (fors\u00f8k)</th><th>p (per fors\u00f8k)</th><th>k (sp\u00f8r om)</th><th>Senter (np)</th></tr>'+
        '<tr><td>10</td><td>0.6</td><td>6</td><td>6</td></tr>'+
        '</table></div>'+
        '<div class="derivation"><div class="d-label">Hvor hvert tall kommer fra</div>'+
        '<div class="d-line"><strong>n = 10</strong> \u2014 gitt til deg. Oppgaven sier ti vandringer, ti fors\u00f8k. Dette er antallet.</div>'+
        '<div class="d-line"><strong>p = 0.6</strong> \u2014 gitt til deg. Oppgaven gir suksessjansen per fors\u00f8k direkte: 60 prosent.</div>'+
        '<div class="d-line"><strong>k = 6</strong> \u2014 gitt til deg. Dette er det eksakte utfallet sp\u00f8rsm\u00e5let handler om: seks suksesser.</div>'+
        '<div class="d-line"><strong>1\u2212p = 0.4</strong> \u2014 ikke gitt til deg. Du snur p for \u00e5 f\u00e5 den: 1 \u2212 0.6 = 0.4. Koster en suksess 0.6, er en fiasko det som er igjen, de andre 40 prosentene.</div>'+
        '</div>'+
        '<p><strong>De tre delene som skal bygges:</strong></p>'+
        '<p>C(10, 6) \u2192 m\u00f8nsterteller, fra n og k</p>'+
        '<p>0.6<sup>6</sup> \u2192 suksess-energi, p opph\u00f8yd i k</p>'+
        '<p>0.4<sup>4</sup> \u2192 fiasko-energi, den snudde opph\u00f8yd i n\u2212k</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00e5 formelen</h3>'+
        binFormula(true)+
        '<div class="derivation"><div class="d-label" style="color:#a78bfa">Trekk 1 \u2014 m\u00f8nstre \u00B7 C(10, 6)</div>'+
        '<div class="d-line">C(10, 6) = 10! \u00F7 (6! \u00B7 4!)</div>'+
        '<div class="d-line">6! kansellerer toppen \u2192 (10 \u00B7 9 \u00B7 8 \u00B7 7) \u00F7 (4 \u00B7 3 \u00B7 2 \u00B7 1)</div>'+
        '<div class="d-line">topp: 10 \u00B7 9 \u00B7 8 \u00B7 7 = 5040</div>'+
        '<div class="d-line">bunn: 4 \u00B7 3 \u00B7 2 \u00B7 1 = 24</div>'+
        '<div class="d-line">5040 \u00F7 24 = <strong style="color:#a78bfa">210</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">n og k mater denne. 210 er hvor mange m\u00e5ter seks suksesser kan sitte blant ti fors\u00f8k.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#22c55e">Trekk 2 \u2014 suksess-energi \u00B7 0.6<sup>6</sup></div>'+
        '<div class="d-line">0.6 \u00D7 0.6 = 0.36</div>'+
        '<div class="d-line">0.36 \u00D7 0.6 = 0.216</div>'+
        '<div class="d-line">0.216 \u00D7 0.6 = 0.1296</div>'+
        '<div class="d-line">0.1296 \u00D7 0.6 = 0.07776</div>'+
        '<div class="d-line">0.07776 \u00D7 0.6 = <strong style="color:#22c55e">0.046656</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">p opph\u00f8yd i k. 0.6-en kom fra oppgaven, ganget med seg selv seks ganger, \u00e9n for hver suksess.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#3b82f6">Trekk 3 \u2014 fiasko-energi \u00B7 0.4<sup>4</sup></div>'+
        '<div class="d-line">snu p f\u00f8rst: 1 \u2212 0.6 = 0.4</div>'+
        '<div class="d-line">0.4 \u00D7 0.4 = 0.16</div>'+
        '<div class="d-line">0.16 \u00D7 0.4 = 0.064</div>'+
        '<div class="d-line">0.064 \u00D7 0.4 = <strong style="color:#3b82f6">0.0256</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">den snudde opph\u00f8yd i n\u2212k. Ti fors\u00f8k minus seks suksesser etterlater fire fiaskoer, s\u00e5 0.4 ganget med seg selv fire ganger.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#f59e0b">Trekk 4 \u2014 gang de tre</div>'+
        '<div class="d-line">210 \u00D7 0.046656 = 9.798</div>'+
        '<div class="d-line">9.798 \u00D7 0.0256 = <strong style="color:#f59e0b">0.2508</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">m\u00f8nstre \u00D7 suksess-energi \u00D7 fiasko-energi = vekten p\u00e5 d\u00f8r 6.</div></div>'+
        '<div class="result-box" style="border-left-color:#f59e0b"><div class="result-box-name">Trekk 4 \u2014 P(X = 6)</div>'+
        '<div class="result-box-value" style="color:#f59e0b">P(X = 6) = 0.2508</div>'+
        '<div class="result-box-desc">25.1% i midten av klokken. Toppen. Den tyngste d\u00f8ren. Flytt deg ett steg unna og vekten faller.</div>'+
        '</div></div>';
}

/* === HYPERGEOMETRISK-STEG === */
function hypStep(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p><strong>Hva denne fordelingen er til.</strong> De ga deg <strong>eksakte antall av typer i et endelig basseng</strong> \u2014 M lysende av N totalt \u2014 og du trekker n uten \u00e5 legge noe tilbake. Ingen prosent noe sted, bare hele tall, og bassenget krymper for hvert trekk. Jobben er \u00e5 finne hvor mye vekt som ligger p\u00e5 ett eksakt utfall: \u00e5 trekke k lysende opp i h\u00e5nden.</p>'+
        '<p><strong>Hvordan den virker.</strong> Dette er ren telling. Gunstige arrangementer over alle mulige arrangementer, gunstige over mulige. Tell m\u00e5tene \u00e5 plukke k lysende fra de M som finnes, gang med m\u00e5tene \u00e5 fylle resten av h\u00e5nden fra den m\u00f8rke haugen, og del p\u00e5 alle m\u00e5tene \u00e5 trekke n fra N. Den br\u00f8ken er vekten p\u00e5 d\u00f8r k.</p>'+
        '<p><strong>Hvorfor den klarer det.</strong> Fordi hvert trekk endrer hva som er igjen, holder ingen enkelt prosent seg sann fra ett trekk til det neste. S\u00e5 i stedet for en prosent teller du: hvor mange hender holder n\u00f8yaktig k lysende, satt opp mot hvor mange hender som finnes i det hele tatt. Tellingen b\u00e6rer det krympende bassenget helt selv, uten noen sannsynlighet.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(X = k) = C(M,k) &middot; C(N\u2212M, n\u2212k) / C(N, n)</p>'+
        '<div class="derivation"><div class="d-label">Delene av formelen</div>'+
        '<div class="d-line"><strong>N</strong> \u2014 den totale st\u00f8rrelsen p\u00e5 bassenget (her 26)</div>'+
        '<div class="d-line"><strong>M</strong> \u2014 hvor mange lysende som sitter i bassenget (her 13)</div>'+
        '<div class="d-line"><strong>n</strong> \u2014 hvor mange du trekker (her 8)</div>'+
        '<div class="d-line"><strong>k</strong> \u2014 antall lysende du sp\u00f8r om (her 4)</div>'+
        '<div class="d-line"><strong>N\u2212M</strong> \u2014 den m\u00f8rke haugen, det som er igjen n\u00e5r de lysende er fjernet (her 13)</div>'+
        '<div class="d-line"><strong>C(M, k)</strong> \u2014 hvor mange m\u00e5ter \u00e5 plukke k lysende fra M</div>'+
        '<div class="d-line"><strong>C(N\u2212M, n\u2212k)</strong> \u2014 hvor mange m\u00e5ter \u00e5 fylle resten fra den m\u00f8rke haugen</div>'+
        '<div class="d-line"><strong>C(N, n)</strong> \u2014 hvor mange m\u00e5ter \u00e5 trekke n fra hele bassenget</div>'+
        '<div class="d-line"><strong>P(X = k)</strong> \u2014 vekten som ligger p\u00e5 d\u00f8r k</div></div>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>To tellinger ganget i telleren, \u00e9n telling i nevneren. Her er formen f\u00f8r noen tall lander.</p>'+
        hypFormula(false)+
        '<div class="proc-block"><div class="proc-title">De fire trekkene</div>'+
        '<div class="proc-step"><strong>Trekk 1 \u2014 C(M, k), lysende basseng.</strong> Hvor mange m\u00e5ter \u00e5 plukke k lysende fra de M som finnes. Drainage fra den lyse siden.</div>'+
        '<div class="proc-step"><strong>Trekk 2 \u2014 C(N\u2212M, n\u2212k), m\u00f8rkt basseng.</strong> Hvor mange m\u00e5ter \u00e5 fylle resten av h\u00e5nden med ikke-lysende. Drainage fra den m\u00f8rke siden.</div>'+
        '<div class="proc-step"><strong>Trekk 3 \u2014 C(N, n), alle hender.</strong> Alle m\u00e5ter \u00e5 trekke n fra N, alle verdener. Dette er nevneren.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">Trekk 4 \u2014 del. Lysende \u00D7 m\u00f8rk, over alle hender = vekten som ligger p\u00e5 den d\u00f8ren. Gunstige over mulige.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<p>Hvert tall i formelen kommer rett fra oppgaveteksten. Her er hvor hvert av dem finnes.</p>'+
        '<div class="data-card"><div class="data-title">Fra oppgaven</div><table class="data-table">'+
        '<tr><th>N (totalt)</th><th>M (lysende)</th><th>n (trukket)</th><th>k (sp\u00f8r om)</th><th>Senter (nM/N)</th></tr>'+
        '<tr><td>26</td><td>13</td><td>8</td><td>4</td><td>4</td></tr>'+
        '</table></div>'+
        '<div class="derivation"><div class="d-label">Hvor hvert tall kommer fra</div>'+
        '<div class="d-line"><strong>N = 26</strong> \u2014 gitt til deg. Oppgaven navngir hele bassenget: tjueseks totalt.</div>'+
        '<div class="d-line"><strong>M = 13</strong> \u2014 gitt til deg. Oppgaven sier hvor mange av bassenget som er lysende: tretten.</div>'+
        '<div class="d-line"><strong>n = 8</strong> \u2014 gitt til deg. Oppgaven sier hvor mange du trekker: \u00e5tte.</div>'+
        '<div class="d-line"><strong>k = 4</strong> \u2014 gitt til deg. Dette er det eksakte utfallet sp\u00f8rsm\u00e5let handler om: fire lysende.</div>'+
        '<div class="d-line"><strong>N\u2212M = 13</strong> \u2014 ikke gitt til deg. Du trekker fra for \u00e5 f\u00e5 den: 26 \u2212 13 = 13. Alt som ikke er lysende er den m\u00f8rke haugen.</div>'+
        '<div class="d-line"><strong>n\u2212k = 4</strong> \u2014 ikke gitt til deg. Du trekker fra: 8 \u2212 4 = 4. Setene i h\u00e5nden som ikke tas av lysende fylles fra det m\u00f8rke.</div>'+
        '</div>'+
        '<p><strong>De tre delene som skal bygges:</strong></p>'+
        '<p>C(13, 4) \u2192 lysende basseng, k fra M</p>'+
        '<p>C(13, 4) \u2192 m\u00f8rkt basseng, n\u2212k fra N\u2212M</p>'+
        '<p>C(26, 8) \u2192 alle hender, n fra N</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00e5 formelen</h3>'+
        hypFormula(true)+
        '<div class="derivation"><div class="d-label" style="color:#a78bfa">Trekk 1 \u2014 lysende basseng \u00B7 C(13, 4)</div>'+
        '<div class="d-line">C(13, 4) = 13! \u00F7 (4! \u00B7 9!)</div>'+
        '<div class="d-line">9! kansellerer toppen \u2192 (13 \u00B7 12 \u00B7 11 \u00B7 10) \u00F7 (4 \u00B7 3 \u00B7 2 \u00B7 1)</div>'+
        '<div class="d-line">topp: 13 \u00B7 12 \u00B7 11 \u00B7 10 = 17160</div>'+
        '<div class="d-line">bunn: 4 \u00B7 3 \u00B7 2 \u00B7 1 = 24</div>'+
        '<div class="d-line">17160 \u00F7 24 = <strong style="color:#a78bfa">715</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">M og k mater denne. 715 er hvor mange m\u00e5ter fire lysende kan plukkes fra de tretten som finnes.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#22c55e">Trekk 2 \u2014 m\u00f8rkt basseng \u00B7 C(13, 4)</div>'+
        '<div class="d-line">den m\u00f8rke haugen f\u00f8rst: N \u2212 M = 26 \u2212 13 = 13</div>'+
        '<div class="d-line">s\u00e5 setene som skal fylles: n \u2212 k = 8 \u2212 4 = 4</div>'+
        '<div class="d-line">C(13, 4) = <strong style="color:#22c55e">715</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">samme form som Trekk 1, og her samme tall ved tilfeldighet: fire ikke-lysende plukket fra de tretten m\u00f8rke.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#3b82f6">Trekk 3 \u2014 alle hender \u00B7 C(26, 8)</div>'+
        '<div class="d-line">C(26, 8) = 26! \u00F7 (8! \u00B7 18!)</div>'+
        '<div class="d-line">C(26, 8) = <strong style="color:#3b82f6">1\u202F562\u202F275</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">N og n mater denne. Hver mulig h\u00e5nd p\u00e5 \u00e5tte trukket fra de tjueseks, lysende eller ikke.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#f59e0b">Trekk 4 \u2014 del</div>'+
        '<div class="d-line">teller: 715 \u00D7 715 = 511\u202F225</div>'+
        '<div class="d-line">511\u202F225 \u00F7 1\u202F562\u202F275 = <strong style="color:#f59e0b">0.3272</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">lysende \u00D7 m\u00f8rk, over alle hender = vekten p\u00e5 d\u00f8r 4.</div></div>'+
        '<div class="result-box" style="border-left-color:#f59e0b"><div class="result-box-name">Trekk 4 \u2014 P(X = 4)</div>'+
        '<div class="result-box-value" style="color:#f59e0b">P(X = 4) = 0.3272</div>'+
        '<div class="result-box-desc">32.7% i midten av klokken. Toppen. Nesten samme form som binomisk, men det krympende bassenget klemmer klokken litt strammere.</div>'+
        '</div></div>';
}

/* === POISSON-STEG === */
function poiStep(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p><strong>Hva denne fordelingen er til.</strong> De ga deg en <strong>gjennomsnittlig rate</strong> (\u03BB, lambda) over et <strong>vindu</strong> \u2014 hendelser som kommer i sin egen takt. Ingen fast antall fors\u00f8k, ingen boks, ingen prosent per fors\u00f8k. Bare en rytme og et vindu. Jobben er \u00e5 finne hvor mye vekt som ligger p\u00e5 ett eksakt antall: k hendelser som lander i vinduet.</p>'+
        '<p><strong>Hvordan den virker.</strong> Tre krefter avgj\u00f8r vekten. Rytmen opph\u00f8yd i antallet presser energi utover. Tomrommet, sjansen for total stillhet, drar alt ned igjen. Fakultetet stripper bort rekkef\u00f8lgen, fordi de samme hendelsene i en annen rekkef\u00f8lge er det samme utfallet. Gang de to f\u00f8rste, del p\u00e5 den tredje, og du har vekten p\u00e5 d\u00f8r k.</p>'+
        '<p><strong>Hvorfor den klarer det.</strong> Fordi hendelser kommer uavhengig og vinduet er fast, er sjansen for \u00e9n bestemt tidslinje med k hendelser rytmen ganget k ganger, skalert med stillhetens vekt. Hver rekkef\u00f8lge av de k hendelsene er det samme utfallet, s\u00e5 du folder dem sammen ved \u00e5 dele p\u00e5 k!. Det er det som etterlater en ren vekt p\u00e5 antallet.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(X = k) = \u03BB<sup>k</sup> &middot; e<sup>\u2212\u03BB</sup> / k!</p>'+
        '<div class="derivation"><div class="d-label">Delene av formelen</div>'+
        '<div class="d-line"><strong>\u03BB</strong> \u2014 gjennomsnittsraten over vinduet (her 4)</div>'+
        '<div class="d-line"><strong>k</strong> \u2014 det eksakte antallet du sp\u00f8r om (her 6)</div>'+
        '<div class="d-line"><strong>\u03BB<sup>k</sup></strong> \u2014 rytmen opph\u00f8yd i antallet, r\u00e5 energi</div>'+
        '<div class="d-line"><strong>e<sup>\u2212\u03BB</sup></strong> \u2014 tomrommet, sjansen for total stillhet i vinduet</div>'+
        '<div class="d-line"><strong>k!</strong> \u2014 fakultetet, alle rekkef\u00f8lgene av k hendelser foldet til \u00e9n</div>'+
        '<div class="d-line"><strong>P(X = k)</strong> \u2014 vekten som ligger p\u00e5 d\u00f8r k</div></div>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>To krefter ganget, \u00e9n som deler dem ned. Her er formen f\u00f8r noen tall lander.</p>'+
        poiFormula(false)+
        '<div class="proc-block"><div class="proc-title">De fire trekkene</div>'+
        '<div class="proc-step"><strong>Trekk 1 \u2014 \u03BB<sup>k</sup>, r\u00e5 energi.</strong> Rytmen opph\u00f8yd i antallet. Jo lenger forbi senteret du st\u00e5r, desto mer ganger rytmen seg inn i seg selv.</div>'+
        '<div class="proc-step"><strong>Trekk 2 \u2014 e<sup>\u2212\u03BB</sup>, tomrommet.</strong> Stillhetens vekt, sjansen for at ingenting dukker opp i hele vinduet. Alt som skjedde m\u00e5tte klatre ut av dette.</div>'+
        '<div class="proc-step"><strong>Trekk 3 \u2014 k!, fakultetet.</strong> Stripper bort rekkef\u00f8lgen. En hendelse ved minutt 2 s\u00e5 minutt 7 er det samme som minutt 7 s\u00e5 minutt 2, s\u00e5 del p\u00e5 alle arrangementene.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">Trekk 4 \u2014 kombiner. R\u00e5 energi \u00D7 tomrom, over fakultetet = vekten som ligger p\u00e5 den d\u00f8ren.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<p>Hvert tall i formelen kommer rett fra oppgaveteksten. Her er hvor hvert av dem finnes.</p>'+
        '<div class="data-card"><div class="data-title">Fra oppgaven</div><table class="data-table">'+
        '<tr><th>\u03BB (rytme)</th><th>k (antall)</th><th>Senter (\u03BB)</th></tr>'+
        '<tr><td>4</td><td>6</td><td>4</td></tr>'+
        '</table></div>'+
        '<div class="derivation"><div class="d-label">Hvor hvert tall kommer fra</div>'+
        '<div class="d-line"><strong>\u03BB = 4</strong> \u2014 gitt til deg. Oppgaven gir gjennomsnittsraten over vinduet direkte: fire i snitt.</div>'+
        '<div class="d-line"><strong>k = 6</strong> \u2014 gitt til deg. Dette er det eksakte antallet sp\u00f8rsm\u00e5let handler om: seks hendelser.</div>'+
        '<div class="d-line"><strong>Senter = 4</strong> \u2014 ikke gitt som eget tall. For Poisson er senteret bare rytmen selv, s\u00e5 \u03BB = 4 er ogs\u00e5 midten av klokken. \u00c5 st\u00e5 ved k = 6 er to steg forbi senteret.</div>'+
        '</div>'+
        '<p><strong>De tre delene som skal bygges:</strong></p>'+
        '<p>4<sup>6</sup> \u2192 r\u00e5 energi, \u03BB opph\u00f8yd i k</p>'+
        '<p>e<sup>\u22124</sup> \u2192 tomrommet, e i minus \u03BB</p>'+
        '<p>6! \u2192 fakultetet, k!</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00e5 formelen</h3>'+
        poiFormula(true)+
        '<div class="derivation"><div class="d-label" style="color:#a78bfa">Trekk 1 \u2014 r\u00e5 energi \u00B7 4<sup>6</sup></div>'+
        '<div class="d-line">4 \u00D7 4 = 16</div>'+
        '<div class="d-line">16 \u00D7 4 = 64</div>'+
        '<div class="d-line">64 \u00D7 4 = 256</div>'+
        '<div class="d-line">256 \u00D7 4 = 1024</div>'+
        '<div class="d-line">1024 \u00D7 4 = <strong style="color:#a78bfa">4096</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">\u03BB opph\u00f8yd i k. Rytmen 4 ganget med seg selv seks ganger, \u00e9n for hver hendelse.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#22c55e">Trekk 2 \u2014 tomrommet \u00B7 e<sup>\u22124</sup></div>'+
        '<div class="d-line">e<sup>\u22124</sup> = 1 \u00F7 e<sup>4</sup></div>'+
        '<div class="d-line">e<sup>4</sup> \u2248 54.598</div>'+
        '<div class="d-line">1 \u00F7 54.598 = <strong style="color:#22c55e">0.018316</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">behold den uavrundede 0.018316 til den siste gangingen. Runder du til 0.0183 for tidlig, driver svaret av med et h\u00e5r.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#3b82f6">Trekk 3 \u2014 fakultetet \u00B7 6!</div>'+
        '<div class="d-line">6 \u00D7 5 = 30</div>'+
        '<div class="d-line">30 \u00D7 4 = 120</div>'+
        '<div class="d-line">120 \u00D7 3 = 360</div>'+
        '<div class="d-line">360 \u00D7 2 = 720</div>'+
        '<div class="d-line">720 \u00D7 1 = <strong style="color:#3b82f6">720</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">alle rekkef\u00f8lgene av seks hendelser foldet til \u00e9n. Rekkef\u00f8lgen betyr ikke noe, s\u00e5 del dem ut.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#f59e0b">Trekk 4 \u2014 kombiner</div>'+
        '<div class="d-line">teller: 4096 \u00D7 0.018316 = 75.02</div>'+
        '<div class="d-line">75.02 \u00F7 720 = <strong style="color:#f59e0b">0.1042</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">r\u00e5 energi \u00D7 tomrom, over fakultetet = vekten p\u00e5 d\u00f8r 6.</div></div>'+
        '<div class="result-box" style="border-left-color:#f59e0b"><div class="result-box-name">Trekk 4 \u2014 P(X = 6)</div>'+
        '<div class="result-box-value" style="color:#f59e0b">P(X = 6) = 0.1042</div>'+
        '<div class="result-box-desc">10.4% to steg forbi senteret. Fanger fortsatt ekte vekt \u2014 omtrent ett av ti vinduer ser slik ut. G\u00e5 ut til d\u00f8r 10 og energien forsvinner nesten.</div>'+
        '</div></div>';
}

/* === NORMAL-STEG === */
function norStep(s){
    if(s===1)return '<div class="step-content"><h3>Steg 1 \u2014 Plantegning</h3>'+
        '<p><strong>Hva denne fordelingen er til.</strong> De sa det rett ut (<strong>normalfordelt</strong>), eller du summerer mange uavhengige ting (sentralgrensesetningen). Dette er kontinuerlig m\u00e5ling \u2014 ingen diskrete d\u00f8rer, ingen telling. Jobben er \u00e5 finne hvor mye av klokken som ligger p\u00e5 \u00e9n side av der du st\u00e5r: arealet under kurven fram til punktet ditt.</p>'+
        '<p><strong>Hvordan den virker.</strong> Du kan ikke lese arealet rett av r\u00e5-m\u00e5lingen, fordi hver normalklokke har sitt eget senter og sitt eget strekk. S\u00e5 du konverterer f\u00f8rst punktet ditt til en standardsk\u00e5r \u2014 hvor mange strekk fra senteret du st\u00e5r. Det tallet er z. N\u00e5r du er p\u00e5 standardklokken, holder \u00e9n fast z-tabell arealet for hvert mulig punkt.</p>'+
        '<p><strong>Hvorfor den klarer det.</strong> Fordi hver normalklokke har samme form, bare forskj\u00f8vet og skalert. Trekk fra senteret og del p\u00e5 strekket, og enhver klokke kollapser ned p\u00e5 den ene standardklokken der \u03BC = 0 og \u03C3 = 1. Det er derfor \u00e9n enkelt tabell kan svare p\u00e5 hvert normalsp\u00f8rsm\u00e5l \u2014 standardiseringen er det som gj\u00f8r dem alle til samme kurve.</p>'+
        '<p style="color:var(--accent);font-weight:500;margin-top:12px">z = (X \u2212 \u03BC) / \u03C3 &nbsp;&nbsp;\u2192&nbsp;&nbsp; z-tabell</p>'+
        '<div class="derivation"><div class="d-label">Delene av formelen</div>'+
        '<div class="d-line"><strong>\u03BC</strong> \u2014 senteret av klokken, gjennomsnittet (her 180)</div>'+
        '<div class="d-line"><strong>\u03C3</strong> \u2014 strekket, ett standardsteg ut fra senteret (her 7)</div>'+
        '<div class="d-line"><strong>X</strong> \u2014 punktet du st\u00e5r p\u00e5 (her 190)</div>'+
        '<div class="d-line"><strong>X \u2212 \u03BC</strong> \u2014 avstanden fra senteret, hvor langt punktet ditt sitter fra midten</div>'+
        '<div class="d-line"><strong>z</strong> \u2014 standardsk\u00e5ren, den avstanden m\u00e5lt i strekk</div>'+
        '<div class="d-line"><strong>areal</strong> \u2014 skiven av klokken z-tabellen gir tilbake, vekten fram til punktet ditt</div></div>'+
        '</div>';
    if(s===2)return '<div class="step-content"><h3>Steg 2 \u2014 Prosessen</h3>'+
        '<p>\u00c9n subtraksjon, \u00e9n divisjon, s\u00e5 et oppslag. Her er formen f\u00f8r noen tall lander.</p>'+
        norFormula(false)+
        '<div class="proc-block"><div class="proc-title">De fire trekkene</div>'+
        '<div class="proc-step"><strong>Trekk 1 \u2014 X \u2212 \u03BC, avstand fra senteret.</strong> Hvor langt er punktet ditt fra midten av klokken? Negativt hvis under, positivt hvis over.</div>'+
        '<div class="proc-step"><strong>Trekk 2 \u2014 \u00F7 \u03C3, konverter til strekk.</strong> Del avstanden p\u00e5 ett strekk. N\u00e5 m\u00e5les avstanden i standardsteg, ikke r\u00e5 enheter.</div>'+
        '<div class="proc-step"><strong>Trekk 3 \u2014 z, standardsk\u00e5ren.</strong> Resultatet lander deg p\u00e5 standardklokken der \u03BC = 0 og \u03C3 = 1. Dette er tallet tabellen leser.</div>'+
        '<div class="proc-step" style="margin-top:8px;color:var(--accent)">Trekk 4 \u2014 z-tabell. Sl\u00e5 opp z og tabellen gir tilbake arealet under klokken til venstre for der du st\u00e5r.</div>'+
        '</div>'+
        '<div class="proc-block"><div class="proc-title">68\u201395\u201399.7-regelen</div>'+
        '<div class="proc-step">68% innenfor \u00B11\u03C3. 95% innenfor \u00B12\u03C3. 99.7% innenfor \u00B13\u03C3. Dette gir deg umiddelbar orientering f\u00f8r du i det hele tatt r\u00f8rer z-tabellen.</div>'+
        '</div></div>';
    if(s===3){markDone(2);return '<div class="step-content"><h3>Steg 3 \u2014 Dataene</h3>'+
        '<p>Hvert tall i formelen kommer rett fra oppgaveteksten. Her er hvor hvert av dem finnes.</p>'+
        '<div class="data-card"><div class="data-title">Fra oppgaven</div><table class="data-table">'+
        '<tr><th>\u03BC (senter)</th><th>\u03C3 (strekk)</th><th>X (st\u00e5r ved)</th><th>Avstand (X\u2212\u03BC)</th></tr>'+
        '<tr><td>180</td><td>7</td><td>190</td><td>10</td></tr>'+
        '</table></div>'+
        '<div class="derivation"><div class="d-label">Hvor hvert tall kommer fra</div>'+
        '<div class="d-line"><strong>\u03BC = 180</strong> \u2014 gitt til deg. Oppgaven navngir senteret av klokken direkte: gjennomsnittet er 180.</div>'+
        '<div class="d-line"><strong>\u03C3 = 7</strong> \u2014 gitt til deg. Oppgaven gir strekket, ett standardsteg fra senteret: 7.</div>'+
        '<div class="d-line"><strong>X = 190</strong> \u2014 gitt til deg. Dette er punktet sp\u00f8rsm\u00e5let handler om: st\u00e5r ved 190.</div>'+
        '<div class="d-line"><strong>X \u2212 \u03BC = 10</strong> \u2014 ikke gitt til deg. Du trekker fra: 190 \u2212 180 = 10. Ti r\u00e5 enheter over senteret.</div>'+
        '</div>'+
        '<p><strong>Delene som skal bygges:</strong></p>'+
        '<p>190 \u2212 180 \u2192 avstand, X minus \u03BC</p>'+
        '<p>\u00F7 7 \u2192 standardiser, avstand over \u03C3</p>'+
        '<p>z-tabell \u2192 areal, sl\u00e5 opp z-sk\u00e5ren</p>'+
        '</div>';}
    markDone(3);return '<div class="step-content"><h3>Steg 4 \u2014 G\u00e5 formelen</h3>'+
        norFormula(true)+
        '<div class="derivation"><div class="d-label" style="color:#a78bfa">Trekk 1 \u2014 avstand fra senteret \u00B7 X \u2212 \u03BC</div>'+
        '<div class="d-line">X \u2212 \u03BC = 190 \u2212 180</div>'+
        '<div class="d-line">190 \u2212 180 = <strong style="color:#a78bfa">10</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">X og \u03BC mater denne. Ti r\u00e5 enheter over senteret av klokken.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#22c55e">Trekk 2 \u2014 konverter til strekk \u00B7 \u00F7 \u03C3</div>'+
        '<div class="d-line">ett strekk er \u03C3 = 7</div>'+
        '<div class="d-line">10 \u00F7 7 = <strong style="color:#22c55e">1.43</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">avstanden delt p\u00e5 ett strekk. Ti enheter er omtrent halvannet strekk ut.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#3b82f6">Trekk 3 \u2014 standardsk\u00e5ren \u00B7 z</div>'+
        '<div class="d-line">z = <strong style="color:#3b82f6">1.43</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">her st\u00e5r du p\u00e5 standardklokken, \u03BC = 0 og \u03C3 = 1. Tallet tabellen leser.</div></div>'+
        '<div class="derivation"><div class="d-label" style="color:#f59e0b">Trekk 4 \u2014 z-tabelloppslag</div>'+
        '<div class="d-line">z = 1.43 \u2192 <strong style="color:#f59e0b">0.9236</strong></div>'+
        '<div class="d-line" style="color:var(--muted)">tabellen gir tilbake arealet til venstre. 0.9236 av klokken ligger under deg.</div></div>'+
        '<div class="result-box" style="border-left-color:#f59e0b"><div class="result-box-name">Trekk 4 \u2014 P(X \u2264 190)</div>'+
        '<div class="result-box-value" style="color:#f59e0b">P(X \u2264 190) = 0.9236</div>'+
        '<div class="result-box-desc">92.4% av klokken ligger under deg. Du st\u00e5r p\u00e5 h\u00f8yre skr\u00e5ning, over det meste av vekten. Bare 7.6% av energien er lenger til h\u00f8yre.</div>'+
        '</div></div>';
}

/* === VISUALISERING === */
function drawViz(){
    var labels={
        bin:{title:'Binomisk klokke',desc:'Bin(10, 0.6) \u2014 11 d\u00f8rer fra 0 til 10. St\u00e5r ved k = 6.'},
        hyp:{title:'Hypergeometrisk klokke',desc:'Hyp(26, 13, 8) \u2014 9 d\u00f8rer fra 0 til 8. St\u00e5r ved k = 4.'},
        poi:{title:'Poisson-klokke',desc:'Po(4) \u2014 d\u00f8rer fra 0 og utover. St\u00e5r ved k = 6.'},
        nor:{title:'Normalkurve',desc:'N(180, 7\u00B2) \u2014 kontinuerlig. St\u00e5r ved x = 190.'}
    };
    document.getElementById('viz-title').textContent=labels[mode].title;
    document.getElementById('viz-desc').textContent=labels[mode].desc;
    if(mode==='nor') drawNormal(); else drawBars();
}

function drawBars(){
    var conf={
        bin:{kMin:0,kMax:10,kH:6,mu:6,muL:'\u03BC = np = 6',fn:binP},
        hyp:{kMin:0,kMax:8,kH:4,mu:4,muL:'\u03BC = nM/N = 4',fn:hypP},
        poi:{kMin:0,kMax:12,kH:6,mu:4,muL:'\u03BC = \u03BB = 4',fn:poiP}
    }[mode];
    var wrap=document.getElementById('viz-wrap');
    var canvas=document.getElementById('viz-canvas');
    var dpr=window.devicePixelRatio||1;
    var cw=wrap.clientWidth-18;
    var ch=280;
    canvas.width=cw*dpr;canvas.height=ch*dpr;
    canvas.style.width=cw+'px';canvas.style.height=ch+'px';
    var ctx=canvas.getContext('2d');
    ctx.scale(dpr,dpr);ctx.clearRect(0,0,cw,ch);

    var accent='#a78bfa',green='#22c55e',muted='#71717a',border='#27272a';
    var padL=35,padR=15,padTop=30,padBot=30;
    var plotW=cw-padL-padR;
    var plotH=ch-padTop-padBot;
    var nBars=conf.kMax-conf.kMin+1;
    var barW=plotW/(nBars+1);
    var maxP=0;
    for(var k=conf.kMin;k<=conf.kMax;k++) maxP=Math.max(maxP,conf.fn(k));

    // Akse
    ctx.strokeStyle=border;ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(padL,ch-padBot);ctx.lineTo(cw-padR,ch-padBot);ctx.stroke();

    // Søyler
    for(var k=conf.kMin;k<=conf.kMax;k++){
        var p=conf.fn(k);
        var x=padL+(k-conf.kMin+1)*barW;
        var h=Math.max(1,(p/maxP)*plotH*0.82);
        var y=ch-padBot-h;
        var bw=Math.max(4,barW*0.65);
        var isHL=(k===conf.kH);
        ctx.fillStyle=isHL?'rgba(167,139,250,0.35)':'rgba(167,139,250,0.08)';
        rr(ctx,x-bw/2,y,bw,h,3);ctx.fill();
        ctx.strokeStyle=isHL?accent:'rgba(167,139,250,0.2)';
        ctx.lineWidth=isHL?1.5:1;
        rr(ctx,x-bw/2,y,bw,h,3);ctx.stroke();
        // K-etikett
        ctx.fillStyle=isHL?'#fafafa':muted;
        ctx.font=(cw<400?'8':'10')+'px Inter,sans-serif';
        ctx.textAlign='center';ctx.textBaseline='top';
        ctx.fillText(k.toString(),x,ch-padBot+4);
    }

    // Mu-linje
    var muX=padL+(conf.mu-conf.kMin+1)*barW;
    ctx.beginPath();ctx.setLineDash([4,3]);
    ctx.moveTo(muX,padTop+14);ctx.lineTo(muX,ch-padBot);
    ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=accent;ctx.font='bold 11px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillText(conf.muL,muX,padTop+10);

    // Resultat
    var hx=padL+(conf.kH-conf.kMin+1)*barW;
    var hp=conf.fn(conf.kH);
    ctx.fillStyle=green;ctx.font='bold 12px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText('P(X = '+conf.kH+') = '+hp.toFixed(4),cw/2,ch-16);
}

function drawNormal(){
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
    var mu=180,sig=7,xH=190;
    var xMin=mu-4*sig,xMax=mu+4*sig;
    var padL=30,padR=15,padTop=20,padBot=50;
    var plotW=cw-padL-padR;
    var plotH=ch-padTop-padBot;
    var maxPDF=norPDF(mu);

    function tx(x){return padL+(x-xMin)/(xMax-xMin)*plotW;}
    function ty(pdf){return ch-padBot-(pdf/maxPDF)*plotH*0.88;}

    // Skravert areal
    ctx.beginPath();
    ctx.moveTo(tx(xMin),ch-padBot);
    for(var x=xMin;x<=xH;x+=0.5) ctx.lineTo(tx(x),ty(norPDF(x)));
    ctx.lineTo(tx(xH),ch-padBot);
    ctx.closePath();
    ctx.fillStyle='rgba(167,139,250,0.12)';ctx.fill();

    // Hele kurven
    ctx.beginPath();
    ctx.moveTo(tx(xMin),ty(norPDF(xMin)));
    for(var x=xMin;x<=xMax;x+=0.5) ctx.lineTo(tx(x),ty(norPDF(x)));
    ctx.strokeStyle=accent;ctx.lineWidth=2;ctx.stroke();

    // Sigma-merker
    for(var s=-3;s<=3;s++){
        var sx=mu+s*sig;
        ctx.beginPath();ctx.moveTo(tx(sx),ch-padBot);ctx.lineTo(tx(sx),ch-padBot+5);
        ctx.strokeStyle=border;ctx.lineWidth=1;ctx.stroke();
        ctx.fillStyle=muted;ctx.font='9px Inter,sans-serif';
        ctx.textAlign='center';ctx.textBaseline='top';
        if(s===0) ctx.fillText('\u03BC',tx(sx),ch-padBot+7);
        else ctx.fillText((s>0?'+':'')+s+'\u03C3',tx(sx),ch-padBot+7);
    }

    // Mu-linje
    ctx.beginPath();ctx.setLineDash([4,3]);
    ctx.moveTo(tx(mu),padTop+12);ctx.lineTo(tx(mu),ch-padBot);
    ctx.strokeStyle=accent;ctx.lineWidth=1;ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle=accent;ctx.font='bold 11px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillText('\u03BC = 180',tx(mu),padTop+8);

    // X-markeringslinje
    ctx.beginPath();ctx.setLineDash([3,3]);
    ctx.moveTo(tx(xH),padTop+24);ctx.lineTo(tx(xH),ch-padBot);
    ctx.strokeStyle='#fafafa';ctx.lineWidth=1;ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#fafafa';ctx.font='bold 10px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='bottom';
    ctx.fillText('x = 190',tx(xH),padTop+22);
    ctx.fillStyle=muted;ctx.font='9px Inter,sans-serif';
    ctx.fillText('z = 1.43',tx(xH),padTop+34);

    // Areal-etikett inne i det skraverte området
    ctx.fillStyle='rgba(167,139,250,0.5)';ctx.font='bold 14px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText('92.4%',tx(mu-0.5*sig),ty(norPDF(mu))+45);

    // Resultat
    ctx.fillStyle=green;ctx.font='bold 12px Inter,sans-serif';
    ctx.textAlign='center';ctx.textBaseline='top';
    ctx.fillText('P(X \u2264 190) = 0.9236 \u2014 z = 1.43',cw/2,ch-18);
}

function rr(ctx,x,y,w,h,r){
    ctx.beginPath();
    ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);
    ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);
    ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);
    ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);
    ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
}

/* === INIT === */
renderAll();
