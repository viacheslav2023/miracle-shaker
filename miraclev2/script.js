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

var langs = ['en','ru','ua'];
var lang = 'en';
try { lang = localStorage.getItem('ms_lang') || 'en'; } catch(e){}
if (!T[lang]) lang = 'en';

function applyLang(l) {
  if (!T[l]) return;
  lang = l;
  try { localStorage.setItem('ms_lang', l); } catch(e){}

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(function(b) {
    b.classList.toggle('active', b.dataset.lang === l);
  });

  var d = T[l];

  // Nav ids
  [['nav-home',d.nav_home],['nav-shaker',d.nav_shaker],
   ['nav-nft',d.nav_nft],['nav-game',d.nav_game],
   ['nav-faq',d.nav_faq],['nav-buy',d.nav_buy]
  ].forEach(function(pair){
    var el = document.getElementById(pair[0]);
    if (el) el.textContent = pair[1];
  });

  // Wallet button
  var wb = document.getElementById('wallet-btn');
  if (wb && !wb.classList.contains('connected')) {
    wb.textContent = d.wallet_btn;
  }

  // All data-translated elements
  document.querySelectorAll('[data-'+l+']').forEach(function(el){
    var text = el.getAttribute('data-'+l);
    if (text) el.innerHTML = text;
  });
  // Fallback for missing translations — use English
  if (l !== 'en') {
    document.querySelectorAll('[data-en]').forEach(function(el){
      if (!el.getAttribute('data-'+l) && el.getAttribute('data-en')) {
        el.innerHTML = el.getAttribute('data-en');
      }
    });
  }

  // Footer
  var fc = document.getElementById('footer-copy');
  var fr = document.getElementById('footer-rights');
  if (fc) fc.textContent = d.footer_copy;
  if (fr) fr.textContent = d.footer_rights;
}

// ── MENU ─────────────────────────────────────
function openMenu() {
  document.getElementById('slide-menu').style.transform = 'translateX(0)';
  document.getElementById('nav-overlay').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  document.getElementById('slide-menu').style.transform = 'translateX(100%)';
  document.getElementById('nav-overlay').style.display = 'none';
  document.body.style.overflow = '';
}

// ── WALLET ───────────────────────────────────
var walletPubkey = null;
var walletProvider = null;
var TACO_MINT = '3kemsuKXgMGmDu7oASK9m2BKeFyGGyzDsyNgvrBtbrrr';
var RPC = 'https://mainnet.helius-rpc.com/?api-key=adf0dc62-3c25-4948-aa23-2ae245ec1a10';

function showWalletModal() {
  if (walletPubkey) { disconnectWallet(); return; }
  document.getElementById('wallet-modal').style.display = 'flex';
}

function closeWalletModal() {
  document.getElementById('wallet-modal').style.display = 'none';
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

  // fetch balances
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

// ── INIT ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', function(){
  // Nav burger
  var burger = document.getElementById('nav-burger');
  if (burger) burger.addEventListener('click', openMenu);
  var mclose = document.getElementById('menu-close');
  if (mclose) mclose.addEventListener('click', closeMenu);
  var overlay = document.getElementById('nav-overlay');
  if (overlay) overlay.addEventListener('click', closeMenu);
  document.querySelectorAll('#slide-menu a').forEach(function(a){
    a.addEventListener('click', closeMenu);
  });

  // Lang buttons
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.addEventListener('click', function(){ applyLang(b.dataset.lang); });
  });

  // Wallet
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

  // Scroll nav border
  var nav = document.querySelector('nav');
  window.addEventListener('scroll', function(){
    if (nav) nav.style.borderBottomColor = window.scrollY > 40 ? '#1e1e1e' : 'transparent';
  });

  // Active link
  var path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#slide-menu a[id]').forEach(function(a){
    var href = (a.getAttribute('href')||'').split('/').pop();
    if (href === path) a.style.color = '#ff6b1a';
  });

  applyLang(lang);
  initReveal();
  initFAQ();
  initMaze();
  setTimeout(autoReconnect, 600);
});
