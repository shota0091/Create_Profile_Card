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
