let selectedLanguage = "en";

const API_URLS2 = {
  GET_POKEMON: "http://localhost:27350/pokemons/en",
  SUBMIT_RATING: "http://localhost:27350/ratings",
  GET_RATINGS: "http://localhost:27350/ratings",
  GET_RANDOM_STARTER: "http://localhost:27350/random-starter",
  GET_UNRATED_RANDOM_STARTER: "http://localhost:27350/random-unrated-starter",
  SEARCH_STARTER: "http://localhost:27350/search-starter/en",
  GET_TOP_RATED: "http://localhost:27350/top-rated",
  GET_WORST_RATED: "http://localhost:27350/worst-rated",
};

const API_URLS = {
  GET_POKEMON: "https://pokeapi.crabdance.com/pokemons",
  SUBMIT_RATING: "https://pokeapi.crabdance.com/ratings",
  GET_RATINGS: "https://pokeapi.crabdance.com/ratings",
  GET_RANDOM_STARTER: "https://pokeapi.crabdance.com/random-starter",
  GET_UNRATED_RANDOM_STARTER: "https://pokeapi.crabdance.com/random-unrated-starter",
  SEARCH_STARTER: "https://pokeapi.crabdance.com/search-starter",
  GET_TOP_RATED: "https://pokeapi.crabdance.com/top-rated",
  GET_WORST_RATED: "https://pokeapi.crabdance.com/worst-rated",
  GET_TOTAL_VOTES: "https://pokeapi.crabdance.com/total-votes",
};

let selectedMode = { classic: true, endless: true }; // "Both" activé par défaut

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
  updateUIText();
  if (POKEMON_ID) {
    loadPokemon(POKEMON_ID);
  }
}

