/* === SEM FORMATION (Kap 16) ===
   Three forms: factor loadings, mediation, fit indices.
   Blueprint -> Process -> Data -> Formula -> Test (Test lives in test.js). */
(function(){
  'use strict';
  var step = 1, form = 1, dropped = false, result = null;

  function el(id){ return document.getElementById(id); }
  function f(n){
    if(n===null||n===undefined||isNaN(n)) return '&mdash;';
    var r = Math.round(n*10000)/10000;
    if(r===Math.floor(r)) return r.toFixed(0);
    var s = r.toFixed(4);
    while(s.charAt(s.length-1)==='0') s = s.slice(0,-1);
    if(s.charAt(s.length-1)==='.') s = s.slice(0,-1);
    return s;
  }
  function pct(n){ return (Math.round(n*1000)/10) + '%'; }

  /* ---------- SVG path-diagram helpers ---------- */
  function svg(inner,h){ h=h||210; return '<svg viewBox="0 0 360 '+h+'" width="100%" style="max-width:440px;display:block;margin:0 auto"><defs><marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#a1a1aa"/></marker><marker id="ahp" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#a78bfa"/></marker></defs>'+inner+'</svg>'; }
  function ell(cx,cy,rx,ry,label){ return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="rgba(96,165,250,.08)" stroke="#60a5fa" stroke-width="1.5"/><text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" fill="#fafafa" font-size="13">'+label+'</text>'; }
  function rct(x,y,w,h,label){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="rgba(251,146,60,.10)" stroke="#fb923c" stroke-width="1.5"/><text x="'+(x+w/2)+'" y="'+(y+h/2+4)+'" text-anchor="middle" fill="#fafafa" font-size="12">'+label+'</text>'; }
  function ln(x1,y1,x2,y2,label,o){ o=o||{}; var col=o.accent?'#a78bfa':'#a1a1aa'; var mk=o.accent?'url(#ahp)':'url(#ah)'; var dash=o.dash?' stroke-dasharray="5,4"':''; var s='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col+'" stroke-width="1.5" marker-end="'+mk+'"'+dash+'/>'; if(label){ var mx=(x1+x2)/2,my=(y1+y2)/2; s+='<text x="'+(mx+(o.lx||6))+'" y="'+(my+(o.ly||-4))+'" fill="'+col+'" font-size="12" font-style="italic">'+label+'</text>'; } return s; }
  function crc(cx,cy,r,label){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#52525b" stroke-width="1.3"/><text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" fill="#a1a1aa" font-size="11">'+label+'</text>'; }

  function vizLambda(d,res){
    var inner='';
    inner+=ell(180,38,74,26,'&eta;  (latent)');
    inner+=rct(120,150,120,42,'X  (indicator)');
    inner+=ln(180,64,180,150,'&lambda;',{accent:true,lx:10,ly:0});
    inner+=crc(308,171,12,'&delta;');
    inner+=ln(308,159,242,165,'',{});
    if(d&&res){ var ex=Math.max(0,Math.min(1,res.lam2)); var bx=70,bw=220,by=212; inner+='<text x="'+bx+'" y="'+(by-4)+'" fill="#a1a1aa" font-size="10">explained &lambda;&sup2; = '+Math.round(ex*100)+'%</text>'; inner+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="14" rx="3" fill="#27272a"/>'; inner+='<rect x="'+bx+'" y="'+by+'" width="'+(bw*ex)+'" height="14" rx="3" fill="#a78bfa"/>'; }
    return svg(inner,236);
  }
  function vizMed(){
    var inner='';
    inner+=ell(58,66,44,23,'&eta;&#8321;');
    inner+=ell(180,66,44,23,'&eta;&#8322;');
    inner+=ell(302,66,44,23,'&eta;&#8323;');
    inner+=ln(102,66,136,66,'&beta;&#8321;',{accent:true,ly:-10,lx:-4});
    inner+=ln(224,66,258,66,'&beta;&#8322;',{accent:true,ly:-10,lx:-4});
    inner+='<path d="M60,89 Q180,158 300,89" fill="none" stroke="#a1a1aa" stroke-width="1.4" stroke-dasharray="5,4" marker-end="url(#ah)"/>';
    inner+='<text x="180" y="150" text-anchor="middle" fill="#a1a1aa" font-size="12" font-style="italic">&beta;&#8323; (direct)</text>';
    return svg(inner,170);
  }
  function gauge(y,label,type,thr,smax,val){
    var x=120,w=200,s='';
    s+='<text x="'+(x-10)+'" y="'+(y+4)+'" text-anchor="end" fill="#a1a1aa" font-size="11">'+label+'</text>';
    s+='<rect x="'+x+'" y="'+(y-5)+'" width="'+w+'" height="10" rx="5" fill="#27272a"/>';
    if(type==='good'){ var gx=x+w*thr; s+='<rect x="'+gx+'" y="'+(y-5)+'" width="'+(x+w-gx)+'" height="10" rx="5" fill="rgba(34,197,94,.25)"/>'; }
    else { s+='<rect x="'+x+'" y="'+(y-5)+'" width="'+(w*(thr/smax))+'" height="10" rx="5" fill="rgba(34,197,94,.25)"/>'; }
    var tx=(type==='good')?(x+w*thr):(x+w*(thr/smax));
    s+='<line x1="'+tx+'" y1="'+(y-9)+'" x2="'+tx+'" y2="'+(y+9)+'" stroke="#71717a" stroke-width="1"/>';
    if(val!==null&&val!==undefined&&!isNaN(val)){ var vf=(type==='good')?val:(val/smax); vf=Math.max(0,Math.min(1,vf)); var vx=x+w*vf; var pass=(type==='good')?(val>=thr):(val<=thr); var col=pass?'#4ade80':'#f87171'; s+='<circle cx="'+vx+'" cy="'+y+'" r="5" fill="'+col+'"/>'; s+='<text x="'+vx+'" y="'+(y-9)+'" text-anchor="middle" fill="'+col+'" font-size="10">'+f(val)+'</text>'; }
    return s;
  }
  function vizFit(d,res){
    var inner='';
    inner+=gauge(34,'CFI','good',0.95,1,d?res.cfi:null);
    inner+=gauge(74,'TLI','good',0.95,1,d?res.tli:null);
    inner+=gauge(118,'RMSEA','bad',0.06,0.15,d?res.rmsea:null);
    inner+=gauge(158,'SRMR','bad',0.08,0.15,d?res.srmr:null);
    return svg(inner,196);
  }

  /* ---------- Forms ---------- */
  var FORMS = {
    1: {
      name:'Factor Loadings',
      viz:vizLambda,
      caption:'A latent construct &eta; is measured by indicator X through the loading &lambda;. Whatever &lambda; can&rsquo;t explain leaks into the error &delta;.',
      eq:'X = &lambda;&middot;&eta; + &delta;',
      blueprint:'You can&rsquo;t put a ruler to a construct, so you measure indicators and ask how tightly each one tracks it. The standardized loading <strong>&lambda;</strong> is that grip. Its square <strong>&lambda;&sup2;</strong> is the share of the indicator&rsquo;s variance the construct explains; the remainder is measurement error &delta;.',
      process:[
        {t:'Read the loading', b:'Take the standardized &lambda; for the indicator (between &minus;1 and 1).'},
        {t:'Square it', b:'&lambda;&sup2; is the share of that indicator&rsquo;s variance explained by the construct.'},
        {t:'Find the leak', b:'1 &minus; &lambda;&sup2; is the measurement error &mdash; variance the construct does not account for.'},
        {t:'Judge the grip', b:'Strong &gt; 0.70 &middot; moderate 0.40&ndash;0.70 &middot; weak &lt; 0.40.'}
      ],
      inputs:[{id:'lam', label:'Standardized loading &lambda;', ex:0.82}],
      solve:function(v){
        var lam=v.lam, lam2=lam*lam, err=1-lam2, a=Math.abs(lam);
        var vc = a>0.70?['strongv','Strong indicator']:(a>=0.40?['modv','Moderate indicator']:['weakv','Weak indicator']);
        var s='';
        s+='<div class="rrow">&lambda; = <strong>'+f(lam)+'</strong></div>';
        s+='<div class="rrow">Explained: &lambda;&sup2; = '+f(lam)+'&sup2; = <strong>'+f(lam2)+'</strong> &nbsp;('+pct(lam2)+')</div>';
        s+='<div class="rrow">Error: 1 &minus; &lambda;&sup2; = <strong>'+f(err)+'</strong> &nbsp;('+pct(err)+')</div>';
        s+='<span class="verdict '+vc[0]+'">'+vc[1]+'</span>';
        return {summary:s, lam2:lam2};
      }
    },
    2: {
      name:'Mediation',
      viz:vizMed,
      caption:'&eta;&#8321; reaches &eta;&#8323; two ways: straight across (direct &beta;&#8323;) and through the mediator &eta;&#8322; (indirect &beta;&#8321;&middot;&beta;&#8322;).',
      eq:'total = &beta;&#8323; + &beta;&#8321;&middot;&beta;&#8322;',
      blueprint:'A construct can act on another directly, or through a construct in the middle. The <strong>indirect</strong> effect multiplies the two legs of the detour; the <strong>total</strong> effect adds the direct path to it.',
      process:[
        {t:'Direct effect', b:'&beta;&#8323; is the straight path &eta;&#8321; &rarr; &eta;&#8323;.'},
        {t:'Indirect effect', b:'Multiply the two legs of the detour: &beta;&#8321;&middot;&beta;&#8322;.'},
        {t:'Total effect', b:'Add them: total = direct + indirect.'},
        {t:'Share mediated', b:'indirect / total &mdash; how much of the whole runs through the mediator.'}
      ],
      inputs:[
        {id:'b1', label:'&beta;&#8321; (&eta;&#8321;&rarr;&eta;&#8322;)', ex:0.55},
        {id:'b2', label:'&beta;&#8322; (&eta;&#8322;&rarr;&eta;&#8323;)', ex:0.40},
        {id:'b3', label:'&beta;&#8323; (direct &eta;&#8321;&rarr;&eta;&#8323;)', ex:0.15}
      ],
      solve:function(v){
        var ind=v.b1*v.b2, tot=v.b3+ind, share=tot!==0?ind/tot:0;
        var s='';
        s+='<div class="rrow">Indirect: &beta;&#8321;&middot;&beta;&#8322; = '+f(v.b1)+' &middot; '+f(v.b2)+' = <strong>'+f(ind)+'</strong></div>';
        s+='<div class="rrow">Total: '+f(v.b3)+' + '+f(ind)+' = <strong>'+f(tot)+'</strong></div>';
        s+='<div class="rrow">Share mediated: '+f(ind)+' / '+f(tot)+' = <strong>'+pct(share)+'</strong></div>';
        return {summary:s};
      }
    },
    3: {
      name:'Fit Indices',
      viz:vizFit,
      caption:'Two indices reward fit (CFI, TLI &mdash; higher is better) and two punish misfit (RMSEA, SRMR &mdash; lower is better). The green zone is passing.',
      eq:'CFI &ge; 0.95 &middot; TLI &ge; 0.95 &middot; RMSEA &le; 0.06 &middot; SRMR &le; 0.08',
      blueprint:'No single number decides whether a model holds &mdash; you read several together. <strong>CFI</strong> and <strong>TLI</strong> climb toward 1 as fit improves; <strong>RMSEA</strong> and <strong>SRMR</strong> shrink toward 0. &chi;&sup2; over-rejects with large samples, so it is never read alone.',
      process:[
        {t:'CFI &ge; 0.95?', b:'Comparative fit index &mdash; higher is better.'},
        {t:'TLI &ge; 0.95?', b:'Tucker&ndash;Lewis index &mdash; higher is better.'},
        {t:'RMSEA &le; 0.06?', b:'Root mean square error of approximation &mdash; lower is better.'},
        {t:'SRMR &le; 0.08?', b:'Standardized root mean square residual &mdash; lower is better.'}
      ],
      inputs:[
        {id:'cfi', label:'CFI', ex:0.97},
        {id:'tli', label:'TLI', ex:0.96},
        {id:'rmsea', label:'RMSEA', ex:0.045},
        {id:'srmr', label:'SRMR', ex:0.041}
      ],
      solve:function(v){
        var c1=v.cfi>=0.95, c2=v.tli>=0.95, c3=v.rmsea<=0.06, c4=v.srmr<=0.08;
        var pass=(c1?1:0)+(c2?1:0)+(c3?1:0)+(c4?1:0);
        function mark(ok){ return ok?'<span class="ok">&#10003; pass</span>':'<span class="no">&#10007; fail</span>'; }
        var s='';
        s+='<table class="idx"><tr><th>Index</th><th>Value</th><th>Threshold</th><th></th></tr>';
        s+='<tr><td>CFI</td><td>'+f(v.cfi)+'</td><td>&ge; 0.95</td><td>'+mark(c1)+'</td></tr>';
        s+='<tr><td>TLI</td><td>'+f(v.tli)+'</td><td>&ge; 0.95</td><td>'+mark(c2)+'</td></tr>';
        s+='<tr><td>RMSEA</td><td>'+f(v.rmsea)+'</td><td>&le; 0.06</td><td>'+mark(c3)+'</td></tr>';
        s+='<tr><td>SRMR</td><td>'+f(v.srmr)+'</td><td>&le; 0.08</td><td>'+mark(c4)+'</td></tr>';
        s+='</table>';
        var vc = pass===4?['strongv','All four pass &mdash; good fit']:(pass>=2?['modv',pass+' of 4 pass &mdash; mixed']:['weakv',pass+' of 4 pass &mdash; poor fit']);
        s+='<span class="verdict '+vc[0]+'">'+vc[1]+'</span>';
        return {summary:s, cfi:v.cfi, tli:v.tli, rmsea:v.rmsea, srmr:v.srmr};
      }
    }
  };

  /* ---------- Engine ---------- */
  var STEPS=['Blueprint','Process','Data','Formula','Test'];

  function renderModes(){
    var nav=el('mode-nav'), html='';
    for(var i=1;i<=3;i++){ html+='<button class="mode-btn'+(i===form?' active':'')+'" data-form="'+i+'">'+FORMS[i].name+'</button>'; }
    nav.innerHTML=html;
    var btns=nav.querySelectorAll('.mode-btn');
    for(var j=0;j<btns.length;j++){ btns[j].addEventListener('click', function(){ switchForm(parseInt(this.getAttribute('data-form'),10)); }); }
  }
  function renderViz(){
    var fm=FORMS[form];
    el('viz-stage').innerHTML = fm.viz(dropped, result);
    el('viz-caption').innerHTML = fm.caption;
  }
  function renderStepNav(){
    var nav=el('step-nav'), html='';
    for(var i=1;i<=5;i++){ html+='<button class="step-btn'+(i===step?' active':'')+'" data-step="'+i+'">'+i+'. '+STEPS[i-1]+'</button>'; }
    nav.innerHTML=html;
    var btns=nav.querySelectorAll('.step-btn');
    for(var j=0;j<btns.length;j++){ btns[j].addEventListener('click', function(){ setStep(parseInt(this.getAttribute('data-step'),10)); }); }
  }
  function renderStep(){
    var fm=FORMS[form], c=el('step-container'), h='';
    if(step===1){
      h+='<div class="panel"><div class="step-h">Step 1 &middot; Blueprint</div>';
      h+='<p>'+fm.blueprint+'</p>';
      if(fm.eq) h+='<div class="eq">'+fm.eq+'</div>';
      h+='</div>';
    } else if(step===2){
      h+='<div class="panel"><div class="step-h">Step 2 &middot; Process</div>';
      for(var i=0;i<fm.process.length;i++){ h+='<div class="move"><div class="mt">'+(i+1)+'. '+fm.process[i].t+'</div><div class="mb">'+fm.process[i].b+'</div></div>'; }
      h+='</div>';
    } else if(step===3){
      h+='<div class="panel"><div class="step-h">Step 3 &middot; Data</div>';
      h+='<p class="sub">Enter the numbers, then drop them into the model.</p>';
      h+='<div class="input-row">';
      for(var k=0;k<fm.inputs.length;k++){ var inp=fm.inputs[k]; h+='<div class="input-group"><label>'+inp.label+'</label><input type="number" step="any" id="in-'+inp.id+'"></div>'; }
      h+='</div>';
      h+='<div class="btn-row"><button class="action-btn" id="btn-drop">Drop into model</button><button class="action-btn secondary" id="btn-ex">Use example</button></div>';
      if(dropped&&result){ h+='<div class="hint">Dropped. Step 4 holds the result.</div>'; }
      h+='</div>';
    } else if(step===4){
      h+='<div class="panel"><div class="step-h">Step 4 &middot; Formula</div>';
      if(dropped&&result){ h+='<div class="result">'+result.summary+'</div>'; }
      else { h+='<p class="sub">Nothing dropped yet. Go to Step 3, enter values, and drop them in.</p>'; }
      h+='</div>';
    } else {
      h+='<div class="panel"><div class="step-h">Step 5 &middot; Test yourself</div><div id="test-host"></div></div>';
    }
    c.innerHTML=h;
    if(step===3){ el('btn-drop').addEventListener('click', doDrop); el('btn-ex').addEventListener('click', useEx); }
    if(step===5 && window.renderTest){ window.renderTest(form); }
  }
  function readInputs(){
    var fm=FORMS[form], vals={};
    for(var i=0;i<fm.inputs.length;i++){ var id=fm.inputs[i].id; var v=parseFloat(el('in-'+id).value); vals[id]=isNaN(v)?null:v; }
    return vals;
  }
  function doDrop(){
    var vals=readInputs(), fm=FORMS[form];
    for(var i=0;i<fm.inputs.length;i++){ if(vals[fm.inputs[i].id]===null){ alert('Fill in every field first.'); return; } }
    result=fm.solve(vals); dropped=true;
    renderViz(); setStep(4);
  }
  function useEx(){
    var fm=FORMS[form];
    for(var i=0;i<fm.inputs.length;i++){ el('in-'+fm.inputs[i].id).value = fm.inputs[i].ex; }
    doDrop();
  }
  function setStep(n){ step=n; renderStepNav(); renderStep(); }
  function switchForm(n){ form=n; step=1; dropped=false; result=null; renderModes(); renderViz(); renderStepNav(); renderStep(); }
  function init(){ renderModes(); renderViz(); renderStepNav(); renderStep(); }
  init();
})();
