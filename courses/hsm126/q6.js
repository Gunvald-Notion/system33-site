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
		explanation: `Latente variabler (konstrukter) kan ikke måles direkte — f.eks. «tilfredshet». Vi når dem gjennom flere observerte indikatorer som beveger seg sammen.`
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
		explanation: `λ (lambda) er faktorladningen: styrken på koblingen mellom indikatoren X og den latente η. δ (delta) er målefeilen.`
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
		walk: `<div class="walk-intro">En standardisert faktorladning er <strong>λ = 0,8</strong>. Andelen forklart varians i indikatoren er <strong>λ²</strong>.</div><div class="result-box"><div class="result-box-name">Forklart varians</div><div class="result-box-formula">λ² = 0,8²</div><div class="result-box-value">0,64 → 64 %</div></div><div class="proc-block"><div class="proc-title">Hva det betyr</div><div class="proc-step"><strong>Felles varians.</strong> Den latente variabelen forklarer <em>64 %</em> av variasjonen i denne indikatoren; resten (36 %) er målefeil (δ).</div></div><div class="fx-line"><strong>Merk:</strong> dette er parallellen til R² — bare på indikatornivå. Sterk ladning > 0,70.</div>`
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
		explanation: `Tommelreglene: CFI og TLI ≥ 0,95, RMSEA ≤ 0,06, SRMR ≤ 0,08. Khikvadrat-testen brukes også, men er følsom for store utvalg.`
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
		walk: `<div class="walk-intro">Den indirekte effekten gjennom mediatoren M er produktet av de to stiene: <strong>a · b</strong>.</div><div class="piece-row"><div class="piece"><span class="piece-text">a = 0,5</span><span class="piece-label">X → M</span></div><span class="formula-op">·</span><div class="piece"><span class="piece-text">b = 0,4</span><span class="piece-label">M → Y</span></div></div><div class="result-box"><div class="result-box-name">Indirekte effekt</div><div class="result-box-formula">a · b = 0,5 · 0,4</div><div class="result-box-value">0,20</div></div><div class="fx-line"><strong>Merk:</strong> total effekt = direkte effekt (c′) + indirekte effekt (a · b).</div>`
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
		explanation: `=~ betyr «måles av» (målemodellen). ~ er regresjon (struktur), og ~~ er kovarians.`
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
		explanation: `Målemodellen (cfa) sier hvordan indikatorene danner konstruktene; strukturmodellen lar konstruktene predikere hverandre (η₂ = β·η₁ + ζ). Full SEM kombinerer begge.`
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
		explanation: `SEM modellerer ikke-observerte konstrukter, flere ligninger på én gang, og skiller ekte sammenheng fra målefeil — noe vanlig regresjon ikke får til.`
	}
];
