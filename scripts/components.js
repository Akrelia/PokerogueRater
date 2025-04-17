class NavigationMenu extends HTMLElement {
  async connectedCallback() {
    const response = await fetch("./Components/NavigationMenu.html");
    this.innerHTML = await response.text();
  }
}

class FooterSection extends HTMLElement {
  async connectedCallback() {
    const response = await fetch("./Components/FooterSection.html");
    this.innerHTML = await response.text();
  }
}

customElements.define("navigation-menu", NavigationMenu);
customElements.define("footer-section", FooterSection);