function updateUIText() {
  const t = translations[selectedLanguage];

  const siteName = document.querySelector(".site-name");
  if (siteName) siteName.textContent = t.siteTitle;

  const searchPlaceholder = document.querySelector("#pokemon-search");
  if (searchPlaceholder) searchPlaceholder.placeholder = t.searchPlaceholder;

  const randomButton = document.querySelector("#random-pokemon span");
  if (randomButton) randomButton.textContent = t.randomButton;

  const randomUnratedButton = document.querySelector("#random-unrated-pokemon span");
  if (randomUnratedButton) randomUnratedButton.textContent = t.randomUnratedButton;

  const welcomeHeader = document.querySelector(".welcome-header");
  if (welcomeHeader) {
    const h2 = welcomeHeader.querySelector("h2");
    if (h2) h2.innerHTML = t.welcomeTitle;

    const paragraphs = welcomeHeader.querySelectorAll("p");
    if (paragraphs[0]) paragraphs[0].innerHTML = t.welcomeText;
    if (paragraphs[1]) paragraphs[1].innerHTML = t.welcomeGoal;
  }

  const rateThisPokemon = document.querySelector("#rate-this-pokemon");
  if (rateThisPokemon) rateThisPokemon.textContent = t.rateThisPokemon;

  const submitRating = document.querySelector("#submit-rating");
  if (submitRating) submitRating.textContent = t.rateButton;

  const noRatings = document.querySelector(".no-ratings");
  if (noRatings) noRatings.textContent = t.noRatingYet;

  const topTitle = document.querySelector(".top-title");
  if (topTitle) topTitle.textContent = t.topTitle;

  const worstTitle = document.querySelector(".worst-title");
  if (worstTitle) worstTitle.textContent = t.worstTitle;

  const aboutSection = document.querySelector(".footer-section h3");
  if (aboutSection) aboutSection.textContent = t.about;

  const aboutText = document.querySelector(".footer-section p");
  if (aboutText) aboutText.innerHTML = t.aboutText;

  const footerSections = document.querySelectorAll(".footer-section h3");
  if (footerSections[1]) footerSections[1].textContent = t.links || "Links";

  const contactLink = document.querySelector(".footer-section a");
  if (contactLink) contactLink.textContent = t.footer?.contact || "Contact";

  // Mettre à jour les tooltips directement via leurs IDs
  const tooltipPokemon = document.querySelector("#tooltip-pokemon");
  if (tooltipPokemon) tooltipPokemon.setAttribute("data-tooltip", t.criteriaDescriptions.base);

  const tooltipCost = document.querySelector("#tooltip-cost");
  if (tooltipCost) tooltipCost.setAttribute("data-tooltip", t.criteriaDescriptions.cost);

  const tooltipEggMoves = document.querySelector("#tooltip-egg-moves");
  if (tooltipEggMoves) tooltipEggMoves.setAttribute("data-tooltip", t.criteriaDescriptions.eggMoves);

  const tooltipPassive = document.querySelector("#tooltip-passive");
  if (tooltipPassive) tooltipPassive.setAttribute("data-tooltip", t.criteriaDescriptions.passive);

  const tooltipOutOfTheBox = document.querySelector("#tooltip-out-of-the-box");
  if (tooltipOutOfTheBox) tooltipOutOfTheBox.setAttribute("data-tooltip", t.criteriaDescriptions.outOfTheBox);

  const tooltipBestGameMode = document.querySelector("#tooltip-best-game-mode");
  if (tooltipBestGameMode) tooltipBestGameMode.setAttribute("data-tooltip", t.bestGameMode);

  // Mettre à jour les labels des critères
  const overallLabel = document.querySelector("#overall-label-rating");
  if (overallLabel) overallLabel.textContent = t.overall;

  document.querySelectorAll(".mini-rating-group .label-with-tooltip span.label-text").forEach((label, index) => {
    const criteriaKeys = ["overall", "pokemon", "cost", "eggMoves", "passive", "outOfTheBox"];
    if (criteriaKeys[index] && label) {
      label.textContent = t.criteria[criteriaKeys[index]];
    }
  });

  document.querySelectorAll(".rating-group label span.label-text").forEach((label, index) => {
    const criteriaKeys = ["pokemon", "cost", "eggMoves", "passive", "outOfTheBox"];
    if (criteriaKeys[index] && label) {
      label.textContent = t.criteria[criteriaKeys[index]];
    }
  });

  // Mettre à jour les boutons de modes
  const classicModeButton = document.querySelector("#classic-mode");
  if (classicModeButton) classicModeButton.innerHTML = `<img src="images/classic-mode.png" alt="Classic" class="mode-icon" /> ${t.modeButtons.classic}`;

  const bothModeButton = document.querySelector("#both-mode");
  if (bothModeButton) bothModeButton.textContent = t.modeButtons.both;

  const endlessModeButton = document.querySelector("#endless-mode");
  if (endlessModeButton) endlessModeButton.innerHTML = `${t.modeButtons.endless} <img src="images/infinity-mode.png" alt="Endless" class="mode-icon" />`;

  // Mettre à jour les labels dans le slider
  const sliderLabels = document.querySelectorAll(".slider-labels span");
  if (sliderLabels[0]) sliderLabels[0].innerHTML = `<img src="images/classic-mode.png" alt="Classic" class="slider-icon" /> ${t.sliderLabels.classic}`;
  if (sliderLabels[1]) sliderLabels[1].innerHTML = `${t.sliderLabels.endless} <img src="images/infinity-mode.png" alt="Endless" class="slider-icon" />`;
}

function getCriteriaKeyFromType(type) {
  const typeToKey = {
    power: "pokemon",
    cost: "cost",
    egg_moves: "eggMoves",
    ability: "passive",
    out_of_the_box: "outOfTheBox",
  };
  return typeToKey[type];
}

function getCriteriaKeyFromBar(bar) {
  const criteriaToKey = {
    base: "pokemon",
    cost: "cost",
    eggMoves: "eggMoves",
    passive: "passive",
    outOfTheBox: "outOfTheBox",
  };
  return criteriaToKey[bar.dataset.criteria];
}

let POKEMON_ID = "1";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pokemonId = urlParams.get("pokemon");

    loadSavedLanguage();
    updateUIText();

    await Promise.all([loadTotalVotes(), loadTopRatedPokemons(), loadWorstRatedPokemons(), pokemonId ? loadPokemon(pokemonId) : Promise.resolve()]);

    setupEventListeners();
    setupModeButtons();

    document.getElementById("loader").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  } catch (error) {
    console.error("Erreur lors du chargement initial:", error);
    alert("Une erreur est survenue lors du chargement des données");
  }
});

