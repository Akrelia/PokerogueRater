function updateMenuText() {
  const t = translations[selectedLanguage];

  const siteName = document.querySelector(".site-name");
  if (siteName) siteName.textContent = t.siteTitle;

  const searchPlaceholder = document.querySelector("#pokemon-search");
  if (searchPlaceholder) searchPlaceholder.placeholder = t.searchPlaceholder;

  const hofButton = document.querySelector("#hall-of-fame span");
  if (hofButton) hofButton.textContent = t.hallOfFame;

  const randomUnratedButton = document.querySelector("#random-unrated-pokemon span");
  if (randomUnratedButton) randomUnratedButton.textContent = t.randomButton;
}

function updateFooterText() {
  const t = translations[selectedLanguage];

   const aboutSection = document.querySelector(".footer-section h3");
   if (aboutSection) aboutSection.textContent = t.about;

   const aboutText = document.querySelector(".footer-section p");
   if (aboutText) aboutText.innerHTML = t.aboutText;

   const footerSections = document.querySelectorAll(".footer-section h3");
   if (footerSections[1]) footerSections[1].textContent = t.links || "Links";

   const contactLink = document.querySelector(".footer-section a");
   if (contactLink) contactLink.textContent = t.footer?.contact || "Contact";
}

function updateRatingText() {
  const t = translations[selectedLanguage];

  loadPokemon(POKEMON_ID);

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

  const classicModeButton = document.querySelector("#classic-mode");
  if (classicModeButton) classicModeButton.innerHTML = `<img src="images/classic-mode.png" alt="Classic" class="mode-icon" /> ${t.modeButtons.classic}`;

  const bothModeButton = document.querySelector("#both-mode");
  if (bothModeButton) bothModeButton.textContent = t.modeButtons.both;

  const endlessModeButton = document.querySelector("#endless-mode");
  if (endlessModeButton) endlessModeButton.innerHTML = `${t.modeButtons.endless} <img src="images/infinity-mode.png" alt="Endless" class="mode-icon" />`;

  const sliderLabels = document.querySelectorAll(".slider-labels span");
  if (sliderLabels[0]) sliderLabels[0].innerHTML = `<img src="images/classic-mode.png" alt="Classic" class="slider-icon" /> ${t.sliderLabels.classic}`;
  if (sliderLabels[1]) sliderLabels[1].innerHTML = `${t.sliderLabels.endless} <img src="images/infinity-mode.png" alt="Endless" class="slider-icon" />`;
}

