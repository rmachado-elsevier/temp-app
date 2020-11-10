/**
 * This is meant to be hosted in another URL
 * Then the URL in the line 4 of the `loadFragment.js`
 * should be changed.
 */
function render(domElement, config) {
  domElement.textContent = `Hello ${config.name || "World"}`;
}
