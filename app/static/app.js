console.log("app.js loaded");

document.addEventListener("input", e => {
    let input = e.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (!input.name) return;

    const target = document.querySelector(`[data-bind="${input.name}"]`);
    
    if (!target) return;

    target.textContent = input.value.trim() ? input.value : "{未入力}";
});