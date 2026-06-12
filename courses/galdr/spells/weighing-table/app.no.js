/* === FASTE DATA === */
const VAR_X = [1, 2, 3];
const VAR_P = [0.2, 0.5, 0.3];
const VAR_MU = 2.1;
const VAR_CONTRIBS = [
    { x:1, p:0.2, dist:-1.1, sq:1.21, w:0.242 },
    { x:2, p:0.5, dist:-0.1, sq:0.01, w:0.005 },
    { x:3, p:0.3, dist:0.9,  sq:0.81, w:0.243 }
];

const COV_CELLS = [
    { x:0, y:0, p:0.4, dx:-0.5, dy:-0.5, prod:0.25,  vote:0.10,  zone:'together' },
    { x:0, y:1, p:0.1, dx:-0.5, dy:0.5,  prod:-0.25, vote:-0.025, zone:'opposite' },
    { x:1, y:0, p:0.1, dx:0.5,  dy:-0.5, prod:-0.25, vote:-0.025, zone:'opposite' },
    { x:1, y:1, p:0.4, dx:0.5,  dy:0.5,  prod:0.25,  vote:0.10,  zone:'together' }
];

let mode = 'var', currentStep = 1;

/* === MODUSBYTTE === */
document.querySelectorAll('.mode-btn').forEach(b => {
    b.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        mode = b.dataset.mode;
        currentStep = 1;
        document.querySelectorAll('.step-btn').forEach(s => s.classList.remove('done'));
        renderAll();
    });
});

/* === STEGNAVIGASJON === */
document.querySelectorAll('.step-btn').forEach(b => {
    b.addEventListener('click', () => {
        currentStep = parseInt(b.dataset.step);
        renderStep();
    });
});

function renderAll(){ drawViz(); renderStep(); }

function renderStep(){
    document.querySelectorAll('.step-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.step-btn')[currentStep-1].classList.add('active');
    const el = document.getElementById('step-container');
    if(mode === 'var') renderVarStep(el);
    else renderCovStep(el);
}

