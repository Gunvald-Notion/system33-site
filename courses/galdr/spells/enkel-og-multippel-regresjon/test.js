// test.js — Forms 1-5 live; 6-7 placeholder
var TS = {};
var testWasActive = false;
var TVCOL='#f59e0b', RADCOL='#3b82f6';

// ============ FORM 1 — Predikert ŷ ============
function f1testEnsure(){
 if(!TS[1]){
  TS[1] = {
   b0: 1 + Math.floor(Math.random()*4),
   bTV: Math.round((1 + Math.random()*1.5)*10)/10,
   xTV: Math.round((1 + Math.random()*3)*10)/10,
   bRadio: Math.round((0.3 + Math.random()*0.7)*10)/10,
   xRadio: Math.round((1 + Math.random()*3)*10)/10,
   checked: false, correct: null, userAnswer: ''
  };
  S = {i: TS[1].b0, a: [
   {name:'TV', b:TS[1].bTV, x:TS[1].xTV, c:TVCOL},
   {name:'Radio', b:TS[1].bRadio, x:TS[1].xRadio, c:RADCOL}
  ], solved: false};
  rsvg();
  document.getElementById('conv-caption').innerHTML='Test mode — compute ŷ tuh resolve the bead.';
 }
}
function f1test(){
 var t = TS[1];
 var correctY = Math.round((t.b0 + t.bTV*t.xTV + t.bRadio*t.xRadio)*100)/100;
 var html = '<div class="step-content">';
 html += '<h3>Test — Compute ŷ with fresh numbers</h3>';
 html += '<p>Same four moves az Form 1. New dataset every attempt. Pluck the colored pieces, sum the arms, output ŷ.</p>';
 html += '<div class="input-section-label">Fresh problem</div>';
 html += '<table class="data-table"><tbody>';
 html += '<tr><td>Intercept b₀</td><td>'+t.b0+'</td></tr>';
 html += '<tr><td style="color:'+TVCOL+'">TV slope b_TV</td><td style="color:'+TVCOL+'">'+t.bTV+'</td></tr>';
 html += '<tr><td style="color:'+TVCOL+'">TV value X_TV</td><td style="color:'+TVCOL+'">'+t.xTV+'</td></tr>';
 html += '<tr><td style="color:'+RADCOL+'">Radio slope b_Radio</td><td style="color:'+RADCOL+'">'+t.bRadio+'</td></tr>';
 html += '<tr><td style="color:'+RADCOL+'">Radio value X_Radio</td><td style="color:'+RADCOL+'">'+t.xRadio+'</td></tr>';
 html += '</tbody></table>';
 html += '<div class="derivation"><div class="d-label">Yer task</div><div>ŷ = <strong>'+t.b0+'</strong> + <span style="color:'+TVCOL+'">b_TV·X_TV</span> + <span style="color:'+RADCOL+'">b_Radio·X_Radio</span> = ?</div></div>';
 html += '<div style="display:flex;gap:10px;align-items:center;margin:14px 0;flex-wrap:wrap">';
 html += '<label style="color:var(--text2);font-size:.95rem;font-family:\'SF Mono\',Menlo,monospace">ŷ =</label>';
 html += '<input id="f1ti" type="number" step="0.01" value="'+(t.userAnswer||'')+'" style="background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font:inherit;font-family:\'SF Mono\',Menlo,monospace;font-size:1rem;width:140px"/>';
 html += '<button class="action-btn" onclick="f1testCheck()">Check</button>';
 html += '<button class="action-btn secondary" onclick="f1testNew()">New problem</button>';
 html += '</div>';
 if(t.checked){
  if(t.correct){
   html += '<div class="result-box blue"><div class="result-box-name">Correct</div><div class="result-box-value" style="color:#22c55e">ŷ = '+correctY.toFixed(2)+' ✓</div><div class="result-box-desc">Yuh plucked the four pieces an summed them right. Press <em>New problem</em> fer fresh numbers, or flip back tuh Step 1–4 tuh review the formation.</div></div>';
  } else {
   var a1=Math.round(t.bTV*t.xTV*100)/100, a2=Math.round(t.bRadio*t.xRadio*100)/100;
   html += '<div class="result-box"><div class="result-box-name">Not quite</div><div class="result-box-value" style="color:#dc2626">ŷ = '+correctY.toFixed(2)+'</div><div class="result-box-desc">Walk the four moves: <strong>'+t.b0+'</strong> + <span style="color:'+TVCOL+'">'+t.bTV+'·'+t.xTV+'</span> + <span style="color:'+RADCOL+'">'+t.bRadio+'·'+t.xRadio+'</span> = '+t.b0+' + <span style="color:'+TVCOL+'">'+a1.toFixed(2)+'</span> + <span style="color:'+RADCOL+'">'+a2.toFixed(2)+'</span> = <strong>'+correctY.toFixed(2)+'</strong>. Try again or press <em>New problem</em>.</div></div>';
  }
 }
 html += '</div>';
 return html;
}
function f1testCheck(){
 var input = document.getElementById('f1ti');
 var ans = parseFloat(input.value);
 var t = TS[1];
 t.userAnswer = input.value;
 var correctY = Math.round((t.b0 + t.bTV*t.xTV + t.bRadio*t.xRadio)*100)/100;
 t.checked = true;
 t.correct = !isNaN(ans) && Math.abs(ans - correctY) < 0.02;
 if(t.correct){
  S.solved = true;
  rsvg();
  document.getElementById('conv-caption').innerHTML='Test resolved — ŷ = <strong style="color:#22c55e">'+correctY.toFixed(2)+'</strong>';
 }
 rstep();
}
function f1testNew(){
 TS[1] = null;
 f1testEnsure();
 rstep();
}

