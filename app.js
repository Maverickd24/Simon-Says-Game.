let gameSeq = [];
let userSeq = [];

// 9 color IDs matching the new buttons
let btns = [
  "red", "yellow", "green",
  "purple", "blue", "orange",
  "teal", "pink", "lime"
];

let started = false;
let level = 0;

let h2 = document.querySelector("h2");

// High Score Feature
let highScore = localStorage.getItem("simonHighScore") || 0;
const highScoreSpan = document.getElementById("highScoreValue");
if (highScoreSpan) {
  highScoreSpan.textContent = highScore;
}

document.addEventListener("keypress", function () {
  if (!started) {
    started = true;
    levelUp();
  }
});

// Also allow touchstart to start the game on mobile
document.addEventListener("touchstart", function () {
  if (!started) {
    started = true;
    levelUp();
  }
}, { once: true });

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => {
    btn.classList.remove("flash");
  }, 250);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => {
    btn.classList.remove("userflash");
  }, 250);
}

function levelUp() {
  userSeq = [];
  level++;
  h2.innerText = `Level ${level}`;

  let randIdx = Math.floor(Math.random() * btns.length);
  let randColor = btns[randIdx];
  let randBtn = document.querySelector(`#${randColor}`);

  gameSeq.push(randColor);
  gameFlash(randBtn);
}

function checkAns(currentIdx) {
  if (userSeq[currentIdx] === gameSeq[currentIdx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 1000);
    }
  } else {
    // Update high score if needed
    updateHighScore(level);

    document.body.classList.add("game-over");
    h2.innerHTML = `Game Over! Your score was <b>${level}</b><br>Press any key to restart`;
    setTimeout(() => {
      document.body.classList.remove("game-over");
    }, 300);
    resetGame();
  }
}

// High Score update function
function updateHighScore(score) {
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("simonHighScore", highScore);
    if (highScoreSpan) {
      highScoreSpan.textContent = highScore;
    }
  }
}

function btnPressed() {
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

let allBtns = document.querySelectorAll(".btn");
allBtns.forEach(btn => {
  btn.addEventListener("click", btnPressed);
  btn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    btnPressed.call(btn);
  }, { passive: false });
});