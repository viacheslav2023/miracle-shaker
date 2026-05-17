@import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

:root {
  --black:       #080808;
  --deep:        #0d0d0d;
  --card:        #111111;
  --card2:       #141414;
  --border:      #1e1e1e;
  --border2:     #2a2a2a;
  --orange:      #ff6b1a;
  --orange-dim:  rgba(255,107,26,0.2);
  --orange-glow: rgba(255,107,26,0.08);
  --yellow:      #ffd166;
  --green:       #4ade80;
  --red:         #ef4444;
  --white:       #f0ece4;
  --grey:        #888880;
  --grey2:       #555550;
  --mono:        'Space Mono', 'Courier New', monospace;
  --display:     'Bebas Neue', Impact, sans-serif;
  --body:        'DM Sans', -apple-system, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--black);
  color: var(--white);
  font-family: var(--body);
  font-size: 16px;
  line-height: 1.6;
  overflow-x: hidden;
}

/* NOISE */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 9999;
  opacity: 0.35;
}

/* ── TICKER ── */
.ticker { background: var(--deep); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 11px 0; overflow: hidden; }
.ticker-track { display: flex; gap: 56px; animation: ticker 24s linear infinite; white-space: nowrap; }
.ticker-item { font-family: var(--mono); font-size: 10px; color: var(--grey); display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.ticker-dot { color: var(--orange); }
.up { color: var(--green); }
@keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

/* ── LAYOUT ── */
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.section { padding: 100px 0; }
.section-alt { background: var(--deep); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 100px 0; }

/* ── TYPE ── */
.label { font-family: var(--mono); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--orange); margin-bottom: 14px; display: block; }
.display-title { font-family: var(--display); font-size: clamp(48px, 6.5vw, 96px); line-height: 0.92; letter-spacing: 1px; color: var(--white); }
.display-title span { color: var(--orange); }
.body-lead { font-size: 17px; color: var(--grey); font-weight: 300; line-height: 1.75; }
.body-lead strong { color: var(--white); font-weight: 500; }

/* ── BUTTONS ── */
.btn { font-family: var(--mono); font-size: 11px; letter-spacing: 2px; text-transform: uppercase; padding: 12px 24px; text-decoration: none; display: inline-block; transition: all 0.2s; cursor: pointer; border: none; }
.btn-primary { background: var(--orange); color: var(--black); font-weight: 700; }
.btn-primary:hover { background: var(--yellow); transform: translateY(-1px); }
.btn-ghost { border: 1px solid var(--border); color: var(--grey); background: transparent; }
.btn-ghost:hover { border-color: var(--orange); color: var(--orange); }

/* ── CARDS ── */
.card-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; background: var(--border); }
.card-grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 2px; background: var(--border); }
.card-grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 2px; background: var(--border); }
.card { background: var(--card); padding: 32px; transition: background 0.2s; }
.card:hover { background: var(--card2); }
.card h3 { font-family: var(--display); font-size: 24px; letter-spacing: 1px; margin-bottom: 10px; }
.card p { font-size: 14px; color: var(--grey); font-weight: 300; line-height: 1.65; }
.card .accent { font-family: var(--mono); font-size: 20px; color: var(--orange); display: block; margin: 14px 0 4px; }
.card .accent-label { font-family: var(--mono); font-size: 10px; color: var(--grey); letter-spacing: 1px; }

/* ── FLOW ── */
.flow { display: flex; flex-direction: column; gap: 2px; background: var(--border); }
.flow-row { display: grid; grid-template-columns: 200px 1fr; gap: 2px; background: var(--border); }
.flow-label { background: var(--card); padding: 24px 20px; display: flex; flex-direction: column; justify-content: center; }
.flow-label .step-no { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; color: var(--orange); margin-bottom: 4px; }
.flow-label strong { font-family: var(--display); font-size: 24px; letter-spacing: 1px; }
.flow-content { background: var(--card); padding: 24px 28px; font-size: 14px; color: var(--grey); font-weight: 300; line-height: 1.75; display: flex; align-items: center; }
.flow-content strong { color: var(--white); font-weight: 500; }

