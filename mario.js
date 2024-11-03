const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Configuración del jugador
const player = {
    x: 50,
    y: 300,
    width: 30,
    height: 30,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.8,
    jumpPower: -15,
    onGround: false
};

// Configuración de las plataformas
const platforms = [
    { x: 100, y: 350, width: 200, height: 20 },
    { x: 350, y: 250, width: 150, height: 20 },
    { x: 600, y: 300, width: 200, height: 20 }
];


function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

// Control del Movimiento del Jugador:

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.key === ' ' && player.onGround) {
        player.dy = player.jumpPower;
        player.onGround = false;
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        player.dx = 0;
    }
});


// fin control

// 5. Aplicar la Gravedad y Detectar Colisiones:

function applyGravity() {
    player.dy += player.gravity;
    player.y += player.dy;
    player.x += player.dx;

    // Evitar que el jugador salga del canvas
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Detectar colisión con plataformas
    player.onGround = false;
    platforms.forEach(platform => {
        if (player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height < platform.y + platform.height &&
            player.y + player.height + player.dy >= platform.y) {
            player.dy = 0;
            player.y = platform.y - player.height;
            player.onGround = true;
        }
    });

    // Evitar que el jugador caiga del canvas
    if (player.y + player.height > canvas.height) {
        player.dy = 0;
        player.y = canvas.height - player.height;
        player.onGround = true;
    }
}

// actualizar juego
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();
    applyGravity();
    requestAnimationFrame(update);
}

// enemigos

const enemies = [
    { x: 300, y: 320, width: 30, height: 30, speed: 2, direction: 1 },
    { x: 550, y: 270, width: 30, height: 30, speed: 2, direction: 1 }
];

function drawEnemies() {
    ctx.fillStyle = 'blue';
    enemies.forEach(enemy => {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.x += enemy.speed * enemy.direction;

        // Cambiar de dirección si el enemigo alcanza el borde de su plataforma
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.direction *= -1;
        }
    });
}


// enemigos
function checkEnemyCollision() {
    enemies.forEach(enemy => {
        if (checkCollision(player, enemy)) {
            loseAttempt(); // Llama a la función que maneja la pérdida de intentos
        }
    });
}













// fin enemigo

// bucle

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();
    drawEnemies();
    drawCoins();
    applyGravity();
    moveEnemies();
    checkEnemyCollision();
    checkCoinCollection();
    requestAnimationFrame(update);
}


// bucles

function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Puntuación: ' + score, 10, 30);
}

// actuallizacion
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();
    drawEnemies();
    drawCoins();
    drawScore();
    applyGravity();
    moveEnemies();
    checkEnemyCollision();
    checkCoinCollection();
    requestAnimationFrame(update);
}

// fin atualizacion

// monedas
const coins = [
    { x: 700, y: 400, width: 150, height: 150 },
    { x: 700, y: 400, width: 150, height: 150 },
    { x: 700, y: 400, width: 150, height: 150 }
];


function drawCoins() {
    coins.forEach(coin => {
        ctx.drawImage(coinImage, coin.x, coin.y, coin.width, coin.height);
    });
}

const coinImage = new Image("");
coinImage.src = 'imagenes/estrella.png';

function checkCoinCollection() {
    coins.forEach((coin, index) => {
        if (player.x < coin.x + coin.width &&
            player.x + player.width > coin.x &&
            player.y < coin.y + coin.height &&
            player.y + player.height > coin.y) {
            score++;
            coins.splice(index, 1);
            
        }
    });
}

coins[0].width = 200;
coins[0].height = 200;


drawCoins();



// finmonedas

// dibuja monedas
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Puntuación: ' + score, 10, 30);
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();
    drawEnemies();
    drawCoins();
    drawScore();
    applyGravity();
    moveEnemies();
    checkEnemyCollision();
    checkCoinCollection();
    requestAnimationFrame(update);
}
// fin

// niveles 

let currentLevel = 0; // Nivel actual
let attempts = 4; // Número de intentos
let isGameOver = false; // Estado del juego
let score = 0; // Puntaje del jugador

