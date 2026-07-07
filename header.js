const headerHTML = `
    <div class="header">
        <div class="header-left"><a href="index.html">Homepage</a></div>
        <div class="header-right">
            <a href="portfolio.html">Portfolio</a>
            <a href="https://github.com/b00m-spark" target="_blank" rel="noopener noreferrer">Github</a>
            <a href="https://www.linkedin.com/in/esther-yao-a51736389" target="_blank" rel="noopener noreferrer">Linkedin</a>
        </div>
    </div>
`;

// Inject it into the placeholder element once the page loads
document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("global-header");
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
    }
});