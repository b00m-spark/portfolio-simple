const spacePage = document.querySelector(".home-space");

function updateSpaceDrift(event) {
    if (!spacePage) return;

    const xRatio = event.clientX / window.innerWidth - 0.5;
    const yRatio = event.clientY / window.innerHeight - 0.5;

    spacePage.style.setProperty("--sky-drift-x", `${xRatio * -32}px`);
    spacePage.style.setProperty("--sky-drift-y", `${yRatio * -24}px`);
}

function resetSpaceDrift() {
    if (!spacePage) return;

    spacePage.style.setProperty("--sky-drift-x", "0px");
    spacePage.style.setProperty("--sky-drift-y", "0px");
}

if (spacePage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", updateSpaceDrift);
    window.addEventListener("pointerleave", resetSpaceDrift);
}