/* === VARIANS-STEG === */
function renderVarStep(el){
    if(currentStep === 1){
        el.innerHTML = '<div class="step-content"><h3>Steg 1 — Plantegning</h3>'+
            '<p>Kjenn igjen spørsmålet: <strong>hvor langt sprer verdiene seg fra senteret?</strong></p>'+
            '<p>Ikke avstanden til én enkelt verdi — den gjennomsnittlige kvadrerte avstanden over alle verdiene, vektet med sannsynlighet. Det er huset du står i.</p>'+
            '<p style="color:var(--accent);font-weight:500;margin-top:12px">Var[X] = Σ (xᵢ − μ)² · P(xᵢ)</p>'+
            '<p style="margin-top:12px">Formelen ender i <strong>to</strong> tall: <strong>μ</strong>, senteret — der verdiene balanserer — og <strong>σ</strong>, hvor langt de typisk sitter fra det. Var[X] er haugen du bygger på veien; σ er svaret du kan skritte opp på tallinjen.</p>'+
            '</div>';
    } else if(currentStep === 2){
        el.innerHTML = '<div class="step-content"><h3>Steg 2 — Prosessen</h3>'+
            '<p>Tre etapper, i rekkefølge — nøyaktig de samme tre du skal gå i Steg 4. Hver etappe svarer til én del av formelen.</p>'+
            '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
            '<div class="proc-step"><strong>Etappe 1 — Finn senteret (μ).</strong> E[X] = μ. Du trenger dette før alt annet, fordi hele formelen måler avstand <em>fra</em> dette punktet.</div>'+
            '<div class="proc-step"><strong>Etappe 2 — Bygg haugen (Var).</strong> For hver verdi: trekk fra μ for å få avstanden, kvadrer den — kvadreringen fjerner retning (du bryr deg bare om <em>hvor langt</em>, ikke <em>hvilken side</em>) og forsterker store gap — og gang med P(xᵢ) for å vekte den. Summer hvert vektede kvadrat med Σ. Den haugen er Var[X].</div>'+
            '<div class="proc-step"><strong>Etappe 3 — Brett tilbake til σ.</strong> Haugen er i <em>kvadrerte</em> enheter — et areal som svæver over linjen, ikke en lengde. Ta kvadratroten for å lande tilbake på aksen. √Var = σ, standardavviket: den typiske avstanden fra senteret, i samme enheter som verdiene.</div>'+
            '<div class="proc-step" style="margin-top:10px;color:var(--accent)">Etappe 2: &nbsp; Var[X] = Σ (xᵢ − μ)² · P(xᵢ)</div>'+
            '<div class="proc-step" style="margin-top:4px;color:var(--accent)">Etappe 3: &nbsp; σ = √Var[X]</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">Rommet</div>'+
            '<div class="proc-step">Du står i senteret av et rom. Hver mulig verdi er en person som står et sted. Noen står nært, noen langt unna. Hver person har en vekt — hvor sannsynlig det er at de dukker opp. Mål avstanden, kvadrer den, gang med vekten, kast den på haugen. Haugen er hvor spredt rommet er — og kvadratroten av den er hvor langt en person i snitt står fra deg.</div>'+
            '</div></div>';
    } else if(currentStep === 3){
        el.innerHTML = '<div class="step-content"><h3>Steg 3 — Dataene</h3>'+
            '<p>Denne stasjonen er bare for å <strong>lese</strong> det du har fått utdelt. Ingen løsing ennå — se på tabellen og forstå hva den beskriver.</p>'+
            '<div class="data-card"><table class="data-table">'+
            '<tr><th>xᵢ</th><td>1</td><td>2</td><td>3</td></tr>'+
            '<tr><th>P(xᵢ)</th><td>0.2</td><td>0.5</td><td>0.3</td></tr>'+
            '</table></div>'+
            '<p>X kan lande på tre verdier — 1, 2 eller 3 — hver med sin egen sannsynlighet. Vektene summerer til 1 (0.2 + 0.5 + 0.3 = 1), så dette er en komplett fordeling: ingenting mangler, ingenting er til overs.</p>'+
            '<p>Midtverdien bærer mest vekt (0.5), og de to endene er lettere. Så før noe regnestykke kan du allerede <em>kjenne</em> hvor dette vil balansere — et sted nær 2, dratt litt mot 3. Den magefølelsen er alt du tar med fra denne stasjonen. Å faktisk finne senteret er første trekk i løsingen — Steg 4.</p>'+
            '</div>';
        markDone(2);
    } else if(currentStep === 4){
        let html = '<div class="step-content"><h3>Steg 4 — Kjør formelen</h3>'+
            '<p>Nå løsingen — de samme tre etappene fra Prosessen, alltid i denne rekkefølgen. Hver etappe lener seg på den før, så du starter aldri i midten.</p>';
        html += '<div class="derivation"><div class="d-label">Etappe 1 — Finn senteret (μ)</div>'+
            '<div class="d-line">Du kan ikke måle en avstand før du vet punktet du måler <em>fra</em>. Så første trekk, hver gang, er å finne senteret.</div>'+
            '<div class="d-line">μ = 1×0.2 + 2×0.5 + 3×0.3 = 0.2 + 1.0 + 0.9 = <strong>2.1</strong></div></div>';
        html += '<div class="result-box"><div class="result-box-name">Resultat etappe 1 — senteret</div>'+
            '<div class="result-box-formula">μ = Σ xᵢ · P(xᵢ)</div>'+
            '<div class="result-box-value">μ = 2.1</div></div>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Etappe 2 — Bygg haugen.</strong> Stå nå i μ = 2.1 og gå til hver verdi: mål avstanden, kvadrer den, vekt den med sannsynligheten, kast den på haugen.</p>';
        let pile = 0;
        VAR_CONTRIBS.forEach((c, i) => {
            pile += c.w;
            html += '<div class="derivation"><div class="d-label">Runde '+(i+1)+': x = '+c.x+'</div>'+
                '<div class="d-line">Avstand fra senteret: '+c.x+' − 2.1 = <strong>'+c.dist.toFixed(1)+'</strong></div>'+
                '<div class="d-line">Kvadrer: ('+c.dist.toFixed(1)+')² = '+c.sq.toFixed(2)+'</div>'+
                '<div class="d-line">Vekt: '+c.sq.toFixed(2)+' × '+c.p+' = <strong>'+c.w.toFixed(3)+'</strong></div>'+
                '<div class="d-line">Haug = '+pile.toFixed(3)+'</div></div>';
        });
        html += '<div class="result-box"><div class="result-box-name">Resultat etappe 2 — haugen, Var[X]</div>'+
            '<div class="result-box-formula">0.242 + 0.005 + 0.243</div>'+
            '<div class="result-box-value">Var[X] = 0.49</div></div>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Etappe 3 — Brett tilbake til σ.</strong> Haugen lever i kvadrerte enheter. Opphev kvadreringen for å lande tilbake på tallinjen som en ekte avstand.</p>';
        html += '<div class="derivation"><div class="d-label">Etappe 3 — Brett haugen tilbake på linjen</div>'+
            '<div class="d-line">Haugen er <strong>0.49</strong> — men se på enhetene. Vi <em>kvadrerte</em> hver avstand, så 0.49 lever i kvadrert rom: et areal som svæver over tallinjen, ikke en avstand du kan gå.</div>'+
            '<div class="d-line">Opphev kvadratet. Ta roten: <strong>√0.49 = 0.7</strong>.</div>'+
            '<div class="d-line">Den 0.7 er <strong>σ</strong> (sigma) — <strong>standardavviket</strong>. Det er den typiske avstanden en verdi sitter fra senteret μ = 2.1, målt tilbake på samme akse som verdiene selv. Ikke gapet mellom verdiene — spredningen, brettet tilbake til et ekte skritt.</div></div>';
        html += '<div class="result-box"><div class="result-box-name">Resultat etappe 3 — σ, standardavvik</div>'+
            '<div class="result-box-formula">σ = √Var[X] = √0.49</div>'+
            '<div class="result-box-value">σ = 0.7 — typisk avstand fra senteret</div></div>';
        html += '<p style="color:var(--text2);font-size:.85rem;margin-top:14px">Så fordelingen <strong>puster</strong>: fra 2.1 − 0.7 = <strong>1.4</strong> ut til 2.1 + 0.7 = <strong>2.8</strong>. Det båndet rundt senteret er der vekten stort sett sitter.</p>';
        html += '<p style="color:var(--text2);font-size:.85rem;margin-top:10px">Verdiene 1 og 3 bidrar nesten likt (0.242 og 0.243) selv om 3 er nærmere senteret — fordi 1 har større avstand og kvadreringen forsterket den. Verdien 2 bidrar nesten ingenting (0.005) fordi den sitter rett ved senteret.</p>';
        html += '</div>';
        el.innerHTML = html;
        markDone(3);
    }
}

