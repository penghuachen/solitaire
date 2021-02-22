const cardData = getInitCardsData(); // 初始化卡牌資料
const initData = {}; //初始區牌組資料
const recordCardsOrder = [];
let timeRecords = 0;
let moves = 0;

const move = document.querySelector(".moves span");
const areas = document.querySelectorAll(".area");

areas.forEach(area => {
  area.addEventListener("dragover", dragOver);
  area.addEventListener("drop", dropCardInGameArea);
})

initGame();
function initGame() {
  setTimeout(hideOpening, 500);
  const timer = setInterval(gameTimer, 1000);
  distributeCards();
}

function dragStart(e) { 
  const currentTarget = e.currentTarget;
  const cardsInCardLine = [ ...currentTarget.parentNode.querySelectorAll(".card") ];
  const draggingElementIndex = cardsInCardLine.findIndex(card => card === currentTarget);
  if (cardsInCardLine.length === draggingElementIndex + 1) {
    e.dataTransfer.setData("text/plain", currentTarget.id);
  }
}

function hideOpening() {
  document.querySelector(".opening").style = "display: none";
}

function getInitCardsData() {
  const typesOfCard = ['club', 'diamond', 'heart', 'spade'];
  const dataObj = {
    type: "",
    value: 0,
    current: "init",
    previous: null,
    order: 0,
    initCol: null,
    finishedCol: null,
    temporaryCol: null
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

// render 
function renderInitView() {
  const cardLines = document.querySelectorAll(".card-line");
  const initCardsDOM = initCardsDOMGenerator();
  cardLines.forEach((cardLine, index) => {
    cardLine.innerHTML = initCardsDOM[index].join("");
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach(element => {
    element.addEventListener('dragstart', dragStart)
  });
}

// new game
const sideBarNewGameBtn = document.querySelector(".sidebar .new-game");
const newGamePopup = document.querySelector(".game-operation-popup.new-game");

sideBarNewGameBtn.addEventListener("click", () => { 
  newGamePopup.style = "pointer-events: auto";
  newGamePopup.style.opacity = 1;
});

newGamePopup.addEventListener("click", startNewGame);
function startNewGame(e) {
  if (e.target.className === "new-game-btn") {
    alert("開啟新局！！")
    distributeCards();
    resetGameTimer();
    resetGameAreas();
  } 
  newGamePopup.style.opacity = 0;
  newGamePopup.style = "pointer-events: none";
}

// restart game
const sideBarRestartGameBtn = document.querySelector(".sidebar .restart-game");
const restartGamePopup = document.querySelector(".game-operation-popup.restart-game");

sideBarRestartGameBtn.addEventListener("click", () => { 
  restartGamePopup.style = "pointer-events: auto";
  restartGamePopup.style.opacity = 1;
});

restartGamePopup.addEventListener("click", restartNewGame);
function restartNewGame(e) {
  if (e.target.className === "restart-game-btn") {
    alert("重啟該局！！")
    renderInitView();
    resetGameTimer();
    resetGameAreas();
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
  let seconds = timeRecords % 60;
  let minutes = Math.floor(timeRecords / 60);
  
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const currentRecord = minutes + ":" + seconds;
  time.innerHTML = currentRecord;
}

function resetGameTimer() {
  timeRecords = 0;
  gameTimer();
}


function dragOver(e) {
  e.preventDefault();
  console.log('dragover');
}

function dropCardInGameArea(e) {
  e.preventDefault();
  const data = event.dataTransfer.getData("text/plain");
  const droppingElement = document.getElementById(data);

  const currentTarget = e.currentTarget;
  const target = e.target;
  // when puts card in temprary area again
  if (currentTarget.className === "temporary-area area" && target.className !== "temporary-area area") {
    event.dataTransfer.clearData();
    return
  }

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
    if (!isMatched) return;
  }

  if (
    currentTarget.className === "finished-area area" && 
    target.className === "finished-area area" &&
    +droppingElement.dataset.value !== 1
  ) {
    event.dataTransfer.clearData();
    return
  }

  // console.log('drop');
  const dropedAreaElement = [...areas].find(el => el == event.currentTarget);
  recordCardsOrder.push(droppingElement);
  moves += 1;
  move.innerHTML = moves;
  dropedAreaElement.appendChild(droppingElement);
  event.dataTransfer.clearData();
}

