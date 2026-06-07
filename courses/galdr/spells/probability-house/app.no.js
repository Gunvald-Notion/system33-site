/* === PROBABILITY HOUSE (Kap 2 + 4) — Norwegian (plain Bokmal) staged engine === */
(function(){
  'use strict';

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

  var PATHS = {
    addisjon: {
      name:'Addisjon', kap:'Kap 2',
      formula:'P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)',
      hl:['pa','pb','ab','anb','nab'],
      close:'Minst én av de to inntreffer '+f(UNION*100)+'% av tiden. Hver bit ble lest rett av margene og det ene felles hjørnet — og overlappet ble betalt tilbake nøyaktig én gang.'
    },
    multiplikasjon: {
      name:'Multiplikasjon', kap:'Kap 4',
      formula:'P(A&cap;B) = P(A|B) &middot; P(B)',
      hl:['ab','pb','nab'],
      close:'Det felles rommet og den betingede sannsynligheten er to lesninger av det samme hjørnet i huset — én delt ned på kolonnen, én ganget tilbake inn i den.'
    },
    oppsplitting: {
      name:'Oppsplitting', kap:'Kap 4',
      formula:'P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)',
      hl:['pa','pna','ab','nab','pb'],
      close:'B inntreffer '+f(PB*100)+'% av tiden totalt — mest de '+f(PAB)+' ekte tilfellene, pluss en tynn '+f(PNAB)+' med falske positive hentet fra den mye større A&prime;-banen.'
    },
    bayes: {
      name:'Bayes', kap:'Kap 4',
      formula:'P(A|B) = P(B|A)&middot;P(A) / P(B)',
      hl:['ab','pa','pb','nab'],
      close:'Fellen eksamen elsker: en 90%-test, men et positivt svar betyr likevel bare rundt '+Math.round(PAgB*100)+'% — fordi egenskapen er sjelden, er den tynne falsk-positiv-banen nesten like stor som den ekte. Grunnraten bestemmer.'
    }
  };

  /* === BAYES === */
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
    return '<div class="step-content"><h3>Steg 1 — Plantegning: først rommet, så loven</h3>'+
      '<h4>Hvilket rom står vi i?</h4>'+
      '<p>Før en eneste formel, slå fast hvor du er — dette er steget de fleste hopper over, og det er nettopp derfor resten begynner å føles som magi i stedet for noe du bygger. <strong>Du er inne i én hel verden, og den helheten er lik 1.</strong> Hver sannsynlighet her er en <em>andel</em> av den ene — aldri et løst tall som flyter fritt, alltid en bit av helheten.</p>'+
      '<p>Huset <em>er</em> den helheten, delt opp i fire rom — P(A&cap;B), P(A&cap;B&prime;), P(A&prime;&cap;B), P(A&prime;&cap;B&prime;). De <strong>dekker hele rommet</strong>: ingenting faller utenfor dem, ingen av dem overlapper, og de summerer rett tilbake til 1. Margene nedover siden og langs toppen er bare ytterveggene — P(A) er hele raden lagt sammen, P(B) hele kolonnen. Så den første loven på dette stedet, før Bayes, før noe annet: <strong>ingenting du regner ut kan forlate huset. Hvert steg flytter bare masse som allerede summerer til 1.</strong></p>'+
      '<h4>Rommene bygges, de blir ikke gitt deg</h4>'+
      '<p>Her er vippepunktet de fleste går glipp av. En celle som P(A&cap;B) er <em>ikke</em> et atom du bare får utdelt — den er <strong>laget av</strong> biter av rommet. For å bygge den står du på en vegg og skjærer ut en bit av den: P(A&cap;B) = P(B|A)&middot;P(A) — ta A-raden (verdt P(A) av helheten), behold den P(B|A)-andelen av den som også tester positivt. Når du ser at et rom er <em>en vegg ganget med en andel</em>, ser du hvordan hele huset <strong>fungerer</strong>: hver indre celle er en marg som er smalnet inn av en betinget sannsynlighet. Det er prøven — alltid å vite hvilken vegg du står på, og hvor stor andel av den du beholder.</p>'+
      '<h4>Hva loven er til for</h4>'+
      '<p>Nå selve spørsmålet. Testen kom tilbake <strong>positiv</strong> (B), og du vil vite sjansen for at egenskapen faktisk er der (A) — P(A|B). Men laben målte bare den ene veien, P(B|A): hvor ofte en ekte bærer slår ut på testen. <strong>Bayes er grepet som snur den forlengs-sjansen om til den baklengs du trenger</strong> — og den forlater aldri huset for å gjøre det.</p>'+
      '<h4>Hvordan det virker</h4>'+
      '<p>Broen mellom forlengs og baklengs er det ene rommet de <em>deler</em>: P(A&cap;B), cellen øverst til venstre. Det ene rommet kan bygges gjennom to ulike vegger. Forlengs: P(B|A)&middot;P(A) — stå i A-raden, behold de positive. Baklengs: P(A|B)&middot;P(B) — stå i B-kolonnen, behold bærerne. Samme rom, to dører — så de er like:</p>'+
      '<div class="derivation"><div class="d-line">P(B|A)&middot;P(A) &nbsp;=&nbsp; P(A&cap;B) &nbsp;=&nbsp; P(A|B)&middot;P(B)</div></div>'+
      '<p>Løs den likheten for den baklengs, og Bayes faller rett ut: <strong>P(A|B) = P(B|A)&middot;P(A) / P(B)</strong>.</p>'+
      '<h4>Hvorfor kan man gjøre dette?</h4>'+
      '<p>Fordi rommet er <strong>symmetrisk</strong> — “A og B” er det samme hjørnet av rommet som “B og A”. Det felles rommet er vippepunktet som lar deg gå inn gjennom hvilken som helst av de to veggene. Ingenting annet antas; likheten <em>er</em> tillatelsen, og den holder av én eneste grunn — begge lesningene lander i nøyaktig samme bit av nøyaktig samme helhet.</p>'+
      '<div class="derivation"><div class="d-label">Hva hvert symbol betyr — med enkle ord</div>'+
      '<div class="d-line"><strong>A</strong> — har egenskapen (bæreren) &nbsp;&middot;&nbsp; <strong>A&prime;</strong> — har ikke egenskapen (frisk)</div>'+
      '<div class="d-line"><strong>B</strong> — tester positivt &nbsp;&middot;&nbsp; <strong>B&prime;</strong> — tester negativt</div>'+
      '<div class="d-line"><strong>P(A)</strong> — A-radveggen: hvor vanlig egenskapen er (grunnraten)</div>'+
      '<div class="d-line"><strong>P(B|A)</strong> — stående i A-raden, andelen som tester positivt (treffraten)</div>'+
      '<div class="d-line"><strong>P(A&cap;B)</strong> — det ekte-positive rommet: har egenskapen OG tester positivt</div>'+
      '<div class="d-line"><strong>P(B)</strong> — B-kolonneveggen: alle som tester positivt (ekte + falske alarmer)</div>'+
      '<div class="d-line"><strong>P(A|B)</strong> — svaret: inne i B-kolonnen, andelen som virkelig bærer egenskapen</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(A|B) = P(B|A)&middot;P(A) / P(B)</p></div>';
  }

  function bayesProcess(){
    return '<div class="step-content"><h3>Steg 2 — Prosess: tre steg som vender sjansen</h3>'+
      '<p>De samme tre stegene du går gjennom med tall i Steg 4 — alltid i denne rekkefølgen, hvert lener seg på huset det forrige bygde. Formen først, ingen tall ennå.</p>'+
      bayesFviz(false)+
      '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
      '<div class="proc-step"><strong>Steg 1 — Bygg telleren: den ekte-positive cellen.</strong> P(B|A)&middot;P(A) = P(A&cap;B). <em>Hvorfor denne biten:</em> av alle de positive er de eneste du faktisk vil ha, bærerne som riktig tester positivt — rommet øverst til venstre. <em>Hva den gjør med rommet:</em> den folder forlengs-treffraten og grunnraten sammen til én enkelt celle med masse.</div>'+
      '<div class="proc-step"><strong>Steg 2 — Bygg nevneren: hver positiv.</strong> P(B) = P(A&cap;B) + P(A&prime;&cap;B). <em>Hvorfor denne biten:</em> en positiv kan komme gjennom to dører — en ekte bærer (ekte positiv), eller en frisk person testen feilaktig merker positiv (falsk positiv). Det baklengse spørsmålet bor inne i hele verdenen av positive, så du må samle begge dørene. <em>Hva den gjør med rommet:</em> den krymper verdenen fra alle ned til B-kolonnen — alle som testet positivt.</div>'+
      '<div class="proc-step"><strong>Steg 3 — Del: den ekte biten av alle positive.</strong> P(A|B) = P(A&cap;B) / P(B). <em>Hvorfor denne biten:</em> inne i den krympede kolonnen av positive, hvor stor andel er virkelig bærere? Den andelen <em>er</em> den baklengse sjansen. <em>Hva den gjør med rommet:</em> den leser A sin tetthet inne i B-kolonnen — vendingen er fullført.</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(A|B) = P(B|A)&middot;P(A) / P(B)</p></div>';
  }

  function bayesData(){
    return '<div class="step-content"><h3>Steg 3 — Dataene: tre tall, og hvordan de lyser opp huset</h3>'+
      '<h4>Hva oppgaven gir deg</h4>'+
      '<p>En Bayes-oppgave gir deg nesten aldri rommene i huset direkte. Den gir deg en <strong>utgangssannsynlighet</strong> og <strong>to betingede sannsynligheter</strong> — tre tall i ord — og stoler på at du bygger resten.</p>'+
      '<div class="data-card"><div class="data-title">En screeningtest</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) — utgangssannsynligheten: hvor vanlig egenskapen er</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A) — en ekte bærer som tester positivt</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;) — en frisk person som tester positivt (en falsk positiv)</th><td>0.10</td></tr>'+
      '</table></div>'+
      '<p>Med ord: <strong>én av fem</strong> personer bærer egenskapen. Testen er god — når noen virkelig bærer den, fanger testen dem <strong>90%</strong> av tiden. Men den er ikke perfekt: av de friske kommer <strong>10%</strong> likevel tilbake som positive. Det er en <em>falsk positiv</em> — testen sier “positiv” på noen som ikke bærer noe.</p>'+
      '<h4>Se nå huset over fylles</h4>'+
      '<p>De tre tallene er nok, fordi hvert indre rom bare er en vegg ganget med en andel. Bygg de to rommene som sitter i <strong>B-kolonnen</strong> — de to måtene en positiv kan skje på — og les dem rett av de opplyste cellene:</p>'+
      '<div class="derivation"><div class="d-label">de to rommene i B-kolonnen</div>'+
      '<div class="d-line"><strong>rommet øverst til venstre</strong> — ekte positive: &nbsp; P(A&cap;B) = P(B|A)&middot;P(A) = '+f(PBgA)+'&middot;'+f(PA)+' = <strong>'+f(PAB)+'</strong></div>'+
      '<div class="d-line"><strong>rommet rett under</strong> — falske positive: &nbsp; P(A&prime;&cap;B) = P(B|A&prime;)&middot;P(A&prime;) = '+f(PBgNA)+'&middot;'+f(PNA)+' = <strong>'+f(PNAB)+'</strong></div>'+
      '</div>'+
      '<p>Stable de to rommene oppå hverandre, og du har hele <strong>B-kolonneveggen</strong>: P(B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong>. Resten av huset lukker seg selv ved bevaring — hver rad og kolonne summerer til margen sin, og det hele tilbake til 1.</p>'+
      '<h4>Ett rom, lest forlengs og baklengs</h4>'+
      '<p>Se opp på rommet øverst til venstre, P(A&cap;B) = '+f(PAB)+'. Vi bygde det nettopp <em>forlengs</em> — ned fra A-raden, P(B|A)&middot;P(A). I Steg 4 leser vi det samme rommet <em>baklengs</em> — på tvers fra B-kolonnen, og deler det på P(B) for å lande på P(A|B). Samme '+f(PAB)+' med masse, to retninger gjennom én dør. Det ene rommet, lest begge veier, <em>er</em> hele vendingen — alt annet er bare å bygge veggene det sitter mellom.</p>'+
      '<h4>Kjenn spenningen før du løser</h4>'+
      '<p>Egenskapen er <em>sjelden</em> — bare '+f(PA)+' av huset sitter i A-raden, mot '+f(PNA)+' i den langt større A&prime;-raden. Så selv en skarp test drar en ekte mengde falske positive ('+f(PNAB)+') opp mot de ekte ('+f(PAB)+'). Hold fast på det — det er hele grunnen til at svaret i Steg 4 lander lavere enn magefølelsen din venter.</p></div>';
  }

  function bayesWalk(){
    return '<div class="step-content"><h3>Steg 4 — Kjør formelen: vendingen, bit for bit</h3>'+
      '<p>De tre stegene fra Prosessen, nå med tallene fra det fylte huset. Hver bit under står på egne bein — hva den er, formelen, regnestykket, verdien — ingenting som peker bort til et annet rom.</p>'+
      bayesFviz(true)+
      '<div class="derivation"><div class="d-label">Steg 1 — teller: den ekte-positive cellen</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">Bærere som riktig tester positivt — har egenskapen (A) <em>og</em> tester positivt (B). Rommet øverst til venstre.</div>'+
      '<div class="d-line">P(B|A)&middot;P(A) = '+f(PBgA)+'&middot;'+f(PA)+' = <strong>'+f(PAB)+'</strong> &nbsp;=&nbsp; P(A&cap;B)</div></div>'+
      '<div class="derivation"><div class="d-label">Steg 2 — nevner: alle som tester positivt</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">En positiv kommer på to måter. Bygg begge dørene rett her — ingen grunn til å forlate for et annet rom.</div>'+
      '<div class="d-line">ekte positive: &nbsp; P(A&cap;B) = <strong>'+f(PAB)+'</strong></div>'+
      '<div class="d-line">falske positive: &nbsp; P(A&prime;&cap;B) = P(B|A&prime;)&middot;P(A&prime;) = '+f(PBgNA)+'&middot;'+f(PNA)+' = <strong>'+f(PNAB)+'</strong></div>'+
      '<div class="d-line">P(B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Steg 3 — del: den ekte biten av alle positive</div>'+
      '<div class="d-line">P(A|B) = P(A&cap;B) / P(B) = '+f(PAB)+' / '+f(PB)+' &asymp; <strong>'+f(PAgB)+'</strong></div></div>'+
      '<div class="result-box"><div class="result-box-name">Vendingen — P(A|B)</div><div class="result-box-formula">P(B|A)&middot;P(A) / P(B)</div><div class="result-box-value">P(A|B) &asymp; '+f(PAgB)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.bayes.close+'</p></div>';
  }

  /* === ADDISJON === */
  function addFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(A&cup;B) =</span>'+
        pc(f(PA),'hele A-raden','b')+
        '<span class="formula-op">+</span>'+
        pc(f(PB),'hele B-kolonnen','b')+
        '<span class="formula-op">&minus;</span>'+
        pc(f(PAB),'felles hjørne, talt to ganger','o')+
        '<span class="formula-op">&rarr;</span>'+
        pc('= '+f(UNION),'minst én','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(A&cup;B) =</span>'+
      pc('P(A)','hele A-raden','b')+
      '<span class="formula-op">+</span>'+
      pc('P(B)','hele B-kolonnen','b')+
      '<span class="formula-op">&minus;</span>'+
      pc('P(A&cap;B)','felles hjørne, talt to ganger','o')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(A&cup;B)','minst én','a')+'</div>';
  }

  function addBlueprint(){
    return '<div class="step-content"><h3>Steg 1 — Plantegning: først rommet, så loven</h3>'+
      '<h4>Hvilket rom står vi i?</h4>'+
      '<p>Før en eneste formel, slå fast hvor du er. <strong>Du er inne i én hel verden, og den helheten er lik 1.</strong> Huset er den helheten, delt opp i fire rom — P(A&cap;B), P(A&cap;B&prime;), P(A&prime;&cap;B), P(A&prime;&cap;B&prime;) — som dekker det fullstendig: ingenting utenfor, ingen overlapp, alt summerer tilbake til 1. Margene er ytterveggene: P(A) er hele raden lagt sammen, P(B) hele kolonnen. Addisjon-spørsmålet bor <em>på tvers</em> av huset — hvert rom som A eller B berører.</p>'+
      '<h4>Rommene bygges, de blir ikke gitt deg</h4>'+
      '<p>Veggene selv er summer av rom. P(A) = P(A&cap;B) + P(A&cap;B&prime;) — A-raden er sine to rom stablet. P(B) = P(A&cap;B) + P(A&prime;&cap;B) på samme måte. Hold fast på det, for det er hele grunnen til at unionen krever varsomhet: hjørnerommet P(A&cap;B) bor inne i <em>både</em> A-raden og B-kolonnen samtidig.</p>'+
      '<h4>Hva loven er til for</h4>'+
      '<p>Spørsmålet: hva er sjansen for at <strong>minst én</strong> av A eller B skjer — P(A&cup;B)? Du samler hvert rom de to hendelsene berører: unionen av A-raden og B-kolonnen.</p>'+
      '<h4>Hvordan det virker</h4>'+
      '<p>Ta hele A-raden, P(A). Ta hele B-kolonnen, P(B). Legg dem sammen — men det felles hjørnet P(A&cap;B) satt inne i begge takene, så det ble nettopp talt <strong>to ganger</strong>. Trekk det fra igjen én gang, og hvert rom telles nøyaktig én gang:</p>'+
      '<div class="derivation"><div class="d-line">P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)</div></div>'+
      '<h4>Hvorfor kan man gjøre dette?</h4>'+
      '<p>Fordi unionen er nøyaktig mengden av rom som berøres av A eller B, og hvert rom må telle med én gang — ikke mer, ikke mindre. Å legge sammen de to veggene dobbelteller bare overlappet; å fjerne det én gang setter hvert rom tilbake til én telling. Det er inklusjon&ndash;eksklusjon, og det holder av ingen dypere grunn enn at rommene summerer ærlig til seg selv.</p>'+
      '<div class="derivation"><div class="d-label">Hva hvert symbol betyr — med enkle ord</div>'+
      '<div class="d-line"><strong>P(A)</strong> — A-radveggen: hvert rom der A inntreffer</div>'+
      '<div class="d-line"><strong>P(B)</strong> — B-kolonneveggen: hvert rom der B inntreffer</div>'+
      '<div class="d-line"><strong>P(A&cap;B)</strong> — det felles hjørnet: der A og B inntreffer sammen</div>'+
      '<div class="d-line"><strong>P(A&cup;B)</strong> — svaret: hvert rom der minst én inntreffer</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)</p></div>';
  }

  function addProcess(){
    return '<div class="step-content"><h3>Steg 2 — Prosess: tre steg til unionen</h3>'+
      '<p>De samme tre stegene du går gjennom med tall i Steg 4 — alltid i denne rekkefølgen. Formen først, ingen tall ennå.</p>'+
      addFviz(false)+
      '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
      '<div class="proc-step"><strong>Steg 1 — Samle hele A-raden.</strong> Les P(A) av radmargen. <em>Hvorfor denne biten:</em> den er hvert rom der A inntreffer. <em>Hva den gjør med rommet:</em> den faller A-raden sammen til én enkelt vegg med masse.</div>'+
      '<div class="proc-step"><strong>Steg 2 — Samle hele B-kolonnen.</strong> Les P(B) av kolonnemargen. <em>Hvorfor denne biten:</em> den er hvert rom der B inntreffer. <em>Hva den gjør med rommet:</em> den faller B-kolonnen sammen til én enkelt vegg.</div>'+
      '<div class="proc-step"><strong>Steg 3 — Trekk fra det felles hjørnet én gang.</strong> &minus; P(A&cap;B). <em>Hvorfor denne biten:</em> det hjørnet satt inne i begge veggene, så å legge dem sammen talte det to ganger. <em>Hva den gjør med rommet:</em> den fjerner dobbeltellingen, og lar hvert rom stå med nøyaktig én stemme.</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)</p></div>';
  }

  function addData(){
    return '<div class="step-content"><h3>Steg 3 — Dataene: les det av det opplyste huset</h3>'+
      '<h4>Hva oppgaven gir deg</h4>'+
      '<p>Den samme screeningtesten fyller huset — en utgangssannsynlighet og to betingede sannsynligheter — og fra dem bygges hvert rom og hver vegg. For unionen trenger du bare tre ting fra det opplyste huset: A-radveggen, B-kolonneveggen og det felles hjørnet.</p>'+
      '<div class="data-card"><div class="data-title">Les av det fylte huset</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) — hele A-raden</th><td>'+f(PA)+'</td></tr>'+
      '<tr><th>P(B) — hele B-kolonnen</th><td>'+f(PB)+'</td></tr>'+
      '<tr><th>P(A&cap;B) — det felles hjørnet</th><td>'+f(PAB)+'</td></tr>'+
      '</table></div>'+
      '<p>Se opp på huset: A-radmargen viser '+f(PA)+', B-kolonnemargen viser '+f(PB)+', og rommet øverst til venstre de deler viser '+f(PAB)+'. Legg merke til at hjørnet allerede sitter <em>inne i</em> begge margene — det er dobbeltellingen som venter på å skje.</p>'+
      '<h4>Kjenn spenningen før du løser</h4>'+
      '<p>Det felles hjørnet ('+f(PAB)+') er stort ved siden av veggene — mesteparten av A-raden <em>er</em> det hjørnet. Så hvis du bare la sammen P(A) + P(B) og stoppet, ville du bomme høyt over. Hele håndverket i unionen er å betale det overlappet tilbake nøyaktig én gang.</p></div>';
  }

  function addWalk(){
    return '<div class="step-content"><h3>Steg 4 — Kjør formelen: unionen, bit for bit</h3>'+
      '<p>De tre stegene fra Prosessen, nå med tallene fra det fylte huset. Hver bit står på egne bein.</p>'+
      addFviz(true)+
      '<div class="derivation"><div class="d-label">Steg 1 — hele A-raden</div>'+
      '<div class="d-line">P(A) = P(A&cap;B) + P(A&cap;B&prime;) = '+f(PAB)+' + '+f(PANB)+' = <strong>'+f(PA)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Steg 2 — hele B-kolonnen</div>'+
      '<div class="d-line">P(B) = P(A&cap;B) + P(A&prime;&cap;B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Steg 3 — trekk fra det felles hjørnet én gang</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">Det ble talt inne i begge veggene over, så betal det tilbake nøyaktig én gang.</div>'+
      '<div class="d-line">P(A&cup;B) = '+f(PA)+' + '+f(PB)+' &minus; '+f(PAB)+'</div></div>'+
      '<div class="result-box"><div class="result-box-name">Unionen — P(A&cup;B)</div><div class="result-box-formula">P(A) + P(B) &minus; P(A&cap;B)</div><div class="result-box-value">P(A&cup;B) = '+f(UNION)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.addisjon.close+'</p></div>';
  }

  /* === MULTIPLIKASJON === */
  function mulFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(A&cap;B) =</span>'+
        pc('&asymp; '+f(PAgB),'A sin andel inne i B','o')+
        '<span class="formula-op">&times;</span>'+
        pc(f(PB),'B-kolonneverdenen','b')+
        '<span class="formula-op">&rarr;</span>'+
        pc('&asymp; '+f(PAB),'det felles rommet','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(A&cap;B) =</span>'+
      pc('P(A|B)','A sin andel inne i B','o')+
      '<span class="formula-op">&times;</span>'+
      pc('P(B)','B-kolonneverdenen','b')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(A&cap;B)','det felles rommet','a')+'</div>';
  }

  function mulBlueprint(){
    return '<div class="step-content"><h3>Steg 1 — Plantegning: først rommet, så loven</h3>'+
      '<h4>Hvilket rom står vi i?</h4>'+
      '<p>Før en eneste formel, slå fast hvor du er. <strong>Du er inne i én hel verden verdt 1</strong>, delt opp i fire rom som dekker den — ingen overlapp, ingenting utenfor, alt summerer til 1. Margene er ytterveggene. Multiplikasjon-spørsmålet bor i ett enkelt rom: hjørnet øverst til venstre, P(A&cap;B), der A og B skjer <em>sammen</em>.</p>'+
      '<h4>Rommene bygges, de blir ikke gitt deg</h4>'+
      '<p>Her er vippepunktet. Det felles rommet P(A&cap;B) er ikke et atom — det er <strong>en vegg smalnet inn av en andel</strong>. Stå i B-kolonnen (verdt P(B)) og behold bare A sin andel av den, P(A|B). Det produktet bygger rommet: P(A&cap;B) = P(A|B)&middot;P(B). En betinget sannsynlighet ganget med en marg.</p>'+
      '<h4>Hva loven er til for</h4>'+
      '<p>Spørsmålet: hvor mye sannsynlighet lander i <strong>både</strong> A og B på én gang? Du bygger rommet øverst til venstre fra en betinget sannsynlighet og veggen det hviler mot.</p>'+
      '<h4>Hvordan det virker</h4>'+
      '<p>Betinge på B — B-kolonnen blir hele verdenen et øyeblikk, verdt P(B). Inne i den krympede verdenen er P(A|B) tettheten til A. Gang den tettheten tilbake med størrelsen på verdenen den bodde i, og du er tilbake i hele huset med det felles rommet fylt:</p>'+
      '<div class="derivation"><div class="d-line">P(A|B) = P(A&cap;B) / P(B) &nbsp;&rArr;&nbsp; P(A&cap;B) = P(A|B)&middot;P(B)</div></div>'+
      '<h4>Hvorfor kan man gjøre dette?</h4>'+
      '<p>Fordi det å betinge bare er omskalering. P(A|B) er <em>definert</em> som det felles delt på kolonnen — A sin masse målt mot den krympede verdenen. Å gange med P(B) opphever rett og slett den omskaleringen og setter massen tilbake i hele huset. Definisjonen <em>er</em> tillatelsen.</p>'+
      '<div class="derivation"><div class="d-label">Hva hvert symbol betyr — med enkle ord</div>'+
      '<div class="d-line"><strong>P(B)</strong> — B-kolonneveggen: den krympede verdenen når vi betinger på B</div>'+
      '<div class="d-line"><strong>P(A|B)</strong> — inne i den verdenen, A sin andel (tettheten i B-kolonnen)</div>'+
      '<div class="d-line"><strong>P(A&cap;B)</strong> — det felles rommet: A og B sammen, hjørnet øverst til venstre</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(A&cap;B) = P(A|B)&middot;P(B)</p></div>';
  }

  function mulProcess(){
    return '<div class="step-content"><h3>Steg 2 — Prosess: tre steg til det felles rommet</h3>'+
      '<p>De samme tre stegene du går gjennom med tall i Steg 4 — alltid i denne rekkefølgen. Formen først, ingen tall ennå.</p>'+
      mulFviz(false)+
      '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
      '<div class="proc-step"><strong>Steg 1 — Krymp verdenen til B.</strong> Betinge på B. <em>Hvorfor denne biten:</em> vi bryr oss bare om hjørnet der B allerede holder. <em>Hva den gjør med rommet:</em> B-kolonnen blir hele verdenen, verdt P(B).</div>'+
      '<div class="proc-step"><strong>Steg 2 — Mål A inne i den.</strong> P(A|B) = P(A&cap;B) / P(B). <em>Hvorfor denne biten:</em> inne i den krympede verdenen er dette A sin andel. <em>Hva den gjør med rommet:</em> den leser A sin tetthet mot B-kolonnen i stedet for hele huset.</div>'+
      '<div class="proc-step"><strong>Steg 3 — Gang tilbake.</strong> P(A&cap;B) = P(A|B)&middot;P(B). <em>Hvorfor denne biten:</em> tettheten alene er målt mot en verden av feil størrelse; skaler den opp igjen. <em>Hva den gjør med rommet:</em> den returnerer massen til hele huset, og fyller det felles rommet.</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(A&cap;B) = P(A|B)&middot;P(B)</p></div>';
  }

  function mulData(){
    return '<div class="step-content"><h3>Steg 3 — Dataene: les det av det opplyste huset</h3>'+
      '<h4>Hva oppgaven gir deg</h4>'+
      '<p>Det samme fylte huset gir deg begge bitene. For det felles rommet trenger du B-kolonneveggen og A sin andel inne i den — lest rett av de opplyste cellene.</p>'+
      '<div class="data-card"><div class="data-title">Les av det fylte huset</div>'+
      '<table class="data-table">'+
      '<tr><th>P(B) — B-kolonneveggen (den krympede verdenen)</th><td>'+f(PB)+'</td></tr>'+
      '<tr><th>P(A|B) — A sin andel inne i B-kolonnen</th><td>&asymp; '+f(PAgB)+'</td></tr>'+
      '</table></div>'+
      '<p>Se opp på huset: B-kolonnemargen viser '+f(PB)+'. Inne i den kolonnen sitter to rom — det ekte-positive hjørnet P(A&cap;B) = '+f(PAB)+' og rommet under det P(A&prime;&cap;B) = '+f(PNAB)+'. A sin andel av kolonnen er '+f(PAB)+' / '+f(PB)+' &asymp; '+f(PAgB)+'.</p>'+
      '<h4>Kjenn spenningen før du løser</h4>'+
      '<p>A sin andel <em>inne i</em> B ('+f(PAgB)+') er langt større enn A sin andel av hele huset (P(A) = '+f(PA)+'). Det spranget er betinging i arbeid — når du vet at B skjedde, krympet verdenen til en kolonne der A er mye tettere. Å gange tilbake med kolonnens ekte størrelse fører det ærlig tilbake til '+f(PAB)+'.</p></div>';
  }

  function mulWalk(){
    return '<div class="step-content"><h3>Steg 4 — Kjør formelen: det felles rommet, bit for bit</h3>'+
      '<p>De tre stegene fra Prosessen, nå med tallene fra det fylte huset. Hver bit står på egne bein.</p>'+
      mulFviz(true)+
      '<div class="derivation"><div class="d-label">Steg 1 — krymp til B-kolonnen</div>'+
      '<div class="d-line" style="color:var(--text2);margin-bottom:6px">Betinge på B: kolonnen er hele verdenen nå.</div>'+
      '<div class="d-line">P(B) = P(A&cap;B) + P(A&prime;&cap;B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Steg 2 — A sin andel inne i B</div>'+
      '<div class="d-line">P(A|B) = P(A&cap;B) / P(B) = '+f(PAB)+' / '+f(PB)+' &asymp; <strong>'+f(PAgB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Steg 3 — gang tilbake inn i hele huset</div>'+
      '<div class="d-line">P(A&cap;B) = P(A|B)&middot;P(B) = '+f(PAgB)+' &middot; '+f(PB)+' &asymp; <strong>'+f(PAB)+'</strong></div></div>'+
      '<div class="result-box"><div class="result-box-name">Det felles rommet — P(A&cap;B)</div><div class="result-box-formula">P(A|B)&middot;P(B)</div><div class="result-box-value">P(A&cap;B) = '+f(PAB)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.multiplikasjon.close+'</p></div>';
  }

  /* === OPPSPLITTING === */
  function oppFviz(filled){
    if(filled){
      return '<div class="formula-viz"><span class="formula-lhs">P(B) =</span>'+
        pc(f(PBgA)+'&middot;'+f(PA)+' = '+f(PAB),'via A-banen','o')+
        '<span class="formula-op">+</span>'+
        pc(f(PBgNA)+'&middot;'+f(PNA)+' = '+f(PNAB),'via A&prime;-banen','b')+
        '<span class="formula-op">&rarr;</span>'+
        pc('= '+f(PB),'hele B','a')+'</div>';
    }
    return '<div class="formula-viz"><span class="formula-lhs">P(B) =</span>'+
      pc('P(B|A)&middot;P(A)','via A-banen','o')+
      '<span class="formula-op">+</span>'+
      pc('P(B|A&prime;)&middot;P(A&prime;)','via A&prime;-banen','b')+
      '<span class="formula-op">&rarr;</span>'+
      pc('P(B)','hele B','a')+'</div>';
  }

  function oppBlueprint(){
    return '<div class="step-content"><h3>Steg 1 — Plantegning: først rommet, så loven</h3>'+
      '<h4>Hvilket rom står vi i?</h4>'+
      '<p>Før en eneste formel, slå fast hvor du er. <strong>Du er inne i én hel verden verdt 1</strong>, delt opp i fire rom som dekker den — ingen overlapp, ingenting utenfor, alt summerer til 1. Oppsplitting-spørsmålet bor i B-kolonnen — men det når den kolonnen ved først å dele hele huset i to.</p>'+
      '<h4>Rommene bygges, de blir ikke gitt deg</h4>'+
      '<p>De to rommene i B-kolonnen er hver en banes rate ganget med basen sin. Det ekte-positive hjørnet: P(A&cap;B) = P(B|A)&middot;P(A). Rommet under det: P(A&prime;&cap;B) = P(B|A&prime;)&middot;P(A&prime;). Hvert er en vegg (en bane) smalnet inn av en andel (treffraten sin). Bygg begge, og du har hele kolonnen.</p>'+
      '<h4>Hva loven er til for</h4>'+
      '<p>Spørsmålet: hva er den samlede sjansen for B, når B kan komme gjennom <strong>to ulike dører</strong> — via A, eller via A&prime;? Dette er loven du griper til når oppgaven gir deg en utgangssannsynlighet og to betingede sannsynligheter. Du ender i P(B).</p>'+
      '<h4>Hvordan det virker</h4>'+
      '<p>Utgangssannsynligheten kutter huset i to baner som dekker det perfekt: A-banen (verdt P(A)) og A&prime;-banen (verdt P(A&prime;) = 1 &minus; P(A)). Send B ned hver bane — behold P(B|A) av den første, P(B|A&prime;) av den andre — og de to B-rommene dukker opp. Summer dem, og du har hele B-kolonnen:</p>'+
      '<div class="derivation"><div class="d-line">P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</div></div>'+
      '<h4>Hvorfor kan man gjøre dette?</h4>'+
      '<p>Fordi A og A&prime; <strong>deler opp</strong> hele rommet — sammen dekker de hvert rom, uten overlapp og uten at noe blir igjen. Så B sin totale masse er nøyaktig summen av B-inne-i-A og B-inne-i-A&prime;. Ingenting blir oversett og ingenting telles to ganger; oppdelingen <em>er</em> tillatelsen.</p>'+
      '<div class="derivation"><div class="d-label">Hva hvert symbol betyr — med enkle ord</div>'+
      '<div class="d-line"><strong>P(A)</strong> / <strong>P(A&prime;)</strong> — de to banene: egenskapen til stede, eller fraværende (sammen fyller de huset)</div>'+
      '<div class="d-line"><strong>P(B|A)</strong> — ned A-banen, andelen som tester positivt (ekte positive)</div>'+
      '<div class="d-line"><strong>P(B|A&prime;)</strong> — ned A&prime;-banen, andelen som tester positivt (falske positive)</div>'+
      '<div class="d-line"><strong>P(B)</strong> — svaret: hele B-kolonnen, begge dørene summert</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</p></div>';
  }

  function oppProcess(){
    return '<div class="step-content"><h3>Steg 2 — Prosess: tre steg til hele kolonnen</h3>'+
      '<p>De samme tre stegene du går gjennom med tall i Steg 4 — alltid i denne rekkefølgen. Formen først, ingen tall ennå.</p>'+
      oppFviz(false)+
      '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
      '<div class="proc-step"><strong>Steg 1 — Del verdenen etter utgangssannsynligheten.</strong> Inn i A-banen P(A) og A&prime;-banen P(A&prime;) = 1 &minus; P(A). <em>Hvorfor denne biten:</em> B kan bare skje inne i den ene banen eller den andre. <em>Hva den gjør med rommet:</em> den kutter hele huset i to deler som dekker det.</div>'+
      '<div class="proc-step"><strong>Steg 2 — Send B ned hver bane.</strong> A-banen: P(B|A)&middot;P(A). A&prime;-banen: P(B|A&prime;)&middot;P(A&prime;). <em>Hvorfor denne biten:</em> hver bane slipper gjennom sin egen andel av positive. <em>Hva den gjør med rommet:</em> den fyller de to rommene i B-kolonnen — ekte positive og falske positive.</div>'+
      '<div class="proc-step"><strong>Steg 3 — Summer de to banene.</strong> Legg sammen de to B-rommene. <em>Hvorfor denne biten:</em> sammen er de hver måte B kan skje på. <em>Hva den gjør med rommet:</em> den lukker B-kolonnen til én enkelt vegg, P(B).</div>'+
      '</div>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:4px">P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</p></div>';
  }

  function oppData(){
    return '<div class="step-content"><h3>Steg 3 — Dataene: tre tall, og hvordan de lyser opp huset</h3>'+
      '<h4>Hva oppgaven gir deg</h4>'+
      '<p>En oppgave om total sannsynlighet gir deg en <strong>utgangssannsynlighet</strong> og <strong>to betingede sannsynligheter</strong> — den samme screeningtesten — og stoler på at du bygger begge dørene inn i B.</p>'+
      '<div class="data-card"><div class="data-title">En screeningtest</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A) — utgangssannsynligheten: hvor vanlig egenskapen er</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A) — en ekte bærer som tester positivt</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;) — en frisk person som tester positivt (en falsk positiv)</th><td>0.10</td></tr>'+
      '</table></div>'+
      '<p>Én av fem bærer egenskapen, så A-banen er verdt P(A) = '+f(PA)+' og den langt større A&prime;-banen er verdt P(A&prime;) = '+f(PNA)+'. Se opp på huset: de to rommene i B-kolonnen er de to dørene — det ekte-positive hjørnet øverst til venstre '+f(PAB)+', og det falsk-positive rommet under det '+f(PNAB)+'.</p>'+
      '<h4>Kjenn spenningen før du løser</h4>'+
      '<p>A&prime;-banen er fire ganger så stor som A-banen. Så selv om treffraten er liten (bare '+f(PBgNA)+'), drypper den likevel en ekte '+f(PNAB)+' med falske positive inn i kolonnen — nesten halvparten av størrelsen på de '+f(PAB)+' ekte. En stor bane med liten rate kan måle seg med en liten bane med stor rate. Den balansen er hele historien.</p></div>';
  }

  function oppWalk(){
    return '<div class="step-content"><h3>Steg 4 — Kjør formelen: hele kolonnen, bit for bit</h3>'+
      '<p>De tre stegene fra Prosessen, nå med tallene fra det fylte huset. Hver bit står på egne bein.</p>'+
      oppFviz(true)+
      '<div class="derivation"><div class="d-label">Steg 1 — del verdenen etter utgangssannsynligheten</div>'+
      '<div class="d-line">P(A) = '+f(PA)+' &nbsp;&middot;&nbsp; P(A&prime;) = 1 &minus; '+f(PA)+' = <strong>'+f(PNA)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Steg 2 — send B ned hver bane</div>'+
      '<div class="d-line">A-banen (ekte positive): &nbsp; P(B|A)&middot;P(A) = '+f(PBgA)+'&middot;'+f(PA)+' = <strong>'+f(PAB)+'</strong></div>'+
      '<div class="d-line">A&prime;-banen (falske positive): &nbsp; P(B|A&prime;)&middot;P(A&prime;) = '+f(PBgNA)+'&middot;'+f(PNA)+' = <strong>'+f(PNAB)+'</strong></div></div>'+
      '<div class="derivation"><div class="d-label">Steg 3 — summer de to banene</div>'+
      '<div class="d-line">P(B) = '+f(PAB)+' + '+f(PNAB)+' = <strong>'+f(PB)+'</strong></div></div>'+
      '<div class="result-box"><div class="result-box-name">Hele B — P(B)</div><div class="result-box-formula">P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)</div><div class="result-box-value">P(B) = '+f(PB)+'</div></div>'+
      '<p style="color:var(--text2);font-size:.88rem;margin-top:18px">'+PATHS.oppsplitting.close+'</p></div>';
  }

  var DEEP = {
    addisjon:       { bp: addBlueprint,   pr: addProcess,   da: addData,   wk: addWalk },
    multiplikasjon: { bp: mulBlueprint,   pr: mulProcess,   da: mulData,   wk: mulWalk },
    oppsplitting:   { bp: oppBlueprint,   pr: oppProcess,   da: oppData,   wk: oppWalk },
    bayes:          { bp: bayesBlueprint, pr: bayesProcess, da: bayesData, wk: bayesWalk }
  };

  function blueprintHTML(P){
    return '<div class="step-content"><h3>Steg 1 — Plantegning: '+P.name+'</h3>'+
      '<p style="color:var(--accent);font-weight:500;margin-top:12px">'+P.formula+'</p></div>';
  }
  function processHTML(P){
    return '<div class="step-content"><h3>Steg 2 — Prosess: '+P.name+'</h3>'+
      '<p style="color:var(--accent);font-weight:500">'+P.formula+'</p></div>';
  }
  function dataHTML(){
    return '<div class="step-content"><h3>Steg 3 — Dataene</h3>'+
      '<div class="data-card"><div class="data-title">En screeningtest</div>'+
      '<table class="data-table">'+
      '<tr><th>P(A)</th><td>0.20</td></tr>'+
      '<tr><th>P(B|A)</th><td>0.90</td></tr>'+
      '<tr><th>P(B|A&prime;)</th><td>0.10</td></tr>'+
      '</table></div></div>';
  }
  function walkHTML(P){
    return '<div class="step-content"><h3>Steg 4 — Kjør formelen: '+P.name+'</h3>'+
      '<p style="color:var(--accent);font-weight:500">'+P.formula+'</p></div>';
  }

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
    if(!activePath){ host.innerHTML='<div class="step-content"><p style="color:var(--muted);font-style:italic">Velg en sti over, og gå så de fire stegene.</p></div>'; showLabels(); clearHL(); return; }
    var P = PATHS[activePath];
    var d = DEEP[activePath];
    if(step===1){ showLabels(); host.innerHTML = d ? d.bp() : blueprintHTML(P); }
    else if(step===2){ showLabels(); host.innerHTML = d ? d.pr() : processHTML(P); }
    else if(step===3){ fillHouse(); host.innerHTML = d ? d.da() : dataHTML(P); }
    else if(step===4){ fillHouse(); host.innerHTML = d ? d.wk() : walkHTML(P); }
    else if(step===5){ fillHouse(); host.innerHTML='<div class="step-content"><h3>Steg 5 — Test deg selv</h3><div id="test-host"></div></div>'; if(window.renderTest) window.renderTest(activePath); }
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
