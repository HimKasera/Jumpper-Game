const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

canvas.width = window.innerWidth * 1.15;
canvas.height = window.innerHeight * 1.15;

const mario = {
    x: 50,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: 'red',
    velocityY: 0,
    isJumping: false,
    jumpCount: 0,
    isSad: false
};

const gravity = 0.5;
const platforms = [
    { x: 0, y: canvas.height - 100, width: canvas.width, height: 20 }
];

const enemy = {
    x: canvas.width + Math.random() * 500,
    y: canvas.height - 150,
    width: 50,
    height: 50,
    color: 'brown',
    speed: 4,
    passed: false,
    hornSize: 10
};

const clouds = [];

let score = 0;
let speedMultiplier = 10;
let enemyTimer = 0;
let enemyInterval = Math.random() * 20 + 10;
let keys = {
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false
};

document.getElementById('start-button').style.display = 'block';

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-button').style.display = 'none';
    document.getElementById('color-selection').style.display = 'block';
});

document.getElementById('restart-button').addEventListener('click', () => {
    document.location.reload();
});

window.addEventListener('keydown', (e) => {
    if (e.code in keys) keys[e.code] = true;
    if (e.code === 'ArrowUp' && !mario.isJumping) {
        mario.velocityY = -10;
        mario.isJumping = true;
        mario.jumpCount++;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.code in keys) keys[e.code] = false;
});

function selectColor(color) {
    mario.color = color;
    document.getElementById('color-selection').style.display = 'none';
    document.getElementById('score').style.display = 'block';
    gameLoop();
}

function resetEnemy() {
    setTimeout(() => {
        enemy.x = canvas.width + Math.random() * 500;
        enemy.speed = 0.5 * speedMultiplier;
        enemy.passed = false;
        enemyInterval *= 0.9;
        if (enemyInterval < 500) enemyInterval = 500;
        console.log('Next enemy in:', enemyInterval);
    }, enemyInterval);
}

function createCloud() {
    const cloud = {
        x: canvas.width + Math.random() * 500,
        y: Math.random() * 150 * 0.85,
        width: Math.random() * 100 + 50,
        height: Math.random() * 30 + 20,
        speed: Math.random() * 0.5 + 0.5
    };
    clouds.push(cloud);
}

function updateClouds() {
    clouds.forEach((cloud, index) => {
        cloud.x -= cloud.speed;
        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
        }
    });

    if (Math.random() < 0.0065) {
        createCloud();
    }
}

function drawDevilishEnemy() {
    ctx.fillStyle = enemy.color;
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 2, enemy.y);
    ctx.lineTo(enemy.x, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width, enemy.y + enemy.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 4, enemy.y - enemy.hornSize);
    ctx.lineTo(enemy.x + enemy.width / 6, enemy.y - enemy.hornSize * 2);
    ctx.lineTo(enemy.x + enemy.width / 3, enemy.y - enemy.hornSize);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(enemy.x + (3 * enemy.width) / 4, enemy.y - enemy.hornSize);
    ctx.lineTo(enemy.x + (5 * enemy.width) / 6, enemy.y - enemy.hornSize * 2);
    ctx.lineTo(enemy.x + (2 * enemy.width) / 3, enemy.y - enemy.hornSize);
    ctx.fill();

    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.width / 3, enemy.y + enemy.height / 4, 7, 0, Math.PI * 2);
    ctx.arc(enemy.x + (2 * enemy.width) / 3, enemy.y + enemy.height / 4, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.width / 3, enemy.y + enemy.height / 4, 3, 0, Math.PI * 2);
    ctx.arc(enemy.x + (2 * enemy.width) / 3, enemy.y + enemy.height / 4, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 4, enemy.y + enemy.height * 0.6);
    ctx.lineTo(enemy.x + enemy.width / 2, enemy.y + enemy.height * 0.75);
    ctx.lineTo(enemy.x + (3 * enemy.width) / 4, enemy.y + enemy.height * 0.6);
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.closePath();
}

function drawMario() {
    ctx.beginPath();
    ctx.arc(mario.x + mario.width / 2, mario.y + mario.height / 2, mario.width / 2, 0, Math.PI * 2);
    ctx.fillStyle = mario.color;
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(mario.x + 15, mario.y + 20, 5, 0, Math.PI * 2);
    ctx.arc(mario.x + 35, mario.y + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(mario.x + 15, mario.y + 20, 2, 0, Math.PI * 2);
    ctx.arc(mario.x + 35, mario.y + 20, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    if (!mario.isSad) {
        ctx.beginPath();
        ctx.arc(mario.x + mario.width / 2, mario.y + mario.height / 2 + 5, 15, 0, Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    } else {
        ctx.beginPath();
        ctx.arc(mario.x + mario.width / 2, mario.y + mario.height / 2 + 5, 15, Math.PI, 2 * Math.PI);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'skyblue');
    gradient.addColorStop(1, 'lightgreen');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    clouds.forEach(cloud => {
        ctx.beginPath();
        ctx.arc(cloud.x, cloud.y, cloud.width / 2, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(cloud.x + cloud.width / 2, cloud.y, cloud.width / 2, Math.PI * 1.5, Math.PI * 0.5);
        ctx.closePath();
        ctx.fill();
    });

    drawMario();
    drawDevilishEnemy();

    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    if (keys.ArrowLeft) mario.x -= 5;
    if (keys.ArrowRight) mario.x += 5;

    mario.velocityY += gravity;
    mario.y += mario.velocityY;

    platforms.forEach(platform => {
        if (
            mario.x < platform.x + platform.width &&
            mario.x + mario.width > platform.x &&
            mario.y + mario.height > platform.y &&
            mario.y + mario.height < platform.y + platform.height
        ) {
            mario.velocityY = 0;
            mario.isJumping = false;
            mario.y = platform.y - mario.height;
        }
    });

    enemy.x -= enemy.speed;
    if (enemy.x + enemy.width < 0) {
        resetEnemy();
    }

    if (mario.isJumping && !enemy.passed && mario.x + mario.width > enemy.x + enemy.width) {
        score++;
        enemy.passed = true;
        document.getElementById('score').innerText = `Score: ${score}`;
    }

    if (
        mario.x < enemy.x + enemy.width &&
        mario.x + mario.width > enemy.x &&
        mario.y < enemy.y + enemy.height &&
        mario.y + mario.height > enemy.y
    ) {
        mario.isSad = true;
        document.getElementById('restart-button').style.display = 'block';
        return;
    }

    if (enemy.x + enemy.width < 0 && !enemy.passed) {
        resetEnemy();
    }

    updateClouds();

    requestAnimationFrame(gameLoop);
}
