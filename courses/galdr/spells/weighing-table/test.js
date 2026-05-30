(function(){
function ri(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
function rc(arr){return arr[Math.floor(Math.random()*arr.length)];}
function fmt(x){var r=Math.round(x*1000)/1000;if(Math.abs(r-Math.round(r))<1e-9)return String(Math.round(r));var s=r.toFixed(3);while(s.charAt(s.length-1)==="0")s=s.substring(0,s.length-1);if(s.charAt(s.length-1)===".")s=s.substring(0,s.length-1);return s;}
function pf(id){var e=document.getElementById(id);if(!e)return NaN;return parseFloat(String(e.value).replace(",","."));}
function fb(id,c,m){var e=document.getElementById(id);if(e){e.style.color=c;e.style.fontSize=".85rem";e.style.marginTop="4px";e.innerHTML=m;}}

var GREEN="#22c55e",RED="#ef4444";
var MODE_NAME={"var":"Variance","cov":"Covariance"};
var TS={};
var WHY={
"var":{
what:"Variance measures how spread out a random variable is around its center. Standard deviation is just its square root, back in the original units.",
use:"Anywhere you care about risk or consistency: exam scores, returns on an investment, machine tolerances, delivery times. The average alone hides whether the values cluster tight or swing wild.",
exam:"On the eksamen you almost always find E[X] first, then Var[X] = Σ (x − μ)² · P(x), then σ = √Var[X]. Show every round of the pile and you keep the method marks even if the last digit slips.",
fun:"Two people can earn the same average income and live completely different lives. Variance is the gap between them."
},
"cov":{
what:"Covariance asks whether two variables move together. Positive means they rise and fall as one, negative means one climbs while the other drops, near zero means they barely notice each other.",
use:"Finance leans on it hard: do two stocks crash together or cushion each other? It also appears in any joint table where you want the direction of a relationship before scaling it into a correlation.",
exam:"On the eksamen find both centers μ<sub>X</sub> and μ<sub>Y</sub> first, walk every cell of the joint table, multiply the two distances, weight by the joint probability, then pile up. Correlation ρ is just this number divided by the two standard deviations. (We call the second variable Y, never E — E is Euler’s number from Kap 7.)",
fun:"Covariance gives you the direction of the dance, not how tight. For the tightness you reach for correlation."
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
'<p style="color:var(--accent);font-weight:600;text-transform:uppercase;letter-spacing:.06em;font-size:.78rem">Why this spell matters</p>'+
'<p><strong>What it is.</strong> '+w.what+'</p>'+
'<p><strong>Where it shows up.</strong> '+w.use+'</p>'+
'<p><strong>On the eksamen.</strong> '+w.exam+'</p>'+
'<p style="color:var(--muted);font-style:italic">'+w.fun+'</p>'+
'</div>';
}

function inputRow(id,label,fn){
return '<div style="display:flex;gap:8px;align-items:center;margin:10px 0;flex-wrap:wrap">'+
'<label style="font-size:.85rem;color:var(--text2);min-width:96px">'+label+'</label>'+
'<input id="'+id+'" type="text" inputmode="decimal" placeholder="?" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-family:inherit;font-size:.9rem;width:120px">'+
'<button onclick="'+fn+'" style="background:rgba(167,139,250,0.1);border:1px solid var(--accent);color:var(--accent);border-radius:8px;padding:8px 16px;font-family:inherit;font-size:.85rem;cursor:pointer">Check</button>'+
'</div>';
}

function newBtn(){
return '<div style="margin-top:18px"><button onclick="wtNew()" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text2);border-radius:100px;padding:10px 20px;font-family:inherit;font-size:.82rem;cursor:pointer">↻ Ny test</button></div>';
}

function varProblem(d){
var t='<div class="data-card"><div class="data-title">X distribution</div><table class="data-table">'+
'<tr><th>xᵢ</th><td>'+d.vals[0]+'</td><td>'+d.vals[1]+'</td><td>'+d.vals[2]+'</td></tr>'+
'<tr><th>P(xᵢ)</th><td>'+d.P[0]+'</td><td>'+d.P[1]+'</td><td>'+d.P[2]+'</td></tr>'+
'</table></div>';
var q1='<p style="margin-top:12px"><strong>Stage 1.</strong> Find the center: E[X] = μ.</p>'+
inputRow("wt-mu-in","μ =","wtCheckMu()")+'<div id="wt-mu-fb"></div>';
var q2='<div id="wt-stage2" class="hidden"><p style="margin-top:14px"><strong>Stage 2.</strong> Now the spread: Var[X] = Σ (xᵢ − μ)² · P(xᵢ).</p>'+
inputRow("wt-var-in","Var[X] =","wtCheckVar()")+'<div id="wt-var-fb"></div></div>';
return t+q1+q2+'<div id="wt-work" style="margin-top:14px"></div>';
}

function covProblem(d){
var t='<div class="data-card"><div class="data-title">Joint probability table P(X, Y)</div><table class="data-table">'+
'<tr><th></th><th>X = 0</th><th>X = 1</th></tr>'+
'<tr><th>Y = 1</th><td>'+d.p01+'</td><td>'+d.p11+'</td></tr>'+
'<tr><th>Y = 0</th><td>'+d.p00+'</td><td>'+d.p10+'</td></tr>'+
'</table></div>';
var q1='<p style="margin-top:12px"><strong>Stage 1.</strong> Find both centers. With 0/1 variables, μ is simply P(=1).</p>'+
inputRow("wt-mux-in","μ<sub>X</sub> =","wtCheckCenters()")+
inputRow("wt-muy-in","μ<sub>Y</sub> =","wtCheckCenters()")+'<div id="wt-c-fb"></div>';
var q2='<div id="wt-stage2" class="hidden"><p style="margin-top:14px"><strong>Stage 2.</strong> Walk all four cells: Cov(X,Y) = ΣΣ (x − μ<sub>X</sub>)(y − μ<sub>Y</sub>) · P(x, y).</p>'+
inputRow("wt-cov-in","Cov(X,Y) =","wtCheckCov()")+'<div id="wt-cov-fb"></div></div>';
return t+q1+q2+'<div id="wt-work" style="margin-top:14px"></div>';
}

function varWork(d){
var h='<div class="derivation"><div class="d-label">Center</div><div class="d-line">μ = '+d.vals[0]+'×'+d.P[0]+' + '+d.vals[1]+'×'+d.P[1]+' + '+d.vals[2]+'×'+d.P[2]+' = <strong>'+fmt(d.mu)+'</strong></div></div>';
d.contribs.forEach(function(c,i){
h+='<div class="derivation"><div class="d-label">Round '+(i+1)+': x = '+c.x+'</div>'+
'<div class="d-line">('+c.x+' − '+fmt(d.mu)+')² = '+fmt(c.sq)+'</div>'+
'<div class="d-line">× '+c.p+' = <strong>'+fmt(c.w)+'</strong></div></div>';
});
h+='<div class="result-box"><div class="result-box-name">Result</div>'+
'<div class="result-box-formula">Pile of weighted squares</div>'+
'<div class="result-box-value">Var[X] = '+fmt(d.varX)+'   σ = '+fmt(d.sig)+'</div></div>';
return h;
}

function covWork(d){
var cells=[["X=0, Y=0",0,0,d.p00],["X=0, Y=1",0,1,d.p01],["X=1, Y=0",1,0,d.p10],["X=1, Y=1",1,1,d.p11]];
var h='<div class="derivation"><div class="d-label">Centers</div>'+
'<div class="d-line">μ<sub>X</sub> = P(X=1) = '+d.p10+' + '+d.p11+' = <strong>'+fmt(d.mux)+'</strong></div>'+
'<div class="d-line">μ<sub>Y</sub> = P(Y=1) = '+d.p01+' + '+d.p11+' = <strong>'+fmt(d.muy)+'</strong></div></div>';
var pile=0;
cells.forEach(function(c){
var dx=c[1]-d.mux,dy=c[2]-d.muy,prod=dx*dy,vote=prod*c[3];pile+=vote;
h+='<div class="derivation"><div class="d-label">'+c[0]+'</div>'+
'<div class="d-line">('+c[1]+' − '+fmt(d.mux)+')('+c[2]+' − '+fmt(d.muy)+') = '+fmt(prod)+'</div>'+
'<div class="d-line">× '+c[3]+' = <strong>'+fmt(vote)+'</strong>   pile = '+fmt(pile)+'</div></div>';
});
var col=d.cov>=0?"var(--green)":"var(--red)";
var word=d.cov>=0?"Positive — X and Y move together.":"Negative — X and Y move apart.";
h+='<div class="result-box"><div class="result-box-name">Cov(X,Y)</div>'+
'<div class="result-box-value" style="color:'+col+'">Cov(X,Y) = '+fmt(d.cov)+'</div>'+
'<div class="result-box-formula" style="margin-top:8px">'+word+'</div></div>';
return h;
}

window.wtCheckMu=function(){
var d=TS[mode],v=pf("wt-mu-in");
if(isNaN(v)){fb("wt-mu-fb",RED,"Type a number first.");return;}
if(Math.abs(v-d.mu)<0.015){fb("wt-mu-fb",GREEN,"Correct. μ = "+fmt(d.mu)+". Now measure the spread.");var s=document.getElementById("wt-stage2");if(s)s.classList.remove("hidden");}
else{fb("wt-mu-fb",RED,"Not yet. Recompute Σ xᵢ · P(xᵢ).");}
};
window.wtCheckVar=function(){
var d=TS[mode],v=pf("wt-var-in");
if(isNaN(v)){fb("wt-var-fb",RED,"Type a number first.");return;}
if(Math.abs(v-d.varX)<0.02){fb("wt-var-fb",GREEN,"Correct. Var[X] = "+fmt(d.varX)+", σ = "+fmt(d.sig)+".");}
else{fb("wt-var-fb",RED,"Not quite — check each squared distance. Walkthrough below.");}
document.getElementById("wt-work").innerHTML=varWork(d);
};
window.wtCheckCenters=function(){
var d=TS[mode],mx=pf("wt-mux-in"),my=pf("wt-muy-in");
if(isNaN(mx)||isNaN(my)){fb("wt-c-fb",RED,"Fill in both centers first.");return;}
if(Math.abs(mx-d.mux)<0.015&&Math.abs(my-d.muy)<0.015){fb("wt-c-fb",GREEN,"Both right. μ<sub>X</sub> = "+fmt(d.mux)+", μ<sub>Y</sub> = "+fmt(d.muy)+". Now the covariance.");var s=document.getElementById("wt-stage2");if(s)s.classList.remove("hidden");}
else{fb("wt-c-fb",RED,"Not quite. μ<sub>X</sub> is the sum of the X=1 column, μ<sub>Y</sub> the sum of the Y=1 row.");}
};
window.wtCheckCov=function(){
var d=TS[mode],v=pf("wt-cov-in");
if(isNaN(v)){fb("wt-cov-fb",RED,"Type a number first.");return;}
if(Math.abs(v-d.cov)<0.02){fb("wt-cov-fb",GREEN,"Correct. Cov(X,Y) = "+fmt(d.cov)+".");}
else{fb("wt-cov-fb",RED,"Not yet — walk all four cells. Walkthrough below.");}
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
el.innerHTML='<div class="step-content"><h3>Test — '+MODE_NAME[m]+'</h3><p>Fresh numbers every time. Work it the way you would on paper, then check yourself.</p></div>'+whyCard(m)+'<div class="step-content">'+body+newBtn()+'</div>';
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