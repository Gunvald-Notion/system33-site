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

  /* --- Path definitions (formula, highlight set, close line) --- */
  var PATHS = {
    addisjon: {
      name:'Addisjon', kap:'Kap 2',
      formula:'P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)',
      hl:['pa','pb','ab','anb','nab'],
      close:'At least one of the two fires '+f(UNION*100)+'% of the time. Every piece was read straight off the margins and the one shared corner — and the overlap was paid back exactly once.'
    },
    multiplikasjon: {
      name:'Multiplikasjon', kap:'Kap 4',
      formula:'P(A&cap;B) = P(A|B) &middot; P(B)',
      hl:['ab','pb','nab'],
      close:'The joint room and the conditional are two readings of the same corner of the house — one divided down by the column, one multiplied back into it.'
    },
    oppsplitting: {
      name:'Oppsplitting', kap:'Kap 4',
      formula:'P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)',
      hl:['pa','pna','ab','nab','pb'],
      close:'B fires '+f(PB*100)+'% of the time overall — mostly the '+f(PAB)+' of true cases, plus a thin '+f(PNAB)+' of false positives drawn from the much larger A&prime; lane.'
    },
    bayes: {
      name:'Bayes', kap:'Kap 4',
      formula:'P(A|B) = P(B|A)&middot;P(A) / P(B)',
      hl:['ab','pa','pb','nab'],
      close:'The trap the exam loves: a 90% test, yet a positive only means about '+Math.round(PAgB*100)+'% — because the trait is rare, the thin false-positive lane is nearly as big as the true one. The base rate rules.'
    }
  };

  /* ============================================================
     BAYES — deepened path
     ============================================================ */
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

  /* ============================================================
     ADDISJON — deepened path  (P(A\u222aB) = P(A) + P(B) \u2212 P(A\u2229B))
     ============================================================ */
  function addFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(A&cup;B) =</span>'+
        pc(f(PA),'the whole A-row','b')+
        '<span class="formula-op">+</span>'+
        pc(f(PB),'the whole B-column','b')+
        '<span class="formula-op">&minus;</span>'+
        pc(f(PAB),'shared corner, counted twice','o')+
        '<span class="formula-op">&rarr;</span>'+
        pc('= '+f(UNION),'at least one','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(A&cup;B) =</span>'+
      pc('P(A)','the whole A-row','b')+
      '<span class="formula-op">+</span>'+
      pc('P(B)','the whole B-column','b')+
      '<span class="formula-op">&minus;</span>'+
      pc('P(A&cap;B)','shared corner, counted twice','o')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(A&cup;B)','at least one','a')+'</div>';
  }

  function addBlueprint(){
    return '<div class="step-content"><h3>Step 1 &mdash; Blueprint: first the space, then the law</h3>'+
      '<h4>What space are we standing in?</h4>'+
      '<p>Before a single formula, fix where you are. <strong>You are inside one whole world, and that whole equals 1.</strong> The house is that whole, carved into four rooms &mdash; P(A&cap;B), P(A&cap;B&prime;), P(A&prime;&cap;B), P(A&prime;&cap;B&prime;) &mdash; that tile it completely: nothing outside, no overlap, all summing back to 1. The margins are the outer walls: P(A) is its whole row added up, P(B) its whole column. The Addisjon question lives <em>across</em> the house &mdash; every room that A or B touches.</p>'+
      '<h4>The rooms are built, not handed to you</h4>'+
      '<p>The walls themselves are sums of rooms. P(A) = P(A&cap;B) + P(A&cap;B&prime;) &mdash; the A-row is its two rooms stacked. P(B) = P(A&cap;B) + P(A&prime;&cap;B) the same way. Hold that, because it is the whole reason the union needs care: the corner room P(A&cap;B) lives inside <em>both</em> the A-row and the B-column at once.</p>'+
      '<h4>What the law is for</h4>'+
      '<p>The question: what is the chance that <strong>at least one</strong> of A or B happens &mdash; P(A&cup;B)? You are gathering every room the two events touch: the union of the A-row and the B-column.</p>'+
      '<h4>How it works</h4>'+
      '<p>Grab the whole A-row, P(A). Grab the whole B-column, P(B). Add them &mdash; but the shared corner P(A&cap;B) sat inside both grabs, so it just got counted <strong>twice</strong>. Subtract it back once, and every room is counted exactly once:</p>'+
      '<div class="derivation"><div class="d-line">P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)</div></div>'+
      '<h4>Why you are allowed to do it</h4>'+
      '<p>Because the union is exactly the set of rooms touched by A or B, and each must carry weight once &mdash; no more, no less. Adding the two walls double-counts only the overlap; removing it once restores every room to a single count. That is inclusion&ndash;exclusion, and it holds for no deeper reason than the rooms summing honestly to themselves.</p>'+
      '<div class="derivation"><div class="d-label">What each symbol means &mdash; in plain words</div>'+
      '<div class="d-line"><strong>P(A)</strong> &mdash; the A-row wall: every room where A fires</div>'+
      '<div class="d-line"><strong>P(B)</strong> &mdash; the B-column wall: every room where B fires</div>'+
      '<div class="d-line"><strong>P(A&cap;B)</strong> &mdash; the shared corner: where A and B fire together</div>'+
      '<div class="d-line"><strong>P(A&cup;B)</strong> &mdash; the answer: every room where at least one fires</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)</p></div>';
  }

  function addProcess(){
    return '<div class="step-content"><h3>Step 2 &mdash; Process: three moves to the union</h3>'+
      '<p>The same three moves you will walk with numbers in Step 4 &mdash; always in this order. The shape first, no numbers yet.</p>'+
      addFviz(false)+
      '<div class="proc-block"><div class="proc-title">Procedure</div>'+
      '<div class="proc-step"><strong>Move 1 &mdash; Gather the whole A-row.</strong> Read P(A) off the row margin. <em>Why this piece:</em> it is every room where A fires. <em>What it does to the space:</em> it collapses the A-row into a single wall of mass.</div>'+
      '<div class="proc-step"><strong>Move 2 &mdash; Gather the whole B-column.</strong> Read P(B) off the column margin. <em>Why this piece:</em> it is every room where B fires. <em>What it does to the space:</em> it collapses the B-column into a single wall.</div>'+
      '<div class="proc-step"><strong>Move 3 &mdash; Subtract the shared corner once.</strong> &minus; P(A&cap;B). <em>Why this piece:</em> that corner sat inside both walls, so adding them counted it twice. <em>What it does to the space:</em> it removes the double-count, leaving every room with exactly one vote.</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)</p></div>';
  }

  function addData(){
    return '<div class="step-content"><h3>Step 3 &mdash; The Data: read it off the lit house</h3>'+
      '<h4>What the problem hands you</h4>'+
      '<p>The same screening test fills the house &mdash; a prior and two conditionals &mdash; and from them every room and wall is built. For the union you only need three things off the lit house: the A-row wall, the B-column wall, and the shared corner.</p>'+
      '<div class="data-card"><div class="data-title">Read off the filled house</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) &mdash; the whole A-row</th><td>'+f(PA)+'</td></tr>'+
      '<tr><th>P(B) &mdash; the whole B-column</th><td>'+f(PB)+'</td></tr>'+
      '<tr><th>P(A&cap;B) &mdash; the shared corner</th><td>'+f(PAB)+'</td></tr>'+
      '</table></div>'+
      '<p>Look up at the house: the A-row margin reads '+f(PA)+', the B-column margin reads '+f(PB)+', and the top-left room they share reads '+f(PAB)+'. Notice the corner is already sitting <em>inside</em> both margins &mdash; that is the double-count waiting to happen.</p>'+
      '<h4>Feel the tension before you solve</h4>'+
      '<p>The shared corner ('+f(PAB)+') is large next to the walls &mdash; most of the A-row <em>is</em> that corner. So if you just added P(A) + P(B) and stopped, you would badly overshoot. The whole craft of the union is paying that overlap back exactly once.</p></div>';
  }

  function addWalk(){
    return '<div class="step-content"><h3>Step 4 &mdash; Run the Formula: the union, piece by piece</h3>'+
      '<p>The three moves from the Process, now carrying the numbers from the filled house. Each piece stands on its own.</p>'+
      addFviz(true)+
      '<div class="derivation"><div class="d-label">Move 1 &mdash; the whole A-row</div>'+
      '<div class="d-line">P(A) = P(A&cap;B) + P(A&cap;B&prime;) = '+f(PAB)+' + '+f(PANB)+' = <strong>'+f(PA)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Move 2 &mdash; the whole B-column</div>'+
      '<div class="d-line">P(B) = P(A&cap;B) + P(A&prime;&cap;B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Move 3 &mdash; subtract the shared corner once</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">It was counted inside both walls above, so pay it back exactly once.</div>'+
      '<div class="d-line">P(A&cup;B) = '+f(PA)+' + '+f(PB)+' &minus; '+f(PAB)+'</div></div>'+
      '<div class="result-box"><div class="result-box-name">The union &mdash; P(A&cup;B)</div><div class="result-box-formula">P(A) + P(B) &minus; P(A&cap;B)</div><div class="result-box-value">P(A&cup;B) = '+f(UNION)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.addisjon.close+'</p></div>';
  }

  /* ============================================================
     MULTIPLIKASJON — deepened path  (P(A\u2229B) = P(A|B)\u00b7P(B))
     ============================================================ */
  function mulFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(A&cap;B) =</span>'+
        pc('&asymp; '+f(PAgB),'A&rsquo;s share inside B','o')+
        '<span class="formula-op">&times;</span>'+
        pc(f(PB),'the B-column world','b')+
        '<span class="formula-op">&rarr;</span>'+
        pc('&asymp; '+f(PAB),'the joint room','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(A&cap;B) =</span>'+
      pc('P(A|B)','A&rsquo;s share inside B','o')+
      '<span class="formula-op">&times;</span>'+
      pc('P(B)','the B-column world','b')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(A&cap;B)','the joint room','a')+'</div>';
  }

  function mulBlueprint(){
    return '<div class="step-content"><h3>Step 1 &mdash; Blueprint: first the space, then the law</h3>'+
      '<h4>What space are we standing in?</h4>'+
      '<p>Before a single formula, fix where you are. <strong>You are inside one whole world worth 1</strong>, carved into four rooms that tile it &mdash; no overlap, nothing outside, all summing to 1. The margins are the outer walls. The Multiplikasjon question lives in a single room: the top-left corner, P(A&cap;B), where A and B happen <em>together</em>.</p>'+
      '<h4>The rooms are built, not handed to you</h4>'+
      '<p>This is the hinge. The joint room P(A&cap;B) is not an atom &mdash; it is <strong>a wall narrowed by a fraction</strong>. Stand in the B-column (worth P(B)) and keep only A&rsquo;s share of it, P(A|B). That product builds the room: P(A&cap;B) = P(A|B)&middot;P(B). A conditional times a margin.</p>'+
      '<h4>What the law is for</h4>'+
      '<p>The question: how much probability lands in <strong>both</strong> A and B at once? You are building the top-left room from a conditional and the wall it sits against.</p>'+
      '<h4>How it works</h4>'+
      '<p>Condition on B &mdash; the B-column becomes the whole world for a moment, worth P(B). Inside that shrunken world, P(A|B) is A&rsquo;s density. Multiply that density back by the size of the world it lived in, and you return to the full house with the joint room filled:</p>'+
      '<div class="derivation"><div class="d-line">P(A|B) = P(A&cap;B) / P(B) &nbsp;&rArr;&nbsp; P(A&cap;B) = P(A|B)&middot;P(B)</div></div>'+
      '<h4>Why you are allowed to do it</h4>'+
      '<p>Because conditioning is just rescaling. P(A|B) is <em>defined</em> as the joint divided by the column &mdash; A&rsquo;s mass measured against the shrunken world. Multiplying by P(B) simply undoes that rescale and puts the mass back into the full house. The definition <em>is</em> the permission.</p>'+
      '<div class="derivation"><div class="d-label">What each symbol means &mdash; in plain words</div>'+
      '<div class="d-line"><strong>P(B)</strong> &mdash; the B-column wall: the shrunken world once we condition on B</div>'+
      '<div class="d-line"><strong>P(A|B)</strong> &mdash; inside that world, A&rsquo;s share (its density in the B-column)</div>'+
      '<div class="d-line"><strong>P(A&cap;B)</strong> &mdash; the joint room: A and B together, the top-left corner</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(A&cap;B) = P(A|B)&middot;P(B)</p></div>';
  }

  function mulProcess(){
    return '<div class="step-content"><h3>Step 2 &mdash; Process: three moves to the joint room</h3>'+
      '<p>The same three moves you will walk with numbers in Step 4 &mdash; always in this order. The shape first, no numbers yet.</p>'+
      mulFviz(false)+
      '<div class="proc-block"><div class="proc-title">Procedure</div>'+
      '<div class="proc-step"><strong>Move 1 &mdash; Shrink the world to B.</strong> Condition on B. <em>Why this piece:</em> we only care about the corner where B already holds. <em>What it does to the space:</em> the B-column becomes the whole world, worth P(B).</div>'+
      '<div class="proc-step"><strong>Move 2 &mdash; Measure A inside it.</strong> P(A|B) = P(A&cap;B) / P(B). <em>Why this piece:</em> within that shrunken world, this is A&rsquo;s share. <em>What it does to the space:</em> it reads A&rsquo;s density against the B-column rather than the whole house.</div>'+
      '<div class="proc-step"><strong>Move 3 &mdash; Multiply back.</strong> P(A&cap;B) = P(A|B)&middot;P(B). <em>Why this piece:</em> the density alone is measured against the wrong-sized world; scale it back up. <em>What it does to the space:</em> it returns the mass to the full house, filling the joint room.</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(A&cap;B) = P(A|B)&middot;P(B)</p></div>';
  }

  function mulData(){
    return '<div class="step-content"><h3>Step 3 &mdash; The Data: read it off the lit house</h3>'+
      '<h4>What the problem hands you</h4>'+
      '<p>The same filled house gives you both pieces. For the joint room you need the B-column wall and A&rsquo;s share inside it &mdash; read straight off the lit cells.</p>'+
      '<div class="data-card"><div class="data-title">Read off the filled house</div>'+
      '<table class="data-table">'+
      '<tr><th>P(B) &mdash; the B-column wall (shrunken world)</th><td>'+f(PB)+'</td></tr>'+
      '<tr><th>P(A|B) &mdash; A&rsquo;s share inside the B-column</th><td>&asymp; '+f(PAgB)+'</td></tr>'+
      '</table></div>'+
      '<p>Look up at the house: the B-column margin reads '+f(PB)+'. Inside that column sit two rooms &mdash; the true-positive corner P(A&cap;B) = '+f(PAB)+' and the room below it P(A&prime;&cap;B) = '+f(PNAB)+'. A&rsquo;s share of the column is '+f(PAB)+' / '+f(PB)+' &asymp; '+f(PAgB)+'.</p>'+
      '<h4>Feel the tension before you solve</h4>'+
      '<p>A&rsquo;s share <em>inside</em> B ('+f(PAgB)+') is far larger than A&rsquo;s share of the whole house (P(A) = '+f(PA)+'). That jump is conditioning at work &mdash; once you know B happened, the world shrank to a column where A is much denser. Multiplying back by the column&rsquo;s true size brings it honestly back to '+f(PAB)+'.</p></div>';
  }

  function mulWalk(){
    return '<div class="step-content"><h3>Step 4 &mdash; Run the Formula: the joint room, piece by piece</h3>'+
      '<p>The three moves from the Process, now carrying the numbers from the filled house. Each piece stands on its own.</p>'+
      mulFviz(true)+
      '<div class="derivation"><div class="d-label">Move 1 &mdash; shrink to the B-column</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">Condition on B: the column is the whole world now.</div>'+
      '<div class="d-line">P(B) = P(A&cap;B) + P(A&prime;&cap;B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Move 2 &mdash; A&rsquo;s share inside B</div>'+
      '<div class="d-line">P(A|B) = P(A&cap;B) / P(B) = '+f(PAB)+' / '+f(PB)+' &asymp; <strong>'+f(PAgB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Move 3 &mdash; multiply back into the full house</div>'+
      '<div class="d-line">P(A&cap;B) = P(A|B)&middot;P(B) = '+f(PAgB)+' &middot; '+f(PB)+' &asymp; <strong>'+f(PAB)+'</strong></div></div>'+
      '<div class="result-box"><div class="result-box-name">The joint room &mdash; P(A&cap;B)</div><div class="result-box-formula">P(A|B)&middot;P(B)</div><div class="result-box-value">P(A&cap;B) = '+f(PAB)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.multiplikasjon.close+'</p></div>';
  }

  /* ============================================================
     OPPSPLITTING — deepened path  (total probability)
     P(B) = P(B|A)\u00b7P(A) + P(B|A\u2032)\u00b7P(A\u2032)
     ============================================================ */
  function oppFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(B) =</span>'+
        pc(f(PBgA)+'&middot;'+f(PA)+' = '+f(PAB),'via the A-lane','o')+
        '<span class="formula-op">+</span>'+
        pc(f(PBgNA)+'&middot;'+f(PNA)+' = '+f(PNAB),'via the A&prime;-lane','b')+
        '<span class="formula-op">&rarr;</span>'+
        pc('= '+f(PB),'all of B','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(B) =</span>'+
      pc('P(B|A)&middot;P(A)','via the A-lane','o')+
      '<span class="formula-op">+</span>'+
      pc('P(B|A&prime;)&middot;P(A&prime;)','via the A&prime;-lane','b')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(B)','all of B','a')+'</div>';
  }

  function oppBlueprint(){
    return '<div class="step-content"><h3>Step 1 &mdash; Blueprint: first the space, then the law</h3>'+
      '<h4>What space are we standing in?</h4>'+
      '<p>Before a single formula, fix where you are. <strong>You are inside one whole world worth 1</strong>, carved into four rooms that tile it &mdash; no overlap, nothing outside, all summing to 1. The Oppsplitting question lives in the B-column &mdash; but it reaches that column by first cutting the whole house in two.</p>'+
      '<h4>The rooms are built, not handed to you</h4>'+
      '<p>The two rooms in the B-column are each a lane&rsquo;s rate times its base. The true-positive corner: P(A&cap;B) = P(B|A)&middot;P(A). The room below it: P(A&prime;&cap;B) = P(B|A&prime;)&middot;P(A&prime;). Each is a wall (a lane) narrowed by a fraction (its catch rate). Build both and you have the whole column.</p>'+
      '<h4>What the law is for</h4>'+
      '<p>The question: what is the overall chance of B, when B can arrive through <strong>two different doors</strong> &mdash; via A, or via A&prime;? This is the law you reach for when the problem hands you a prior and two conditionals. You end in P(B).</p>'+
      '<h4>How it works</h4>'+
      '<p>The prior cuts the house into two lanes that tile it perfectly: the A-lane (worth P(A)) and the A&prime;-lane (worth P(A&prime;) = 1 &minus; P(A)). Send B down each lane &mdash; keep P(B|A) of the first, P(B|A&prime;) of the second &mdash; and the two B-rooms appear. Sum them and you have the whole B-column:</p>'+
      '<div class="derivation"><div class="d-line">P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</div></div>'+
      '<h4>Why you are allowed to do it</h4>'+
      '<p>Because A and A&prime; <strong>partition</strong> the whole space &mdash; together they tile every room, with no overlap and nothing left out. So B&rsquo;s total mass is exactly the sum of B-inside-A and B-inside-A&prime;. Nothing is missed and nothing is counted twice; the partition <em>is</em> the permission.</p>'+
      '<div class="derivation"><div class="d-label">What each symbol means &mdash; in plain words</div>'+
      '<div class="d-line"><strong>P(A)</strong> / <strong>P(A&prime;)</strong> &mdash; the two lanes: the trait present, or absent (together they fill the house)</div>'+
      '<div class="d-line"><strong>P(B|A)</strong> &mdash; down the A-lane, the fraction that tests positive (true positives)</div>'+
      '<div class="d-line"><strong>P(B|A&prime;)</strong> &mdash; down the A&prime;-lane, the fraction that tests positive (false positives)</div>'+
      '<div class="d-line"><strong>P(B)</strong> &mdash; the answer: the whole B-column, both doors summed</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</p></div>';
  }

  function oppProcess(){
    return '<div class="step-content"><h3>Step 2 &mdash; Process: three moves to the whole column</h3>'+
      '<p>The same three moves you will walk with numbers in Step 4 &mdash; always in this order. The shape first, no numbers yet.</p>'+
      oppFviz(false)+
      '<div class="proc-block"><div class="proc-title">Procedure</div>'+
      '<div class="proc-step"><strong>Move 1 &mdash; Split the world by the prior.</strong> Into the A-lane P(A) and the A&prime;-lane P(A&prime;) = 1 &minus; P(A). <em>Why this piece:</em> B can only happen inside one lane or the other. <em>What it does to the space:</em> it cuts the whole house into two parts that tile it.</div>'+
      '<div class="proc-step"><strong>Move 2 &mdash; Send B down each lane.</strong> A-lane: P(B|A)&middot;P(A). A&prime;-lane: P(B|A&prime;)&middot;P(A&prime;). <em>Why this piece:</em> each lane lets through its own fraction of positives. <em>What it does to the space:</em> it fills the two rooms of the B-column &mdash; true positives and false positives.</div>'+
      '<div class="proc-step"><strong>Move 3 &mdash; Sum the two lanes.</strong> Add the two B-rooms. <em>Why this piece:</em> together they are every way B can occur. <em>What it does to the space:</em> it closes the B-column into a single wall, P(B).</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</p></div>';
  }

  function oppData(){
    return '<div class="step-content"><h3>Step 3 &mdash; The Data: three numbers, and how they light the house</h3>'+
      '<h4>What the problem hands you</h4>'+
      '<p>A total-probability problem hands you a <strong>prior</strong> and <strong>two conditionals</strong> &mdash; the same screening test &mdash; and trusts you to build both doors into B.</p>'+
      '<div class="data-card"><div class="data-title">A screening test</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) &mdash; the prior: how common the trait is</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A) &mdash; a true carrier testing positive</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;) &mdash; a healthy person testing positive (a false positive)</th><td>0.10</td></tr>'+
      '</table></div>'+
      '<p>One in five carry the trait, so the A-lane is worth P(A) = '+f(PA)+' and the far larger A&prime;-lane is worth P(A&prime;) = '+f(PNA)+'. Look up at the house: the two rooms in the B-column are the two doors &mdash; the top-left true-positive corner '+f(PAB)+', and the false-positive room below it '+f(PNAB)+'.</p>'+
      '<h4>Feel the tension before you solve</h4>'+
      '<p>The A&prime;-lane is four times the size of the A-lane. So even though its catch rate is small (just '+f(PBgNA)+'), it still drips a real '+f(PNAB)+' of false positives into the column &mdash; nearly half the size of the '+f(PAB)+' of true ones. A big lane with a small rate can rival a small lane with a big rate. That balance is the whole story.</p></div>';
  }

  function oppWalk(){
    return '<div class="step-content"><h3>Step 4 &mdash; Run the Formula: the whole column, piece by piece</h3>'+
      '<p>The three moves from the Process, now carrying the numbers from the filled house. Each piece stands on its own.</p>'+
      oppFviz(true)+
      '<div class="derivation"><div class="d-label">Move 1 &mdash; split the world by the prior</div>'+
      '<div class="d-line">P(A) = '+f(PA)+' &nbsp;&middot;&nbsp; P(A&prime;) = 1 &minus; '+f(PA)+' = <strong>'+f(PNA)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Move 2 &mdash; send B down each lane</div>'+
      '<div class="d-line">A-lane (true positives): &nbsp; P(B|A)&middot;P(A) = '+f(PBgA)+'&middot;'+f(PA)+' = <strong>'+f(PAB)+'</strong></div>'+
      '<div class="d-line">A&prime;-lane (false positives): &nbsp; P(B|A&prime;)&middot;P(A&prime;) = '+f(PBgNA)+'&middot;'+f(PNA)+' = <strong>'+f(PNAB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Move 3 &mdash; sum the two lanes</div>'+
      '<div class="d-line">P(B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="result-box"><div class="result-box-name">All of B &mdash; P(B)</div><div class="result-box-formula">P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</div><div class="result-box-value">P(B) = '+f(PB)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.oppsplitting.close+'</p></div>';
  }

  /* --- Deepened dispatch: every path routes through here --- */
  var DEEP = {
    addisjon:       { bp: addBlueprint,   pr: addProcess,   da: addData,   wk: addWalk },
    multiplikasjon: { bp: mulBlueprint,   pr: mulProcess,   da: mulData,   wk: mulWalk },
    oppsplitting:   { bp: oppBlueprint,   pr: oppProcess,   da: oppData,   wk: oppWalk },
    bayes:          { bp: bayesBlueprint, pr: bayesProcess, da: bayesData, wk: bayesWalk }
  };

  /* --- Generic renderers (kept as a safety fallback only) --- */
  function blueprintHTML(P){
    return '<div class="step-content"><h3>Step 1 &mdash; Blueprint: '+P.name+'</h3>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">'+P.formula+'</p></div>';
  }
  function processHTML(P){
    return '<div class="step-content"><h3>Step 2 &mdash; Process: '+P.name+'</h3>'+
      '<p style="color:var(--accent);font-weight:500">'+P.formula+'</p></div>';
  }
  function dataHTML(){
    return '<div class="step-content"><h3>Step 3 &mdash; The Data</h3>'+
      '<div class="data-card"><div class="data-title">A screening test</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A)</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A)</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;)</th><td>0.10</td></tr>'+
      '</table></div></div>';
  }
  function walkHTML(P){
    return '<div class="step-content"><h3>Step 4 &mdash; Run the Formula: '+P.name+'</h3>'+
      '<p style="color:var(--accent);font-weight:500">'+P.formula+'</p></div>';
  }

  /* --- Rendering --- */
  var activePath = null, step = 1;

  function setActiveStepBtn(){
    document.querySelectorAll('.step-nav .step-btn').forEach(function(b){
      b.classList.toggle('active', parseInt(b.getAttribute('data-step'),10)===step);
    });
  }

  function renderStep(){
    setActiveStepBtn();
    var host = document.getElementById('step-container');
    if(!host) return;
    if(!activePath){ host.innerHTML='<div class="step-content"><p style="color:var(--muted);font-style:italic">Pick a path above, then walk the four steps.</p></div>'; showLabels(); clearHL(); return; }
    var P = PATHS[activePath];
    var d = DEEP[activePath];
    if(step===1){ showLabels(); host.innerHTML = d ? d.bp() : blueprintHTML(P); }
    else if(step===2){ showLabels(); host.innerHTML = d ? d.pr() : processHTML(P); }
    else if(step===3){ fillHouse(); host.innerHTML = d ? d.da() : dataHTML(P); }
    else if(step===4){ fillHouse(); host.innerHTML = d ? d.wk() : walkHTML(P); }
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
