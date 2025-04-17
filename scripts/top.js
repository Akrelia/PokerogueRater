document.addEventListener("DOMContentLoaded", async () => {
  const mainContent = document.getElementById("top-100");

  mainContent.style.display = "block";

  try {
    const response = await fetch(API_URLS.GET_TOP_RATED + "?limit=100");
    const data = await response.json();

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

      mainContent.appendChild(listItem);
    });
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
});