/* === KOVARIANS-STEG === */
function renderCovStep(el){
    if(currentStep === 1){
        el.innerHTML = '<div class="step-content"><h3>Steg 1 — Plantegning</h3>'+
            '<p>Kjenn igjen spørsmålet: <strong>når X beveger seg, beveger Y seg med?</strong></p>'+
            '<p>To variabler på et plan. X løper langs bunnen, Y opp siden. Hver observasjon har både en X-verdi og en Y-verdi. Formelen sjekker om de beveger seg i samme retning. <em>(Y er bare navnet på den andre variabelen — vi bruker bevisst Y, aldri E, så den ikke kan forveksles med Eulers e fra Kap 7.)</em></p>'+
            '<p style="color:var(--accent);font-weight:500;margin-top:12px">Cov(X,Y) = ΣΣ (xᵢ − μ<sub>X</sub>)(yⱼ − μ<sub>Y</sub>) · P(xᵢ, yⱼ)</p>'+
            '<p style="margin-top:12px">Formelen ender i <strong>to</strong> tall: <strong>Cov</strong>, den rå haugen av sammen-mot-fra-hverandre-stemmer, og <strong>ρ</strong> (rho), det samme signalet brettet inn på en fast skala fra −1 til +1, så du kan bedømme hvor <em>sterk</em> koblingen er, ikke bare retningen.</p>'+
            '</div>';
    } else if(currentStep === 2){
        el.innerHTML = '<div class="step-content"><h3>Steg 2 — Prosessen</h3>'+
            '<p>Tre etapper, i rekkefølge — nøyaktig de samme tre du skal gå i Steg 4. Hver etappe svarer til én del av formelen.</p>'+
            '<div class="proc-block"><div class="proc-title">Framgangsmåte</div>'+
            '<div class="proc-step"><strong>Etappe 1 — Finn begge sentrene (μ<sub>X</sub>, μ<sub>Y</sub>).</strong> Hver variabel har sitt eget senter, funnet på Kap 5-måten — μ = Σ verdi · P(verdi) langs sin egen marg. Du trenger begge før alt annet, fordi hele formelen måler avstand <em>fra</em> disse to punktene.</div>'+
            '<div class="proc-step"><strong>Etappe 2 — Bygg haugen (Cov).</strong> Gå gjennom hver celle i simultantabellen. I hver av dem: mål X sin avstand fra μ<sub>X</sub> og Y sin avstand fra μ<sub>Y</sub>, gang de to (retningsdetektoren — samme side gir +, motsatte sider gir −), og vekt med simultansannsynligheten P(xᵢ, yⱼ). Summer hver vektede stemme med ΣΣ. Den haugen er Cov(X,Y).</div>'+
            '<div class="proc-step"><strong>Etappe 3 — Brett til ρ.</strong> Rå kovarians er i blandede enheter og har ikke noe fast tak, så størrelsen er vanskelig å lese. Del på hver variabels egen spredning — σ<sub>X</sub> · σ<sub>Y</sub> — for å brette den inn på en fast skala fra −1 til +1. ρ er det rene retningssignalet: hvor tett de beveger seg sammen, strippet for enheter.</div>'+
            '<div class="proc-step" style="margin-top:10px;color:var(--accent)">Etappe 2: &nbsp; Cov(X,Y) = ΣΣ (xᵢ − μ<sub>X</sub>)(yⱼ − μ<sub>Y</sub>) · P(xᵢ, yⱼ)</div>'+
            '<div class="proc-step" style="margin-top:4px;color:var(--accent)">Etappe 3: &nbsp; ρ = Cov(X,Y) / (σ<sub>X</sub> · σ<sub>Y</sub>)</div>'+
            '</div>'+
            '<div class="proc-block"><div class="proc-title">De fire sonene</div>'+
            '<div class="proc-step">Senterpunktet (μ<sub>X</sub>, μ<sub>Y</sub>) deler planet i fire soner. Øverst til høyre og nederst til venstre er «sammen»-soner (samme side, positivt produkt). Øverst til venstre og nederst til høyre er «motsatt»-soner (ulike sider, negativt produkt). Etappe 2 går gjennom hver celle, sjekker hvilken sone den lander i, vekter med sannsynlighet, og legger på haugen.</div>'+
            '</div></div>';
    } else if(currentStep === 3){
        el.innerHTML = '<div class="step-content"><h3>Steg 3 — Dataene</h3>'+
            '<p>Denne stasjonen er bare for å <strong>lese</strong> det du har fått utdelt. Ingen løsing ennå — se på simultantabellen og forstå hva den beskriver.</p>'+
            '<div class="data-card"><div class="data-title">Simultan sannsynlighetstabell</div><table class="data-table">'+
            '<tr><th></th><th>X = 0</th><th>X = 1</th></tr>'+
            '<tr><th>Y = 1</th><td>0.1</td><td>0.4</td></tr>'+
            '<tr><th>Y = 0</th><td>0.4</td><td>0.1</td></tr>'+
            '</table></div>'+
            '<p>X og Y lander hver på 0 eller 1, så tabellen har fire celler — én for hver (X, Y)-kombinasjon. De fire sannsynlighetene summerer til 1 (0.4 + 0.1 + 0.1 + 0.4 = 1), så dette er en komplett simultanfordeling: ingenting mangler.</p>'+
            '<p>Se hvor massen sitter. De tunge cellene (0.4 hver) er de der X og Y er <em>enige</em> — begge 0, eller begge 1. De lette cellene (0.1 hver) er der de er uenige. Så før noe regnestykke kan du allerede <em>kjenne</em> hellingen: disse to ser ut til å stige og falle sammen. Den magefølelsen er alt du tar med fra denne stasjonen. Å finne de to sentrene, og så bevise hellingen med et tall, er løsingen — Steg 4.</p>'+
            '</div>';
        markDone(2);
    } else if(currentStep === 4){
        let html = '<div class="step-content"><h3>Steg 4 — Kjør formelen</h3>'+
            '<p>Nå løsingen — de samme tre etappene fra Prosessen, alltid i denne rekkefølgen. Hver etappe lener seg på den før, så du starter aldri i midten.</p>';
        html += '<div class="derivation"><div class="d-label">Etappe 1 — Finn begge sentrene (μ<sub>X</sub>, μ<sub>Y</sub>)</div>'+
            '<div class="d-line">Du kan ikke måle en avstand før du vet punktene du måler <em>fra</em>. Hver variabel har sitt eget senter, funnet langs sin egen marg (legg sammen langs raden eller kolonnen).</div>'+
            '<div class="d-line">P(X=0) = 0.4 + 0.1 = 0.5, &nbsp; P(X=1) = 0.1 + 0.4 = 0.5 &nbsp;→&nbsp; μ<sub>X</sub> = 0×0.5 + 1×0.5 = <strong>0.5</strong></div>'+
            '<div class="d-line">P(Y=0) = 0.4 + 0.1 = 0.5, &nbsp; P(Y=1) = 0.1 + 0.4 = 0.5 &nbsp;→&nbsp; μ<sub>Y</sub> = 0×0.5 + 1×0.5 = <strong>0.5</strong></div></div>';
        html += '<div class="result-box"><div class="result-box-name">Resultat etappe 1 — de to sentrene</div>'+
            '<div class="result-box-formula">μ<sub>X</sub> = Σ xᵢ · P(xᵢ) &nbsp;&nbsp; μ<sub>Y</sub> = Σ yⱼ · P(yⱼ)</div>'+
            '<div class="result-box-value">μ<sub>X</sub> = 0.5 &nbsp;&middot;&nbsp; μ<sub>Y</sub> = 0.5</div></div>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Etappe 2 — Bygg haugen.</strong> Stå nå i senterpunktet (0.5, 0.5) og gå gjennom hver celle: mål begge avstandene, gang dem (retningsdetektoren), vekt med simultansannsynligheten, kast stemmen på haugen.</p>';
        const labels = ['Nederst til venstre (X=0, Y=0)', 'Øverst til venstre (X=0, Y=1)', 'Nederst til høyre (X=1, Y=0)', 'Øverst til høyre (X=1, Y=1)'];
        let pile = 0;
        [0,1,2,3].forEach((idx, i) => {
            const c = COV_CELLS[idx];
            pile += c.vote;
            const dir = c.zone === 'together' ? 'Samme side → positiv' : 'Motsatte sider → negativ';
            const voteColor = c.vote > 0 ? 'var(--green)' : 'var(--red)';
            const voteWord = c.vote > 0 ? 'sammen' : 'fra hverandre';
            html += '<div class="derivation"><div class="d-label">'+labels[i]+'</div>'+
                '<div class="d-line">X-avstand: '+c.x+' − 0.5 = '+c.dx.toFixed(1)+' &nbsp; Y-avstand: '+c.y+' − 0.5 = '+c.dy.toFixed(1)+'</div>'+
                '<div class="d-line">Retningsdetektor: ('+c.dx.toFixed(1)+')('+c.dy.toFixed(1)+') = '+c.prod.toFixed(2)+' &nbsp; <span style="color:var(--muted)">'+dir+'</span></div>'+
                '<div class="d-line">Vekt: '+c.prod.toFixed(2)+' × '+c.p+' = <strong style="color:'+voteColor+'">'+c.vote.toFixed(3)+'</strong> — stemmer <em>'+voteWord+'</em></div>'+
                '<div class="d-line">Haug = '+pile.toFixed(3)+'</div></div>';
        });
        html += '<div class="result-box"><div class="result-box-name">Resultat etappe 2 — haugen, Cov(X,Y)</div>'+
            '<div class="result-box-formula">+0.10 − 0.025 − 0.025 + 0.10</div>'+
            '<div class="result-box-value" style="color:var(--green)">Cov(X,Y) = +0.15</div></div>';
        html += '<p style="color:var(--text2);font-size:.85rem;margin-top:14px">Positiv — sammen-stemmene vant. Men +0.15 alene er vanskelig å lese: er det en sterk kobling eller en svak? Det rå tallet er i blandede X·Y-enheter og har ikke noe fast tak. Det er det Etappe 3 fikser.</p>';
        html += '<p style="color:var(--text2);font-size:.9rem;margin-top:22px"><strong>Etappe 3 — Brett til ρ.</strong> Skaler den rå haugen med hver variabels egen spredning, så den lander på en fast, lesbar skala.</p>';
        html += '<div class="derivation"><div class="d-label">Etappe 3 — Brett kovariansen inn på [−1, 1]-skalaen</div>'+
            '<div class="d-line">Først, hver variabels egen spredning — Kap 5-tabellen brukt på hver marg. Både X og Y er 0/1-variabler sentrert i 0.5:</div>'+
            '<div class="d-line">Var = (0−0.5)²×0.5 + (1−0.5)²×0.5 = 0.25 &nbsp;→&nbsp; σ<sub>X</sub> = σ<sub>Y</sub> = √0.25 = <strong>0.5</strong></div>'+
            '<div class="d-line">Del nå kovariansen på produktet av spredningene: ρ = 0.15 / (0.5 × 0.5) = 0.15 / 0.25 = <strong>0.6</strong></div>'+
            '<div class="d-line">ρ = 0.6 er enhetsløs og begrenset: 0 betyr ingen lineær kobling, +1 perfekt låst sammen, −1 perfekt motsatt. Så +0.6 er en <strong>moderat sterk positiv</strong> kobling — nå kan du bedømme <em>størrelsen</em>, noe den rå kovariansen aldri lot deg gjøre.</div></div>';
        html += '<div class="result-box"><div class="result-box-name">Resultat etappe 3 — ρ, korrelasjon</div>'+
            '<div class="result-box-formula">ρ = Cov(X,Y) / (σ<sub>X</sub> · σ<sub>Y</sub>) = 0.15 / 0.25</div>'+
            '<div class="result-box-value" style="color:var(--green)">ρ = 0.6 — moderat sterk, positiv</div></div>';
        html += '</div>';
        el.innerHTML = html;
        markDone(3);
    }
}