function resetEnemies() {
    // Obtener los datos del nivel actual
    const currentLevelData = levels[currentLevel];
    
    // Verifica si hay posiciones iniciales definidas para este nivel
    if (currentLevelData && currentLevelData.initialPositions) {
        // Reiniciar la posición de cada enemigo
        enemies.forEach((enemy, index) => {
            // Asegúrate de que haya una posición inicial para este enemigo
            if (currentLevelData.initialPositions[index]) {
                const { x, y } = currentLevelData.initialPositions[index];
                enemy.x = x;
                enemy.y = y;
                
                // Restablece la velocidad y dirección de cada enemigo según el nivel actual
                enemy.speed = currentLevelData.enemies[index].speed;
                enemy.direction = currentLevelData.enemies[index].direction;
            } else {
                // Si no hay una posición inicial específica, colocar en una posición predeterminada
                enemy.x = 50 + (index * 100); // Ajusta la X para evitar superposiciones
                enemy.y = 320; // Altura fija o ajustable según el diseño del nivel
            }
        });
    }
}



const levels = [
    // nivel 1
    {
        platforms: [
            { x: 50, y: 350, width: 100, height: 20 },
            { x: 200, y: 300, width: 100, height: 20 },
            { x: 400, y: 250, width: 150, height: 20 },
            { x: 650, y: 200, width: 150, height: 20 },
            { x: 500, y: 100, width: 80, height: 20 }
        ],
        enemies: [
            { x: 300, y: 320, width: 30, height: 30, speed: 2, direction: 1 }
        ],
        coins: [
            { x: 150, y: 320, width: 30, height: 30 },
            { x: 400, y: 220, width: 30, height: 30 }
        ]
    },
    // nivel 2
    {
        platforms: [
            { x: 50, y: 350, width: 200, height: 20 },
            { x: 300, y: 300, width: 100, height: 20 },
            { x: 500, y: 200, width: 250, height: 20 },
            { x: 700, y: 150, width: 80, height: 20 }
        ],
        enemies: [
            { x: 250, y: 280, width: 30, height: 30, speed: 3, direction: 1 },
            { x: 550, y: 180, width: 30, height: 30, speed: 2, direction: -1 }
        ],
        coins: [
            { x: 100, y: 320, width: 30, height: 30 },
            { x: 600, y: 170, width: 30, height: 30 },
            { x: 750, y: 120, width: 30, height: 30 }

        ]


    },

    // nivel 3
    {
        platforms: [
            { x: 30, y: 350, width: 100, height: 20 },
            { x: 200, y: 280, width: 80, height: 20 },
            { x: 350, y: 220, width: 60, height: 20 },
            { x: 500, y: 160, width: 50, height: 20 },
            { x: 650, y: 120, width: 40, height: 20 }
        ],
        enemies: [
            { x: 150, y: 330, width: 30, height: 30, speed: 4, direction: 1 },
            { x: 400, y: 200, width: 30, height: 30, speed: 3, direction: -1 },
            { x: 700, y: 100, width: 30, height: 30, speed: 5, direction: 1 }
        ],
        coins: [
            { x: 80, y: 320, width: 30, height: 30 },
            { x: 240, y: 260, width: 30, height: 30 },
            { x: 380, y: 200, width: 30, height: 30 },
            { x: 660, y: 90, width: 30, height: 30 }
        ]  
    },


    // nivel 4
    {
    platforms: [
        { x: 20, y: 370, width: 150, height: 20 },
        { x: 200, y: 300, width: 120, height: 20 },
        { x: 350, y: 250, width: 100, height: 20 },
        { x: 500, y: 200, width: 100, height: 20 },
        { x: 650, y: 150, width: 150, height: 20 },
        { x: 400, y: 100, width: 200, height: 20 },
        { x: 700, y: 350, width: 100, height: 20 }
    ],
    enemies: [
        { x: 150, y: 280, width: 30, height: 30, speed: 2, direction: 1 },
        { x: 320, y: 230, width: 30, height: 30, speed: 3, direction: -1 },
        { x: 520, y: 180, width: 30, height: 30, speed: 2, direction: 1 },
        { x: 680, y: 130, width: 30, height: 30, speed: 2, direction: -1 }
    ],
    coins: [
        { x: 60, y: 340, width: 20, height: 20 },
        { x: 250, y: 280, width: 20, height: 20 },
        { x: 400, y: 220, width: 20, height: 20 },
        { x: 520, y: 170, width: 20, height: 20 },
        { x: 700, y: 120, width: 20, height: 20 },
        { x: 750, y: 320, width: 20, height: 20 }
    ]
},

// nivel 5
{
    platforms: [
        { x: 0, y: 400, width: 150, height: 20 },
        { x: 200, y: 350, width: 100, height: 20 },
        { x: 400, y: 300, width: 100, height: 20 },
        { x: 600, y: 250, width: 100, height: 20 },
        { x: 800, y: 200, width: 100, height: 20 },
        { x: 100, y: 100, width: 100, height: 20 },
        { x: 300, y: 150, width: 150, height: 20 },
        { x: 500, y: 100, width: 150, height: 20 },
        { x: 700, y: 50, width: 200, height: 20 },
        { x: 400, y: 450, width: 150, height: 20 },
        { x: 700, y: 400, width: 100, height: 20 }
    ],
    enemies: [
        { x: 120, y: 380, width: 30, height: 30, speed: 4, direction: 1 },
        { x: 420, y: 280, width: 30, height: 30, speed: 5, direction: -1 },
        { x: 620, y: 230, width: 30, height: 30, speed: 4, direction: 1 },
        { x: 820, y: 180, width: 30, height: 30, speed: 3, direction: -1 },
        { x: 150, y: 80, width: 30, height: 30, speed: 5, direction: 1 },
        { x: 350, y: 130, width: 30, height: 30, speed: 3, direction: -1 },
        { x: 520, y: 80, width: 30, height: 30, speed: 4, direction: 1 },
        { x: 720, y: 30, width: 30, height: 30, speed: 6, direction: -1 }
    ],
    coins: [
        { x: 80, y: 380, width: 20, height: 20 },
        { x: 220, y: 330, width: 20, height: 20 },
        { x: 420, y: 280, width: 20, height: 20 },
        { x: 620, y: 230, width: 20, height: 20 },
        { x: 820, y: 180, width: 20, height: 20 },
        { x: 120, y: 80, width: 20, height: 20 },
        { x: 320, y: 130, width: 20, height: 20 },
        { x: 520, y: 80, width: 20, height: 20 },
        { x: 750, y: 30, width: 20, height: 20 },
        { x: 750, y: 370, width: 20, height: 20 }
    ]
},
];



