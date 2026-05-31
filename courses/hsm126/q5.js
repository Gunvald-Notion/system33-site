var Q5 = [
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-1`,
		q: `Den enkle regresjonsmodellen er y = β₀ + β₁x + ε. Hva representerer β₁?`,
		a: `Predikert y når x = 0`,
		b: `Endringen i y når x øker med én enhet`,
		c: `Korrelasjonen mellom x og y`,
		d: `Feilleddet i modellen`,
		correct: `B`,
		explanation: `β₁ er stigningstallet — hvor mye y endrer seg per enhets økning i x. β₀ er skjæringspunktet (y når x = 0), og ε er feilleddet.`,
		walk: `<div class="walk-intro">Et begrepsspørsmål om <strong>regresjonslinja</strong>. Før du regner noe, må du vite hva hver brikke i modellen gjør.</div><div class="piece-row"><span class="formula-lhs">y =</span><div class="piece"><span class="piece-text">β₀</span><span class="piece-label">skjæringspunkt (y når x = 0)</span></div><span class="formula-op">+</span><div class="piece accent"><span class="piece-text">β₁ · x</span><span class="piece-label">stigningstall · forklaringsvariabel</span></div><span class="formula-op">+</span><div class="piece"><span class="piece-text">ε</span><span class="piece-label">feilledd</span></div></div><div class="proc-block"><div class="proc-title">Regresjonslinja — brikke for brikke</div><div class="proc-step"><strong>Steg 1 — β₀.</strong> Skjæringspunktet: hvor linja krysser y-aksen, altså predikert y når x = 0.</div><div class="proc-step"><strong>Steg 2 — β₁.</strong> Stigningstallet: hvor mye y endrer seg når x øker med <em>én enhet</em>. Det er dette spørsmålet ber om.</div><div class="proc-step"><strong>Steg 3 — ε.</strong> Feilleddet: avstanden mellom det modellen spår og den faktiske y-verdien.</div><div class="proc-step"><strong>Fella.</strong> β₁ er ikke korrelasjonen (det er r) og ikke verdien ved x = 0 (det er β₀).</div></div><div class="result-box"><div class="result-box-name">Svar · stigningstall</div><div class="result-box-formula">β₁ = endring i y per enhets x</div><div class="result-box-value">Alternativ B</div></div>`
	},
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-2`,
		q: `En regresjon gir ŷ = 50 + 4x. Hva er predikert y når x = 10?`,
		a: `54`,
		b: `40`,
		c: `90`,
		d: `400`,
		correct: `C`,
		explanation: `ŷ = 50 + 4·10 = 90.`,
		walk: `<div class="walk-intro">Sett <strong>x = 10</strong> inn i regresjonslinja og les av <strong>ŷ</strong>.</div><div class="piece-row"><span class="formula-lhs">ŷ</span><span class="formula-op">=</span><div class="piece"><span class="piece-text">50</span><span class="piece-label">skjæringspunkt β₀</span></div><span class="formula-op">+</span><div class="piece"><span class="piece-text">4 · x</span><span class="piece-label">stigningstall β₁</span></div></div><div class="proc-block"><div class="proc-title">Innsetting — steg for steg</div><div class="proc-step"><strong>Steg 1.</strong> Bytt ut <em>x</em> med 10.</div><div class="proc-step"><strong>Steg 2.</strong> ŷ = 50 + 4 · 10 = 50 + 40.</div></div><div class="result-box"><div class="result-box-name">Predikert verdi</div><div class="result-box-formula">ŷ = 50 + 4 · 10</div><div class="result-box-value">ŷ = 90</div></div><div class="fx-line"><strong>Merk:</strong> β₀ = 50 er verdien når x = 0; β₁ = 4 er endringen i y per enhet x.</div>`
	},
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-3`,
		q: `En modell har R² = 0,64. Hva er korrelasjonen |r|, og hva betyr R²?`,
		a: `|r| = 0,64; modellen forklarer 64 %`,
		b: `|r| = 0,8; modellen forklarer 64 % av variasjonen i y`,
		c: `|r| = 0,41; modellen forklarer 41 %`,
		d: `|r| = 0,8; modellen forklarer 80 %`,
		correct: `B`,
		explanation: `|r| = √R² = √0,64 = 0,8. R² = 0,64 betyr at modellen forklarer 64 % av variasjonen i y.`,
		walk: `<div class="walk-intro">R² og korrelasjonen <strong>r</strong> henger sammen: <strong>|r| = √R²</strong>. Ta rota først, tolk prosenten etterpå.</div><div class="piece-row"><span class="formula-lhs">|r| =</span><div class="piece"><span class="piece-text">√R²</span><span class="piece-label">rota av R²</span></div><span class="formula-op">=</span><div class="piece"><span class="piece-text">√0,64</span><span class="piece-label">sett inn</span></div><span class="formula-op">→</span><div class="piece accent"><span class="piece-text">0,8</span><span class="piece-label">korrelasjon</span></div></div><div class="proc-block"><div class="proc-title">R² og r — steg for steg</div><div class="proc-step"><strong>Steg 1 — Korrelasjonen.</strong> |r| = √0,64 = 0,8.</div><div class="proc-step"><strong>Steg 2 — Andel forklart.</strong> R² = 0,64 betyr at modellen forklarer <em>64 %</em> av variasjonen i y; de resterende 36 % er uforklart (residualer).</div><div class="proc-step"><strong>Fella.</strong> R² er ikke r. Ta rota for å få korrelasjonen; fortegnet følger stigningstallet.</div></div><div class="result-box"><div class="result-box-name">Svar · R² og korrelasjon</div><div class="result-box-formula">|r| = √0,64 = 0,8 ; R² = 64 %</div><div class="result-box-value">Alternativ B</div></div>`
	},
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-4`,
		q: `En regresjon med én forklaringsvariabel (n = 25) gir β̂₁ = 2,0 med standardfeil 0,5. Test om stigningstallet er signifikant (tosidig 5 %).`,
		a: `t = 4,0 → forkast H₀: β₁ = 0, signifikant`,
		b: `t = 4,0 → behold H₀, ikke signifikant`,
		c: `t = 0,25 → ikke signifikant`,
		d: `Noe annet`,
		correct: `A`,
		explanation: `t = 2,0 / 0,5 = 4,0. df = n − k − 1 = 23, grense ≈ 2,069. |4,0| > 2,069 → forkast H₀.`,
		walk: `<div class="walk-intro">Test om stigningstallet er forskjellig fra null: <strong>t = β̂₁ / SE</strong>.</div><div class="piece-row"><span class="formula-lhs">t</span><span class="formula-op">=</span><div class="piece"><span class="piece-text">β̂₁</span><span class="piece-label">estimert stigningstall</span></div><span class="formula-op">÷</span><div class="piece"><span class="piece-text">SE</span><span class="piece-label">standardfeil</span></div></div><div class="proc-block"><div class="proc-title">T-testen for koeffisienten</div><div class="proc-step"><strong>Steg 1.</strong> t = 2,0 / 0,5 = 4,0.</div><div class="proc-step"><strong>Steg 2.</strong> Frihetsgrader: <em>df = n − k − 1 = 25 − 1 − 1 = 23</em>.</div><div class="proc-step"><strong>Steg 3.</strong> Tosidig 5 %, grense ≈ 2,069. |4,0| > 2,069.</div></div><div class="result-box"><div class="result-box-name">Dom</div><div class="result-box-formula">|t| = 4,0 > 2,069</div><div class="result-box-value">Forkast H₀: β₁ = 0 — signifikant</div></div><div class="fx-line"><strong>Tolkning:</strong> x bidrar signifikant til å forklare y.</div>`
	},
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-5`,
		q: `Hva tester F-testen i en regresjon?`,
		a: `Om én bestemt koeffisient er null`,
		b: `Korrelasjonen mellom to forklaringsvariabler`,
		c: `Om modellen som helhet forklarer noe (minst én β ≠ 0)`,
		d: `Om residualene er normalfordelte`,
		correct: `C`,
		explanation: `F-testen (F = MSR/MSE) vurderer modellen samlet: er minst én av koeffisientene forskjellig fra null? Enkeltkoeffisienter testes med t-test.`,
		walk: `<div class="walk-intro">F-testen ser på <strong>hele modellen samlet</strong>, ikke én enkelt koeffisient.</div><div class="piece-row"><span class="formula-lhs">F =</span><div class="piece"><span class="piece-text">MSR</span><span class="piece-label">forklart variasjon (modell)</span></div><span class="formula-op">÷</span><div class="piece"><span class="piece-text">MSE</span><span class="piece-label">uforklart variasjon (residual)</span></div></div><div class="proc-block"><div class="proc-title">F-test mot t-test</div><div class="proc-step"><strong>Steg 1 — Hypotesen.</strong> H₀: alle β = 0 (modellen forklarer ingenting) mot H_A: minst én β ≠ 0.</div><div class="proc-step"><strong>Steg 2 — Hva F måler.</strong> Stor F = forklart variasjon er stor i forhold til støyen → modellen forklarer noe.</div><div class="proc-step"><strong>Steg 3 — Arbeidsdeling.</strong> F tester modellen <em>samlet</em>; t-testen tester <em>én</em> koeffisient om gangen.</div></div><div class="result-box"><div class="result-box-name">Svar · F-test</div><div class="result-box-formula">F = MSR/MSE — minst én β ≠ 0?</div><div class="result-box-value">Alternativ C</div></div>`
	},
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-6`,
		q: `To forklaringsvariabler er sterkt korrelerte med hverandre. Hvilket problem oppstår, og hva diagnostiserer det?`,
		a: `Heteroskedastisitet; måles med Durbin-Watson`,
		b: `Multikollinearitet; måles med VIF = 1/(1 − R²ⱼ)`,
		c: `Autokorrelasjon; måles med R²`,
		d: `Ingen problem — flere variabler er alltid bedre`,
		correct: `B`,
		explanation: `Sterkt korrelerte forklaringsvariabler gir multikollinearitet, som blåser opp standardfeilene. VIF = 1/(1 − R²ⱼ) avslører det; en høy VIF (ofte > 5–10) er et varsel.`,
		walk: `<div class="walk-intro">Når to forklaringsvariabler er sterkt korrelerte med <em>hverandre</em>, oppstår <strong>multikollinearitet</strong>.</div><div class="piece-row"><span class="formula-lhs">VIF =</span><div class="piece"><span class="piece-text">1</span><span class="piece-label">teller</span></div><span class="formula-op">÷</span><div class="piece"><span class="piece-text">1 − R²ⱼ</span><span class="piece-label">hvor godt andre variabler forklarer variabel j</span></div></div><div class="proc-block"><div class="proc-title">Diagnosen — steg for steg</div><div class="proc-step"><strong>Steg 1 — Problemet.</strong> Sterkt korrelerte forklaringsvariabler blåser opp standardfeilene, så koeffisientene blir ustabile.</div><div class="proc-step"><strong>Steg 2 — Målet.</strong> VIF = 1/(1 − R²ⱼ). Høy R²ⱼ (andre variabler forklarer variabel j godt) → høy VIF.</div><div class="proc-step"><strong>Steg 3 — Varselgrensa.</strong> VIF > 5–10 regnes som et faresignal.</div><div class="proc-step"><strong>Fella.</strong> Heteroskedastisitet og autokorrelasjon er andre problemer — ikke det som korrelerte <em>forklaringsvariabler</em> gir.</div></div><div class="result-box"><div class="result-box-name">Svar · multikollinearitet</div><div class="result-box-formula">VIF = 1/(1 − R²ⱼ)</div><div class="result-box-value">Alternativ B</div></div>`
	},
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-7`,
		q: `Hvorfor brukes justert R² framfor vanlig R² i multippel regresjon?`,
		a: `Justert R² er alltid høyere`,
		b: `Justert R² måler korrelasjonen direkte`,
		c: `Justert R² straffer for å legge til variabler som ikke bidrar`,
		d: `De er alltid like`,
		correct: `C`,
		explanation: `Vanlig R² stiger (eller står stille) hver gang du legger til en variabel, selv en ubrukelig en. Justert R² trekker fra for antall forklaringsvariabler, så den belønner bare variabler som faktisk forbedrer modellen.`,
		walk: `<div class="walk-intro">Vanlig R² har en svakhet: den <strong>stiger uansett</strong> når du legger til variabler. Justert R² retter på det.</div><div class="piece-row"><span class="formula-lhs">R²</span><span class="formula-op">→</span><div class="piece"><span class="piece-text">stiger alltid</span><span class="piece-label">selv av ubrukelige variabler</span></div><span class="formula-op">vs</span><div class="piece accent"><span class="piece-text">justert R²</span><span class="piece-label">straffer for antall variabler</span></div></div><div class="proc-block"><div class="proc-title">R² mot justert R²</div><div class="proc-step"><strong>Steg 1 — Svakheten.</strong> Vanlig R² går aldri ned når du legger til en variabel, selv en som ikke bidrar.</div><div class="proc-step"><strong>Steg 2 — Korreksjonen.</strong> Justert R² trekker fra for antall forklaringsvariabler (k).</div><div class="proc-step"><strong>Steg 3 — Tolkning.</strong> Bare variabler som faktisk forbedrer modellen løfter justert R²; ubrukelige variabler senker den.</div></div><div class="result-box"><div class="result-box-name">Svar · justert R²</div><div class="result-box-formula">straffer ekstra variabler</div><div class="result-box-value">Alternativ C</div></div>`
	},
	{
		chapter: `Ch 11 — Regresjonsanalyse`,
		qnum: `11-8`,
		q: `I modellen ŷ = β₀ + β₁x der x er en dummy (0/1), hva representerer β₁?`,
		a: `Forskjellen i forventet y mellom de to gruppene (x = 1 mot x = 0)`,
		b: `Stigningstallet per måleenhet`,
		c: `Gjennomsnittet av y`,
		d: `Korrelasjonen mellom gruppene`,
		correct: `A`,
		explanation: `Med en dummy som hopper mellom 0 og 1, er β₁ spranget i forventet y fra referansegruppa (x = 0) til den andre gruppa (x = 1) — ikke en kontinuerlig helling.`,
		walk: `<div class="walk-intro">Når x er en <strong>dummy</strong> (0 eller 1), endrer β₁ betydning: ikke lenger en helling, men et <em>sprang mellom to grupper</em>.</div><div class="piece-row"><span class="formula-lhs">ŷ =</span><div class="piece"><span class="piece-text">β₀</span><span class="piece-label">snitt i referansegruppa (x = 0)</span></div><span class="formula-op">+</span><div class="piece accent"><span class="piece-text">β₁ · x</span><span class="piece-label">tillegg når x = 1</span></div></div><div class="proc-block"><div class="proc-title">Dummy-tolkning — steg for steg</div><div class="proc-step"><strong>Steg 1 — x = 0.</strong> ŷ = β₀ → forventet y i referansegruppa.</div><div class="proc-step"><strong>Steg 2 — x = 1.</strong> ŷ = β₀ + β₁ → forventet y i den andre gruppa.</div><div class="proc-step"><strong>Steg 3 — Differansen.</strong> β₁ = (β₀ + β₁) − β₀ = forskjellen i forventet y mellom gruppene.</div><div class="proc-step"><strong>Fella.</strong> Med en dummy er β₁ ikke en kontinuerlig helling per måleenhet — variabelen hopper bare mellom 0 og 1.</div></div><div class="result-box"><div class="result-box-name">Svar · dummy-koeffisient</div><div class="result-box-formula">β₁ = forskjell mellom gruppe x=1 og x=0</div><div class="result-box-value">Alternativ A</div></div>`
	}
];
