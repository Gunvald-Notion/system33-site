/* === PROBABILITY HOUSE — TEST STEP (Step 5) === */
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

  function newScenario(){
    var a = ri(20,80), b = ri(20,80);
    var loi = Math.max(0, a + b - 100);
    var hii = Math.min(a, b);
    var abi = ri(loi, hii);
    T.pa = a/100; T.pb = b/100; T.pab = abi/100;
    var cells = ['anb','nab','pna','pnb','nanb'];
    T.cell = cells[ri(0, cells.length - 1)];
    var forms = ['addisjon','pagb','pbga'];
    T.form = forms[ri(0, forms.length - 1)];
    render();
  }

  function cellInfo(){
    var pa = T.pa, pb = T.pb, pab = T.pab;
    if(T.cell === 'anb') return { q:'P(A∩B′)', v: pa - pab, sol:'P(A∩B′) = P(A) − P(A∩B) = ' + f(pa) + ' − ' + f(pab) + ' = ' + f(pa - pab) };
    if(T.cell === 'nab') return { q:'P(A′∩B)', v: pb - pab, sol:'P(A′∩B) = P(B) − P(A∩B) = ' + f(pb) + ' − ' + f(pab) + ' = ' + f(pb - pab) };
    if(T.cell === 'pna') return { q:'P(A′)', v: 1 - pa, sol:'P(A′) = 1 − P(A) = 1 − ' + f(pa) + ' = ' + f(1 - pa) };
    if(T.cell === 'pnb') return { q:'P(B′)', v: 1 - pb, sol:'P(B′) = 1 − P(B) = 1 − ' + f(pb) + ' = ' + f(1 - pb) };
    return { q:'P(A′∩B′)', v: 1 - pa - pb + pab, sol:'P(A′∩B′) = 1 − P(A) − P(B) + P(A∩B) = 1 − ' + f(pa) + ' − ' + f(pb) + ' + ' + f(pab) + ' = ' + f(1 - pa - pb + pab) };
  }

  function formInfo(){
    var pa = T.pa, pb = T.pb, pab = T.pab;
    if(T.form === 'addisjon') return { q:'P(A∪B)', v: pa + pb - pab, tol:0.005, sol:'P(A∪B) = P(A) + P(B) − P(A∩B) = ' + f(pa) + ' + ' + f(pb) + ' − ' + f(pab) + ' = ' + f(pa + pb - pab) };
    if(T.form === 'pagb') return { q:'P(A|B)', v: pab / pb, tol:0.02, sol:'P(A|B) = P(A∩B) / P(B) = ' + f(pab) + ' / ' + f(pb) + ' = ' + f(pab / pb) };
    return { q:'P(B|A)', v: pab / pa, tol:0.02, sol:'P(B|A) = P(A∩B) / P(A) = ' + f(pab) + ' / ' + f(pa) + ' = ' + f(pab / pa) };
  }

  function render(){
    var c = cellInfo();
    var fm = formInfo();
    T._c = c; T._fm = fm;
    div.innerHTML =
      `<h3>Step 5 — Test yourself</h3>` +
      `<p>One scenario, two drills. First fill a room with the conservation law, then read a formula off the same house. Press Enter in a box to check it.</p>` +
      `<div class='result-box' style='border-left-color:var(--blue)'><div class='result-box-name'>The scenario</div><div class='result-box-formula'>P(A) = ${f(T.pa)}  ·  P(B) = ${f(T.pb)}  ·  P(A∩B) = ${f(T.pab)}</div></div>` +
      `<div style='margin-top:20px'><p style='margin-bottom:6px'><strong>Drill 1 — Fill a room.</strong> Use the conservation law to find <strong>${c.q}</strong>.</p><div class='input-row'><div class='input-group'><label>${c.q}</label><input type='number' id='t-d1' step='0.01' placeholder='?'></div><button class='action-btn' id='t-d1-btn' style='align-self:flex-end'>Check</button></div><div id='t-d1-fb'></div></div>` +
      `<div style='margin-top:20px'><p style='margin-bottom:6px'><strong>Drill 2 — Read a formula.</strong> From the same scenario, find <strong>${fm.q}</strong>.</p><div class='input-row'><div class='input-group'><label>${fm.q}</label><input type='number' id='t-d2' step='0.01' placeholder='?'></div><button class='action-btn' id='t-d2-btn' style='align-self:flex-end'>Check</button></div><div id='t-d2-fb'></div></div>` +
      `<div class='btn-row' style='margin-top:22px'><button class='action-btn secondary' id='t-new'>↻ New scenario</button></div>`;
    document.getElementById('t-d1-btn').addEventListener('click', checkD1);
    document.getElementById('t-d2-btn').addEventListener('click', checkD2);
    document.getElementById('t-new').addEventListener('click', newScenario);
    document.getElementById('t-d1').addEventListener('keydown', function(e){ if(e.key === 'Enter') checkD1(); });
    document.getElementById('t-d2').addEventListener('keydown', function(e){ if(e.key === 'Enter') checkD2(); });
  }

  function judge(boxId, ok, sol){
    var bc = ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)';
    var col = ok ? 'var(--green)' : 'var(--red)';
    var label = ok ? '✓ Correct' : '✗ Not quite — here is the walk';
    document.getElementById(boxId).innerHTML = `<div class='derivation' style='border-color:${bc}'><div class='d-label' style='color:${col}'>${label}</div><div class='d-line'>${sol}</div></div>`;
  }

  function checkD1(){
    var val = parseFloat(document.getElementById('t-d1').value);
    if(isNaN(val)){ document.getElementById('t-d1-fb').innerHTML = `<div class='derivation'><div class='d-line' style='color:var(--muted)'>Type a number first.</div></div>`; return; }
    judge('t-d1-fb', Math.abs(val - T._c.v) <= 0.005, T._c.sol);
  }

  function checkD2(){
    var val = parseFloat(document.getElementById('t-d2').value);
    if(isNaN(val)){ document.getElementById('t-d2-fb').innerHTML = `<div class='derivation'><div class='d-line' style='color:var(--muted)'>Type a number first.</div></div>`; return; }
    judge('t-d2-fb', Math.abs(val - T._fm.v) <= T._fm.tol, T._fm.sol);
  }

  function showTest(){
    document.querySelectorAll('.step-content').forEach(function(s){ s.classList.add('hidden'); });
    div.classList.remove('hidden');
    document.querySelectorAll('.step-nav .step-btn').forEach(function(b){ b.classList.remove('active'); });
    var b5 = document.querySelector(`.step-nav .step-btn[data-step='5']`);
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