// ============ FORM 2 — Tolkning av bⱼ ============
function f2testEnsure(){
 if(!TS[2]){
  TS[2] = {
   bTV: Math.round((1 + Math.random()*1.5)*10)/10,
   bRadio: Math.round((0.3 + Math.random()*0.7)*10)/10,
   target: Math.random() < 0.5 ? 'TV' : 'Radio',
   deltaX: 1 + Math.floor(Math.random()*4),
   checked: false, correct: null, userAnswer: ''
  };
 }
}
function f2test(){
 var t = TS[2];
 var col = t.target==='TV' ? TVCOL : RADCOL;
 var otherCol = t.target==='TV' ? RADCOL : TVCOL;
 var otherName = t.target==='TV' ? 'Radio' : 'TV';
 var bj = t.target==='TV' ? t.bTV : t.bRadio;
 var correctDy = Math.round(bj * t.deltaX * 100)/100;
 var html = '<div class="step-content">';
 html += '<h3>Test — Tolkning av bⱼ</h3>';
 html += '<p>Same four moves az Form 2. Pick the targeted slope, lock the other arm, multiply by ΔX, an read out Δy.</p>';
 html += '<div class="input-section-label">Fresh problem</div>';
 html += '<table class="data-table"><tbody>';
 html += '<tr><td style="color:'+TVCOL+'">b_TV</td><td style="color:'+TVCOL+'">'+t.bTV+'</td></tr>';
 html += '<tr><td style="color:'+RADCOL+'">b_Radio</td><td style="color:'+RADCOL+'">'+t.bRadio+'</td></tr>';
 html += '</tbody></table>';
 html += '<div class="derivation"><div class="d-label">Yer task</div><div><span style="color:'+col+'">X_'+t.target+'</span> increases by <strong>ΔX = '+t.deltaX+'</strong> units. <span style="color:'+otherCol+'">X_'+otherName+'</span> stays locked (alt annet likt). What iz <strong>Δy</strong>?</div></div>';
 html += '<div style="display:flex;gap:10px;align-items:center;margin:14px 0;flex-wrap:wrap">';
 html += '<label style="color:var(--text2);font-size:.95rem;font-family:\'SF Mono\',Menlo,monospace">Δy =</label>';
 html += '<input id="f2ti" type="number" step="0.01" value="'+(t.userAnswer||'')+'" style="background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font:inherit;font-family:\'SF Mono\',Menlo,monospace;font-size:1rem;width:140px"/>';
 html += '<button class="action-btn" onclick="f2testCheck()">Check</button>';
 html += '<button class="action-btn secondary" onclick="f2testNew()">New problem</button>';
 html += '</div>';
 if(t.checked){
  if(t.correct){
   html += '<div class="result-box blue"><div class="result-box-name">Correct</div><div class="result-box-value" style="color:#22c55e">Δy = '+correctDy.toFixed(2)+' ✓</div><div class="result-box-desc">Yuh picked <span style="color:'+col+'">b_'+t.target+' = '+bj+'</span>, locked the other arm, an multiplied by ΔX = '+t.deltaX+'. Press <em>New problem</em> fer fresh numbers.</div></div>';
  } else {
   html += '<div class="result-box"><div class="result-box-name">Not quite</div><div class="result-box-value" style="color:#dc2626">Δy = '+correctDy.toFixed(2)+'</div><div class="result-box-desc">Pick the targeted slope <span style="color:'+col+'">b_'+t.target+' = '+bj+'</span>, lock the other arm at zero change, an multiply: Δy = '+bj+'·'+t.deltaX+' = <strong>'+correctDy.toFixed(2)+'</strong>.</div></div>';
  }
 }
 html += '</div>';
 return html;
}
function f2testCheck(){
 var input = document.getElementById('f2ti');
 var ans = parseFloat(input.value);
 var t = TS[2];
 t.userAnswer = input.value;
 var bj = t.target==='TV' ? t.bTV : t.bRadio;
 var correctDy = Math.round(bj * t.deltaX * 100)/100;
 t.checked = true;
 t.correct = !isNaN(ans) && Math.abs(ans - correctDy) < 0.02;
 rstep();
}
function f2testNew(){
 TS[2] = null;
 f2testEnsure();
 rstep();
}

