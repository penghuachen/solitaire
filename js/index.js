const UIStates = {
  opening: true
};

(function() {
  mainRenderProccess();
  setTimeout(hideOpening, 3000)
})();

function hideOpening() {
  UIStates.opening = false;
  mainRenderProccess();
}

function openingDOM() {
  const dom = `
    <div class="opening">
      <div class="opening-logo">
        <img src="./images/logo.svg" alt="logo">
      </div>
    </div>
  `;

  return UIStates.opening ? dom : "";
}

function mainRenderProccess() {
  const opening = openingDOM();
  const mainDOM = opening + `<h1>sss</h1>`

  document.body.innerHTML = mainDOM;
}