const UIStates = {
  opening: true
};

(function() {
  openingDOM();
  setTimeout(hideOpening, 3000)
})();

function hideOpening() {
  UIStates.opening = false;
  openingDOM();
}

function openingDOM() {
  const dom = `
    <div class="opening">
      <div class="opening-logo">
        <img src="./images/logo.svg" alt="logo">
      </div>
    </div>
  `;

  const showOpeningDOM = UIStates.opening ? dom : null;
  document.body.innerHTML = showOpeningDOM;
}