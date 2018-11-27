/**
 * Created by zengyu on 18-11-27.
 */
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

function random(min, max) {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
}

function randomNonzero(min, max) {
    var num = 0;
    do {
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    } while (num === 0);
    return num;
}

function Ball(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
}

Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }
    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }
    if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
    }
    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }
    this.x += this.velX;
    this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (!(this === balls[j])) {
            var dx = this.x - balls[j].x;
            var dy = this.y - balls[j].y;
            var distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.size + balls[j].size) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')';
            }
        }
    }
};

var balls = [];
var BALLS_COUNT = 20;
var handlerId = 0;
var state = false;

function initialize() {
    while (balls.length < BALLS_COUNT) {
        var ball = new Ball(
            random(0, width),
            random(0, height),
            randomNonzero(-7, 7),
            randomNonzero(-7, 7),
            'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) + ')',
            random(10, 15)
        );
        balls.push(ball);
    }
}

function loop() {
    ctx.fillStyle = 'rgb(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);

    for (var i = 0; i < balls.length; i++) {
        balls[i].draw();
        balls[i].update();
        balls[i].collisionDetect();
    }

    handlerId = requestAnimationFrame(loop);
}

function changeState() {
    if (state) {
        cancelAnimationFrame(handlerId);
        state = false;
    } else {
        loop();
        state = true;
    }
}

window.onclick = function () {
    changeState();
};

window.onresize = function () {
    if (state) {
        cancelAnimationFrame(handlerId);
    }
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (state) {
        loop();
    }
};

window.onload = function () {
    initialize();
    state = true;
    loop();
};