// ============ FORM 3 — R² ============
function f3testEnsure(){
 if(!TS[3]){
  var sst = 800 + Math.floor(Math.random()*1200);
  var r2target = Math.round((0.55 + Math.random()*0.40)*100)/100;
  var ssr = Math.round(sst * r2target);
  TS[3] = {
   sst: sst, ssr: ssr, sse: sst - ssr,
   checked: false, correct: null, userAnswer: ''
  };
 }
}
function f3test(){
 var t = TS[3];
 var correctR2 = t.ssr/t.sst;
 var ssrPct = Math.round((t.ssr/t.sst)*100);
 var html = '<div class="step-content">';
 html += '<h3>Test — R²</h3>';
 html += '<p>Same four moves az Form 3. Read SST, identify the <span style="color:'+TVCOL+'">explained share (SSR)</span>, divide. Answer az a decimal (e.g. 0.82).</p>';
 html += '<div class="input-section-label">Fresh problem</div>';
 html += '<table class="data-table"><tbody>';
 html += '<tr><td>SST (total)</td><td>'+t.sst+'</td></tr>';
 html += '<tr><td style="color:'+TVCOL+'">SSR (explained)</td><td style="color:'+TVCOL+'">'+t.ssr+'</td></tr>';
 html += '<tr><td style="color:'+RADCOL+'">SSE (unexplained)</td><td style="color:'+RADCOL+'">'+t.sse+'</td></tr>';
 html += '</tbody></table>';
 html += '<div class="r2bar"><div class="r2bar-ssr" style="width:'+ssrPct+'%">SSR '+ssrPct+'%</div><div class="r2bar-sse" style="width:'+(100-ssrPct)+'%">SSE '+(100-ssrPct)+'%</div></div>';
 html += '<div class="derivation"><div class="d-label">Yer task</div><div>R² = <span style="color:'+TVCOL+'">SSR</span> / SST = ?</div></div>';
 html += '<div style="display:flex;gap:10px;align-items:center;margin:14px 0;flex-wrap:wrap">';
 html += '<label style="color:var(--text2);font-size:.95rem;font-family:\'SF Mono\',Menlo,monospace">R² =</label>';
 html += '<input id="f3ti" type="number" step="0.001" value="'+(t.userAnswer||'')+'" style="background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font:inherit;font-family:\'SF Mono\',Menlo,monospace;font-size:1rem;width:140px"/>';
 html += '<button class="action-btn" onclick="f3testCheck()">Check</button>';
 html += '<button class="action-btn secondary" onclick="f3testNew()">New problem</button>';
 html += '</div>';
 if(t.checked){
  if(t.correct){
   html += '<div class="result-box blue"><div class="result-box-name">Correct</div><div class="result-box-value" style="color:#22c55e">R² = '+correctR2.toFixed(3)+' ✓</div><div class="result-box-desc">Yuh divided <span style="color:'+TVCOL+'">'+t.ssr+'</span> by '+t.sst+' an got '+correctR2.toFixed(3)+' — meaning '+ssrPct+'% of the variance iz explained by the model. Press <em>New problem</em> fer fresh numbers.</div></div>';
  } else {
   html += '<div class="result-box"><div class="result-box-name">Not quite</div><div class="result-box-value" style="color:#dc2626">R² = '+correctR2.toFixed(3)+'</div><div class="result-box-desc">R² = <span style="color:'+TVCOL+'">SSR</span> / SST = <span style="color:'+TVCOL+'">'+t.ssr+'</span> / '+t.sst+' = <strong>'+correctR2.toFixed(3)+'</strong>. Accepts a value within 0.01 of the correct answer.</div></div>';
  }
 }
 html += '</div>';
 return html;
}
function f3testCheck(){
 var input = document.getElementById('f3ti');
 var ans = parseFloat(input.value);
 var t = TS[3];
 t.userAnswer = input.value;
 var correctR2 = t.ssr/t.sst;
 t.checked = true;
 t.correct = !isNaN(ans) && Math.abs(ans - correctR2) < 0.01;
 rstep();
}
function f3testNew(){
 TS[3] = null;
 f3testEnsure();
 rstep();
}

