# Infinite Zoom (無限縮放) Demo

這是一個互動式的無限縮放 (Infinite Zoom) 網頁應用程式示範。

## ✨ 特色 (Features)

*   **無限循環縮放**：展示一系列圖片的無限縮放效果。
*   **互動式引導**：
    *   **白色虛線呼吸框**：在第一張圖片顯示引導框，提示使用者可互動區域。
    *   **自動過場**：點擊 Zoom 按鈕後，透過馬賽克 (Pixelated) 特效平滑過渡到下一張圖片。
*   **響應式與高質感介面**：使用現代化的深色主題 (Dark Mode) 與簡約設計。

## 🛠️ 技術對棧 (Tech Stack)

*   **Frontend**: React + Vite
*   **Styling**: Vanilla CSS (CSS Variables, Keyframe Animations)
*   **Effect**: Canvas / CSS Transform & Image Rendering Pixelated
*   **Debug Tool**: 內建座標輔助工具 (Debug Box)，用於開發者定義縮放區域。

## 🔧 Debug 模式 (Coordinate Helper)

為了方便定義每一張圖片的縮放區域 (`GUIDES`)，本專案內建了 Debug 模式：

1.  勾選右上角的 **"Debug Box"**。
2.  **操作介面**：
    *   畫面右上角會出現黑色半透明的 **Debug Info Panel**。
    *   **切換圖片**：使用面板上的 `< Prev` 與 `Next >` 按鈕快速切換圖片，無需重新整理。
3.  **定義縮放區域**：
    *   在畫面上拖曳滑鼠，畫出想要的縮放區域 (Selection Box)。
    *   面板會即時顯示該區域的 `x, y, w, h` 座標。
4.  **複製設定**：
    *   點擊面板上的 **"COPY CONFIG"** 按鈕。
    *   系統會複製包含「檔名」與「Step 編號」的完整設定格式 (例如 `// 1.webp (Step 0) ...`)，方便直接貼上程式碼。

## 🚀 如何執行 (How to Run)

1.  **安裝依賴** (Install Dependencies):
    ```bash
    cd frontend
    npm install
    ```

2.  **啟動開發伺服器** (Start Dev Server):
    ```bash
    npm run dev
    ```
    應用程式將會在 `http://localhost:5173` 啟動。

## 📁 專案結構

*   `frontend/`: 前端 React 應用程式原始碼。
    *   `src/App.jsx`: 主要應用程式邏輯 (縮放、切換、引導)。
    *   `src/index.css`: 全域樣式、動畫定義。
    *   `public/images/`: 用於縮放演示的圖片素材。

## 📝 備註

目前的圖片序列與座標設定位於 `frontend/src/App.jsx` 中的 `GUIDES` 常數。

---
Created by Antigravity
