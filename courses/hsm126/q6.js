var Q6 = [
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-1`,
		q: `Hva er en latent variabel i SEM?`,
		a: `En variabel vi måler direkte med ett spørsmål`,
		b: `En ikke-observert variabel som måles indirekte gjennom flere indikatorer`,
		c: `Et feilledd`,
		d: `En konstant i modellen`,
		correct: `B`,
		explanation: `Latente variabler (konstrukter) kan ikke måles direkte — f.eks. «tilfredshet». Vi når dem gjennom flere observerte indikatorer som beveger seg sammen.`,
		walk: `<div class="walk-intro">Et begrepsspørsmål: hva er en <strong>latent variabel</strong>? Nøkkelen er at den ikke kan måles direkte.</div><div class="piece-row"><div class="piece accent"><span class="piece-text">latent η</span><span class="piece-label">ikke-observert konstrukt</span></div><span class="formula-op">→</span><div class="piece"><span class="piece-text">flere indikatorer</span><span class="piece-label">målte spørsmål</span></div></div><div class="proc-block"><div class="proc-title">Latent mot observert</div><div class="proc-step"><strong>Steg 1 — Problemet.</strong> Noe som «tilfredshet» eller «motivasjon» kan ikke leses av med ett tall.</div><div class="proc-step"><strong>Steg 2 — Løsningen.</strong> Vi måler flere observerte indikatorer som beveger seg sammen, og lar den felles variasjonen definere konstruktet.</div><div class="proc-step"><strong>Fella.</strong> En variabel målt direkte med ett spørsmål er <em>observert</em>, ikke latent; et feilledd og en konstant er noe helt annet.</div></div><div class="result-box"><div class="result-box-name">Svar · latent variabel</div><div class="result-box-formula">ikke-observert, målt via flere indikatorer</div><div class="result-box-value">Alternativ B</div></div>`
	},
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-2`,
		q: `I målemodellen X = λη + δ, hva er λ?`,
		a: `Feilleddet δ`,
		b: `Den latente variabelen η`,
		c: `Faktorladningen — hvor sterkt indikatoren henger sammen med den latente variabelen`,
		d: `Residualvariansen`,
		correct: `C`,
		explanation: `λ (lambda) er faktorladningen: styrken på koblingen mellom indikatoren X og den latente η. δ (delta) er målefeilen.`,
		walk: `<div class="walk-intro">Målemodellen er <strong>X = λη + δ</strong>. Spørsmålet er hva <strong>λ</strong> (lambda) gjør.</div><div class="piece-row"><span class="formula-lhs">X =</span><div class="piece accent"><span class="piece-text">λ · η</span><span class="piece-label">faktorladning · latent variabel</span></div><span class="formula-op">+</span><div class="piece"><span class="piece-text">δ</span><span class="piece-label">målefeil</span></div></div><div class="proc-block"><div class="proc-title">Brikkene i målemodellen</div><div class="proc-step"><strong>Steg 1 — η.</strong> Den latente variabelen — det vi egentlig vil måle.</div><div class="proc-step"><strong>Steg 2 — λ.</strong> Faktorladningen: hvor sterkt indikatoren X henger sammen med η. Dette spørsmålet handler om λ.</div><div class="proc-step"><strong>Steg 3 — δ.</strong> Målefeilen: den delen av X som η ikke forklarer.</div></div><div class="result-box"><div class="result-box-name">Svar · faktorladning</div><div class="result-box-formula">λ = styrken X ↔ η</div><div class="result-box-value">Alternativ C</div></div>`
	},
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-3`,
		q: `En standardisert faktorladning er λ = 0,8. Hvor stor andel av indikatorens varians forklares av den latente variabelen?`,
		a: `0,8 → 80 %`,
		b: `0,64 → 64 %`,
		c: `0,9 → 90 %`,
		d: `0,2 → 20 %`,
		correct: `B`,
		explanation: `Andel forklart varians = λ² = 0,8² = 0,64, altså 64 %. Resten (36 %) er målefeil.`,
		walk: `<div class="walk-intro">En standardisert faktorladning er <strong>λ = 0,8</strong>. Andelen forklart varians i indikatoren er <strong>λ²</strong>.</div><div class="piece-row"><span class="formula-lhs">λ² =</span><div class="piece"><span class="piece-text">0,8²</span><span class="piece-label">ladning i andre</span></div><span class="formula-op">→</span><div class="piece accent"><span class="piece-text">0,64</span><span class="piece-label">64 % forklart</span></div></div><div class="proc-block"><div class="proc-title">Forklart varians — steg for steg</div><div class="proc-step"><strong>Steg 1 — Kvadrer ladningen.</strong> λ² = 0,8² = 0,64.</div><div class="proc-step"><strong>Steg 2 — Tolkning.</strong> Den latente variabelen forklarer <em>64 %</em> av variasjonen i denne indikatoren; resten (36 %) er målefeil (δ).</div><div class="proc-step"><strong>Merk.</strong> Dette er parallellen til R² — bare på indikatornivå. Sterk ladning > 0,70.</div></div><div class="result-box"><div class="result-box-name">Svar · forklart varians</div><div class="result-box-formula">λ² = 0,8² = 0,64</div><div class="result-box-value">64 % — alternativ B</div></div>`
	},
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-4`,
		q: `Hvilke verdier på tilpasningsmålene indikerer god modelltilpasning?`,
		a: `CFI ≥ 0,95, RMSEA ≤ 0,06, SRMR ≤ 0,08`,
		b: `CFI ≤ 0,5, RMSEA ≥ 0,5`,
		c: `R² ≥ 0,95 alene`,
		d: `p < 0,05 alltid`,
		correct: `A`,
		explanation: `Tommelreglene: CFI og TLI ≥ 0,95, RMSEA ≤ 0,06, SRMR ≤ 0,08. Khikvadrat-testen brukes også, men er følsom for store utvalg.`,
		walk: `<div class="walk-intro">God modelltilpasning leses av flere <strong>tilpasningsmål</strong> samtidig — ingen enkelt verdi avgjør alene.</div><div class="piece-row"><div class="piece"><span class="piece-text">CFI ≥ 0,95</span><span class="piece-label">jo høyere jo bedre</span></div><div class="piece"><span class="piece-text">RMSEA ≤ 0,06</span><span class="piece-label">jo lavere jo bedre</span></div><div class="piece"><span class="piece-text">SRMR ≤ 0,08</span><span class="piece-label">jo lavere jo bedre</span></div></div><div class="proc-block"><div class="proc-title">Tommelreglene</div><div class="proc-step"><strong>Steg 1 — Skal være høye.</strong> CFI og TLI ≥ 0,95.</div><div class="proc-step"><strong>Steg 2 — Skal være lave.</strong> RMSEA ≤ 0,06 og SRMR ≤ 0,08.</div><div class="proc-step"><strong>Steg 3 — Khikvadrat.</strong> Brukes også, men er følsom for store utvalg, så den vektlegges sjelden alene.</div></div><div class="result-box"><div class="result-box-name">Svar · tilpasningsmål</div><div class="result-box-formula">CFI ≥ 0,95 · RMSEA ≤ 0,06 · SRMR ≤ 0,08</div><div class="result-box-value">Alternativ A</div></div>`
	},
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-5`,
		q: `I en mediering går effekten fra X til Y gjennom M. Stien a (X → M) = 0,5 og b (M → Y) = 0,4. Hva er den indirekte effekten?`,
		a: `0,9`,
		b: `0,20`,
		c: `0,10`,
		d: `0,5`,
		correct: `B`,
		explanation: `Indirekte effekt = a · b = 0,5 · 0,4 = 0,20. Total effekt = direkte + indirekte.`,
		walk: `<div class="walk-intro">Den indirekte effekten gjennom mediatoren M er produktet av de to stiene: <strong>a · b</strong>.</div><div class="piece-row"><div class="piece"><span class="piece-text">a = 0,5</span><span class="piece-label">X → M</span></div><span class="formula-op">·</span><div class="piece"><span class="piece-text">b = 0,4</span><span class="piece-label">M → Y</span></div><span class="formula-op">→</span><div class="piece accent"><span class="piece-text">0,20</span><span class="piece-label">indirekte effekt</span></div></div><div class="proc-block"><div class="proc-title">Mediering — steg for steg</div><div class="proc-step"><strong>Steg 1 — Stien inn.</strong> a = 0,5 er effekten fra X til mediatoren M.</div><div class="proc-step"><strong>Steg 2 — Stien ut.</strong> b = 0,4 er effekten fra M til Y.</div><div class="proc-step"><strong>Steg 3 — Multipliser.</strong> Indirekte effekt = a · b = 0,5 · 0,4 = 0,20.</div></div><div class="walk-note">Total effekt = direkte effekt (c′) + indirekte effekt (a · b). En sti er en kjede: du ganger leddene, ikke legger dem sammen.</div><div class="result-box"><div class="result-box-name">Svar · indirekte effekt</div><div class="result-box-formula">a · b = 0,5 · 0,4</div><div class="result-box-value">0,20 — alternativ B</div></div>`
	},
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-6`,
		q: `I lavaan-syntaks (R), hva betyr operatoren =~?`,
		a: `Definerer en latent variabel ut fra indikatorene (måling)`,
		b: `Regresjon — utfall på prediktor`,
		c: `Kovarians mellom to variabler`,
		d: `At to parametere er like`,
		correct: `A`,
		explanation: `=~ betyr «måles av» (målemodellen). ~ er regresjon (struktur), og ~~ er kovarians.`,
		walk: `<div class="walk-intro">lavaan har tre kjerneoperatorer. Spørsmålet er hva <strong>=~</strong> betyr.</div><div class="piece-row"><div class="piece accent"><span class="piece-text">=~</span><span class="piece-label">«måles av» (måling)</span></div><div class="piece"><span class="piece-text">~</span><span class="piece-label">regresjon (struktur)</span></div><div class="piece"><span class="piece-text">~~</span><span class="piece-label">kovarians</span></div></div><div class="proc-block"><div class="proc-title">lavaan-operatorene</div><div class="proc-step"><strong>Steg 1 — =~.</strong> Definerer en latent variabel ut fra indikatorene: «den latente <em>måles av</em> disse». Dette er målemodellen.</div><div class="proc-step"><strong>Steg 2 — ~.</strong> Regresjon: utfall ~ prediktor (strukturmodellen).</div><div class="proc-step"><strong>Steg 3 — ~~.</strong> Kovarians/varians mellom to ledd.</div></div><div class="result-box"><div class="result-box-name">Svar · lavaan =~</div><div class="result-box-formula">latent =~ indikatorer (måling)</div><div class="result-box-value">Alternativ A</div></div>`
	},
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-7`,
		q: `Hva er forskjellen på målemodellen og strukturmodellen i SEM?`,
		a: `Det er ingen reell forskjell`,
		b: `Målemodellen knytter latente variabler til indikatorene; strukturmodellen knytter latente variabler til hverandre`,
		c: `Strukturmodellen måler bare feil`,
		d: `Målemodellen gjelder kun observerte data`,
		correct: `B`,
		explanation: `Målemodellen (cfa) sier hvordan indikatorene danner konstruktene; strukturmodellen lar konstruktene predikere hverandre (η₂ = β·η₁ + ζ). Full SEM kombinerer begge.`,
		walk: `<div class="walk-intro">SEM har to deler. Hold dem fra hverandre: den ene <em>måler</em> konstruktene, den andre <em>kobler</em> dem.</div><div class="piece-row"><div class="piece"><span class="piece-text">målemodell</span><span class="piece-label">latent ↔ indikatorer</span></div><span class="formula-op">+</span><div class="piece"><span class="piece-text">strukturmodell</span><span class="piece-label">latent → latent</span></div><span class="formula-op">=</span><div class="piece accent"><span class="piece-text">full SEM</span><span class="piece-label">begge sammen</span></div></div><div class="proc-block"><div class="proc-title">De to modellene</div><div class="proc-step"><strong>Steg 1 — Målemodellen (cfa).</strong> Knytter de latente variablene til indikatorene: hvordan måler vi konstruktet?</div><div class="proc-step"><strong>Steg 2 — Strukturmodellen.</strong> Lar de latente variablene predikere hverandre: η₂ = β·η₁ + ζ.</div><div class="proc-step"><strong>Steg 3 — Full SEM.</strong> Kombinerer begge i én modell.</div></div><div class="result-box"><div class="result-box-name">Svar · måle- mot strukturmodell</div><div class="result-box-formula">måling: latent↔indikator · struktur: latent→latent</div><div class="result-box-value">Alternativ B</div></div>`
	},
	{
		chapter: `Ch 12 — SEM`,
		qnum: `12-8`,
		q: `Hva gjør SEM nyttig framfor vanlig regresjon?`,
		a: `Den er enklere å regne for hånd`,
		b: `Den krever mindre data`,
		c: `Den håndterer latente variabler og flere sammenhenger samtidig, og tar hensyn til målefeil`,
		d: `Den trenger ingen antakelser`,
		correct: `C`,
		explanation: `SEM modellerer ikke-observerte konstrukter, flere ligninger på én gang, og skiller ekte sammenheng fra målefeil — noe vanlig regresjon ikke får til.`,
		walk: `<div class="walk-intro">Hvorfor velge SEM framfor vanlig regresjon? Se hva SEM kan som regresjon ikke får til.</div><div class="piece-row"><div class="piece"><span class="piece-text">latente variabler</span><span class="piece-label">ikke-observerte konstrukter</span></div><div class="piece"><span class="piece-text">flere ligninger</span><span class="piece-label">samtidig</span></div><div class="piece"><span class="piece-text">målefeil</span><span class="piece-label">skilt fra ekte sammenheng</span></div></div><div class="proc-block"><div class="proc-title">SEM mot vanlig regresjon</div><div class="proc-step"><strong>Steg 1 — Latente konstrukter.</strong> SEM modellerer variabler vi ikke kan måle direkte.</div><div class="proc-step"><strong>Steg 2 — Flere sammenhenger.</strong> Flere ligninger løses på én gang, ikke én utfallsvariabel om gangen.</div><div class="proc-step"><strong>Steg 3 — Målefeil.</strong> SEM skiller ekte sammenheng fra målefeil — noe vanlig regresjon antar bort.</div></div><div class="result-box"><div class="result-box-name">Svar · nytten av SEM</div><div class="result-box-formula">latente + flere ligninger + målefeil</div><div class="result-box-value">Alternativ C</div></div>`
	}
];
