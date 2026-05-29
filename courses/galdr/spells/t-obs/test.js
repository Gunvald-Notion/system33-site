/* === T_obs TEST FEATURE - Batch 2: t2 + t1 + z2 all live === */
(function(){
    var TS={t2:null,t1:null,z2:null};

    function ri(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
    function rf(a,b){return Math.random()*(b-a)+a;}
    function fmt(n,p){return Number(n).toFixed(p);}
    function fmtKr(n){return Math.round(n).toLocaleString('no-NO');}
    function fv(d,v){if(d.money)return fmtKr(v);return (Math.round(v*100)/100).toString();}

    function genT2(){
        var n=25,df=24,crit=2.064;
        var mu0=ri(80,200)*1000;
        var s=ri(15,40)*1000;
        var wobble=s/Math.sqrt(n);
        var target;
        do{target=rf(-3,3);}while(Math.abs(target)>=1.88&&Math.abs(target)<=2.24);
        var xbar=mu0+Math.round(target*wobble/100)*100;
        var tobs=(xbar-mu0)/wobble;
        var verdict=Math.abs(tobs)>crit?'forkast':'behold';
        return {mode:'t2',mu0:mu0,xbar:xbar,spread:s,spreadLabel:'s',n:n,df:df,wobble:wobble,
            stat:tobs,statName:'T<sub>obs</sub>',statPlain:'T_obs',verdict:verdict,
            crit:crit,critLabel:'\u00B12.064',critHeader:'t<sub>crit</sub>',critName:'t<sub>crit</sub>',
            oneTail:false,money:true,
            intro:'Two-tailed, t<sub>crit</sub> = \u00B12.064.',
            ans:{tobs:false,decision:false}};
    }

    function genT1(){
        var n=25,df=24,crit=1.711;
        var mu0=ri(80,200)*1000;
        var s=ri(15,40)*1000;
        var wobble=s/Math.sqrt(n);
        var target;
        do{target=rf(-3,3);}while(Math.abs(target)>=1.53&&Math.abs(target)<=1.89);
        var xbar=mu0+Math.round(target*wobble/100)*100;
        var tobs=(xbar-mu0)/wobble;
        var verdict=tobs>crit?'forkast':'behold';
        return {mode:'t1',mu0:mu0,xbar:xbar,spread:s,spreadLabel:'s',n:n,df:df,wobble:wobble,
            stat:tobs,statName:'T<sub>obs</sub>',statPlain:'T_obs',verdict:verdict,
            crit:crit,critLabel:'+1.711',critHeader:'t<sub>crit</sub>',critName:'t<sub>crit</sub>',
            oneTail:true,money:true,
            intro:'One-tailed (right), t<sub>crit</sub> = +1.711.',
            ans:{tobs:false,decision:false}};
    }

    function genZ2(){
        var n=36,crit=1.96;
        var mu0=ri(20,100);
        var sigma=ri(6,18);
        var wobble=sigma/Math.sqrt(n);
        var target;
        do{target=rf(-3,3);}while(Math.abs(target)>=1.78&&Math.abs(target)<=2.14);
        var xbar=mu0+Math.round(target*wobble*10)/10;
        var zobs=(xbar-mu0)/wobble;
        var verdict=Math.abs(zobs)>crit?'forkast':'behold';
        return {mode:'z2',mu0:mu0,xbar:xbar,spread:sigma,spreadLabel:'\u03C3',n:n,df:null,wobble:wobble,
            stat:zobs,statName:'z<sub>obs</sub>',statPlain:'z_obs',verdict:verdict,
            crit:crit,critLabel:'\u00B11.96',critHeader:'z<sub>crit</sub>',critName:'z<sub>crit</sub>',
            oneTail:false,money:false,
            intro:'Two-tailed, z<sub>crit</sub> = \u00B11.96.',
            ans:{tobs:false,decision:false}};
    }

    function gen(m){if(m==='t2')return genT2();if(m==='t1')return genT1();if(m==='z2')return genZ2();return null;}

    function placeholderHtml(){
        return '<div class="step-content"><h3>Step 5 \u2014 Test</h3>'+
            '<p>Test for this mode lands in the next batch. Switch to <strong>Tosidig t-test</strong> to try it now.</p></div>';
    }

    function dataCard(d){
        var dfCell=d.df!=null?'<th>df</th>':'';
        var dfVal=d.df!=null?'<td>'+d.df+'</td>':'';
        return '<div class="data-card"><table class="data-table">'+
            '<tr><th>\u03BC\u2080</th><th>x\u0304</th><th>'+d.spreadLabel+'</th><th>n</th>'+dfCell+'<th>'+d.critHeader+'</th></tr>'+
            '<tr><td>'+fv(d,d.mu0)+'</td><td>'+fv(d,d.xbar)+'</td><td>'+fv(d,d.spread)+'</td><td>'+d.n+'</td>'+dfVal+'<td>'+d.critLabel+'</td></tr>'+
            '</table></div>';
    }

    function testHtml(m){
        var d=TS[m];
        if(!d)return placeholderHtml();
        return '<div class="step-content"><h3>Step 5 \u2014 Test</h3>'+
            '<p>Fresh random data each attempt. Compute '+d.statName+', then decide. '+d.intro+'</p>'+
            dataCard(d)+
            '<div class="derivation"><div class="d-label">Compute '+d.statName+'</div>'+
            '<div class="d-line">'+d.statName+' = (x\u0304 \u2212 \u03BC\u2080) / ('+d.spreadLabel+'/\u221An)</div>'+
            '<div class="d-line" style="margin-top:10px"><input id="tobs-in" type="number" step="0.01" placeholder="Enter '+d.statPlain+'" style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px 12px;color:var(--text);font-family:inherit;width:150px">'+
            ' <button id="tobs-btn" class="mode-btn" style="padding:8px 18px">Check</button></div>'+
            '<div id="tobs-fb" style="margin-top:10px"></div></div>'+
            '<div id="decide-wrap" style="display:none"><div class="derivation"><div class="d-label">Decide</div>'+
            '<div class="d-line">Past the wall \u2192 forkast. Inside \u2192 behold.</div>'+
            '<div class="d-line" style="margin-top:10px"><button id="forkast-btn" class="mode-btn" style="padding:8px 18px">Forkast H\u2080</button>'+
            ' <button id="behold-btn" class="mode-btn" style="padding:8px 18px">Behold H\u2080</button></div>'+
            '<div id="decide-fb" style="margin-top:10px"></div></div></div>'+
            '<div style="margin-top:8px"><button id="newtest-btn" class="step-btn">Ny test</button></div>'+
            '</div>';
    }

    function wireTest(m){
        var d=TS[m];
        if(!d)return;
        var inp=document.getElementById('tobs-in');
        var btn=document.getElementById('tobs-btn');
        var fb=document.getElementById('tobs-fb');
        var decideWrap=document.getElementById('decide-wrap');
        if(btn)btn.addEventListener('click',function(){
            var val=parseFloat(inp.value);
            if(isNaN(val)){fb.innerHTML='<span style="color:var(--muted)">Enter a number first.</span>';return;}
            if(Math.abs(val-d.stat)<=0.05){
                d.ans.tobs=true;
                fb.innerHTML='<span style="color:var(--green)">Correct. '+d.statName+' = '+fmt(d.stat,2)+'.</span>';
                decideWrap.style.display='block';
            }else{
                fb.innerHTML='<span style="color:var(--red)">Not quite. The walk:</span>'+
                    '<div class="d-line">wobble = '+d.spreadLabel+'/\u221An = '+fv(d,d.spread)+' / '+Math.sqrt(d.n)+' = '+fv(d,d.wobble)+'</div>'+
                    '<div class="d-line">gap = x\u0304 \u2212 \u03BC\u2080 = '+fv(d,d.xbar)+' \u2212 '+fv(d,d.mu0)+' = '+fv(d,d.xbar-d.mu0)+'</div>'+
                    '<div class="d-line">'+d.statName+' = gap / wobble = '+fmt(d.stat,2)+'</div>';
            }
        });
        var fk=document.getElementById('forkast-btn');
        var bh=document.getElementById('behold-btn');
        var dfb=document.getElementById('decide-fb');
        function decide(choice){
            if(choice===d.verdict){
                dfb.innerHTML='<span style="color:var(--green)">Correct \u2014 '+(d.verdict==='forkast'?'past the wall. Forkast H\u2080.':'inside the wall. Behold H\u2080.')+'</span>';
            }else{
                var lhs=d.oneTail?(d.statName+' = '+fmt(d.stat,2)):('|'+d.statName+'| = '+fmt(Math.abs(d.stat),2));
                dfb.innerHTML='<span style="color:var(--red)">Look again. '+lhs+' vs '+d.critName+' = '+d.critLabel+' \u2192 '+d.verdict+' H\u2080.</span>';
            }
        }
        if(fk)fk.addEventListener('click',function(){decide('forkast');});
        if(bh)bh.addEventListener('click',function(){decide('behold');});
        var nt=document.getElementById('newtest-btn');
        if(nt)nt.addEventListener('click',function(){TS[m]=gen(m);renderStepFive();});
    }

    function renderStepFive(){
        document.querySelectorAll('.step-btn').forEach(function(b){b.classList.remove('active');});
        var five=document.querySelector('.step-btn[data-step="5"]');
        if(five)five.classList.add('active');
        if(!TS[mode])TS[mode]=gen(mode);
        var el=document.getElementById('step-container');
        el.innerHTML=testHtml(mode);
        wireTest(mode);
    }

    function ensureStep5(){
        var nav=document.getElementById('step-nav');
        if(!nav||document.querySelector('.step-btn[data-step="5"]'))return;
        var b=document.createElement('button');
        b.className='step-btn';
        b.setAttribute('data-step','5');
        b.innerHTML='Step 5 \u2014 Test';
        b.addEventListener('click',function(){currentStep=5;renderStep();});
        nav.appendChild(b);
    }

    var origRenderStep=renderStep;
    renderStep=function(){
        if(currentStep===5){renderStepFive();return;}
        origRenderStep();
    };
    window.renderStep=renderStep;
    window.renderStepFive=renderStepFive;

    function init(){ensureStep5();}
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
    else{init();}
})();
