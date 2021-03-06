/** TODO: Set this to our own Registry for base requests */
const REGISTRY_URL = "https://cerulean-difficult-mouse.glitch.me";

if (!("currentScript" in document)) {
  const currentScriptPolyfillTag = document.createElement("script");
  currentScriptPolyfillTag.src = `${REGISTRY_URL}/currentScript.polyfill.js`;
  document.head.appendChild(currentScriptPolyfillTag);
}

const appsRegistry = {};

class Loader extends HTMLElement {
  static get observedAttributes() {
    return ["name", "config", "onload"];
  }

  constructor() {
    super();
    this.mounted = false;
  }

  connectedCallback() {
    this.appName = this.getAttribute("name");
    this.config = JSON.parse(this.getAttribute("config") || "{}");
    this.init();
    this.mounted = true;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (!this.mounted) {
      return;
    }

    this.appName = this.getAttribute("name");
    this.config = JSON.parse(this.getAttribute("config") || "{}");
    this.init();
  }

  init() {
    if (!this.appName) {
      console.error(
        new Error('Attribute "name" is missing. Unable to load application')
      );
      return;
    }

    return this.fetchApp()
      .then(cb => this.renderApp(cb))
      .catch(err => {
        console.error(err);
      });
  }

  loadAppCode({ key }) {
    if (!appsRegistry[key]) {
      appsRegistry[key] = new Promise(resolve => {
        this.generateEntryTag({
          baseUrl: REGISTRY_URL,
          entry: `${this.appName}.js`,
          resolve
        });
      });
    }

    return appsRegistry[key];
  }

  generateEntryTag({ baseUrl, entry, resolve }) {
    let entryTag;
    if (entry.endsWith(".js")) {
      entryTag = document.createElement("script");
      entryTag.src = `${baseUrl}/${entry}`;
    } else {
      entryTag = document.createElement("link");
      entryTag.href = `${baseUrl}/${entry}`;
      entryTag.rel = "stylesheet";
      entryTag.type = "text/css";
    }
    entryTag.loadFragment = resolve;
    document.head.appendChild(entryTag);
  }

  loadAppUsingManifest({ key, url }) {
    const baseUrl = url.replace("/asset-manifest.json", "");

    if (!appsRegistry[url]) {
      appsRegistry[url] = new Promise(resolve => {
        fetch(url)
          .then(res => res.json())
          .then(manifest => {
            manifest.entrypoints
              .filter(entry => entry.endsWith(".js") || entry.endsWith(".css"))
              .forEach(entry =>
                this.generateEntryTag({ baseUrl, entry, resolve })
              );
          });
      });
    }
    return appsRegistry[url];
  }

  fetchApp() {
    if (this.config.resolveFrom) {
      return this.loadAppUsingManifest({
        key: this.appName,
        url: this.config.resolveFrom
      });
    }

    return this.loadAppCode({ key: this.appName });
  }

  renderApp(render) {
    render(this, this.config);
  }
}

customElements.define("app-composer", Loader);

/*
<AppComposer name="my-data" config={...} />

===> React.memo(({ name, config}) => {
  <app-composer name={name} config={config}></app-composer>
}, () => true);
*/
