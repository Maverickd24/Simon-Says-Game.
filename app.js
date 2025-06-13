let gameSeq = [];
let userSeq = [];

const btns = [
  "red", "yellow", "green",
  "purple", "blue", "orange",
  "teal", "pink", "lime"
];

let started = false;
let level = 0;

const h2 = document.querySelector("h2");
const highScoreSpan = document.getElementById("highScoreValue");
const btnContainer = document.querySelector(".btn-container");
const startBtn = document.getElementById("startGameBtn");

let highScore = localStorage.getItem("simonHighScore") || 0;
if (highScoreSpan) highScoreSpan.textContent = highScore;

// Show game area and start game on button click
if (startBtn) {
  startBtn.addEventListener("click", () => {
    startBtn.style.display = "none";
    btnContainer.style.display = "flex";
    h2.innerText = "Level 1";
    started = true;
    level = 0;
    gameSeq = [];
    userSeq = [];
    setTimeout(levelUp, 400);
  });
}

// Also allow keyboard/touch to restart after game over
document.addEventListener("keypress", function () {
  if (!started && btnContainer.style.display === "flex") {
    h2.innerText = "Level 1";
    started = true;
    level = 0;
    gameSeq = [];
    userSeq = [];
    setTimeout(levelUp, 400);
  }
});
document.addEventListener("touchstart", function () {
  if (!started && btnContainer.style.display === "flex") {
    h2.innerText = "Level 1";
    started = true;
    level = 0;
    gameSeq = [];
    userSeq = [];
    setTimeout(levelUp, 400);
  }
}, { once: false });

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => {
    btn.classList.remove("flash");
  }, 350);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => {
    btn.classList.remove("userflash");
  }, 250);
}

// Show the full sequence up to current level
function playSequence() {
  let i = 0;
  disableButtons();
  function nextFlash() {
    if (i < gameSeq.length) {
      const btn = document.getElementById(gameSeq[i]);
      gameFlash(btn);
      i++;
      setTimeout(nextFlash, 500);
    } else {
      enableButtons();
    }
  }
  nextFlash();
}

function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;

  let randIdx = Math.floor(Math.random() * btns.length);
  let randColor = btns[randIdx];
  gameSeq.push(randColor);

  playSequence();
}

function checkAns(currentIdx) {
  if (userSeq[currentIdx] === gameSeq[currentIdx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 800);
    }
  } else {
    updateHighScore(level - 1);
    document.body.classList.add("game-over");
    h2.innerHTML = `Game Over! Your score was <b>${level - 1}</b><br>Press any key or tap to restart`;
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 400);
    resetGame();
  }
}

function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("simonHighScore", highScore);
    if (highScoreSpan) highScoreSpan.textContent = highScore;
  }
}

function btnPressed() {
  if (!started) return;
  let btn = this;
  let userColor = btn.getAttribute("id");
  userSeq.push(userColor);
  userFlash(btn);
  checkAns(userSeq.length - 1);
}

function resetGame() {
  started = false;
  gameSeq = [];
  userSeq = [];
  level = 0;
}

// Enable/disable buttons to prevent input during sequence
function disableButtons() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.style.pointerEvents = "none";
  });
}
function enableButtons() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.style.pointerEvents = "auto";
  });
}

// Add event listeners to all buttons
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", btnPressed);
  btn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    btnPressed.call(btn);
  }, { passive: false });
});
