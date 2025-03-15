const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playerWidth = 50;
const playerHeight = 50;
    
let bulletWidth = 5;
let bulletHeight = 20;
let enemyWidth = 50;
let enemyHeight = 50;

// Player
let player = {
    x: canvas.width / 2 - playerWidth / 2,
    y: canvas.height - playerHeight - 10,
    width: playerWidth,
    height: playerHeight,
    speed: 5,
    dx: 0,
    health:100,
    level:1,
    unlocked: ["Pistol"],
    gun: "Pistol",
    gunSpeed:400,
    money:500,
    totalmoney:500,
};
let start;
let inGameTime = 0;
let score = 0;
let offset = 10; // for cleaner hitboxes
let curpoints = 25;
// Bullets array
let bullets = [];
let strikes = "XXXXX"
let grenades = "OOO";
// Enemies array
let enemies = [];
let enemySpeed = 2;
let currentEnemyHealth = 1;
let enemyFrequency = 60;
let gameover = false
// Key events for player movement
let keys = {
    right: false,
    left: false,
    space: false
};
// when selected check data and use for functions
// 
const weapons = {
    Pistol:{
        speed: 600, // delay
        color: "gold",
        ammo: 18
    },
    SMG: { 
        speed: 400,
        color: "silver",
        ammo: 120
    }
};

// event handlers
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") keys.right = true;
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = true;
    if (e.key === " " || e.key === "Enter") keys.space = true;
    e.preventDefault()
});

document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowRight" || e.key === "d") keys.right = false;
    if (e.key === "ArrowLeft" || e.key === "a") keys.left = false;
    if (e.key === " " || e.key === "Enter") keys.space = false;
});

let gun_buttons = document.querySelectorAll(".button_g");

for (let k = 0; k < gun_buttons.length; k++) {
    gun_buttons[k].addEventListener("click", function() {
        const name = this.id;
        if (name == "SMG") {
            player.money -= 1000
            player.gun = "SMG"
        }
        return 0;
    });
}

    let def_buttons = document.querySelectorAll(".button_u");

for (let k = 0; k < def_buttons.length; k++) {
    def_buttons[k].addEventListener("click", function() {
        const name = this.id;
        if (name == "Heal") {
            player.money -= 100;
            player.health += 10;
        }
        return 0;
    });
}
// Move player
function movePlayer() {
    if (keys.right && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
    if (keys.left && player.x > 0) {
        player.x -= player.speed;
    }
}

// Shoot bullets
function shootBullet() {
    let t = setTimeout(function() {
    if (keys.space) {
            let bullet = {
            x: player.x + player.width / 2 - bulletWidth / 2,
            y: player.y,
            width: bulletWidth,
            height: bulletHeight,
            speed: 5,
            hits: currentEnemyHealth
        };
        bullets.push(bullet);
        keys.space = false; // Prevent continuous shooting
    }
   },player.gunSpeed);

}

// Move bullets
function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Create enemies
function createEnemies() {
    if (Math.random() < 1 / enemyFrequency) {
        let enemy = {
            x: Math.random() * (canvas.width - enemyWidth),
            y: -enemyHeight,
            width: enemyWidth,
            height: enemyHeight,
            speed: enemySpeed
        };
        enemies.push(enemy);
    }
}


// Move enemies
function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += (enemies[i].speed + Math.floor(Math.random()*1));
        if (enemies[i].y > canvas.height) {
            enemies.splice(i, 1);
            strikes = strikes.slice(0, -1)
            i--;
        }
    }
}

// Detect collisions between bullets and enemies
function detectCollisions() {
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemyWidth &&
                bullets[i].x + bulletWidth > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemyHeight &&
                bullets[i].y + bulletHeight > enemies[j].y
            ) {
                bullets[i].hits--
                if (bullets[i].hits <= 0) {
                enemies.splice(j, 1);
                player.money += curpoints;
                player.totalmoney += curpoints;
                    }
                checkLevel();
                bullets.splice(i, 1);
                i--;
                break;
            }
           
        }
    }
    for (let j = 0; j < enemies.length; j++) {
        if (  player.x + player.width-offset >= enemies[j].x && 
                enemies[j].x + enemies[j].width-offset >= player.x && 
                player.y + player.height-offset >= enemies[j].y && 
                enemies[j].y + enemies[j].height-offset >= player.y
                        ) 
                {
                    enemies.splice(j, 1);
                    player.health -= 10
                    break;
                }
    }
}

// Draw player
function drawPlayer() {
    ctx.fillStyle = "green";
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
    ctx.fillStyle = "gold";
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
    }
}

// Draw enemies
function drawEnemies() {
   if (player.level < 3) {
        ctx.fillStyle = "red";
        currentEnemyHealth = 1;
        curpoints = 25
   }
   else if (player.level < 6) {
        ctx.fillStyle = "Orange"
        curentEnemyHealth = 1
        curpoints = 50
   }

   else if (player.level < 8) {
        ctx.fillStyle = "magenta"
        curentEnemyHealth = 3
        enemyWidth = 120;
        enemyHeight = 70;
        enemyFrequency = 100;
        curpoints = 125
   }
   else if (player.level < 12) {
        ctx.fillStyle = "blue"
        curentEnemyHealth = 6
        enemyWidth = 120;
        enemyHeight = 120;
        enemyFrequency = 90;
        curpoints = 250
   }
    
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }
}
function getbars(health) {
    let number = Math.floor(health / 10)
    let string = ""
    for (const x of Array(number)) {
        string += "🟩"
    }
    return string;
}
function drawHud() {
    ctx.fillText(`Health: ${getbars(player.health)}`,10, 20)
    ctx.fillText(`Level: ${player.level}`,10, 50)
    ctx.fillText(`Wall: ${strikes}`,10, 80)
    ctx.fillText(`Weapon: ${player.gun}`,450, 20)
    ctx.fillText(`Money: $${player.money}`,450, 50)
    ctx.fillText(`Grenades: ${grenades}`,450, 80)




}
function checkLife() {
    if (player.health <= 0) {
        gameover = true;
    }
}
function checkLevel() {
    if (player.totalmoney % 800 == 0) {
        levelUp()
    }

};
function levelUp() {
    enemySpeed += .5;
    player.level += 1;
}



// Update the game
// GAME LOOP
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameover) {
    movePlayer();
    shootBullet();
    moveBullets();
    createEnemies();
    moveEnemies();
    detectCollisions();

    drawPlayer();
    drawBullets();
    drawEnemies();
    drawHud();
    checkLife();
    

    requestAnimationFrame(update);
    }
}

// Start the game
const init = () => {
    ctx.font = "24px serif"
    start = new Date().getTime()
    update();
}

