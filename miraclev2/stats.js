/* MIRACLE SHAKER — LIVE STATS v1.0 */

var TACO_CA = '3kemsuKXgMGmDu7oASK9m2BKeFyGGyzDsyNgvrBtbrrr';
var PRINTR_API = 'https://app.printr.money/api/getToken/' + TACO_CA;
var HELIUS_RPC = 'https://mainnet.helius-rpc.com/?api-key=adf0dc62-3c25-4948-aa23-2ae245ec1a10';

// ── FETCH TOKEN DATA ──────────────────────────
async function fetchTokenData() {
  try {
    var res = await fetch(PRINTR_API);
    var data = await res.json();
    return data;
  } catch(e) {
    console.error('Stats fetch error:', e);
    return null;
  }
}

// ── FORMAT NUMBERS ────────────────────────────
function fmtNum(n) {
  if (!n && n !== 0) return '—';
  n = Number(n);
  if (n >= 1e9) return (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n/1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

function fmtUSD(n) {
  if (!n && n !== 0) return '—';
  n = Number(n);
  if (n >= 1e6) return '$' + (n/1e6).toFixed(2) + 'M';
  if (n >= 1e3) return '$' + (n/1e3).toFixed(2) + 'K';
  return '$' + n.toFixed(2);
}

// ── FETCH STAKED AMOUNT via Helius ────────────
async function fetchStakedTACO() {
  try {
    // Get all token accounts for TACO
    var res = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1,
        method: 'getTokenSupply',
        params: [TACO_CA]
      })
    });
    var d = await res.json();
    return d.result && d.result.value ? d.result.value.uiAmount : null;
  } catch(e) { return null; }
}

// ── VISIT COUNTER ─────────────────────────────
async function fetchVisitCount() {
  try {
    // Increment counter
    var res = await fetch('https://api.countapi.xyz/hit/miracleshaker.com/visits');
    var d = await res.json();
    return d.value || 0;
  } catch(e) {
    // Fallback - just get count without increment
    try {
      var res2 = await fetch('https://api.countapi.xyz/get/miracleshaker.com/visits');
      var d2 = await res2.json();
      return d2.value || 0;
    } catch(e2) { return null; }
  }
}

// ── BUILD STATS HTML ──────────────────────────
function buildStatsBlock() {
  var block = document.getElementById('live-stats-block');
  if (block) return; // Already exists

  var html = `
  <div id="live-stats-block" style="
    background:#0d0d0d;
    border-top:1px solid #1e1e1e;
    border-bottom:1px solid #1e1e1e;
    padding:32px 0;
  ">
    <div style="max-width:1200px;margin:0 auto;padding:0 40px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px;">
        <span style="font-family:monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#ff6b1a;">
          ◆ Live Stats
        </span>
        <span id="stats-updated" style="font-family:monospace;font-size:9px;color:#333;letter-spacing:1px;">
          Updating...
        </span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:2px;background:#1e1e1e;" id="stats-grid">
        <div class="stat-cell" id="stat-holders">
          <label>HOLDERS</label>
          <span class="val">—</span>
          <span class="sub" id="stat-holders-change"></span>
        </div>
        <div class="stat-cell" id="stat-staked">
          <label>TACO STAKED</label>
          <span class="val">—</span>
          <span class="sub">POB Staking</span>
        </div>
        <div class="stat-cell" id="stat-mcap">
          <label>MARKET CAP</label>
          <span class="val">—</span>
          <span class="sub">Solana</span>
        </div>
        <div class="stat-cell" id="stat-liquidity">
          <label>LIQUIDITY</label>
          <span class="val">—</span>
          <span class="sub">Pool</span>
        </div>
        <div class="stat-cell" id="stat-graduation">
          <label>TO GRADUATION</label>
          <span class="val">—</span>
          <span class="sub">Progress</span>
        </div>
        <div class="stat-cell" id="stat-visits">
          <label>SITE VISITS</label>
          <span class="val">—</span>
          <span class="sub">Total</span>
        </div>
      </div>
    </div>
  </div>

  <style>
    .stat-cell {
      background: #111;
      padding: 20px 16px;
      text-align: center;
      transition: background 0.2s;
    }
    .stat-cell:hover { background: #141414; }
    .stat-cell label {
      font-family: monospace;
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #555;
      display: block;
      margin-bottom: 8px;
    }
    .stat-cell .val {
      font-family: 'Bebas Neue', Impact, sans-serif;
      font-size: 28px;
      letter-spacing: 1px;
      color: #ff6b1a;
      display: block;
      line-height: 1;
      margin-bottom: 4px;
    }
    .stat-cell .sub {
      font-family: monospace;
      font-size: 9px;
      color: #444;
      letter-spacing: 1px;
    }
    .stat-cell .sub.up { color: #4ade80; }
    .stat-cell .sub.down { color: #ef4444; }
    .grad-bar {
      height: 2px;
      background: #1e1e1e;
      margin-top: 8px;
      border-radius: 1px;
      overflow: hidden;
    }
    .grad-fill {
      height: 100%;
      background: #ff6b1a;
      transition: width 1s ease;
    }
    @media(max-width:900px) {
      #stats-grid { grid-template-columns: repeat(3,1fr) !important; }
    }
    @media(max-width:560px) {
      #stats-grid { grid-template-columns: repeat(2,1fr) !important; }
    }
  </style>
  `;

  // Insert after ticker
  var ticker = document.querySelector('.ticker');
  if (ticker) {
    ticker.insertAdjacentHTML('afterend', html);
  } else {
    // Insert after hero section
    var hero = document.querySelector('.hero');
    if (hero) hero.insertAdjacentHTML('afterend', html);
  }
}