function checkLevelCompletion() {
    if (coins.length === 0) {
        Swal.fire({
            title: '¡Nivel completado!',
            text: '¡Has completado el nivel ' + (currentLevel + 1) + '!',
            icon: 'success',
            confirmButtonText: 'Continuar'
        }).then(() => {
            currentLevel++;
            attempts = 4; // Restablecer intentos a 4 para el siguiente nivel

            console.log("Nivel completado. Nivel actual:", currentLevel);
            
            if (currentLevel < levels.length) {
                loadLevel(currentLevel); // Cargar el siguiente nivel
                console.log("Cargando nivel:", currentLevel);
            } else {
                // Mensaje final de felicitación al completar todos los niveles
                Swal.fire({
                    title: '¡Felicitaciones!',
                    text: '¡Has completado todos los niveles del juego!',
                    icon: 'success',
                    confirmButtonText: 'Volver a empezar'
                }).then(() => {
                    resetGame(); // Reinicia el juego desde el nivel 0
                    console.log("Juego reiniciado");
                });
            }
        });
    }
}



    







// Cargar el primer nivel al iniciar




function loadLevel(levelIndex) {
    const level = levels[levelIndex];
    platforms.splice(0, platforms.length, ...level.platforms);
    enemies.splice(0, enemies.length, ...level.enemies);
    coins.splice(0, coins.length, ...level.coins);
    resetPlayer(); // Resetea la posición del jugador
}

function resetPlayer() {
    player.x = 50; // Posición inicial del jugador
    player.y = 300; // Altura inicial
}

