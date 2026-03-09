---
description: 自動端到端比對與對齊工作流 (Auto E2E Alignment Loop)
---

# E2E Alignment Loop (自動端到端比對與對齊工作流)

此工作流用於自動化執行與目標網站的真實業務流程對比，並自我修正程式碼直到功能完全對齊。您可以在開發任何新功能模組後執行此工作流。

// turbo-all
1. **運行 (Run)**
   啟動本地的前端與後端服務 (Next.js & Go)，確保測試環境可訪問 (例如 `http://localhost:3000`)。

2. **比對驗證 (Compare & Verify)**
   透過 `browser_subagent` 進行雙邊測試：
   - 訪問目標網站 (如 `https://recur.tw/` 或對應平台)。
   - 實際點擊並走通真實的業務流程。
   - 接著訪問本地同等頁面 (`http://localhost:3000`)。
   - 觀察並記錄兩者在元素、點擊反饋、狀態跳轉上的具體差異。

3. **代碼更新 (Code Update)**
   Agent 根據上一步的比對結果，對本地代碼 (Frontend / Backend) 進行修正，確保樣式邏輯與目標網站拉齊。

4. **測試 (Test)**
   確保修改後的代碼無編譯錯誤。

5. **運行 (Run & Iterate)**
   重複運行 `browser_subagent` 對本地修改後的頁面進行重新驗證。如果仍有差異，返回第 3 步再次更新代碼，直到完全對齊為止。
