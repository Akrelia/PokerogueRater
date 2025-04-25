let selectedMode = { classic: true, endless: true };
let POKEMON_ID = "0";

initialize();

async function initialize() {
  try {
    translationCallbacks.push(updateRatingText);

    POKEMON_ID = getPokemonIdFromUrl(); // Get the Pokémon ID from the URL

    if (!POKEMON_ID || POKEMON_ID === "0") {
      document.querySelector(".welcome-div").classList.remove("hidden");
      document.querySelector(".pokemon-info-card").classList.add("hidden");
      document.querySelector(".rating-section").classList.add("hidden");

      await Promise.all([loadTotalVotes(), loadTopRatedPokemons(), loadWorstRatedPokemons()]);
    } else {
      await Promise.all([loadTotalVotes(), loadTopRatedPokemons(), loadWorstRatedPokemons(), loadPokemon(POKEMON_ID)]);
    }

    setupRatingBarClickHandlers();
    setupSubmitButtonHandler();
    setupModeButtons();

    document.getElementById("loader").style.display = "none";
    document.getElementById("main-content").style.display = "block";
  } catch (error) {
    console.error("Erreur lors du chargement initial:", error);
    alert("Une erreur est survenue lors du chargement des données");
  }
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

function getPokemonIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("pokemon") || "0"; // Default to "1" if no ID is provided
}

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
  fill.style.backgroundColor = getColorFromScore(1);
  value.textContent = "1/10";
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
  fill.style.backgroundColor = getColorFromScore(value);
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

async function loadPokemon(pokemonId) {
  if (POKEMON_ID === "0" || !POKEMON_ID) {
    return;
  }

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
      const pokemonSection = document.querySelector(".pokemon-section");
      const pokemonLeft = document.querySelector(".pokemon-left");

      pokemonSection.classList.add(pokemon.types[0] + "-bg");

      if (votedPokemons.includes(String(pokemonId))) {
        ratingSection.style.display = "none";
      } else {
        ratingSection.style.display = "block";
      }

      initializeRatingBars();

      updateRatingBars(ratings);

      const nameContainer = document.getElementById("pokemon-name");
      const nameKey = `name_${selectedLanguage}`;
      nameContainer.innerHTML = ` <img src="images/pokeball-icon.png" alt="Pokeball Icon" style="width: 30px; height: 30px; margin-right: 10px; vertical-align: middle;"> ${
        pokemon[nameKey] || pokemon.name_en
      } <div class="pokemon-index">#${pokemonId}</div>`;

      document.title = `${pokemon[nameKey] || pokemon.name_en} - Rate My Starter`;

      const imageElement = document.getElementById("pokemon-image");
      const showdownSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`;
      const fallbackSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

      imageElement.src = showdownSprite;
      imageElement.onerror = () => {
        imageElement.src = fallbackSprite;
      };

      pokemonLeft.innerHTML += `<div class="info-section whole-rank">${createRankHTML(ratings.rank)}</div>`;

      const typesContainer = document.querySelector(".pokemon-types");
      displayPokemonTypes(pokemon.types, typesContainer);

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
      eggMovesContainer.innerHTML = `<div class="egg-moves-separator"></div>`;

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

    const smogonButton = document.getElementById("smogon-button");
    const bulbapediaButton = document.getElementById("bulbapedia-button");

    // Formater le nom selon le site
    const smogonName = pokemon.name_en.toLowerCase().replace(/ /g, "-");
    const bulbapediaName = pokemon.name_en.replace(/ /g, "_");

    smogonButton.onclick = () => {
      window.open(`https://www.smogon.com/dex/sv/pokemon/${smogonName}/`, "_blank");
    };

    bulbapediaButton.onclick = () => {
      window.open(`https://bulbapedia.bulbagarden.net/wiki/${bulbapediaName}_(Pokémon)`, "_blank");
    };
  } catch (error) {
    console.error("Erreur:", error);
  }
}

