let selectedLanguage = "en";

function setupEventListeners() {
  setupSearchHandlers();
  setupRandomButtons();

  const languageSelector = document.querySelector(".language-selector select");
  languageSelector.addEventListener("change", changeLanguage);
}


function loadSavedLanguage() {
  const savedLanguage = localStorage.getItem("selectedLanguage");
  if (savedLanguage) {
    selectedLanguage = savedLanguage;
    document.querySelector(".language-selector select").value = savedLanguage;
  }
}

function changeLanguage() {
  const select = document.querySelector(".language-selector select");
  selectedLanguage = select.value;
  localStorage.setItem("selectedLanguage", selectedLanguage);

 for (const fn of translationCallbacks) {
   fn();
 }
}

function setupSearchHandlers() {
  const searchInput = document.getElementById("pokemon-search");
  const suggestionsContainer = document.querySelector(".suggestions");



  searchInput.addEventListener("input", (e) => {
    suggestionsContainer.innerHTML = "";
    if (e.target.value.length >= 3) {
      suggestionsContainer.style.display = "block";
      fetchSuggestions(e.target.value, suggestionsContainer);
    } else {
      suggestionsContainer.style.display = "none";
    }
  });

  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
      suggestionsContainer.style.display = "none";
    }
  });
}

async function fetchSuggestions(query, container) {
  try {
    const response = await fetch(`${API_URLS.SEARCH_STARTER}/${selectedLanguage}/${query}`);
    const results = await response.json();
    container.innerHTML = "";
    results.forEach((pokemon) => createSuggestionItem(pokemon, container));
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
  }
}

function createSuggestionItem(pokemon, container) {
  const suggestion = document.createElement("div");
  suggestion.className = "suggestion-item";
  const nameKey = `name_${selectedLanguage}`;
  suggestion.textContent = pokemon[nameKey] || pokemon.name_en;
  suggestion.addEventListener("click", () => {
    document.getElementById("pokemon-search").value = "";
    window.location.href = `?pokemon=${pokemon.id}`;
    container.style.display = "none";
  });
  container.appendChild(suggestion);
}

function setupRandomButtons() {
  document.getElementById("hall-of-fame").addEventListener("click", () => { window.location.href = "top100.html";}); 
  document.getElementById("random-unrated-pokemon").addEventListener("click", getUnratedRandomStarter);
}

async function getUnratedRandomStarter() {
  try {
    const response = await fetch(API_URLS.GET_UNRATED_RANDOM_STARTER);
    const data = await response.json();
    if (data.id) {
      window.location.href = `index.html?pokemon=${data.id}`;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du starter non noté:", error);
  }
}

async function searchPokemon(term) {
  try {
    const response = await fetch(`${API_URLS.SEARCH_POKEMON}/${term}`);
    const results = await response.json();
    if (results.length > 0) {
      loadPokemon(results[0].id);
    }
  } catch (error) {
    console.error("Erreur lors de la recherche:", error);
  }
}

async function getRandomStarter() {
  try {
    const response = await fetch(API_URLS.GET_RANDOM_STARTER);
    const data = await response.json();
    if (data.id) {
      window.location.href = `?pokemon=${data.id}`;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du starter aléatoire:", error);
  }
}
