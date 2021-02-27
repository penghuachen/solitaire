import { formateTime } from "./utils.js";

const initData = {}; //初始區牌組資料
const cardData = getInitCardsData(); // 初始化卡牌資料
let recordCardsOrder = [];
let timeRecords = 0;
let moves = 0;

const areas = document.querySelectorAll(".area");
const undo = document.querySelector(".undo");
const activeUndo = document.querySelector(".undo-active");
const cardLines = document.querySelectorAll(".card-line");
const sideBarNewGameBtn = document.querySelector(".sidebar .new-game");
const newGameBtn = document.querySelector(".game-over .new-game");
const newGamePopup = document.querySelector(".game-operation-popup.new-game");
const sideBarRestartGameBtn = document.querySelector(".sidebar .restart-game");
const restartGamePopup = document.querySelector(".game-operation-popup.restart-game");

initGame();

function initializeEvents() {  
  activeUndo.addEventListener("click", undoPreviousStep);

  areas.forEach(area => {
    area.addEventListener("dragover", dragOver);
    area.addEventListener("drop", dropCardInGameArea);
  })

  newGamePopup.addEventListener("click", startNewGame);
  sideBarNewGameBtn.addEventListener("click", () => { 
    newGamePopup.style = "pointer-events: auto";
    newGamePopup.style.opacity = 1;
  });
  newGameBtn.addEventListener("click", startNewGame);

  sideBarRestartGameBtn.addEventListener("click", () => { 
    restartGamePopup.style = "pointer-events: auto";
    restartGamePopup.style.opacity = 1;
  });

  restartGamePopup.addEventListener("click", restartNewGame);
}

function initGame() {
  setTimeout(hideOpening, 5000);
  initializeEvents();
  distributeCards();
}

function getInitCardsData() {
  const typesOfCard = ['club', 'diamond', 'heart', 'spade'];
  const dataObj = {
    type: "",
    value: 0,
    initCol: null,
  };
  const cardsData = typesOfCard.flatMap(type => {
    return [ ...new Array(14).keys() ]
      .filter(num => num > 0)
      .map(num => ({ ...dataObj, type, value: num }));
    })
    .map((card, index) => {
      card.id = index + 1;
      return card;
    });

  return cardsData;
}

function hideOpening() {
  document.querySelector(".opening").style = "display: none";
  setInterval(gameTimer, 1000);
}

function distributeCards() { 
  const randomCardsData = getRandomCardsData(cardData, []);
  const amountsOfEachLine = [7, 7, 7, 7, 6, 6, 6, 6];

  let startIndex = 0, endIndex = 0;
  amountsOfEachLine.forEach((amount, index) => {
    endIndex = startIndex + amount;
    initData[index] = randomCardsData.slice(startIndex, endIndex);
    initData[index] = initData[index].map(card => {
      card.initCol = index + 1;
      return card;
    }) 
    startIndex += amount;
  });

  renderInitView();
} 

function startDragCards(e) { 
  const currentTarget = e.currentTarget;
  const cardsInCardLine = [ ...currentTarget.parentNode.querySelectorAll(".card") ];
  const draggingElementIndex = cardsInCardLine.findIndex(card => card === currentTarget);
  if (cardsInCardLine.length === draggingElementIndex + 1) {
    e.dataTransfer.setData("text/plain", currentTarget.id);
  }
}

function dragOver(e) {
  e.preventDefault();
  // console.log('dragover');
}

function getRandomCardsData(cards, arr) {
  let randomData = {};

  if (arr.length === 52) {
    return arr;
  } else {
    randomData = cards[ Math.floor(Math.random() * cards.length) ];
    let isExist = arr.find(data => data.id === randomData.id);
    !isExist && arr.push(randomData);

    return getRandomCardsData(cards, arr);
  }
}

function initCardsDOMGenerator() {
  const obj = {};
  Object.keys(initData).forEach(key => {
    obj[key] = initData[key].map((data, index) => {
      return `
        <div 
          id="${ data.id }" 
          draggle="true"
          class="card" 
          data-area="init"
          data-type="${ data.type }"
          data-value="${ data.value }"
          data-col="${ data.initCol }" 
        >
          <img 
            src="./images/cards/${ data.type }-${ data.value }.svg" 
            alt="card">
        </div>
      `;
    })
  });
  return obj;
}