async function loadTotalVotes() {
  try {
    const response = await fetch(API_URLS.GET_TOTAL_VOTES);
    const data = await response.json();
    const votes = data[0].total_votes;

    document.getElementById("total-votes").innerHTML = `
      <h4>Over <span class="vote-highlight">${votes}</span> votes already!</h4>
    `;
    return response;
  } catch (error) {
    console.error("Erreur lors de la récupération du total des votes:", error);
  }
}

function initializeRatingBars() {
  document.querySelectorAll(".rating-bar").forEach((bar) => {
    resetRatingBar(bar);

    const criteria = bar.dataset.criteria;
    if (criteria && translations[selectedLanguage].criteriaDescriptions[criteria]) {
      const tooltipTrigger = bar.parentElement.querySelector(".tooltip-trigger");
      if (tooltipTrigger) {
        tooltipTrigger.setAttribute("data-tooltip", translations[selectedLanguage].criteriaDescriptions[criteria]);
      }
    }
  });
}

function resetRatingBar(bar) {
  const fill = bar.querySelector(".rating-fill");
  const value = bar.querySelector(".rating-value");
  bar.dataset.value = "1";
  fill.style.width = "10%";
  fill.style.backgroundColor = "hsl(0, 70%, 45%)";
  value.textContent = "1/10";
}

function setupEventListeners() {
  setupRatingBarClickHandlers();
  setupSubmitButtonHandler();
  setupSearchHandlers();
  setupRandomButtons();

  const languageSelector = document.querySelector(".language-selector select");
  languageSelector.addEventListener("change", changeLanguage);
}

function setupRatingBarClickHandlers() {
  document.querySelectorAll(".rating-bar").forEach((bar) => {
    bar.addEventListener("click", (e) => updateRatingBar(bar, e));
  });
}

function updateRatingBar(bar, event) {
  const rect = bar.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const value = Math.max(1, Math.min(10, Math.round((x / rect.width) * 10)));

  bar.dataset.value = value;
  const fill = bar.querySelector(".rating-fill");
  fill.style.width = `${value * 10}%`;
  fill.style.borderRadius = value === 10 ? "15px" : "15px 0 0 15px";
  fill.style.backgroundColor = `hsl(${(value - 1) * 13.33}, 70%, 45%)`;
  bar.querySelector(".rating-value").textContent = `${value}/10`;
}

