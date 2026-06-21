// ============================================================
// app.js — 應用程式入口
// 負責：路由 / 導覽 / 頁面切換
// ============================================================

import {
  renderOverview, renderFear,
  renderTWMarket, renderChip, renderHeatmap, renderStockDetail
} from './pages/pages.js';

// ── 路由表（新增頁面只需在這裡加一行） ─────────────────
const ROUTES = [
  { id: 'overview',     label: '市場總覽', icon: '📊', render: renderOverview   },
  { id: 'fear',         label: '恐慌指數', icon: '🌡️', render: renderFear       },
  { id: 'tw-market',    label: '台股大盤', icon: '🇹🇼', render: renderTWMarket   },
  { id: 'tw-chip',      label: '籌碼分布', icon: '🧩', render: renderChip       },
  { id: 'heatmap',      label: '熱力圖',   icon: '🔥', render: renderHeatmap    },
  { id: 'stock-detail', label: '個股分析', icon: '🔍', render: renderStockDetail},
];

// ── 狀態 ─────────────────────────────────────────────────
let currentRoute = 'overview';

// ── 初始化 ────────────────────────────────────────────────
function init() {
  buildSidebar();
  buildBottomNav();
  navigate('overview');
}

// ── 側欄（桌面） ─────────────────────────────────────────
function buildSidebar() {
  const groups = [
    { label: '總覽',    ids: ['overview', 'fear']                    },
    { label: '台股',    ids: ['tw-market', 'tw-chip', 'heatmap']     },
    { label: '個股',    ids: ['stock-detail']                        },
  ];
  const sidebar = document.getElementById('sidebar-nav');
  groups.forEach(g => {
    const routes = ROUTES.filter(r => g.ids.includes(r.id));
    sidebar.innerHTML += `
      <div class="nav-group">
        <div class="nav-section-label">${g.label}</div>
        ${routes.map(r => `
          <div class="nav-item" id="nav-${r.id}" onclick="app.navigate('${r.id}')">
            <span class="nav-icon">${r.icon}</span> ${r.label}
          </div>`).join('')}
      </div>`;
  });
}

// ── 底部 Tab Bar（手機） ─────────────────────────────────
function buildBottomNav() {
  const tabRoutes = ['overview','fear','tw-chip','heatmap','stock-detail'];
  const tabLabels = { overview:'總覽', fear:'恐慌', 'tw-chip':'籌碼', heatmap:'熱力圖', 'stock-detail':'個股' };
  const nav = document.getElementById('bottom-nav-inner');
  tabRoutes.forEach(id => {
    const r = ROUTES.find(r => r.id === id);
    nav.innerHTML += `
      <div class="tab-item" id="tab-${id}" onclick="app.navigate('${id}')">
        <span class="tab-icon">${r.icon}</span>
        <span>${tabLabels[id] || r.label}</span>
      </div>`;
  });
}

// ── 路由切換 ─────────────────────────────────────────────
async function navigate(id) {
  if (id === currentRoute && document.getElementById('page-content').innerHTML) return;
  currentRoute = id;

  // 更新 active 狀態
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  const tabEl = document.getElementById('tab-' + id);
  if (navEl) navEl.classList.add('active'));
  if (tabEl) tabEl.classList.add('active');

  // 渲染頁面
  const container = document.getElementById('page-content');
  const route     = ROUTES.find(r => r.id === id);
  if (route) {
    container.innerHTML = ''; // 清空
    await route.render(container);
    container.scrollTop = 0;
  }
}

// ── 暴露給 HTML onclick 使用─────────────────────────────
window.app = { navigate };

// ── 啟動 ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
