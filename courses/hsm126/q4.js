// HSM126 — Kapittel 10: Noen spesielle hypotesetester
// Prosess-stil walks i T-obs/kjikvadrat-formasjonen. Ren norsk laerebok-tone.
var Q4 = [
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 1,
    q: `En produsent hevder at høyst 10 % av enhetene er defekte. I et utvalg på n = 200 enheter er 30 defekte (p̂ = 0,15). Vi tester H₀: p = 0,10 mot H_A: p > 0,10 på 5 %-nivå. Hva blir konklusjonen?`,
    a: `Behold H₀ — 0,15 er ikke langt nok unna 0,10`,
    b: `Forkast H₀ — andelen defekte er signifikant høyere enn 10 %`,
    c: `Testen kan ikke brukes fordi p̂ ikke er normalfordelt`,
    d: `Vi trenger utvalgets standardavvik for å kunne regne`,
    correct: `B`,
    explanation: `z = (p̂ − p₀) / √(p₀(1−p₀)/n) = 0,05 / 0,0212 ≈ 2,36 > 1,645, så vi forkaster H₀.`,
    walk: `<div class="walk-intro">Vi måler avstanden mellom <strong>påstanden</strong> (p₀ = 0,10) og <strong>det vi så</strong> (p̂ = 0,15) — i standardfeil. Under H₀ regner vi standardfeilen med p₀, ikke p̂.</div>
<div class="piece-row"><span class="formula-lhs">z</span><span class="formula-op">=</span><div class="piece"><span class="piece-text">p̂ − p₀</span><span class="piece-label">avvik fra påstanden</span></div><span class="formula-op">/</span><div class="piece accent"><span class="piece-text">√(p₀(1−p₀)/n)</span><span class="piece-label">standardfeil under H₀</span></div></div>
<div class="proc-block"><div class="proc-title">Z-vandringa for andelen — steg for steg</div><div class="proc-step"><strong>Steg 1.</strong> Standardfeil under H₀: √(0,10 · 0,90 / 200) = √0,00045 ≈ <em>0,0212</em>.</div><div class="proc-step"><strong>Steg 2.</strong> Avvik fra påstanden: p̂ − p₀ = 0,15 − 0,10 = 0,05.</div><div class="proc-step"><strong>Steg 3.</strong> z = 0,05 / 0,0212 ≈ <em>2,36</em>.</div><div class="proc-step"><strong>Steg 4.</strong> Ensidig høyre test, kritisk verdi 1,645. Siden 2,36 > 1,645 lander vi i forkastningsområdet.</div></div>
<div class="result-box"><div class="result-box-name">Beslutning</div><div class="result-box-formula">z = 2,36 > 1,645</div><div class="result-box-value">Forkast H₀</div></div>
<div class="fx-line"><strong>Merk:</strong> standardfeilen bruker p₀, ikke p̂ — vi regner som om H₀ er sann.</div>`
  },
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 2,
    q: `To grupper sammenliknes. Forskjellen i snitt er x̄ − ȳ = 1200 − 1020 = 180, og standardfeilen til forskjellen er 100. Vi tester tosidig (H_A: μₓ ≠ μᵧ) på 5 %-nivå med df = 30 (kritisk verdi 2,042). Hva blir konklusjonen?`,
    a: `Forkast H₀ — gruppene er klart forskjellige`,
    b: `Forkast H₀ fordi forskjellen er 180, som er stor`,
    c: `Behold H₀ — forskjellen er ikke statistisk signifikant`,
    d: `Testen krever like store grupper for å være gyldig`,
    correct: `C`,
    explanation: `T = (x̄ − ȳ) / SE = 180 / 100 = 1,8. Tosidig med df = 30 gir kritisk verdi ±2,042. Siden |1,8| < 2,042 beholder vi H₀.`,
    walk: `<div class="walk-intro">Samme tanke som for ett utvalg, men nå er <strong>handa</strong> en forskjell mellom to grupper. Vi måler hvor mange standardfeil forskjellen ligger unna null.</div>
<div class="piece-row"><span class="formula-lhs">T</span><span class="formula-op">=</span><div class="piece"><span class="piece-text">x̄ − ȳ</span><span class="piece-label">forskjell i snitt</span></div><span class="formula-op">/</span><div class="piece accent"><span class="piece-text">SE_forskjell</span><span class="piece-label">standardfeil til forskjellen</span></div></div>
<div class="proc-block"><div class="proc-title">T-vandringa for to grupper — steg for steg</div><div class="proc-step"><strong>Steg 1.</strong> Forskjell i snitt: x̄ − ȳ = 1200 − 1020 = <em>180</em>.</div><div class="proc-step"><strong>Steg 2.</strong> Standardfeil til forskjellen: 100 (oppgitt).</div><div class="proc-step"><strong>Steg 3.</strong> T = 180 / 100 = <em>1,8</em>.</div><div class="proc-step"><strong>Steg 4.</strong> Tosidig på 5 %, df = 30, kritisk verdi ±2,042. |1,8| < 2,042 — vi når ikke fram.</div></div>
<div class="walk-note">Behold er ikke det samme som «bevist lik» — vi mangler bare nok bevis til å påstå en forskjell.</div>
<div class="result-box"><div class="result-box-name">Beslutning</div><div class="result-box-formula">|T| = 1,8 < 2,042</div><div class="result-box-value">Behold H₀</div></div>
<div class="fx-line"><strong>Form:</strong> T = (x̄ − ȳ) / SE_forskjell, df ≈ 30. Tosidig 5 % ⇒ ±2,042.</div>`
  },
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 3,
    q: `En terning kastes 60 ganger. Ved en rettferdig terning forventer vi 10 på hver side. Observert: 8, 12, 9, 11, 10, 10. Vi tester om terningen er rettferdig (5 %-nivå). Hva blir kjikvadrat-observatoren og konklusjonen?`,
    a: `χ² = 1,0 — vi beholder H₀, terningen ser rettferdig ut`,
    b: `χ² = 6,0 — vi forkaster H₀`,
    c: `χ² = 11,07 — akkurat på grensa`,
    d: `χ² = 60 — klart skjev terning`,
    correct: `A`,
    explanation: `χ² = Σ(O−E)²/E = (4+4+1+1+0+0)/10 = 1,0. Med df = k−1 = 5 er kritisk verdi 11,07. Siden 1,0 < 11,07 beholder vi H₀.`,
    walk: `<div class="walk-intro">Kjikvadrat måler hvor langt det <strong>observerte</strong> ligger fra det <strong>forventede</strong> — kvadrert og skalert, celle for celle.</div>
<div class="piece-row"><span class="formula-lhs">χ²</span><span class="formula-op">=</span><span class="formula-op">Σ</span><div class="piece"><span class="piece-text">(O − E)²</span><span class="piece-label">observert minus forventet, kvadrert</span></div><span class="formula-op">/</span><div class="piece accent"><span class="piece-text">E</span><span class="piece-label">forventet i cella</span></div></div>
<div class="proc-block"><div class="proc-title">Kjikvadrat-vandringa — steg for steg</div><div class="proc-step"><strong>Steg 1.</strong> Forventet i hver celle ved rettferdig terning: E = 60 / 6 = <em>10</em>.</div><div class="proc-step"><strong>Steg 2.</strong> (O − E)² for de seks sidene: 4, 4, 1, 1, 0, 0.</div><div class="proc-step"><strong>Steg 3.</strong> Del hver på E = 10 og summer: (4+4+1+1+0+0) / 10 = <em>1,0</em>.</div><div class="proc-step"><strong>Steg 4.</strong> df = k − 1 = 6 − 1 = 5, kritisk verdi 11,07. 1,0 < 11,07.</div></div>
<div class="result-box"><div class="result-box-name">Beslutning</div><div class="result-box-formula">χ² = 1,0 < 11,07</div><div class="result-box-value">Behold H₀</div></div>
<div class="fx-line"><strong>Form:</strong> χ² = Σ(O − E)² / E, df = k − 1. Stor χ² ⇒ observert langt fra forventet ⇒ forkast.</div>`
  },
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 4,
    q: `I en kjikvadrattest for uavhengighet har krysstabellen 3 rader og 4 kolonner. Hvor mange frihetsgrader bruker testen?`,
    a: `12`,
    b: `11`,
    c: `6`,
    d: `7`,
    correct: `C`,
    explanation: `df = (r − 1)(k − 1) = (3 − 1)(4 − 1) = 2 · 3 = 6.`,
    walk: `<div class="walk-intro">For en krysstabell teller vi frihetsgradene ut fra <strong>formen</strong> på tabellen — ikke ut fra antall observasjoner.</div>
<div class="piece-row"><span class="formula-lhs">df</span><span class="formula-op">=</span><div class="piece"><span class="piece-text">r − 1</span><span class="piece-label">rader minus én</span></div><span class="formula-op">·</span><div class="piece accent"><span class="piece-text">k − 1</span><span class="piece-label">kolonner minus én</span></div></div>
<div class="proc-block"><div class="proc-title">Frihetsgrad-vandringa — steg for steg</div><div class="proc-step"><strong>Steg 1.</strong> Rader r = 3, kolonner k = 4.</div><div class="proc-step"><strong>Steg 2.</strong> r − 1 = 2 og k − 1 = 3.</div><div class="proc-step"><strong>Steg 3.</strong> df = 2 · 3 = <em>6</em>.</div></div>
<div class="result-box"><div class="result-box-name">Frihetsgrader</div><div class="result-box-formula">df = (3 − 1)(4 − 1)</div><div class="result-box-value">df = 6</div></div>
<div class="fx-line"><strong>Form:</strong> df = (r − 1)(k − 1) for uavhengighet. For tilpasningstest: df = k − 1.</div>`
  },
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 5,
    q: `Når kan vi trygt erstatte den eksakte binomiske testen med en normaltilnærming?`,
    a: `Bare når p₀ = 0,5`,
    b: `Når både n·p₀ og n·(1 − p₀) er rimelig store (tommelregel ≥ 5)`,
    c: `Alltid — normalfordelingen gjelder for alle utvalg`,
    d: `Bare når n er mindre enn 30`,
    correct: `B`,
    explanation: `Den eksakte testen bruker binomisk fordeling. Når n·p₀ og n·(1 − p₀) begge er store nok (ofte ≥ 5), ligner binomisk nok på normal til at vi kan bruke z-test med heltallskorreksjon. Med små n eller p₀ nær 0 eller 1 holder vi oss til den eksakte binomiske testen.`
  },
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 6,
    q: `Du senker signifikansnivået fra 5 % til 1 %. Hva er konsekvensen?`,
    a: `Mindre sjanse for både type I- og type II-feil`,
    b: `Det blir lettere å forkaste H₀`,
    c: `Ingenting endrer seg — nivået påvirker bare rapporteringen`,
    d: `Mindre sjanse for type I-feil, men lavere styrke (større sjanse for type II-feil)`,
    correct: `D`,
    explanation: `Signifikansnivået α er sjansen for å forkaste en sann H₀ (type I-feil). Senker du α, krever du sterkere bevis før du forkaster — type I-feil blir mindre sannsynlig, men du beholder H₀ oftere, så styrken (1 − β) synker og type II-feil blir mer sannsynlig. De to feiltypene trekker mot hverandre.`
  },
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 7,
    q: `Hva er «styrken» (power) til en hypotesetest?`,
    a: `Sjansen for å forkaste H₀ når H₀ faktisk er usann (1 − β)`,
    b: `Sjansen for å forkaste H₀ når H₀ er sann`,
    c: `Sjansen for å beholde en sann H₀`,
    d: `Det samme som signifikansnivået α`,
    correct: `A`,
    explanation: `Styrke = 1 − β = sjansen for å oppdage en effekt som virkelig finnes, altså forkaste H₀ når den er usann. β er sjansen for type II-feil (overse en reell effekt). Større utvalg og større effekt gir høyere styrke.`
  },
  {
    chapter: `Ch 10 — Spesielle hypotesetester`,
    qnum: 8,
    q: `Dataene er små i antall og tydelig ikke normalfordelte. Hvilken type test passer best?`,
    a: `En vanlig t-test — den krever ingen antakelser`,
    b: `En kjikvadrattest for forventning`,
    c: `En fordelingsfri (ikke-parametrisk) test, f.eks. Wilcoxon`,
    d: `Ingen test kan brukes på små utvalg`,
    correct: `C`,
    explanation: `t-testen hviler på at dataene er (tilnærmet) normalfordelte. Når den antakelsen svikter og utvalget er lite, bruker vi fordelingsfrie tester som Wilcoxon, som rangerer observasjonene i stedet for å bruke selve verdiene. De krever færre antakelser om fordelingen.`
  }
];
