const searchInput = document.getElementById('pokemon-input');
const searchBtn = document.getElementById('search-btn');
const resultContainer = document.getElementById('result-container');
const errorMessage = document.getElementById('error-message');

const pokeId = document.getElementById('poke-id');
const pokeName = document.getElementById('poke-name');
const pokeImg = document.getElementById('poke-img');
const pokeTypes = document.getElementById('poke-types');
const pokeStats = document.getElementById('poke-stats');

searchBtn.addEventListener('click', fetchPokemon);

searchInput.addEventListener('keypress', (e) => {
if (e.key === 'Enter') {
fetchPokemon();
}
});

async function fetchPokemon() {
const query = searchInput.value.trim().toLowerCase();

if (!query) return;

resultContainer.classList.add('hidden');
errorMessage.classList.add('hidden');

try {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query}`
    );

    if (!response.ok) {
        if (response.status === 404) {
            throw new Error("Error 404: That Pokemon doesn't exist!");
        } else {
            throw new Error(`Server Error (${response.status}).`);
        }
    }

    const data = await response.json();
    displayPokemon(data);

} catch (error) {
    showError(error.message);
}


}

function displayPokemon(data) {
pokeId.textContent = `ID: ${data.id}`;
pokeName.textContent = data.name;


pokeImg.src = data.sprites.front_default;
pokeImg.alt = `${data.name} image`;

pokeTypes.innerHTML = '';

data.types.forEach(t => {
    const span = document.createElement('span');
    span.textContent = t.type.name;
    pokeTypes.appendChild(span);
});

pokeStats.innerHTML = `
    <p>Height: ${data.height}</p>
    <p>Weight: ${data.weight}</p>
`;

resultContainer.classList.remove('hidden');


}

function showError(msg) {
errorMessage.textContent = msg;
errorMessage.classList.remove('hidden');
}