/* ── STATS ── */
.stat-bar { display: grid; gap: 2px; background: var(--border); }
.stat-bar-4 { grid-template-columns: repeat(4,1fr); }
.stat-bar-3 { grid-template-columns: repeat(3,1fr); }
.stat-item { background: var(--card); padding: 24px 20px; text-align: center; }
.stat-value { font-family: var(--display); font-size: 36px; letter-spacing: 2px; color: var(--orange); display: block; }
.stat-label { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--grey); margin-top: 4px; display: block; }

/* ── PAGE HERO ── */
.page-hero { padding: 140px 40px 80px; position: relative; overflow: hidden; border-bottom: 1px solid var(--border); }
.page-hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 50% 60% at 80% 40%, rgba(255,107,26,0.06), transparent), radial-gradient(ellipse 30% 40% at 10% 80%, rgba(255,209,102,0.04), transparent); }
.hero-grid-bg { position: absolute; inset: 0; background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 60px 60px; opacity: 0.22; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent); }

/* ── FAQ ── */
.faq-item { border-bottom: 1px solid var(--border); }
.faq-q { width:100%; background:none; border:none; padding:20px 0; display:flex; justify-content:space-between; align-items:flex-start; cursor:pointer; text-align:left; gap:20px; }
.faq-q span { font-family:var(--mono); font-size:12px; color:var(--white); letter-spacing:0.5px; line-height:1.6; }
.faq-q .faq-icon { font-size:18px; color:var(--orange); flex-shrink:0; transition:transform 0.3s; }
.faq-item.open .faq-icon { transform:rotate(45deg); }
.faq-a { font-size:14px; color:var(--grey); font-weight:300; line-height:1.8; max-height:0; overflow:hidden; transition:max-height 0.4s ease, padding 0.3s; }
.faq-item.open .faq-a { max-height:600px; padding-bottom:20px; }
.faq-a strong { color:var(--white); font-weight:500; }
.faq-a a { color:var(--orange); text-decoration:none; }

/* ── FOOTER ── */
.site-footer { background: var(--deep); border-top: 1px solid var(--border); padding: 60px 0 36px; }
.footer-inner { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; gap: 40px; }
.footer-logo { font-family: var(--display); font-size: 30px; letter-spacing: 4px; color: var(--orange); display: block; margin-bottom: 8px; }
.footer-note { font-family: var(--mono); font-size: 10px; color: var(--grey2); letter-spacing: 1px; }
.footer-nav-col { display: flex; flex-direction: column; gap: 12px; align-items: center; }
.footer-nav-col a { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--grey); text-decoration: none; transition: color 0.2s; }
.footer-nav-col a:hover { color: var(--orange); }
.footer-socials { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; }
.footer-social-link { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--grey); text-decoration: none; border: 1px solid var(--border); padding: 7px 12px; transition: all 0.2s; }
.footer-social-link:hover { border-color: var(--orange); color: var(--orange); }
.footer-bottom { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
.footer-bottom p { font-family: var(--mono); font-size: 10px; color: var(--grey2); }

/* ── REVEAL ── */
.reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.65s ease, transform 0.65s ease; }
.reveal.visible { opacity: 1; transform: none; }

