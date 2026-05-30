/* === PROBABILITY HOUSE (Kap 2 + 4) — staged engine ===
   One fixed exam-style scenario fills the house once; each path reads its
   own formula off the same cells, walked one ordered stage at a time. */
(function(){
  'use strict';

  /* --- Fixed scenario: a prior + two conditionals (the exam's Bayes shape) --- */
  var PA = 0.20, PNA = 0.80, PBgA = 0.90, PBgNA = 0.10;
  var PAB = 0.18, PANB = 0.02, PNAB = 0.08, PNANB = 0.72, PB = 0.26, PNB = 0.74;
  var UNION = 0.28, PAgB = 0.6923;

  function f(n){
    if(n===null||n===undefined||isNaN(n)) return '&mdash;';
    var r = Math.round(n*10000)/10000;
    if(r===Math.floor(r)) return r.toFixed(0);
    var s = r.toFixed(4);
    while(s.charAt(s.length-1)==='0') s = s.slice(0,-1);
    if(s.charAt(s.length-1)==='.') s = s.slice(0,-1);
    return s;
  }

  var C = {};
  ['ab','anb','nab','nanb','pa','pna','pb','pnb','total'].forEach(function(k){ C[k] = document.getElementById('c-'+k); });

  function showLabels(){
    if(!C.ab) return;
    C.ab.innerHTML='P(A&cap;B)'; C.anb.innerHTML='P(A&cap;B&prime;)';
    C.nab.innerHTML='P(A&prime;&cap;B)'; C.nanb.innerHTML='P(A&prime;&cap;B&prime;)';
    C.pa.innerHTML='P(A)'; C.pna.innerHTML='P(A&prime;)';
    C.pb.innerHTML='P(B)'; C.pnb.innerHTML='P(B&prime;)';
    C.total.innerHTML='1';
    C.ab.className=C.anb.className=C.nab.className=C.nanb.className=C.pa.className=C.pna.className=C.pb.className=C.pnb.className='cell-label';
    C.total.className='cell-locked';
  }

  function fillHouse(){
    if(!C.ab) return;
    C.pa.innerHTML=f(PA); C.pa.className='cell-given';
    C.ab.innerHTML=f(PAB); C.ab.className='cell-derived';
    C.nab.innerHTML=f(PNAB); C.nab.className='cell-derived';
    C.anb.innerHTML=f(PANB); C.anb.className='cell-derived';
    C.nanb.innerHTML=f(PNANB); C.nanb.className='cell-derived';
    C.pna.innerHTML=f(PNA); C.pna.className='cell-derived';
    C.pb.innerHTML=f(PB); C.pb.className='cell-derived';
    C.pnb.innerHTML=f(PNB); C.pnb.className='cell-derived';
    C.total.innerHTML='1'; C.total.className='cell-locked';
  }

  function clearHL(){ Object.keys(C).forEach(function(k){ if(C[k]) C[k].classList.remove('cell-path','cell-highlight'); }); }
  function hlCells(keys){ clearHL(); (keys||[]).forEach(function(k){ if(C[k]) C[k].classList.add('cell-path'); }); }

  /* --- Path definitions --- */
  var PATHS = {
    addisjon: {
      name:'Addisjon', kap:'Kap 2',
      formula:'P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)',
      hl:['pa','pb','ab','anb','nab'],
      blueprint:'The question: what is the chance that <strong>at least one</strong> of A or B happens? You are gathering every room of the house where A fires, or B fires, or both. You end in one number &mdash; P(A&cup;B).',
      stages:[
        {t:'Stage 1 &mdash; Gather the A-row.', b:'Read P(A) from the &Sigma; rad margin. That is every room where A fires: P(A&cap;B) + P(A&cap;B&prime;).', hl:['pa','ab','anb']},
        {t:'Stage 2 &mdash; Gather the B-column.', b:'Read P(B) from the &Sigma; kol margin: every room where B fires, P(A&cap;B) + P(A&prime;&cap;B).', hl:['pb','ab','nab']},
        {t:'Stage 3 &mdash; Remove the overlap.', b:'P(A&cap;B) sits in both the row and the column, so P(A)+P(B) counted it twice. Subtract it back once.', hl:['ab']}
      ],
      walk:[
        {label:'Stage 1 &mdash; the A-row total', lines:['P(A) = '+f(PA)+' &nbsp;&larr; &Sigma; rad margin'], rname:'Stage 1 &mdash; P(A)', rformula:'P(A) = P(A&cap;B) + P(A&cap;B&prime;)', rvalue:'P(A) = '+f(PA)},
        {label:'Stage 2 &mdash; the B-column total', lines:['P(B) = '+f(PB)+' &nbsp;&larr; &Sigma; kol margin'], rname:'Stage 2 &mdash; P(B)', rformula:'P(B) = P(A&cap;B) + P(A&prime;&cap;B)', rvalue:'P(B) = '+f(PB)},
        {label:'Stage 3 &mdash; subtract the double-counted overlap', lines:['P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)','P(A&cup;B) = '+f(PA)+' + '+f(PB)+' &minus; '+f(PAB)], rname:'Answer &mdash; P(A&cup;B)', rformula:'= '+f(PA)+' + '+f(PB)+' &minus; '+f(PAB), rvalue:'P(A&cup;B) = '+f(UNION)}
      ],
      close:'At least one of the two fires '+f(UNION*100)+'% of the time. Every piece was read straight off the margins and the one shared cell.'
    },
    multiplikasjon: {
      name:'Multiplikasjon', kap:'Kap 4',
      formula:'P(A&cap;B) = P(A|B) &middot; P(B)',
      hl:['ab','pb','nab'],
      blueprint:'The question: how much probability lands in <strong>both</strong> A and B at once? You end in the top-left cell, P(A&cap;B) &mdash; built from a conditional times a margin.',
      stages:[
        {t:'Stage 1 &mdash; Shrink the world to B.', b:'Condition on B: the B-column becomes the whole world now, with total P(B) in the &Sigma; kol margin.', hl:['pb','ab','nab']},
        {t:'Stage 2 &mdash; Measure A inside it.', b:'P(A|B) = P(A&cap;B) / P(B) &mdash; A&rsquo;s share of that shrunken column.', hl:['ab','pb']},
        {t:'Stage 3 &mdash; Multiply back.', b:'Rearrange to get the joint: P(A&cap;B) = P(A|B) &middot; P(B). Conditional times margin.', hl:['ab']}
      ],
      walk:[
        {label:'Stage 1 &mdash; shrink to the B-column', lines:['P(B) = '+f(PB)+' &nbsp;&larr; the new whole world'], rname:'Stage 1 &mdash; the column total', rformula:'condition on B', rvalue:'P(B) = '+f(PB)},
        {label:'Stage 2 &mdash; A&rsquo;s share inside B', lines:['P(A|B) = P(A&cap;B) / P(B) = '+f(PAB)+' / '+f(PB)+' = '+f(PAgB)], rname:'Stage 2 &mdash; P(A|B)', rformula:'P(A&cap;B) / P(B)', rvalue:'P(A|B) = '+f(PAgB)},
        {label:'Stage 3 &mdash; multiply back to the joint', lines:['P(A&cap;B) = P(A|B) &middot; P(B) = '+f(PAgB)+' &middot; '+f(PB)], rname:'Answer &mdash; P(A&cap;B)', rformula:'P(A|B) &middot; P(B)', rvalue:'P(A&cap;B) = '+f(PAB)}
      ],
      close:'The joint cell and the conditional are two readings of the same corner of the house &mdash; one divided by the column, one multiplied back into it.'
    },
    oppsplitting: {
      name:'Oppsplitting', kap:'Kap 4',
      formula:'P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)',
      hl:['pa','pna','ab','nab','pb'],
      blueprint:'The question: what is the overall chance of B, when B can arrive through <strong>two different doors</strong> &mdash; via A, or via A&prime;? This is the law you reach for when the problem hands you a prior and two conditionals. You end in P(B).',
      stages:[
        {t:'Stage 1 &mdash; Split the world by A.', b:'The prior cuts everything into two lanes: the A-lane P(A) and the A&prime;-lane P(A&prime;) = 1 &minus; P(A).', hl:['pa','pna']},
        {t:'Stage 2 &mdash; Send B down each lane.', b:'A-lane: P(B|A)&middot;P(A) lands in the true cell P(A&cap;B). A&prime;-lane: P(B|A&prime;)&middot;P(A&prime;) lands in P(A&prime;&cap;B).', hl:['ab','nab']},
        {t:'Stage 3 &mdash; Sum the two lanes.', b:'Add the two B-cells. That sum is P(B) &mdash; the whole &Sigma; kol margin.', hl:['ab','nab','pb']}
      ],
      walk:[
        {label:'Stage 1 &mdash; the two lanes', lines:['P(A) = '+f(PA)+' &nbsp;&middot;&nbsp; P(A&prime;) = 1 &minus; '+f(PA)+' = '+f(PNA)], rname:'Stage 1 &mdash; split by the prior', rformula:'P(A) and P(A&prime;)', rvalue:'P(A) = '+f(PA)+' &middot; P(A&prime;) = '+f(PNA)},
        {label:'Stage 2 &mdash; B through each lane', lines:['A-lane: P(B|A)&middot;P(A) = '+f(PBgA)+' &middot; '+f(PA)+' = '+f(PAB),'A&prime;-lane: P(B|A&prime;)&middot;P(A&prime;) = '+f(PBgNA)+' &middot; '+f(PNA)+' = '+f(PNAB)], rname:'Stage 2 &mdash; the two B-cells', rformula:'true positives + false positives', rvalue:f(PAB)+' &nbsp; and &nbsp; '+f(PNAB)},
        {label:'Stage 3 &mdash; sum the lanes', lines:['P(B) = '+f(PAB)+' + '+f(PNAB)], rname:'Answer &mdash; P(B)', rformula:'P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)', rvalue:'P(B) = '+f(PB)}
      ],
      close:'B fires '+f(PB*100)+'% of the time overall &mdash; mostly the '+f(PAB)+' of true cases, plus a thin '+f(PNAB)+' of false alarms from the much larger A&prime; lane.'
    },
    bayes: {
      name:'Bayes', kap:'Kap 4',
      formula:'P(A|B) = P(B|A)&middot;P(A) / P(B)',
      hl:['ab','pa','pb','nab'],
      blueprint:'The question: the test came back positive (B) &mdash; so now what is the chance the trait is really there (A)? You are <strong>flipping</strong> a known forward chance P(B|A) into its reverse P(A|B). You end in P(A|B).',
      stages:[
        {t:'Stage 1 &mdash; Numerator: the true-positive cell.', b:'P(B|A)&middot;P(A) = P(A&cap;B) &mdash; the carriers who test positive. The top-left cell.', hl:['ab','pa']},
        {t:'Stage 2 &mdash; Denominator: every positive.', b:'P(B) from Oppsplitting &mdash; everyone who tests positive, true cases and false alarms together.', hl:['pb','ab','nab']},
        {t:'Stage 3 &mdash; Divide.', b:'P(A|B) = P(A&cap;B) / P(B) &mdash; the true-positive slice of all the positives.', hl:['ab','pb']}
      ],
      walk:[
        {label:'Stage 1 &mdash; numerator (true positives)', lines:['P(B|A)&middot;P(A) = '+f(PBgA)+' &middot; '+f(PA)+' = '+f(PAB)+' &nbsp;= P(A&cap;B)'], rname:'Stage 1 &mdash; the true-positive cell', rformula:'P(B|A)&middot;P(A)', rvalue:'P(A&cap;B) = '+f(PAB)},
        {label:'Stage 2 &mdash; denominator (all positives)', lines:['P(B) = '+f(PB)+' &nbsp;&larr; from Oppsplitting (true + false positives)'], rname:'Stage 2 &mdash; all positives', rformula:'P(B)', rvalue:'P(B) = '+f(PB)},
        {label:'Stage 3 &mdash; divide, flipping forward to reverse', lines:['P(A|B) = P(A&cap;B) / P(B) = '+f(PAB)+' / '+f(PB)+' &asymp; '+f(PAgB)], rname:'Answer &mdash; P(A|B)', rformula:'P(B|A)&middot;P(A) / P(B)', rvalue:'P(A|B) &asymp; '+f(PAgB)}
      ],
      close:'The trap the exam loves: a 90% test, yet a positive only means about '+Math.round(PAgB*100)+'% &mdash; because the trait is rare, the thin false-positive lane is nearly as big as the true one. The base rate rules.'
    }
  };

  /* --- Rendering --- */
  var activePath = null, step = 1;

  function setActiveStepBtn(){
    document.querySelectorAll('.step-nav .step-btn').forEach(function(b){
      b.classList.toggle('active', parseInt(b.getAttribute('data-step'),10)===step);
    });
  }

  function blueprintHTML(P){
    return '<div class="step-content"><h3>Step 1 &mdash; Blueprint: '+P.name+'</h3>'+
      '<p>'+P.blueprint+'</p>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">'+P.formula+'</p></div>';
  }
  function processHTML(P){
    var h='<div class="step-content"><h3>Step 2 &mdash; Process: '+P.name+'</h3>'+
      '<p>The same stages you will walk with numbers in Step 4 &mdash; always in this order, each one leaning on the cells the last one found.</p>'+
      '<div class="proc-block"><div class="proc-title">Procedure</div>';
    P.stages.forEach(function(s){ h+='<div class="proc-step"><strong>'+s.t+'</strong> '+s.b+'</div>'; });
    h+='<div class="proc-step" style="margin-top:10px;color:var(--accent)">'+P.formula+'</div></div></div>';
    return h;
  }
  function dataHTML(P){
    return '<div class="step-content"><h3>Step 3 &mdash; The Data</h3>'+
      '<p>This station is only for <strong>reading</strong> the problem the way the exam states it &mdash; a prior and two conditionals. No solving yet.</p>'+
      '<div class="data-card"><div class="data-title">A screening test</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) &mdash; the prior</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A) &mdash; catches a true case</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;) &mdash; false alarm on a healthy one</th><td>0.10</td></tr>'+
      '</table></div>'+
      '<p>One in five carry the trait (P(A) = 0.20). The test is good &mdash; it catches 90% of carriers &mdash; but it also cries wolf on 10% of everyone else. Those three numbers are enough: the house fills itself. P(A&cap;B) = 0.90&middot;0.20 = 0.18, the false-positive cell P(A&prime;&cap;B) = 0.10&middot;0.80 = 0.08, and the rest follows by the conservation law.</p>'+
      '<p>Before any path, <em>feel</em> the tension: the trait is rare, so even a sharp test will drag a crowd of false alarms in alongside the true cases. That is the whole story Step 4 makes exact.</p></div>';
  }
  function walkHTML(P){
    var h='<div class="step-content"><h3>Step 4 &mdash; Run the Formula: '+P.name+'</h3>'+
      '<p>The same stages from the Process, now with the numbers from the filled house. Watch each stage hand the next one its piece.</p>';
    P.walk.forEach(function(w){
      h+='<div class="derivation"><div class="d-label">'+w.label+'</div>';
      w.lines.forEach(function(l){ h+='<div class="d-line">'+l+'</div>'; });
      h+='</div>';
      h+='<div class="result-box"><div class="result-box-name">'+w.rname+'</div><div class="result-box-formula">'+w.rformula+'</div><div class="result-box-value">'+w.rvalue+'</div></div>';
    });
    if(P.close) h+='<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+P.close+'</p>';
    h+='</div>';
    return h;
  }

  function renderStep(){
    setActiveStepBtn();
    var host = document.getElementById('step-container');
    if(!host) return;
    if(!activePath){ host.innerHTML='<div class="step-content"><p style="color:var(--muted);font-style:italic">Pick a path above, then walk the four steps.</p></div>'; showLabels(); clearHL(); return; }
    var P = PATHS[activePath];
    if(step===1){ showLabels(); host.innerHTML=blueprintHTML(P); }
    else if(step===2){ showLabels(); host.innerHTML=processHTML(P); }
    else if(step===3){ fillHouse(); host.innerHTML=dataHTML(P); }
    else if(step===4){ fillHouse(); host.innerHTML=walkHTML(P); }
    else if(step===5){ fillHouse(); host.innerHTML='<div class="step-content"><h3>Step 5 &mdash; Test yourself</h3><div id="test-host"></div></div>'; if(window.renderTest) window.renderTest(activePath); }
    markDone();
    hlCells(P.hl);
  }

  function markDone(){
    document.querySelectorAll('.step-nav .step-btn').forEach(function(b){
      var n=parseInt(b.getAttribute('data-step'),10);
      b.classList.toggle('done', activePath && n<step);
    });
  }

  function selectPath(p){
    activePath=p; step=1;
    document.querySelectorAll('.mode-nav .mode-btn').forEach(function(b){ b.classList.toggle('active', b.getAttribute('data-path')===p); });
    renderStep();
  }

  function init(){
    document.querySelectorAll('.mode-nav .mode-btn').forEach(function(b){
      b.addEventListener('click', function(){ selectPath(b.getAttribute('data-path')); });
    });
    document.querySelectorAll('.step-nav .step-btn').forEach(function(b){
      b.addEventListener('click', function(){ if(!activePath) return; step=parseInt(b.getAttribute('data-step'),10); renderStep(); });
    });
    showLabels();
    selectPath('oppsplitting');
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
