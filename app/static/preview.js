// preview.js
(() => {
  const PLACEHOLDER = "未入力";
  const LIST_FIELDS = new Set(["hobby", "skill", "like"]);
  const MAX_TAGS = 5;

  function setPreviewText(key, value) {
    const target = document.querySelector(`[data-bind="${key}"]`);
    if (!target) return;

    const v = (value ?? "").toString().trim();
    target.textContent = v ? v : PLACEHOLDER;
  }

  function renderPreviewList(key, items) {
    const container = document.querySelector(`[data-bind-list="${key}"]`);
    if (!container) return;

    container.replaceChildren();

    if (!items || items.length === 0) {
      const ph = document.createElement("span");
      ph.className = "preview-placeholder";
      ph.textContent = PLACEHOLDER;
      container.appendChild(ph);
      return;
    }

    for (const t of items) {
      const el = document.createElement("span");
      el.className = "preview-chip";
      el.textContent = t;
      container.appendChild(el);
    }
  }

  function splitBySpaces(text) {
    return (text ?? "")
      .toString()
      .trim()
      .split(/[\s　]+/) // 半角/全角スペース、改行など
      .filter(Boolean)
      .slice(0, MAX_TAGS);
  }

  function updateAreaPreview() {
    const areaSelect = document.getElementById("areaSelect");
    const prefSelect = document.getElementById("prefSelect");
    if (!areaSelect || !prefSelect) return;

    const areaLabel = areaSelect.value
      ? (areaSelect.selectedOptions?.[0]?.textContent ?? "")
      : "";

    const prefLabel = prefSelect.value ? prefSelect.value : "";
    setPreviewText("area", prefLabel || areaLabel);
  }

  function updateBirthdayPreview() {
    const m = document.getElementById("birthMonth");
    const d = document.getElementById("birthDay");
    if (!m || !d) return;

    const month = m.value;
    const day = d.value;

    const text = (month && day) ? `${month}月${day}日`
              : (month) ? `${month}月`
              : "";

    setPreviewText("birthday", text);
  }

  function handleUpdate(el) {
    if (!el?.name) return;

    // 地域（地方＋都道府県）
    if (el.name === "areaKey" || el.name === "prefecture") {
      updateAreaPreview();
      return;
    }

    // 誕生日（月＋日）
    if (el.name === "birthMonth" || el.name === "birthDay") {
      updateBirthdayPreview();
      return;
    }

    // 趣味/スキル/好きなタイプ：スペース分割
    if (LIST_FIELDS.has(el.name)) {
      renderPreviewList(el.name, splitBySpaces(el.value));
      return;
    }

    // selectは label を出す（valueじゃなく表示文字が欲しいことが多い）
    if (el instanceof HTMLSelectElement) {
      const label = el.value ? (el.selectedOptions?.[0]?.textContent ?? el.value) : "";
      setPreviewText(el.name, label);
      return;
    }

    // input/textarea
    setPreviewText(el.name, el.value);
  }

  document.addEventListener("input", (e) => {
    const el = e.target;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement)) return;
    handleUpdate(el);
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return;
    handleUpdate(el);
  });

  // 外部から呼びたい場合用（必要最低限）
  window.Preview = { setPreviewText, renderPreviewList, updateAreaPreview, updateBirthdayPreview };

  // 互換用：旧名serPreviewを残す（他ファイルが参照しても壊れない）
  window.serPreview = setPreviewText;
})();
