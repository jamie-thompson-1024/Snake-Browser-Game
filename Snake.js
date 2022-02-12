
class Snake extends EventTarget
{

    // DOM elements / render context
    container;
    canvas;
    g;

    // game options / render params
    gameSpeed = 1.0; 
    gameWidth = 25;
    gameHeight;
    gameSquareSize;
    boardWidth;
    boardHeight;
    boardX;
    boardY;
    scoreBarX;
    scoreBarY;

    // game data
    moveDir = 'up'; // 'up' | 'down' | 'left' | 'right'
    moveDirSet = false; // stop dir selection till next update
    playerX = 0;
    playerY = 0;
    foodX = 0;
    foodY = 0;
    score = 0;

    // game state
    gameStarted = false;

    // render styles ( computer from container styles )
    backgroundColor;
    borderColor;
    scoreBarHeight;
    fontSize;
    font;

    constructor(container, options)
    {
        super();

        // create canvas and attach to container
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);

        // compute render styles
        let style = window.getComputedStyle(container);
        this.backgroundColor = style.backgroundColor;
        this.borderColor = style.borderColor;
        this.fontSize = parseInt(style.fontSize.replace('px', '')); // remove 'px' from value and parse to int 
        this.scoreBarHeight = this.fontSize * 2;
        this.font = style.fontFamily;
        
        // get user options
        this.gameSpeed = options?.gameSpeed ?? this.gameSpeed;
        this.gameWidth = options?.gameWidth ?? this.gameWidth;

        // get cavnas render context and update size
        this.g = this.canvas.getContext('2d');
        this.resize();

        // attach event listeners
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('keydown', this.input.bind(this));
            
        console.log(this);
        // fill canvas;
        this.draw();
    }

    start(options)
    {
        this.gameStarted = true;
    }

    stop()
    {
        this.dispatchEvent(new Event("GameOver"));
        this.gameStarted = false;
    }

    input(ev)
    {
        if(this.gameStarted)
        {
            switch(ev.code)
            {
                case 'KeyW':
                    this.moveDir = 'up';
                    this.moveDirSet = true;
                    break;
                case 'KeyA':
                    this.moveDir = 'left';
                    this.moveDirSet = true;
                    break;
                case 'KeyS':
                    this.moveDir = 'down';
                    this.moveDirSet = true;
                    break;
                case 'KeyD':
                    this.moveDir = 'right';
                    this.moveDirSet = true;
                    break;
                case 'Escape': // end game on 'Escape' key press
                    this.stop();
                    break;
            }
        }
    }

    update()
    {
        this.moveDirSet = false;
        switch(this.moveDir)
        {
            case 'up':
                break;
            case 'down':
                break;
            case 'left':
                break;
            case 'right':
                break;
        }
    }

    draw()
    {
        this.g.fillStyle = this.borderColor;
        this.g.fillRect(
            0, 0,
            this.canvas.width, this.canvas.height
        );

        this.g.fillStyle = this.backgroundColor;
        this.g.fillRect(
            this.boardX, this.boardY,
            this.boardWidth, this.boardHeight
        );

        if(this.gameStarted)
        {

        }else{

        }
    }

    resize()
    {
        this.canvas.width = this.container.clientWidth;
        this.canvas.height = this.container.clientHeight;
        
        // re-generate render parameters
        // square size and game height from width
        this.gameSquareSize = Math.floor(
            this.canvas.width / this.gameWidth);
        this.gameHeight = Math.floor(
            ( this.canvas.height - this.scoreBarHeight ) / this.gameSquareSize);
        
        // board size from square size and grid dimentions
        this.boardWidth = this.gameSquareSize * this.gameWidth;
        this.boardHeight = this.gameSquareSize * this.gameHeight;

        // Y margins of board + score bar
        let boardMarginY = (
            this.canvas.height - (this.boardHeight + this.scoreBarHeight)
        ) / 2;
        
        // board position
        this.boardX = (this.canvas.width - this.boardWidth) / 2;
        this.boardY = boardMarginY + this.scoreBarHeight;

        // score bar position
        this.scoreBarY = boardMarginY / 2;
        this.scoreBarX = this.boardX;

    }

    cleanup()
    {

    }
}

export default Snake;
