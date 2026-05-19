// ── PARTICLES ──────────────────────────────────────────
(()=>{
  const c=document.getElementById('particles'),ctx=c.getContext('2d');
  const resize=()=>{c.width=innerWidth;c.height=innerHeight;};
  resize();addEventListener('resize',resize);
  const pts=Array.from({length:50},()=>({
    x:Math.random()*c.width,y:Math.random()*c.height,
    vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,
    r:Math.random()*1.5+.4,a:Math.random()*.5+.1
  }));
  const draw=()=>{
    ctx.clearRect(0,0,c.width,c.height);
    pts.forEach(p=>{
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(0,245,255,${p.a*.3})`;ctx.fill();
      p.x+=p.vx;p.y+=p.vy;
      if(p.x<0||p.x>c.width)p.vx*=-1;
      if(p.y<0||p.y>c.height)p.vy*=-1;
    });
    pts.forEach((a,i)=>pts.slice(i+1).forEach(b=>{
      const d=Math.hypot(a.x-b.x,a.y-b.y);
      if(d<100){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);
        ctx.strokeStyle=`rgba(0,245,255,${(1-d/100)*.05})`;ctx.stroke();}
    }));
    requestAnimationFrame(draw);
  };draw();
})();

// ── PRODUCT MODALS ──────────────────────────────────────
let currentModal=null;

function pmOpen(id){
  if(currentModal) pmClose();
  const overlay=document.getElementById('pm-overlay');
  const modal=document.getElementById(id);
  overlay.classList.add('open');
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  currentModal=id;
}
function pmClose(){
  if(!currentModal)return;
  document.getElementById('pm-overlay').classList.remove('open');
  document.getElementById(currentModal).classList.remove('open');
  document.body.style.overflow='';
  currentModal=null;
}
function pmThumb(thumb,mainId){
  const main=document.getElementById(mainId);
  main.src=thumb.src;
  thumb.closest('.pm-thumbs').querySelectorAll('.pm-thumb').forEach(t=>t.classList.remove('active'));
  thumb.classList.add('active');
}
document.addEventListener('keydown',e=>{if(e.key==='Escape')pmClose();});

// ── CART ────────────────────────────────────────────────
let asCartItems=[];

function asAddToCartDemo(title,price,img,btn){
  if(btn){
    const orig=btn.innerHTML;
    btn.innerHTML='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> ¡Añadido!';
    btn.style.opacity='.8';
    setTimeout(()=>{btn.innerHTML=orig;btn.style.opacity='';},2000);
  }
  const existing=asCartItems.find(i=>i.title===title);
  if(existing){existing.qty++;}
  else{asCartItems.push({title,price:parseFloat(price),qty:1,img});}
  asUpdateCartBadge();
  asRenderCart();
  asShowToast('¡'+title+' añadido!');
  asOpenCart();
}

function asUpdateCartBadge(){
  const count=asCartItems.reduce((s,i)=>s+i.qty,0);
  document.getElementById('as-cart-count').textContent=count;
}

function asRenderCart(){
  const list=document.getElementById('as-cart-items');
  const subtotal=asCartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const total=asPromoDiscount>0 ? subtotal*(1-asPromoDiscount) : subtotal;
  document.getElementById('as-cart-total').textContent='€'+total.toFixed(2);
  if(!asCartItems.length){
    list.innerHTML='<div class="as-cart-empty">Tu carrito está vacío<br><span style="font-size:2rem;opacity:.2;display:block;margin-top:.5rem">🛒</span></div>';
    return;
  }
  list.innerHTML=asCartItems.map((it,idx)=>`
    <div class="as-cart-item">
      <div class="as-cart-item-img">${it.img?`<img src="${it.img}" alt="">`:'<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#00F5FF" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>'}</div>
      <div class="as-cart-item-info">
        <div class="as-cart-item-name">${it.title}</div>
        <div class="as-cart-item-price">€${(it.price*it.qty).toFixed(2)} <span style="color:var(--text-dim);font-size:.72rem">×${it.qty}</span></div>
        <button class="as-cart-item-remove" onclick="asRemoveItem(${idx})">✕ Eliminar</button>
      </div>
    </div>`).join('');
}

function asRemoveItem(idx){
  asCartItems.splice(idx,1);
  asUpdateCartBadge();
  asRenderCart();
}

function asOpenCart(){
  asRenderCart();
  document.getElementById('as-cart-drawer').classList.add('open');
  document.getElementById('as-cart-overlay').classList.add('open');
}
function asCloseCart(){
  document.getElementById('as-cart-drawer').classList.remove('open');
  document.getElementById('as-cart-overlay').classList.remove('open');
}

// ── COUNTDOWN ───────────────────────────────────────────
(()=>{
  const target=new Date(Date.now()+2*86400000+18*3600000);
  const up=()=>{
    const diff=target-Date.now();if(diff<=0)return;
    const d=Math.floor(diff/86400000),h=Math.floor(diff%86400000/3600000),
          m=Math.floor(diff%3600000/60000),s=Math.floor(diff%60000/1000);
    document.getElementById('as-cd-d').textContent=String(d).padStart(2,'0');
    document.getElementById('as-cd-h').textContent=String(h).padStart(2,'0');
    document.getElementById('as-cd-m').textContent=String(m).padStart(2,'0');
    document.getElementById('as-cd-s').textContent=String(s).padStart(2,'0');
  };up();setInterval(up,1000);
})();

// ── TOAST ────────────────────────────────────────────────
let asToastTimer;
function asShowToast(msg){
  const t=document.getElementById('as-toast');
  document.getElementById('as-toast-msg').textContent=msg;
  t.classList.add('show');
  clearTimeout(asToastTimer);
  asToastTimer=setTimeout(()=>t.classList.remove('show'),3000);
}

// ── SEARCH ──────────────────────────────────────────────
function asToggleSearch(){
  const inp=document.getElementById('as-search');
  inp.classList.toggle('open');
  if(inp.classList.contains('open'))inp.focus();
}
function asSearch(val){
  const v=val.toLowerCase();
  document.querySelectorAll('.as-card').forEach(c=>{
    c.style.display=(!v||c.dataset.title.includes(v))?'':'none';
  });
}

// ── PAGE SWITCHING ──────────────────────────────────────
let ckFromPage = 'home';
function showPage(name){
  ['home','robots','checkout','aviso-legal','terminos','privacidad'].forEach(p=>{
    document.getElementById('page-'+p).style.display = name===p ? 'block' : 'none';
  });
  document.querySelectorAll('.as-nav-links a[data-page]').forEach(a=>{
    a.classList.toggle('nav-active', a.dataset.page===name);
  });
  window.scrollTo(0,0);
}
showPage('home');

// ── PROMO CODE ───────────────────────────────────────────
const PROMO_CODES = {
  'SYNKRO10': 0.10,
  'SYNKRO15': 0.15,
  'SYNKRO20': 0.20
};
let asPromoDiscount = 0;
let asPromoCode = '';

function asApplyPromo(){
  const input = document.getElementById('as-promo-input');
  const msg   = document.getElementById('as-promo-msg');
  const code  = input.value.trim().toUpperCase();
  if(!code){ msg.className='as-promo-msg err'; msg.textContent='Introduce un código.'; return; }
  if(PROMO_CODES[code] !== undefined){
    asPromoDiscount = PROMO_CODES[code];
    asPromoCode = code;
    msg.className='as-promo-msg ok';
    msg.textContent='✓ Código aplicado — ' + (asPromoDiscount*100) + '% de descuento';
    input.disabled = true;
    asRenderCart();
  } else {
    asPromoDiscount = 0;
    asPromoCode = '';
    msg.className='as-promo-msg err';
    msg.textContent='Código no válido.';
  }
}

// ── CHECKOUT ─────────────────────────────────────────────
function asGoCheckout(){
  if(!asCartItems.length){ asShowToast('El carrito está vacío'); return; }
  // remember which page we came from
  const home = document.getElementById('page-home');
  ckFromPage = home.style.display==='block' ? 'home' : 'robots';
  asCloseCart();
  ckRenderSummary();
  showPage('checkout');
}

function ckRenderSummary(){
  const list = document.getElementById('ck-items-list');
  const subtotal = asCartItems.reduce((s,i)=>s+i.price*i.qty,0);
  const tax = subtotal * 0.21;
  const total = subtotal + tax;

  list.innerHTML = asCartItems.map(it=>`
    <div class="ck-item">
      <div class="ck-item-img">${it.img?`<img src="${it.img}" alt="">`:'<div style="width:100%;height:100%;background:var(--bg-mid)"></div>'}</div>
      <div class="ck-item-info">
        <div class="ck-item-name">${it.title}</div>
        <div class="ck-item-qty">Cantidad: ${it.qty}</div>
      </div>
      <div class="ck-item-price">€${(it.price*it.qty).toFixed(2).replace('.',',')}</div>
    </div>`).join('');

  const fmt = n => '€'+n.toFixed(2).replace('.',',');
  document.getElementById('ck-subtotal').textContent = fmt(subtotal);
  document.getElementById('ck-tax').textContent = fmt(tax);
  document.getElementById('ck-total-final').textContent = fmt(total);
  document.getElementById('ck-btn-total').textContent = fmt(total);
}

function ckSetPm(label, type){
  document.querySelectorAll('.ck-pm-tab').forEach(t=>t.classList.remove('active'));
  label.classList.add('active');
  document.getElementById('ck-card-fields').style.display = type==='card' ? 'block' : 'none';
  document.getElementById('ck-paypal-fields').style.display = type==='paypal' ? 'block' : 'none';
  document.getElementById('ck-bizum-fields').style.display = type==='bizum' ? 'block' : 'none';
}

function ckFormatCard(input){
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
}

function ckFormatExpiry(input){
  let v = input.value.replace(/\D/g,'').substring(0,4);
  if(v.length>=3) v = v.substring(0,2)+'/'+v.substring(2);
  input.value = v;
}

function asPlaceOrder(){
  const name = document.getElementById('ck-name').value.trim();
  const email = document.getElementById('ck-email').value.trim();
  if(!name){ asShowToast('Introduce tu nombre'); document.getElementById('ck-name').focus(); return; }
  if(!email||!email.includes('@')){ asShowToast('Introduce un email válido'); document.getElementById('ck-email').focus(); return; }

  // Simulate processing
  const btn = document.querySelector('.ck-submit');
  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite"><path d="M12 2a10 10 0 000 20"/></svg> Procesando...';
  btn.style.opacity = '.7';
  btn.disabled = true;

  setTimeout(()=>{
    btn.innerHTML = '✓ Pedido confirmado';
    btn.style.opacity = '';
    const ref = 'AS-' + Math.random().toString(36).substring(2,8).toUpperCase();
    document.getElementById('ck-order-ref').textContent = '// Referencia: ' + ref;
    document.getElementById('ck-success-overlay').classList.add('show');
  }, 2000);
}

function asOrderComplete(){
  document.getElementById('ck-success-overlay').classList.remove('show');
  asCartItems = [];
  asUpdateCartBadge();
  asRenderCart();
  // Reset submit button
  const btn = document.querySelector('.ck-submit');
  if(btn){ btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg> Confirmar y pagar — <span id="ck-btn-total">€0,00</span>'; btn.disabled = false; }
  showPage('home');
  asShowToast('¡Gracias por tu pedido! 🎉');
}

// Spinner keyframe (inline)
const _ckStyle = document.createElement('style');
_ckStyle.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
document.head.appendChild(_ckStyle);

// Init cart render
asRenderCart();