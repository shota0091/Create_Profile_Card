// main.js
(() => {
  const BASE_W = 614;
  const BASE_H = 868;

  // カードサイズを画面幅に合わせて調整する関数
function fitCard() {
    const wrap = document.getElementById("cardWrap");
    const card = document.getElementById("profileCard");
    
    // 表示されていない、または要素がない場合は戻る
    if (!wrap || !card || wrap.clientWidth === 0) return;

    const currentWidth = wrap.clientWidth;
    const scale = Math.min(currentWidth / BASE_W, 1);

    card.style.transform = `scale(${scale})`;

    // 親枠の高さを計算してセット
    wrap.style.height = `${BASE_H * scale}px`;
  }

  // --- 初期化処理 ---
  function initBirthdaySelects() {
    const m = document.getElementById("birthMonth");
    const d = document.getElementById("birthDay");
    if (!m || !d) return;

    m.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
    for (let i = 1; i <= 12; i++) {
      const opt = document.createElement("option");
      opt.value = String(i);
      opt.textContent = `${i}月`;
      m.appendChild(opt);
    }

    const daysInMonth = (month) => {
      if (month === 2) return 29;
      if ([4, 6, 9, 11].includes(month)) return 30;
      return 31;
    };

    const rebuildDays = (month) => {
      d.innerHTML = `<option value="">日</option>`;
      if (!month) {
        d.disabled = true;
        d.value = "";
        return;
      }
      d.disabled = false;
      const max = daysInMonth(month);
      for (let i = 1; i <= max; i++) {
        const opt = document.createElement("option");
        opt.value = String(i);
        opt.textContent = `${i}日`;
        d.appendChild(opt);
      }
    };

    m.addEventListener("change", () => {
      const month = Number(m.value || 0);
      const prevDay = d.value;
      rebuildDays(month);
      if (prevDay && [...d.options].some(o => o.value === prevDay)) {
        d.value = prevDay;
      }
    });
    rebuildDays(0);
  }

  function initAgeSelect() {
    const ageSelect = document.getElementById("ageSelect");
    if (!ageSelect) return;
    ageSelect.querySelectorAll('option:not([value=""])').forEach(o => o.remove());
    for (let age = 20; age <= 99; age++) {
      const opt = document.createElement("option");
      opt.value = String(age);
      opt.textContent = String(age + "歳");
      ageSelect.appendChild(opt);
    }
  }

  function setupPreviewModal() {
    const modal = document.getElementById("previewModal");
    const openBtn = document.getElementById("btnToPreview");
    const closeBtn = document.getElementById("btnClosePreview");

    if (!modal || !openBtn || !closeBtn) return;

    // 開く
    openBtn.addEventListener("click", () => {
      modal.showModal();
      // 表示された直後にサイズ計算を実行
      requestAnimationFrame(() => fitCard());
    });

    // 閉じるボタン
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault(); // デフォルト動作を防ぐ
      modal.close();
    });

    // 背景クリックで閉じる
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.close();
      }
    });

    // 画面リサイズ時に再計算
    window.addEventListener("resize", () => {
      if (modal.open) fitCard();
    });
  }

  function init() {
    initBirthdaySelects();
    initAgeSelect();
    setupPreviewModal();

    // グローバル公開している別ファイルの更新関数があれば呼ぶ
    if (window.Preview) {
      if (window.Preview.updateAreaPreview) window.Preview.updateAreaPreview();
      if (window.Preview.updateBirthdayPreview) window.Preview.updateBirthdayPreview();
    }
  }

  window.addEventListener("DOMContentLoaded", init);
})();