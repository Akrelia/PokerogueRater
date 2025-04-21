// Ajout de la déclaration de la variable selectedLanguage
const selectedLanguage = "en";

// Ajout des gestionnaires d'événements pour les boutons Ladder, Note et Votes
const overallButton = document.getElementById("ladder-button");
const noteButton = document.getElementById("note-button");
const votesButton = document.getElementById("votes-button");


// Gestion des clics sur les boutons de critères
const criteriaButtons = document.querySelectorAll(".criteria-button");

criteriaButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    resetActiveButtons();
    button.classList.add("active");

    const selectedCriteria = button.dataset.criteria;

    const response = await fetch(`${API_URLS.GET_TOP_RATED}?limit=100&language=${selectedLanguage}&sort=${selectedCriteria}`);
    const data = await response.json();
    displayPokemonList(data);
  });
});


function displayPokemonList(data) {
  const listContainer = document.getElementById("top-100");
  listContainer.innerHTML = ""; // Réinitialiser la liste

  data.forEach((pokemon, index) => {
    const listItem = document.createElement("li");
    listItem.className = "pokemon-list-item";

    listItem.innerHTML = `
      <div class="pokemon-row">
        <span class="rank">#${index + 1}</span>
        <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />
        <span class="rating">${pokemon.global_rating.toFixed(2)}</span>
        <span class="name">${pokemon.name}</span>
        <span class="votes">${pokemon.vote_count} votes</span>
      </div>
    `;

    listItem.addEventListener("click", () => {
      window.location.href = `index.html?pokemon=${pokemon.id}`;
    });

    listContainer.appendChild(listItem);
  });
}

// Ajout de la gestion pour activer les boutons de filtres
function resetActiveButtons() {
  const allButtons = document.querySelectorAll(".button-group button, .criteria-button");
  allButtons.forEach((button) => button.classList.remove("active"));
}

overallButton.click();