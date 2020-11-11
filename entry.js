function render(domElement, config) {
  const onFinishedLoading = () => window.renderTempApp(domElement, config);

  fetch("https://cerulean-difficult-mouse.glitch.me/build/asset-manifest.json")
    .then(res => res.json())
    .then(manifest => {
      let loadCounter = 0;
      const entrypoints = manifest.entrypoints.filter(
        entry => entry.endsWith(".js") || entry.endsWith(".css")
      );
      const onEntryLoad = () => {
        if (++loadCounter === entrypoints.length) onFinishedLoading();
        console.log('loaded', loadCounter);
      };
      entrypoints.forEach(entry => {
        let entryTag;
        if (entry.endsWith(".js")) {
          entryTag = document.createElement("script");
          entryTag.src = `https://cerulean-difficult-mouse.glitch.me/build/${entry}`;
        } else {
          entryTag = document.createElement("link");
          entryTag.href = `https://cerulean-difficult-mouse.glitch.me/build/${entry}`;
          entryTag.rel = "stylesheet";
          entryTag.type = "text/css";
        }
        entryTag.onload = onEntryLoad;

        document.head.appendChild(entryTag);
      });
    });
}
