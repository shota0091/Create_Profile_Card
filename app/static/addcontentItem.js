const MAX = 5;

document.addEventListener("click", (e) => {
  console.log(e.target)
  const btn = e.target.closest("button[data-action]");
  console.log(btn)
  if (!btn) return;
  console.log(btn)

  const block = btn.closest(".field-block");
  if (!block) return;
  console.log(block)

  const group = block.dataset.group;                  // hobby とか
  const box = block.querySelector(".multi-inputs");   // inputを入れる箱
  const count = box.querySelectorAll("input").length; // 現在数

  if (btn.dataset.action === "add") {
    if (count >= MAX) return;

    const next = count + 1;
    box.insertAdjacentHTML(
      "beforeend",
      `<input type="text" name="${group}${next}" id="${group}${next}" class="text-input">`
    );
  }

  if (btn.dataset.action === "remove") {
    if (count <= 1) return;
    box.lastElementChild.remove();
  }

  updateMultiPreview(group);

});

document.addEventListener("input", (e) => {
  const input = e.target;
  if (!(input instanceof HTMLInputElement)) return;

  const block = input.closest(".field-block[data-group]");
  if (!block) return;

  const group = block.dataset.group; // hobby / skill / like
  updateMultiPreview(group);
});