function markDone(upTo){
    document.querySelectorAll('.step-btn').forEach((b,i) => {
        if(i < upTo) b.classList.add('done');
    });
}

/* === VISUALISERINGER === */
function drawViz(){
    if(mode === 'var') drawVarianceViz();
    else drawCovarianceViz();
}

function drawVarianceViz(){
    document.getElementById('viz-label').textContent = 'Spredningen';
    document.getElementById('viz-title').textContent = 'Avstand fra senteret';
    document.getElementById('viz-desc').textContent = 'Tre verdier målt fra μ = 2.1. Det grønne spennet er σ = 0.7 — ett typisk skritt fra senteret. Søyler = hver verdis bidrag til haugen.';

    const wrap = document.getElementById('viz-wrap');
    const canvas = document.getElementById('viz-canvas');
    const dpr = window.devicePixelRatio || 1;
    const cw = wrap.clientWidth - 18;
    const ch = 400;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, cw, ch);

    const accent = '#a78bfa', green = '#22c55e', text2 = '#a1a1aa', muted = '#71717a', border = '#27272a';

    const lineY = 55;
    const padL = 50, padR = 50;
    const rangeW = cw - padL - padR;
    const xMin = 0.5, xMax = 3.5;
    function toX(v){ return padL + (v - xMin) / (xMax - xMin) * rangeW; }

    ctx.beginPath(); ctx.moveTo(padL, lineY); ctx.lineTo(cw - padR, lineY);
    ctx.strokeStyle = border; ctx.lineWidth = 1; ctx.stroke();

    [1, 2, 3].forEach(v => {
        const x = toX(v);
        ctx.beginPath(); ctx.moveTo(x, lineY - 5); ctx.lineTo(x, lineY + 5);
        ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 1; ctx.stroke();
    });

    const muX = toX(VAR_MU);
    ctx.beginPath(); ctx.setLineDash([4, 3]);
    ctx.moveTo(muX, lineY - 28); ctx.lineTo(muX, lineY + 28);
    ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = accent; ctx.font = 'bold 12px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('μ = 2.1', muX, lineY - 30);

    VAR_CONTRIBS.forEach(c => {
        const x = toX(c.x);
        const r = 14;
        ctx.beginPath(); ctx.arc(x, lineY, r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167,139,250,0.2)'; ctx.fill();
        ctx.strokeStyle = accent; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = '#fafafa'; ctx.font = 'bold 12px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(c.x.toString(), x, lineY);
    });

    const sig = 0.7;
    const sLeft = toX(VAR_MU - sig), sRight = toX(VAR_MU + sig);
    const bandY = 90;
    ctx.strokeStyle = 'rgba(34,197,94,0.45)'; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(muX, lineY + 14); ctx.lineTo(muX, bandY); ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(sLeft, bandY); ctx.lineTo(sRight, bandY);
    ctx.strokeStyle = green; ctx.lineWidth = 1.5; ctx.stroke();
    [sLeft, muX, sRight].forEach(xx => {
        ctx.beginPath(); ctx.moveTo(xx, bandY - 5); ctx.lineTo(xx, bandY + 5);
        ctx.strokeStyle = green; ctx.lineWidth = 1.5; ctx.stroke();
    });
    ctx.fillStyle = green; ctx.font = 'bold 10px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('← σ = 0.7', (sLeft + muX) / 2, bandY - 4);
    ctx.fillText('σ = 0.7 →', (sRight + muX) / 2, bandY - 4);
    ctx.fillStyle = text2; ctx.font = '10px Inter,sans-serif'; ctx.textBaseline = 'top';
    ctx.fillText('1.4', sLeft, bandY + 7);
    ctx.fillText('2.8', sRight, bandY + 7);

    const cardTop = 124;
    const cardH = 52;
    const cardW = Math.min((cw - 40) / 3 - 8, 200);
    const totalCardsW = 3 * cardW + 2 * 12;
    const cardStartX = (cw - totalCardsW) / 2;

    VAR_CONTRIBS.forEach((c, i) => {
        const cx = cardStartX + i * (cardW + 12);
        const cy = cardTop;
        ctx.fillStyle = 'rgba(167,139,250,0.05)';
        ctx.strokeStyle = 'rgba(167,139,250,0.15)';
        ctx.lineWidth = 1;
        roundRect(ctx, cx, cy, cardW, cardH, 6);
        ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fafafa'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('x = ' + c.x, cx + 8, cy + 7);
        ctx.fillStyle = muted; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('P = ' + c.p, cx + cardW - 8, cy + 7);
        ctx.fillStyle = text2; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
        ctx.fillText('avstand: ' + c.dist.toFixed(1) + '  →  kvadrat: ' + c.sq.toFixed(2), cx + 8, cy + 25);
        ctx.fillStyle = accent; ctx.font = 'bold 10px Inter,sans-serif';
        ctx.fillText('×' + c.p + ' = ' + c.w.toFixed(3), cx + 8, cy + 38);
    });

    const barTop = 199;
    const barH = 28;
    const barSpacing = 42;
    const maxBarW = cw - 160;
    const maxW = 0.243;

    ctx.fillStyle = muted; ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText('Bidrag til haugen', cw / 2, barTop - 6);

    VAR_CONTRIBS.forEach((c, i) => {
        const by = barTop + i * barSpacing;
        const bw = (c.w / maxW) * maxBarW;
        ctx.fillStyle = text2; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
        ctx.fillText('x = ' + c.x, 55, by + barH / 2);
        const barX = 65;
        ctx.fillStyle = c.w > 0.1 ? 'rgba(167,139,250,0.3)' : 'rgba(167,139,250,0.08)';
        roundRect(ctx, barX, by, Math.max(bw, 4), barH, 4);
        ctx.fill();
        ctx.strokeStyle = c.w > 0.1 ? accent : 'rgba(167,139,250,0.3)';
        ctx.lineWidth = 1;
        roundRect(ctx, barX, by, Math.max(bw, 4), barH, 4);
        ctx.stroke();
        ctx.fillStyle = '#fafafa'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(c.w.toFixed(3), barX + Math.max(bw, 4) + 8, by + barH / 2);
    });

    const totalY = barTop + 3 * barSpacing + 5;
    ctx.fillStyle = green; ctx.font = 'bold 14px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('Haug = 0.49', cw / 2, totalY);
    ctx.fillStyle = text2; ctx.font = '12px Inter,sans-serif';
    ctx.fillText('σ = √0.49 = 0.7 = typisk skritt fra μ', cw / 2, totalY + 22);
}