const translations = {
  en: {
    siteTitle: "Rate My Starter",
    searchPlaceholder: "Search for a Starter...",
    randomButton: "Random",
    randomUnratedButton: "Random Unrated",
    welcomeTitle: "Welcome to Rate My Starter!",
    welcomeText: "This tool is designed to help the PokéRogue community rate and evaluate different Pokémon available.",
    welcomeGoal: "Our goal is to build a database of ratings that can help players to choose their starter Pokémon.",
    votesText: "Over {0} votes already!",
    criteria: {
      overall: "Overall",
      pokemon: "Pokémon",
      cost: "Cost",
      eggMoves: "Egg Moves",
      passive: "Passive",
      outOfTheBox: "Out of the box",
    },
    labels: {
      passive: "Passive",
      cost: "Cost",
      eggMoves: "Egg Moves",
    },
    rateButton: "Rate",
    noRatingYet: "No rating yet",
    voteCount: "Votes: {0}",
    votes: "Votes",
    topTitle: "Top 10",
    worstTitle: "Worst 10",
    about: "About",
    aboutText: "Rate My Starter is a tool for rating different starters in PokéRogue. This tool is not affiliated with PokéRogue.",
    contact: "Contact",
    credits: "Credits",
    createdBy: "Created by Akima",
    rateThisPokemon: "Rate this Pokémon !",
    hallOfFame: "Hall of Fame",
    criteriaDescriptions: {
      base: "How the Pokémon and its evolution are good, including base stats, abilities, and typing.",
      cost: "Cost-effectiveness of the Pokémon and if it can carry over the end-game.",
      eggMoves: "How valuable the egg moves are for the Pokémon's overall effectiveness.",
      passive: "How impactful and game-changing the Pokémon's passive is and possible combo with abilities.",
      outOfTheBox: "How viable the Pokémon is without requiring TMs, items, or evolution.",
    },
    bestGameMode: "Best mode for the Pokémon, if you don't know, just press 'Both'",
    modeButtons: {
      classic: "Classic",
      both: "Both",
      endless: "Endless",
    },
    sliderLabels: {
      classic: "Classic",
      endless: "Endless",
    },
    rawNote: "Raw Note",
  },
  fr: {
    rawNote: "Note brute",
    siteTitle: "Rate My Starter",
    searchPlaceholder: "Rechercher un Starter...",
    randomButton: "Aléatoire",
    randomUnratedButton: "Non Noté",
    welcomeTitle: "Bienvenue sur Rate My Starter !",
    welcomeText: "Cet outil est conçu pour aider la communauté PokéRogue à évaluer les différents starters Pokémon disponibles.",
    welcomeGoal: "Notre objectif est de créer une base de données d'évaluations pour aider les joueurs à choisir leur Pokémon de départ.",
    votesText: "Déjà plus de {0} votes !",
    criteria: {
      overall: "Global",
      pokemon: "Pokémon",
      cost: "Coût",
      eggMoves: "Capacités Œuf",
      passive: "Passif",
      outOfTheBox: "Prêt à l'emploi",
    },
    labels: {
      passive: "Passif",
      cost: "Coût",
      eggMoves: "Capacités Œuf",
    },
    rateButton: "Noter",
    noRatingYet: "Pas encore d'évaluation",
    voteCount: "Votes : {0}",
    votes: "Votes",
    topTitle: "Top 10",
    worstTitle: "Flop 10",
    about: "À propos",
    aboutText: "Rate My Starter est un outil d'évaluation des starters de PokéRogue. Cet outil n'est pas affilié à PokéRogue.",
    contact: "Contact",
    credits: "Crédits",
    createdBy: "Créé par Akima",
    rateThisPokemon: "Évaluez ce Pokémon !",
    hallOfFame: "Panthéon",
    criteriaDescriptions: {
      base: "Qualité globale du Pokémon et de ses évolutions, incluant stats, capacités et types.",
      cost: "Rapport qualité/prix du Pokémon mais aussi s'il peut tenir tout le run.",
      eggMoves: "Impact des capacités œufs sur l'efficacité globale du Pokémon.",
      passive: "Impact du passif du Pokémon sur son efficacité et sa complémentarité avec les talents.",
      outOfTheBox: "Viabilité du Pokémon sans nécessiter de CT, d'objets ou attendre son évolution.",
    },
    bestGameMode: "Meilleur mode pour le Pokémon, si vous ne savez pas, appuyez simplement sur 'Tous'",
    modeButtons: {
      classic: "Classique",
      both: "Tous",
      endless: "Infini",
    },
    sliderLabels: {
      classic: "Classique",
      endless: "Infini",
    },
  },
  de: {
    rawNote: "Rohnote",
    siteTitle: "Rate My Starter",
    searchPlaceholder: "Suche nach einem Starter...",
    randomButton: "Zufällig",
    randomUnratedButton: "Unbewertet",
    welcomeTitle: "Willkommen bei Rate My Starter!",
    welcomeText: "Dieses Tool wurde entwickelt, um der PokéRogue-Community bei der Bewertung verschiedener verfügbarer Pokémon zu helfen.",
    welcomeGoal: "Unser Ziel ist es, eine Bewertungsdatenbank aufzubauen, die Spielern bei der Wahl ihres Start-Pokémon hilft.",
    votesText: "Bereits über {0} Bewertungen!",
    criteria: {
      overall: "Gesamt",
      pokemon: "Pokémon",
      cost: "Kosten",
      eggMoves: "Ei-Attacken",
      passive: "Fähigkeit",
      outOfTheBox: "Sofort einsetzbar",
    },
    labels: {
      passive: "Fähigkeit",
      cost: "Kosten",
      eggMoves: "Ei-Attacken",
    },
    noDescription: "Keine Beschreibung verfügbar",
    rateButton: "Bewerten",
    noRatingYet: "Noch keine Bewertung",
    voteCount: "Stimmen: {0}",
    votes: "Stimmen",
    topTitle: "Top 10",
    worstTitle: "Schlechteste 10",
    about: "Über uns",
    aboutText: "Rate My Starter ist ein Tool zur Bewertung verschiedener Starter in PokéRogue. Dieses Tool ist nicht mit PokéRogue verbunden.",
    contact: "Kontakt",
    credits: "Credits",
    createdBy: "Erstellt von Akima",
    rateThisPokemon: "Bewerte dieses Pokémon!",
    hallOfFame: "Ruhmeshalle",
    criteriaDescriptions: {
      base: "Wie gut das Pokémon und seine Entwicklung sind, einschließlich Basiswerte, Fähigkeiten und Typen.",
      cost: "Kosten-Nutzen-Verhältnis des Pokémon.",
      eggMoves: "Wie wertvoll die Ei-Attacken für die Gesamteffektivität des Pokémon sind.",
      passive: "Wie einflussreich und spielverändernd die passive Fähigkeit des Pokémon ist.",
      outOfTheBox: "Wie brauchbar das Pokémon ohne TMs, Items oder Entwicklung ist.",
    },
    bestGameMode: "Bester Modus für das Pokémon, wenn Sie es nicht wissen, drücken Sie einfach 'Beide'",
    modeButtons: {
      classic: "Klassisch",
      both: "Beide",
      endless: "Endlos",
    },
    sliderLabels: {
      classic: "Klassisch",
      endless: "Endlos",
    },
    links: "Links",
    footer: {
      contact: "Kontakt",
      allRightsReserved: "Alle Rechte vorbehalten",
    },
  },
  ja: {
    rawNote: "生の評価",
    siteTitle: "Rate My Starter",
    searchPlaceholder: "スターターを検索...",
    randomButton: "ランダム",
    randomUnratedButton: "未評価",
    welcomeTitle: "レートマイスターターへようこそ！",
    welcomeText: "このツールは、PokéRogueコミュニティが様々なポケモンを評価するためのものです。",
    welcomeGoal: "プレイヤーがスターターポケモンを選ぶ際の参考となる評価データベースの構築を目指しています。",
    votesText: "すでに{0}件の評価！",
    criteria: {
      overall: "総合",
      pokemon: "ポケモン",
      cost: "コスト",
      eggMoves: "タマゴわざ",
      passive: "特性",
      outOfTheBox: "即戦力",
    },
    labels: {
      passive: "特性",
      cost: "コスト",
      eggMoves: "タマゴわざ",
    },
    noDescription: "説明なし",
    rateButton: "評価する",
    noRatingYet: "まだ評価がありません",
    voteCount: "投票数：{0}",
    votes: "投票数",
    topTitle: "トップ10",
    worstTitle: "ワースト10",
    about: "概要",
    aboutText: "レートマイスターターは、PokéRogueのスターターを評価するためのツールです。PokéRogueとは無関係です。",
    contact: "お問い合わせ",
    credits: "クレジット",
    createdBy: "作者：Akima",
    rateThisPokemon: "このポケモンを評価！",
    hallOfFame: "殿堂入り",
    criteriaDescriptions: {
      base: "ポケモンとその進化の基礎能力、特性、タイプなどの総合的な強さ。",
      cost: "ポケモンのコストパフォーマンス。",
      eggMoves: "ポケモンの総合的な性能におけるタマゴ技の価値。",
      passive: "ポケモンの特性がゲームに与える影響力。",
      outOfTheBox: "技マシンやアイテム、進化なしでの実用性。",
    },
    bestGameMode: "ポケモンに最適なモード、わからない場合は「両方」を押してください",
    modeButtons: {
      classic: "クラシック",
      both: "両方",
      endless: "無限",
    },
    sliderLabels: {
      classic: "クラシック",
      endless: "無限",
    },
    links: "リンク",
    footer: {
      contact: "お問い合わせ",
      allRightsReserved: "All rights reserved",
    },
  },
};
