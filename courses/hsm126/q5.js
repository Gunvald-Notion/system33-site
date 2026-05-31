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
		explanation: `β₁ er stigningstallet — hvor mye y endrer seg per enhets økning i x. β₀ er skjæringspunktet (y når x = 0), og ε er feilleddet.`
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
		walk: `<div class="walk-intro">R² og korrelasjonen <strong>r</strong> henger sammen: <strong>|r| = √R²</strong>.</div><div class="result-box"><div class="result-box-name">Korrelasjon</div><div class="result-box-formula">|r| = √0,64</div><div class="result-box-value">|r| = 0,8</div></div><div class="proc-block"><div class="proc-title">Hva R² betyr</div><div class="proc-step"><strong>Andel forklart.</strong> R² = 0,64 betyr at modellen forklarer <em>64 %</em> av variasjonen i y. De resterende 36 % er uforklart (residualer).</div></div><div class="fx-line"><strong>Felle:</strong> R² er ikke r. Ta rota for å få korrelasjonen; fortegnet følger stigningstallet.</div>`
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
		explanation: `F-testen (F = MSR/MSE) vurderer modellen samlet: er minst én av koeffisientene forskjellig fra null? Enkeltkoeffisienter testes med t-test.`
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
		explanation: `Sterkt korrelerte forklaringsvariabler gir multikollinearitet, som blåser opp standardfeilene. VIF = 1/(1 − R²ⱼ) avslører det; en høy VIF (ofte > 5–10) er et varsel.`
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
		explanation: `Vanlig R² stiger (eller står stille) hver gang du legger til en variabel, selv en ubrukelig en. Justert R² trekker fra for antall forklaringsvariabler, så den belønner bare variabler som faktisk forbedrer modellen.`
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
		explanation: `Med en dummy som hopper mellom 0 og 1, er β₁ spranget i forventet y fra referansegruppa (x = 0) til den andre gruppa (x = 1) — ikke en kontinuerlig helling.`
	}
];
