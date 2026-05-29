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
    what: "Counting answers one question: how many different ways can this happen? Drainage is the engine - you draw items from a pool, and the formula you reach for depends on two things only: does order matter, and does the pool refill.",
    use: "Every probability that begins with gunstige over mulige sits on top of a count. Lottery odds, how many PIN codes exist, how many committees or podiums or seating plans are possible - all of it is Drainage feeding Laplace.",
    exam: "The eksamen almost never tells you which formula to use. It hides the choice in the wording - ranked or not, with or without replacement. The real skill being tested is reading those two signals before you touch a number.",
    fun: "Get the two questions right and the count falls out on its own. Most lost marks here are not arithmetic - they come from grabbing nPr when the problem quietly wanted nCr."
  };

  var D = null, selOrder = null, selRefill = null;

  function gen(){
    var type = rc(["ns","npr","ncr"]);
    var N, S, count, prob, order, refill;
    if(type === "ns"){
      N = ri(2,8); S = ri(3,5); count = Math.pow(N,S);
      prob = "You are building a code of length " + S + ". Each position can be any one of " + N + " symbols, and a symbol may be reused as often as you like.";
      order = "ordered"; refill = "refills";
    } else if(type === "npr"){
      N = ri(6,12); S = ri(2,4); count = nPr(N,S);
      prob = "Out of " + N + " runners, the first " + S + " across the line take a ranked podium (1st, 2nd and so on). No runner can hold two places.";
      order = "ordered"; refill = "drains";
    } else {
      N = ri(6,12); S = ri(2,4); count = nCr(N,S);
      prob = "You pick a group of " + S + " people from " + N + " candidates. Everyone chosen counts the same - the order you pick them in does not matter.";
      order = "unordered"; refill = "drains";
    }
    return { type:type, N:N, S:S, count:count, prob:prob, order:order, refill:refill };
  }

  function whyCard(){
    return '<div style="background:#111113;border-left:3px solid ' + ACCENT + ';border-radius:0 8px 8px 0;padding:16px 20px;margin:0 0 20px">'
      + '<div style="font-size:.72rem;color:#71717a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Why this spell matters</div>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0 0 10px"><strong style="color:#fafafa">What it is. </strong>' + WHY.what + '</p>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0 0 10px"><strong style="color:#fafafa">Where it bites. </strong>' + WHY.use + '</p>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0 0 10px"><strong style="color:#fafafa">On the eksamen. </strong>' + WHY.exam + '</p>'
      + '<p style="color:#a1a1aa;font-size:.88rem;line-height:1.65;margin:0"><strong style="color:#fafafa">The fun. </strong>' + WHY.fun + '</p>'
      + '</div>';
  }

  function derivBox(label, inner){
    return '<div class="derivation"><div class="d-label">' + label + '</div>' + inner + '</div>';
  }

  function workHTML(){
    if(D.type === "ns"){
      var seq = []; for(var i=0;i<D.S;i++){ seq.push(D.N); }
      var inner = '<div class="d-line">' + seq.join(" \u00d7 ") + '</div>'
        + '<div class="d-line"><strong>' + D.N + "^" + D.S + " = " + grp(D.count) + '</strong></div>';
      return derivBox("Each of the " + D.S + " rounds keeps all " + D.N + " choices", inner);
    } else if(D.type === "npr"){
      var p = []; for(var j=0;j<D.S;j++){ p.push(D.N-j); }
      var inner2 = '<div class="d-line">nPr = N! / (N\u2212S)! = ' + D.N + "! / " + (D.N-D.S) + '!</div>'
        + '<div class="d-line">' + p.join(" \u00d7 ") + '</div>'
        + '<div class="d-line"><strong>= ' + grp(D.count) + '</strong></div>';
      return derivBox("The pool drains by one each round", inner2);
    } else {
      var q = []; for(var k=0;k<D.S;k++){ q.push(D.N-k); }
      var perm = nPr(D.N,D.S), cost = fact(D.S);
      var inner3 = '<div class="d-line">Ordered first: ' + q.join(" \u00d7 ") + " = " + grp(perm) + '</div>'
        + '<div class="d-line">Strip the order: \u00f7 ' + D.S + "! = \u00f7 " + grp(cost) + '</div>'
        + '<div class="d-line"><strong>' + grp(perm) + " \u00f7 " + grp(cost) + " = " + grp(D.count) + '</strong></div>';
      return derivBox("Drain like nPr, then divide out the duplicate orders", inner3);
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
    if(!selOrder || !selRefill){ fb.style.color = RED; fb.textContent = "Pick an answer for both questions first."; return; }
    if(selOrder === "unordered" && selRefill === "refills"){
      fb.style.color = RED; fb.textContent = "That pairing (unordered and refilling) is ikke pensum - it is not one of the three. Try again."; return;
    }
    var ok = (selOrder === D.order) && (selRefill === D.refill);
    if(ok){
      var fname = D.type === "ns" ? "N raised to the S" : D.type === "npr" ? "nPr" : "nCr";
      fb.style.color = GREEN;
      fb.innerHTML = "Right - this is <strong>" + fname + "</strong>. Now work out the count.";
      byId("dr-stage2").classList.remove("hidden");
    } else {
      fb.style.color = RED;
      var msg = "Not quite. ";
      if(selOrder !== D.order){ msg += "Look again at whether the places are ranked or interchangeable. "; }
      if(selRefill !== D.refill){ msg += "Look again at whether a pick can be repeated. "; }
      fb.textContent = msg;
    }
  }

  function checkCount(){
    var fb = byId("dr-count-fb");
    var digits = (byId("dr-count-in").value || "").replace(/[^0-9]/g, "");
    if(digits === ""){ fb.style.color = RED; fb.textContent = "Type a number first."; return; }
    var guess = parseInt(digits, 10);
    if(guess === D.count){
      fb.style.color = GREEN;
      fb.innerHTML = "Correct - <strong>" + grp(D.count) + "</strong> ways.";
    } else {
      fb.style.color = RED;
      fb.textContent = "Not yet - you have " + grp(guess) + ". Walk the steps below and try once more.";
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
      '<h3>Step 5 \u2014 Test yourself</h3>'
      + '<p>Read the scenario, decide the two signals, then count. Press Ny test for a fresh one.</p>'
      + whyCard()
      + '<div style="background:#0a0a0b;border:1px solid #27272a;border-radius:10px;padding:16px 20px;margin:14px 0">'
        + '<div style="font-size:.72rem;color:#71717a;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px">Scenario</div>'
        + '<p style="color:#fafafa;font-size:.95rem;line-height:1.6;margin:0">' + D.prob + '</p>'
      + '</div>'
      + '<div class="q-block"><div class="q-label">1. Does order matter?</div><div class="q-options">'
        + '<div class="q-opt" id="dr-o-ordered"><div class="q-opt-title">Yes \u2014 ordnet</div></div>'
        + '<div class="q-opt" id="dr-o-unordered"><div class="q-opt-title">No \u2014 uordnet</div></div>'
      + '</div></div>'
      + '<div class="q-block"><div class="q-label">2. Does the pool refill?</div><div class="q-options">'
        + '<div class="q-opt" id="dr-r-refills"><div class="q-opt-title">Yes \u2014 med tilbakelegging</div></div>'
        + '<div class="q-opt" id="dr-r-drains"><div class="q-opt-title">No \u2014 uten tilbakelegging</div></div>'
      + '</div></div>'
      + '<div style="margin-top:10px"><button id="dr-check-type" style="' + BTN + '">Check the formula</button></div>'
      + '<div id="dr-type-fb" style="margin-top:10px;font-size:.88rem"></div>'
      + '<div id="dr-stage2" class="hidden" style="margin-top:18px;border-top:1px solid #27272a;padding-top:18px">'
        + '<div class="q-label" style="margin-bottom:8px">How many ways are there?</div>'
        + '<input type="text" id="dr-count-in" placeholder="number" style="' + INP + '">'
        + '<div style="margin-top:12px"><button id="dr-check-count" style="' + BTN + '">Check the count</button></div>'
        + '<div id="dr-count-fb" style="margin-top:10px;font-size:.88rem"></div>'
        + '<div id="dr-work" style="margin-top:12px"></div>'
      + '</div>'
      + '<div style="margin-top:20px"><button id="dr-new" style="' + BTN2 + '">\u21bb Ny test</button></div>';
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
      btn.textContent = "Test";
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
