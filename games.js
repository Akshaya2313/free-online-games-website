function openGame(gameName) {
    const modal = document.getElementById('game-modal');
    const gameContainer = document.getElementById('game-container');
    gameContainer.innerHTML = '';

    switch(gameName) {
        case 'tictactoe':
            gameContainer.appendChild(createTicTacToe());
            break;
        case 'snake':
            gameContainer.appendChild(createSnakeGame());
            break;
        case 'memory':
            gameContainer.appendChild(createMemoryGame());
            break;
        case 'flappybird':
            gameContainer.appendChild(createFlappyBird());
            break;
        case '2048':
            gameContainer.appendChild(create2048());
            break;
        case 'rockpaper':
            gameContainer.appendChild(createRockPaperScissors());
            break;
    }

    modal.style.display = 'flex';
}

function closeGame() {
    document.getElementById('game-modal').style.display = 'none';
}

window.onclick = function(event) {
    const modal = document.getElementById('game-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Tic Tac Toe Game
function createTicTacToe() {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Tic Tac Toe</h2>
        <div style="text-align: center; margin: 2rem 0;">
            <p>Player: X | Computer: O</p>
            <div id="board" style="display: grid; grid-template-columns: repeat(3, 100px); gap: 5px; margin: 1rem auto; width: fit-content;">
            </div>
            <button onclick="resetTicTacToe()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px;">Reset Game</button>
            <p id="status" style="margin-top: 1rem; font-size: 1.2rem; font-weight: bold;"></p>
        </div>
    `;

    const board = container.querySelector('#board');
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    function createBoard() {
        board.innerHTML = '';
        gameState.forEach((cell, index) => {
            const cellDiv = document.createElement('div');
            cellDiv.style.cssText = 'width: 100px; height: 100px; background-color: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; border-radius: 5px; border: 2px solid #667eea;';
            cellDiv.textContent = cell;
            cellDiv.onclick = () => playerMove(index);
            board.appendChild(cellDiv);
        });
    }

    function checkWinner() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                return gameState[a];
            }
        }
        return null;
    }

    function playerMove(index) {
        if (gameState[index] === '' && gameActive) {
            gameState[index] = 'X';
            createBoard();

            const winner = checkWinner();
            if (winner) {
                document.querySelector('#status').textContent = winner === 'X' ? '🎉 You Win!' : '🤖 Computer Wins!';
                gameActive = false;
                return;
            }

            if (!gameState.includes('')) {
                document.querySelector('#status').textContent = '🤝 Draw!';
                gameActive = false;
                return;
            }

            setTimeout(computerMove, 500);
        }
    }

    function computerMove() {
        const emptyIndices = gameState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null);
        if (emptyIndices.length > 0) {
            const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            gameState[randomIndex] = 'O';
            createBoard();

            const winner = checkWinner();
            if (winner) {
                document.querySelector('#status').textContent = winner === 'X' ? '🎉 You Win!' : '🤖 Computer Wins!';
                gameActive = false;
            } else if (!gameState.includes('')) {
                document.querySelector('#status').textContent = '🤝 Draw!';
                gameActive = false;
            }
        }
    }

    window.resetTicTacToe = function() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        document.querySelector('#status').textContent = '';
        createBoard();
    };

    createBoard();
    return container;
}

// Snake Game
function createSnakeGame() {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Snake Game</h2>
        <div style="text-align: center;">
            <p>Score: <span id="score">0</span> | High Score: <span id="highScore">0</span></p>
            <canvas id="snakeCanvas" width="400" height="400" style="border: 2px solid #667eea; background-color: #000; border-radius: 5px; margin: 1rem 0;"></canvas>
            <div>
                <button onclick="startSnakeGame()" style="padding: 0.5rem 1rem; margin: 0.5rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px;">Start</button>
                <button onclick="resetSnakeGame()" style="padding: 0.5rem 1rem; margin: 0.5rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px;">Reset</button>
            </div>
            <p style="font-size: 0.9rem; color: #666;">Use Arrow Keys to move</p>
        </div>
    `;

    const canvas = container.querySelector('#snakeCanvas');
    const ctx = canvas.getContext('2d');
    let snake = [{x: 10, y: 10}];
    let food = {x: 15, y: 15};
    let dx = 1, dy = 0;
    let score = 0;
    let gameRunning = false;
    let gameLoop;

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    });

    window.startSnakeGame = function() {
        if (!gameRunning) {
            gameRunning = true;
            gameLoop = setInterval(update, 100);
        }
    };

    window.resetSnakeGame = function() {
        snake = [{x: 10, y: 10}];
        food = {x: 15, y: 15};
        dx = 1; dy = 0;
        score = 0;
        gameRunning = false;
        clearInterval(gameLoop);
        container.querySelector('#score').textContent = '0';
        draw();
    };

    function update() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};

        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || snake.some(s => s.x === head.x && s.y === head.y)) {
            gameRunning = false;
            clearInterval(gameLoop);
            alert('Game Over! Score: ' + score);
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            container.querySelector('#score').textContent = score;
            food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20)};
        } else {
            snake.pop();
        }

        draw();
    }

    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#00ff00';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
        });

        ctx.fillStyle = '#ff0000';
        ctx.fillRect(food.x * 20, food.y * 20, 20, 20);
    }

    draw();
    return container;
}

