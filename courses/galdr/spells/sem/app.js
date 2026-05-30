/* === SEM FORMATION (Kap 16) ===
   Four forms: factor loadings, mediation, fit indices, path-diagram anatomy.
   Blueprint -> Process -> Data -> Formula -> Test (Test lives in test.js). */
(function(){
  'use strict';
  var step = 1, form = 1, dropped = false, result = null;

  function el(id){ return document.getElementById(id); }
  function f(n){
    if(n===null||n===undefined||isNaN(n)) return '&mdash;';
    var r = Math.round(n*10000)/10000;
    if(r===Math.floor(r)) return r.toFixed(0);
    var s = r.toFixed(4);
    while(s.charAt(s.length-1)==='0') s = s.slice(0,-1);
    if(s.charAt(s.length-1)==='.') s = s.slice(0,-1);
    return s;
  }
  function pct(n){ return (Math.round(n*1000)/10) + '%'; }

  /* ---------- SVG path-diagram helpers ---------- */
  function svg(inner,h){ h=h||210; return '<svg viewBox="0 0 360 '+h+'" width="100%" style="max-width:440px;display:block;margin:0 auto"><defs><marker id="ah" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#a1a1aa"/></marker><marker id="ahp" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L7,3 L0,6 Z" fill="#a78bfa"/></marker></defs>'+inner+'</svg>'; }
  function ell(cx,cy,rx,ry,label){ return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="rgba(96,165,250,.08)" stroke="#60a5fa" stroke-width="1.5"/><text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" fill="#fafafa" font-size="13">'+label+'</text>'; }
  function rct(x,y,w,h,label){ return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="4" fill="rgba(251,146,60,.10)" stroke="#fb923c" stroke-width="1.5"/><text x="'+(x+w/2)+'" y="'+(y+h/2+4)+'" text-anchor="middle" fill="#fafafa" font-size="12">'+label+'</text>'; }
  function ln(x1,y1,x2,y2,label,o){ o=o||{}; var col=o.accent?'#a78bfa':'#a1a1aa'; var mk=o.accent?'url(#ahp)':'url(#ah)'; var dash=o.dash?' stroke-dasharray="5,4"':''; var s='<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col+'" stroke-width="1.5" marker-end="'+mk+'"'+dash+'/>'; if(label){ var mx=(x1+x2)/2,my=(y1+y2)/2; s+='<text x="'+(mx+(o.lx||6))+'" y="'+(my+(o.ly||-4))+'" fill="'+col+'" font-size="12" font-style="italic">'+label+'</text>'; } return s; }
  function crc(cx,cy,r,label){ return '<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="#52525b" stroke-width="1.3"/><text x="'+cx+'" y="'+(cy+4)+'" text-anchor="middle" fill="#a1a1aa" font-size="11">'+label+'</text>'; }

  function vizLambda(d,res){
    var inner='';
    inner+=ell(180,38,74,26,'&eta;  (latent)');
    inner+=rct(120,150,120,42,'X  (indicator)');
    inner+=ln(180,64,180,150,'&lambda;',{accent:true,lx:10,ly:0});
    inner+=crc(308,171,12,'&delta;');
    inner+=ln(308,159,242,165,'',{});
    if(d&&res){ var ex=Math.max(0,Math.min(1,res.lam2)); var bx=70,bw=220,by=212; inner+='<text x="'+bx+'" y="'+(by-4)+'" fill="#a1a1aa" font-size="10">explained &lambda;&sup2; = '+Math.round(ex*100)+'%</text>'; inner+='<rect x="'+bx+'" y="'+by+'" width="'+bw+'" height="14" rx="3" fill="#27272a"/>'; inner+='<rect x="'+bx+'" y="'+by+'" width="'+(bw*ex)+'" height="14" rx="3" fill="#a78bfa"/>'; }
    return svg(inner,236);
  }
  function vizMed(){
    var inner='';
    inner+=ell(58,66,44,23,'&eta;&#8321;');
    inner+=ell(180,66,44,23,'&eta;&#8322;');
    inner+=ell(302,66,44,23,'&eta;&#8323;');
    inner+=ln(102,66,136,66,'&beta;&#8321;',{accent:true,ly:-10,lx:-4});
    inner+=ln(224,66,258,66,'&beta;&#8322;',{accent:true,ly:-10,lx:-4});
    inner+='<path d="M60,89 Q180,158 300,89" fill="none" stroke="#a1a1aa" stroke-width="1.4" stroke-dasharray="5,4" marker-end="url(#ah)"/>';
    inner+='<text x="180" y="150" text-anchor="middle" fill="#a1a1aa" font-size="12" font-style="italic">&beta;&#8323; (direct)</text>';
    return svg(inner,170);
  }
  function gauge(y,label,type,thr,smax,val){
    var x=120,w=200,s='';
    s+='<text x="'+(x-10)+'" y="'+(y+4)+'" text-anchor="end" fill="#a1a1aa" font-size="11">'+label+'</text>';
    s+='<rect x="'+x+'" y="'+(y-5)+'" width="'+w+'" height="10" rx="5" fill="#27272a"/>';
    if(type==='good'){ var gx=x+w*thr; s+='<rect x="'+gx+'" y="'+(y-5)+'" width="'+(x+w-gx)+'" height="10" rx="5" fill="rgba(34,197,94,.25)"/>'; }
    else { s+='<rect x="'+x+'" y="'+(y-5)+'" width="'+(w*(thr/smax))+'" height="10" rx="5" fill="rgba(34,197,94,.25)"/>'; }
    var tx=(type==='good')?(x+w*thr):(x+w*(thr/smax));
    s+='<line x1="'+tx+'" y1="'+(y-9)+'" x2="'+tx+'" y2="'+(y+9)+'" stroke="#71717a" stroke-width="1"/>';
    if(val!==null&&val!==undefined&&!isNaN(val)){ var vf=(type==='good')?val:(val/smax); vf=Math.max(0,Math.min(1,vf)); var vx=x+w*vf; var pass=(type==='good')?(val>=thr):(val<=thr); var col=pass?'#4ade80':'#f87171'; s+='<circle cx="'+vx+'" cy="'+y+'" r="5" fill="'+col+'"/>'; s+='<text x="'+vx+'" y="'+(y-9)+'" text-anchor="middle" fill="'+col+'" font-size="10">'+f(val)+'</text>'; }
    return s;
  }
  function vizFit(d,res){
    var inner='';
    inner+=gauge(34,'CFI','good',0.95,1,d?res.cfi:null);
    inner+=gauge(74,'TLI','good',0.95,1,d?res.tli:null);
    inner+=gauge(118,'RMSEA','bad',0.06,0.15,d?res.rmsea:null);
    inner+=gauge(158,'SRMR','b