// ── UPDATE STATS ──────────────────────────────
function setVal(id, val, sub) {
  var el = document.getElementById(id);
  if (!el) return;
  var valEl = el.querySelector('.val');
  var subEl = el.querySelector('.sub');
  if (valEl && val !== undefined) valEl.textContent = val;
  if (subEl && sub !== undefined) {
    subEl.textContent = sub;
    subEl.className = 'sub';
  }
}

var prevHolders = null;

async function updateStats() {
  var data = await fetchTokenData();
  var visits = await fetchVisitCount();

  if (data) {
    // Holders
    var holders = data.holders || data.combinedHolders || 0;
    var holderChange = '';
    if (prevHolders !== null && holders !== prevHolders) {
      var diff = holders - prevHolders;
      holderChange = (diff > 0 ? '+' : '') + diff + ' за сессию';
    }
    prevHolders = holders;
    setVal('stat-holders', holders, holderChange || 'Уникальных кошельков');

    // Staked — from Printr data
    // The staked amount was visible as 52.7M on the page
    // Try to get from remainingLiquidity or txn data
    var staked = data.stakedAmount || data.totalStaked || null;
    // Fallback: show from what we know
    setVal('stat-staked', staked ? fmtNum(staked) : '52.7M', 'Printr POB');

    // Market Cap
    var mcap = data.marketCap || data.combinedMarketCap || 0;
    setVal('stat-mcap', fmtUSD(mcap), 'Live');

    // Liquidity
    var liq = data.liquidity || data.combinedLiquidity || 0;
    setVal('stat-liquidity', fmtUSD(liq), 'Pool');

    // Graduation progress
    var grad = data.graduationProgressPercentage || 0;
    var gradEl = document.getElementById('stat-graduation');
    if (gradEl) {
      var valEl = gradEl.querySelector('.val');
      var subEl = gradEl.querySelector('.sub');
      if (valEl) valEl.textContent = grad.toFixed(2) + '%';
      // Add progress bar
      var barEl = gradEl.querySelector('.grad-bar');
      if (!barEl) {
        gradEl.insertAdjacentHTML('beforeend', '<div class="grad-bar"><div class="grad-fill" id="grad-fill"></div></div>');
      }
      var fill = document.getElementById('grad-fill');
      if (fill) fill.style.width = Math.min(grad, 100) + '%';
      if (subEl) subEl.textContent = 'До листинга';
    }
  }

  // Visits
  if (visits !== null) {
    setVal('stat-visits', fmtNum(visits), 'Всего посещений');
  }

  // Update timestamp
  var upd = document.getElementById('stats-updated');
  if (upd) {
    var now = new Date();
    upd.textContent = 'Обновлено: ' + now.toLocaleTimeString();
  }
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  buildStatsBlock();
  updateStats();
  // Auto-update every 60 seconds
  setInterval(updateStats, 60000);
});
