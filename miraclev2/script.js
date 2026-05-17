/* MIRACLE SHAKER v2 — MAIN SCRIPT */

// ── TRANSLATIONS ─────────────────────────────
var T = {
  en: {
    nav_home:'HOME', nav_shaker:'SHAKER', nav_nft:'NFT TALES',
    nav_game:'GAME', nav_faq:'FAQ', nav_buy:'BUY TACO',
    wallet_btn:'WALLET', wallet_connected:'CONNECTED',
    disconnect:'DISCONNECT',
    footer_copy:'© 2026 Miracle Shaker · Poland, Gdańsk',
    footer_rights:'All rights reserved.'
  },
  ru: {
    nav_home:'ГЛАВНАЯ', nav_shaker:'ШЕЙКЕР', nav_nft:'NFT ИСТОРИИ',
    nav_game:'ИГРА', nav_faq:'ЧаВо', nav_buy:'КУПИТЬ TACO',
    wallet_btn:'КОШЕЛЁК', wallet_connected:'ПОДКЛЮЧЁН',
    disconnect:'ОТКЛЮЧИТЬ',
    footer_copy:'© 2026 Miracle Shaker · Польша, Гданьск',
    footer_rights:'Все права защищены.'
  },
  ua: {
    nav_home:'ГОЛОВНА', nav_shaker:'ШЕЙКЕР', nav_nft:'NFT ОПОВІДІ',
    nav_game:'ГРА', nav_faq:'FAQ', nav_buy:'КУПИТИ TACO',
    wallet_btn:'ГАМАНЕЦЬ', wallet_connected:"ПІД'ЄДНАНО",
    disconnect:'ВІДКЛЮЧИТИ',
    footer_copy:'© 2026 Miracle Shaker · Польща, Гданськ',
    footer_rights:'Всі права захищені.'
  }
};

var lang = 'en';
try { lang = localStorage.getItem('ms_lang') || 'en'; } catch(e){}
if (!T[lang]) lang = 'en';

function applyLang(l) {
  if (!T[l]) return;
  lang = l;
  try { localStorage.setItem('ms_lang', l); } catch(e){}
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === l);
  });
  var d = T[l];
  [['nav-home',d.nav_home],['nav-shaker',d.nav_shaker],
   ['nav-nft',d.nav_nft],['nav-game',d.nav_game],
   ['nav-faq',d.nav_faq],['nav-buy',d.nav_buy]
  ].forEach(function(pair){
    var el = document.getElementById(pair[0]);
    if (el) el.textContent = pair[1];
  });
  var wb = document.getElementById('wallet-btn');
  if (wb && !wb.classList.contains('connected')) wb.textContent = d.wallet_btn;
  document.querySelectorAll('[data-'+l+']').forEach(function(el){
    var text = el.getAttribute('data-'+l);
    if (text) el.innerHTML = text;
  });
  if (l !== 'en') {
    document.querySelectorAll('[data-en]').forEach(function(el){
      if (!el.getAttribute('data-'+l) && el.getAttribute('data-en'))
        el.innerHTML = el.getAttribute('data-en');
    });
  }
  var fc = document.getElementById('footer-copy');
  var fr = document.getElementById('footer-rights');
  if (fc) fc.textContent = d.footer_copy;
  if (fr) fr.textContent = d.footer_rights;
}

// ── MENU ─────────────────────────────────────
function openMenu() {
  var m = document.getElementById('slide-menu');
  var o = document.getElementById('nav-overlay');
  if (m) m.style.transform = 'translateX(0)';
  if (o) o.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  var m = document.getElementById('slide-menu');
  var o = document.getElementById('nav-overlay');
  if (m) m.style.transform = 'translateX(100%)';
  if (o) o.style.display = 'none';
  document.body.style.overflow = '';
}

function toggleMenu() {
  var m = document.getElementById('slide-menu');
  if (!m) return;
  var open = m.style.transform === 'translateX(0px)' || m.style.transform === 'translateX(0)';
  if (open) closeMenu(); else openMenu();
}

