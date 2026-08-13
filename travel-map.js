const visitedCountries = [
    { name: "China", mapNames: ["China"], note: "Stub travel note for China. Replace this with a favorite memory later." },
    { name: "Georgia", mapNames: ["Georgia"], note: "Stub travel note for Georgia. Add a city, meal, or moment here." },
    { name: "Australia", mapNames: ["Australia"], note: "Stub travel note for Australia. Add a favorite landscape or story here." },
    { name: "United States", mapNames: ["United States of America"], note: "Stub travel note for the United States. Add a campus, road trip, or city memory here." },
    { name: "Mexico", mapNames: ["Mexico"], note: "Stub travel note for Mexico. Add a favorite place or food memory here." },
    { name: "Chile", mapNames: ["Chile"], note: "Stub travel note for Chile. Add a favorite view or adventure here." },
    { name: "United Kingdom", mapNames: ["United Kingdom"], note: "Stub travel note for the UK. Add a city or tiny rainy-day memory here." },
    { name: "France", mapNames: ["France"], note: "Stub travel note for France. Add a museum, meal, or walk here." },
    { name: "Italy", mapNames: ["Italy"], note: "Stub travel note for Italy. Add a favorite city, pasta, or piazza here." },
    { name: "Spain", mapNames: ["Spain"], note: "Stub travel note for Spain. Add a favorite afternoon or landmark here." },
    { name: "Portugal", mapNames: ["Portugal"], note: "Stub travel note for Portugal. Add a coastal memory here." },
    { name: "Austria", mapNames: ["Austria"], note: "Stub travel note for Austria. Add a music, mountain, or city memory here." },
    { name: "Czech Republic", mapNames: ["Czechia", "Czech Rep.", "Czech Republic"], note: "Stub travel note for Czech Republic. Add a favorite old-town moment here." }
];

const map = d3.select(".travel-map");
const countryLayer = map.select(".country-layer");
const travelCard = document.querySelector(".travel-card");
const travelList = document.querySelector(".travel-list");
const placeholderImage = "images/travel-placeholder.png";
const countryLookup = new Map();
let hideTravelCardTimer;

visitedCountries.forEach((country) => {
    country.mapNames.forEach((mapName) => countryLookup.set(mapName, country));
});

function activateCountry(country) {
    clearTimeout(hideTravelCardTimer);
    travelCard.innerHTML = `
        <img src="${placeholderImage}" alt="Placeholder travel photo for ${country.name}" />
        <div>
            <p class="pixel-label">TRAVEL LOG</p>
            <h3>${country.name}</h3>
            <p>${country.note}</p>
        </div>
    `;
    travelCard.classList.add("is-visible");
}

function hideTravelCard() {
    clearTimeout(hideTravelCardTimer);
    hideTravelCardTimer = setTimeout(() => {
        travelCard.classList.remove("is-visible");
    }, 90);
}

visitedCountries.forEach((country) => {
    const listItem = document.createElement("button");
    listItem.type = "button";
    listItem.textContent = country.name;
    listItem.addEventListener("mouseenter", () => activateCountry(country));
    listItem.addEventListener("mouseleave", hideTravelCard);
    listItem.addEventListener("focus", () => activateCountry(country));
    listItem.addEventListener("blur", hideTravelCard);
    listItem.addEventListener("click", () => activateCountry(country));
    travelList.appendChild(listItem);
});

travelCard.addEventListener("mouseenter", () => {
    clearTimeout(hideTravelCardTimer);
    travelCard.classList.add("is-visible");
});
travelCard.addEventListener("mouseleave", hideTravelCard);

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then((world) => {
    const countries = topojson.feature(world, world.objects.countries).features;
    const projection = d3.geoNaturalEarth1().fitSize([1000, 520], { type: "Sphere" });
    const path = d3.geoPath(projection);

    countryLayer
        .selectAll("path")
        .data(countries)
        .join("path")
        .attr("class", (country) => {
            const visitedCountry = countryLookup.get(country.properties.name);
            return visitedCountry ? "map-country visited-country" : "map-country";
        })
        .attr("d", path)
        .attr("tabindex", (country) => countryLookup.get(country.properties.name) ? "0" : null)
        .attr("role", (country) => countryLookup.get(country.properties.name) ? "button" : null)
        .attr("aria-label", (country) => {
            const visitedCountry = countryLookup.get(country.properties.name);
            return visitedCountry ? `${visitedCountry.name}: ${visitedCountry.note}` : country.properties.name;
        })
        .on("mouseenter", (event, country) => {
            const visitedCountry = countryLookup.get(country.properties.name);
            if (visitedCountry) activateCountry(visitedCountry);
        })
        .on("mouseleave", (event, country) => {
            if (countryLookup.get(country.properties.name)) hideTravelCard();
        })
        .on("focus", (event, country) => {
            const visitedCountry = countryLookup.get(country.properties.name);
            if (visitedCountry) activateCountry(visitedCountry);
        })
        .on("blur", (event, country) => {
            if (countryLookup.get(country.properties.name)) hideTravelCard();
        });
}).catch(() => {
    travelCard.innerHTML = `
        <img src="${placeholderImage}" alt="Placeholder travel photo" />
        <div>
            <p class="pixel-label">MAP OFFLINE</p>
            <h3>Travel map unavailable</h3>
            <p>The country map could not load. The country list still works as a backup.</p>
        </div>
    `;
    travelCard.classList.add("is-visible");
});
