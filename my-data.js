document.currentScript.loadFragment(function render(domElement, config) {
  const onFinishedLoading = () => window.renderMyData(domElement, config);

  fetch("http://localhost:5000/asset-manifest.json")
    .then((res) => res.json())
    .then((manifest) => {
      let loadCounter = 0;
      const entrypoints = manifest.entrypoints.filter(
        (entry) => entry.endsWith(".js") || entry.endsWith(".css")
      );
      const onEntryLoad = () => {
        if (++loadCounter === entrypoints.length) onFinishedLoading();
        console.log("loaded", loadCounter);
      };
      entrypoints.forEach((entry) => {
        let entryTag;
        if (entry.endsWith(".js")) {
          entryTag = document.createElement("script");
          entryTag.src = `http://localhost:5000/${entry}`;
        } else {
          entryTag = document.createElement("link");
          entryTag.href = `http://localhost:5000/${entry}`;
          entryTag.rel = "stylesheet";
          entryTag.type = "text/css";
        }
        entryTag.onload = onEntryLoad;

        document.head.appendChild(entryTag);
      });
    });
});