// Memory Game
function createMemoryGame() {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Memory Match Game</h2>
        <div style="text-align: center;">
            <p>Moves: <span id="moves">0</span> | Matched: <span id="matched">0/8</span></p>
            <div id="memoryBoard" style="display: grid; grid-template-columns: repeat(4, 80px); gap: 10px; margin: 1.5rem auto; width: fit-content;"></div>
            <button onclick="resetMemoryGame()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px;">Reset Game</button>
        </div>
    `;

    const board = container.querySelector('#memoryBoard');
    const symbols = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍑', '🍒', '🥝'];
    let cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
    let flipped = [];
    let matched = 0;
    let moves = 0;

    cards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.style.cssText = 'width: 80px; height: 80px; background-color: #667eea; color: white; font-size: 2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 5px; border: 2px solid #764ba2; transition: all 0.3s;';
        card.textContent = '?';
        card.dataset.symbol = symbol;
        card.dataset.index = index;
        card.className = 'memory-card';

        card.onclick = () => flipCard(card);
        board.appendChild(card);
    });

    function flipCard(card) {
        if (card.classList.contains('flipped') || flipped.length === 2) return;

        card.textContent = card.dataset.symbol;
        card.classList.add('flipped');
        flipped.push(card);

        if (flipped.length === 2) {
            moves++;
            container.querySelector('#moves').textContent = moves;

            if (flipped[0].dataset.symbol === flipped[1].dataset.symbol) {
                matched++;
                container.querySelector('#matched').textContent = matched + '/8';
                flipped = [];

                if (matched === 8) {
                    setTimeout(() => alert('🎉 You Won! Moves: ' + moves), 300);
                }
            } else {
                setTimeout(() => {
                    flipped.forEach(c => {
                        c.textContent = '?';
                        c.classList.remove('flipped');
                    });
                    flipped = [];
                }, 1000);
            }
        }
    }

    window.resetMemoryGame = function() {
        matched = 0;
        moves = 0;
        flipped = [];
        cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        container.querySelector('#moves').textContent = '0';
        container.querySelector('#matched').textContent = '0/8';
        board.innerHTML = '';

        cards.forEach((symbol, index) => {
            const card = document.createElement('div');
            card.style.cssText = 'width: 80px; height: 80px; background-color: #667eea; color: white; font-size: 2rem; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 5px; border: 2px solid #764ba2; transition: all 0.3s;';
            card.textContent = '?';
            card.dataset.symbol = symbol;
            card.className = 'memory-card';
            card.onclick = () => flipCard(card);
            board.appendChild(card);
        });
    };

    return container;
}

// Flappy Bird Game
function createFlappyBird() {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Flappy Bird</h2>
        <div style="text-align: center;">
            <p>Score: <span id="flappyScore">0</span></p>
            <canvas id="flappyCanvas" width="400" height="600" style="border: 2px solid #667eea; background: linear-gradient(to bottom, #87CEEB, #E0F6FF); border-radius: 5px; margin: 1rem 0; display: block; margin-left: auto; margin-right: auto;"></canvas>
            <div>
                <button onclick="startFlappyBird()" style="padding: 0.5rem 1rem; margin: 0.5rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px;">Start Game</button>
                <button onclick="resetFlappyBird()" style="padding: 0.5rem 1rem; margin: 0.5rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px;">Reset</button>
            </div>
            <p style="font-size: 0.9rem; color: #666;">Click or press SPACE to flap</p>
        </div>
    `;

    const canvas = container.querySelector('#flappyCanvas');
    const ctx = canvas.getContext('2d');
    let bird = {x: 50, y: 250, width: 30, height: 30, velocity: 0};
    let pipes = [];
    let score = 0;
    let gameRunning = false;
    let gameLoop;

    function flap() {
        if (gameRunning) bird.velocity = -8;
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space') { e.preventDefault(); flap(); }
    });

    canvas.addEventListener('click', flap);

    window.startFlappyBird = function() {
        if (!gameRunning) {
            gameRunning = true;
            pipes = [];
            score = 0;
            bird = {x: 50, y: 250, width: 30, height: 30, velocity: 0};
            container.querySelector('#flappyScore').textContent = '0';
            gameLoop = setInterval(updateFlappy, 30);
        }
    };

    window.resetFlappyBird = function() {
        gameRunning = false;
        clearInterval(gameLoop);
        bird = {x: 50, y: 250, width: 30, height: 30, velocity: 0};
        pipes = [];
        score = 0;
        container.querySelector('#flappyScore').textContent = '0';
        drawFlappy();
    };

    function updateFlappy() {
        bird.velocity += 0.5;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameRunning = false;
            clearInterval(gameLoop);
            alert('Game Over! Score: ' + score);
            return;
        }

        if (Math.random() < 0.02) {
            const gapSize = 120;
            const gapY = Math.random() * (canvas.height - gapSize);
            pipes.push({x: canvas.width, gapY: gapY});
        }

        for (let i = pipes.length - 1; i >= 0; i--) {
            pipes[i].x -= 5;

            if (bird.x < pipes[i].x + 50 && bird.x + bird.width > pipes[i].x &&
                (bird.y < pipes[i].gapY || bird.y + bird.height > pipes[i].gapY + 120)) {
                gameRunning = false;
                clearInterval(gameLoop);
                alert('Game Over! Score: ' + score);
                return;
            }

            if (pipes[i].x === bird.x) {
                score++;
                container.querySelector('#flappyScore').textContent = score;
            }

            if (pipes[i].x < 0) pipes.splice(i, 1);
        }

        drawFlappy();
    }

    function drawFlappy() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#FFD700';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

        ctx.fillStyle = '#228B22';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, 0, 50, pipe.gapY);
            ctx.fillRect(pipe.x, pipe.gapY + 120, 50, canvas.height - pipe.gapY - 120);
        });
    }

    drawFlappy();
    return container;
}

