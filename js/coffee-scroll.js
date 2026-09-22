/* Scroll hero: progressive WebP sequence, graceful fallback if assets are not yet uploaded. */
(() => {
  const title=document.querySelector('#topo h1');
  const hero=document.querySelector('#topo');
  if(!title||!hero)return;
  const TOTAL=240, ROOT='assets/scroll-frames/', cache=new Map(), pending=new Set();
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData;
  const canvas=document.createElement('canvas');canvas.className='coffee-scroll-canvas';canvas.setAttribute('aria-hidden','true');
  const ctx=canvas.getContext('2d',{alpha:true});let target=0,last=-1,raf=0,failed=false,active=false;
  if(!ctx||reduced)return;
  title.append(canvas);
  function measure(){const r=title.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(r.width*d);canvas.height=Math.round(r.height*d);canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';}
  function load(n){if(n<0||n>=TOTAL||cache.has(n)||pending.has(n)||failed)return;pending.add(n);const im=new Image();im.onload=()=>{pending.delete(n);cache.set(n,im);if(cache.size>26){for(const k of cache.keys()){if(Math.abs(k-target)>10){cache.delete(k);if(cache.size<=26)break;}}}draw();};im.onerror=()=>{pending.delete(n);if(n===0)failed=true;};im.src=ROOT+'frame_'+String(n).padStart(3,'0')+'.webp';}
  function draw(){raf=0;if(!active||failed)return;const im=cache.get(target);if(!im){load(target);return;}if(last===target)return;last=target;ctx.clearRect(0,0,canvas.width,canvas.height);const scale=Math.min(canvas.width/im.width,canvas.height/im.height);const w=im.width*scale,h=im.height*scale;ctx.drawImage(im,(canvas.width-w)/2,(canvas.height-h)/2,w,h);}
  function update(){if(!active||failed)return;const r=hero.getBoundingClientRect();const distance=Math.max(240,Math.min(650,innerHeight*.7));const progress=Math.max(0,Math.min(1,-r.top/distance));target=Math.round(progress*(TOTAL-1));title.style.setProperty('--coffee-progress',progress.toFixed(3));for(let i=-2;i<=2;i++)load(target+i);if(!raf)raf=requestAnimationFrame(draw);}
  const observer=new IntersectionObserver(entries=>{active=entries[0].isIntersecting;if(active){measure();load(0);update();}},{rootMargin:'160px'});observer.observe(hero);
  addEventListener('scroll',update,{passive:true});addEventListener('resize',()=>{measure();last=-1;update();},{passive:true});document.addEventListener('visibilitychange',update);
  measure();
})();
