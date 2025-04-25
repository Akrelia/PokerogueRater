  let selectedLanguage = localStorage.getItem("selectedLanguage") || "en";

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

const translationCallbacks = [];

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await waitForComponentsToLoad();
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

async function waitForComponentsToLoad() {
  const navigationMenu = document.querySelector("navigation-menu");
  const footerSection = document.querySelector("footer-section");

  if (navigationMenu && footerSection) {
    await customElements.whenDefined("navigation-menu");
    await customElements.whenDefined("footer-section");

    // Wait for the inner HTML of the components to be loaded
    await new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (navigationMenu.innerHTML && footerSection.innerHTML) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(navigationMenu, { childList: true });
      observer.observe(footerSection, { childList: true });
    });
  }
}
