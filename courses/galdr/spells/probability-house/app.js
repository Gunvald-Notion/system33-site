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

  /* --- Braced formula pieces (ported from the Kap 11 formation) --- */
  var BP='M 0 0 Q 4 0 4 4 L 46 4 Q 50 4 50 9 Q 50 4 54 4 L 96 4 Q 100 4 100 0';
  function brace(){return '<svg class="piece-brace" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="'+BP+'" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>';}
  function pc(t,l,c){return '<span class="piece" data-c="'+c+'"><span class="piece-text">'+t+'</span>'+brace()+'<span class="piece-label">'+l+'</span></span>';}

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

  /* --- Bayes: deepened path (first-principle depth, self-contained pieces) --- */
  function bayesFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(A|B) =</span>'+
        pc(f(PBgA)+'&middot;'+f(PA)+' = '+f(PAB),'numerator: true positives','o')+
        '<span class="formula-op">&divide;</span>'+
        pc(f(PAB)+' + '+f(PNAB)+' = '+f(PB),'denominator: all positives','b')+
        '<span class="formula-op">&rarr;</span>'+
        pc('&asymp; '+f(PAgB),'the flip','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(A|B) =</span>'+
      pc('P(B|A)&middot;P(A)','numerator: true positives','o')+
      '<span class="formula-op">&divide;</span>'+
      pc('P(B)','denominator: all positives','b')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(A|B)','the flip','a')+'</div>';
  }

  function bayesBlueprint(){
    return '<div class="step-content"><h3>Step 1 &mdash; Blueprint: first the space, then the law</h3>'+
      '<h4>What space are we standing in?</h4>'+
      '<p>Before a single formula, fix where you are &mdash; this is the step most people skip, and it is exactly why the rest starts to feel like magic instead of building. <strong>You are inside one whole world, and that whole equals 1.</strong> Every chance here is a <em>share</em> of that one &mdash; never a loose number floating free, always a slice of the total.</p>'+
      '<p>The house <em>is</em> that whole, carved into four rooms &mdash; P(A&cap;B), P(A&cap;B&prime;), P(A&prime;&cap;B), P(A&prime;&cap;B&prime;). They <strong>tile the entire space</strong>: nothing falls outside them, none of them overlap, and they sum straight back to 1. The margins down the side and across the top are just the outer walls &mdash; P(A) is its whole row added up, P(B) its whole column. So the first law of this place, before Bayes, before anything: <strong>nothing you compute can leave the house. Every move only shifts mass that already sums to 1.</strong></p>'+
      '<h4>The rooms are built, not handed to you</h4>'+
      '<p>Here is the hinge most people miss. A cell like P(A&cap;B) is <em>not</em> an atom you are simply given &mdash; it is <strong>made of</strong> pieces of the space. To build it you stand on a wall and carve a slice of it: P(A&cap;B) = P(B|A)&middot;P(A) &mdash; take the A-row (worth P(A) of the whole), keep the P(B|A) fraction of it that also tests positive. Once you see that a room is <em>a wall times a fraction</em>, you see how the entire house <strong>functions</strong>: every inner cell is a margin narrowed by a conditional. That is the gauntlet &mdash; always knowing which wall you are standing on, and what fraction of it you are keeping.</p>'+
      '<h4>What the law is for</h4>'+
      '<p>Now the question. The test came back <strong>positive</strong> (B), and you want the chance the trait is really there (A) &mdash; P(A|B). But the lab only ever measured the <em>forward</em> direction, P(B|A): how often a true carrier trips the test. <strong>Bayes is the spell that turns that forward chance around into the reverse you need</strong> &mdash; and it never once leaves the house to do it.</p>'+
      '<h4>How it works</h4>'+
      '<p>The bridge between forward and reverse is the one room they <em>share</em>: P(A&cap;B), the top-left cell. That single room can be built through two different walls. Forward: P(B|A)&middot;P(A) &mdash; stand in the A-row, keep the positives. Reverse: P(A|B)&middot;P(B) &mdash; stand in the B-column, keep the carriers. Same room, two doors &mdash; so they are equal:</p>'+
      '<div class="derivation"><div class="d-line">P(B|A)&middot;P(A) &nbsp;=&nbsp; P(A&cap;B) &nbsp;=&nbsp; P(A|B)&middot;P(B)</div></div>'+
      '<p>Solve that equality for the reverse and Bayes falls straight out: <strong>P(A|B) = P(B|A)&middot;P(A) / P(B)</strong>.</p>'+
      '<h4>Why you are allowed to do it</h4>'+
      '<p>Because the room is <strong>symmetric</strong> &mdash; &ldquo;A and B&rdquo; is the same corner of the space as &ldquo;B and A.&rdquo; That shared room is the hinge that lets you walk in through either wall. Nothing else is assumed; the equality <em>is</em> the permission, and it holds for one reason only &mdash; both readings land in the very same slice of the very same whole.</p>'+
      '<div class="derivation"><div class="d-label">What each symbol means &mdash; in plain words</div>'+
      '<div class="d-line"><strong>A</strong> &mdash; has the trait (the carrier) &nbsp;&middot;&nbsp; <strong>A&prime;</strong> &mdash; does not have the trait (healthy)</div>'+
      '<div class="d-line"><strong>B</strong> &mdash; tests positive &nbsp;&middot;&nbsp; <strong>B&prime;</strong> &mdash; tests negative</div>'+
      '<div class="d-line"><strong>P(A)</strong> &mdash; the A-row wall: how common the trait is (the base rate)</div>'+
      '<div class="d-line"><strong>P(B|A)</strong> &mdash; standing in the A-row, the fraction that tests positive (the catch rate)</div>'+
      '<div class="d-line"><strong>P(A&cap;B)</strong> &mdash; the true-positive room: has the trait AND tests positive</div>'+
      '<div class="d-line"><strong>P(B)</strong> &mdash; the B-column wall: everyone who tests positive (true + false alarms)</div>'+
      '<div class="d-line"><strong>P(A|B)</strong> &mdash; the answer: inside the B-column, the share that really carries</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(A|B) = P(B|A)&middot;P(A) / P(B)</p></div>';
  }

  function bayesProcess(){
    return '<div class="step-content"><h3>Step 2 &mdash; Process: three moves that flip the chance</h3>'+
      '<p>The same three moves you will walk with numbers in Step 4 &mdash; always in this order, each leaning on the house the last one built. The shape first, no numbers yet.</p>'+
      bayesFviz(false)+
      '<div class="proc-block"><div class="proc-title">Procedure</div>'+
      '<div class="proc-step"><strong>Move 1 &mdash; Build the numerator: the true-positive cell.</strong> P(B|A)&middot;P(A) = P(A&cap;B). <em>Why this piece:</em> of all the positives, the only ones you actually want are the carriers who correctly test positive &mdash; the top-left room. <em>What it does to the space:</em> it folds the forward catch-rate and the base rate into a single cell of mass.</div>'+
      '<div class="proc-step"><strong>Move 2 &mdash; Build the denominator: every positive.</strong> P(B) = P(A&cap;B) + P(A&prime;&cap;B). <em>Why this piece:</em> a positive can arrive through two doors &mdash; a real carrier (true positive), or a healthy person the test marks positive by mistake (false positive). The reverse question lives inside the whole world of positives, so you must gather both doors. <em>What it does to the space:</em> it shrinks the world from everyone down to the B-column &mdash; everyone who tested positive.</div>'+
      '<div class="proc-step"><strong>Move 3 &mdash; Divide: the true slice of all positives.</strong> P(A|B) = P(A&cap;B) / P(B). <em>Why this piece:</em> inside that shrunken column of positives, what share are really carriers? That share <em>is</em> the reverse chance. <em>What it does to the space:</em> it reads A&rsquo;s density inside the B-column &mdash; the flip is complete.</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(A|B) = P(B|A)&middot;P(A) / P(B)</p></div>';
  }

  function bayesData(){
    return '<div class="step-content"><h3>Step 3 &mdash; The Data: three numbers, and how they light the house</h3>'+
      '<h4>What the problem hands you</h4>'+
      '<p>A Bayes problem almost never hands you the rooms of the house directly. It hands you a <strong>prior</strong> and <strong>two conditionals</strong> &mdash; three numbers in words &mdash; and trusts you to build the rest.</p>'+
      '<div class="data-card"><div class="data-title">A screening test</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) &mdash; the prior: how common the trait is</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A) &mdash; a true carrier testing positive</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;) &mdash; a healthy person testing positive (a false positive)</th><td>0.10</td></tr>'+
      '</table></div>'+
      '<p>In words: <strong>one in five</strong> people carry the trait. The test is good &mdash; when someone truly carries it, the test catches them <strong>90%</strong> of the time. But it is not perfect: of the healthy people, <strong>10%</strong> still come back positive anyway. That is a <em>false positive</em> &mdash; the test says &ldquo;positive&rdquo; on someone who carries nothing.</p>'+
      '<h4>Now watch the house above fill</h4>'+
      '<p>Those three numbers are enough, because every inner room is just a wall times a fraction. Build the two rooms sitting in the <strong>B-column</strong> &mdash; the two ways a positive can happen &mdash; and read them straight off the lit cells:</p>'+
      '<div class="derivation"><div class="d-label">the two rooms in the B-column</div>'+
      '<div class="d-line"><strong>top-left room</strong> &mdash; true positives: &nbsp; P(A&cap;B) = P(B|A)&middot;P(A) = '+f(PBgA)+'&middot;'+f(PA)+' = <strong>'+f(PAB)+'</strong></div>'+
      '<div class="d-line"><strong>room just below it</strong> &mdash; false positives: &nbsp; P(A&prime;&cap;B) = P(B|A&prime;)&middot;P(A&prime;) = '+f(PBgNA)+'&middot;'+f(PNA)+' = <strong>'+f(PNAB)+'</strong></div>'+
      '</div>'+
      '<p>Stack those two rooms on top of each other and you have the whole <strong>B-column wall</strong>: P(B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong>. The rest of the house then closes itself by conservation &mdash; every row and column sums to its margin, and the whole thing back to 1.</p>'+
      '<h4>One room, read forward and backward</h4>'+
      '<p>Look up at the top-left room, P(A&cap;B) = '+f(PAB)+'. We just built it <em>forward</em> &mdash; coming down from the A-row, P(B|A)&middot;P(A). In Step 4 we read the very same room <em>backward</em> &mdash; coming across from the B-column, dividing it by P(B) to land on P(A|B). Same '+f(PAB)+' of mass, two directions through one door. That single room, read both ways, <em>is</em> the whole flip &mdash; everything else is just building the walls it sits between.</p>'+
      '<h4>Feel the tension before you solve</h4>'+
      '<p>The trait is <em>rare</em> &mdash; only '+f(PA)+' of the house sits in the A-row, against '+f(PNA)+' in the far larger A&prime;-row. So even a sharp test pulls a real crowd of false positives ('+f(PNAB)+') up against the true ones ('+f(PAB)+'). Hold that &mdash; it is the whole reason the answer in Step 4 lands lower than your gut expects.</p></div>';
  }

  function bayesWalk(){
    return '<div class="step-content"><h3>Step 4 &mdash; Run the Formula: the flip, piece by piece</h3>'+
      '<p>The three moves from the Process, now carrying the numbers from the filled house. Each piece below stands on its own &mdash; what it is, its formula, its arithmetic, its value &mdash; nothing pointing off to another room.</p>'+
      bayesFviz(true)+
      '<div class="derivation"><div class="d-label">Move 1 &mdash; numerator: the true-positive cell</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">Carriers who correctly test positive &mdash; has the trait (A) <em>and</em> tests positive (B). The top-left room.</div>'+
      '<div class="d-line">P(B|A)&middot;P(A) = '+f(PBgA)+'&middot;'+f(PA)+' = <strong>'+f(PAB)+'</strong> &nbsp;=&nbsp; P(A&cap;B)</div></div>'+
      '<div class="derivation"><div class="d-label">Move 2 &mdash; denominator: everyone who tests positive</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">A positive arrives two ways. Build both doors right here &mdash; no need to leave for another room.</div>'+
      '<div class="d-line">true positives: &nbsp; P(A&cap;B) = <strong>'+f(PAB)+'</strong></div>'+
      '<div class="d-line">false positives: &nbsp; P(A&prime;&cap;B) = P(B|A&prime;)&middot;P(A&prime;) = '+f(PBgNA)+'&middot;'+f(PNA)+' = <strong>'+f(PNAB)+'</strong></div>'+
      '<div class="d-line">P(B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Move 3 &mdash; divide: the true slice of all positives</div>'+
      '<div class="d-line">P(A|B) = P(A&cap;B) / P(B) = '+f(PAB)+' / '+f(PB)+' &asymp; <strong>'+f(PAgB)+'</strong></div></div>'+
      '<div class="result-box"><div class="result-box-name">The flip &mdash; P(A|B)</div><div class="result-box-formula">P(B|A)&middot;P(A) / P(B)</div><div class="result-box-value">P(A|B) &asymp; '+f(PAgB)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.bayes.close+'</p></div>';
  }

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
      '<tr><th>P(B|A&prime;) &mdash; false positive on a healthy one</th><td>0.10</td></tr>'+
      '</table></div>'+
      '<p>One in five carry the trait (P(A) = 0.20). The test is good &mdash; it catches 90% of carriers &mdash; but it also returns a false positive on 10% of healthy people. Those three numbers are enough: the house fills itself. P(A&cap;B) = 0.90&middot;0.20 = 0.18, the false-positive cell P(A&prime;&cap;B) = 0.10&middot;0.80 = 0.08, and the rest follows by the conservation law.</p>'+
      '<p>Before any path, <em>feel</em> the tension: the trait is rare, so even a sharp test will drag a crowd of false positives in alongside the true cases. That is the whole story Step 4 makes exact.</p></div>';
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
    var isBayes = activePath==='bayes';
    if(step===1){ showLabels(); host.innerHTML = isBayes ? bayesBlueprint() : blueprintHTML(P); }
    else if(step===2){ showLabels(); host.innerHTML = isBayes ? bayesProcess() : processHTML(P); }
    else if(step===3){ fillHouse(); host.innerHTML = isBayes ? bayesData() : dataHTML(P); }
    else if(step===4){ fillHouse(); host.innerHTML = isBayes ? bayesWalk() : walkHTML(P); }
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
