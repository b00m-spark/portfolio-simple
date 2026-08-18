const visitedCountries = [
    { name: "China", mapNames: ["China"], mapIds: ["156"], note: "China is where I grew up in and still call home, whether or not I feel its calling. My memories related to it is always so crude, warm and swirling. It is of fragrant spring breezes, of tunes, of fleeting snow, of unable to shake off past shadows of mine whereever I go." },
    { name: "Australia", mapNames: ["Australia"], mapIds: ["036"], note: "I spent a year in Australia with my family when I was 10. The experience opened up another face of the world to me, the world in another language, a different schooling, a summer Christmas and tropical trees. It is an open door that eventually lured me out of home, to 'where the sky meets the sea'." },
    { name: "France", mapNames: ["France"], mapIds: ["250"], note: "I planned long before that once I turned 18, I will venture out to the world. Therefore a week after my 18th birthday, I made it to Paris, trying snails and putting my broken French into use for the first time. I could not forget the night River Seine, water blinking, transporting me to other places, the Eiffel Tower twinkling, like caramel chocolate." },
    { name: "Italy", mapNames: ["Italy"], mapIds: ["380"], note: "Rome greeted the 18-year-old me with a bad cold and headache, that the first place I rushed to visit getting off the train was the pharmacy. Rome eventually also cured me, with the sound of church bells, the evening Tiber, and facades of history. Its name still sounds golden to my ear, ringing, still calling and waiting for me." },
    { name: "United States", mapNames: ["United States of America"], mapIds: ["840"], note:"A place that I'm still exploring, still trying to make sense of and make home with. It marks my beginning to let go of long-held affiliations of my being -- family, hometown, past -- and ride my boat alone for the first time, 'rocking my boundless in the finite sea', feeling sometimes overwhelmed, sometimes indifferent, sometimes free." },
    { name: "Portugal", mapNames: ["Portugal"], mapIds: ["620"], note: "In Porto I started my Camino trip, walking along the coastline the first day, after lunch I already felt dying from pain and genuinely questioned if I can make the rest 10k. I eventually did, without knowing how. Watching a beach sunset right before sleep, it was the first time I made sense of why my night prayer says, 昼光未尽" },
    { name: "Spain", mapNames: ["Spain"], mapIds: ["724"], note: "Reaching Santiago de Compostela, end of the Camino, felt a less significant mooment than I previously imagined. Under the scorching sun, after the refreshing sangria, life still moves on. I remember at a seafood restaurant, I was struggling with my knife and fork with the shrimp. The owner comes to me and shouts: NOO, in Galicia we use hands, HANDS to eat shrimp!" },
    { name: "United Kingdom", mapNames: ["United Kingdom"], mapIds: ["826"], note: "A place I had a short taste but wished so so much I could live here. Maybe coaxed by the beautiful churches, free evensongs, bookshops museums, westend musicals, and few weeks of great summer weathers. I miss the adventures we took together as friends, boating in Hyde Park, trying sunday roast, visiting the British Museum but keep returning to the only room with AC." },
    { name: "Georgia", mapNames: ["Georgia"], mapIds: ["268"], note: "Any cat lovers like me should visit Tbilisi, I literally met over 10 cats in a day. I was inside an orthodox church for the first time in my life, and gradually became better at keeping my veil from falling off. I encountered for the first time in a hike in Mestia, where the river was deep and turbulent we had to cross the river on horses." },
    { name: "Chile", mapNames: ["Chile"], mapIds: ["152"], note: "The w-trek memory remained to me glacier-like pure and crystalline. Forget about all the freezing cold, bruises, sore knee and the three towers I never got to see, I was for so many times mesmerized by the grandeur of the snow mountains, the gem-like water, the glamorous clouds and unceilinged sky. I felt the world was mine, as if we were lovers." },
    { name: "Mexico", mapNames: ["Mexico"], mapIds: ["484"], note: "The simply breathtaking midnight TLM on Christmas Eve, the chill coffee & museum mornings, the gradeur of the NYE fireworks right in front of me that went on and on, the tears, the minutes inside a library or at adoration that I can't make myself leave. Mexico was so speckled with beauty, and yummy food for sure (made me realize how bad our dining hall makes tacos." },
    { name: "Switzerland", mapNames: ["Switzerland"], mapIds: ["756"], note: "Mountains, lakes, forests and meadows that my eyes refuse to move away from. Many places on earth have beautiful views but Switzerland has it so integrated into the human life and so accessible, by trains, cable cars, furniculars and feet. It sings a song of nature's gifts, of golden sunset rays gilding the wooden houses, lush pastures and rocky cliffs." },
    { name: "Czech Republic", mapNames: ["Czechia", "Czech Rep.", "Czech Republic"], mapIds: ["203"], note: "I liked Prague old town, still very well preserved, brick walls, cobblestone streets and red rooftops, it feels like walking straight into the medieval ages. My hotel has golden curtains, beddings and mirror frames, I thought I had a good deal of taking hostel price for living inside a castle." },
    { name: "Austria", mapNames: ["Austria"], mapIds: ["040"], note: "Vienna is randomly musical. Randomly, I looked on the opera hall website and decided to buy a 20€ standing ticket to The Magic Flute. Randomly, I found a stamp collection at a shop featuring musicians who spent their time in Austria, and visited many of their tombs. Randomly, I came out of the Golden Hall and run into a big disco party right across the street. Their music was equally passionate." },
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