// ============ FORM 4 — H₀ decision ============
function f4testEnsure(){
 if(!TS[4]){
  var tcrit = 1.972;
  var rejectCase = Math.random() < 0.5;
  var tts;
  if(rejectCase){
   tts = Math.round((2.05 + Math.random()*3.0)*100)/100;
  } else {
   tts = Math.round((Math.random()*1.7)*100)/100;
  }
  if(Math.random()<0.5) tts = -tts;
  TS[4] = {
   tts: tts, tcrit: tcrit, alpha: 0.05, df: 197,
   checked: false, correct: null, userChoice: null
  };
 }
}
function f4test(){
 var t = TS[4];
 var shouldReject = Math.abs(t.tts) > t.tcrit;
 var html = '<div class="step-content">';
 html += '<h3>Test — Hypotesedecision</h3>';
 html += '<p>Same four moves az Form 4. State H₀, state H_A, set α, apply the decision rule: if |t_TS| > t_crit, forkast H₀.</p>';
 html += '<div class="input-section-label">Fresh problem</div>';
 html += '<table class="data-table"><tbody>';
 html += '<tr><td>H₀</td><td>bⱼ = 0</td></tr>';
 html += '<tr><td>H_A</td><td>bⱼ ≠ 0</td></tr>';
 html += '<tr><td>α</td><td>0.05</td></tr>';
 html += '<tr><td>df</td><td>'+t.df+'</td></tr>';
 html += '<tr><td style="color:'+TVCOL+'">t_TS (observed)</td><td style="color:'+TVCOL+'">'+t.tts.toFixed(2)+'</td></tr>';
 html += '<tr><td style="color:'+RADCOL+'">t_crit (threshold)</td><td style="color:'+RADCOL+'">±'+t.tcrit+'</td></tr>';
 html += '</tbody></table>';
 if(typeof bellSvgPlus==='function'){
  html += bellSvgPlus(t.tcrit, t.tts);
 }
 html += '<div class="derivation"><div class="d-label">Yer decision</div><div>Compare <span style="color:'+TVCOL+'">|t_TS|</span> with <span style="color:'+RADCOL+'">t_crit</span>. Click yer call below.</div></div>';
 html += '<div style="display:flex;gap:10px;align-items:center;margin:14px 0;flex-wrap:wrap">';
 html += '<button class="action-btn" onclick="f4testCheck(true)">Forkast H₀</button>';
 html += '<button class="action-btn secondary" onclick="f4testCheck(false)">Behold H₀</button>';
 html += '<button class="action-btn secondary" onclick="f4testNew()">New problem</button>';
 html += '</div>';
 if(t.checked){
  if(t.correct){
   html += '<div class="result-box blue"><div class="result-box-name">Correct</div><div class="result-box-value" style="color:#22c55e">'+(shouldReject?'Forkast H₀':'Behold H₀')+' ✓</div><div class="result-box-desc">|t_TS| = '+Math.abs(t.tts).toFixed(2)+' '+(shouldReject?'>':'<')+' t_crit = '+t.tcrit+', so '+(shouldReject?'forkast':'behold')+' H₀. Press <em>New problem</em> fer fresh numbers.</div></div>';
  } else {
   html += '<div class="result-box"><div class="result-box-name">Not quite</div><div class="result-box-value" style="color:#dc2626">'+(shouldReject?'Forkast H₀':'Behold H₀')+'</div><div class="result-box-desc">|t_TS| = '+Math.abs(t.tts).toFixed(2)+' '+(shouldReject?'>':'<')+' t_crit = '+t.tcrit+', so the right call iz <strong>'+(shouldReject?'forkast':'behold')+' H₀</strong>. Try again or press <em>New problem</em>.</div></div>';
  }
 }
 html += '</div>';
 return html;
}
function f4testCheck(userReject){
 var t = TS[4];
 t.userChoice = userReject;
 var shouldReject = Math.abs(t.tts) > t.tcrit;
 t.checked = true;
 t.correct = userReject === shouldReject;
 rstep();
}
function f4testNew(){
 TS[4] = null;
 f4testEnsure();
 rstep();
}

