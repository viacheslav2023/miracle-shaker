/* MIRACLE SHAKER — LIVE STATS v2.0 */

var TACO_CA = '3kemsuKXgMGmDu7oASK9m2BKeFyGGyzDsyNgvrBtbrrr';
var HELIUS = 'https://mainnet.helius-rpc.com/?api-key=adf0dc62-3c25-4948-aa23-2ae245ec1a10';
var DEXSCREENER = 'https://api.dexscreener.com/latest/dex/tokens/' + TACO_CA;

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

function setCell(id, val, sub, subClass) {
  var el = document.getElementById(id);
  if (!el) return;
  var v = el.querySelector('.sv'); if (v) v.textContent = val;
  var s = el.querySelector('.ss');
  if (s && sub !== undefined) {
    s.textContent = sub;
    s.className = 'ss' + (subClass ? ' ' + subClass : '');
  }
}

// ── DEXSCREENER ───────────────────────────────
async function fetchDex() {
  try {
    var r = await fetch(DEXSCREENER);
    var d = await r.json();
    var pairs = d.pairs || [];
    if (!pairs.length) return null;
    // Get the most liquid pair
    pairs.sort(function(a,b){ return (b.liquidity&&b.liquidity.usd||0)-(a.liquidity&&a.liquidity.usd||0); });
    return pairs[0];
  } catch(e) { return null; }
}

// ── HELIUS: HOLDERS COUNT ─────────────────────
async function fetchHolders() {
  try {
    // Use getProgramAccounts to count token holders
    var r = await fetch(HELIUS, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        jsonrpc:'2.0', id:1,
        method:'getProgramAccounts',
        params:[
          'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          {
            encoding:'jsonParsed',
            commitment:'confirmed',
            filters:[
              {dataSize:165},
              {memcmp:{offset:0, bytes:TACO_CA}}
            ]
          }
        ]
      })
    });
    var d = await r.json();
    if (!d.result) return null;
    // Count only accounts with balance > 0
    var active = d.result.filter(function(a){
      try {
        return a.account.data.parsed.info.tokenAmount.uiAmount > 0;
      } catch(e){ return false; }
    });
    return active.length;
  } catch(e) { return null; }
}

// ── VISIT COUNTER ─────────────────────────────
async function fetchVisits() {
  try {
    var r = await fetch('https://api.countapi.xyz/hit/miracleshaker.com/pageviews');
    var d = await r.json();
    return d.value || null;
  } catch(e) { return null; }
}

