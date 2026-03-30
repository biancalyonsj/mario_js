// Game constants
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 2.5;
const ENEMY_SPEED = 1;

let gameState = {
    score: 0,
    level: 1,
    lives: 3,
    gameRunning: true,
    // arrow control keys
    keys: {}
};

//player object
let player = {
    element: document.getElementById("mario"),
    x: 50,
    y: 340,
    // size of the mario pixel
    width: 20,
    height: 20,
    velocityX: 0,
    velocityY: 0,
    // mario starts off by falling from the sky
    grounded: false,
    big: false,
    bigTimer: 0
}

// Game objects arrays
let gameObjects = {
    platforms: [],
    enemies: [],
    coins: [],
    surpriseBlocks: [],
    pipes: []
}

// levels
const levels = [
    // level 1
    {
        // map out where each platform will be on the map
        platforms: [
            {x: 0, y: 360, width: 400, height: 40, type: 'ground'},
            {x: 500, y: 360, width: 300, height: 40, type: 'ground'},
            {x: 200, y: 280, width: 60, height: 20, type: 'floating'},
            {x: 300, y: 240, width: 60, height: 20, type: 'floating'},
            {x: 600, y: 280, width: 80, height: 20, type: 'floating'}
            
        ],
        enemies: [
            {x: 250, y: 344, type: 'brown'},
            {x: 550, y: 344, type: 'brown'}
        ],
        coins: [
            {x: 220, y:260},
            {x: 320, y:220},
            {x: 620, y:260}
        ],
        surpriseBlocks: [
            {x: 320, y: 180, type: 'mushroom'}
        ],
        pipes: [
            {x: 750, y: 320}
        ]
    },
    //level 2
    {
        // map out where each platform will be on the map
        platforms: [
            {x: 0, y: 360, width: 200, height: 40, type: 'blue'},
            {x: 300, y: 360, width: 200, height: 40, type: 'blue'},
            {x: 600, y: 360, width: 200, height: 40, type: 'blue'},
            {x: 150, y: 300, width: 40, height: 20, type: 'blue'},
            {x: 250, y: 280, width: 40, height: 20, type: 'blue'},
            {x: 350, y: 260, width: 40, height: 20, type: 'blue'},
            {x: 450, y: 240, width: 40, height: 20, type: 'blue'},
            {x: 550, y: 280, width: 60, height: 20, type: 'blue'}
            
        ],
        enemies: [
            {x: 350, y: 344, type: 'purple'},
            {x: 650, y: 344, type: 'purple'},
            {x: 570, y: 264, type: 'purple'}
        ],
        coins: [
            {x: 170, y:280},
            {x: 270, y:260},
            {x: 370, y:240},
            {x: 470, y:220},
            {x: 570, y:260},
        ],
        surpriseBlocks: [
            {x: 200, y: 260, type: 'coin'},
            {x: 400, y: 220, type: 'mushroom'}
        ],
        pipes: [
            {x: 750, y: 320}
        ]
    },    
]

// initialize game
function initGame(){
    // we start at level 1, subtract to get acc index
    loadLevel(gameState.level - 1);
    gameLoop();
}