function renderInitView() {
  const initCardsDOM = initCardsDOMGenerator();
  cardLines.forEach((cardLine, index) => {
    cardLine.innerHTML = initCardsDOM[index].join("");
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach(element => {
    element.addEventListener('dragstart', startDragCards)
  });
}

// new game
function startNewGame(e) {
  if (e.target.className === "new-game-btn") {
    alert("開啟新局！！")
    distributeCards();
    resetGameTimer();
    resetGameAreas();
    resetMoves();
    initCardMoveRecords();
  } 
  newGamePopup.style.opacity = 0;
  newGamePopup.style = "pointer-events: none";
}

// restart game
function restartNewGame(e) {
  if (e.target.className === "restart-game-btn") {
    alert("重啟該局！！")
    renderInitView();
    resetGameTimer();
    resetGameAreas();
    resetMoves();
    initCardMoveRecords();
  } 
  restartGamePopup.style.opacity = 0;
  restartGamePopup.style = "pointer-events: none";
}

function resetGameAreas() {
  areas.forEach(area => {
    area.innerHTML = "";
  })
}

// timer
function gameTimer() {
  const time = document.querySelector(".time span");
  timeRecords += 1;
  time.innerHTML = formateTime(timeRecords);
}

function resetGameTimer() {
  timeRecords = 0;
  gameTimer();
}

function dropCardInGameArea(e) {
  e.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  const droppingElement = document.getElementById(data);
  const dropedAreaElement = [...areas].find(el => el == event.currentTarget);

  const currentTarget = e.currentTarget;
  const target = e.target;

  if (isPutsCardInTemporaryAreaAgain(currentTarget, target)) return;
  if (isPutsCardInFinishedAreaAgain(currentTarget, target, droppingElement)) return;
  if (isFirstCardInFinshedIsEqualToOne(currentTarget, target, droppingElement)) return; 

  // console.log('drop');
  pushCardMoveRecords(droppingElement);
  calculateMoves();
  checkFinishedAndShowRecord();
  dropedAreaElement.appendChild(droppingElement);
  event.dataTransfer.clearData();
}


function isPutsCardInTemporaryAreaAgain(currentTarget, target) { 
  if (currentTarget.className === "temporary-area area" && target.className !== "temporary-area area") {
    event.dataTransfer.clearData();
    return true;
  } else {
    return false;
  }
}

function isPutsCardInFinishedAreaAgain(currentTarget, target, droppingElement) { 
  // when puts card in finished area again
  if (currentTarget.className === "finished-area area" && target.className !== "finished-area area") {
    const finishedAreaCards = currentTarget.querySelectorAll(".finished-area .card");
    const isMatched = [...finishedAreaCards].some(card => {
      return (
        card.dataset.type === droppingElement.dataset.type && 
        +card.dataset.value === droppingElement.dataset.value - 1
      );
    });
    event.dataTransfer.clearData();
    if (!isMatched) return true;
  } else {
    return false;
  }
}

function isFirstCardInFinshedIsEqualToOne(currentTarget, target, droppingElement) {
  if (
    currentTarget.className === "finished-area area" && 
    target.className === "finished-area area" &&
    +droppingElement.dataset.value !== 1
  ) {
    event.dataTransfer.clearData();
    return true;
  } else {
    return false;
  }
}

function pushCardMoveRecords(droppingElement) {
  recordCardsOrder.push(droppingElement);
  updateUndoIconVisible();
}

function updateUndoIconVisible() {
  if (recordCardsOrder.length) {
    activeUndo.style.display = "inline";
    undo.style.display = "none";
  } else {
    activeUndo.style.display = "none";
    undo.style.display = "inline";
  }
}

function initCardMoveRecords() {
  recordCardsOrder = [];
  updateUndoIconVisible();
}

function undoPreviousStep(e) {
  const lastRecord = recordCardsOrder[recordCardsOrder.length - 1];
  recordCardsOrder.pop();
  updateUndoIconVisible();
  areas.forEach(area => {
    // reomve card dom from finished or temporary area
    const findElementInGameArea = [...area.querySelectorAll(".card")].find(el => el === lastRecord);
    if (findElementInGameArea) {
      area.removeChild(findElementInGameArea);
    }
  })
  // insert card in previous area
  const previousCol = lastRecord.dataset.col;
  [...cardLines][previousCol - 1].appendChild(lastRecord);
}


function calculateMoves() {
  const move = document.querySelector(".moves span");
  moves += 1;
  move.innerHTML = moves;
}
function resetMoves() {
  const move = document.querySelector(".moves span");
  moves = 0;
  move.innerHTML = moves;
}

function checkFinishedAndShowRecord() {
  const finalGoal = 52;
  const finishedAreas = document.querySelectorAll(".finished-area")
  const total = [...finishedAreas].reduce((acc, area) => {
    const len = area.querySelectorAll(".card").length
    acc += len;
    return acc;
  }, 0);

  if (total === finalGoal) {
    const gameOverArea = document.querySelector(".game-over");
    gameOverArea.style.display = "block";
    cardLines.forEach(cardLine => cardLine.style.display = "none");
    const finishedMoves = document.querySelector(".records .moves span");
    finishedMoves.innerHTML = moves;
    const finishedTime = document.querySelector(".records .time span");
    const lastTime = timeRecords;
    finishedTime.innerHTML = formateTime(lastTime);
  }
}