// ============ FORM 5 — Testverdi t_TS ============
function f5testEnsure(){
 if(!TS[5]){
  TS[5] = {
   bhat: Math.round((0.30 + Math.random()*2.5)*100)/100,
   se: Math.round((0.10 + Math.random()*0.60)*100)/100,
   theta0: 0,
   checked: false, correct: null, userAnswer: ''
  };
 }
}
function f5test(){
 var t = TS[5];
 var correctT = Math.round((t.bhat - t.theta0)/t.se * 100)/100;
 var html = '<div class="step-content">';
 html += '<h3>Test — Testverdi t_TS</h3>';
 html += '<p>Same four moves az Form 5. Read b̂ⱼ, subtract θ₀, read se(b̂ⱼ), divide.</p>';
 html += '<div class="input-section-label">Fresh problem</div>';
 html += '<table class="data-table"><tbody>';
 html += '<tr><td style="color:'+TVCOL+'">b̂ⱼ (estimated slope)</td><td style="color:'+TVCOL+'">'+t.bhat+'</td></tr>';
 html += '<tr><td>θ₀ (hypothesized value)</td><td>'+t.theta0+'</td></tr>';
 html += '<tr><td style="color:'+RADCOL+'">se(b̂ⱼ) (standard error)</td><td style="color:'+RADCOL+'">'+t.se+'</td></tr>';
 html += '</tbody></table>';
 html += '<div class="derivation"><div class="d-label">Yer task</div><div>t_TS = (<span style="color:'+TVCOL+'">b̂ⱼ</span> − θ₀) / <span style="color:'+RADCOL+'">se(b̂ⱼ)</span> = ?</div></div>';
 html += '<div style="display:flex;gap:10px;align-items:center;margin:14px 0;flex-wrap:wrap">';
 html += '<label style="color:var(--text2);font-size:.95rem;font-family:\'SF Mono\',Menlo,monospace">t_TS =</label>';
 html += '<input id="f5ti" type="number" step="0.01" value="'+(t.userAnswer||'')+'" style="background:var(--bg);color:var(--text);border:1px solid var(--border);border-radius:8px;padding:9px 14px;font:inherit;font-family:\'SF Mono\',Menlo,monospace;font-size:1rem;width:140px"/>';
 html += '<button class="action-btn" onclick="f5testCheck()">Check</button>';
 html += '<button class="action-btn secondary" onclick="f5testNew()">New problem</button>';
 html += '</div>';
 if(t.checked){
  if(t.correct){
   html += '<div class="result-box blue"><div class="result-box-name">Correct</div><div class="result-box-value" style="color:#22c55e">t_TS = '+correctT.toFixed(2)+' ✓</div><div class="result-box-desc">Yuh divided (<span style="color:'+TVCOL+'">'+t.bhat+'</span> − '+t.theta0+') by <span style="color:'+RADCOL+'">'+t.se+'</span> an got '+correctT.toFixed(2)+'. Press <em>New problem</em> fer fresh numbers.</div></div>';
  } else {
   html += '<div class="result-box"><div class="result-box-name">Not quite</div><div class="result-box-value" style="color:#dc2626">t_TS = '+correctT.toFixed(2)+'</div><div class="result-box-desc">t_TS = (<span style="color:'+TVCOL+'">'+t.bhat+'</span> − '+t.theta0+') / <span style="color:'+RADCOL+'">'+t.se+'</span> = '+(t.bhat - t.theta0).toFixed(2)+' / '+t.se+' = <strong>'+correctT.toFixed(2)+'</strong>.</div></div>';
  }
 }
 html += '</div>';
 return html;
}
function f5testCheck(){
 var input = document.getElementById('f5ti');
 var ans = parseFloat(input.value);
 var t = TS[5];
 t.userAnswer = input.value;
 var correctT = (t.bhat - t.theta0)/t.se;
 t.checked = true;
 t.correct = !isNaN(ans) && Math.abs(ans - correctT) < 0.05;
 rstep();
}
function f5testNew(){
 TS[5] = null;
 f5testEnsure();
 rstep();
}