// ── BUILD BLOCK ───────────────────────────────
function buildBlock() {
  if (document.getElementById('live-stats-block')) return;

  var css = `
<style>
#live-stats-block { background:#0d0d0d; border-top:1px solid #1e1e1e; border-bottom:1px solid #1e1e1e; padding:28px 0; }
#live-stats-block .ls-inner { max-width:1200px; margin:0 auto; padding:0 40px; }
#live-stats-block .ls-head { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
#live-stats-block .ls-label { font-family:monospace; font-size:10px; letter-spacing:3px; text-transform:uppercase; color:#ff6b1a; }
#live-stats-block .ls-time { font-family:monospace; font-size:9px; color:#333; letter-spacing:1px; }
#live-stats-block .ls-grid { display:grid; grid-template-columns:repeat(6,1fr); gap:2px; background:#1e1e1e; }
.sc { background:#111; padding:18px 12px; text-align:center; transition:background 0.2s; }
.sc:hover { background:#141414; }
.sc .sl { font-family:monospace; font-size:9px; letter-spacing:2px; text-transform:uppercase; color:#555; display:block; margin-bottom:8px; }
.sc .sv { font-family:'Bebas Neue',Impact,sans-serif; font-size:26px; letter-spacing:1px; color:#ff6b1a; display:block; line-height:1; margin-bottom:4px; }
.sc .ss { font-family:monospace; font-size:9px; color:#444; letter-spacing:1px; display:block; }
.sc .ss.up { color:#4ade80; }
.sc .ss.dn { color:#ef4444; }
.sc .ss.nt { color:#888; }
.gb { height:2px; background:#1e1e1e; margin-top:6px; }
.gf { height:100%; background:#ff6b1a; transition:width 1s ease; width:0%; }
@media(max-width:900px){ #live-stats-block .ls-grid { grid-template-columns:repeat(3,1fr) !important; } }
@media(max-width:560px){ #live-stats-block .ls-grid { grid-template-columns:repeat(2,1fr) !important; } #live-stats-block .ls-inner { padding:0 20px; } }
</style>`;

  var html = css + `
<div id="live-stats-block">
  <div class="ls-inner">
    <div class="ls-head">
      <span class="ls-label">◆ Live Stats</span>
      <span class="ls-time" id="ls-time">Загрузка...</span>
    </div>
    <div class="ls-grid">
      <div class="sc" id="sc-holders">
        <span class="sl">HOLDERS</span>
        <span class="sv">—</span>
        <span class="ss">Уникальных кошельков</span>
      </div>
      <div class="sc" id="sc-staked">
        <span class="sl">TACO STAKED</span>
        <span class="sv">52.7M</span>
        <span class="ss nt">POB Staking</span>
      </div>
      <div class="sc" id="sc-mcap">
        <span class="sl">MARKET CAP</span>
        <span class="sv">—</span>
        <span class="ss">Live</span>
      </div>
      <div class="sc" id="sc-liq">
        <span class="sl">LIQUIDITY</span>
        <span class="sv">—</span>
        <span class="ss">Pool</span>
      </div>
      <div class="sc" id="sc-vol">
        <span class="sl">VOLUME 24H</span>
        <span class="sv">—</span>
        <span class="ss" id="sc-change">—</span>
      </div>
      <div class="sc" id="sc-visits">
        <span class="sl">SITE VISITS</span>
        <span class="sv">—</span>
        <span class="ss">Всего посещений</span>
      </div>
    </div>
  </div>
</div>`;

  var ticker = document.querySelector('.ticker');
  if (ticker) ticker.insertAdjacentHTML('afterend', html);
  else document.body.insertAdjacentHTML('afterbegin', html);
}

// ── UPDATE ────────────────────────────────────
var prevHolders = null;

async function updateStats() {
  // DexScreener
  var pair = await fetchDex();
  if (pair) {
    var mcap = pair.fdv || pair.marketCap || 0;
    var liq = (pair.liquidity && pair.liquidity.usd) || 0;
    var vol = (pair.volume && pair.volume.h24) || 0;
    var chg = (pair.priceChange && pair.priceChange.h24) || 0;

    setCell('sc-mcap', fmtUSD(mcap), 'FDV Live');
    setCell('sc-liq', fmtUSD(liq), 'Pool');
    setCell('sc-vol', fmtUSD(vol),
      (chg >= 0 ? '+' : '') + chg.toFixed(2) + '% 24h',
      chg >= 0 ? 'up' : 'dn'
    );
  }

  // Holders via Helius
  var holders = await fetchHolders();
  if (holders !== null) {
    var holderSub = 'Уникальных кошельков';
    if (prevHolders !== null && holders !== prevHolders) {
      var diff = holders - prevHolders;
      holderSub = (diff > 0 ? '+' : '') + diff + ' за сессию';
    }
    prevHolders = holders;
    setCell('sc-holders', String(holders), holderSub, holders > 0 ? 'nt' : '');
  }

  // Visits
  var visits = await fetchVisits();
  if (visits !== null) setCell('sc-visits', fmtNum(visits), 'Всего посещений');

  // Timestamp
  var t = document.getElementById('ls-time');
  if (t) t.textContent = 'Обновлено: ' + new Date().toLocaleTimeString();
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  buildBlock();
  updateStats();
  setInterval(updateStats, 60000);
});
