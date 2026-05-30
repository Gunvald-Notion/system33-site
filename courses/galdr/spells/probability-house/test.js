/* === PROBABILITY HOUSE — TEST STEP (Step 5) ===
   One path, one question. The drill IS the headline formula of the path
   chosen in Step 1. Reads the active path from .path-card.active so the test
   always mirrors the selection, and regenerates when the path changes. */
(function(){
  if (window.__phTest) return;
  window.__phTest = true;

  var div = null;
  var T = {};

  function ri(a,b){ return Math.floor(a + Math.random()*(b-a+1)); }

  function f(n){
    if(n===null||n===undefined||isNaN(n)) return '—';
    var r = Math.round(n*10000)/10000;
    if(r === Math.floor(r)) return r.toFixed(0);
    var s = r.toFixed(4);
    while(s.charAt(s.length-1) === '0') s = s.slice(0, -1);
    if(s.charAt(s.length-1) === '.') s = s.slice(0, -1);
    return s;
  }

  function currentPath(){
    var el = document.querySelector('.path-card.active');
    return el ? el.getAttribute('data-path') : null;
  }

  var PATH_NAME = { addisjon:'Addisjon', multiplikasjon:'Multiplikasjon', oppsplitting:'Oppsplitting', bayes:'Bayes' };

  function baseScenario(){
    var a = ri(20,80), b = ri(20,80);
    var lo = Math.max(0, a + b - 100), hi = Math.min(a, b);
    var ab = ri(Math.max(1, lo), hi);
    return { pa:a/100, pb:b/100, pab:ab/100 };
  }

  function condScenario(){
    var pa = ri(20,80)/100;
    var pBgA = ri(15,90)/100;
    var pBgnA = ri(15,90)/100;
    var pna = +(1 - pa).toFixed(6);
    var pb = +(pBgA*pa + pBgnA*pna).toFixed(6);
    var pab = +(pBgA*pa).toFixed(6);
    return { pa:pa, pna:pna, pBgA:pBgA, pBgnA:pBgnA, pb:pb, pab:pab };
  }

  /* Build a path-specific test: one scenario, one question = the path's formula. */
  function build(path){
    if(path === 'multiplikasjon'){
      var pb = ri(20,80)/100;
      var pagb = ri(15,95)/100;
      var pab = +(pagb*pb).toFixed(6);
      return {
        path:path,
        formula:'P(A∩B) = P(A|B) · P(B)',
        scenario:'P(A|B) = ' + f(pagb) + '  ·  P(B) = ' + f(pb),
        drill:{ q:'P(A∩B)', v:pab, tol:0.005, sol:'P(A∩B) = P(A|B) · P(B) = ' + f(pagb) + ' · ' + f(pb) + ' = ' + f(pab) }
      };
    }
    if(path === 'oppsplitting'){
      var s = condScenario();
      return {
        path:path,
        formula:'P(B) = P(B|A)·P(A) + P(B|A′)·P(A′)',
        scenario:'P(A) = ' + f(s.pa) + '  ·  P(B|A) = ' + f(s.pBgA) + '  ·  P(B|A′) = ' + f(s.pBgnA),
        drill:{ q:'P(B)', v:s.pb, tol:0.01, sol:'P(A′) = 1 − ' + f(s.pa) + ' = ' + f(s.pna) + '.  Then sum the two lanes:  P(B) = P(B|A)·P(A) + P(B|A′)·P(A′) = ' + f(s.pBgA) + '·' + f(s.pa) + ' + ' + f(s.pBgnA) + '·' + f(s.pna) + ' = ' + f(s.pBgA*s.pa) + ' + ' + f(s.pBgnA*s.pna) + ' = ' + f(s.pb) }
      };
    }
    if(path === 'bayes'){
      var s = condScenario();
      return {
        path:path,
        formula:'P(A|B) = P(B|A)·P(A) / P(B)',
        scenario:'P(A) = ' + f(s.pa) + '  ·  P(B|A) = ' + f(s.pBgA) + '  ·  P(B) = ' + f(s.pb),
        drill:{ q:'P(A|B)', v:s.pab/s.pb, tol:0.02, sol:'Numerator P(B|A)·P(A) = ' + f(s.pBgA) + '·' + f(s.pa) + ' = ' + f(s.pab) + '  (that is P(A∩B)).  Then P(A|B) = ' + f(s.pab) + ' / ' + f(s.pb) + ' = ' + f(s.pab/s.pb) }
      };
    }
    /* default: addisjon */
    var s2 = baseScenario();
    return {
      path:'addisjon',
      formula:'P(A∪B) = P(A) + P(B) − P(A∩B)',
      scenario:'P(A) = ' + f(s2.pa) + '  ·  P(B) = ' + f(s2.pb) + '  ·  P(A∩B) = ' + f(s2.pab),
      drill:{ q:'P(A∪B)', v:s2.pa+s2.pb-s2.pab, tol:0.005, sol:'P(A∪B) = P(A) + P(B) − P(A∩B) = ' + f(s2.pa) + ' + ' + f(s2.pb) + ' − ' + f(s2.pab) + ' = ' + f(s2.pa+s2.pb-s2.pab) }
    };
  }

  function newScenario(){
    T = build(currentPath() || 'addisjon');
    render();
  }

  function render(){
    if(!div) return;
    var name = PATH_NAME[T.path] || 'Addisjon';
    div.innerHTML =
      '<h3>Step 5 — Test yourself: ' + name + '</h3>' +
      '<p>One formula, one answer — the path you picked in Step 1. Read the givens, solve, then press <strong>Enter</strong> or hit Check. Switch the path in Step 1 and the test follows.</p>' +
      '<div class="result-box" style="border-left-color:var(--blue)"><div class="result-box-name">' + name + ' — find ' + T.drill.q + '</div><div class="result-box-formula" style="margin-bottom:8px">' + T.formula + '</div><div class="result-box-formula" style="color:var(--text)">Given:  ' + T.scenario + '</div></div>' +
      '<div style="margin-top:20px"><div class="input-row"><div class="input-group"><label>' + T.drill.q + '</label><input type="number" id="t-ans" step="0.01" placeholder="?"></div><button class="action-btn" id="t-ans-btn" style="align-self:flex-end">Check</button></div><div id="t-fb"></div></div>' +
      '<div class="btn-row" style="margin-top:22px"><button class="action-btn secondary" id="t-new">↻ New scenario</button></div>';
    document.getElementById('t-ans-btn').addEventListener('click', checkDrill);
    document.getElementById('t-new').addEventListener('click', newScenario);
    document.getElementById('t-ans').addEventListener('keydown', function(e){ if(e.key === 'Enter') checkDrill(); });
  }

  function judge(ok, sol){
    var bc = ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)';
    var col = ok ? 'var(--green)' : 'var(--red)';
    var label = ok ? '✓ Correct' : '✗ Not quite — here is the walk';
    document.getElementById('t-fb').innerHTML = '<div class="derivation" style="border-color:' + bc + '"><div class="d-label" style="color:' + col + '">' + label + '</div><div class="d-line">' + sol + '</div></div>';
  }

  function checkDrill(){
    var val = parseFloat(document.getElementById('t-ans').value);
    if(isNaN(val)){ document.getElementById('t-fb').innerHTML = '<div class="derivation"><div class="d-line" style="color:var(--muted)">Type a number first.</div></div>'; return; }
    judge(Math.abs(val - T.drill.v) <= T.drill.tol, T.drill.sol);
  }

  function showTest(){
    document.querySelectorAll('.step-content').forEach(function(s){ s.classList.add('hidden'); });
    if(!T.path || T.path !== (currentPath() || 'addisjon')) newScenario();
    div.classList.remove('hidden');
    document.querySelectorAll('.step-nav .step-btn').forEach(function(b){ b.classList.remove('active'); });
    var b5 = document.querySelector(".step-nav .step-btn[data-step='5']");
    if(b5) b5.classList.add('active');
  }

  function ensureTest(){
    if(document.getElementById('step-5')) return;
    var nav = document.querySelector('.step-nav');
    var step4 = document.getElementById('step-4');
    if(!nav || !step4) return;

    var btn = document.createElement('button');
    btn.className = 'step-btn';
    btn.setAttribute('data-step', '5');
    btn.textContent = 'Step 5 — Test';
    nav.appendChild(btn);

    div = document.createElement('div');
    div.className = 'step-content hidden';
    div.id = 'step-5';
    step4.parentNode.insertBefore(div, step4.nextSibling);

    btn.addEventListener('click', showTest);

    document.querySelectorAll('.step-nav .step-btn').forEach(function(b){
      if(b.getAttribute('data-step') !== '5'){
        b.addEventListener('click', function(){ div.classList.add('hidden'); btn.classList.remove('active'); });
      }
    });
    var reset = document.getElementById('btn-reset');
    if(reset){ reset.addEventListener('click', function(){ div.classList.add('hidden'); btn.classList.remove('active'); }); }

    newScenario();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ensureTest);
  } else {
    ensureTest();
  }
})();
