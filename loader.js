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

    this.config = JSON.parse(config);

    if (name === "config") {
      this.renderApp();
    } else {
      this.renderFn = null;
      this.init(appName);
    }
  }

  init(appName) {
    if (!appName) {
      console.error(
        new Error('Attribute "name" is missing. Unable to load application')
      );
      return;
    }

    return this.fetchApp(appName)
      .then(appCode => this.createRenderFunction(appCode))
      .then(() => this.renderApp())
      .catch(err => {
        console.error(err);
      });
  }

  fetchApp(appName) {
    return fetch(
      `https://cerulean-difficult-mouse.glitch.me/${appName}.js`
    ).then(res => res.text());
  }

  createRenderFunction(appCode) {
    this.renderFn = Function(`
      ${appCode};
      return render.bind(this)
    `).call(this, this.config);
  }

  renderApp() {
    console.log(this.renderFn);
    this.renderFn(this, this.config);
  }
}

customElements.define("app-composer", Loader);

/*
<AppComposer name="my-data" config={...} />

===> React.memo(({ name, config}) => {
  <app-composer name={name} config={config}></app-composer>
}, () => true);
*/