function loadLevel(levelIndex){
    // 
    if (levelIndex >= levels.length){
        showGameOver(true);
        return;
    }
    // clear existing object
   clearLevel();

    const level = levels[levelIndex];
    const gameArea = document.getElementById("game-area");

    //reset player
    player.x = 50;
    player.y = 340;
    player.velocityX = 0;
    player.velocityY = 0;
    player.big = false;
    player.bigTimer = 0;
    player.element.className = '';
    updateElementPosition(player.element, player.x, player.y);

    // for every playform in our level, create an element
    level.platforms.forEach((platformData, index) => {
        const platform = createElement('div', `platform ${platformData.type}`, {
            left: platformData.x + 'px',
            top: platformData.y + 'px',
            width: platformData.width + 'px',
            height: platformData.height + 'px'
        })
        // add created platform element to game area so that it is visible to the player
        gameArea.appendChild(platform);
        // update our game objects array to keep track
        gameObjects.platforms.push({
            element: platform,
            ...platformData,
            id:'platform-' + index
        })
    });

    // create enemies
    level.enemies.forEach((enemyData, index) =>{
        const enemy = createElement('div',`enemy ${enemyData.type}`, {
            left: enemyData.x + 'px',
            top: enemyData.y + 'px',
        })
        // add enemy to the game
        gameArea.appendChild(enemy);
        // keep track of newly created enemy
        gameObjects.enemies.push({
            element: enemy,
            x: enemyData.x,
            y: enemyData.y,
            width: 20,
            height: 20,
            direction: -1,
            speed: ENEMY_SPEED,
            id: `enemy-` + index,
            alive: true
        })
    })

    // create coins
    level.coins.forEach((coinData, index) =>{
        const coin = createElement('div', 'coin', {
            left: coinData.x + 'px',
            top: coinData.y + 'px'
        })
        // add coin to the game
        gameArea.appendChild(coin);
        gameObjects.coins.push({
            element: coin,
            x: coinData.x,
            y: coinData.y,
            width: 20,
            height: 20,
            collected: false,
            id: 'coin-' + index
        })
    })

    // create surprise blocks
    level.surpriseBlocks.forEach((blockData, index) => {
        const block = createElement('div', 'surprise-block', {
            left: blockData.x + 'px',
            top: blockData.y + 'px'
        })
        gameArea.appendChild(block)
        gameObjects.surpriseBlocks.push({
            element: block,
            x: blockData.x,
            y: blockData.y,
            width: 20,
            height: 20,
            type: blockData.type,
            hit: false,
            id: 'block-' + index
        })
    })
    // create pipes
    level.pipes.forEach((pipeData, index) => {
        const pipe = createElement('div', 'pipe', {
            left: pipeData.x + 'px',
            top: pipeData.y +'px',
        })
        const pipeTopLeft = createElement('div', 'pipe-top');
        const pipeTopRight = createElement('div', 'pipe-top-right');
        const pipeBottomLeft = createElement('div', 'pipe-bottom');
        const pipeBottomRight = createElement('div', 'pipe-bottom-right');
        pipe.append(pipeTopLeft, pipeTopRight, pipeBottomLeft, pipeBottomRight);
        // add all pipe varients to the game
        gameArea.appendChild(pipe);
        gameObjects.pipes.push({
            element: pipe,
            x: pipeData.x,
            y: pipeData.y,
            width: 40,
            height: 40,
            id: 'pipe-' + index
        })
    })
}

function createElement(type, className, styles = {}){
    const element = document.createElement('div');
    element.className = className;
    Object.assign(element.style, styles);
    return element;
}

function updateElementPosition(element, x, y){
    // use style on the element to set it's positioning
    element.style.left = x + 'px';
    element.style.top = y + 'px';

}

function showGameOver(won){
    gameState.gameRunning = false;
    // update HTML elements
    document.getElementById('game-over-title').textContent = won ? 'Congratulations! You won!' : 'Game over!';
    document.getElementById('final-score').textContent = gameState.score;
    document.getElementById('game-over').style.display = 'block';
}

function clearLevel(){
    //const gameArea = document.getElementById('game-area');
    Object.values(gameObjects).flat().forEach(obj =>{
        if (obj.element && obj.element.parentNode){
            obj.element.remove();
        }
    })

    gameObjects = {
        platforms: [],
        enemies: [],
        coins: [],
        surpriseBlocks: [],
        pipes: []
    }
}

// Input handling
document.addEventListener('keydown', (e) => {
    gameState.keys[e.code] = true;

    if(e.code === "Space"){
        e.preventDefault();
    }
})

document.addEventListener('keyup', (e) => {
    gameState.keys[e.code] = false;
})

