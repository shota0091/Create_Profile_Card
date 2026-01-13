// select-region.js
(() => {
  const PREF_BY_AREA = {
    hokkaido_tohoku: ["北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島"],
    kanto: ["茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川"],
    hokuriku: ["富山", "石川", "福井"],
    chubu: ["山梨", "長野", "岐阜", "静岡", "愛知"],
    kinki: ["三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山"],
    chugoku: ["鳥取", "島根", "岡山", "広島", "山口"],
    shikoku: ["徳島", "香川", "愛媛", "高知"],
    kyushu_okinawa: ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"],
  };

  function resetPrefSelect(prefSelect, message) {
    prefSelect.disabled = true;
    prefSelect.innerHTML = `<option value="">${message}</option>`;
    prefSelect.value = "";
  }

  function initRegionSelect() {
    const areaSelect = document.getElementById("areaSelect");
    const prefSelect = document.getElementById("prefSelect");
    if (!areaSelect || !prefSelect) return;

    resetPrefSelect(prefSelect, "地方を選択してください");

    areaSelect.addEventListener("change", () => {
      const area = areaSelect.value;

      if (!area) {
        resetPrefSelect(prefSelect, "地方を選択してください");
        return; // changeはこのままdocumentに伝播→preview.jsが更新
      }

      const prefs = PREF_BY_AREA[area] ?? [];
      prefSelect.disabled = false;
      prefSelect.innerHTML = `<option value="">未選択（地方名を表示）</option>`;

      for (const p of prefs) {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        prefSelect.appendChild(opt);
      }

      prefSelect.value = ""; // 都道府県はリセット（area changeの伝播でプレビュー更新される）
    });
  }

  initRegionSelect();
})();
