/* MIRACLE SHAKER — LIVE STATS v3.0 */

var TACO_CA = '3kemsuKXgMGmDu7oASK9m2BKeFyGGyzDsyNgvrBtbrrr';
var HELIUS = 'https://mainnet.helius-rpc.com/?api-key=adf0dc62-3c25-4948-aa23-2ae245ec1a10';
var HELIUS_API = 'https://api.helius.xyz/v0/token-metadata?api-key=adf0dc62-3c25-4948-aa23-2ae245ec1a10';

function fmtNum(n) {
  if (!n && n !== 0) return '—';
  n = Number(n);
  if (n >= 1e9) return (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(1) + 'K';
  return String(Math.round(n));
}

function fmtUSD(n) {
  if (!n && n !== 0) return '—';
  n = Number(n);
  if (n >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n/1e3).toFixed(1) + 'K';
  return '$' + n.toFixed(2);
}

function setVal(id, val, sub, subCls) {
  var el = document.getElementById(id);
  if (!el) return;
  var v = el.querySelector('.sv'); if (v && val !== undefined) v.textContent = val;
  var s = el.querySelector('.ss');
  if (s && sub !== undefined) {
    s.textContent = sub;
    s.className = 'ss' + (subCls ? ' ' + subCls : '');
  }
}

// ── HOLDERS via Helius getTokenAccounts ────────
async function fetchHolders() {
  try {
    var page = 1;
    var total = 0;
    while (true) {
      var r = await fetch(HELIUS, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jsonrpc: '2.0', id: 'holders-' + page,
          method: 'getTokenAccounts',
          params: {
            mint: TACO_CA,
            page: page,
            limit: 1000,
            options: { showZeroBalance: false }
          }
        })
      });
      var d = await r.json();
      if (!d.result || !d.result.token_accounts || d.result.token_accounts.length === 0) break;
      total += d.result.token_accounts.length;
      if (d.result.token_accounts.length < 1000) break;
      page++;
    }
    return total;
  } catch(e) {
    console.error('Holders error:', e);
    return null;
  }
}

// ── MARKET DATA via DexScreener ────────────────
async function fetchDex() {
  try {
    // Use no-cors proxy workaround via allorigins
    var url = 'https://api.dexscreener.com/latest/dex/tokens/' + TACO_CA;
    var r = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent(url));
    var wrapper = await r.json();
    var data = JSON.parse(wrapper.contents);
    var pairs = data.pairs || [];
    if (!pairs.length) return null;
    pairs.sort(function(a,b){
      return ((b.liquidity&&b.liquidity.usd)||0) - ((a.liquidity&&a.liquidity.usd)||0);
    });
    return pairs[0];
  } catch(e) {
    // Try direct as fallback
    try {
      var r2 = await fetch('https://api.dexscreener.com/latest/dex/tokens/' + TACO_CA);
      var d2 = await r2.json();
      var pairs2 = d2.pairs || [];
      if (!pairs2.length) return null;
      pairs2.sort(function(a,b){
        return ((b.liquidity&&b.liquidity.usd)||0) - ((a.liquidity&&a.liquidity.usd)||0);
      });
      return pairs2[0];
    } catch(e2) {
      console.error('DexScreener error:', e2);
      return null;
    }
  }
}

// ── VISIT COUNTER ──────────────────────────────
async function fetchVisits() {
  try {
    var r = await fetch('https://api.countapi.xyz/hit/miracleshaker.com/visits2026');
    var d = await r.json();
    return d.value || null;
  } catch(e) { return null; }
}