function roundRect(ctx, x, y, w, h, r){
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
}

function drawCovarianceViz(){
    document.getElementById('viz-label').textContent = 'Planet';
    document.getElementById('viz-title').textContent = 'Fire soner';
    document.getElementById('viz-desc').textContent = 'Sammen-soner (grønt) mot motsatt-soner (rødt). Prikkstørrelse = sannsynlighet.';

    const wrap = document.getElementById('viz-wrap');
    const canvas = document.getElementById('viz-canvas');
    const dpr = window.devicePixelRatio || 1;
    const cw = wrap.clientWidth - 18;
    const ch = 340;
    canvas.width = cw * dpr; canvas.height = ch * dpr;
    canvas.style.width = cw + 'px'; canvas.style.height = ch + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr); ctx.clearRect(0, 0, cw, ch);

    const accent = '#a78bfa', green = '#22c55e', red = '#ef4444', text2 = '#a1a1aa', muted = '#71717a', border = '#27272a';

    const pad = 60;
    const gridSize = Math.min(cw - pad * 2, ch - 80);
    const gx = (cw - gridSize) / 2;
    const gy = 30;
    const midGX = gx + gridSize / 2;
    const midGY = gy + gridSize / 2;

    ctx.fillStyle = 'rgba(239,68,68,0.06)';
    ctx.fillRect(gx, gy, gridSize / 2, gridSize / 2);
    ctx.fillStyle = 'rgba(34,197,94,0.06)';
    ctx.fillRect(midGX, gy, gridSize / 2, gridSize / 2);
    ctx.fillStyle = 'rgba(34,197,94,0.06)';
    ctx.fillRect(gx, midGY, gridSize / 2, gridSize / 2);
    ctx.fillStyle = 'rgba(239,68,68,0.06)';
    ctx.fillRect(midGX, midGY, gridSize / 2, gridSize / 2);

    ctx.strokeStyle = border; ctx.lineWidth = 1;
    ctx.strokeRect(gx, gy, gridSize, gridSize);

    ctx.beginPath(); ctx.setLineDash([4, 3]);
    ctx.moveTo(midGX, gy); ctx.lineTo(midGX, gy + gridSize);
    ctx.moveTo(gx, midGY); ctx.lineTo(gx + gridSize, midGY);
    ctx.strokeStyle = accent; ctx.lineWidth = 1; ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = accent; ctx.font = '9px Inter,sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'bottom';
    ctx.fillText('(μX, μY)', midGX + 4, midGY - 4);

    ctx.fillStyle = text2; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('X →', gx + gridSize / 2, gy + gridSize + 8);
    ctx.save(); ctx.translate(gx - 12, gy + gridSize / 2); ctx.rotate(-Math.PI / 2);
    ctx.fillText('Y →', 0, 0); ctx.restore();

    ctx.font = '10px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = red; ctx.fillText('MOTSATT', gx + gridSize * 0.25, gy + gridSize * 0.15);
    ctx.fillStyle = 'rgba(239,68,68,0.5)'; ctx.font = '8px Inter,sans-serif'; ctx.fillText('produkt: −', gx + gridSize * 0.25, gy + gridSize * 0.22);
    ctx.fillStyle = green; ctx.font = '10px Inter,sans-serif'; ctx.fillText('SAMMEN', gx + gridSize * 0.75, gy + gridSize * 0.15);
    ctx.fillStyle = 'rgba(34,197,94,0.5)'; ctx.font = '8px Inter,sans-serif'; ctx.fillText('produkt: +', gx + gridSize * 0.75, gy + gridSize * 0.22);
    ctx.fillStyle = green; ctx.font = '10px Inter,sans-serif'; ctx.fillText('SAMMEN', gx + gridSize * 0.25, gy + gridSize * 0.85);
    ctx.fillStyle = 'rgba(34,197,94,0.5)'; ctx.font = '8px Inter,sans-serif'; ctx.fillText('produkt: +', gx + gridSize * 0.25, gy + gridSize * 0.92);
    ctx.fillStyle = red; ctx.font = '10px Inter,sans-serif'; ctx.fillText('MOTSATT', gx + gridSize * 0.75, gy + gridSize * 0.85);
    ctx.fillStyle = 'rgba(239,68,68,0.5)'; ctx.font = '8px Inter,sans-serif'; ctx.fillText('produkt: −', gx + gridSize * 0.75, gy + gridSize * 0.92);

    const dotPositions = [
        { x: gx + gridSize * 0.25, y: gy + gridSize * 0.75, p: 0.4, label: 'P=0.4', color: green },
        { x: gx + gridSize * 0.25, y: gy + gridSize * 0.35, p: 0.1, label: 'P=0.1', color: red },
        { x: gx + gridSize * 0.75, y: gy + gridSize * 0.75, p: 0.1, label: 'P=0.1', color: red },
        { x: gx + gridSize * 0.75, y: gy + gridSize * 0.35, p: 0.4, label: 'P=0.4', color: green }
    ];

    dotPositions.forEach(d => {
        const r = 8 + d.p * 30;
        ctx.beginPath(); ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fillStyle = d.color === green ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)';
        ctx.fill();
        ctx.strokeStyle = d.color; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = '#fafafa'; ctx.font = 'bold 11px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(d.label, d.x, d.y);
    });

    ctx.fillStyle = muted; ctx.font = '10px Inter,sans-serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('X=0', gx + gridSize * 0.25, gy + gridSize + 20);
    ctx.fillText('X=1', gx + gridSize * 0.75, gy + gridSize + 20);
    ctx.textAlign = 'right'; ctx.textBaseline = 'middle';
    ctx.fillText('Y=0', gx - 8, gy + gridSize * 0.75);
    ctx.fillText('Y=1', gx - 8, gy + gridSize * 0.35);

    ctx.fillStyle = green; ctx.font = 'bold 13px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText('Cov(X,Y) = +0.15  →  ρ = 0.6 (moderat sterk, positiv)', cw / 2, gy + gridSize + 38);
}

/* === INIT === */
renderAll();
