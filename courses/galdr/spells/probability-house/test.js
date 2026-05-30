/* === PROBABILITY HOUSE — TEST STEP (Step 5) ===
   Path-aware: the drill matches the formula chosen in Step 1.
   Reads the active path from the .path-card.active element so the test always
   mirrors the user's selection, and regenerates when the path changes. */
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

  /* Build a path-specific test: a scenario line plus two ordered moves. */
  function build(path){
    var s;
    if(path === 'multiplikasjon'){
      s = baseScenario();
      return {
        path:path,
        scenario: 'P(A) = ' + f(s.pa) + '  ·  P(B) = ' + f(s.pb) + '  ·  P(A∩B) = ' + f(s.pab),
        drills: [
          { q:'P(A|B)', v: s.pab/s.pb, tol:0.02, sol:'Shrink the dome to the B-column.  P(A|B) = P(A∩B) / P(B) = ' + f(s.pab) + ' / ' + f(s.pb) + ' = ' + f(s.pab/s.pb) },
          { q:'P(B|A)', v: s.pab/s.pa, tol:0.02, sol:'Same cell, shrink to the A-row instead.  P(B|A) = P(A∩B) / P(A) = ' + f(s.pab) + ' / ' + f(s.pa) + ' = ' + f(s.pab/s.pa) }
        ]
      };
    }
    if(path === 'oppsplitting'){
      s = condScenario();
      return {
        path:path,
        scenario: 'P(A) = ' + f(s.pa) + '  ·  P(B|A) = ' + f(s.pBgA) + '  ·  P(B|A′) = ' + f(s.pBgnA),
        drills: [
          { q:'P(A′)', v: s.pna, tol:0.005, sol:'P(A′) = 1 − P(A) = 1 − ' + f(s.pa) + ' = ' + f(s.pna) + '  — the width of the second lane.' },
          { q:'P(B)', v: s.pb, tol:0.01, sol:'Sum the two lanes.  P(B) = P(B|A)·P(A) + P(B|A′)·P(A′) = ' + f(s.pBgA) + '·' + f(s.pa) + ' + ' + f(s.pBgnA) + '·' + f(s.pna) + ' = ' + f(s.pBgA*s.pa) + ' + ' + f(s.pBgnA*s.pna) + ' = ' + f(s.pb) }
        ]
      };
    }
    if(path === 'bayes'){
      s = condScenario();
      return {
        path:path,
        scenario: 'P(A) = ' + f(s.pa) + '  ·  P(B|A) = ' + f(s.pBgA) + '  ·  P(B) = ' + f(s.pb),
        drills: [
          { q:'P(A∩B)', v: s.pab, tol:0.005, sol:'Forward first.  P(A∩B) = P(B|A)·P(A) = ' + f(s.pBgA) + '·' + f(s.pa) + ' = ' + f(s.pab) },
          { q:'P(A|B)', v: s.pab/s.pb, tol:0.02, sol:'Flip the denominator to the B-column.  P(A|B) = P(A∩B) / P(B) = ' + f(s.pab) + ' / ' + f(s.pb) + ' = ' + f(s.pab/s.pb) }
        ]
      };
    }
    /* default: addisjon */
    s = baseScenario();
    return {
      path:'addisjon',
      scenario: 'P(A) = ' + f(s.pa) + '  ·  P(B) = ' + f(s.pb) + '  ·  P(A∩B) = ' + f(s.pab),
      drills: [
        { q:'P(A∪B)', v: s.pa+s.pb-s.pab, tol:0.005, sol:'P(A∪B) = P(A) + P(B) − P(A∩B) = ' + f(s.pa) + ' + ' + f(s.pb) + ' − ' + f(s.pab) + ' = ' + f(s.pa+s.pb-s.pab) },
        { q:'P(A′∩B′)', v: 1-(s.pa+s.pb-s.pab), tol:0.005, sol:'Everything outside the union.  P(A′∩B′) = 1 − P(A∪B) = 1 − ' + f(s.pa+s.pb-s.pab) + ' = ' + f(1-(s.pa+s.pb-s.pab)) }
      ]
    };
  }

  function newScenario(){
    T = build(currentPath() || 'addisjon');
    render();
  }

  function render(){
    if(!div) return;
    var name = PATH_NAME[T.path] || 'Addisjon';
    var d1 = T.drills[0], d2 = T.drills[1];
    div.innerHTML =
      '<h3>Step 5 — Test yourself: ' + name + '</h3>' +
      '<p>This drill matches the path you picked in Step 1. Read the scenario, answer each move, then press <strong>Enter</strong> or hit Check. Change the path in Step 1 and the test changes with it.</p>' +
      '<div class="result-box" style="border-left-color:var(--blue)"><div class="result-box-name">The scenario — ' + name + '</div><div class="result-box-formula">' + T.scenario + '</div></div>' +
      '<div style="margin-top:20px"><p style="margin-bottom:6px"><strong>Move 1.</strong> Find <strong>' + d1.q + '</strong>.</p><div class="input-row"><div class="input-group"><label>' + d1.q + '</label><input type="number" id="t-d1" step="0.01" placeholder="?"></div><button class="action-btn" id="t-d1-btn" style="align-self:flex-end">Check</button></div><div id="t-d1-fb"></div></div>' +
      '<div style="margin-top:20px"><p style="margin-bottom:6px"><strong>Move 2.</strong> Now find <strong>' + d2.q + '</strong>.</p><div class="input-row"><div class="input-group"><label>' + d2.q + '</label><input type="number" id="t-d2" step="0.01" placeholder="?"></div><button class="action-btn" id="t-d2-btn" style="align-self:flex-end">Check</button></div><div id="t-d2-fb"></div></div>' +
      '<div class="btn-row" style="margin-top:22px"><button class="action-btn secondary" id="t-new">↻ New scenario</button></div>';
    document.getElementById('t-d1-btn').addEventListener('click', function(){ checkDrill('t-d1','t-d1-fb',0); });
    document.getElementById('t-d2-btn').addEventListener('click', function(){ checkDrill('t-d2','t-d2-fb',1); });
    document.getElementById('t-new').addEventListener('click', newScenario);
    document.getElementById('t-d1').addEventListener('keydown', function(e){ if(e.key === 'Enter') checkDrill('t-d1','t-d1-fb',0); });
    document.getElementById('t-d2').addEventListener('keydown', function(e){ if(e.key === 'Enter') checkDrill('t-d2','t-d2-fb',1); });
  }

  function judge(boxId, ok, sol){
    var bc = ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)';
    var col = ok ? 'var(--green)' : 'var(--red)';
    var label = ok ? '✓ Correct' : '✗ Not quite — here is the walk';
    document.getElementById(boxId).innerHTML = '<div class="derivation" style="border-color:' + bc + '"><div class="d-label" style="color:' + col + '">' + label + '</div><div class="d-line">' + sol + '</div></div>';
  }

  function checkDrill(inputId, boxId, idx){
    var val = parseFloat(document.getElementById(inputId).value);
    var d = T.drills[idx];
    if(isNaN(val)){ document.getElementById(boxId).innerHTML = '<div class="derivation"><div class="d-line" style="color:var(--muted)">Type a number first.</div></div>'; return; }
    judge(boxId, Math.abs(val - d.v) <= d.tol, d.sol);
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
