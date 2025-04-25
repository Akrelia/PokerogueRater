const overallButton = document.getElementById("ladder-button");
const noteButton = document.getElementById("note-button");
const votesButton = document.getElementById("votes-button");
const criteriaButtons = document.querySelectorAll(".criteria-button");

translationCallbacks.push(updateTopText);

function updateTopText() {

  const t = translations[selectedLanguage];

  overallButton.textContent = t.criteria.overall;

  noteButton.textContent = t.rawNote;

  votesButton.textContent = t.votes;

  document.querySelectorAll(".criteria-button").forEach((button) => {
    const criteriaKey = button.dataset.translate;
    if (t.criteria[criteriaKey]) {
      button.textContent = t.criteria[criteriaKey];
    }
  });

  overallButton.click(); // Simuler un clic sur le bouton "overall" pour charger les données par défaut
}

criteriaButtons.forEach((button) => {
  button.addEventListener("click", async () => {
    resetActiveButtons();
    button.classList.add("active");

    const selectedCriteria = button.dataset.criteria;

    const response = await fetch(`${API_URLS.GET_TOP_RATED}?limit=100&language=${selectedLanguage}&sort=${selectedCriteria}`);
    const data = await response.json();
    displayPokemonList(selectedCriteria, data);
  });
});

function displayPokemonList(criteria, data) {
  const listContainer = document.getElementById("top-100");
  listContainer.innerHTML = ""; // Réinitialiser la liste

  data.forEach((pokemon, index) => {
    const listItem = document.createElement("li");
    listItem.className = "pokemon-list-item";

    if (criteria === "overall" || criteria === "vote_count") {
      criteria = "global_rating";
    }

    listItem.innerHTML = `
      <div class="pokemon-row">
        <span class="rank">#${index + 1}</span>
        <img class="sprite" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png" alt="${pokemon.name}" />
        <span class="rating">${pokemon[criteria].toFixed(2)}</span>
        <span class="name">${pokemon.name}</span>
        <span class="votes">${pokemon.vote_count} votes</span>
      </div>
    `;

    listItem.addEventListener("click", () => {
      window.open(`index.html?pokemon=${pokemon.id}`, "_blank");
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
