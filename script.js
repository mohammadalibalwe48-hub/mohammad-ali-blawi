(function () {
  var startButton = document.getElementById("start");
  var field = document.getElementById("field");
  var firefly = document.getElementById("firefly");
  var timeDisplay = document.getElementById("time");
  var scoreDisplay = document.getElementById("score");
  var bestDisplay = document.getElementById("best-score");

  var timeLeft = 30;
  var score = 0;
  var bestScore = 0;
  var timerId = null;
  var gameActive = false;

  function resizeFirefly() {
    var size = Math.max(36, Math.min(field.offsetWidth, field.offsetHeight) * 0.12);
    firefly.style.width = size + "px";
    firefly.style.height = size + "px";
  }

  function randomPosition() {
    var fieldRect = field.getBoundingClientRect();
    var flyRect = firefly.getBoundingClientRect();

    var maxX = fieldRect.width - flyRect.width;
    var maxY = fieldRect.height - flyRect.height;

    var x = Math.random() * maxX;
    var y = Math.random() * maxY;

    firefly.style.transform = "translate(" + x + "px, " + y + "px)";
  }

  function setTime(seconds) {
    timeLeft = seconds;
    timeDisplay.textContent = seconds;
  }

  function updateScore(value) {
    score = value;
    scoreDisplay.textContent = value;
  }

  function startGame() {
    if (gameActive) {
      return;
    }

    gameActive = true;
    setTime(30);
    updateScore(0);
    startButton.disabled = true;
    firefly.classList.add("visible");
    randomPosition();

    timerId = window.setInterval(function () {
      timeLeft -= 1;
      timeDisplay.textContent = timeLeft;

      if (timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    if (!gameActive) {
      return;
    }

    gameActive = false;
    window.clearInterval(timerId);
    timerId = null;
    startButton.disabled = false;
    firefly.classList.remove("visible");

    if (score > bestScore) {
      bestScore = score;
      bestDisplay.textContent = bestScore;
      try {
        window.localStorage.setItem("gardenChaseBest", String(bestScore));
      } catch (e) {
        // localStorage might be unavailable; fail silently.
      }
    }
  }

  function handleHit(event) {
    if (!gameActive) {
      return;
    }

    event.preventDefault();
    updateScore(score + 1);
    randomPosition();
  }

  function restoreBestScore() {
    try {
      var saved = window.localStorage.getItem("gardenChaseBest");
      if (saved) {
        bestScore = parseInt(saved, 10) || 0;
        bestDisplay.textContent = bestScore;
      }
    } catch (e) {
      // Ignore storage access issues.
    }
  }

  startButton.addEventListener("click", startGame);
  firefly.addEventListener("click", handleHit);
  firefly.addEventListener("touchstart", handleHit);
  window.addEventListener("resize", resizeFirefly);

  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      endGame();
    }
  });

  resizeFirefly();
  restoreBestScore();
  randomPosition();
})();
