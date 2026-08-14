const catTracker = document.querySelector(".cat-sprite-area");
const catFrames = document.querySelectorAll(".cat-frame");
const heroSection = document.querySelector(".space-hero");
let activeDirection = "center";

function setCatDirection(direction) {
    if (direction === activeDirection) return;
    activeDirection = direction;

    catFrames.forEach((frame) => {
        frame.classList.toggle("is-active", frame.dataset.catDirection === direction);
    });
}

function updateCatDirection(event) {
    const rect = catTracker.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = event.clientX - centerX;
    const offsetY = event.clientY - centerY;

    if (Math.abs(offsetX) > Math.abs(offsetY)) {
        setCatDirection(offsetX < 0 ? "left" : "right");
    } else {
        setCatDirection(offsetY < 0 ? "up" : "down");
    }
}

if (catTracker && heroSection) {
    heroSection.addEventListener("pointermove", updateCatDirection);
    heroSection.addEventListener("pointerleave", () => setCatDirection("center"));
}
