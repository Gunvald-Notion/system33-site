(function(){
    /* === RANDOM DATA GENERATORS === */
    function genT2(){
        var mu0=Math.round((Math.random()*80000+80000)/1000)*1000;
        var n=Math.floor(Math.random()*16)+10;
        var s=Math.round((Math.random()*20000+10000)/1000)*1000;
        var tobs=+(( (Math.random()*3-1.5) ).toFixed(2));
        var xbar=Math.round((mu0+tobs*s/Math.sqrt(n))/100)*100;
        tobs=+((xbar-mu0)/(s/Math.sqrt(n))).toFixed(2);
        var tcrit=2.064;
        return {mu0:mu0,xbar:xbar,s:s,n:n,df:24,alpha:0.05,tobs:tobs,tcrit:tcrit,oneTail:false,useT:true,
            critLabel:'\u00B12.064',modeIntro:'Tosidig, t_krit = \u00B12.064.'};
    }
    function genT1(){
        var mu0=Math.round((Math.random()*80000+80000)/1000)*1000;
        var n=Math.floor(Math.random()*16)+10;
        var s=Math.round((Math.random()*20000+10000)/1000)*1000;
        var tobs=+(( (Math.random()*3-0.5) ).toFixed(2));
        var xbar=Math.round((mu0+tobs*s/Math.sqrt(n))/100)*100;
        tobs=+((xbar-mu0)/(s/Math.sqrt(n))).toFixed(2);
        var tcrit=1.711;
        return {mu0:mu0,xbar:xbar,s:s,n:n,df:24,alpha:0.05,tobs:tobs,tcrit:tcrit,oneTail:true,useT:true,
            critLabel:'+1.711',modeIntro:'Ensidig (h\u00F8yre), t_krit = +1.711.'};
    }
    function genZ2(){
        var mu0=Math.round(Math.random()*100+20);
        var sigma=Math.round(Math.random()*15+5);
        var n=Math.floor(Math.random()*30)+20;
        var zobs=+(( (Math.random()*4-2) ).toFixed(2));
        var xbar=+((mu0+zobs*sigma/Math.sqrt(n)).toFixed(1));
        zobs=+((xbar-mu0)/(sigma/Math.sqrt(n))).toFixed(2);
        var zcrit=1.96;
        return {mu0:mu0,xbar:xbar,sigma:sigma,n:n,alpha:0.05,tobs:zobs,tcrit:zcrit,oneTail:false,useT:false,
            critLabel:'\u00B11.96',modeIntro:'Tosidig, z_krit = \u00B11.96.'};
    }

    var currentData=null;
    var currentMode=null;

    function getMode(){
        var btn=document.querySelector('.mode-btn.active');
        return btn?btn.dataset.mode:'t2';
    }

    function freshData(){
        var m=getMode();
        currentMode=m;
        if(m==='t2')currentData=genT2();
        else if(m==='t1')currentData=genT1();
        else currentData=genZ2();
    }

    /* === HTML BUILDER === */
    function testHtml(d){
        var stat=d.useT?'T':'z';
        var wobble=d.useT?(d.s/Math.sqrt(d.n)).toFixed(2):(d.sigma/Math.sqrt(d.n)).toFixed(2);
        var gap=(d.xbar-d.mu0).toFixed(2);
        var dfLine=d.useT?('<p><strong>df</strong> = '+d.df+'</p>'):
            '<p>\u03C3 = '+d.sigma+' (kjent) &nbsp; <strong>z-test</strong></p>';
        return '<div class="step-content" id="test-panel">'+
            '<h3>Steg 5 \u2014 Test</h3>'+
            '<p style="color:var(--muted);font-size:0.85rem;">'+d.modeIntro+' Ferske tilfeldige data hvert fors\u00F8k.</p>'+
            '<div class="data-card"><table class="data-table"><tr>'+
            (d.useT?'<th>\u03BC\u2080</th><th>x\u0304</th><th>s</th><th>n</th><th>\u03B1</th></tr>'+
                '<tr><td>'+d.mu0+'</td><td>'+d.xbar+'</td><td>'+d.s+'</td><td>'+d.n+'</td><td>'+d.alpha+'</td></tr>'
            :'<th>\u03BC\u2080</th><th>x\u0304</th><th>\u03C3</th><th>n</th><th>\u03B1</th></tr>'+
                '<tr><td>'+d.mu0+'</td><td>'+d.xbar+'</td><td>'+d.sigma+'</td><td>'+d.n+'</td><td>'+d.alpha+'</td></tr>')+
            '</table></div>'+
            dfLine+
            '<div class="derivation"><div class="d-label">Ristingen (linjalen)</div>'+
            '<div class="d-line">'+
            (d.useT?'s/\u221An = '+d.s+'/\u221A'+d.n+' = <strong>'+wobble+'</strong>'
                :'\u03C3/\u221An = '+d.sigma+'/\u221A'+d.n+' = <strong>'+wobble+'</strong>')+
            '</div></div>'+
            '<div class="derivation"><div class="d-label">Beregn '+stat+'_obs</div>'+
            '<div class="d-line">('+d.xbar+' \u2212 '+d.mu0+') / '+wobble+' = ?</div></div>'+
            '<div style="display:flex;gap:8px;align-items:center;margin:16px 0;">'+
            '<input id="tobs-input" type="number" step="0.01" placeholder="Skriv inn '+stat+'_obs" style="'+
            'flex:1;background:#1a1a1a;border:1px solid #3f3f46;border-radius:6px;'+
            'color:#fafafa;padding:8px 12px;font-size:1rem;"/>'+
            '<button id="tobs-check" style="background:#a78bfa;color:#0a0a0a;border:none;'+
            'border-radius:6px;padding:8px 14px;cursor:pointer;font-weight:700;">Sjekk</button>'+
            '</div>'+
            '<div id="tobs-feedback"></div>'+
            '<div style="margin-top:16px;">'+
            '<p><strong>Bestem:</strong> '+stat+'_obs = '+d.tobs.toFixed(2)+
            (d.oneTail?' &nbsp; vs &nbsp; '+stat+'_krit = +'+d.tcrit:' &nbsp; vs &nbsp; '+stat+'_krit = \u00B1'+d.tcrit)+
            '</p>'+
            '<div style="display:flex;gap:8px;">'+
            '<button class="decide-btn" data-val="forkast" style="flex:1;padding:10px;border:1px solid #3f3f46;'+
            'background:#1a1a1a;color:#fafafa;border-radius:6px;cursor:pointer;font-size:0.9rem;">Forkast H\u2080</button>'+
            '<button class="decide-btn" data-val="behold" style="flex:1;padding:10px;border:1px solid #3f3f46;'+
            'background:#1a1a1a;color:#fafafa;border-radius:6px;cursor:pointer;font-size:0.9rem;">Behold H\u2080</button>'+
            '</div></div>'+
            '<div id="decide-feedback"></div>'+
            '<button id="retry-btn" style="margin-top:20px;width:100%;background:transparent;border:1px solid #3f3f46;'+
            'color:#a78bfa;border-radius:6px;padding:10px;cursor:pointer;">Ny test</button>'+
            '</div>';
    }

    /* === WIRE === */
    function wireTest(d){
        var stat=d.useT?'T':'z';
        var wobble=d.useT?(d.s/Math.sqrt(d.n)).toFixed(2):(d.sigma/Math.sqrt(d.n)).toFixed(2);

        document.getElementById('tobs-check').addEventListener('click',function(){
            var val=parseFloat(document.getElementById('tobs-input').value);
            var fb=document.getElementById('tobs-feedback');
            if(isNaN(val)){fb.innerHTML='<p style="color:#f97316;">Skriv inn et tall f\u00F8rst.</p>';return;}
            var correct=+((d.xbar-d.mu0)/parseFloat(wobble)).toFixed(2);
            if(Math.abs(val-correct)<0.05){
                fb.innerHTML='<p style="color:#22c55e;">&#10003; Riktig. '+stat+'_obs = '+correct.toFixed(2)+'</p>';
            } else {
                fb.innerHTML='<p style="color:#ef4444;">Ikke helt. Her er gjennomgangen:<br>'+
                    'Ristingen = '+wobble+'<br>'+
                    'Gapet = '+(d.xbar-d.mu0).toFixed(2)+'<br>'+
                    stat+'_obs = '+(d.xbar-d.mu0).toFixed(2)+' / '+wobble+' = '+correct.toFixed(2)+'</p>';
            }
        });

        document.querySelectorAll('.decide-btn').forEach(function(b){
            b.addEventListener('click',function(){
                var chosen=b.dataset.val;
                var actual=d.oneTail?(d.tobs>d.tcrit?'forkast':'behold')
                    :(Math.abs(d.tobs)>d.tcrit?'forkast':'behold');
                var fb=document.getElementById('decide-feedback');
                if(chosen===actual){
                    var dir=actual==='forkast'?'Forbi veggen \u2192 forkast.':'Innenfor veggen \u2192 behold.';
                    fb.innerHTML='<p style="color:#22c55e;">&#10003; Riktig. '+dir+'</p>';
                } else {
                    var walk=d.oneTail?
                        (stat+'_obs = '+d.tobs.toFixed(2)+' vs '+stat+'_krit = +'+d.tcrit+'. '+
                        (d.tobs>d.tcrit?'Forbi veggen \u2192 forkast.':'Innenfor veggen \u2192 behold.'))
                        :(stat+'_obs = '+d.tobs.toFixed(2)+' vs '+stat+'_krit = \u00B1'+d.tcrit+'. '+
                        (Math.abs(d.tobs)>d.tcrit?'Forbi veggen \u2192 forkast.':'Innenfor veggen \u2192 behold.'));
                    fb.innerHTML='<p style="color:#ef4444;">Se igjen... '+walk+'</p>';
                }
            });
        });

        document.getElementById('retry-btn').addEventListener('click',function(){
            freshData();
            renderStep5();
        });
    }

    function renderStep5(){
        var el=document.getElementById('step-container');
        el.innerHTML=testHtml(currentData);
        wireTest(currentData);
    }

    function ensureStep5(){
        var btns=document.querySelectorAll('.step-btn');
        var has5=false;
        btns.forEach(function(b){if(parseInt(b.dataset.step)===5)has5=true;});
        if(!has5){
            var nav=document.querySelector('.step-nav');
            if(nav){
                var b5=document.createElement('button');
                b5.className='step-btn';
                b5.dataset.step='5';
                b5.textContent='5';
                nav.appendChild(b5);
                b5.addEventListener('click',function(){
                    document.querySelectorAll('.step-btn').forEach(function(x){x.classList.remove('active');});
                    b5.classList.add('active');
                    currentStep=5;
                    freshData();
                    renderStep5();
                });
            }
        }
    }

    /* === HOOK INTO renderStep === */
    var origRenderStep=renderStep;
    renderStep=function(){
        if(currentStep===5){
            if(!currentData||currentMode!==getMode()){freshData();}
            document.querySelectorAll('.step-btn').forEach(function(b){b.classList.remove('active');});
            var b5=document.querySelector('.step-btn[data-step="5"]');
            if(b5)b5.classList.add('active');
            renderStep5();
        } else {
            origRenderStep();
        }
    };

    ensureStep5();
    freshData();
})();
