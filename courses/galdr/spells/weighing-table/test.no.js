(function(){
function ri(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function rc(arr){return arr[Math.floor(Math.random()*arr.length)];}
function fmt(x){var r=Math.round(x*1000)/1000;if(Math.abs(r-Math.round(r))<1e-9)return String(Math.round(r));var s=r.toFixed(3);while(s.charAt(s.length-1)==="0")s=s.substring(0,s.length-1);if(s.charAt(s.length-1)===".")s=s.substring(0,s.length-1);return s;}
function pf(id){var e=document.getElementById(id);if(!e)return NaN;return parseFloat(String(e.value).replace(",","."));}
function fb(id,c,m){var e=document.getElementById(id);if(e){e.style.color=c;e.style.fontSize=".85rem";e.style.marginTop="4px";e.innerHTML=m;}}

var GREEN="#22c55e",RED="#ef4444";
var MODE_NAME={"var":"Varians","cov":"Kovarians"};
var TS={};
var WHY={
"var":{
what:"Varians måler hvor spredt en stokastisk variabel er rundt senteret sitt. Standardavviket er bare kvadratroten av den, tilbake i de opprinnelige enhetene.",
use:"Overalt der du bryr deg om risiko eller jevnhet: eksamensresultater, avkastning på en investering, maskintoleranser, leveringstider. Gjennomsnittet alene skjuler om verdiene klumper seg tett eller svinger vilt.",
exam:"På eksamen finner du nesten alltid E[X] først, så Var[X] = Σ (x − μ)² · P(x), så σ = √Var[X]. Vis hver runde av haugen, så beholder du metodepoengene selv om siste siffer glipper.",
fun:"To personer kan tjene samme gjennomsnittsinntekt og leve helt forskjellige liv. Variansen er gapet mellom dem."
},
"cov":{
what:"Kovarians spør om to variabler beveger seg sammen. Positiv betyr at de stiger og faller som én, negativ betyr at den ene klatrer mens den andre faller, nær null betyr at de knapt merker hverandre.",
use:"Finans lener seg hardt på den: krasjer to aksjer sammen, eller demper de hverandre? Den dukker også opp i enhver simultantabell der du vil ha retningen på et forhold før du skalerer det til en korrelasjon.",
exam:"På eksamen: finn begge sentrene μ<sub>X</sub> og μ<sub>Y</sub> først, gå gjennom hver celle i simultantabellen, gang de to avstandene, vekt med simultansannsynligheten, og legg på haugen. Korrelasjonen ρ er bare dette tallet delt på de to standardavvikene. (Vi kaller den andre variabelen Y, aldri E — E er Eulers tall fra Kap 7.)",
fun:"Kovariansen gir deg retningen på dansen, ikke hvor tett den er. For tettheten strekker du deg etter korrelasjonen."
}
};

function genVar(){
var pool=[0,1,2,3,4,5,6];
var vals=[];
while(vals.length<3){var v=rc(pool);if(vals.indexOf(v)<0)vals.push(v);}
vals.sort(function(a,b){return a-b;});
var a,b,c;
do{a=ri(1,8);b=ri(1,8);c=10-a-b;}while(c<1);
var P=[a/10,b/10,c/10];
var mu=vals[0]*P[0]+vals[1]*P[1]+vals[2]*P[2];
var contribs=vals.map(function(x,i){var d=x-mu;return {x:x,p:P[i],sq:d*d,w:d*d*P[i]};});
var varX=contribs.reduce(function(s,k){return s+k.w;},0);
return {mode:"var",vals:vals,P:P,mu:mu,contribs:contribs,varX:varX,sig:Math.sqrt(varX)};
}

function genCov(){
var a,b,c,d;
do{a=ri(1,7);b=ri(1,7);c=ri(1,7);d=10-a-b-c;}while(d<1);
var p00=a/10,p01=b/10,p10=c/10,p11=d/10;
var mux=p10+p11,muy=p01+p11;
return {mode:"cov",p00:p00,p01:p01,p10:p10,p11:p11,mux:mux,muy:muy,cov:p11-mux*muy};
}

function gen(m){return m==="var"?genVar():genCov();}

function whyCard(m){
var w=WHY[m];
return '<div class="step-content" style="border-color:rgba(167,139,250,0.3)">'+
'<p style="color:var(--accent);font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:.78rem">Hvorfor denne formelen betyr noe</p>'+
'<p><strong>Hva det er.</strong> '+w.what+'</p>'+
'<p><strong>Hvor det dukker opp.</strong> '+w.use+'</p>'+
'<p><strong>På eksamen.</strong> '+w.exam+'</p>'+
'<p style="color:var(--muted);font-style:italic">'+w.fun+'</p>'+
'</div>';
}

function inputRow(id,label,fn){
return '<div style="display:flex;gap:8px;align-items:center;margin:10px 0;flex-wrap:wrap">'+
'<label style="font-size:.85rem;color:var(--text2);min-width:96px">'+label+'</label>'+
'<input id="'+id+'" type="text" inputmode="decimal" placeholder="?" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-family:inherit;font-size:.9rem;width:120px">'+
'<button onclick="'+fn+'" style="background:rgba(167,139,250,0.1);border:1px solid var(--accent);color:var(--accent);border-radius:8px;padding:8px 16px;font-family:inherit;font-size:.85rem;cursor:pointer">Sjekk</button>'+
'</div>';
}

function newBtn(){
return '<div style="margin-top:18px"><button onclick="wtNew()" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text2);border-radius:100px;padding:10px 20px;font-family:inherit;font-size:.82rem;cursor:pointer">↻ Ny test</button></div>';
}

function varProblem(d){
var t='<div class="data-card"><div class="data-title">Fordelingen til X</div><table class="data-table">'+
'<tr><th>xᵢ</th><td>'+d.vals[0]+'</td><td>'+d.vals[1]+'</td><td>'+d.vals[2]+'</td></tr>'+
'<tr><th>P(xᵢ)</th><td>'+d.P[0]+'</td><td>'+d.P[1]+'</td><td>'+d.P[2]+'</td></tr>'+
'</table></div>';
var q1='<p style="margin-top:12px"><strong>Etappe 1.</strong> Finn senteret: E[X] = μ.</p>'+
inputRow("wt-mu-in","μ =","wtCheckMu()")+'<div id="wt-mu-fb"></div>';
var q2='<div id="wt-stage2" class="hidden"><p style="margin-top:14px"><strong>Etappe 2.</strong> Nå spredningen: Var[X] = Σ (xᵢ − μ)² · P(xᵢ).</p>'+
inputRow("wt-var-in","Var[X] =","wtCheckVar()")+'<div id="wt-var-fb"></div></div>';
return t+q1+q2+'<div id="wt-work" style="margin-top:14px"></div>';
}

function covProblem(d){
var t='<div class="data-card"><div class="data-title">Simultan sannsynlighetstabell P(X, Y)</div><table class="data-table">'+
'<tr><th></th><th>X = 0</th><th>X = 1</th></tr>'+
'<tr><th>Y = 1</th><td>'+d.p01+'</td><td>'+d.p11+'</td></tr>'+
'<tr><th>Y = 0</th><td>'+d.p00+'</td><td>'+d.p10+'</td></tr>'+
'</table></div>';
var q1='<p style="margin-top:12px"><strong>Etappe 1.</strong> Finn begge sentrene. Med 0/1-variabler er μ rett og slett P(=1).</p>'+
inputRow("wt-mux-in","μ<sub>X</sub> =","wtCheckCenters()")+
inputRow("wt-muy-in","μ<sub>Y</sub> =","wtCheckCenters()")+'<div id="wt-c-fb"></div>';
var q2='<div id="wt-stage2" class="hidden"><p style="margin-top:14px"><strong>Etappe 2.</strong> Gå gjennom alle fire cellene: Cov(X,Y) = ΣΣ (x − μ<sub>X</sub>)(y − μ<sub>Y</sub>) · P(x, y).</p>'+
inputRow("wt-cov-in","Cov(X,Y) =","wtCheckCov()")+'<div id="wt-cov-fb"></div></div>';
return t+q1+q2+'<div id="wt-work" style="margin-top:14px"></div>';
}

function varWork(d){
var h='<div class="derivation"><div class="d-label">Senteret</div><div class="d-line">μ = '+d.vals[0]+'×'+d.P[0]+' + '+d.vals[1]+'×'+d.P[1]+' + '+d.vals[2]+'×'+d.P[2]+' = <strong>'+fmt(d.mu)+'</strong></div></div>';
d.contribs.forEach(function(c,i){
h+='<div class="derivation"><div class="d-label">Runde '+(i+1)+': x = '+c.x+'</div>'+
'<div class="d-line">('+c.x+' − '+fmt(d.mu)+')² = '+fmt(c.sq)+'</div>'+
'<div class="d-line">× '+c.p+' = <strong>'+fmt(c.w)+'</strong></div></div>';
});
h+='<div class="result-box"><div class="result-box-name">Resultat</div>'+
'<div class="result-box-formula">Haug av vektede kvadrater</div>'+
'<div class="result-box-value">Var[X] = '+fmt(d.varX)+'   σ = '+fmt(d.sig)+'</div></div>';
return h;
}

function covWork(d){
var cells=[["X=0, Y=0",0,0,d.p00],["X=0, Y=1",0,1,d.p01],["X=1, Y=0",1,0,d.p10],["X=1, Y=1",1,1,d.p11]];
var h='<div class="derivation"><div class="d-label">Sentrene</div>'+
'<div class="d-line">μ<sub>X</sub> = P(X=1) = '+d.p10+' + '+d.p11+' = <strong>'+fmt(d.mux)+'</strong></div>'+
'<div class="d-line">μ<sub>Y</sub> = P(Y=1) = '+d.p01+' + '+d.p11+' = <strong>'+fmt(d.muy)+'</strong></div></div>';
var pile=0;
cells.forEach(function(c){
var dx=c[1]-d.mux,dy=c[2]-d.muy,prod=dx*dy,vote=prod*c[3];pile+=vote;
h+='<div class="derivation"><div class="d-label">'+c[0]+'</div>'+
'<div class="d-line">('+c[1]+' − '+fmt(d.mux)+')('+c[2]+' − '+fmt(d.muy)+') = '+fmt(prod)+'</div>'+
'<div class="d-line">× '+c[3]+' = <strong>'+fmt(vote)+'</strong>   haug = '+fmt(pile)+'</div></div>';
});
var col=d.cov>=0?"var(--green)":"var(--red)";
var word=d.cov>=0?"Positiv — X og Y beveger seg sammen.":"Negativ — X og Y beveger seg fra hverandre.";
h+='<div class="result-box"><div class="result-box-name">Cov(X,Y)</div>'+
'<div class="result-box-value" style="color:'+col+'">Cov(X,Y) = '+fmt(d.cov)+'</div>'+
'<div class="result-box-formula" style="margin-top:8px">'+word+'</div></div>';
return h;
}

window.wtCheckMu=function(){
var d=TS[mode],v=pf("wt-mu-in");
if(isNaN(v)){fb("wt-mu-fb",RED,"Skriv inn et tall først.");return;}
if(Math.abs(v-d.mu)<0.015){fb("wt-mu-fb",GREEN,"Riktig. μ = "+fmt(d.mu)+". Mål nå spredningen.");var s=document.getElementById("wt-stage2");if(s)s.classList.remove("hidden");}
else{fb("wt-mu-fb",RED,"Ikke ennå. Regn ut Σ xᵢ · P(xᵢ) på nytt.");}
};
window.wtCheckVar=function(){
var d=TS[mode],v=pf("wt-var-in");
if(isNaN(v)){fb("wt-var-fb",RED,"Skriv inn et tall først.");return;}
if(Math.abs(v-d.varX)<0.02){fb("wt-var-fb",GREEN,"Riktig. Var[X] = "+fmt(d.varX)+", σ = "+fmt(d.sig)+".");}
else{fb("wt-var-fb",RED,"Ikke helt — sjekk hver kvadrert avstand. Gjennomgang nedenfor.");}
document.getElementById("wt-work").innerHTML=varWork(d);
};
window.wtCheckCenters=function(){
var d=TS[mode],mx=pf("wt-mux-in"),my=pf("wt-muy-in");
if(isNaN(mx)||isNaN(my)){fb("wt-c-fb",RED,"Fyll inn begge sentrene først.");return;}
if(Math.abs(mx-d.mux)<0.015&&Math.abs(my-d.muy)<0.015){fb("wt-c-fb",GREEN,"Begge riktige. μ<sub>X</sub> = "+fmt(d.mux)+", μ<sub>Y</sub> = "+fmt(d.muy)+". Nå kovariansen.");var s=document.getElementById("wt-stage2");if(s)s.classList.remove("hidden");}
else{fb("wt-c-fb",RED,"Ikke helt. μ<sub>X</sub> er summen av X=1-kolonnen, μ<sub>Y</sub> summen av Y=1-raden.");}
};
window.wtCheckCov=function(){
var d=TS[mode],v=pf("wt-cov-in");
if(isNaN(v)){fb("wt-cov-fb",RED,"Skriv inn et tall først.");return;}
if(Math.abs(v-d.cov)<0.02){fb("wt-cov-fb",GREEN,"Riktig. Cov(X,Y) = "+fmt(d.cov)+".");}
else{fb("wt-cov-fb",RED,"Ikke ennå — gå gjennom alle fire cellene. Gjennomgang nedenfor.");}
document.getElementById("wt-work").innerHTML=covWork(d);
};
window.wtNew=function(){TS[mode]=gen(mode);renderTestStep();};

function wireEnter(){
document.querySelectorAll("#step-container input").forEach(function(inp){
inp.addEventListener("keydown",function(e){if(e.key==="Enter"){var b=inp.parentNode.querySelector("button");if(b)b.click();}});
});
}

function renderTestStep(){
var m=mode;
if(!TS[m])TS[m]=gen(m);
var d=TS[m];
var el=document.getElementById("step-container");
if(!el)return;
var body=(m==="var")?varProblem(d):covProblem(d);
el.innerHTML='<div class="step-content"><h3>Test — '+MODE_NAME[m]+'</h3><p>Ferske tall hver gang. Løs den slik du ville gjort på papir, og sjekk deg selv etterpå.</p></div>'+whyCard(m)+'<div class="step-content">'+body+newBtn()+'</div>';
wireEnter();
}
window.renderTestStep=renderTestStep;

function ensureTest(){
var nav=document.getElementById("step-nav");
if(nav&&!document.getElementById("wt-test-btn")){
var btn=document.createElement("button");
btn.className="step-btn";btn.id="wt-test-btn";btn.setAttribute("data-step","5");btn.textContent="Test";
btn.addEventListener("click",function(){currentStep=5;renderStep();});
nav.appendChild(btn);
}
if(!window.__wtWrapped){
var orig=window.renderStep;
window.renderStep=function(){
if(currentStep===5){
document.querySelectorAll(".step-btn").forEach(function(b){b.classList.remove("active");});
var tb=document.getElementById("wt-test-btn");if(tb)tb.classList.add("active");
renderTestStep();
}else{orig();}
};
window.__wtWrapped=true;
}
}

if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureTest);
else ensureTest();
})();