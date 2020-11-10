function render(domElement, config) {
    fetch("https://cerulean-difficult-mouse.glitch.me/build/asset-manifest.json")
      .then(res => res.json())
      .then(manifest =>
        manifest.entrypoints
          .filter(entry => entry.endsWith(".js"))
          .map(
            entry => `https://cerulean-difficult-mouse.glitch.me/build/${entry}`
          )
      )
      .then(listOfEntrypoints => {
        console.log('listOfEntrypoints', listOfEntrypoints);
        return Promise.all(listOfEntrypoints.map(entry => fetch(entry).then(res => res.text())))
      })
      .then(contentOfEntrypoints =>
        contentOfEntrypoints.reduce(
          (output, content) => `${output}\n${content}`,
          ""
        )
      )
      .then(code => {
        const reactApp = Function(`
          "use strict";
          ${code}
          return render;
        `)();
  
        reactApp(domElement, config);
      });
  }
  