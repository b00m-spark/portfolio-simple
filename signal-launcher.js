const signalButton = document.querySelector(".signal-launcher");
const catStage = document.querySelector(".astronaut-cat-stage");

function launchRocketSignal() {
    if (!signalButton || !catStage) return;

    const buttonRect = signalButton.getBoundingClientRect();
    const catRect = catStage.getBoundingClientRect();
    const originX = buttonRect.left + buttonRect.width / 2;
    const originY = buttonRect.top + buttonRect.height / 2;
    const endX = catRect.left + catRect.width / 2 - originX;
    const endY = catRect.top + catRect.height * 0.42 - originY;
    const arcLift = Math.min(180, Math.max(90, Math.abs(endX) * 0.24));
    const midX = endX * 0.46;
    const midY = endY * 0.46 - arcLift;
    const angle = Math.atan2(endY, endX) * (180 / Math.PI) + 90;
    const rocket = document.createElement("img");

    rocket.className = "signal-rocket";
    rocket.src = "images/rocket.png";
    rocket.alt = "";
    rocket.setAttribute("aria-hidden", "true");
    rocket.style.setProperty("--signal-x", `${originX}px`);
    rocket.style.setProperty("--signal-y", `${originY}px`);
    rocket.style.setProperty("--signal-mid-x", `${midX}px`);
    rocket.style.setProperty("--signal-mid-y", `${midY}px`);
    rocket.style.setProperty("--signal-angle", `${angle}deg`);

    document.body.appendChild(rocket);
    rocket.addEventListener("animationend", () => rocket.remove(), { once: true });
}

if (signalButton) {
    signalButton.addEventListener("click", launchRocketSignal);
}