function createRankHTML(rank) {
  const rankSuffix = (rank) => {
    if (rank === 1) return "st";
    if (rank === 2) return "nd";
    if (rank === 3) return "rd";
    return "th";
  };

  const rankClass = (() => {
    if (rank <= 10) return "rank-top-10";
    if (rank <= 50) return "rank-top-50";
    if (rank <= 100) return "rank-top-100";
    return "rank-beyond-100";
  })();

  return `
    <div class="pokemon-rank ${rankClass}">
      ${rank}<span class="pokemon-rank-exp">${rankSuffix(rank)}</span>
    </div>
  `;
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
  document.getElementById("views-count").textContent = ratings.views;

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
      let value = Math.max(1, Math.round((ratings[type] || 0) * 10) / 10);
      const fill = bar.querySelector(".mini-rating-fill");
      const valueSpan = bar.querySelector(".rating-value");

      const tooltipTrigger = bar.parentElement.querySelector(".tooltip-trigger");
      const descriptionKey = getDescriptionKey(type);

      if (tooltipTrigger && descriptionKey && translations[selectedLanguage].criteriaDescriptions[descriptionKey]) {
        tooltipTrigger.setAttribute("data-tooltip", translations[selectedLanguage].criteriaDescriptions[descriptionKey]);
      }

      fill.style.width = `${value * 10}%`;
      fill.style.borderRadius = value === 10 ? "25px" : "25px 0 0 25px";
      fill.style.backgroundColor = getColorFromScore(value);
      valueSpan.textContent = `${value.toFixed(1) * 10}%`;
    }
  });

  const globalRatingValue = calculateGlobalRating(ratings);
  const globalBar = document.querySelector(".mini-rating-bar:not([data-type])");
  const globalFill = globalBar.querySelector(".mini-rating-fill");
  const globalValue = globalBar.querySelector(".rating-value");
  const roundedGlobalRating = Math.max(1, Math.round(globalRatingValue * 10) / 10);

  globalFill.style.width = `${roundedGlobalRating * 10}%`;
  globalFill.style.borderRadius = roundedGlobalRating === 10 ? "25px" : "25px 0 0 25px";
  globalFill.style.backgroundColor = getColorFromScore(roundedGlobalRating);
  globalValue.textContent = `${roundedGlobalRating.toFixed(1)}`;
}

function calculateGlobalRating(ratings) {
  const values = [ratings.power, ratings.cost, ratings.egg_moves, ratings.ability, ratings.out_of_the_box];
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function getColorFromScore(score) {
  const startColor = { r: 196, g: 125, b: 59 }; //rgb(196, 125, 59)
  const endColor = { r: 52, g: 163, b: 111 }; //rgb(52, 163, 111)

  const ratio = Math.max(0, Math.min(score / 10, 1));

  const r = Math.round(startColor.r + (endColor.r - startColor.r) * ratio);
  const g = Math.round(startColor.g + (endColor.g - startColor.g) * ratio);
  const b = Math.round(startColor.b + (endColor.b - startColor.b) * ratio);

  return `rgb(${r}, ${g}, ${b})`;
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

  pokemons.slice(0, 10).forEach((pokemon, index) => {
    const item = document.createElement("div");
    item.className = "top-rated-item";
    item.onclick = () => {
      window.location.href = `?pokemon=${pokemon.id}`;
    };

    const spriteUrl = getPokemonSprite(pokemon.id);

    const rankClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "rank-default";

    getPokemonSprite(pokemon.id, (spriteUrl) => {
      item.innerHTML = `
        <div class="rank-badge ${rankClass}">${index + 1}</div>
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

  pokemons.slice(0, 10).forEach((pokemon, index) => {
    const item = document.createElement("div");
    item.className = "worst-rated-item";
    item.onclick = () => {
      window.location.href = `?pokemon=${pokemon.id}`;
    };

    const spriteUrl = getPokemonSprite(pokemon.id);

    const rankClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "rank-default";

    getPokemonSprite(pokemon.id, (spriteUrl) => {
      item.innerHTML = `
        <div class="rank-badge ${rankClass}">${index + 1}</div>
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

  bothButton.classList.add("active");

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

function displayPokemonTypes(types, container) {
  container.innerHTML = "";
  types.forEach((type) => {
    const typeSpan = document.createElement("span");
    typeSpan.className = `type ${type}`;

    const typeIcon = document.createElement("img");
    typeIcon.src = `images/types/${type}.png`;
    typeIcon.alt = `${type} icon`;

    typeSpan.appendChild(typeIcon);
    typeSpan.appendChild(document.createTextNode(type));
    container.appendChild(typeSpan);
  });
}