// ── BUILD BLOCK ────────────────────────────────
function buildBlock() {
  if (document.getElementById('live-stats-block')) return;

  var html = `
<style>
#live-stats-block{background:#0d0d0d;border-top:1px solid #1e1e1e;border-bottom:1px solid #1e1e1e;padding:28px 0;}
.ls-inner{max-width:1200px;margin:0 auto;padding:0 40px;}
.ls-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;}
.ls-lbl{font-family:monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#ff6b1a;}
.ls-time{font-family:monospace;font-size:9px;color:#333;letter-spacing:1px;}
.ls-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:2px;background:#1e1e1e;}
.sc{background:#111;padding:18px 12px;text-align:center;transition:background .2s;}
.sc:hover{background:#141414;}
.sc .sl{font-family:monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#555;display:block;margin-bottom:8px;}
.sc .sv{font-family:'Bebas Neue',Impact,sans-serif;font-size:26px;letter-spacing:1px;color:#ff6b1a;display:block;line-height:1;margin-bottom:4px;}
.sc .ss{font-family:monospace;font-size:9px;color:#444;letter-spacing:1px;display:block;}
.sc .ss.up{color:#4ade80;}
.sc .ss.dn{color:#ef4444;}
.sc .ss.nt{color:#666;}
@media(max-width:900px){.ls-grid{grid-template-columns:repeat(3,1fr)!important;}}
@media(max-width:560px){.ls-grid{grid-template-columns:repeat(2,1fr)!important;}.ls-inner{padding:0 20px;}}
</style>
<div id="live-stats-block">
  <div class="ls-inner">
    <div class="ls-head">
      <span class="ls-lbl">◆ Live Stats</span>
      <span class="ls-time" id="ls-time">Загрузка...</span>
    </div>
    <div class="ls-grid">
      <div class="sc" id="sc-holders">
        <span class="sl">HOLDERS</span>
        <span class="sv">—</span>
        <span class="ss nt">Кошельков</span>
      </div>
      <div class="sc" id="sc-staked">
        <span class="sl">TACO STAKED</span>
        <span class="sv">52.7M</span>
        <span class="ss nt">POB Staking</span>
      </div>
      <div class="sc" id="sc-mcap">
        <span class="sl">MARKET CAP</span>
        <span class="sv">—</span>
        <span class="ss nt">Live</span>
      </div>
      <div class="sc" id="sc-liq">
        <span class="sl">LIQUIDITY</span>
        <span class="sv">—</span>
        <span class="ss nt">Pool</span>
      </div>
      <div class="sc" id="sc-vol">
        <span class="sl">VOLUME 24H</span>
        <span class="sv">—</span>
        <span class="ss nt">—</span>
      </div>
      <div class="sc" id="sc-visits">
        <span class="sl">SITE VISITS</span>
        <span class="sv">—</span>
        <span class="ss nt">Посещений</span>
      </div>
    </div>
  </div>
</div>`;

  var ticker = document.querySelector('.ticker');
  if (ticker) ticker.insertAdjacentHTML('afterend', html);
  else document.body.insertAdjacentHTML('afterbegin', html);
}

// ── UPDATE ─────────────────────────────────────
var prevHolders = null;

async function updateStats() {
  // Run all in parallel
  var results = await Promise.allSettled([
    fetchHolders(),
    fetchDex(),
    fetchVisits()
  ]);

  var holders = results[0].status === 'fulfilled' ? results[0].value : null;
  var pair    = results[1].status === 'fulfilled' ? results[1].value : null;
  var visits  = results[2].status === 'fulfilled' ? results[2].value : null;

  // Holders
  if (holders !== null) {
    var sub = 'Кошельков';
    if (prevHolders !== null && holders !== prevHolders) {
      var diff = holders - prevHolders;
      sub = (diff > 0 ? '+' : '') + diff + ' за сессию';
    }
    prevHolders = holders;
    setVal('sc-holders', String(holders), sub, 'nt');
  }

  // DexScreener
  if (pair) {
    var mcap = pair.fdv || pair.marketCap || 0;
    var liq  = (pair.liquidity && pair.liquidity.usd) || 0;
    var vol  = (pair.volume && pair.volume.h24) || 0;
    var chg  = (pair.priceChange && pair.priceChange.h24) || 0;

    setVal('sc-mcap', fmtUSD(mcap), 'FDV Live', 'nt');
    setVal('sc-liq',  fmtUSD(liq),  'Pool', 'nt');
    setVal('sc-vol',  fmtUSD(vol),
      (chg >= 0 ? '+' : '') + Number(chg).toFixed(2) + '% 24h',
      chg >= 0 ? 'up' : 'dn'
    );
  }

  // Visits
  if (visits !== null) setVal('sc-visits', fmtNum(visits), 'Посещений', 'nt');

  // Time
  var t = document.getElementById('ls-time');
  if (t) t.textContent = 'Обновлено: ' + new Date().toLocaleTimeString();
}

// ── INIT ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  buildBlock();
  setTimeout(updateStats, 500);
  setInterval(updateStats, 60000);
});
