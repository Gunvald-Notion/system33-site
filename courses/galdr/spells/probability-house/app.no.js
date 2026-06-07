/* === PROBABILITY HOUSE (Kap 2 + 4) — Norwegian (plain Bokmal) staged engine ===
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

  /* --- Braced formula pieces --- */
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
      close:'Minst &eacute;n av de to inntreffer '+f(UNION*100)+'% av tiden. Hver bit ble lest rett av margene og det ene felles hj&oslash;rnet — og overlappet ble betalt tilbake n&oslash;yaktig &eacute;n gang.'
    },
    multiplikasjon: {
      name:'Multiplikasjon', kap:'Kap 4',
      formula:'P(A&cap;B) = P(A|B) &middot; P(B)',
      hl:['ab','pb','nab'],
      close:'Det felles rommet og den betingede sannsynligheten er to lesninger av det samme hj&oslash;rnet i huset — &eacute;n delt ned p&aring; kolonnen, &eacute;n ganget tilbake inn i den.'
    },
    oppsplitting: {
      name:'Oppsplitting', kap:'Kap 4',
      formula:'P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)',
      hl:['pa','pna','ab','nab','pb'],
      close:'B inntreffer '+f(PB*100)+'% av tiden totalt — mest de '+f(PAB)+' ekte tilfellene, pluss en tynn '+f(PNAB)+' med falske positive hentet fra den mye st&oslash;rre A&prime;-banen.'
    },
    bayes: {
      name:'Bayes', kap:'Kap 4',
      formula:'P(A|B) = P(B|A)&middot;P(A) / P(B)',
      hl:['ab','pa','pb','nab'],
      close:'Fellen eksamen elsker: en 90%-test, men et positivt svar betyr likevel bare rundt '+Math.round(PAgB*100)+'% — fordi egenskapen er sjelden, er den tynne falsk-positiv-banen nesten like stor som den ekte. Grunnraten bestemmer.'
    }
  };

  /* ============================================================
     BAYES
     ============================================================ */
  function bayesFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(A|B) =</span>'+
        pc(f(PBgA)+'&middot;'+f(PA)+' = '+f(PAB),'teller: ekte positive','o')+
        '<span class="formula-op">&divide;</span>'+
        pc(f(PAB)+' + '+f(PNAB)+' = '+f(PB),'nevner: alle positive','b')+
        '<span class="formula-op">&rarr;</span>'+
        pc('&asymp; '+f(PAgB),'vendingen','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(A|B) =</span>'+
      pc('P(B|A)&middot;P(A)','teller: ekte positive','o')+
      '<span class="formula-op">&divide;</span>'+
      pc('P(B)','nevner: alle positive','b')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(A|B)','vendingen','a')+'</div>';
  }

  function bayesBlueprint(){
    return '<div class="step-content"><h3>Steg 1 &mdash; Plantegning: f&oslash;rst rommet, s&aring; loven</h3>'+
      '<h4>Hvilket rom st&aring;r vi i?</h4>'+
      '<p>F&oslash;r en eneste formel, sl&aring; fast hvor du er — dette er steget de fleste hopper over, og det er nettopp derfor resten begynner &aring; f&oslash;les som magi i stedet for noe du bygger. <strong>Du er inne i &eacute;n hel verden, og den helheten er lik 1.</strong> Hver sannsynlighet her er en <em>andel</em> av den ene — aldri et l&oslash;st tall som flyter fritt, alltid en bit av helheten.</p>'+
      '<p>Huset <em>er</em> den helheten, delt opp i fire rom — P(A&cap;B), P(A&cap;B&prime;), P(A&prime;&cap;B), P(A&prime;&cap;B&prime;). De <strong>dekker hele rommet</strong>: ingenting faller utenfor dem, ingen av dem overlapper, og de summerer rett tilbake til 1. Margene nedover siden og langs toppen er bare ytterveggene — P(A) er hele raden lagt sammen, P(B) hele kolonnen. S&aring; den f&oslash;rste loven p&aring; dette stedet, f&oslash;r Bayes, f&oslash;r noe annet: <strong>ingenting du regner ut kan forlate huset. Hvert steg flytter bare masse som allerede summerer til 1.</strong></p>'+
      '<h4>Rommene bygges, de blir ikke gitt deg</h4>'+
      '<p>Her er vippepunktet de fleste g&aring;r glipp av. En celle som P(A&cap;B) er <em>ikke</em> et atom du bare f&aring;r utdelt — den er <strong>laget av</strong> biter av rommet. For &aring; bygge den st&aring;r du p&aring; en vegg og skj&aelig;rer ut en bit av den: P(A&cap;B) = P(B|A)&middot;P(A) — ta A-raden (verdt P(A) av helheten), behold den P(B|A)-andelen av den som ogs&aring; tester positivt. N&aring;r du ser at et rom er <em>en vegg ganget med en andel</em>, ser du hvordan hele huset <strong>fungerer</strong>: hver indre celle er en marg som er smalnet inn av en betinget sannsynlighet. Det er pr&oslash;ven — alltid &aring; vite hvilken vegg du st&aring;r p&aring;, og hvor stor andel av den du beholder.</p>'+
      '<h4>Hva loven er til for</h4>'+
      '<p>N&aring; selve sp&oslash;rsm&aring;let. Testen kom tilbake <strong>positiv</strong> (B), og du vil vite sjansen for at egenskapen faktisk er der (A) — P(A|B). Men laben m&aring;lte bare den ene veien, P(B|A): hvor ofte en ekte b&aelig;rer sl&aring;r ut p&aring; testen. <strong>Bayes er grepet som snur den forlengs-sjansen om til den baklengs du trenger</strong> — og den forlater aldri huset for &aring; gj&oslash;re det.</p>'+
      '<h4>Hvordan det virker</h4>'+
      '<p>Broen mellom forlengs og baklengs er det ene rommet de <em>deler</em>: P(A&cap;B), cellen &oslash;verst til venstre. Det ene rommet kan bygges gjennom to ulike vegger. Forlengs: P(B|A)&middot;P(A) — st&aring; i A-raden, behold de positive. Baklengs: P(A|B)&middot;P(B) — st&aring; i B-kolonnen, behold b&aelig;rerne. Samme rom, to d&oslash;rer — s&aring; de er like:</p>'+
      '<div class="derivation"><div class="d-line">P(B|A)&middot;P(A) &nbsp;=&nbsp; P(A&cap;B) &nbsp;=&nbsp; P(A|B)&middot;P(B)</div></div>'+
      '<p>L&oslash;s den likheten for den baklengs, og Bayes faller rett ut: <strong>P(A|B) = P(B|A)&middot;P(A) / P(B)</strong>.</p>'+
      '<h4>Hvorfor kan man gj&oslash;re dette?</h4>'+
      '<p>Fordi rommet er <strong>symmetrisk</strong> — &ldquo;A og B&rdquo; er det samme hj&oslash;rnet av rommet som &ldquo;B og A&rdquo;. Det felles rommet er vippepunktet som lar deg g&aring; inn gjennom hvilken som helst av de to veggene. Ingenting annet antas; likheten <em>er</em> tillatelsen, og den holder av &eacute;n eneste grunn — begge lesningene lander i n&oslash;yaktig samme bit av n&oslash;yaktig samme helhet.</p>'+
      '<div class="derivation"><div class="d-label">Hva hvert symbol betyr — med enkle ord</div>'+
      '<div class="d-line"><strong>A</strong> — har egenskapen (b&aelig;reren) &nbsp;&middot;&nbsp; <strong>A&prime;</strong> — har ikke egenskapen (frisk)</div>'+
      '<div class="d-line"><strong>B</strong> — tester positivt &nbsp;&middot;&nbsp; <strong>B&prime;</strong> — tester negativt</div>'+
      '<div class="d-line"><strong>P(A)</strong> — A-radveggen: hvor vanlig egenskapen er (grunnraten)</div>'+
      '<div class="d-line"><strong>P(B|A)</strong> — st&aring;ende i A-raden, andelen som tester positivt (treffraten)</div>'+
      '<div class="d-line"><strong>P(A&cap;B)</strong> — det ekte-positive rommet: har egenskapen OG tester positivt</div>'+
      '<div class="d-line"><strong>P(B)</strong> — B-kolonneveggen: alle som tester positivt (ekte + falske alarmer)</div>'+
      '<div class="d-line"><strong>P(A|B)</strong> — svaret: inne i B-kolonnen, andelen som virkelig b&aelig;rer egenskapen</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(A|B) = P(B|A)&middot;P(A) / P(B)</p></div>';
  }

  function bayesProcess(){
    return '<div class="step-content"><h3>Steg 2 &mdash; Prosess: tre steg som vender sjansen</h3>'+
      '<p>De samme tre stegene du g&aring;r gjennom med tall i Steg 4 — alltid i denne rekkef&oslash;lgen, hvert lener seg p&aring; huset det forrige bygde. Formen f&oslash;rst, ingen tall enn&aring;.</p>'+
      bayesFviz(false)+
      '<div class="proc-block"><div class="proc-title">Framgangsm&aring;te</div>'+
      '<div class="proc-step"><strong>Steg 1 — Bygg telleren: den ekte-positive cellen.</strong> P(B|A)&middot;P(A) = P(A&cap;B). <em>Hvorfor denne biten:</em> av alle de positive er de eneste du faktisk vil ha, b&aelig;rerne som riktig tester positivt — rommet &oslash;verst til venstre. <em>Hva den gj&oslash;r med rommet:</em> den folder forlengs-treffraten og grunnraten sammen til &eacute;n enkelt celle med masse.</div>'+
      '<div class="proc-step"><strong>Steg 2 — Bygg nevneren: hver positiv.</strong> P(B) = P(A&cap;B) + P(A&prime;&cap;B). <em>Hvorfor denne biten:</em> en positiv kan komme gjennom to d&oslash;rer — en ekte b&aelig;rer (ekte positiv), eller en frisk person testen feilaktig merker positiv (falsk positiv). Det baklengse sp&oslash;rsm&aring;let bor inne i hele verdenen av positive, s&aring; du m&aring; samle begge d&oslash;rene. <em>Hva den gj&oslash;r med rommet:</em> den krymper verdenen fra alle ned til B-kolonnen — alle som testet positivt.</div>'+
      '<div class="proc-step"><strong>Steg 3 — Del: den ekte biten av alle positive.</strong> P(A|B) = P(A&cap;B) / P(B). <em>Hvorfor denne biten:</em> inne i den krympede kolonnen av positive, hvor stor andel er virkelig b&aelig;rere? Den andelen <em>er</em> den baklengse sjansen. <em>Hva den gj&oslash;r med rommet:</em> den leser A sin tetthet inne i B-kolonnen — vendingen er fullf&oslash;rt.</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(A|B) = P(B|A)&middot;P(A) / P(B)</p></div>';
  }

  function bayesData(){
    return '<div class="step-content"><h3>Steg 3 &mdash; Dataene: tre tall, og hvordan de lyser opp huset</h3>'+
      '<h4>Hva oppgaven gir deg</h4>'+
      '<p>En Bayes-oppgave gir deg nesten aldri rommene i huset direkte. Den gir deg en <strong>utgangssannsynlighet</strong> og <strong>to betingede sannsynligheter</strong> — tre tall i ord — og stoler p&aring; at du bygger resten.</p>'+
      '<div class="data-card"><div class="data-title">En screeningtest</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) — utgangssannsynligheten: hvor vanlig egenskapen er</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A) — en ekte b&aelig;rer som tester positivt</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;) — en frisk person som tester positivt (en falsk positiv)</th><td>0.10</td></tr>'+
      '</table></div>'+
      '<p>Med ord: <strong>&eacute;n av fem</strong> personer b&aelig;rer egenskapen. Testen er god — n&aring;r noen virkelig b&aelig;rer den, fanger testen dem <strong>90%</strong> av tiden. Men den er ikke perfekt: av de friske kommer <strong>10%</strong> likevel tilbake som positive. Det er en <em>falsk positiv</em> — testen sier &ldquo;positiv&rdquo; p&aring; noen som ikke b&aelig;rer noe.</p>'+
      '<h4>Se n&aring; huset over fylles</h4>'+
      '<p>De tre tallene er nok, fordi hvert indre rom bare er en vegg ganget med en andel. Bygg de to rommene som sitter i <strong>B-kolonnen</strong> — de to m&aring;tene en positiv kan skje p&aring; — og les dem rett av de opplyste cellene:</p>'+
      '<div class="derivation"><div class="d-label">de to rommene i B-kolonnen</div>'+
      '<div class="d-line"><strong>rommet &o