const candleButtons = document.querySelectorAll(".candle-button");

candleButtons.forEach((button) => {
    const candleImage = button.querySelector("img");
    let isLit = false;
    let flickerTimer = null;
    let showSecondFlame = true;

    const setCandleImage = (src) => {
        candleImage.src = src;
    };

    const snuffCandle = () => {
        isLit = false;
        button.classList.remove("is-lit");
        button.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-label", button.dataset.unlitLabel);
        window.clearInterval(flickerTimer);
        flickerTimer = null;
        showSecondFlame = true;
        setCandleImage("images/candle-unlit.png");
    };

    const lightCandle = () => {
        isLit = true;
        button.classList.add("is-lit");
        button.setAttribute("aria-pressed", "true");
        button.setAttribute("aria-label", button.dataset.litLabel);
        showSecondFlame = true;
        setCandleImage("images/candle-lit-2.png");

        flickerTimer = window.setInterval(() => {
            showSecondFlame = !showSecondFlame;
            setCandleImage(showSecondFlame ? "images/candle-lit-2.png" : "images/candle-lit-1.png");
        }, 500);
    };

    button.dataset.unlitLabel = button.getAttribute("aria-label");
    button.dataset.litLabel = button.getAttribute("aria-label").replace("Light", "Snuff");
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("click", () => {
        if (isLit) {
            snuffCandle();
            return;
        }

        lightCandle();
    });
});
