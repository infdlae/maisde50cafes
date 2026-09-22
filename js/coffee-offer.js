/* Offer dialog: once per session, accessible, no interruption after checkout intent. */
(() => {
  const dialog=document.getElementById('coffeeOfferDialog'), overlay=document.getElementById('coffeeOfferOverlay'),close=document.getElementById('coffeeOfferClose');
  if(!dialog||!overlay||!close)return;
  const KEY='coffee-offer-seen-v1';let previous=null,opened=false;
  const seen=()=>{try{return sessionStorage.getItem(KEY)==='1';}catch{return opened;}};
  const mark=()=>{opened=true;try{sessionStorage.setItem(KEY,'1');}catch{}};
  function dismiss(){dialog.hidden=true;overlay.hidden=true;document.body.classList.remove('coffee-offer-open');if(previous?.isConnected)previous.focus({preventScroll:true});}
  function show(){if(seen()||document.hidden||document.querySelector('.menu-drawer.open'))return;mark();previous=document.activeElement;dialog.hidden=false;overlay.hidden=false;document.body.classList.add('coffee-offer-open');close.focus({preventScroll:true});}
  const timer=setTimeout(show,3000);
  close.addEventListener('click',dismiss);overlay.addEventListener('click',dismiss);
  dialog.addEventListener('click',event=>{if(event.target.closest('.checkout-link')){clearTimeout(timer);dismiss();}});
  document.addEventListener('click',event=>{if(event.target.closest('.checkout-link')){clearTimeout(timer);mark();}});
  document.addEventListener('keydown',event=>{
    if(dialog.hidden)return;
    if(event.key==='Escape'){event.preventDefault();dismiss();return;}
    if(event.key==='Tab'){const els=[...dialog.querySelectorAll('a[href],button:not([disabled])')].filter(el=>!el.hidden);const first=els[0],last=els[els.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}
  });
})();
