(function(){
  if(window.__drTestInit){ return; }
  window.__drTestInit = true;

  var GREEN = "#22c55e", RED = "#ef4444", ACCENT = "#a78bfa";
  var BTN = "background:#fafafa;color:#0a0a0b;border:none;border-radius:10px;padding:11px 18px;font-family:inherit;font-size:.85rem;font-weight:600;cursor:pointer";
  var BTN2 = "background:transparent;color:#fafafa;border:1px solid #27272a;border-radius:10px;padding:11px 18px;font-family:inherit;font-size:.85rem;font-weight:600;cursor:pointer";
  var INP = "background:#0a0a0b;border:1px solid #27272a;border-radius:8px;padding:9px 12px;font-family:inherit;font-size:.95rem;color:#fafafa;width:160px;text-align:center";

  function byId(id){ return document.getElementById(id); }
  function ri(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function rc(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
  function fact(n){ var r=1; for(var i=2;i<=n;i++){ r*=i; } return r; }
  function nPr(n,s){ var r=1; for(var i=0;i<s;i++){ r*=(n-i); } return r; }
  function nCr(n,s){ return nPr(n,s)/fact(s); }
  function grp(v){ return v.toLocaleString("en-US"); }

  var WHY = {
    what: "Telling svarer på ett spørsmål: hvor mange ulike måter kan dette skje på? Drainage er motoren — du trekker elementer fra et basseng, og hvilken formel du griper etter, avhenger av bare to ting: teller rekkefølgen, og fylles bassenget på nytt.",
    use: "Hver sannsynlighet som starter med gunstige over mulige, hviler på en telling. Lottosjanser, hvor mange PIN-koder som finnes, hvor mange komiteer eller pallplasser eller bordplasseringer som er mulige — alt sammen er Drainage som mater Laplace.",
    exam: "Eksamen forteller deg nesten aldri hvilken formel du skal bruke. Den gjemmer valget i ordlyden — rangert eller ikke, med eller uten tilbakelegging. Den egentlige ferdigheten som testes, er å lese de to signalene før du rører et tall.",
    fun: "Får du de to spørsmålene riktig, faller tellingen ut av seg selv. De fleste tapte poengene her er ikke regnefeil — de kommer av å gripe nPr når oppgaven egentlig ville ha nCr."
  };

  var D = null, selOrder = null, selRefill = null;

  function gen(){
    var type = rc(["ns","npr","ncr"]);
    var N, S, count, prob, order, refill;
    if(type === "ns"){
      N = ri(2,8); S = ri(3,5); count = Math.pow(N,S);
      prob = "Du bygger en kode med lengde " + S + ". Hver posisjon kan være ett av " + N + " symboler, og et symbol kan brukes så mange ganger du vil.";
      order = "ordered"; refill = "refills";
    } else if(type === "npr"){
      N = ri(6,12); S = ri(2,4); count = nPr(N,S);
      prob = "Av " + N + " løpere tar de første " + S + " over målstreken en rangert pall (1., 2. og så videre). Ingen løper kan ha to plasser.";
      order = "ordered"; refill = "drains";
    } else {
      N = ri(6,12); S = ri(2,4); count = nCr(N,S);
      prob = "Du velger en gruppe på " + S + " personer fra " + N + " kandidater. Alle som velges teller likt — rekkefølgen du velger dem i, spiller ingen rolle.";
      order = "unordered"; refill = "drains";
    }
    return { type:type, N:N, S:S, count:count, prob:prob, order:order, refill:refill };
  }

  function whyCard(){
    return '<div style="background:#111113;border-left:3px solid ' + ACCENT + ';border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 20px">'
      + '<div style="font-size:.72rem;color:#71717a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Hvorfor denne formelen betyr noe</div>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0 0 10px"><strong style="color:#fafafa">Hva det er. </strong>' + WHY.what + '</p>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0 0 10px"><strong style="color:#fafafa">Hvor det biter. </strong>' + WHY.use + '</p>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0 0 10px"><strong style="color:#fafafa">På eksamen. </strong>' + WHY.exam + '</p>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0"><strong style="color:#fafafa">Det gøye. </strong>' + WHY.fun + '</p>'
      + '</div>';
  }

  function derivBox(label, inner){
    return '<div class="derivation"><div class="d-label">' + label + '</div>' + inner + '</div>';
  }

  function workHTML(){
    if(D.type === "ns"){
      var seq = []; for(var i=0;i<D.S;i++){ seq.push(D.N); }
      var inner = '<div class="d-line">' + seq.join(" × ") + '</div>'
        + '<div class="d-line"><strong>' + D.N + "^" + D.S + " = " + grp(D.count) + '</strong></div>';
      return derivBox("Hver av de " + D.S + " rundene beholder alle " + D.N + " valgene", inner);
    } else if(D.type === "npr"){
      var p = []; for(var j=0;j<D.S;j++){ p.push(D.N-j); }
      var inner2 = '<div class="d-line">nPr = N! / (N−S)! = ' + D.N + "! / " + (D.N-D.S) + '!</div>'
        + '<div class="d-line">' + p.join(" × ") + '</div>'
        + '<div class="d-line"><strong>= ' + grp(D.count) + '</strong></div>';
      return derivBox("Bassenget tømmes med én hver runde", inner2);
    } else {
      var q = []; for(var k=0;k<D.S;k++){ q.push(D.N-k); }
      var perm = nPr(D.N,D.S), cost = fact(D.S);
      var inner3 = '<div class="d-line">Ordnet først: ' + q.join(" × ") + " = " + grp(perm) + '</div>'
        + '<div class="d-line">Fjern rekkefølgen: ÷ ' + D.S + "! = ÷ " + grp(cost) + '</div>'
        + '<div class="d-line"><strong>' + grp(perm) + " ÷ " + grp(cost) + " = " + grp(D.count) + '</strong></div>';
      return derivBox("Tøm som nPr, så del ut de dupliserte rekkefølgene", inner3);
    }
  }

  function pickOrder(v){
    selOrder = v;
    byId("dr-o-ordered").classList.toggle("active", v === "ordered");
    byId("dr-o-unordered").classList.toggle("active", v === "unordered");
  }
  function pickRefill(v){
    selRefill = v;
    byId("dr-r-refills").classList.toggle("active", v === "refills");
    byId("dr-r-drains").classList.toggle("active", v === "drains");
  }

  function checkType(){
    var fb = byId("dr-type-fb");
    if(!selOrder || !selRefill){ fb.style.color = RED; fb.textContent = "Velg et svar på begge spørsmålene først."; return; }
    if(selOrder === "unordered" && selRefill === "refills"){
      fb.style.color = RED; fb.textContent = "Den kombinasjonen (uordnet og med tilbakelegging) er ikke pensum — den er ikke en av de tre. Prøv igjen."; return;
    }
    var ok = (selOrder === D.order) && (selRefill === D.refill);
    if(ok){
      var fname = D.type === "ns" ? "N opphøyd i S" : D.type === "npr" ? "nPr" : "nCr";
      fb.style.color = GREEN;
      fb.innerHTML = "Riktig — dette er <strong>" + fname + "</strong>. Regn nå ut tellingen.";
      byId("dr-stage2").classList.remove("hidden");
    } else {
      fb.style.color = RED;
      var msg = "Ikke helt. ";
      if(selOrder !== D.order){ msg += "Se igjen på om plassene er rangerte eller kan bytte plass. "; }
      if(selRefill !== D.refill){ msg += "Se igjen på om et valg kan gjentas. "; }
      fb.textContent = msg;
    }
  }

  function checkCount(){
    var fb = byId("dr-count-fb");
    var digits = (byId("dr-count-in").value || "").replace(/[^0-9]/g, "");
    if(digits === ""){ fb.style.color = RED; fb.textContent = "Skriv inn et tall først."; return; }
    var guess = parseInt(digits, 10);
    if(guess === D.count){
      fb.style.color = GREEN;
      fb.innerHTML = "Riktig — <strong>" + grp(D.count) + "</strong> måter.";
    } else {
      fb.style.color = RED;
      fb.textContent = "Ikke ennå — du har " + grp(guess) + ". Gå gjennom stegene under og prøv en gang til.";
    }
    byId("dr-work").innerHTML = workHTML();
  }

  function newTest(){ D = gen(); renderTestStep(); }

  function renderTestStep(){
    var host = byId("step-5");
    if(!host){ return; }
    if(!D){ D = gen(); }
    selOrder = null; selRefill = null;
    host.innerHTML =
      '<h3>Steg 5 — Test deg selv</h3>'
      + '<p>Les scenarioet, bestem de to signalene, og tell. Trykk Ny test for et nytt et.</p>'
      + whyCard()
      + '<div style="background:#0a0a0b;border:1px solid #27272a;border-radius:10px;padding:16px 20px;margin:14px 0">'
        + '<div style="font-size:.72rem;color:#71717a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Scenario</div>'
        + '<p style="color:#fafafa;font-size:.95rem;line-height:1.6;margin:0">' + D.prob + '</p>'
      + '</div>'
      + '<div class="q-block"><div class="q-label">1. Teller rekkefølgen?</div><div class="q-options">'
        + '<div class="q-opt" id="dr-o-ordered"><div class="q-opt-title">Ja — ordnet</div></div>'
        + '<div class="q-opt" id="dr-o-unordered"><div class="q-opt-title">Nei — uordnet</div></div>'
      + '</div></div>'
      + '<div class="q-block"><div class="q-label">2. Fylles bassenget på nytt?</div><div class="q-options">'
        + '<div class="q-opt" id="dr-r-refills"><div class="q-opt-title">Ja — med tilbakelegging</div></div>'
        + '<div class="q-opt" id="dr-r-drains"><div class="q-opt-title">Nei — uten tilbakelegging</div></div>'
      + '</div></div>'
      + '<div style="margin-top:10px"><button id="dr-check-type" style="' + BTN + '">Sjekk formelen</button></div>'
      + '<div id="dr-type-fb" style="margin-top:10px;font-size:.88rem"></div>'
      + '<div id="dr-stage2" class="hidden" style="margin-top:18px;border-top:1px solid #27272a;padding-top:18px">'
        + '<div class="q-label" style="margin-bottom:8px">Hvor mange måter finnes det?</div>'
        + '<input type="text" id="dr-count-in" placeholder="tall" style="' + INP + '">'
        + '<div style="margin-top:12px"><button id="dr-check-count" style="' + BTN + '">Sjekk tellingen</button></div>'
        + '<div id="dr-count-fb" style="margin-top:10px;font-size:.88rem"></div>'
        + '<div id="dr-work" style="margin-top:12px"></div>'
      + '</div>'
      + '<div style="margin-top:20px"><button id="dr-new" style="' + BTN2 + '">↻ Ny test</button></div>';
    byId("dr-o-ordered").addEventListener("click", function(){ pickOrder("ordered"); });
    byId("dr-o-unordered").addEventListener("click", function(){ pickOrder("unordered"); });
    byId("dr-r-refills").addEventListener("click", function(){ pickRefill("refills"); });
    byId("dr-r-drains").addEventListener("click", function(){ pickRefill("drains"); });
    byId("dr-check-type").addEventListener("click", checkType);
    byId("dr-check-count").addEventListener("click", checkCount);
    byId("dr-new").addEventListener("click", newTest);
    var inp = byId("dr-count-in");
    if(inp){ inp.addEventListener("keydown", function(e){ if(e.key === "Enter"){ e.preventDefault(); checkCount(); } }); }
  }

  function ensureTest(){
    var step4 = byId("step-4");
    if(step4 && !byId("step-5")){
      var d = document.createElement("div");
      d.className = "step-content hidden";
      d.id = "step-5";
      step4.parentNode.insertBefore(d, step4.nextSibling);
    }
    var nav = document.querySelector(".step-nav");
    if(nav && !byId("dr-test-btn")){
      var btn = document.createElement("button");
      btn.className = "step-btn";
      btn.id = "dr-test-btn";
      btn.setAttribute("data-step", "5");
      btn.textContent = "Test deg selv";
      btn.addEventListener("click", function(){ window.showStep(5); });
      nav.appendChild(btn);
    }
    if(!window.__drWrapped){
      window.__drWrapped = true;
      var orig = window.showStep;
      window.showStep = function(n){
        if(n === 5){
          var all = document.querySelectorAll(".step-nav .step-btn");
          for(var a=0;a<all.length;a++){ all[a].classList.remove("active"); }
          var tb = byId("dr-test-btn"); if(tb){ tb.classList.add("active"); }
          for(var i=1;i<=4;i++){ var s = byId("step-"+i); if(s){ s.classList.add("hidden"); } }
          var s5 = byId("step-5"); if(s5){ s5.classList.remove("hidden"); }
          renderTestStep();
          return;
        }
        var tb2 = byId("dr-test-btn"); if(tb2){ tb2.classList.remove("active"); }
        var s5b = byId("step-5"); if(s5b){ s5b.classList.add("hidden"); }
        if(typeof orig === "function"){ orig(n); }
      };
    }
  }

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", ensureTest);
  } else {
    ensureTest();
  }
})();
