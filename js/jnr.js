var myGamePiece;
var myObstacles = [];
var myScore;
var lastHeight = 0;
var pseudoRndmUsed = lastHeight = Math.floor((Math.random() * 50) + 300);
var date = new Date();
var lastTime = date.getTime();
var onGround = false;
var allowDoubleJump = true;

function start() {
    //creates new player and assigns the variable myGamePiece
    myGamePiece = new Component(30, 30, "gray", 20, 120);

    //sets sizes for the component
    myScore = new Component("30px", "Consolas", "black", 280, 40, "text");

    //starts the game
    myGameArea.start();

    document.getElementById('playground').focus();
}

var myGameArea = {
    canvas: document.getElementById("playground"),
    start: function () {

        //sets canvas size
        this.canvas.width = 800;
        this.canvas.height = 500;

        //sets canvas context
        this.context = this.canvas.getContext("2d");


        //sets frame variable
        this.frameNo = 0;

        //starts repeating task which executes the updateGameArea function every 20 ms
        this.interval = setInterval(updateGameArea, 20);
        this.Cubeinterval = setInterval(updateCube, 1);


        //register KeyDown listener
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        });

        //register KeyUp listener
        window.addEventListener('keyup', function () {
            myGameArea.key = false;
        });

    },

    //clears the canvas
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
};


//updates the component's values (position, etc)
function Component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;


    this.update = function () {
        var ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    };

    //sets the new position of the cube
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;

        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    };


    //check if the cube is at the top of the canvas
    this.hitTop = function () {
        if (this.y < 0) {
            this.gravitySpeed = 0;
            this.y = 0;
        }
    };

    //check if the cube is at the bottom of the canvas
    this.hitBottom = function () {

        for (var i = 0; i < myObstacles.length; i++) {
            //30 for the size of the cube
            if ((myObstacles[i].x >= this.x && (myObstacles[i].x <= this.x + 30))) {

                var height = myObstacles[i].height - 30;


                if (this.y > height) {

                    //prevent the player from glitching to the top of the canvas
                    if (height > 10) {
                        this.y = height;
                        this.gravitySpeed = 0;
                        onGround = true;
                    }
                }


            }

        }

    };


    //checks if the cube has crashed into an obstacle
    this.crashWith = function (obstacle) {
        var myLeft = this.x;
        var myRight = this.x + (this.width);
        var myTop = this.y;
        var myBottom = this.y + (this.height);
        var otherLeft = obstacle.x;
        var otherRight = obstacle.x + (obstacle.width);
        var otherTop = myObstacles[0].y;
        var otherBottom = obstacle.y + (obstacle.height);
        var crash = false;

        if (otherTop !== 0) {



            //checks if the player crashes with the green thing
            if ((myBottom > otherTop) /*&& (myRight > otherLeft) /*|| (myLeft >= otherRight)*/) {
                console.log(myBottom + " | " + otherTop);
                crash = true;
            }
        }
        return crash;
    }
}


function updateCube() {
    date = new Date();

    //checks if pressed key is the space key
    if (myGameArea.key === 32) {

        var passedTime = date.getTime() - lastTime;

        if (onGround) {
            onGround = false;
            applyGravity();
            lastTime = date.getTime();
            allowDoubleJump = true;
        }
        /*else if (allowDoubleJump && passedTime > 300){

                       console.log("dj");

                       applyGravity();
                       lastTime = date.getTime();
                       allowDoubleJump = false;
                   }*/

    } else if (!myGameArea.key) {
        //decelerate
        accelerate(0.4);
    }
}


function applyGravity() {

    //accelerate
    accelerate(-1);

    setTimeout(function () {
        myGameArea.key = false;
    }, 150);

}


//updates Game Area [gets called every 20 ms]
function updateGameArea() {
    var x, height;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            return;
        }
    }

    //clears game area
    myGameArea.clear();

    //counts up frame nomber
    myGameArea.frameNo += 1;

    if (myGameArea.frameNo === 1) {
        for (i = 0; i < myGameArea.canvas.width; i++) {
            height = 350;
            myObstacles.push(new Component(10, height, "green", i, height));
        }
    }

    //checks if we're at the first or if the 5 frame interval has passed
    if (everyInterval(5)) {
        //creates new obstacle every 5th frame
        x = myGameArea.canvas.width;
        generateTerrain(x);
    }

    for (var i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();

        //remove obstacles from array list to prevent memory overflow
        if (myObstacles[i].x < -10) {
            myObstacles.splice(i, 1);
        }
    }

    //update score text
    myScore.text = "SCORE: " + Math.round(myGameArea.frameNo / 10);
    myScore.update();

    //set new position of player
    myGamePiece.newPos();
    myGamePiece.update();
}


function generateTerrain(x) {

    var height = 0;

    if (pseudoRndmUsed > 20) {
        var proposedLastHeight;
        do {
            proposedLastHeight = Math.floor((Math.random() * 100) + 300);
        } while (((lastHeight - proposedLastHeight) > -20) && ((lastHeight - proposedLastHeight) < 20));

        lastHeight = proposedLastHeight;

        pseudoRndmUsed = Math.floor((Math.random() * 5) + 1);
    } else {
        height = lastHeight;
        pseudoRndmUsed++;
    }

    myObstacles.push(new Component(10, height, "green", x, height));
}


function everyInterval(n) {
    return (myGameArea.frameNo / n) % 1 === 0;
}


function accelerate(n) {

    myGamePiece.gravity = n;
}