function gameLoop(){
    if (!gameState.gameRunning){
        return;
    }
    // runs the function to get user input keys WASD
    update();
    requestAnimationFrame(gameLoop);
}

//update game logic
function update(){
    // support WASD controls
    if(gameState.keys['ArrowLeft'] || gameState.keys['KeyA']){
        player.velocityX = -MOVE_SPEED;
    } else if (gameState.keys['ArrowRight'] || gameState.keys['KeyD']){
        player.velocityX = MOVE_SPEED;
    } else {
        // apply friction
        player.velocityX *= 0.8;
    }

    // jumping controls
    if(gameState.keys['Space'] && player.grounded){
        player.velocityY = JUMP_FORCE;
        // player is in the air
        player.grounded = false;
    }

    // apply gravity
    if(!player.grounded){
        player.velocityY += GRAVITY;
    }

    // update player position
    player.x += player.velocityX;
    player.y += player.velocityY;

    // platform collision
    player.grounded = false;
    for (let platform of gameObjects.platforms){
        if(checkCollision(player, platform)){
            // mario is falling
            if (player.velocityY > 0){
                // mario lands on the platform
                player.y = platform.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
        }
    }

    // pipe collision
    for (let pipe of gameObjects.pipes){
        if(checkCollision(player, pipe)){
            // mario falls into the pipe
            if(player.velocityY > 0){
                player.y = pipe.y - player.height;
                player.velocityY = 0;
                player.grounded = true;
            }
        }
    }
    
    // enemy movement + collision
    for (let enemy of gameObjects.enemies){
        // do not move dead enemies
        if(!enemy.alive) continue;
        // move the enemy in that direction
        enemy.x += enemy.speed * enemy.direction;

        let onPlatform = false;
        // reverse direction when enemy hits platform edges or boundaries
        for (let platform of gameObjects.platforms){
            // check for collision
            if (enemy.x + enemy.width > platform.x &&
                enemy.x < platform.x + platform.width &&
                enemy.y + enemy.height >= platform.y -4 &&
                enemy.y + enemy.height <= platform.y +4
            ){
                onPlatform = true;
                break;
            }
        }
        if(!onPlatform || enemy.x <= 0 || enemy.x >= 800){
            enemy.direction *= -1;
        }
        updateElementPosition(enemy.element, enemy.x, enemy.y);

        // check player enemy collision
        if(checkCollision(player, enemy)){
            // mario is jumping on the enemy
            if (player.velocityY > 0 && player.y < enemy.y){
                enemy.alive = false;
                enemy.element.remove();
                player.velocityY = JUMP_FORCE * 0.7;
                gameState.score += 100;
            } else {
                // hit by enemy
                if (player.big){
                    player.big = false;
                    player.bigTimer = 0;
                    player.element.classList.remove('big');
                    player.width = 20;
                    player.height = 20;
                } else if (player.grounded) {
                    loseLife();
                }
            }
        }
    }

    // coin collection
    for (let coin of gameObjects.coins){
        // mario runs into new coin
        if(!coin.collected && checkCollision(player, coin)){
            coin.collected = true;
            coin.element.remove();
            gameState.score += 50;
        }
    }

    // surprise block collision
    for (let block of gameObjects.surpriseBlocks){
        if (!block.hit && checkCollision(player, block) && player.velocityY < 0){
            block.hit = true;
            block.element.classList.add('hit');
            spawnItemOnBox(block, block.type);
            // different types of blocks conditions
            if (block.type === 'mushroom'){
                player.big = true;
                player.bigTimer = 600;
                player.element.classList.add('big');
                player.width = 30;
                player.height = 30;
                gameState.score += 100;
            } else if (block.type === 'coin'){
                gameState.score += 50;
            }
        }
    }

    // pipe collision down to next level
    for (let pipe of gameObjects.pipes){
        if (player.grounded && 
            player.x + player.width > pipe.x &&
            player.x < pipe.x + pipe.width &&
            Math.abs(player.y + player.height - pipe.y) < 5 &&
            gameState.keys['ArrowDown']){
            nextLevel();
        }
    }

    // Fall death
    if (player.y > 400){
        loseLife()
    }

    // move mario on screen
    updateElementPosition(player.element, player.x, player.y);

    // update the game ui
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('level').textContent = gameState.level;
    document.getElementById('lives').textContent = gameState.lives;
}

function checkCollision(element1, element2){
    // check if the areas of the two elements overlap
    return element1.x < element2.x + element2.width &&
        element1.x + element1.width > element2.x &&
        element1.y < element2.y + element2.height &&
        element1.y + element1.height > element2.y;
}

function spawnItemOnBox(block, type){
    const gameArea = document.getElementById('game-area');
    // create a new item to add to our game
    const item = document.createElement('div');
    // mushroom or coin item
    item.classList.add(type);
    // position item on top of surprise block
    item.style.left = block.x + 'px';
    item.style.top = (block.y - 20) + 'px';
    gameArea.appendChild(item);
    // create new item object to add to our game
    const itemObj = {
        x: block.x,
        y: block.y,
        width: 20,
        height: 20,
        element: item,
        velocityY: 0
    };
    if (type === 'mushroom'){
        const fallInterval = setInterval(() => {
            // animate mushroom falling down
            itemObj.velocityY += GRAVITY;
            itemObj.y += itemObj.velocityY;

            // check if mushroom lands on platform
            let onPlatform = false;
            for (let platform of gameObjects.platforms){
                if (itemObj.x < platform.x + platform.width &&
                    itemObj.x + itemObj.width > platform.x &&
                    itemObj.y + itemObj.height >= platform.y &&
                    itemObj.y + itemObj.height <= platform.y + 5
                ){
                    // item is on platform
                    onPlatform = true;
                    // position the mushroom on top of platform and stop movement
                    itemObj.y = platform.y - itemObj.height;
                    itemObj.velocityY = 0;
                    item.remove();
                    break;
                }
            }
            // update the DOM element
            item.style.top = itemObj.y + 'px';
            // stop the animation
            if (onPlatform){
                clearInterval(fallInterval);
            }
        }, 16)
    } else if (type === 'coin'){
        let frames = 0;
        // animate coin floating up
        const floatInterval = setInterval(() => {
            itemObj.y -= 1;
            item.style.top = itemObj.y + 'px';
            frames ++;
            // stop the animation
            if (frames >= 180){
                clearInterval(floatInterval);
                item.remove()
            }
        }, 60)
    }
}

function loseLife(){
    // update lives
    gameState.lives --;
    // check if player has lost all 3 lives
    if(gameState.lives <= 0){
        showGameOver(false);
    } else {
        player.x = 50;
        player.y = 340;
        player.velocityX = 0;
        player.velocityY = 0;
        player.big = false;
        player.bigTimer = 0;
        player.element.classList.remove('big');
        player.width = 20;
        player.height = 20;
    }
}

function nextLevel(){
    gameState.level++;
    // out of levels, so game is over
    if (gameState.level > levels.length){
        showGameOver(true);
    } else {
        player.element.classList.remove('big');
        player.width = 20;
        player.height = 20;
        loadLevel(gameState.level - 1);
    }
}


function restartGame(){
    // reset game state to original state
    gameState = {
        score: 0,
        level: 1,
        lives: 3,
        gameRunning: true,
        // arrow control keys
        keys: {}
    };

    // reset player to original state
    player.x = 50;
    player.y = 340;
    player.velocityX = 0;
    player.velocityY = 0;
    player.big = false;
    player.bigTimer = 0;
    player.element.classList.remove('big');
    player.width = 20;
    player.height = 20;

    document.getElementById('game-over').style.display = 'none';
    initGame();
}

const restartButton = document.getElementById('restart-button');
restartButton.addEventListener('click', restartGame);

// start the game
initGame();