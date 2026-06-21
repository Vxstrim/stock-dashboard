// ============================================================
// components.js — 可重複使用的 UI 元件（純函式，回傳 HTML 字串）
// 每個函式負責一個小元件，在各 page 中引用
// ============================================================

// ── 工具函式 ────────────────────────────────────────────

/** 判斷漲跌 class */
export function dirClass(val) {
  if (val > 0) return 'up';
  if (val < 0) return 'down';
  return 'muted';
}

/** 漲跌符號 */
export function dirSign(val) {
  return val > 0 ? '▲' : val < 0 ? '▼' : '—';
}

/** 數字格式化（千分位） */
export function fmt(n, decimals = 2) {
  if (n === undefined || n === null) return '—';
  return Number(n).toLocaleString('zh-TW', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** 漲跌幅字串 */
export function pctStr(pct) {
  const sign = pct >= 0 ? '+' : '';
  return `${sign}${pct.toFixed(2)}%`;
}

/** 漲跌 tag HTML */
export function pctTag(pct) {
  const cls = pct > 0 ? 'tag-up' : pct < 0 ? 'tag-down' : '';
  return `<span class="tag ${cls}">${pctStr(pct)}</span>`;
}

// ── 迷你 sparkline 柱狀圖 ───────────────────────────────
export function miniBarChart(values) {
  const max = Math.max(...values.map(Math.abs));
  const bars = values.map(v => {
    const h = Math.round((Math.abs(v) / max) * 32) + 3;
    const color = v >= 0 ? 'var(--up)' : 'var(--down)';
    return `<div class="mini-bar" style="height:${h}px;background:${color}"></div>`;
  }).join('');
  return `<div class="mini-bars">${bars}</div>`;
}

// ── 進度條 ───────────────────────────────────────────────
export function progressBar(pct, color = 'var(--info)') {
  return `
    <div class="progress-wrap">
      <div class="progress-fill" style="width:${Math.min(pct,100)}%;background:${color}"></div>
    </div>`;
}

// ── 恐慌儀表盤（SVG gauge） ─────────────────────────────
export function fearGauge(value, max = 50) {
  // value → 旋轉角度：0 = 最左(−135°)，max = 最右(+135°)
  const pct    = Math.min(value / max, 1);
  const angle  = -135 + pct * 270;  // 旋轉角（度）
  const arcLen = 220;
  const offset = arcLen * (1 - pct);

  let label, color;
  if (value < 15)      { label = '極度貪婪'; color = 'var(--up)';   }
  else if (value < 25) { label = '中性';     color = 'var(--warn)'; }
  else if (value < 35) { label = '恐慌';     color = '#FF7A3D';     }
  else                 { label = '極度恐慌'; color = 'var(--down)'; }

  return { label, color, offset, angle };
}

// ── EPS 橫條圖 ───────────────────────────────────────────
export function epsChart(epsData) {
  const max = Math.max(...epsData.map(d => d.v));
  return epsData.map(d => `
    <div class="eps-row">
      <span class="eps-q">${d.q}</span>
      <div class="eps-track">
        <div class="eps-fill" style="width:${(d.v/max*100).toFixed(1)}%;background:${d.est ? 'rgba(59,130,246,0.45)' : 'var(--up)'}">
          <span class="eps-val" style="color:${d.est ? '#93C5FD' : 'var(--up)'}">${d.v}</span>
        </div>
      </div>
    </div>
  `).join('');
}

// ── 月營收折線圖（SVG） ─────────────────────────────────
export function revenueChart(data) {
  const w = 720, h = 80;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 10) - 5;
    return `${x},${y}`;
  }).join(' ');
  const lastX = w, lastY = h - ((data[data.length-1] - min) / range) * (h - 10) - 5;
  const area  = `0,${h} ${pts} ${w},${h}`;

  return `
    <svg viewBox="0 0 ${w} ${h}" style="width:100%;height:80px;overflow:visible">
      <defs>
        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon points="${area}" fill="url(#revGrad)"/>
      <polyline points="${pts}" fill="none" stroke="var(--info)" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="${lastX}" cy="${lastY}" r="4" fill="var(--info)"/>
    </svg>`;
}

// ── 籌碼柱狀圖（外資買賣超） ─────────────────────────────
export function chipHistoryChart(history) {
  return history.map(d => `
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px">
      <span style="font-size:10px;color:var(--text-dim);width:36px;flex-shrink:0">${d.date}</span>
      <div style="flex:1;position:relative;height:18px;background:rgba(255,255,255,0.04);border-radius:3px;overflow:hidden">
        <div style="position:absolute;top:0;${d.val>0?'left:50%':'right:50%'};
          width:${Math.abs(d.val)/1.6}%;height:100%;
          background:${d.val>0?'var(--up)':'var(--down)'};border-radius:3px"></div>
      </div>
      <span class="mono" style="font-size:11px;${d.val>0?'color:var(--up)':'color:var(--down)'};width:44px;text-align:right">
        ${d.val>0?'+':''}${d.val}億
      </span>
    </div>
  `).join('');
}

// ── 熱力圖格子 ───────────────────────────────────────────
export function heatmapColor(pct) {
  if (pct >  3)  return '#006B42';
  if (pct >  1.5) return '#00A86B';
  if (pct >  0)  return '#4EDE9C';
  if (pct === 0) return 'rgba(255,255,255,0.08)';
  if (pct > -1.5) return '#FF9878';
  if (pct > -3)  return '#FF6B5B';
  return '#CC1F2E';
}

// ── 法說會事件卡 ────────────────────────────────────────
export function eventCard(ev) {
  const typeLabel = { past: '最近一次', upcoming: '即將舉行', dividend: '股利' };
  const typeTag   = { past: 'tag-info', upcoming: 'tag-warn', dividend: 'tag-up' };
  return `
    <div class="event-card ${ev.type}" style="margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <div>
          <div class="event-title">${ev.title}</div>
          <div class="event-date">${ev.date}</div>
        </div>
        <span class="tag ${typeTag[ev.type]}" style="flex-shrink:0">${typeLabel[ev.type]}</span>
      </div>
      <div class="event-summary">${ev.summary}</div>
    </div>`;
}
