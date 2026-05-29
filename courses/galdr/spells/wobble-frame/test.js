/* === WOBBLE FRAME TEST FEATURE: zki + tki + pki live === */
(function(){
    var TS={zki:null,tki:null,pki:null};

    function ri(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
    function r2(n){return Math.round(n*100)/100;}
    function r4(n){return Math.round(n*10000)/10000;}
    function sv(n){return r2(n).toString();}

    function genZ(){
        var sqrts=[5,6,7,8,10];
        var sqrtN=sqrts[ri(0,4)];
        var n=sqrtN*sqrtN;
        var wobble=ri(2,6);
        var sigma=wobble*sqrtN;
        var center=ri(40,120);
        var confs=[{p:'90%',z:1.645},{p:'95%',z:1.960},{p:'99%',z:2.576}];
        var cc=confs[ri(0,2)];
        var E=cc.z*wobble;
        return {mode:'zki',isProp:false,n:n,sqrtN:sqrtN,
            centerLabel:'x\u0304',center:center,spreadLabel:'\u03C3',spread:sigma,
            stretchName:'z',stretch:cc.z,conf:cc.p,df:null,
            wobble:wobble,E:E,left:center-E,right:center+E,unit:'',tol:0.1,
            ans:{e:false,frame:false}};
    }

    function genT(){
        var opts=[{n:25,sqrtN:5,df:24,t90:1.711,t95:2.064,t99:2.797},
                  {n:16,sqrtN:4,df:15,t90:1.753,t95:2.131,t99:2.947}];
        var o=opts[ri(0,1)];
        var wobble=ri(2,6);
        var s=wobble*o.sqrtN;
        var center=ri(40,120);
        var confs=[{p:'90%',k:'t90'},{p:'95%',k:'t95'},{p:'99%',k:'t99'}];
        var cc=confs[ri(0,2)];
        var t=o[cc.k];
        var E=t*wobble;
        return {mode:'tki',isProp:false,n:o.n,sqrtN:o.sqrtN,
            centerLabel:'x\u0304',center:center,spreadLabel:'s',spread:s,
            stretchName:'t',stretch:t,conf:cc.p,df:o.df,
            wobble:wobble,E:E,left:center-E,right:center+E,unit:'',tol:0.1,
            ans:{e:false,frame:false}};
    }

    function genP(){
        var ns=[100,150,200,250,400];
        var n=ns[ri(0,4)];
        var phats=[0.25,0.30,0.35,0.40,0.45,0.50,0.55,0.60,0.65,0.70];
        var phat=phats[ri(0,9)];
        var confs=[{p:'90%',z:1.645},{p:'95%',z:1.960},{p:'99%',z:2.576}];
        var cc=confs[ri(0,2)];
        var wp=Math.sqrt(phat*(1-phat)/n);
        var Ep=cc.z*wp;
        return {mode:'pki',isProp:true,n:n,sqrtN:null,
            centerLabel:'p\u0302',phat:phat,center:phat*100,spreadLabel:null,
            stretchName:'z',stretch:cc.z,conf:cc.p,df:null,
            wobbleProp:wp,Eprop:Ep,wobble:wp*100,
            E:Ep*100,left:(phat-Ep)*100,right:(phat+Ep)*100,unit:'%',tol:0.2,
            ans:{e:false,frame:false}};
    }

    function gen(m){if(m==='zki')return genZ();if(m==='tki')return genT();if(m==='pki')return genP();return null;}

    function dataCard(d){
        if(d.mode==='zki'){
            return '<div class="data-card"><table class="data-table">'+
                '<tr><th>n</th><th>x\u0304</th><th>\u03C3</th><th>Confidence</th><th>z</th></tr>'+
                '<tr><td>'+d.n+'</td><td>'+sv(d.center)+'</td><td>'+sv(d.spread)+'</td><td>'+d.conf+'</td><td>'+d.stretch+'</td></tr>'+
                '</table></div>';
        }
        if(d.mode==='tki'){
            return '<div class="data-card"><table class="data-table">'+
                '<tr><th>n</th><th>x\u0304</th><th>s</th><th>Confidence</th><th>df</th><th>t</th></tr>'+
                '<tr><td>'+d.n+'</td><td>'+sv(d.center)+'</td><td>'+sv(d.spread)+'</td><td>'+d.conf+'</td><td>'+d.df+'</td><td>'+d.stretch+'</td></tr>'+
                '</table></div>';
        }
        return '<div class="data-card"><table class="data-table">'+
            '<tr><th>n</th><th>p\u0302</th><th>Confidence</th><th>z</th></tr>'+
            '<tr><td>'+d.n+'</td><td>'+sv(d.center)+'%</td><td>'+d.conf+'</td><td>'+d.stretch+'</td></tr>'+
            '</table></div>';
    }

    function formulaLine(d){
        if(d.isProp)return 'E = z \u00D7 \u221A(p\u0302(1\u2212p\u0302)/n)';
        return 'E = '+d.stretchName+' \u00D7 ('+d.spreadLabel+'/\u221An)';
    }

    function eWalk(d){
        if(d.isProp){
            return '<div class="d-line">wobble = \u221A(p\u0302(1\u2212p\u0302)/n) = \u221A('+d.phat+' \u00D7 '+r2(1-d.phat)+' / '+d.n+') = '+r4(d.wobbleProp)+'</div>'+
                '<div class="d-line">E = z \u00D7 wobble = '+d.stretch+' \u00D7 '+r4(d.wobbleProp)+' = '+r4(d.Eprop)+' \u2192 '+sv(d.E)+'%</div>';
        }
        return '<div class="d-line">wobble = '+d.spreadLabel+'/\u221An = '+sv(d.spread)+'/'+d.sqrtN+' = '+sv(d.wobble)+'</div>'+
            '<div class="d-line">E = '+d.stretchName+' \u00D7 wobble = '+d.stretch+' \u00D7 '+sv(d.wobble)+' = '+sv(d.E)+'</div>';
    }

    function u(d){return d.unit;}

    function testHtml(m){
        var d=TS[m];
        if(!d)return '<div class="step-content"><h3>Test</h3><p>Loading.</p></div>';
        return '<div class="step-content"><h3>Test</h3>'+
            '<p>Fresh random data each attempt. Build the confidence interval in two moves: first the margin, then the walls.</p>'+
            dataCard(d)+
            '<div class="derivation"><div class="d-label">Step 1 \u2014 the margin of error</div>'+
            '<div class="d-line">'+formulaLine(d)+'</div>'+
            '<div class="d-line" style="margin-top:10px"><input id="wf-e-in" type="number" step="0.01" placeholder="Enter E'+(d.unit?' in '+d.unit:'')+'" style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px 12px;color:var(--text);font-family:inherit;width:170px">'+
            ' <button id="wf-e-btn" class="mode-btn" style="padding:8px 18px">Check</button></div>'+
            '<div id="wf-e-fb" style="margin-top:10px"></div></div>'+
            '<div id="wf-frame-wrap" style="display:none"><div class="derivation"><div class="d-label">Step 2 \u2014 place the walls</div>'+
            '<div class="d-line">Left = '+d.centerLabel+' \u2212 E &nbsp;&nbsp; Right = '+d.centerLabel+' + E</div>'+
            '<div class="d-line" style="margin-top:10px"><input id="wf-left-in" type="number" step="0.01" placeholder="Left'+(d.unit?' '+d.unit:'')+'" style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px 12px;color:var(--text);font-family:inherit;width:120px">'+
            ' <input id="wf-right-in" type="number" step="0.01" placeholder="Right'+(d.unit?' '+d.unit:'')+'" style="background:var(--bg2);border:1px solid var(--border);border-radius:6px;padding:8px 12px;color:var(--text);font-family:inherit;width:120px">'+
            ' <button id="wf-frame-btn" class="mode-btn" style="padding:8px 18px">Check</button></div>'+
            '<div id="wf-frame-fb" style="margin-top:10px"></div></div></div>'+
            '<div style="margin-top:8px"><button id="wf-new-btn" class="step-btn">Ny test</button></div>'+
            '</div>';
    }

    function wireTest(m){
        var d=TS[m];
        if(!d)return;
        var eIn=document.getElementById('wf-e-in');
        var eBtn=document.getElementById('wf-e-btn');
        var eFb=document.getElementById('wf-e-fb');
        var frameWrap=document.getElementById('wf-frame-wrap');
        if(eBtn)eBtn.addEventListener('click',function(){
            var val=parseFloat(eIn.value);
            if(isNaN(val)){eFb.innerHTML='<span style="color:var(--muted)">Enter a number first.</span>';return;}
            if(Math.abs(val-d.E)<=d.tol){
                d.ans.e=true;
                eFb.innerHTML='<span style="color:var(--green)">Correct. E = '+sv(d.E)+u(d)+'.</span>';
                frameWrap.style.display='block';
            }else{
                eFb.innerHTML='<span style="color:var(--red)">Not quite. The walk:</span>'+eWalk(d);
            }
        });
        var lIn=document.getElementById('wf-left-in');
        var rIn=document.getElementById('wf-right-in');
        var fBtn=document.getElementById('wf-frame-btn');
        var fFb=document.getElementById('wf-frame-fb');
        if(fBtn)fBtn.addEventListener('click',function(){
            var lv=parseFloat(lIn.value);
            var rv=parseFloat(rIn.value);
            if(isNaN(lv)||isNaN(rv)){fFb.innerHTML='<span style="color:var(--muted)">Enter both walls first.</span>';return;}
            var lok=Math.abs(lv-d.left)<=d.tol;
            var rok=Math.abs(rv-d.right)<=d.tol;
            if(lok&&rok){
                d.ans.frame=true;
                fFb.innerHTML='<span style="color:var(--green)">Correct. KI = ['+sv(d.left)+u(d)+' , '+sv(d.right)+u(d)+'].</span>';
            }else{
                fFb.innerHTML='<span style="color:var(--red)">Look again.</span>'+
                    '<div class="d-line">Left = '+d.centerLabel+' \u2212 E = '+sv(d.center)+u(d)+' \u2212 '+sv(d.E)+u(d)+' = '+sv(d.left)+u(d)+'</div>'+
                    '<div class="d-line">Right = '+d.centerLabel+' + E = '+sv(d.center)+u(d)+' + '+sv(d.E)+u(d)+' = '+sv(d.right)+u(d)+'</div>';
            }
        });
        var nt=document.getElementById('wf-new-btn');
        if(nt)nt.addEventListener('click',function(){TS[m]=gen(m);renderTestStep();});
    }

    function renderTestStep(){
        document.querySelectorAll('.step-btn').forEach(function(b){b.classList.remove('active');});
        var tb=document.querySelector('.step-btn[data-step="5"]');
        if(tb)tb.classList.add('active');
        if(!TS[mode])TS[mode]=gen(mode);
        var el=document.getElementById('step-container');
        el.innerHTML=testHtml(mode);
        wireTest(mode);
    }

    function ensureTest(){
        var nav=document.getElementById('step-nav');
        if(!nav||document.querySelector('.step-btn[data-step="5"]'))return;
        var b=document.createElement('button');
        b.className='step-btn';
        b.setAttribute('data-step','5');
        b.innerHTML='Test';
        b.addEventListener('click',function(){currentStep=5;renderStep();});
        nav.appendChild(b);
    }

    var origRenderStep=renderStep;
    renderStep=function(){
        if(currentStep===5){renderTestStep();return;}
        origRenderStep();
    };
    window.renderStep=renderStep;
    window.renderTestStep=renderTestStep;

    function init(){ensureTest();}
    if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
    else{init();}
})();
