const tiles = document.querySelectorAll('.tile');
    const startButton = document.getElementById('start-button');
    const scoreDisplay = document.getElementById('score');
    const difficultySelect = document.getElementById('difficulty');

    let sequence = [];
    let playerSequence = [];
    let level = 0;
    let score = 0;
    let delay = 1000;

    function playSound(color) {
      const audio = new Audio(`sounds/${color}.wav`);
      audio.play();
    }

    function activateTile(color) {
      const tile = document.querySelector(`.tile.${color}`);
      tile.classList.add('active');
      playSound(color);
      setTimeout(() => tile.classList.remove('active'), 500);
    }

    function nextSequence() {
      playerSequence = [];
      level++;
      score += 10; // Incrementa los puntos por nivel
      scoreDisplay.textContent = score;

      const colors = ['green', 'red', 'yellow', 'blue'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      sequence.push(randomColor);

      sequence.forEach((color, index) => {
        setTimeout(() => activateTile(color), (index + 1) * delay);
      });
    }

    function checkSequence() {
        const lastIndex = playerSequence.length - 1;
      
        if (playerSequence[lastIndex] !== sequence[lastIndex]) {
          Swal.fire({
            title: 'Game over!',
            text: `You reached the level ${level} with ${score} points.`,
            icon: 'error',
            confirmButtonText: 'Restart'
          }).then(() => {
            resetGame();
          });
      
          return;
        }
      
        if (playerSequence.length === sequence.length) {
          setTimeout(nextSequence, 1000);
        }
      }
      

    function resetGame() {
      sequence = [];
      playerSequence = [];
      level = 0;
      score = 0;
      scoreDisplay.textContent = score;
      startButton.disabled = false;
    }

    startButton.addEventListener('click', () => {
      delay = parseInt(difficultySelect.value);
      resetGame();
      nextSequence();
      startButton.disabled = true;
    });

    tiles.forEach(tile => {
      tile.addEventListener('click', event => {
        const color = event.target.dataset.color;
        playerSequence.push(color);
        activateTile(color);
        checkSequence();
      });
    });