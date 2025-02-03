const symbols = ["🍎", "🍌", "🍇", "🍓", "🍍", "🍒"];
const cards = [...symbols, ...symbols]; // ペアを作成

const gameBoard = document.getElementById("game-board");
const playerScoreElement = document.getElementById("player-score");
const cpuScoreElement = document.getElementById("cpu-score");
const restartButton = document.getElementById("restart-button");

// 状態管理
let firstCard = null;
let secondCard = null;
let preventClick = false;
let matchedCount = 0;
let playerScore = 0;
let cpuScore = 0;
let isPlayerTurn = true; // プレイヤーのターン管理

// カードをシャッフルする関数
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
shuffle(cards);

// カード生成
function createCards() {
  cards.forEach((symbol) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.symbol = symbol;

    card.addEventListener("click", () => {
      if (preventClick || !isPlayerTurn || card.classList.contains("flipped") || card.classList.contains("matched")) {
        return;
      }

      flipCard(card);

      if (!firstCard) {
        firstCard = card; // 最初のカード
      } else {
        secondCard = card; // 2枚目のカード
        checkMatch();
      }
    });

    gameBoard.appendChild(card);
  });
}

// カードを裏返す
function flipCard(card) {
  card.classList.add("flipped");
  card.textContent = card.dataset.symbol;
}

// カードを裏返す（元に戻す）
function unflipCards(card1, card2) {
  setTimeout(() => {
    card1.classList.remove("flipped");
    card2.classList.remove("flipped");
    card1.textContent = "";
    card2.textContent = "";
  }, 1000);
}

// ペア判定
function checkMatch() {
  if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");

    // スコア加算
    if (isPlayerTurn) {
      playerScore++;
      playerScoreElement.textContent = `プレイヤー: ${playerScore}`;
    } else {
      cpuScore++;
      cpuScoreElement.textContent = `CPU: ${cpuScore}`;
    }

    matchedCount += 1;

    // ゲーム終了判定
    if (matchedCount === cards.length / 2) {
      setTimeout(() => {
        const winner = playerScore > cpuScore ? "プレイヤーの勝ち！" : "CPUの勝ち！";
        alert(`${winner}`);
      }, 500);
    }

    // ペアが揃った場合はターンを維持
    resetTurn(false); // ターンを切り替えない
    if (!isPlayerTurn) {
      setTimeout(cpuTurn, 1000); // CPUがペアを当てたらもう一度カードをめくる
    }
  } else {
    preventClick = true;
    unflipCards(firstCard, secondCard);
    setTimeout(() => {
      resetTurn(true); // ターンを切り替える
    }, 1000);
  }
}

// ターンをリセット
function resetTurn(switchTurn) {
  firstCard = null;
  secondCard = null;
  preventClick = false;

  // ターンを切り替える場合のみフラグを変更
  if (switchTurn) {
    isPlayerTurn = !isPlayerTurn;

    // CPUのターンの場合は自動で動作
    if (!isPlayerTurn) {
      setTimeout(cpuTurn, 1000);
    }
  }
}

// CPUのターン
function cpuTurn() {
  const availableCards = Array.from(document.querySelectorAll(".card:not(.flipped):not(.matched)"));

  if (availableCards.length < 2) return;

  // ランダムで2枚のカードを選ぶ
  const firstChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
  flipCard(firstChoice);

  let secondChoice;
  do {
    secondChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
  } while (secondChoice === firstChoice);

  setTimeout(() => {
    flipCard(secondChoice);
    firstCard = firstChoice;
    secondCard = secondChoice;
    checkMatch();
  }, 1000);
}

// ゲームリセット
function resetGame() {
  gameBoard.innerHTML = "";
  firstCard = null;
  secondCard = null;
  preventClick = false;
  matchedCount = 0;
  playerScore = 0;
  cpuScore = 0;
  isPlayerTurn = true;

  playerScoreElement.textContent = "プレイヤー: 0";
  cpuScoreElement.textContent = "CPU: 0";

  shuffle(cards);
  createCards();
}

// 初期化
createCards();
restartButton.addEventListener("click", resetGame);
