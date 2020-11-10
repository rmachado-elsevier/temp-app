class Loader extends HTMLElement {
  static get observedAttributes() {
    return ["name", "config", "onload"];
  }

  constructor() {
    super();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const appName = this.getAttribute("name");
    const config = this.getAttribute("config") || "{}";
    const config = this.getAttribute("onload") || (() => {});

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
    return fetch(`https://cerulean-difficult-mouse.glitch.me/${appName}.js`).then(
      res => res.text()
    );
  }

  createRenderFunction(appCode) {
    this.renderFn = Function(`
      "use strict";
      ${appCode};
      if (render) {
        return render.bind(this)
      }
      return () => ${this.onload}
    `).call(this);
  }

  renderApp() {
    this.renderFn(this, this.config);
  }
}

customElements.define("app-composer", Loader);