// ============================================================
// api.js — 資料存取層
// 目前回傳假資料；未來換成真實 API 只需修改這個檔案
// ============================================================

import {
  MARKET_INDICES, MARKET_BREADTH, FEAR_INDEX,
  SECTORS, CHIP_DATA, HEATMAP_STOCKS, STOCKS
} from '../data/mockData.js';

// 模擬網路延遲，讓 loading 狀態可以被測試
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ── 市場總覽 ──────────────────────────────────────────────
export async function fetchMarketIndices() {
  await delay();
  return MARKET_INDICES;
  // 未來換成真實 API 範例：
  // const res = await fetch('https://api.example.com/indices');
  // return res.json();
}

export async function fetchMarketBreadth() {
  await delay();
  return MARKET_BREADTH;
}

// ── 恐慌指數 ──────────────────────────────────────────────
export async function fetchFearIndex() {
  await delay();
  return FEAR_INDEX;
}

// ── 台股大盤 ──────────────────────────────────────────────
export async function fetchSectors() {
  await delay();
  return SECTORS;
}

// ── 籌碼分布 ──────────────────────────────────────────────
export async function fetchChipData() {
  await delay();
  return CHIP_DATA;
}

// ── 熱力圖 ────────────────────────────────────────────────
export async function fetchHeatmapStocks() {
  await delay();
  return HEATMAP_STOCKS;
}

// ── 個股分析 ──────────────────────────────────────────────
export async function fetchStock(code) {
  await delay(500);
  const stock = STOCKS[code];
  if (!stock) throw new Error(`找不到股票代號 ${code}`);
  return stock;
}

export async function searchStocks(query) {
  await delay(200);
  return Object.values(STOCKS).filter(s =>
    s.code.includes(query) || s.name.includes(query)
  );
}