// ── WALLET ───────────────────────────────────
var walletPubkey = null;
var walletProvider = null;
var TACO_MINT = '3kemsuKXgMGmDu7oASK9m2BKeFyGGyzDsyNgvrBtbrrr';
var RPC = 'https://mainnet.helius-rpc.com/?api-key=adf0dc62-3c25-4948-aa23-2ae245ec1a10';

function showWalletModal() {
  if (walletPubkey) { disconnectWallet(); return; }
  var m = document.getElementById('wallet-modal');
  if (m) m.style.display = 'flex';
}

function closeWalletModal() {
  var m = document.getElementById('wallet-modal');
  if (m) m.style.display = 'none';
}

async function rpc(method, params) {
  var res = await fetch(RPC, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({jsonrpc:'2.0',id:1,method:method,params:params})
  });
  var d = await res.json();
  return d.result;
}

async function getSolBalance(pk) {
  try {
    var r = await rpc('getBalance', [pk, {commitment:'confirmed'}]);
    return ((r && r.value) || 0) / 1e9;
  } catch(e) { return 0; }
}

async function getTacoBalance(pk) {
  try {
    var r = await rpc('getTokenAccountsByOwner', [pk, {mint:TACO_MINT}, {encoding:'jsonParsed',commitment:'confirmed'}]);
    var accs = (r && r.value) || [];
    if (!accs.length) return 0;
    return accs[0].account.data.parsed.info.tokenAmount.uiAmount || 0;
  } catch(e) { return 0; }
}

function fmt(n, d) {
  if (!n) return '0';
  d = d || 4;
  if (n >= 1e6) return (n/1e6).toFixed(2)+'M';
  if (n >= 1e3) return (n/1e3).toFixed(2)+'K';
  return Number(n).toFixed(d);
}

function shortAddr(a) { return a.slice(0,4)+'...'+a.slice(-4); }

async function updateWalletUI(pubkey) {
  walletPubkey = pubkey;
  var addr = pubkey.toString ? pubkey.toString() : String(pubkey);
  var wb = document.getElementById('wallet-btn');
  if (wb) { wb.textContent = shortAddr(addr); wb.classList.add('connected'); }
  var panel = document.getElementById('wallet-panel');
  if (panel) panel.style.display = 'block';
  var addrEl = document.getElementById('wp-addr');
  if (addrEl) addrEl.textContent = shortAddr(addr);
  var sol = await getSolBalance(addr);
  var taco = await getTacoBalance(addr);
  var solEl = document.getElementById('wp-sol');
  var tacoEl = document.getElementById('wp-taco');
  if (solEl) solEl.textContent = fmt(sol,4) + ' SOL';
  if (tacoEl) tacoEl.textContent = fmt(taco,2) + ' TACO';
}

async function connectWallet(name) {
  closeWalletModal();
  try {
    var provider;
    if (name === 'phantom') {
      provider = window.phantom && window.phantom.solana ? window.phantom.solana : (window.solana && window.solana.isPhantom ? window.solana : null);
      if (!provider) { window.open('https://phantom.app/','_blank'); return; }
    } else {
      provider = window.solflare && window.solflare.isSolflare ? window.solflare : null;
      if (!provider) { window.open('https://solflare.com/','_blank'); return; }
    }
    var resp = await provider.connect();
    walletProvider = provider;
    var pk = resp.publicKey || provider.publicKey;
    provider.on('disconnect', disconnectWallet);
    await updateWalletUI(pk);
    try { localStorage.setItem('ms_wallet', name); } catch(e){}
  } catch(e) { console.error('Wallet error:', e); }
}

async function disconnectWallet() {
  if (walletProvider) { try { await walletProvider.disconnect(); } catch(e){} }
  walletPubkey = null; walletProvider = null;
  var wb = document.getElementById('wallet-btn');
  if (wb) { wb.textContent = T[lang].wallet_btn; wb.classList.remove('connected'); }
  var panel = document.getElementById('wallet-panel');
  if (panel) panel.style.display = 'none';
  try { localStorage.removeItem('ms_wallet'); } catch(e){}
}

