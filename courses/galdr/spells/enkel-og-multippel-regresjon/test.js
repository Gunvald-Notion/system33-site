// test.js — Test mode (Form 1 prototype; Forms 2-7 placeholder)
var TS = {};
var testWasActive = false;

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
   {name:'TV', b:TS[1].bTV, x:TS[1].xTV, c:'#f59e0b'},
   {name:'Radio', b:TS[1].bRadio, x:TS[1].xRadio, c:'#3b82f6'}
  ], solved: false};
  rsvg();
  document.getElementById('conv-caption').innerHTML='Test mode — enter ŷ tuh resolve the bead.';
 }
}

function f1test(){
 var t = TS[1];
 var correctY = Math.round((t.b0 + t.bTV*t.xTV + t.bRadio*t.xRadio)*100)/100;
 var html = '<div class="step-content">';
 html += '<h3>Test — Compute ŷ with fresh numbers</h3>';
 html += '<p>Same four moves az Form 1. New dataset every attempt. Pluck the pieces, sum the arms, output ŷ.</p>';
 html += '<div class="input-section-label">Fresh problem</div>';
 html += '<table class="data-table"><tbody>';
 html += '<tr><td>Intercept b₀</td><td>'+t.b0+'</td></tr>';
 html += '<tr><td>TV slope b_TV</td><td>'+t.bTV+'</td></tr>';
 html += '<tr><td>TV value X_TV</td><td>'+t.xTV+'</td></tr>';
 html += '<tr><td>Radio slope b_Radio</td><td>'+t.bRadio+'</td></tr>';
 html += '<tr><td>Radio value X_Radio</td><td>'+t.xRadio+'</td></tr>';
 html += '</tbody></table>';
 html += '<div class="derivation"><div class="d-label">Yer task</div><div>ŷ = b₀ + b_TV·X_TV + b_Radio·X_Radio = ?</div></div>';
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
   var arm1=Math.round(t.bTV*t.xTV*100)/100, arm2=Math.round(t.bRadio*t.xRadio*100)/100;
   html += '<div class="result-box"><div class="result-box-name">Not quite</div><div class="result-box-value" style="color:#dc2626">ŷ = '+correctY.toFixed(2)+'</div><div class="result-box-desc">Walk the four moves: <strong>'+t.b0+' + '+t.bTV+'·'+t.xTV+' + '+t.bRadio+'·'+t.xRadio+'</strong> = '+t.b0+' + '+arm1.toFixed(2)+' + '+arm2.toFixed(2)+' = <strong>'+correctY.toFixed(2)+'</strong>. Try again or press <em>New problem</em>.</div></div>';
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

function fNtestPlaceholder(n){
 return '<div class="step-content"><h3>Test — Form '+n+'</h3><div class="empty-step">Form '+n+' test iz under construction. Form 1 test iz available now — click Form 1 above an then the Test pill.</div></div>';
}

(function(){
 var prevR = rstep;
 rstep = function(){
  if(step===5){
   document.querySelectorAll('.step-btn').forEach(function(b,i){b.classList.toggle('active',i===4)});
   var el = document.getElementById('step-container');
   if(form===1){
    f1testEnsure();
    el.innerHTML = f1test();
   } else {
    el.innerHTML = fNtestPlaceholder(form);
   }
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