// ============ Placeholder for Forms 6-7 ============
function fNtestPlaceholder(n){
 return '<div class="step-content"><h3>Test — Form '+n+'</h3><div class="empty-step">Form '+n+' test iz under construction. Forms 1-5 tests are live now — click any of those forms an then the Test pill.</div></div>';
}

// ============ Wire up ============
(function(){
 var prevR = rstep;
 rstep = function(){
  if(step===5){
   document.querySelectorAll('.step-btn').forEach(function(b,i){b.classList.toggle('active',i===4)});
   var el = document.getElementById('step-container');
   if(form===1){ f1testEnsure(); el.innerHTML = f1test(); }
   else if(form===2){ f2testEnsure(); el.innerHTML = f2test(); }
   else if(form===3){ f3testEnsure(); el.innerHTML = f3test(); }
   else if(form===4){ f4testEnsure(); el.innerHTML = f4test(); }
   else if(form===5){ f5testEnsure(); el.innerHTML = f5test(); }
   else { el.innerHTML = fNtestPlaceholder(form); }
   testWasActive = true;
  } else {
   if(testWasActive){
    S = {i:null, a:null, solved:false};
    rsvg();
    document.getElementById('conv-caption').innerHTML='Walk through the four steps. Drop data in Step 3 tuh resolve the bead.';
    testWasActive = false;
   }
   prevR();
  }
 };
 var prevS = switchForm;
 switchForm = function(n){
  TS = {};
  testWasActive = false;
  prevS(n);
 };
})();
