let bird, score, pipes, ground;
let gameStopped;

function setup() {
    createCanvas(640, 480);
    this.createWorld();
}

function createWorld() {
    pipes = [];
    pipes.push(new Pipe());

    gameStopped = false;

    ground = new Ground();
    bird = new Bird();
    score = new Score();
}

function reset() {
    this.createWorld();
}

function draw() {
    background('#81D4FA');  // blue

    if (frameCount % 80 === 0) {
        pipes.push(new Pipe());
    }

    for (let index = pipes.length - 1; index >= 0; index--) {
        const pipe = pipes[index];

        pipe.update();

        if (pipe.checkCollision(bird)) {
            gameStopped = true;
        }

        if (pipe.isOffScreen()) {
            pipes.splice(index, 1);
        }
    }

    if (ground.checkCollision(bird)){
        gameStopped = true;
    }

    bird.update();
    score.update();
    ground.draw();
}

function keyPressed() {
    if (key === ' ') {
        if (gameStopped) {
            this.createWorld();
            return;
        }

        bird.up();
    }
}

class Ground {
    constructor() {
        this.height = 60;
        this.width = width + 20
        this.y = height - this.height;
        this.x = 0;
    }

    draw() {
        fill('#FFB74D');  // orange
        stroke('#000');
        strokeWeight(3.5);

        rect(this.x, this.y, this.width, this.height);
    }

    checkCollision(bird) {
        return bird.y >= this.y;
    }
}

class Score {
    constructor() {
        this.value = 0;
        this.fontSize = 64;
        this.x = width / 2 - this.fontSize / 2;
        this.y = height / 2 - this.fontSize;

        textSize(this.fontSize);
    }

    draw() {
        fill('#EEEEEE');  // off white
        stroke('#000');
        strokeWeight(10);

        text(Math.round(this.value), this.x, this.y);
    }

    update() {
        this.draw();

        if (gameStopped)
            return;

        this.value += 0.1;
    }

    reset() {
        this.value = 0;
    }
}

class Bird {
    constructor() {
        this.y = height / 2;
        this.x = width / 2;

        this.size = 42;
        this.radius = this.size / 2;
        this.gravity = 0.9;
        this.velocity = 0;
        this.lift = -15;
    }

    up() {
        this.velocity += this.lift;
    }

    draw() {
        fill('#FDD835');  // yellow
        strokeWeight(3.5);
        ellipse(this.x, this.y, this.size, this.size);
    }

    update() {
        this.velocity += this.gravity;
        this.velocity *= 0.9;
        this.y += this.velocity;

        if (this.y > height - ground.height) {
            this.y = height - ground.height;
            this.velocity = 0;
        }

        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }

        this.draw();
    }
}

class Pipe {
    constructor() {
        this.top = random(height / 2);
        this.bottom = random(height / 2);

        this.x = width;
        this.pipeWidth = 80;
        this.speed = 5;
        this.hasCollided = false;

        this.spacing = 50;
    }

    isOffScreen() {
        return this.x < -this.pipeWidth;
    }

    checkCollision(bird) {
        if (bird.y < this.top || bird.y > height - this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.pipeWidth) {
                this.hasCollided = true;
                return true;
            }
        }

        this.hasCollided = false;
        return false;
    }

    draw() {
        strokeWeight(3.5);
        fill('#9CCC65');  // green

        rect(this.x, -5, this.pipeWidth, this.top);
        rect(this.x, height - this.bottom, this.pipeWidth, this.bottom + 5);
    }

    update() {
        if (gameStopped) {
            this.speed = 0;
        }

        this.x -= this.speed;
        this.draw();
    }
}