// 2048 Game
function create2048() {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>2048 Game</h2>
        <div style="text-align: center;">
            <p>Score: <span id="score2048">0</span></p>
            <div id="board2048" style="display: grid; grid-template-columns: repeat(4, 80px); gap: 10px; margin: 1rem auto; width: fit-content;"></div>
            <button onclick="reset2048()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px;">New Game</button>
            <p style="font-size: 0.9rem; color: #666; margin-top: 1rem;">Use Arrow Keys to move tiles</p>
        </div>
    `;

    const boardDiv = container.querySelector('#board2048');
    let board = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    let score = 0;

    function addNewTile() {
        let empty = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (board[i][j] === 0) empty.push({i, j});
            }
        }
        if (empty.length > 0) {
            const {i, j} = empty[Math.floor(Math.random() * empty.length)];
            board[i][j] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    function draw() {
        boardDiv.innerHTML = '';
        board.forEach(row => {
            row.forEach(cell => {
                const tile = document.createElement('div');
                tile.style.cssText = `width: 80px; height: 80px; background-color: ${cell === 0 ? '#cdc1b4' : '#eee4da'}; color: #776e65; font-size: 2rem; font-weight: bold; display: flex; align-items: center; justify-content: center; border-radius: 3px; line-height: 80px;`;
                tile.textContent = cell === 0 ? '' : cell;
                if (cell >= 2048) tile.style.backgroundColor = '#edc22e';
                boardDiv.appendChild(tile);
            });
        });
        container.querySelector('#score2048').textContent = score;
    }

    function move(direction) {
        let moved = false;
        let newBoard = board.map(row => [...row]);

        if (direction === 'left' || direction === 'right') {
            for (let i = 0; i < 4; i++) {
                let row = newBoard[i];
                if (direction === 'right') row = row.reverse();
                row = slide(row);
                if (direction === 'right') row = row.reverse();
                newBoard[i] = row;
            }
        } else {
            for (let j = 0; j < 4; j++) {
                let col = [newBoard[0][j], newBoard[1][j], newBoard[2][j], newBoard[3][j]];
                if (direction === 'down') col = col.reverse();
                col = slide(col);
                if (direction === 'down') col = col.reverse();
                for (let i = 0; i < 4; i++) newBoard[i][j] = col[i];
            }
        }

        moved = JSON.stringify(board) !== JSON.stringify(newBoard);
        board = newBoard;
        if (moved) addNewTile();
        draw();
    }

    function slide(line) {
        line = line.filter(val => val !== 0);
        for (let i = 0; i < line.length - 1; i++) {
            if (line[i] === line[i + 1]) {
                line[i] *= 2;
                score += line[i];
                line.splice(i + 1, 1);
            }
        }
        while (line.length < 4) line.push(0);
        return line;
    }

    document.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
            e.preventDefault();
            const directionMap = {'ArrowLeft': 'left', 'ArrowRight': 'right', 'ArrowUp': 'up', 'ArrowDown': 'down'};
            move(directionMap[e.key]);
        }
    });

    window.reset2048 = function() {
        board = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
        score = 0;
        addNewTile();
        addNewTile();
        draw();
    };

    addNewTile();
    addNewTile();
    draw();
    return container;
}

