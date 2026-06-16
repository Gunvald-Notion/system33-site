/* === SEM FORMASJON — TEST (Kap 16) — NORSK ===
   Én fokusert enkeltsvarsoppgave per form. Rendres inn i #test-host. */
(function(){
  'use strict';
  var form = 1, q = null;

  function el(id){ return document.getElementById(id); }
  function ri(a,b,dp){ var v=a+Math.random()*(b-a); var m=Math.pow(10,dp||0); return Math.round(v*m)/m; }
  function f(n){ if(n===null||n===undefined||isNaN(n)) return '&mdash;'; var r=Math.round(n*10000)/10000; if(r===Math.floor(r)) return r.toFixed(0); var s=r.toFixed(4); while(s.charAt(s.length-1)==='0') s=s.slice(0,-1); if(s.charAt(s.length-1)==='.') s=s.slice(0,-1); return s; }

  var gens = {
    1:function(){
      var lam=ri(0.20,0.95,2), ans=Math.round(lam*lam*100);
      return {
        prompt:'En standardisert ladning er &lambda; = '+f(lam)+'. Hvor mange prosent av indikatorens varians forklarer konstruktet? (&lambda;&sup2;, til n\u00E6rmeste hele %)',
        hint:'&lambda;&sup2; &times; 100',
        ans:ans, tol:1.5, unit:'%',
        deriv:'&lambda;&sup2; = '+f(lam)+'&sup2; = '+f(lam*lam)+' &rarr; '+ans+'%'
      };
    },
    2:function(){
      var b1=ri(0.20,0.70,2), b2=ri(0.20,0.70,2), b3=ri(0.05,0.40,2), ans=b3+b1*b2;
      return {
        prompt:'Den direkte banen er &beta;&#8323; = '+f(b3)+'. Omveisbeina er &beta;&#8321; = '+f(b1)+' og &beta;&#8322; = '+f(b2)+'. Hva er den totale effekten av &eta;&#8321; p\u00E5 &eta;&#8323;?',
        hint:'totalt = &beta;&#8323; + &beta;&#8321;&middot;&beta;&#8322;',
        ans:ans, tol:0.01, unit:'',
        deriv:'indirekte = '+f(b1)+'&middot;'+f(b2)+' = '+f(b1*b2)+' &nbsp;&rarr;&nbsp; totalt = '+f(b3)+' + '+f(b1*b2)+' = '+f(ans)
      };
    },
    3:function(){
      var cfi=ri(0.88,0.99,2), tli=ri(0.86,0.99,2), rmsea=ri(0.02,0.12,3), srmr=ri(0.02,0.11,3);
      var pass=(cfi>=0.95?1:0)+(tli>=0.95?1:0)+(rmsea<=0.06?1:0)+(srmr<=0.08?1:0);
      return {
        prompt:'En modell rapporterer CFI = '+f(cfi)+', TLI = '+f(tli)+', RMSEA = '+f(rmsea)+', SRMR = '+f(srmr)+'. Hvor mange av de fire grensene best\u00E5r den?',
        hint:'CFI &ge; 0.95 &middot; TLI &ge; 0.95 &middot; RMSEA &le; 0.06 &middot; SRMR &le; 0.08',
        ans:pass, tol:0, unit:' av 4',
        deriv:'CFI '+(cfi>=0.95?'&#10003;':'&#10007;')+' &middot; TLI '+(tli>=0.95?'&#10003;':'&#10007;')+' &middot; RMSEA '+(rmsea<=0.06?'&#10003;':'&#10007;')+' &middot; SRMR '+(srmr<=0.08?'&#10003;':'&#10007;')+' &rarr; '+pass+' av 4'
      };
    }
  };

  function fresh(){
    q = gens[form]();
    var host = el('test-host'); if(!host) return;
    host.innerHTML =
      '<p class="qprompt">'+q.prompt+'</p>'+
      '<p class="qh">Hint: '+q.hint+'</p>'+
      '<div class="input-row"><div class="input-group"><label>Ditt svar</label><input type="number" step="any" id="t-ans"></div></div>'+
      '<div class="btn-row"><button class="action-btn" id="t-check">Sjekk</button><button class="action-btn secondary" id="t-new">Nytt sp\u00F8rsm\u00E5l</button></div>'+
      '<div id="t-fb"></div>';
    el('t-check').addEventListener('click', judge);
    el('t-new').addEventListener('click', fresh);
    el('t-ans').addEventListener('keydown', function(e){ if(e.key==='Enter'){ judge(); } });
    el('t-ans').focus();
  }

  function judge(){
    if(!q) return;
    var raw=el('t-ans').value; if(raw==='') return;
    var val=parseFloat(raw), fb=el('t-fb');
    var ok = !isNaN(val) && Math.abs(val-q.ans)<=q.tol;
    var box='<div class="derivation"><div class="d-label">'+(ok?'<span class="ok">&#10003; Riktig</span>':'<span class="no">&#10007; Ikke helt</span>')+'</div>';
    box+='<div class="d-line">Svar: <strong>'+f(q.ans)+q.unit+'</strong></div>';
    box+='<div class="d-line">'+q.deriv+'</div></div>';
    fb.innerHTML=box;
  }

  window.renderTest = function(f){ form=f; fresh(); };
})();
