document.addEventListener("DOMContentLoaded", async () => {
  const gameBoard = document.getElementById("game-board");
  const playerScoreElement = document.getElementById("player-score");
  const cpuScoreElement = document.getElementById("cpu-score");
  const restartButton = document.getElementById("restart-button");

  let images = await loadImages();
  let selectedImages = getRandomImages(images, 7);
  let cards = [...selectedImages, ...selectedImages];

  let firstCard = null;
  let secondCard = null;
  let preventClick = false;
  let matchedCount = 0;
  let playerScore = 0;
  let cpuScore = 0;
  let isPlayerTurn = true;
  let cpuMemory = {};
  let playerItems = [];

  let imgDisplay = document.getElementById("collected-items");
  if (!imgDisplay) {
    imgDisplay = document.createElement("div");
    imgDisplay.id = "collected-items";
    imgDisplay.style.marginTop = "20px";
    imgDisplay.innerHTML = "<h3>🏆 獲得したアイテム</h3>";
    document.body.appendChild(imgDisplay);
  }

  // 配列をシャッフルする
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // 画像のリストをロードする
  async function loadImages() {
    return [
      "img/on1.JPG", "img/on2.JPG", "img/on3.JPG",
      "img/on4.JPG", "img/on5.JPG", "img/on6.JPG",
      "img/on7.JPG", "img/on8.JPG", "img/on9.JPG",
      "img/on10.JPG", "img/on11.JPG", "img/on12.JPG"
    ];
  }

  // 画像をランダムに選択する
  function getRandomImages(imageArray, count) {
    let shuffled = [...imageArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // ゲームボード上にカードを生成する
  function createCards() {
    gameBoard.innerHTML = "";
    shuffle(cards);
    cards.forEach((symbol) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.symbol = symbol;

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

  // カードを表にする
  function flipCard(card) {
    card.classList.add("flipped");
  }

  // カードを裏に戻す
  function unflipCards(card1, card2) {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      preventClick = false;
    }, 1000);
  }

  // CPUがカードを記憶する
  function rememberCard(card) {
    const symbol = card.dataset.symbol;
    if (!cpuMemory[symbol]) {
      cpuMemory[symbol] = new Set();
    }
    cpuMemory[symbol].add(card);
  }

  // 2枚のカードが一致しているかチェックする
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
            } else if (cpuScore > playerScore) {
              alert("プレイヤーの敗北");
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

  // ターンをリセットする（必要なら交代もする）
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

  // CPUのターン処理
  function cpuTurn() {
    if (isPlayerTurn || preventClick) return;
    preventClick = true;

    const availableCards = Array.from(document.querySelectorAll(".card:not(.flipped):not(.matched)"));

    if (availableCards.length < 2) {
      preventClick = false;
      return;
    }

    let firstChoice = null, secondChoice = null;

    for (let symbol in cpuMemory) {
      let storedCards = Array.from(cpuMemory[symbol]).filter(card => !card.classList.contains("flipped") && !card.classList.contains("matched"));
      if (storedCards.length >= 2) {
        [firstChoice, secondChoice] = storedCards;
        break;
      }
    }

    if (!firstChoice || !secondChoice) {
      firstChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
      do {
        secondChoice = availableCards[Math.floor(Math.random() * availableCards.length)];
      } while (secondChoice === firstChoice);
    }

    setTimeout(() => {
      flipCard(firstChoice);
      setTimeout(() => {
        flipCard(secondChoice);
        firstCard = firstChoice;
        secondCard = secondChoice;
        checkMatch();
      }, 1000);
    }, 1000);
  }

  // ゲームをリセットする
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

    selectedImages = getRandomImages(images, 7);
    cards = [...selectedImages, ...selectedImages];
    shuffle(cards);
    createCards();
  }

  // プレイヤーが勝利した場合の処理
  function playerWin() {
    const availableItems = images.filter(item => !playerItems.includes(item));

    if (availableItems.length > 0) {
      const randomItem = availableItems[Math.floor(Math.random() * availableItems.length)];
      playerItems.push(randomItem);
      alert(`🎉 プレイヤーの勝利！「${randomItem}」を獲得しました！`);

      const imgElement = document.createElement("img");
      imgElement.src = randomItem;
      imgElement.style.width = "100px";
      imgElement.style.height = "100px";
      imgElement.style.objectFit = "cover";
      imgElement.style.margin = "5px";
      imgDisplay.appendChild(imgElement);
    } else {
      alert("🎉 すべてのアイテムを獲得しました！");
    }
  }

  createCards();
  restartButton.addEventListener("click", resetGame);
});
