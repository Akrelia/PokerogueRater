class NavigationMenu extends HTMLElement {
  async connectedCallback() {
    const response = await fetch("./Components/NavigationMenu.html");
    this.innerHTML = await response.text();

    translationCallbacks.push(updateMenuText);
    loadSavedLanguage();
    updateMenuText();

    await setupEventListeners();
  }
}

class FooterSection extends HTMLElement {
  async connectedCallback() {
    const response = await fetch("./Components/FooterSection.html");
    this.innerHTML = await response.text();

    translationCallbacks.push(updateFooterText);
  }
}

class MetaComponent extends HTMLElement {
  async connectedCallback() {
    const response = await fetch("./Components/MetaComponent.html");
    this.innerHTML = await response.text();
  }
}

customElements.define("meta-component", MetaComponent);
customElements.define("navigation-menu", NavigationMenu);
customElements.define("footer-section", FooterSection);