// Rock Paper Scissors
function createRockPaperScissors() {
    const container = document.createElement('div');
    container.innerHTML = `
        <h2>Rock Paper Scissors</h2>
        <div style="text-align: center;">
            <p style="font-size: 1.2rem; margin: 1rem 0;">Your Score: <span id="playerScore">0</span> | Computer Score: <span id="computerScore">0</span></p>
            <div style="display: flex; justify-content: center; gap: 1rem; margin: 2rem 0;">
                <button onclick="playRPS('rock')" style="padding: 1rem 1.5rem; font-size: 2rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px; transition: all 0.3s;">🪨 Rock</button>
                <button onclick="playRPS('paper')" style="padding: 1rem 1.5rem; font-size: 2rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px; transition: all 0.3s;">📄 Paper</button>
                <button onclick="playRPS('scissors')" style="padding: 1rem 1.5rem; font-size: 2rem; cursor: pointer; background-color: #667eea; color: white; border: none; border-radius: 5px; transition: all 0.3s;">✂️ Scissors</button>
            </div>
            <p id="result" style="font-size: 1.5rem; font-weight: bold; color: #667eea; min-height: 2rem;"></p>
            <p id="choice" style="font-size: 1rem; color: #666;"></p>
            <button onclick="resetRPS()" style="padding: 0.5rem 1rem; margin-top: 1rem; cursor: pointer; background-color: #764ba2; color: white; border: none; border-radius: 5px;">Reset Scores</button>
        </div>
    `;

    let playerScore = 0;
    let computerScore = 0;

    window.playRPS = function(choice) {
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * 3)];
        let result = '';

        const choiceEmoji = {'rock': '🪨', 'paper': '📄', 'scissors': '✂️'};

        if (choice === computerChoice) {
            result = '🤝 Draw!';
        } else if (
            (choice === 'rock' && computerChoice === 'scissors') ||
            (choice === 'paper' && computerChoice === 'rock') ||
            (choice === 'scissors' && computerChoice === 'paper')
        ) {
            result = '🎉 You Win!';
            playerScore++;
        } else {
            result = '🤖 Computer Wins!';
            computerScore++;
        }

        container.querySelector('#result').textContent = result;
        container.querySelector('#choice').textContent = `You: ${choiceEmoji[choice]} | Computer: ${choiceEmoji[computerChoice]}`;
        container.querySelector('#playerScore').textContent = playerScore;
        container.querySelector('#computerScore').textContent = computerScore;
    };

    window.resetRPS = function() {
        playerScore = 0;
        computerScore = 0;
        container.querySelector('#playerScore').textContent = '0';
        container.querySelector('#computerScore').textContent = '0';
        container.querySelector('#result').textContent = '';
        container.querySelector('#choice').textContent = '';
    };

    return container;
}
