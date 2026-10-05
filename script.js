(()=>{
const $=(s,c=document)=>[...c.querySelectorAll(s)],R=document.documentElement,RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
// split-line reveals + generic reveals
const io=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$('[data-s],.rv,.ph,.ln,.stat,.mem').forEach(x=>io.observe(x));
// nav active
const links=$('nav a'),so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(l=>l.classList.toggle('on',l.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50%'});
$('section[id]').forEach(s=>so.observe(s));
// counters
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,n=+el.dataset.n,x=el.dataset.x||'',g=el.dataset.g!=='0',t0=performance.now();
const f=t=>{const p=Math.min((t-t0)/1800,1),v=Math.round(n*(1-Math.pow(1-p,4)));el.textContent=(g?v.toLocaleString():v)+(p<1?'':x);p<1&&requestAnimationFrame(f)};requestAnimationFrame(f);co.unobserve(el)}),{threshold:.6});
$('[data-n]').forEach(x=>co.observe(x));
// scroll: progress, parallax, pinned horizontal projects
const bar=$('#bar')[0],tr=$('#track')[0],pb=$('#pb')[0],pin=$('#projects')[0],par=$('[data-par]'),hb=$('.hero .bgimg')[0];
const imgs=$('.ph>img');let tick=false;
function sc(){tick=false;const y=scrollY,h=R.scrollHeight-innerHeight;bar.style.transform=`scaleX(${y/h})`;
 const r=pin.getBoundingClientRect(),p=Math.min(Math.max(-r.top/(pin.offsetHeight-innerHeight),0),1);
 tr.style.transform=`translateX(${-p*Math.max(tr.scrollWidth-innerWidth+24,0)}px)`;pb.style.transform=`scaleX(${p})`;
 if(!RM){par.forEach(el=>{const b=el.getBoundingClientRect();el.style.translate=`0 ${(b.top-innerHeight/2)*-.06}px`});
 imgs.forEach(i=>{const b=i.parentNode.getBoundingClientRect();if(b.bottom>0&&b.top<innerHeight)i.style.translate=`0 ${(b.top+b.height/2-innerHeight/2)*-.07}px`});if(hb&&y<innerHeight*1.3)hb.style.translate=`0 ${y*.2}px`}}
addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(sc)}},{passive:true});sc();
if(!RM){let last=scrollY,v=0;(function loop(){const d=scrollY-last;last=scrollY;v+=(Math.max(-14,Math.min(14,d))-v)*.12;R.style.setProperty('--v',(v*.22).toFixed(2));requestAnimationFrame(loop)})()}
// pointer: card tilt, magnetic buttons
$('[data-t]').forEach(c=>{c.addEventListener('pointermove',e=>{const b=c.getBoundingClientRect(),x=(e.clientX-b.left)/b.width,y=(e.clientY-b.top)/b.height;c.style.setProperty('--x',x*100+'%');c.style.setProperty('--y',y*100+'%');if(!RM)c.style.transform=`perspective(700px) rotateY(${(x-.5)*10}deg) rotateX(${(.5-y)*10}deg)`});c.addEventListener('pointerleave',()=>c.style.transform='')});
$('[data-m]').forEach(b=>{b.addEventListener('pointermove',e=>{const r=b.getBoundingClientRect();b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.2}px,${(e.clientY-r.top-r.height/2)*.3}px)`});b.addEventListener('pointerleave',()=>b.style.transform='')});
// photo zoom follows the cursor
$('.ph').forEach(p=>{
  p.addEventListener('pointermove',e=>{
    const b=p.getBoundingClientRect();
    p.style.setProperty('--zx',((e.clientX-b.left)/b.width*100).toFixed(1)+'%');
    p.style.setProperty('--zy',((e.clientY-b.top)/b.height*100).toFixed(1)+'%');
  });
  p.addEventListener('pointerleave',()=>{p.style.removeProperty('--zx');p.style.removeProperty('--zy')});
});
// hero spotlight follows cursor
const hero=$('.hero')[0];hero.addEventListener('pointermove',e=>{const b=hero.getBoundingClientRect();hero.style.setProperty('--mx',(e.clientX-b.left)+'px');hero.style.setProperty('--my',(e.clientY-b.top)+'px')});
// lightbox
const lb=$('#lb')[0],big=$('.big',lb)[0];
$('#mas .ph').forEach(p=>p.addEventListener('click',()=>{big.style.setProperty('--g',p.style.getPropertyValue('--g'));big.dataset.c=p.dataset.c;big.innerHTML=p.innerHTML;const bi=big.querySelector('img');if(bi)bi.style.translate='0 0';lb.showModal()}));
lb.addEventListener('click',e=>{if(e.target!==big)lb.close()});
// theme
$('#th')[0].addEventListener('click',()=>{const d=R.dataset.theme?R.dataset.theme==='dark':!matchMedia('(prefers-color-scheme:light)').matches;R.dataset.theme=d?'light':'dark'});
// form
$('#form')[0].addEventListener('submit',async e=>{e.preventDefault();const f=e.target,s=$('#st')[0];s.textContent='Sending…';try{const r=await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(new FormData(f)).toString()});if(!r.ok)throw 0;s.textContent="Thank you — we'll be in touch soon.";f.reset()}catch(_){s.textContent='Something went wrong. Please email us instead.'}});
})();/* NPAS network background: silver lines on dark theme, maroon lines on light theme.
   - A fixed page-wide canvas follows the theme.
   - Any element with data-net (not the hero) gets its own always-dark silver version. */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SILVER = { l: '196,198,208', p: '214,70,98' };   // lines, pulses (dark surfaces)
  var MAROON = { l: '122,16,35', p: '90,92,104' };     // light theme
  function isDark() {
    var d = document.documentElement.dataset.theme;
    return d ? d === 'dark' : !matchMedia('(prefers-color-scheme: light)').matches;
  }
  var nets = [], last = 0;

  function Net(host) {
    var fixed = !host, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
    var W, H, dpr, nodes = [], tris = [], pulses = [], mouse = { x: -9999, y: -9999 }, vis = true;
    cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:' + (fixed ? 'fixed;z-index:0' : 'absolute') + ';inset:0;width:100%;height:100%;pointer-events:none';
    if (fixed) document.body.prepend(cv);
    else {
      var ref = host.querySelectorAll('.bgimg,.leak,.iris,.orb'); // sit above backgrounds, below content
      if (ref.length) ref[ref.length - 1].after(cv); else host.prepend(cv);
    }

    function init() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.clientWidth; H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(fixed ? 90 : 120, Math.max(24, W * H / (fixed ? 16000 : 13000))));
      nodes = []; tris = []; pulses = [];
      for (var i = 0; i < n; i++) {
        var z = Math.random();
        nodes.push({ x: Math.random() * W, y: Math.random() * H, z: z,
          vx: (Math.random() - .5) * (.15 + z * .45), vy: (Math.random() - .5) * (.15 + z * .45),
          r: 1 + z * 1.8, ring: Math.random() < .15 });
      }
      for (var j = 0; j < 5; j++) tris.push({ x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
        s: 22 + Math.random() * 34, a: Math.random() * 6.28, va: (Math.random() - .5) * .003 });
    }

    this.draw = function (dt) {
      if (!vis) return;
      var pal = (!fixed || isDark()) ? SILVER : MAROON, c = pal.l, pc = pal.p, link = 150;
      var k = (fixed && !isDark()) ? .9 : 1;
      ctx.clearRect(0, 0, W, H);

      tris.forEach(function (s) {
        if (!reduce) { s.x += s.vx * dt; s.y += s.vy * dt; s.a += s.va * dt; }
        if (s.x < -80) s.x = W + 80; if (s.x > W + 80) s.x = -80;
        if (s.y < -80) s.y = H + 80; if (s.y > H + 80) s.y = -80;
        ctx.beginPath();
        for (var q = 0; q < 3; q++) { var an = s.a + q * 2.094; ctx.lineTo(s.x + Math.cos(an) * s.s, s.y + Math.sin(an) * s.s); }
        ctx.closePath(); ctx.strokeStyle = 'rgba(' + c + ',' + (.14 * k) + ')'; ctx.lineWidth = 1; ctx.stroke();
      });

      nodes.forEach(function (p) {
        if (!reduce) {
          var dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
          if (d < 150 && d > 0) { var f = (1 - d / 150) * .08 * dt; p.vx += dx / d * f; p.vy += dy / d * f; }
          var drag = Math.pow(.992, dt); p.vx *= drag; p.vy *= drag;
          var sp = Math.hypot(p.vx, p.vy), mx = .25 + p.z * .6;
          if (sp > mx) { p.vx *= mx / sp; p.vy *= mx / sp; }
          p.x += p.vx * dt; p.y += p.vy * dt;
        }
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      });

      var pairs = [];
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            var al = (.32 * (1 - d / link)) * (.4 + .6 * Math.min(a.z, b.z + .3)) * k;
            ctx.strokeStyle = 'rgba(' + c + ',' + al.toFixed(3) + ')'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (d < link * .8) pairs.push([a, b]);
          }
        }
        var m = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (m < 190) {
          ctx.strokeStyle = 'rgba(' + c + ',' + (.5 * (1 - m / 190) * k).toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }

      if (!reduce && pairs.length && pulses.length < 10 && Math.random() < .05)
        pulses.push({ p: pairs[(Math.random() * pairs.length) | 0], t: 0 });
      pulses = pulses.filter(function (u) {
        u.t += .018 * dt; if (u.t >= 1) return false;
        var x = u.p[0].x + (u.p[1].x - u.p[0].x) * u.t, y = u.p[0].y + (u.p[1].y - u.p[0].y) * u.t;
        ctx.beginPath(); ctx.arc(x, y, 2.4, 0, 6.283);
        ctx.fillStyle = 'rgba(' + pc + ',' + (.9 * Math.sin(u.t * 3.14)).toFixed(3) + ')'; ctx.fill();
        return true;
      });

      nodes.forEach(function (p) {
        ctx.beginPath();
        if (p.ring) { ctx.arc(p.x, p.y, p.r + 3, 0, 6.283); ctx.strokeStyle = 'rgba(' + c + ',' + ((.25 + p.z * .3) * k) + ')'; ctx.stroke(); }
        else { ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fillStyle = 'rgba(' + c + ',' + ((.3 + p.z * .35) * k) + ')'; ctx.fill(); }
      });
    };

    addEventListener('pointermove', function (e) {
      var r = fixed ? { left: 0, top: 0 } : host.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse.x = mouse.y = -9999; });
    if (!fixed) new IntersectionObserver(function (es) { vis = es[0].isIntersecting; }).observe(host);
    new ResizeObserver(init).observe(fixed ? document.documentElement : host);
    init();
  }

  function loop(now) {
    requestAnimationFrame(loop);
    if (document.hidden) { last = now; return; }
    var dt = Math.min(2, (now - last) / 16.7 || 1); last = now;
    nets.forEach(function (n) { n.draw(dt); });
  }

  nets.push(new Net(null));
  document.querySelectorAll('[data-net]:not(.hero)').forEach(function (h) {
    if (getComputedStyle(h).position === 'static') h.style.position = 'relative';
    nets.push(new Net(h));
  });
  requestAnimationFrame(loop);
})();