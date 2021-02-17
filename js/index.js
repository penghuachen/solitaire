const cardData = getInitCardsData(); // 初始化卡牌資料
const temporaryData = setInitAreaData(); // 暫存區牌組資料
const finishedData = setInitAreaData(); // 完成區牌組資料
const initData = {}; //初始區牌組資料

initGame();
function initGame() {
  setTimeout(hideOpening, 500);
  const timer = setInterval(gameTimer, 1000);
  distributeCards();
}

function setInitAreaData() {
  const place = 4;
  const obj = {};

  for (let i = 1; i <= place; i++) {
    obj[i] = [];
  }

  return obj;
}

function test(e) {console.log(e);  }

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

  renderView();
} 

function initCardsDOMGenerator() {
  const obj = {};
  Object.keys(initData).forEach(key => {
    obj[key] = initData[key].map((data, index) => {
      return `
        <div 
          class="card" 
          data-area="init"
          data-col="${ data.initCol }" 
          ${ index === (initData[key].length - 1) ? 'draggle="true"' : "" }
        >
          <img src="./images/cards/${ data.type }-${ data.value }.svg" alt="card">
        </div>
      `;
    })
  });
  return obj;
}

// render 
function renderView() {
  const cardLines = document.querySelectorAll(".card-line");
  const initCardsDOM = initCardsDOMGenerator();
  cardLines.forEach((cardLine, index) => {
    cardLine.innerHTML = initCardsDOM[index].join(",");
  });

  const cards = document.querySelectorAll('.card:last-child');
  cards.forEach(element => {
    element.addEventListener('dragstart', test)
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
  } 
  newGamePopup.style.opacity = 0;
  newGamePopup.style = "pointer-events: none";
}

// timer
let records = 0;
function gameTimer() {
  const time = document.querySelector(".time span");
  records += 1;
  let seconds = records % 60;
  let minutes = Math.floor(records / 60);
  
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const currentRecord = minutes + ":" + seconds;
  time.innerHTML = currentRecord;
}

function resetGameTimer() {
  records = 0;
  gameTimer();
}