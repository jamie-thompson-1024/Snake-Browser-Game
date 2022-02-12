import Snake from "./Snake.js";

function main()
{
    const containerEl = document.getElementById('GameBoard');
    const controlsEl = document.getElementById('GameControls');

    const startButton = document.getElementById('startbutton');
    const optionsForm = document.getElementById('gameoptions');
    const formElements = optionsForm.elements;

    let options = {
        gameSpeed: 1.0,
        gameWidth: 50
    };
    
    formElements.namedItem('gamespeed').value = options.gameSpeed;
    formElements.namedItem('gamewidth').value = options.gameWidth;
    
    function startGame()
    {
        options.gameSpeed = formElements.namedItem('gamespeed').value;
        options.gameWidth = formElements.namedItem('gamewidth').value;

        snake.start(options);

        // hide control dialog
        controlsEl.style.visibility = 'hidden';
    }

    function gameOver()
    {
        // show control dialog
        controlsEl.style.visibility = 'visible';
    }

    const snake = new Snake(containerEl, options);
    snake.addEventListener('GameOver', () => { gameOver(); });

    startButton.addEventListener('click', () => { startGame(); });

}

main();
