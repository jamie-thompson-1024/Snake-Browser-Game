import Snake from "./Snake.js";

function main()
{
    const containerEl = document.getElementById('GameBoard');
    const controlsEl = document.getElementById('GameControls');

    const startButton = document.getElementById('startbutton');
    const optionsForm = document.getElementById('gameoptions');

    let options = {

    };
    
    function startGame()
    {
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