/* ── WALLET ── */
#wallet-modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.85); z-index:9000; align-items:center; justify-content:center; backdrop-filter:blur(8px); }
.wm-box { background:var(--deep); border:1px solid var(--border); padding:40px; max-width:420px; width:90%; position:relative; }
.wm-title { font-family:var(--display); font-size:30px; letter-spacing:2px; color:var(--white); margin-bottom:6px; }
.wm-sub { font-family:var(--mono); font-size:10px; color:var(--grey); letter-spacing:1px; margin-bottom:24px; }
.wm-opt { display:flex; align-items:center; gap:16px; padding:16px 18px; border:1px solid var(--border); background:var(--card); cursor:pointer; transition:all 0.2s; margin-bottom:8px; width:100%; text-align:left; }
.wm-opt:hover { border-color:var(--orange); background:var(--card2); }
.wm-opt-icon { font-size:26px; }
.wm-opt-name { font-family:var(--display); font-size:20px; letter-spacing:1px; color:var(--white); display:block; }
.wm-opt-desc { font-family:var(--mono); font-size:10px; color:var(--grey); letter-spacing:1px; display:block; margin-top:2px; }
.wm-close { position:absolute; top:14px; right:14px; background:none; border:1px solid var(--border); color:var(--grey); width:30px; height:30px; cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
.wm-close:hover { border-color:var(--orange); color:var(--orange); }

/* WALLET PROFILE PANEL */
#wallet-panel { display:none; margin-top:28px; max-width:520px; }
.wp-header { display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:var(--card); border:1px solid var(--border); border-bottom:1px solid var(--border2); }
.wp-addr { font-family:var(--mono); font-size:11px; color:var(--green); letter-spacing:1px; }
.wp-disconnect { font-family:var(--mono); font-size:9px; letter-spacing:1px; color:var(--grey); background:none; border:1px solid var(--border); padding:4px 10px; cursor:pointer; transition:all 0.2s; }
.wp-disconnect:hover { color:var(--red); border-color:var(--red); }
.wp-balances { display:grid; grid-template-columns:1fr 1fr; gap:2px; background:var(--border); }
.wp-bal { background:var(--card); padding:16px; text-align:center; }
.wp-bal label { font-family:var(--mono); font-size:9px; letter-spacing:2px; text-transform:uppercase; color:var(--grey); display:block; margin-bottom:6px; }
.wp-bal .val { font-family:var(--mono); font-size:18px; }
.wp-bal .val.sol { color:var(--green); }
.wp-bal .val.taco { color:var(--orange); }

/* ══════════════════════════════════════
   ── NAV (общий для всех страниц) ──
   ══════════════════════════════════════ */
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 500;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  background: rgba(8,8,8,0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}

/* Логотип */
nav .nav-logo {
  font-family: var(--display);
  font-size: 1.1rem;
  letter-spacing: .25em;
  color: var(--white);
  text-decoration: none;
  flex-shrink: 0;
}

/* Десктопные ссылки */
nav .nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
}
nav .nav-links a {
  font-family: var(--mono);
  font-size: .65rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--grey);
  text-decoration: none;
  transition: color .2s;
}
nav .nav-links a:hover,
nav .nav-links a.active { color: var(--white); }

/* Правая часть навбара */
nav .nav-right {
  display: flex;
  align-items: center;
  gap: .6rem;
  flex-shrink: 0;
}

/* Lang кнопки */
.lang-btn {
  background: none;
  border: none;
  font-family: var(--mono);
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--grey);
  cursor: pointer;
  padding: .25rem .4rem;
  transition: color .2s;
  position: relative;
}
.lang-btn::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 0; height: 1px;
  background: var(--orange);
  transition: width .2s;
}
.lang-btn:hover { color: var(--white); }
.lang-btn.active { color: var(--orange); }
.lang-btn.active::after { width: 100%; }

/* Wallet кнопка */
#wallet-btn {
  font-family: var(--mono);
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  padding: .4rem 1rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--grey);
  cursor: pointer;
  transition: all .2s;
  white-space: nowrap;
}
#wallet-btn:hover { border-color: var(--orange); color: var(--white); }
#wallet-btn.connected { border-color: var(--green); color: var(--green); }

/* BUY TACO кнопка */
.nav-buy-btn {
  font-family: var(--mono);
  font-size: .65rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  padding: .4rem 1rem;
  background: var(--orange);
  border: none;
  color: #000;
  cursor: pointer;
  transition: all .2s;
  text-decoration: none;
  display: inline-block;
}
.nav-buy-btn:hover { background: var(--yellow); }

/* ── BURGER (скрыт на десктопе) ── */
#nav-burger {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: none;
  border: 1px solid var(--border);
  color: var(--white);
  font-size: 1.1rem;
  cursor: pointer;
  transition: all .2s;
  flex-shrink: 0;
}
#nav-burger:hover { border-color: var(--orange); color: var(--orange); }

/* ── SLIDE MENU (боковое меню) ── */
#slide-menu {
  position: fixed;
  top: 56px; right: 0; bottom: 0;
  width: 100%;
  max-width: 360px;
  background: var(--deep);
  border-left: 1px solid var(--border);
  z-index: 490;
  transform: translateX(100%);
  transition: transform .3s cubic-bezier(.4,0,.2,1);
  display: flex;
  flex-direction: column;
  padding: 2rem;
  overflow-y: auto;
}

