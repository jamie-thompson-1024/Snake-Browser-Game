import Snake from "./Snake.js";

function main()
{
    const containerEl = document.getElementById('GameContainer');
    const controlsEl = document.getElementById('GameControls');

    const startButton = document.getElementById('startbutton');
    const optionsForm = document.getElementById('gameoptions');
    const formElements = optionsForm.elements;

    const liveScoreElement = document.getElementById('livescore');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highscore');

    let options = {
        gameSpeed: 1.0,
        gameWidth: 50
    };

    let highScore = localStorage["snakeScore"] ?? 0;
    
    formElements.namedItem('gamespeed').value = options.gameSpeed;
    formElements.namedItem('gamewidth').value = options.gameWidth;

    scoreElement.innerText = "Score: 0";
    highScoreElement.innerText = `High Score: ${highScore}`;
    liveScoreElement.innerText = '0';
    
    function startGame()
    {
        options.gameSpeed = formElements.namedItem('gamespeed').value;
        options.gameWidth = formElements.namedItem('gamewidth').value;

        liveScoreElement.innerText = '0';

        snake.start(options);

        // hide control dialog
        controlsEl.style.visibility = 'hidden';
    }

    function updateScore()
    {
        liveScoreElement.innerText = `${snake.score}`;
    }

    function gameOver()
    {
        highScore = snake.score > highScore ? snake.score : highScore;
        scoreElement.innerText = `Score: ${snake.score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
        localStorage["snakeScore"] = highScore;

        // show control dialog
        controlsEl.style.visibility = 'visible';
    }

    const snake = new Snake(containerEl, options);
    snake.addEventListener('GameOver', () => { gameOver(); });
    snake.addEventListener('UpdateScore', () => { updateScore(); });

    startButton.addEventListener('click', () => { startGame(); });

}

main();
