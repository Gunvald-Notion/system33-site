// HSM126 — Gå formelen (regn det ut). Kapittel 9 (hypotesetesting).
var QG9 = [
{chapter:"Kap 9", correct:"A",
 q:String.raw`\(S_{\hat\theta}=20\), \(n=100\). <strong>Regn ut</strong> standardfeilen \(se=\frac{S_{\hat\theta}}{\sqrt{n}}\) (formel 9.9).`,
 a:String.raw`2`, b:String.raw`20`, c:String.raw`10`, d:String.raw`0,2`,
 walk:String.raw`<div class="walk-intro"><strong>Svar: A — 2.</strong></div><div class="proc-block"><div class="proc-title">Steg</div><div class="proc-step"><strong>1 —</strong> \(\sqrt{100}=10\).</div><div class="proc-step"><strong>2 —</strong> \(20/10=2\).</div></div><div class="walk-note">Nevneren testobservatoren bruker.</div>`},
{chapter:"Kap 9", correct:"A",
 q:String.raw`\(\bar{X}=152\), \(H_0:\mu=150\), \(se\approx0{,}913\). <strong>Regn ut</strong> testobservatoren \(t_{TS}=\frac{\hat\theta-\theta_0}{se}\) (formel 9.8).`,
 a:String.raw`≈ 2,19`, b:String.raw`2`, c:String.raw`1,96`, d:String.raw`0,913`,
 walk:String.raw`<div class="walk-intro"><strong>Svar: A — ≈ 2,19.</strong></div><div class="proc-block"><div class="proc-title">Steg</div><div class="proc-step"><strong>1 —</strong> \(152-150=2\).</div><div class="proc-step"><strong>2 —</strong> \(2/0{,}913\approx2{,}19\).</div></div><div class="walk-note">2,19 standardfeil over hypoteseverdien.</div>`},
{chapter:"Kap 9", correct:"A",
 q:String.raw`En test har \(\beta=0{,}20\). <strong>Regn ut</strong> styrken \(\gamma=1-\beta\) (formel 9.3).`,
 a:String.raw`0,80`, b:String.raw`0,20`, c:String.raw`0,95`, d:String.raw`0,05`,
 walk:String.raw`<div class="walk-intro"><strong>Svar: A — 0,80.</strong></div><div class="proc-block"><div class="proc-title">Steg</div><div class="proc-step"><strong>1 —</strong> \(1-0{,}20=0{,}80\).</div></div><div class="walk-note">Sjansen for å fange en effekt som finnes.</div>`},
{chapter:"Kap 9", correct:"A",
 q:String.raw`Hele kjeden. \(n=30\), \(\bar{X}=152\), \(S_X=5\). <strong>Regn ut</strong> standardfeilen \(\frac{S_X}{\sqrt{n}}\) først.`,
 a:String.raw`≈ 0,913`, b:String.raw`1,826`, c:String.raw`5`, d:String.raw`0,167`,
 walk:String.raw`<div class="walk-intro"><strong>Svar: A — ≈ 0,913.</strong></div><div class="proc-block"><div class="proc-title">Steg</div><div class="proc-step"><strong>1 —</strong> \(\sqrt{30}\approx5{,}477\).</div><div class="proc-step"><strong>2 —</strong> \(5/5{,}477\approx0{,}913\).</div></div><div class="walk-note">Mater testobservatoren \(t_{TS}\approx2{,}19\).</div>`},
{chapter:"Kap 9", correct:"B",
 q:String.raw`Oppgaven sier vekta «skiller seg fra» 150 på 5 %-nivå. Hvilken kritisk verdi skal \(t_{TS}\) sammenlignes med?`,
 a:String.raw`1,645 (ensidet)`, b:String.raw`1,96 (tosidet)`, c:String.raw`2,58 (99 %)`, d:String.raw`2,33`,
 walk:String.raw`<div class="walk-intro"><strong>Svar: B — 1,96.</strong> «Skiller seg fra» → tosidet.</div><div class="proc-block"><div class="proc-title">Steg</div><div class="proc-step"><strong>1 —</strong> tosidet 5 % → \(z=1{,}96\).</div><div class="proc-step"><strong>2 —</strong> \(2{,}19>1{,}96\Rightarrow\) forkast \(H_0\).</div></div><div class="walk-note">Oppsettet velges før regninga.</div>`}
];
