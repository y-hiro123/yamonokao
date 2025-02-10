document.addEventListener("DOMContentLoaded", async () => {
  const gameBoard = document.getElementById("game-board");
  const playerScoreElement = document.getElementById("player-score");
  const cpuScoreElement = document.getElementById("cpu-score");
  const restartButton = document.getElementById("restart-button");

  let images = await loadImages();
  const cards = [...images, ...images]; // 画像を2枚ずつ用意

  let firstCard = null;
  let secondCard = null;
  let preventClick = false;
  let matchedCount = 0;
  let playerScore = 0;
  let cpuScore = 0;
  let isPlayerTurn = true;
  let cpuMemory = {}; // CPU の記憶用
  let imgDisplay = null; // ゲットした画像を保持する変数
  let playerItems = []; // プレイヤーがゲットした画像のリスト

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  async function loadImages() {
    return [
      "img/IMG_4146.jpg",
      "img/IMG_4147.JPG",
      "img/IMG_4148.JPG",
      "img/IMG_4149.JPG",
      "img/IMG_4150.JPG",
      "img/IMG_4151.JPG"
    ];
  }

  function createCards() {
    gameBoard.innerHTML = "";
    shuffle(cards);
    cards.forEach((symbol) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.symbol = symbol; // 画像のパスをデータ属性にセット

      const frontFace = document.createElement("div");
      frontFace.classList.add("front");

      const backFace = document.createElement("div");
      backFace.classList.add("back");

      const img = document.createElement("img");
      img.src = symbol;
      img.style.width = "120px";
      img.style.height = "120px";
      img.style.objectFit = "cover";
      backFace.appendChild(img);

      card.appendChild(frontFace);
      card.appendChild(backFace);

      card.addEventListener("click", () => {
        if (preventClick || !isPlayerTurn || card.classList.contains("flipped") || card.classList.contains("matched")) {
          return;
        }

        flipCard(card);
        rememberCard(card);

        if (!firstCard) {
          firstCard = card;
        } else {
          secondCard = card;
          preventClick = true;
          checkMatch();
        }
      });

      gameBoard.appendChild(card);
    });
  }

  function flipCard(card) {
    card.classList.add("flipped");
  }

  function unflipCards(card1, card2) {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      preventClick = false;
    }, 1000);
  }

  function rememberCard(card) {
    const symbol = card.dataset.symbol;
    if (!cpuMemory[symbol]) {
      cpuMemory[symbol] = [];
    }
    if (cpuMemory[symbol].length < 2) {
      cpuMemory[symbol].push(card);
    }
  }

  function checkMatch() {
    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {
      firstCard.classList.add("matched");
      secondCard.classList.add("matched");

      setTimeout(() => {
        matchedCount += 1;

        if (matchedCount === cards.length / 2) {
          setTimeout(() => {
            if (playerScore > cpuScore) {
              playerWin();
            }
          }, 500);
        }

        if (isPlayerTurn) {
          playerScore++;
          playerScoreElement.textContent = `プレイヤー: ${playerScore}`;
        } else {
          cpuScore++;
          cpuScoreElement.textContent = `CPU: ${cpuScore}`;
        }

        resetTurn(false);
      }, 500);
    } else {
      setTimeout(() => {
        unflipCards(firstCard, secondCard);
      }, 1000);
      setTimeout(() => {
        resetTurn(true);
      }, 1500);
    }
  }

  function resetTurn(switchTurn) {
    firstCard = null;
    secondCard = null;
    preventClick = false;

    if (switchTurn) {
      isPlayerTurn = !isPlayerTurn;
      if (!isPlayerTurn) {
        setTimeout(cpuTurn, 1000);
      }
    } else {
      if (!isPlayerTurn) {
        setTimeout(cpuTurn, 1000);
      }
    }
  }

  function cpuTurn() {
    if (isPlayerTurn || preventClick) return;
    preventClick = true;

    const availableCards = Array.from(document.querySelectorAll(".card:not(.flipped):not(.matched)"));

    if (availableCards.length < 2) {
      preventClick = false;
      return;
    }

    let firstChoice, secondChoice;

    for (let symbol in cpuMemory) {
      if (cpuMemory[symbol].length < 2) {
        [firstChoice, secondChoice] = cpuMemory[symbol];
        cpuMemory[symbol] = [];
        break;
      }
    }

    if (!firstChoice || !secondChoice) {
      firstChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
      do {
        secondChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
      } while (secondChoice === firstChoice);
    }

    flipCard(firstChoice);
    setTimeout(() => {
      flipCard(secondChoice);
      firstCard = firstChoice;
      secondCard = secondChoice;
      checkMatch();
    }, 1000);
  }

  function resetGame() {
    firstCard = null;
    secondCard = null;
    preventClick = false;
    matchedCount = 0;
    playerScore = 0;
    cpuScore = 0;
    isPlayerTurn = true;
    cpuMemory = {};
    playerScoreElement.textContent = "プレイヤー: 0";
    cpuScoreElement.textContent = "CPU: 0";

    // ゲットした画像を非表示に
    if (imgDisplay) {
      imgDisplay.style.display = "none"; // 画像を非表示にする
    }

    shuffle(cards);
    createCards();
  }

  // プレイヤーが勝った時にランダムでアイテムをゲットする関数
  function playerWin() {
    // プレイヤーがまだ獲得していない画像のリスト
    const availableItems = images.filter(item => !playerItems.includes(item));

    // もし獲得可能なアイテムがあれば、ランダムで選ぶ
    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];

      // 獲得した画像を playerItems に追加
      playerItems.push(randomItem);

      alert(`プレイヤーの勝利！画像「${randomItem}」を獲得しました。`);

      // 画像を表示する処理
      imgDisplay = document.createElement("img");
      imgDisplay.src = randomItem;
      imgDisplay.style.width = "300px";
      imgDisplay.style.height = "300px";
      imgDisplay.style.objectFit = "cover";
      
      // 画面上に獲得した画像を表示
      document.body.appendChild(imgDisplay);
    }
  }

  createCards();
  restartButton.addEventListener("click", resetGame);
});