/* Ссылки в слайд-меню */
#slide-menu a {
  font-family: var(--mono);
  font-size: .85rem;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--grey);
  text-decoration: none;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border);
  transition: color .2s;
  display: block;
}
#slide-menu a:hover { color: var(--orange); }
#slide-menu a:last-of-type { border-bottom: none; }

/* Lang кнопки в слайд-меню */
.slide-menu-lang {
  display: flex;
  gap: .5rem;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}
.slide-menu-lang .lang-btn {
  flex: 1;
  padding: .6rem;
  border: 1px solid var(--border);
  font-size: .7rem;
  text-align: center;
}
.slide-menu-lang .lang-btn.active {
  border-color: var(--orange);
  color: var(--orange);
}

/* BUY TACO в слайд-меню */
.slide-menu-buy {
  display: block;
  width: 100%;
  margin-top: 1rem;
  padding: .9rem;
  background: var(--orange);
  color: #000;
  font-family: var(--mono);
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .15em;
  text-transform: uppercase;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: background .2s;
}
.slide-menu-buy:hover { background: var(--yellow); }

/* Кнопка закрытия меню */
#menu-close {
  position: absolute;
  top: 1rem; right: 1rem;
  background: none;
  border: 1px solid var(--border);
  color: var(--grey);
  width: 30px; height: 30px;
  cursor: pointer;
  font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  transition: all .2s;
}
#menu-close:hover { border-color: var(--orange); color: var(--orange); }

/* Оверлей */
#nav-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.6);
  z-index: 480;
  backdrop-filter: blur(4px);
}

/* ══════════════════════════════════════
   ── MOBILE ──
   ══════════════════════════════════════ */
@media (max-width: 900px) {
  .container { padding: 0 20px; }
  .section { padding: 64px 0; }
  .section-alt { padding: 64px 0; }
  .page-hero { padding: 110px 20px 60px; }
  .card-grid-2, .card-grid-3, .card-grid-4 { grid-template-columns: 1fr; }
  .flow-row { grid-template-columns: 1fr; }
  .stat-bar-4 { grid-template-columns: 1fr 1fr; }
  .stat-bar-3 { grid-template-columns: 1fr; }
  .footer-inner { grid-template-columns: 1fr; gap: 24px; }
  .footer-socials { justify-content: flex-start; }
  .footer-bottom { flex-direction: column; gap: 12px; text-align: center; }
}

@media (max-width: 768px) {
  /* Скрываем десктопные элементы навбара */
  nav .nav-links       { display: none !important; }
  nav .lang-btn        { display: none !important; }
  .nav-buy-btn         { display: none !important; }

  /* Показываем бургер */
  #nav-burger          { display: flex !important; }

  /* Wallet кнопка — компактная */
  #wallet-btn {
    font-size: .6rem !important;
    padding: .35rem .7rem !important;
    max-width: 110px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Слайд-меню на всю ширину на мобильном */
  #slide-menu {
    max-width: 100%;
    border-left: none;
    border-top: 1px solid var(--border);
  }
}

@media (min-width: 769px) {
  #slide-menu          { max-width: 360px; }
}

/* ══════════════════════════════════════
   ── NAV MOBILE FIX ──
   ══════════════════════════════════════ */

/* Бургер всегда есть — фиксируем его вид */
#nav-burger {
  background: none;
  border: 1px solid #2a2a2a;
  padding: 8px 9px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 5px;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
#nav-burger:hover { border-color: #ff6b1a; }
#nav-burger span { display: block; width: 17px; height: 1px; background: #f0ece4; transition: background 0.2s; }
#nav-burger:hover span { background: #ff6b1a; }

@media (max-width: 640px) {
  /* Скрываем lang кнопки из навбара */
  nav .lang-btn,
  nav div[style*="display:flex;gap:2px"] {
    display: none !important;
  }

  /* Скрываем BUY TACO из навбара */
  #nav-buy {
    display: none !important;
  }

  /* Wallet — компактный */
  #wallet-btn {
    font-size: 8px !important;
    padding: 6px 8px !important;
    max-width: 80px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* Nav внутренний контейнер — убираем gap */
  nav > div > div:last-child {
    gap: 6px !important;
  }
}
