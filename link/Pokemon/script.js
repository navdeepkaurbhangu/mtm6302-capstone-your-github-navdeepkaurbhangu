document.addEventListener("DOMContentLoaded", () => {
    const pokemonList = document.getElementById("pokemon-list");
    const loadMoreButton = document.getElementById("load-more");
    const pokemonDetails = document.getElementById("pokemon-details");
    let offset = 0;

    const getPokemonList = async (offset) => {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error("Error fetching Pokémon list:", error);
        }
    };

    const getPokemonDetails = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error fetching Pokémon details:", error);
        }
    };

    const displayPokemon = async () => {
        const pokemonArray = await getPokemonList(offset);
        for (const pokemon of pokemonArray) {
            const pokemonData = await getPokemonDetails(pokemon.url);
            const pokemonCard = document.createElement("div");
            pokemonCard.className = "pokemon-card";
            pokemonCard.innerHTML = `
                <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
                <p>${pokemonData.name}</p>
            `;
            pokemonCard.addEventListener("click", () => showPokemonDetails(pokemon.url));
            pokemonList.appendChild(pokemonCard);
        }
        offset += 20;
    };

    const showPokemonDetails = async (url) => {
        try {
            const data = await getPokemonDetails(url);
            pokemonDetails.innerHTML = `
                <div class="modal-content">
                    <h2>${data.name}</h2>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p>Height: ${data.height}</p>
                    <p>Weight: ${data.weight}</p>
                    <button id="toggle-caught">${isCaught(data.name) ? 'Release' : 'Catch'}</button>
                    <button id="close-modal">Close</button>
                </div>
            `;
            pokemonDetails.style.display = "flex";
            document.getElementById("toggle-caught").addEventListener("click", () => toggleCaught(data.name));
            document.getElementById("close-modal").addEventListener("click", () => closeModal());
        } catch (error) {
            console.error("Error fetching Pokémon details:", error);
        }
    };

    const closeModal = () => {
        pokemonDetails.style.display = "none";
    };

    const toggleCaught = (pokemonName) => {
        let caughtList = JSON.parse(localStorage.getItem("caughtPokemon")) || [];
        if (caughtList.includes(pokemonName)) {
            caughtList = caughtList.filter(name => name !== pokemonName);
        } else {
            caughtList.push(pokemonName);
        }
        localStorage.setItem("caughtPokemon", JSON.stringify(caughtList));
        document.getElementById("toggle-caught").textContent = caughtList.includes(pokemonName) ? "Release" : "Catch";
    };

    const isCaught = (pokemonName) => {
        const caughtList = JSON.parse(localStorage.getItem("caughtPokemon")) || [];
        return caughtList.includes(pokemonName);
    };

    loadMoreButton.addEventListener("click", displayPokemon);

    // Initial load
    displayPokemon();
});
