// 入力/選択イベント（inputは入力中に発火、selectも一応拾える）
document.addEventListener("input", (e) => {
  // 入力/選択された要素の取得
  const el = e.target;
  if (!(el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement)) return;
  if (!el.name) return;
  serPreview(el.name,el.value)
});

// privewを反映するメソッド
function serPreview(name,value){
      // 対応するプレビュー要素を特定（data-bind="name属性"）
  const target = document.querySelector(`[data-bind="${name}"]`);
  if (!target) return;
  // 反映（空なら未入力表示）
  target.textContent = value.trim() ? value : "（未入力）";
}

function updateMultiPreview(group) {
  const block = document.querySelector(`.field-block[data-group="${group}"]`);
  const container = document.querySelector(`[data-bind-list="${group}"]`);
  if (!block || !container) return;

  const inputs = block.querySelectorAll(".multi-inputs input");
  const values = [...inputs]
    .map(i => i.value.trim())
    .filter(v => v.length > 0);

  // いったん全部消す
  container.replaceChildren();

  if (values.length === 0) {
    const ph = document.createElement("span");
    ph.className = "preview-placeholder";
    ph.textContent = "{未入力}";
    container.appendChild(ph);
    return;
  }

  for (const v of values) {
    const item = document.createElement("span");
    item.className = "preview-chip";   // 見た目用クラス
    item.textContent = v;              // ★XSS対策で textContent
    container.appendChild(item);
  }
}
