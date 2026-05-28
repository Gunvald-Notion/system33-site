// test.js — Test mode (Forms 1-3 live; 4-7 placeholder)
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

// ============ Placeholder for Forms 4-7 ============
function fNtestPlaceholder(n){
 return '<div class="step-content"><h3>Test — Form '+n+'</h3><div class="empty-step">Form '+n+' test iz under construction. Forms 1, 2, an 3 tests are live now — click any of those forms an then the Test pill.</div></div>';
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
