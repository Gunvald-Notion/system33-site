/* === WOBBLE-FRAME TEST — NORSK === */
(function(){

/* === GENERATORS === */
function genZ(){
    var n=[16,25,36,49,64,100][Math.floor(Math.random()*6)];
    var mu=Math.round(40+Math.random()*60);
    var sigma=Math.round(5+Math.random()*15);
    var conf=[90,95,99][Math.floor(Math.random()*3)];
    var zVal={90:1.645,95:1.960,99:2.576}[conf];
    var se=sigma/Math.sqrt(n);
    var margin=zVal*se;
    var xbar=Math.round((mu-5+Math.random()*10)*10)/10;
    return{type:'z',n:n,mu:mu,sigma:sigma,conf:conf,zVal:zVal,se:se,margin:margin,xbar:xbar,
        left:Math.round((xbar-margin)*1000)/1000,right:Math.round((xbar+margin)*1000)/1000};
}
function genT(){
    var n=[10,15,20,25,30][Math.floor(Math.random()*5)];
    var df=n-1;
    var mu=Math.round(40+Math.random()*60);
    var s=Math.round(5+Math.random()*15);
    var conf=[90,95,99][Math.floor(Math.random()*3)];
    var tTbl={9:{90:1.833,95:2.262,99:3.250},14:{90:1.761,95:2.145,99:2.977},
              19:{90:1.729,95:2.093,99:2.861},24:{90:1.711,95:2.064,99:2.797},
              29:{90:1.699,95:2.045,99:2.756}};
    var tVal=tTbl[df][conf];
    var se=s/Math.sqrt(n);
    var margin=tVal*se;
    var xbar=Math.round((mu-5+Math.random()*10)*10)/10;
    return{type:'t',n:n,df:df,s:s,conf:conf,tVal:tVal,se:se,margin:margin,xbar:xbar,
        left:Math.round((xbar-margin)*1000)/1000,right:Math.round((xbar+margin)*1000)/1000};
}
function genP(){
    var n=[100,150,200,250,300][Math.floor(Math.random()*5)];
    var pTrue=Math.round((0.2+Math.random()*0.6)*100)/100;
    var conf=[90,95,99][Math.floor(Math.random()*3)];
    var zVal={90:1.645,95:1.960,99:2.576}[conf];
    var phat=Math.round((pTrue-0.03+Math.random()*0.06)*100)/100;
    var se=Math.sqrt(phat*(1-phat)/n);
    var margin=zVal*se;
    return{type:'p',n:n,phat:phat,conf:conf,zVal:zVal,se:Math.round(se*10000)/10000,
        margin:Math.round(margin*10000)/10000,
        left:Math.round((phat-margin)*10000)/10000,
        right:Math.round((phat+margin)*10000)/10000};
}

/* === STATE === */
var current=null,testStep=0;

/* === BUILD UI === */
var style=document.createElement('style');
style.textContent=[
    '.test-section{background:var(--bg-card);border:1px solid var(--border);border-left:3px solid var(--green);border-radius:0 12px 12px 0;padding:24px;margin-top:24px}',
    '.test-title{font-size:.75rem;color:var(--muted);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px}',
    '.test-mode-nav{display:flex;gap:8px;margin-bottom:20px;flex-wrap:wrap}',
    '.test-mode-btn{background:var(--bg);border:1px solid var(--border);border-radius:100px;padding:8px 16px;font-family:inherit;font-size:.78rem;color:var(--text2);cursor:pointer;transition:all .2s}',
    '.test-mode-btn:hover{border-color:#3f3f46}',
    '.test-mode-btn.active{border-color:var(--green);color:var(--green);background:rgba(34,197,94,.06)}',
    '.test-problem{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:16px 20px;margin-bottom:16px;font-size:.88rem;color:var(--text2);line-height:1.7}',
    '.test-problem strong{color:var(--text)}',
    '.test-input-row{display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap}',
    '.test-input{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font-family:inherit;font-size:.88rem;color:var(--text);width:160px;outline:none;transition:border-color .2s}',
    '.test-input:focus{border-color:var(--accent)}',
    '.test-btn{background:transparent;border:1px solid var(--green);border-radius:100px;padding:9px 20px;font-family:inherit;font-size:.82rem;color:var(--green);cursor:pointer;transition:all .2s}',
    '.test-btn:hover{background:rgba(34,197,94,.08)}',
    '.test-feedback{font-size:.85rem;margin-top:10px;line-height:1.6;padding:12px 16px;border-radius:8px;display:none}',
    '.test-feedback.ok{background:rgba(34,197,94,.08);border:1px solid rgba(34,197,94,.2);color:var(--green)}',
    '.test-feedback.err{background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);color:#f87171}',
    '.new-test-btn{background:transparent;border:1px solid var(--border);border-radius:100px;padding:8px 18px;font-family:inherit;font-size:.78rem;color:var(--text2);cursor:pointer;margin-top:14px;transition:all .2s}',
    '.new-test-btn:hover{border-color:var(--accent);color:var(--accent)}'
].join('');
document.head.appendChild(style);

var section=document.createElement('section');
section.className='section';
section.style.cssText='border-top:1px solid var(--border);padding-top:40px';
var cont=document.createElement('div');
cont.className='container';
section.appendChild(cont);

var label=document.createElement('div');
label.className='section-label';
label.textContent='Test deg selv';
cont.appendChild(label);

var box=document.createElement('div');
box.className='test-section';
cont.appendChild(box);

var title=document.createElement('div');
title.className='test-title';
title.textContent='Ny tilfeldig oppgave hvert fors\u00F8k. Bygg konfidensintervallet i to trekk.';
box.appendChild(title);

var modeNav=document.createElement('div');
modeNav.className='test-mode-nav';
['z-KI (σ kjent)','t-KI (σ ukjent)','Andel (p̂)'].forEach(function(lbl,i){
    var b=document.createElement('button');
    b.className='test-mode-btn'+(i===0?' active':'');
    b.textContent=lbl;
    b.addEventListener('click',function(){
        modeNav.querySelectorAll('.test-mode-btn').forEach(function(x){x.classList.remove('active');});
        b.classList.add('active');
        startTest(['z','t','p'][i]);
    });
    modeNav.appendChild(b);
});
box.appendChild(modeNav);

var problemEl=document.createElement('div');
problemEl.className='test-problem';
box.appendChild(problemEl);

var inputArea=document.createElement('div');
box.appendChild(inputArea);

var feedbackEl=document.createElement('div');
feedbackEl.className='test-feedback';
box.appendChild(feedbackEl);

var newBtn=document.createElement('button');
newBtn.className='new-test-btn';
newBtn.textContent='Ny test';
newBtn.addEventListener('click',function(){startTest(current.type);});
box.appendChild(newBtn);

document.querySelector('footer').before(section);

/* === LOGIC === */
function fmt(v){return Math.round(v*10000)/10000;}
function tol(v){return Math.abs(v)*0.005+0.005;}

function startTest(type){
    if(type==='z')current=genZ();
    else if(type==='t')current=genT();
    else current=genP();
    testStep=1;
    feedbackEl.style.display='none';
    feedbackEl.className='test-feedback';
    renderProblem();
    renderStep1();
}

function renderProblem(){
    var c=current;
    if(c.type==='z'){
        problemEl.innerHTML='<strong>z-KI (σ kjent).</strong> n = '+c.n+', x̄ = '+c.xbar+', σ = '+c.sigma+', '+c.conf+'% konfidens.';
    } else if(c.type==='t'){
        problemEl.innerHTML='<strong>t-KI (σ ukjent).</strong> n = '+c.n+', x̄ = '+c.xbar+', s = '+c.s+', '+c.conf+'% konfidens, df = '+c.df+'.';
    } else {
        problemEl.innerHTML='<strong>Andel-KI.</strong> n = '+c.n+', p̂ = '+c.phat+', '+c.conf+'% konfidens.';
    }
}

function renderStep1(){
    inputArea.innerHTML='';
    var row=document.createElement('div');
    row.className='test-input-row';
    var label=document.createElement('span');
    label.style.cssText='font-size:.85rem;color:var(--text2)';
    label.textContent='Steg 1 — feilmarginen (E = strekk × risting):';
    var inp=document.createElement('input');
    inp.className='test-input';
    inp.type='number';
    inp.step='0.0001';
    inp.placeholder='Skriv inn E';
    var btn=document.createElement('button');
    btn.className='test-btn';
    btn.textContent='Sjekk';
    row.appendChild(label);
    row.appendChild(inp);
    row.appendChild(btn);
    inputArea.appendChild(row);
    btn.addEventListener('click',function(){checkStep1(parseFloat(inp.value));});
    inp.addEventListener('keydown',function(e){if(e.key==='Enter')checkStep1(parseFloat(inp.value));});
}

function checkStep1(val){
    if(isNaN(val)){showFeedback('Skriv inn et tall først.','err');return;}
    var expected=fmt(current.margin);
    var ok=Math.abs(val-expected)<=tol(expected);
    if(ok){
        showFeedback('Riktig. E = '+expected+'. Gå til steg 2.','ok');
        testStep=2;
        setTimeout(function(){
            feedbackEl.style.display='none';
            renderStep2();
        },900);
    } else {
        var walk=buildWalk1();
        showFeedback('Ikke helt — godkjent område er '+fmt(expected-tol(expected))+' til '+fmt(expected+tol(expected))+'. Her er gjennomgangen:<br><br>'+walk,'err');
    }
}

function buildWalk1(){
    var c=current;
    if(c.type==='z'){
        return 'Risting: σ/√n = '+c.sigma+'/√'+c.n+' = '+fmt(c.se)+'<br>'+
               'E = z × risting = '+c.zVal+' × '+fmt(c.se)+' = '+fmt(c.margin)+'<br>'+
               '(Behold 4 desimaler i ristingen.)';
    } else if(c.type==='t'){
        return 'Risting: s/√n = '+c.s+'/√'+c.n+' = '+fmt(c.se)+'<br>'+
               'E = t × risting = '+c.tVal+' × '+fmt(c.se)+' = '+fmt(c.margin)+'<br>'+
               '(df = '+c.df+', t = '+c.tVal+'. Behold 4 desimaler i ristingen.)';
    } else {
        return 'Risting: √(p̂(1−p̂)/n) = √('+c.phat+'×'+(Math.round((1-c.phat)*100)/100)+'/'+c.n+') = '+fmt(c.se)+'<br>'+
               'E = z × risting = '+c.zVal+' × '+fmt(c.se)+' = '+fmt(c.margin)+'<br>'+
               '(Behold 4 desimaler i ristingen.)';
    }
}

function renderStep2(){
    inputArea.innerHTML='';
    var hint=document.createElement('div');
    hint.style.cssText='font-size:.82rem;color:var(--muted);margin-bottom:12px';
    hint.textContent='Steg 2 — plasser veggene. Sentrum: '+(current.type==='p'?current.phat:current.xbar)+'.';
    inputArea.appendChild(hint);
    var row=document.createElement('div');
    row.className='test-input-row';
    var lInp=document.createElement('input');
    lInp.className='test-input';
    lInp.type='number';
    lInp.step='0.0001';
    lInp.placeholder='Venstre vegg';
    var rInp=document.createElement('input');
    rInp.className='test-input';
    rInp.type='number';
    rInp.step='0.0001';
    rInp.placeholder='Høyre vegg';
    var btn=document.createElement('button');
    btn.className='test-btn';
    btn.textContent='Sjekk';
    row.appendChild(lInp);
    row.appendChild(rInp);
    row.appendChild(btn);
    inputArea.appendChild(row);
    btn.addEventListener('click',function(){checkStep2(parseFloat(lInp.value),parseFloat(rInp.value));});
}

function checkStep2(lv,rv){
    if(isNaN(lv)||isNaN(rv)){showFeedback('Skriv inn begge veggene først.','err');return;}
    var el=fmt(current.left),er=fmt(current.right);
    var lok=Math.abs(lv-el)<=tol(el),rok=Math.abs(rv-er)<=tol(er);
    if(lok&&rok){
        showFeedback('Riktig. KI = ['+el+' , '+er+']','ok');
    } else if(!lok&&rok){
        showFeedback('Se igjen — godkjent venstre: '+fmt(el-tol(el))+' til '+fmt(el+tol(el)),'err');
    } else if(lok&&!rok){
        showFeedback('Se igjen — godkjent høyre: '+fmt(er-tol(er))+' til '+fmt(er+tol(er)),'err');
    } else {
        showFeedback('Se igjen — godkjent venstre: '+fmt(el-tol(el))+' til '+fmt(el+tol(el))+' / godkjent høyre: '+fmt(er-tol(er))+' til '+fmt(er+tol(er)),'err');
    }
}

function showFeedback(msg,type){
    feedbackEl.innerHTML=msg;
    feedbackEl.className='test-feedback '+type;
    feedbackEl.style.display='block';
}

/* === START === */
startTest('z');

})();
