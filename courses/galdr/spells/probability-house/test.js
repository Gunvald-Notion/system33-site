/* === PROBABILITY HOUSE — TEST STEP (Step 5) ===
   One path, one question = the headline formula of the active path.
   app.js calls window.renderTest(path) into #test-host whenever Step 5 opens
   or the path changes. Drill logic preserved from the approved version. */
(function(){
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

  var PATH_NAME = { addisjon:'Addisjon', multiplikasjon:'Multiplikasjon', oppsplitting:'Oppsplitting', bayes:'Bayes' };
  var T = {};

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

  function build(path){
    if(path === 'multiplikasjon'){
      var pb = ri(20,80)/100;
      var pagb = ri(15,95)/100;
      var pab = +(pagb*pb).toFixed(6);
      return {
        path:path,
        formula:'P(A&cap;B) = P(A|B) &middot; P(B)',
        scenario:'P(A|B) = ' + f(pagb) + ' &nbsp;&middot;&nbsp; P(B) = ' + f(pb),
        drill:{ q:'P(A&cap;B)', v:pab, tol:0.005, sol:'P(A&cap;B) = P(A|B) &middot; P(B) = ' + f(pagb) + ' &middot; ' + f(pb) + ' = ' + f(pab) }
      };
    }
    if(path === 'oppsplitting'){
      var s = condScenario();
      return {
        path:path,
        formula:'P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;)',
        scenario:'P(A) = ' + f(s.pa) + ' &nbsp;&middot;&nbsp; P(B|A) = ' + f(s.pBgA) + ' &nbsp;&middot;&nbsp; P(B|A&prime;) = ' + f(s.pBgnA),
        drill:{ q:'P(B)', v:s.pb, tol:0.01, sol:'P(A&prime;) = 1 &minus; ' + f(s.pa) + ' = ' + f(s.pna) + '. Then sum the two lanes: P(B) = P(B|A)&middot;P(A) + P(B|A&prime;)&middot;P(A&prime;) = ' + f(s.pBgA) + '&middot;' + f(s.pa) + ' + ' + f(s.pBgnA) + '&middot;' + f(s.pna) + ' = ' + f(s.pBgA*s.pa) + ' + ' + f(s.pBgnA*s.pna) + ' = ' + f(s.pb) }
      };
    }
    if(path === 'bayes'){
      var s2 = condScenario();
      return {
        path:path,
        formula:'P(A|B) = P(B|A)&middot;P(A) / P(B)',
        scenario:'P(A) = ' + f(s2.pa) + ' &nbsp;&middot;&nbsp; P(B|A) = ' + f(s2.pBgA) + ' &nbsp;&middot;&nbsp; P(B) = ' + f(s2.pb),
        drill:{ q:'P(A|B)', v:s2.pab/s2.pb, tol:0.02, sol:'Numerator P(B|A)&middot;P(A) = ' + f(s2.pBgA) + '&middot;' + f(s2.pa) + ' = ' + f(s2.pab) + ' (that is P(A&cap;B)). Then P(A|B) = ' + f(s2.pab) + ' / ' + f(s2.pb) + ' = ' + f(s2.pab/s2.pb) }
      };
    }
    var s3 = baseScenario();
    return {
      path:'addisjon',
      formula:'P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B)',
      scenario:'P(A) = ' + f(s3.pa) + ' &nbsp;&middot;&nbsp; P(B) = ' + f(s3.pb) + ' &nbsp;&middot;&nbsp; P(A&cap;B) = ' + f(s3.pab),
      drill:{ q:'P(A&cup;B)', v:s3.pa+s3.pb-s3.pab, tol:0.005, sol:'P(A&cup;B) = P(A) + P(B) &minus; P(A&cap;B) = ' + f(s3.pa) + ' + ' + f(s3.pb) + ' &minus; ' + f(s3.pab) + ' = ' + f(s3.pa+s3.pb-s3.pab) }
    };
  }

  function render(){
    var host = document.getElementById('test-host');
    if(!host) return;
    var name = PATH_NAME[T.path] || 'Addisjon';
    host.innerHTML =
      '<p>One formula, one answer &mdash; the path you picked above. Read the givens, solve, then press <strong>Enter</strong> or hit Check. Switch the path and the test follows.</p>' +
      '<div class="result-box" style="border-left-color:var(--blue)"><div class="result-box-name">' + name + ' &mdash; find ' + T.drill.q + '</div><div class="result-box-formula" style="margin-bottom:8px;color:var(--accent)">' + T.formula + '</div><div class="result-box-formula" style="color:var(--text)">Given: &nbsp;' + T.scenario + '</div></div>' +
      '<div style="margin-top:20px"><div class="input-row"><div class="input-group"><label>' + T.drill.q + '</label><input type="number" id="t-ans" step="0.01" placeholder="?"></div><button class="action-btn" id="t-ans-btn">Check</button></div><div id="t-fb"></div></div>' +
      '<div class="btn-row" style="margin-top:22px"><button class="action-btn secondary" id="t-new">↻ New scenario</button></div>';
    document.getElementById('t-ans-btn').addEventListener('click', checkDrill);
    document.getElementById('t-new').addEventListener('click', function(){ T = build(T.path); render(); });
    document.getElementById('t-ans').addEventListener('keydown', function(e){ if(e.key === 'Enter') checkDrill(); });
  }

  function judge(ok, sol){
    var bc = ok ? 'rgba(34,197,94,.3)' : 'rgba(239,68,68,.3)';
    var col = ok ? 'var(--green)' : 'var(--red)';
    var label = ok ? '&#10003; Correct' : '&#10007; Not quite &mdash; here is the walk';
    document.getElementById('t-fb').innerHTML = '<div class="derivation" style="border-color:' + bc + '"><div class="d-label" style="color:' + col + '">' + label + '</div><div class="d-line">' + sol + '</div></div>';
  }

  function checkDrill(){
    var val = parseFloat(document.getElementById('t-ans').value);
    if(isNaN(val)){ document.getElementById('t-fb').innerHTML = '<div class="derivation"><div class="d-line" style="color:var(--muted)">Type a number first.</div></div>'; return; }
    judge(Math.abs(val - T.drill.v) <= T.drill.tol, T.drill.sol);
  }

  window.renderTest = function(path){
    T = build(path || 'addisjon');
    render();
  };
})();
