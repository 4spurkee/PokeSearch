const searchInput = document.getElementById('pokemon-input');
const searchBtn = document.getElementById('search-btn');

const resultContainer = document.getElementById('result-container');
const errorMessage = document.getElementById('error-message');

const pokeId = document.getElementById('poke-id');
const pokeName = document.getElementById('poke-name');
const pokeImg = document.getElementById('poke-img');
const pokeTypes = document.getElementById('poke-types');
const pokeStats = document.getElementById('poke-stats');

const listToggle = document.getElementById('list-toggle');
const listSection = document.getElementById('list-section');
const pokemonList = document.getElementById('pokemon-list');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageNumber = document.getElementById('page-number');

// =========================
// SEARCH
// =========================

searchBtn.addEventListener('click', fetchPokemon);

searchInput.addEventListener('keydown', (e) => {
if (e.key === 'Enter') {
fetchPokemon();
}
});

async function fetchPokemon() {

   
const query = searchInput.value.trim().toLowerCase();

if (!query) {
    return;
}

resultContainer.classList.add('hidden');
errorMessage.classList.add('hidden');

try {

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query}`
    );

    if (!response.ok) {

        if (response.status === 404) {
            throw new Error("Error 404: That Pokemon doesn't exist!");
        }

        throw new Error(`Server Error (${response.status}).`);
    }

    const data = await response.json();

    displayPokemon(data);

} catch (error) {

    showError(error.message);

}
   

}

// =========================
// DISPLAY POKEMON
// =========================

function displayPokemon(data) {

   
pokeId.textContent = `ID: ${data.id}`;

pokeName.textContent = data.name;

pokeImg.src = data.sprites.front_default;

pokeImg.alt = `${data.name} image`;


// Types

pokeTypes.innerHTML = '';

data.types.forEach((typeData) => {

    const span = document.createElement('span');

    span.textContent = typeData.type.name;

    pokeTypes.appendChild(span);

});


// Stats

pokeStats.innerHTML = `
    <div>Height: ${data.height}</div>
    <div>Weight: ${data.weight}</div>
`;


resultContainer.classList.remove('hidden');
   

}

// =========================
// ERROR
// =========================

function showError(message) {

   
errorMessage.textContent = message;

errorMessage.classList.remove('hidden');
   

}

// =========================
// PAGINATION
// =========================

let currentPage = 1;

const pokemonPerPage = 10;

let totalPokemon = 0;

// Load Pokémon page

async function loadPage(page) {

   
const offset = (page - 1) * pokemonPerPage;

try {

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`
    );

    if (!response.ok) {
        throw new Error(`Network Error: ${response.status}`);
    }

    const data = await response.json();

    totalPokemon = data.count;

    currentPage = page;

    drawList(data.results);

    updatePagination();

} catch (error) {

    console.error(
        'An error happened while loading the list:',
        error
    );

}
   

}

// Draw list

function drawList(pokemon) {

   
pokemonList.innerHTML = '';

pokemon.forEach((pokemonData, index) => {

    const item = document.createElement('div');

    item.className = 'pokemon-item';

    const number =
        (currentPage - 1) * pokemonPerPage + index + 1;

    item.innerHTML = `
        <span class="pokemon-number">
            #${number}
        </span>

        <span class="pokemon-list-name">
            ${pokemonData.name}
        </span>
    `;


    // Click Pokémon → search it

    item.addEventListener('click', () => {

        searchInput.value = pokemonData.name;

        fetchPokemon();

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    });


    pokemonList.appendChild(item);

});
   

}

// Update buttons

function updatePagination() {

   
const totalPages =
    Math.ceil(totalPokemon / pokemonPerPage);

pageNumber.textContent =
    `Page ${currentPage} / ${totalPages}`;

prevBtn.disabled = currentPage <= 1;

nextBtn.disabled =
    currentPage >= totalPages;
   

}

// Previous

prevBtn.addEventListener('click', () => {

   
if (currentPage > 1) {

    loadPage(currentPage - 1);

}
   

});

// Next

nextBtn.addEventListener('click', () => {

   
const totalPages =
    Math.ceil(totalPokemon / pokemonPerPage);

if (currentPage < totalPages) {

    loadPage(currentPage + 1);

}
   

});

// =========================
// SHOW / HIDE LIST
// =========================

listToggle.addEventListener('click', () => {

   
const hidden =
    listSection.classList.toggle('hidden');

if (hidden) {

    listToggle.textContent =
        'Show Pokémon List';

} else {

    listToggle.textContent =
        'Hide Pokémon List';

}
   

});

// Load first page

loadPage(1);