async function autoReconnect() {
  try {
    var saved = localStorage.getItem('ms_wallet');
    if (!saved) return;
    var p = saved === 'phantom'
      ? (window.phantom && window.phantom.solana ? window.phantom.solana : window.solana)
      : (window.solflare && window.solflare.isSolflare ? window.solflare : null);
    if (p && p.isConnected && p.publicKey) {
      walletProvider = p;
      p.on('disconnect', disconnectWallet);
      await updateWalletUI(p.publicKey);
    }
  } catch(e){}
}

// ── REVEAL ───────────────────────────────────
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visible'); });
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry, i){
      if (entry.isIntersecting) {
        setTimeout(function(){ entry.target.classList.add('visible'); }, i*80);
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.07});
  document.querySelectorAll('.reveal').forEach(function(el){ obs.observe(el); });
}

// ── FAQ ──────────────────────────────────────
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(function(item){
    var btn = item.querySelector('.faq-q');
    if (!btn) return;
    btn.addEventListener('click', function(){
      var open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if (!open) item.classList.add('open');
    });
  });
}

// ── MAZE PULSE ───────────────────────────────
function initMaze() {
  var cells = document.querySelectorAll('.mc-path');
  if (!cells.length) return;
  setInterval(function(){
    cells.forEach(function(c){ c.classList.remove('mc-glow'); });
    var r = cells[Math.floor(Math.random()*cells.length)];
    if (r) r.classList.add('mc-glow');
  }, 1100);
}

// ── MOBILE NAV ───────────────────────────────
function initMobileNav() {
  var isMobile = window.innerWidth <= 640;
  var langGroup = document.querySelector('nav div[style*="gap:2px"]');
  var navBuy = document.getElementById('nav-buy');

  if (langGroup) langGroup.style.display = isMobile ? 'none' : '';
  if (navBuy) navBuy.style.display = isMobile ? 'none' : '';

  var slideMenu = document.getElementById('slide-menu');
  var slideLang = document.getElementById('slide-lang-group');

  if (isMobile && slideMenu && !slideLang) {
    var langDiv = document.createElement('div');
    langDiv.id = 'slide-lang-group';
    langDiv.style.cssText = 'display:flex;gap:6px;padding:16px 0;border-top:1px solid #1e1e1e;margin-top:8px;';
    ['en','ru','ua'].forEach(function(l) {
      var btn = document.createElement('button');
      btn.className = 'lang-btn';
      btn.dataset.lang = l;
      btn.textContent = l.toUpperCase();
      btn.style.cssText = 'flex:1;font-family:monospace;font-size:9px;letter-spacing:1px;background:none;border:1px solid #2a2a2a;color:#555;padding:8px;cursor:pointer;';
      if (l === lang) { btn.style.color = '#ff6b1a'; btn.style.borderColor = '#ff6b1a'; }
      btn.addEventListener('click', function() { applyLang(l); closeMenu(); });
      langDiv.appendChild(btn);
    });
    var menuBottom = slideMenu.querySelector('div[style*="margin-top:auto"]');
    if (menuBottom) slideMenu.insertBefore(langDiv, menuBottom);
    else slideMenu.appendChild(langDiv);
  }

  if (!isMobile && slideLang) {
    slideLang.parentNode.removeChild(slideLang);
  }
}

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function(){
  var burger = document.getElementById('nav-burger');
  if (burger) burger.addEventListener('click', toggleMenu);

  var mclose = document.getElementById('menu-close');
  if (mclose) mclose.addEventListener('click', closeMenu);

  var overlay = document.getElementById('nav-overlay');
  if (overlay) overlay.addEventListener('click', closeMenu);

  document.querySelectorAll('#slide-menu a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') { closeMenu(); closeWalletModal(); }
  });

  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.addEventListener('click', function(){ applyLang(b.dataset.lang); });
  });

  var wb = document.getElementById('wallet-btn');
  if (wb) wb.addEventListener('click', showWalletModal);
  var wmc = document.getElementById('wm-close');
  if (wmc) wmc.addEventListener('click', closeWalletModal);
  var wmodal = document.getElementById('wallet-modal');
  if (wmodal) wmodal.addEventListener('click', function(e){ if(e.target===wmodal) closeWalletModal(); });
  var phantom = document.getElementById('connect-phantom');
  if (phantom) phantom.addEventListener('click', function(){ connectWallet('phantom'); });
  var solflare = document.getElementById('connect-solflare');
  if (solflare) solflare.addEventListener('click', function(){ connectWallet('solflare'); });
  var discon = document.getElementById('wp-disconnect');
  if (discon) discon.addEventListener('click', disconnectWallet);

  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function(){
    if (nav) nav.style.borderBottomColor = window.scrollY > 40 ? '#1e1e1e' : 'transparent';
  });

  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#slide-menu a[id]').forEach(function(a){
    var href = (a.getAttribute('href')||'').split('/').pop();
    if (href === path) a.style.color = '#ff6b1a';
  });

  applyLang(lang);
  initReveal();
  initFAQ();
  initMaze();
  initMobileNav();
  setTimeout(autoReconnect, 600);
});

