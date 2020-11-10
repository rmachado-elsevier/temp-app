class Loader extends HTMLElement {
  static get observedAttributes() {
    return ["name", "config"];
  }

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const config = this.getAttribute("config") || "{}";
    const appName = this.getAttribute("name");

    this.renderFn = null;
    this.config = JSON.parse(config);

    this.init(appName);
  }

  init(appName) {
    if (!appName) {
      console.error(
        new Error('Attribute "name" is missing. Unable to load application')
      );
      return;
    }

    this.fetchApp(appName)
      .then(appCode => this.createRenderFunction(appCode))
      .then(() => this.renderApp())
      .catch(err => {
        console.error(err);
      });
  }

  fetchApp(appName) {
    return fetch(`https://stellar-cuddly-spleen.glitch.me/${appName}.js`).then(
      res => res.text()
    );
  }

  createRenderFunction(appCode) {
    this.renderFn = Function(`
      "use strict";
      ${appCode};
      return (domElement, config) => render(domElement, config);
    `)();
  }

  renderApp() {
    this.renderFn(this, this.config);
  }
}

customElements.define("app-composer", Loader);