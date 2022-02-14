
class Snake extends EventTarget
{

    // DOM elements / render context
    container;
    canvas;
    g;

    // game options / render params
    gameBaseSpeed = 350;
    gameSpeed = 1.0; 
    gameWidth = 50;
    gameHeight;
    gameSquareSize;
    backgroundRedrawHandle;

    // game data
    moveDir = 'up'; // 'up' | 'down' | 'left' | 'right'
    moveDirSet = false; // stop dir selection till next update
    headPos = [0,0];
    tailPos = [];
    foodPos = [0,0];
    score = 0;

    // game state
    gameStarted = false;

    // render styles ( computer from container styles or preset )
    backgroundColor = '#222222';
    playerColor = '#EEEEEE';
    foodColor = '#FF1111';

    constructor(container, options)
    {
        super();

        // store and style container
        this.container = container;

        // create canvas and attach to container
        this.canvas = document.createElement('canvas');
        this.container.appendChild(this.canvas);
        
        // get user options
        this.gameSpeed = options?.gameSpeed ?? this.gameSpeed;
        this.gameWidth = options?.gameWidth ?? this.gameWidth;

        // get cavnas render context and update size
        this.g = this.canvas.getContext('2d');
        this.updateRenderParams();

        // attach event listeners
        window.addEventListener('keydown', this.input.bind(this));
            
        // start background rendering
        this.backgroundRedrawHandle = setInterval(() => {
            this.draw();
        }, 200);
    }

    start(options)
    {
        this.gameStarted = true;

        // get user options
        this.gameSpeed = options?.gameSpeed ?? this.gameSpeed;
        this.gameWidth = options?.gameWidth ?? this.gameWidth;
        this.updateRenderParams();

        // reset game
        this.headPos = [
            Math.floor(this.gameWidth / 2),
            Math.floor(this.gameHeight / 2)
        ];
        this.tailPos = [];
        this.score = 0;
        this.resetFoodPos();

        clearInterval(this.backgroundRedrawHandle);

        this.update();
    }

    stop()
    {
        this.dispatchEvent(new Event("GameOver"));
        this.gameStarted = false;

        this.backgroundRedrawHandle = setInterval(() => {
            this.draw();
        }, 200);
    }

    input(ev)
    {
        if(this.gameStarted)
        {
            switch(ev.code)
            {
                case 'KeyW':
                    this.moveDir = this.moveDir !== 'down' ? 'up' : this.moveDir;
                    this.moveDirSet = true;
                    break;
                case 'KeyA':
                    this.moveDir = this.moveDir !== 'right' ? 'left' : this.moveDir;
                    this.moveDirSet = true;
                    break;
                case 'KeyS':
                    this.moveDir = this.moveDir !== 'up' ? 'down' : this.moveDir;
                    this.moveDirSet = true;
                    break;
                case 'KeyD':
                    this.moveDir = this.moveDir !== 'left' ? 'right' : this.moveDir;
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

        this.tailPos.unshift([...this.headPos]);

        switch(this.moveDir)
        {
            case 'up':
                this.headPos[1]--;
                break;
            case 'down':
                this.headPos[1]++;
                break;
            case 'left':
                this.headPos[0]--;
                break;
            case 'right':
                this.headPos[0]++;
                break;
        }

        // remove lat tail segment if head doesnt land on food
        if(this.headPos[0] != this.foodPos[0] || this.headPos[1] != this.foodPos[1])
            this.tailPos.pop();
        else
            this.resetFoodPos();

        // fail if out of bounds
        if(this.headPos[0] < 0 || this.headPos[0] > this.gameWidth)
            this.stop();
        if(this.headPos[1] < 0 || this.headPos[1] > this.gameHeight)
            this.stop();
        
        // fail on head collision with tail segment(s)
        if(this.tailPos.some(([x, y]) => this.headPos[0] === x && this.headPos[1] === y))
            this.stop();
        
        if(this.score !== this.tailPos.length)
        {
            this.score = this.tailPos.length;
            this.dispatchEvent(new Event('UpdateScore'));
        }

        this.draw();

        if(this.gameStarted)
            setTimeout(
                this.update.bind(this),
                this.gameBaseSpeed / this.gameSpeed);
    }

    draw()
    {
        this.updateRenderParams();

        // draw background
        this.g.fillStyle = this.backgroundColor;
        this.g.fillRect(
            0, 0,
            this.canvas.width, this.canvas.height
        );

        if(this.gameStarted)
        {
            // draw food
            this.g.fillStyle = this.foodColor;
            this.drawSquare(this.foodPos);

            // draw player
            this.g.fillStyle = this.playerColor;
            this.drawSquare(this.headPos);

            this.tailPos.forEach((pos) => {
               this.drawSquare(pos);
            });

        }
    }

    // draw square on game board
    drawSquare(pos)
    {
        this.g.fillRect(
            pos[0] * this.gameSquareSize, 
            pos[1] * this.gameSquareSize,
            this.gameSquareSize, this.gameSquareSize
        )
    }

    resetFoodPos()
    {
        do
        {
            this.foodPos = [
                Math.floor(Math.random() * this.gameWidth),
                Math.floor(Math.random() * this.gameHeight)
            ];
        }
        while(
            (this.foodPos[0] === this.headPos[0] && 
            this.foodPos[1] === this.headPos[1]) ||
            this.tailPos.some(([x, y]) => this.foodPos[0] === x && this.foodPos[1] === y) )
    }

    updateRenderParams()
    {   
        // resize canvas if container not equal
        if(this.container.clientWidth != this.canvas.width)
            this.canvas.width = this.container.clientWidth;

        if(this.container.clientHeight != this.canvas.height)
            this.canvas.height = this.container.clientHeight;
        
        // square size and game height from width
        this.gameSquareSize = Math.floor(
            this.canvas.width / this.gameWidth);
        this.gameHeight = Math.floor(
            this.canvas.height  / this.gameSquareSize);

    }

    cleanup()
    {
        this.container.removeChild(
            this.canvas
        );
    }
}

export default Snake;