window.addEventListener('resize', initMobileNav);

// ── ANIMATIONS ────────────────────────────────
// ── CANVAS PARTICLES на hero ──────────────────
function initParticles() {
  var hero = document.querySelector('.hero');
  if (!hero) return;

  // Создаём canvas
  var canvas = document.createElement('canvas');
  canvas.id = 'hero-particles';
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  hero.insertBefore(canvas, hero.firstChild);

  var ctx = canvas.getContext('2d');
  var W, H, particles = [];

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, {passive:true});

  // Создаём частицы
  var COUNT = window.innerWidth < 768 ? 25 : 55;
  for (var i = 0; i < COUNT; i++) {
    particles.push({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + 0.4,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.5 + 0.2),
      alpha:  Math.random() * 0.6 + 0.2,
      pulse:  Math.random() * Math.PI * 2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var t = Date.now() / 1000;

    particles.forEach(function(p) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.02;

      // Wrap around
      if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
      if (p.x < -5) p.x = W + 5;
      if (p.x > W + 5) p.x = -5;

      var alpha = p.alpha * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,107,26,' + alpha + ')';
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}


// Счётчик цифр — накручивается от 0 до значения
function animateCounter(el, target, duration, prefix, suffix) {
  if (!el) return;
  var start = 0;
  var startTime = null;
  var isFloat = String(target).includes('.');
  var decimals = isFloat ? String(target).split('.')[1].length : 0;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    var current = start + (target - start) * ease;
    el.textContent = (prefix||'') + (isFloat ? current.toFixed(decimals) : Math.floor(current)) + (suffix||'');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = (prefix||'') + target + (suffix||'');
  }
  requestAnimationFrame(step);
}

// Запускаем счётчики когда live-stats появляется
function initCounters() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);

      // Находим все .sv элементы
      var cells = [
        { id: 'sc-holders',  target: 4,      prefix: '',   suffix: '',   dur: 1200 },
        { id: 'sc-staked',   target: 52.7,   prefix: '',   suffix: 'M',  dur: 1800 },
        { id: 'sc-mcap',     target: 4.45,   prefix: '$',  suffix: 'K',  dur: 1500 },
        { id: 'sc-liq',      target: 250,    prefix: '$',  suffix: '',   dur: 1000 },
        { id: 'sc-grad',     target: 1.59,   prefix: '',   suffix: '%',  dur: 1200 },
      ];

      cells.forEach(function(c) {
        var el = document.getElementById(c.id);
        if (el) {
          var sv = el.querySelector('.sv');
          if (sv) animateCounter(sv, c.target, c.dur, c.prefix, c.suffix);
        }
      });
    });
  }, { threshold: 0.3 });

  var statsBlock = document.getElementById('live-stats-block');
  if (statsBlock) obs.observe(statsBlock);
}

// Roadmap reveal с slide-in
function initRoadmapReveal() {
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.roadmap-item').forEach(function(el) {
    obs.observe(el);
  });
}

// Parallax для Donald Cluck при скролле
function initParallax() {
  var chicken = document.querySelector('.hero-chicken');
  if (!chicken) return;
  window.addEventListener('scroll', function() {
    var scrollY = window.scrollY;
    chicken.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
  }, { passive: true });
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initCounters, 1000);
  initRoadmapReveal();
  initParallax();
  initParticles();
});
