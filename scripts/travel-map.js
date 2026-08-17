const visitedCountries = [
    { name: "China", mapNames: ["China"], mapIds: ["156"], note: "Stub travel note for China. Replace this with a favorite memory later." },
    { name: "Australia", mapNames: ["Australia"], mapIds: ["036"], note: "Stub travel note for Australia. Add a favorite landscape or story here." },
    { name: "United States", mapNames: ["United States of America"], mapIds: ["840"], note: "Stub travel note for the United States. Add a campus, road trip, or city memory here." },
    { name: "France", mapNames: ["France"], mapIds: ["250"], note: "Stub travel note for France. Add a museum, meal, or walk here." },
    { name: "Italy", mapNames: ["Italy"], mapIds: ["380"], note: "Stub travel note for Italy. Add a favorite city, pasta, or piazza here." },
    { name: "Portugal", mapNames: ["Portugal"], mapIds: ["620"], note: "Stub travel note for Portugal. Add a coastal memory here." },
    { name: "Spain", mapNames: ["Spain"], mapIds: ["724"], note: "Stub travel note for Spain. Add a favorite afternoon or landmark here." },
    { name: "United Kingdom", mapNames: ["United Kingdom"], mapIds: ["826"], note: "Stub travel note for the UK. Add a city or tiny rainy-day memory here." },
    { name: "Georgia", mapNames: ["Georgia"], mapIds: ["268"], note: "Stub travel note for Georgia. Add a city, meal, or moment here." },
    { name: "Chile", mapNames: ["Chile"], mapIds: ["152"], note: "Stub travel note for Chile. Add a favorite view or adventure here." },
    { name: "Mexico", mapNames: ["Mexico"], mapIds: ["484"], note: "Stub travel note for Mexico. Add a favorite place or food memory here." },
    { name: "Switzerland", mapNames: ["Switzerland"], mapIds: ["756"], note: "Stub travel note for Switzerland. Add a favorite mountain or lake memory here." },
    { name: "Austria", mapNames: ["Austria"], mapIds: ["040"], note: "Stub travel note for Austria. Add a music, mountain, or city memory here." },
    { name: "Czech Republic", mapNames: ["Czechia", "Czech Rep.", "Czech Republic"], mapIds: ["203"], note: "Stub travel note for Czech Republic. Add a favorite old-town moment here." }
];

const map = d3.select(".travel-map");
const countryLayer = map.select(".country-layer");
const travelCard = document.querySelector(".travel-card");
const travelList = document.querySelector(".travel-list");
const placeholderImage = "images/travel-placeholder.png";
const countryImageFolder = "images/countries";
const countryLookup = new Map();
const countryIdLookup = new Map();
let hideTravelCardTimer;

visitedCountries.forEach((country) => {
    country.mapNames.forEach((mapName) => countryLookup.set(mapName, country));
    country.mapIds.forEach((mapId) => countryIdLookup.set(mapId, country));
});

function getVisitedCountry(country) {
    return countryLookup.get(country.properties.name) || countryIdLookup.get(String(country.id).padStart(3, "0"));
}

function getCountryImage(country) {
    const imageName = country.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return `${countryImageFolder}/${imageName}.png`;
}

function activateCountry(country) {
    clearTimeout(hideTravelCardTimer);
    const jpgImage = getCountryImage(country).replace(/\.png$/, ".jpg");
    travelCard.innerHTML = `
        <img src="${getCountryImage(country)}" alt="Travel photo for ${country.name}" data-jpg-src="${jpgImage}" onerror="if (this.dataset.triedJpg !== 'true') { this.dataset.triedJpg = 'true'; this.src = this.dataset.jpgSrc; } else { this.onerror = null; this.src = '${placeholderImage}'; this.alt = 'Placeholder travel photo for ${country.name}'; }" />
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
            const visitedCountry = getVisitedCountry(country);
            return visitedCountry ? "map-country visited-country" : "map-country";
        })
        .attr("d", path)
        .attr("tabindex", (country) => getVisitedCountry(country) ? "0" : null)
        .attr("role", (country) => getVisitedCountry(country) ? "button" : null)
        .attr("aria-label", (country) => {
            const visitedCountry = getVisitedCountry(country);
            return visitedCountry ? `${visitedCountry.name}: ${visitedCountry.note}` : country.properties.name;
        })
        .on("mouseenter", (event, country) => {
            const visitedCountry = getVisitedCountry(country);
            if (visitedCountry) activateCountry(visitedCountry);
        })
        .on("mouseleave", (event, country) => {
            if (getVisitedCountry(country)) hideTravelCard();
        })
        .on("focus", (event, country) => {
            const visitedCountry = getVisitedCountry(country);
            if (visitedCountry) activateCountry(visitedCountry);
        })
        .on("blur", (event, country) => {
            if (getVisitedCountry(country)) hideTravelCard();
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
