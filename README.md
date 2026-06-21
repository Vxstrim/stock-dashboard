# MarketCore 股市數據中心

台股 & 美股即時數據儀表板，支援桌面與手機。

---

## 📁 專案結構

```
stock-dashboard/
├── index.html
├── manifest.json
├── vercel.json
├── style/
│   ├── tokens.css
│   └── layout.css
└── src/
    ├── app.js
    ├── data/mockData.js
    ├── api/api.js
    ├── components/components.js
    └── pages/pages.js
```

---

## 🚀 部署到 Vercel（零成本，5 分鐘完成）

前往 https://vercel.com → Sign up with GitHub → Add New Project → 選 stock-dashboard → Deploy

---

## 🔌 未來串接 API 建議

| 資料類型 | 推薦 API | 費用 |
|---------|---------|------|
| 台股行情 | 台灣證交所 Open API | 免費 |
| 美股指數 | Yahoo Finance | 免費 |
| VIX | CBOE / Alpha Vantage | 免費額度 |
| 即時報價 | Polygon.io | 有免費方案 |