function setupSubmitButtonHandler() {
  document.getElementById("submit-rating").addEventListener("click", () => {
    const ratings = collectRatings();
    submitRating(POKEMON_ID, ratings);
    saveVotedPokemon(POKEMON_ID);
    document.querySelector(".rating-section").style.display = "none";

    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function collectRatings() {
  const ratings = {};
  document.querySelectorAll(".rating-bar").forEach((bar) => {
    ratings[bar.dataset.criteria] = parseInt(bar.dataset.value);
  });
  return { ...ratings, ...selectedMode };
}

function saveVotedPokemon(pokemonId) {
  const votedPokemons = JSON.parse(localStorage.getItem("votedPokemons")) || [];
  const stringId = String(pokemonId);
  if (!votedPokemons.includes(stringId)) {
    votedPokemons.push(stringId);
    localStorage.setItem("votedPokemons", JSON.stringify(votedPokemons));
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
  document.getElementById("random-pokemon").addEventListener("click", getRandomStarter);
  document.getElementById("random-unrated-pokemon").addEventListener("click", getUnratedRandomStarter);
}

async function getUnratedRandomStarter() {
  try {
    const response = await fetch(API_URLS.GET_UNRATED_RANDOM_STARTER);
    const data = await response.json();
    if (data.id) {
      window.location.href = `?pokemon=${data.id}`;
    }
  } catch (error) {
    console.error("Erreur lors de la récupération du starter non noté:", error);
  }
}

async function loadPokemon(pokemonId) {
  POKEMON_ID = pokemonId;

  document.querySelector(".welcome-div").classList.add("hidden");
  document.querySelector(".pokemon-info-card").classList.remove("hidden");
  document.querySelector(".rating-section").classList.remove("hidden");

  try {
    const [pokemonResponse, ratingsResponse] = await Promise.all([fetch(`${API_URLS.GET_POKEMON}/${selectedLanguage}/${pokemonId}`), fetch(`${API_URLS.GET_RATINGS}/${pokemonId}`)]);

    const pokemon = await pokemonResponse.json();
    const ratings = await ratingsResponse.json();

    if (pokemon.starter == 1) {

      const votedPokemons = JSON.parse(localStorage.getItem("votedPokemons")) || [];
      const ratingSection = document.querySelector(".rating-section");

      if (votedPokemons.includes(String(pokemonId))) {
        ratingSection.style.display = "none";
      } else {
        ratingSection.style.display = "block";
      }

      initializeRatingBars();

      updateRatingBars(ratings);

      const nameContainer = document.getElementById("pokemon-name");
      const nameKey = `name_${selectedLanguage}`;
      nameContainer.innerHTML = `${pokemon[nameKey] || pokemon.name_en} <div class="pokemon-index">#${pokemonId}</div>`;

      const imageElement = document.getElementById("pokemon-image");
      const showdownSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`;
      const fallbackSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

      imageElement.src = showdownSprite;
      imageElement.onerror = () => {
        imageElement.src = fallbackSprite;
      };

      const typesContainer = document.querySelector(".pokemon-types");
      typesContainer.innerHTML = "";
      pokemon.types.forEach((type) => {
        const typeSpan = document.createElement("span");
        typeSpan.className = `type ${type}`;
        typeSpan.textContent = type;
        typesContainer.appendChild(typeSpan);
      });

      const abilityContainer = document.getElementById("pokemon-ability");
      abilityContainer.innerHTML = `
      <div class="info-section">
        <h3>${translations[selectedLanguage].labels.passive}</h3>
        <div class="ability-badge" data-tooltip="${pokemon.passive.description}">
          ${pokemon.passive.name}
        </div>
      </div>
      <div class="info-section">
        <h3>${translations[selectedLanguage].labels.cost}</h3>
        <div class="ability-badge">
          ${pokemon.cost}
        </div>
      </div>
    `;

      const eggMovesContainer = document.getElementById("pokemon-egg-moves");
      eggMovesContainer.innerHTML = `<h3>${translations[selectedLanguage].labels.eggMoves}</h3><div class="egg-moves-separator"></div>`;

      const eggMoves = [pokemon.egg_move_1, pokemon.egg_move_2, pokemon.egg_move_3, pokemon.egg_move_4].filter(Boolean);

      const table = document.createElement("div");
      table.className = "egg-moves-table";

      for (const move of eggMoves) {
        const moveData = await fetchEggMoveData(move);
        const moveElement = document.createElement("div");
        moveElement.className = `egg-move-cell ${moveData.type}`;
        moveElement.setAttribute("data-tooltip", `${moveData.description}\n\nPower: ${moveData.power || "--"}\nAccuracy: ${moveData.accuracy || "--"}`);
        moveElement.innerHTML = `
                <div class="move-name-row">
                    <img src="images/types/${moveData.type}.png" alt="${moveData.type}">
                    <span class="move-name">${moveData.name}</span>
                </div>
            `;
        table.appendChild(moveElement);
      }

      eggMovesContainer.appendChild(table);
    } else {
      document.querySelector(".rating-section").style.display = "none";
      document.querySelector(".pokemon-info-card").classList.add("hidden");
    }

  } catch (error) {
    console.error("Erreur:", error);
  }
}

async function fetchEggMoveData(moveName) {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/move/${moveName.toLowerCase()}`);
    const data = await response.json();

    let name, description;

    name = data.names.find((entry) => entry.language.name === selectedLanguage)?.name;
    description = data.flavor_text_entries.find((entry) => entry.language.name === selectedLanguage)?.flavor_text;

    if (!name) {
      name = data.names.find((entry) => entry.language.name === "en")?.name || data.name;
    }
    if (!description) {
      description = data.flavor_text_entries.find((entry) => entry.language.name === "en")?.flavor_text || translations[selectedLanguage].noDescription || "No description available";
    }

    if (selectedLanguage === "jp") {
      description = description.replace(/\n/g, "").replace(/\f/g, "");
      description = description.replace(/[0-9]/g, (s) => String.fromCharCode(s.charCodeAt(0) + 0xfee0));
    }

    return {
      name,
      description,
      type: data.type.name,
      power: data.power,
      accuracy: data.accuracy,
    };
  } catch (error) {
    console.error(`Erreur lors de la récupération des données pour le move ${moveName}:`, error);
    return {
      name: moveName,
      description: translations[selectedLanguage].noDescription || "No description available",
      type: "normal",
      power: "--",
      accuracy: "--",
    };
  }
}

function updateRatingBars(ratings) {
  const noRating = document.querySelector(".no-ratings");
  const globalRating = document.querySelector(".global-rating");

  if (!ratings.vote_count) {
    noRating.style.display = "block";
    globalRating.style.display = "none";
    return;
  }

  noRating.style.display = "none";
  globalRating.style.display = "block";

  document.getElementById("vote-count").textContent = ratings.vote_count;

  // Mise à jour du slider "Mode Balance"
  const modeBalanceSlider = document.getElementById("mode-balance");
  const modeBalanceIndicator = document.getElementById("mode-balance-indicator");
  const totalVotes = (ratings.classic || 0) + (ratings.endless || 0);
  const endlessPercentage = totalVotes > 0 ? Math.round((ratings.endless / totalVotes) * 100) : 50; // Inverser la valeur
  modeBalanceSlider.value = endlessPercentage;

  const getDescriptionKey = (type) => {
    const typeToKey = {
      power: "base",
      cost: "cost",
      egg_moves: "eggMoves",
      ability: "passive",
      out_of_the_box: "outOfTheBox",
    };
    return typeToKey[type];
  };

  document.querySelectorAll(".mini-rating-bar").forEach((bar) => {
    const type = bar.dataset.type;
    if (type) {
      const value = Math.max(1, Math.round((ratings[type] || 0) * 10) / 10);
      const fill = bar.querySelector(".mini-rating-fill");
      const valueSpan = bar.querySelector(".rating-value");

      const tooltipTrigger = bar.parentElement.querySelector(".tooltip-trigger");
      const descriptionKey = getDescriptionKey(type);

      if (tooltipTrigger && descriptionKey && translations[selectedLanguage].criteriaDescriptions[descriptionKey]) {
        tooltipTrigger.setAttribute("data-tooltip", translations[selectedLanguage].criteriaDescriptions[descriptionKey]);
      }

      fill.style.width = `${value * 10}%`;
      fill.style.borderRadius = value === 10 ? "8px" : "8px 0 0 8px";
      const hue = (value - 1) * 13.33;
      fill.style.backgroundColor = `hsl(${hue}, 70%, 45%)`;
      valueSpan.textContent = `${value.toFixed(1)}`;
    }
  });

  const globalRatingValue = calculateGlobalRating(ratings);
  const globalBar = document.querySelector(".mini-rating-bar:not([data-type])");
  const globalFill = globalBar.querySelector(".mini-rating-fill");
  const globalValue = globalBar.querySelector(".rating-value");
  const roundedGlobalRating = Math.max(1, Math.round(globalRatingValue * 10) / 10);

  globalFill.style.width = `${roundedGlobalRating * 10}%`;
  globalFill.style.borderRadius = roundedGlobalRating === 10 ? "8px" : "8px 0 0 8px";
  const globalHue = (roundedGlobalRating - 1) * 13.33;
  globalFill.style.backgroundColor = `hsl(${globalHue}, 70%, 45%)`;
  globalValue.textContent = `${roundedGlobalRating.toFixed(1)}`;
}

function calculateGlobalRating(ratings) {
  const values = [ratings.power, ratings.cost, ratings.egg_moves, ratings.ability, ratings.out_of_the_box];
  return values.reduce((a, b) => a + b, 0) / values.length;
}

async function submitRating(pokemonId, ratings) {
  try {
    const response = await fetch(`${API_URLS.SUBMIT_RATING}/${pokemonId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ratings }),
    });

    if (response.ok) {
      await loadPokemon(pokemonId);
    } else {
      throw new Error("Erreur lors de l'enregistrement");
    }
  } catch (error) {
    console.error("Erreur lors de la soumission:", error);
    alert("Erreur lors de l'enregistrement de la notation");
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

async function loadTopRatedPokemons() {
  try {
    const response = await fetch(API_URLS.GET_TOP_RATED);
    const topRated = await response.json();

    //topRated.sort((a, b) => b.global_rating - a.global_rating); // Since I use the formula, we don't need to sort it

    displayTopRatedPokemons(topRated);
    return response;
  } catch (error) {
    console.error("Erreur lors du chargement des Pokémon les mieux notés:", error);
  }
}

async function loadWorstRatedPokemons() {
  try {
    const response = await fetch(API_URLS.GET_WORST_RATED);
    const worstRated = await response.json();

    //worstRated.sort((a, b) => a.global_rating - b.global_rating);

    displayWorstRatedPokemons(worstRated);
    return response;
  } catch (error) {
    console.error("Erreur lors du chargement des Pokémon les pire notés:", error);
  }
}

function displayTopRatedPokemons(pokemons) {
  const grid = document.getElementById("top-rated-grid");
  grid.innerHTML = "";

  pokemons.slice(0, 20).forEach((pokemon, index) => {
    const item = document.createElement("div");
    item.className = "top-rated-item";
    item.onclick = () => {
      window.location.href = `?pokemon=${pokemon.id}`;
    };

    const spriteUrl = getPokemonSprite(pokemon.id);

    getPokemonSprite(pokemon.id, (spriteUrl) => {
      item.innerHTML = `
        <div class="rank-badge">#${index + 1}</div>
        <img src="${spriteUrl}" alt="${pokemon.id}">
        <div class="rating">${pokemon.global_rating.toFixed(1)}</div>
      `;
    });

    grid.appendChild(item);
  });
}

function displayWorstRatedPokemons(pokemons) {
  const grid = document.getElementById("worst-rated-grid");
  grid.innerHTML = "";

  pokemons.slice(0, 20).forEach((pokemon, index) => {
    const item = document.createElement("div");
    item.className = "worst-rated-item";
    item.onclick = () => {
      window.location.href = `?pokemon=${pokemon.id}`;
    };

    const spriteUrl = getPokemonSprite(pokemon.id);

    getPokemonSprite(pokemon.id, (spriteUrl) => {
      item.innerHTML = `
        <div class="rank-badge">#${index + 1}</div>
        <img src="${spriteUrl}" alt="${pokemon.id}">
        <div class="rating">${pokemon.global_rating.toFixed(1)}</div>
      `;
    });

    grid.appendChild(item);
  });
}

function getPokemonSprite(pokemonId, callback) {
  const showdownUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`;
  const fallbackUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

  const img = new Image();
  img.onload = () => {
    if (typeof callback === "function") {
      callback(showdownUrl);
    }
  };
  img.onerror = () => {
    if (typeof callback === "function") {
      callback(fallbackUrl);
    }
  };
  img.src = showdownUrl;
}

function setupModeButtons() {
  const classicButton = document.getElementById("classic-mode");
  const bothButton = document.getElementById("both-mode");
  const endlessButton = document.getElementById("endless-mode");

  bothButton.classList.add("active"); // Activer "Both" par défaut

  classicButton.addEventListener("click", () => {
    selectedMode = { classic: true, endless: false };
    updateModeButtons(classicButton, bothButton, endlessButton);
  });

  bothButton.addEventListener("click", () => {
    selectedMode = { classic: true, endless: true };
    updateModeButtons(bothButton, classicButton, endlessButton);
  });

  endlessButton.addEventListener("click", () => {
    selectedMode = { classic: false, endless: true };
    updateModeButtons(endlessButton, classicButton, bothButton);
  });
}

function updateModeButtons(activeButton, ...otherButtons) {
  activeButton.classList.add("active");
  otherButtons.forEach((button) => button.classList.remove("active"));
}
