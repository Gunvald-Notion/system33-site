/* === Bell-Walk Test feature (Kap 7) === */
(function(){
  function C(n,k){
    if(k<0||k>n)return 0;
    if(k===0||k===n)return 1;
    if(k>n-k)k=n-k;
    var r=1;for(var i=0;i<k;i++)r=r*(n-i)/(i+1);return Math.round(r);
  }
  function fac(n){var r=1;for(var i=2;i<=n;i++)r*=i;return r;}
  function erf(x){
    var s=x<0?-1:1;x=Math.abs(x);
    var t=1/(1+0.3275911*x);
    var y=1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x);
    return s*y;
  }
  function ncdf(z){return 0.5*(1+erf(z/Math.SQRT2));}
  function ri(a,b){return Math.floor(Math.random()*(b-a+1))+a;}
  function rc(a){return a[Math.floor(Math.random()*a.length)];}
  function r2(x){return Math.round(x*100)/100;}

  var MODE_NAME={bin:'Binomial',hyp:'Hypergeometric',poi:'Poisson',nor:'Normal'};
  var TS={bin:null,hyp:null,poi:null,nor:null};

  var WHY={
    bin:{
      what:'the count of successes in a fixed number of independent tries, each with the same chance p.',
      use:'pass or fail inspections, free throws, polls of n people, defective units off a line.',
      exam:'look for a clear number of tries and a percentage per try. Those two numbers hand you the whole problem, and it is the most common discrete distribution they ask about.',
      fun:'If you can flip a coin n times and count heads, you can do this one.'
    },
    hyp:{
      what:'the count of successes when you draw from a finite pool without putting anything back, so the odds shift on every draw.',
      use:'card hands, lottery numbers, picking a committee, defective items pulled from a small batch.',
      exam:'the tell is exact counts, no percentage, and uten tilbakelegging (without replacement). A small shrinking pool means hypergeometric, not binomial.',
      fun:'Same counting spirit as Drainage from Kap 3, just stacked three deep.'
    },
    poi:{
      what:'the count of how often something happens in a window when all you know is the average rate \u03BB.',
      use:'calls per hour, emails per day, goals per match, typos per page, decay clicks per second.',
      exam:'the tell is a rate over a window and no fixed number of tries. If they say on average \u03BB per something and ask for a count, it is Poisson.',
      fun:'No box, no fixed tries, just things arriving on their own time.'
    },
    nor:{
      what:'the smooth bell for continuous measurements, and the shape that averages of many things settle into.',
      use:'heights, weights, time, measurement error, exam scores, and any average of many independent pieces (sentralgrensesetningen).',
      exam:'the tell is normalfordelt or a sum or average of many things. You standardize with z = (X \u2212 \u03BC) / \u03C3 and read the table. Almost every exam has one.',
      fun:'Once you can walk from X to z, every normal question is the same walk.'
    }
  };

  function genBin(){
    var n=rc([8,9,10,12,14,15]);
    var p=rc([0.2,0.25,0.3,0.4,0.5,0.6,0.7,0.75,0.8]);
    var k=Math.round(n*p)+ri(-2,2);
    if(k<0)k=0;if(k>n)k=n;
    var cnk=C(n,k),pk=Math.pow(p,k),qk=Math.pow(1-p,n-k);
    return {mode:'bin',n:n,p:p,k:k,cnk:cnk,pk:pk,qk:qk,ans:cnk*pk*qk,tol:0.01};
  }
  function genHyp(){
    var N=rc([20,24,30,40,50]);
    var M=ri(Math.round(N*0.3),Math.round(N*0.6));
    var n=rc([5,6,8,10]);
    if(n>N)n=Math.floor(N/2);
    var k=Math.round(n*M/N)+ri(-1,1);
    var kMax=Math.min(M,n),kMin=Math.max(0,n-(N-M));
    if(k<kMin)k=kMin;if(k>kMax)k=kMax;
    var a=C(M,k),b=C(N-M,n-k),c=C(N,n);
    return {mode:'hyp',N:N,M:M,n:n,k:k,a:a,b:b,c:c,ans:a*b/c,tol:0.01};
  }
  function genPoi(){
    var lam=rc([2,3,4,5,6,7]);
    var k=Math.round(lam)+ri(-2,3);
    if(k<0)k=0;
    var lk=Math.pow(lam,k),ev=Math.exp(-lam),kf=fac(k);
    return {mode:'poi',lam:lam,k:k,lk:lk,ev:ev,kf:kf,ans:lk*ev/kf,tol:0.01};
  }
  function genNor(){
    var mu=rc([50,60,100,120,150,170,200]);
    var sig=rc([4,5,6,8,10,12,15]);
    var zmag=rc([0.5,0.75,1,1.25,1.5,1.75,2]);
    var sign=rc([-1,1]);
    var x=Math.round(mu+sign*zmag*sig);
    var z=(x-mu)/sig;
    var zr=Math.round(z*100)/100;
    var phi=ncdf(zr);
    var dir=rc(['le','gt']);
    return {mode:'nor',mu:mu,sig:sig,x:x,z:z,zr:zr,phi:phi,dir:dir,prob:dir==='le'?phi:1-phi,ztol:0.02,tol:0.01};
  }
  function gen(m){if(m==='bin')return genBin();if(m==='hyp')return genHyp();if(m==='poi')return genPoi();return genNor();}

  function whyCard(m){
    var w=WHY[m];
    return '<div class="data-card" style="border-left:3px solid var(--accent);background:rgba(167,139,250,0.04)">'+
      '<div class="data-title" style="color:var(--accent)">Why this spell matters</div>'+
      '<p style="color:var(--text2);font-size:.88rem;line-height:1.6;margin:4px 0"><strong style="color:var(--text)">What it is.</strong> '+w.what+'</p>'+
      '<p style="color:var(--text2);font-size:.88rem;line-height:1.6;margin:4px 0"><strong style="color:var(--text)">Where it shows up.</strong> '+w.use+'</p>'+
      '<p style="color:var(--text2);font-size:.88rem;line-height:1.6;margin:4px 0"><strong style="color:var(--text)">On the eksamen.</strong> '+w.exam+'</p>'+
      '<p style="color:var(--accent);font-size:.85rem;line-height:1.6;margin:6px 0 0">'+w.fun+'</p>'+
      '</div>';
  }
  function inputRow(id,ph,fn){
    return '<div style="display:flex;align-items:center;gap:8px;margin:10px 0;flex-wrap:wrap">'+
      '<input id="'+id+'" type="text" placeholder="'+ph+'" style="background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:10px 14px;color:var(--text);font-family:inherit;font-size:.9rem;width:150px">'+
      '<button onclick="'+fn+'" style="background:var(--accent);border:none;border-radius:8px;padding:10px 20px;color:#0a0a0b;font-family:inherit;font-size:.85rem;font-weight:600;cursor:pointer">Check</button>'+
      '</div>';
  }
  function newBtn(){
    return '<div style="margin-top:18px"><button onclick="bwNew()" style="background:var(--bg-card);border:1px solid var(--border);border-radius:8px;padding:10px 18px;color:var(--text2);font-family:inherit;font-size:.85rem;cursor:pointer">\u21BB Ny test</button></div>';
  }
  function discreteProblem(d){
    var rows,q;
    if(d.mode==='bin'){
      rows='<tr><th>n (tries)</th><th>p (per try)</th><th>k (asking)</th></tr><tr><td>'+d.n+'</td><td>'+d.p+'</td><td>'+d.k+'</td></tr>';
      q='X \u223C Bin('+d.n+', '+d.p+'). Find <strong>P(X = '+d.k+')</strong> \u2014 the weight on exactly '+d.k+' successes.';
    }else if(d.mode==='hyp'){
      rows='<tr><th>N (total)</th><th>M (special)</th><th>n (drawn)</th><th>k (asking)</th></tr><tr><td>'+d.N+'</td><td>'+d.M+'</td><td>'+d.n+'</td><td>'+d.k+'</td></tr>';
      q='X \u223C Hyp('+d.N+', '+d.M+', '+d.n+'). Find <strong>P(X = '+d.k+')</strong> \u2014 exactly '+d.k+' of the special kind in your hand.';
    }else{
      rows='<tr><th>\u03BB (rate)</th><th>k (asking)</th></tr><tr><td>'+d.lam+'</td><td>'+d.k+'</td></tr>';
      q='X \u223C Po('+d.lam+'). Find <strong>P(X = '+d.k+')</strong> 