function checkEnemyCollision() {
    enemies.forEach(enemy => {
        if (checkCollision(player, enemy)) {
            loseAttempt(); // Llama a la función que maneja la pérdida de intentos
        }
    });
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Función para restar un intento cuando el jugador pierde
// Función que maneja la pérdida de intentos
function loseAttempt() {
    if (!isGameOver) {
        attempts--;
        pauseGame();

        // Mostrar mensaje de intento perdido usando SweetAlert2
        Swal.fire({
            title: '¡Cuidado!',
            text: `¡Has sido atrapado por un enemigo! Intentos restantes: ${attempts}`,
            icon: 'warning',
            confirmButtonText: 'Continuar',
            background: '#f8d7da',
            color: '#721c24'
        }).then(() => {
            if (attempts <= 0) {
                gameOver(); // Si los intentos se acabaron, llamamos a gameOver
            } else {
                resetLevel(); // Reinicia el nivel actual si aún quedan intentos
                resumeGame(); // Reanuda la animación
            }
        });
    }
}

function gameOver() {
    isGameOver = true;
    pauseGame();

    // Mostrar alerta de Game Over usando SweetAlert2
    Swal.fire({
        title: '¡Game Over!',
        text: 'Se acabaron los intentos. ¿Quieres volver a intentarlo?',
        icon: 'error',
        showCancelButton: true,
        confirmButtonText: 'Sí, reiniciar',
        cancelButtonText: 'No, salir',
        background: '#f8d7da',
        color: '#721c24'
    }).then((result) => {
        if (result.isConfirmed) {
            resetGame(); // Reinicia el juego si el jugador elige "Sí"
            resumeGame(); // Reanuda la animación
        } else {
            Swal.fire({
                title: 'Gracias por jugar',
                text: '¡Esperamos verte pronto!',
                icon: 'info',
                confirmButtonText: 'Reiniciar',
                background: '#d1ecf1',
                color: '#0c5460'
            }).then(() => {
                resetGame(); // Reiniciar después de agradecer al jugador si elige reiniciar
            });
        }
    });
}

let animationId; // ID de la animación
let isPaused = false; // Bandera para pausar el juego

function startGame() {
    // Iniciar o reanudar el juego solo si no está pausado
    if (!isPaused) {
        animationId = requestAnimationFrame(gameLoop);
    }
}

function gameLoop() {
    if (!isPaused) {
        // Actualización y renderización del juego aquí
        // ...

        // Continuar el ciclo de animación
        animationId = requestAnimationFrame(gameLoop);
    }
}

// Pausar el juego
function pauseGame() {
    isPaused = true;
    cancelAnimationFrame(animationId); // Detener la animación
}

// Reanudar el juego
function resumeGame() {
    isPaused = false;
    startGame(); // Iniciar la animación nuevamente
}

function resetLevel() {
    
    resetPlayer(); // Restablecer la posición del jugador
    resetEnemies(); // Reiniciar las posiciones de los enemigos
    drawCoins(); // Redibuja las monedas en el nivel
    drawEnemies(); // Dibuja los enemigos en sus nuevas posiciones
    
  

}

startGame();




function resetGame() {
    score = 0;
    attempts = 4; // Reinicia los intentos
    currentLevel = 0; // Vuelve al primer nivel
    isGameOver = false;
    isPaused = false;

    
    console.log("Juego reiniciado desde el primer nivel.");
    coins = levels[currentLevel].coins.map(coin => ({ ...coin }));
    enemies = levels[currentLevel].enemies.map(enemy => ({ ...enemy }));

    // Reinicia la posición del jugador
    player.x = 50; // Posición X inicial
    player.y = 350; // Posición Y inicial

    clearInterval(gameLoop); // Si tienes un intervalo de juego
    document.removeEventListener("keydown", gameControls); // Si usas controles del teclado

    // Vuelve a configurar el nivel y los listeners necesarios
    loadLevel(currentLevel);
    gameLoop = setInterval(updateGame, 1000 / 60); // Reinicia el loop del juego si usas intervalos
    gameLoop = setInterval(updateGame, 1000 / 60); // Reinicia el loop del juego
    loadLevel(currentLevel); // Carga el primer nivel
}
    
    



// Cargar el primer nivel al iniciar
loadLevel(currentLevel);

// bucle actualizacion
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    drawPlatforms();
    drawEnemies();
    drawCoins();
    drawScore();
    applyGravity();
    moveEnemies();
    checkEnemyCollision();
    checkCoinCollection();
    checkLevelCompletion();
    requestAnimationFrame(update);
}
// fin bucle actualizacion


update(); // Iniciar el bucle del juego
