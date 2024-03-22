//variabel untuk mengatur canvas
var tileSize = 50;
var rows = 10;
var columns = 15;
var canvas;
var canvasWidth = tileSize * columns;
var canvasHeight = tileSize * rows;
var c;

//variabel pendukung
var gameOver = false;
var score = 0;
var health = 3;

window.onload = function(){
    canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    c = canvas.getContext("2d");
    
    //variabel game over
    var gameOverPopup = document.getElementById("gameOverPopup");
    var scoreDisplay = document.getElementById("scoreDisplay");

    function startGame(){
        mouse = {
            x: canvasWidth/2,
            y: canvasHeight-50
        };

    //variabel plane
        var planeWidth = 60;
        var planeHeight = 60;
        var planeImg = new Image();
        planeImg.src = "./zimage-Plane.png";

    //variabel Peluru
        var PeluruArray = []; 
        var peluruWidth = 4;
        var peluruHeight = 10;
        var peluruSpeed = 10;
  
    //variabel alien
        var alienArray = []; 
        var alienWidth =50;
        var alienHeight = 40;
        var alienImg = new Image();
        alienImg.src = "./zimage-Ufo.png"
    
    //variabel healty box
        var healthBoxArray = []; 
        var healthBox_Width = 50;
        var healthBox_Height = 50;
        var healthBoxImg = new Image();
        healthBoxImg.src = "./zimage-Healtbox.png";
    
    // membuat dan menampilkan plane
        var plane = new Plane (canvasWidth / 2, canvasHeight - planeHeight / 2 - 2, planeWidth, planeHeight);
        function Plane(x, y, width, height){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
  
            this.draw = function(){
                c.beginPath();
                c.drawImage(planeImg, this.x - this.width / 2, this.y - this.height/2, this.width, this.height); 
            };
  
            this.update = function(){
                this.draw();
            };
        }
  
    //membuat peluru
        function Peluru(x, y, width, height, speed){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
  
            this.draw = function(){
                c.beginPath();
                c.rect(this.x, this.y, this.width, this.height);
                c.fillStyle = "white";
                c.fill();
            };
  
            this.update = function(){
                this.y -= this.speed;
                this.draw();
            };
        }
    //membuat alien
        function Alien(x, y, width, height, speed){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
  
            this.draw = function(){
                c.beginPath();
                c.drawImage(alienImg, this.x, this.y, this.width, this.height);
            };
  
            this.update = function(){
                this.y += this.speed;
                this.draw();
            };
        }

    //membuat health box
        function HealthBox(x, y, width, height, speed){
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
  
            this.draw = function(){
                c.beginPath();
                c.drawImage(healthBoxImg, this.x, this.y, this.width, this.height);
            };
  
            this.update = function(){
                this.y += this.speed;
                this.draw();
            };
        }
    
    //Menampilkan alien
        function drawAliens(){
            for (var i = 0; i < 1; i++){ 
                var x = Math.random()*(canvasWidth - alienWidth);
                var y = - alienHeight; 
                var width = alienWidth;
                var height = alienHeight;
                var speed = Math.random()*2;
                var alien = new Alien(x, y, width, height, speed);
                alienArray.push(alien);
            }
        }
        setInterval(drawAliens, 1200);
  
    //menampilkan health box
        function drawHealthBox(){
            for (var j = 0; j < 1; j++){   
                var x = Math.random()*(canvasWidth - alienWidth);
                var y = - alienHeight; 
                var width = healthBox_Width;
                var height = healthBox_Height;
                var speed = Math.random()*2.6;
                var healthBox = new HealthBox(x, y, width, height, speed);
                healthBoxArray.push(healthBox); 
            }
        }
        setInterval(drawHealthBox, 15000);
    
    //Tembakan
        function shoot(){ 
            if(gameOver){
                return;
            }
            var peluruSound = new Audio("./Tembak-sfx.mp4");
            var x = plane.x - peluruWidth/2;
            var y = plane.y - peluruHeight;
            var peluru = new Peluru(x, y, peluruWidth, peluruHeight, peluruSpeed);
            PeluruArray.push(peluru);
            peluruSound.currentTime = 0;
            peluruSound.play();
        }

    //movePlane
        var keyRightPressed = false;
        var keyLeftPressed = false;
        var spacePressed = false;
        document.addEventListener("keydown", keyDownHandler, false);
        document.addEventListener("keyup", keyUpHandler, false);
        function keyDownHandler(e){
            if(e.key == "ArrowRight"){
                keyRightPressed = true;
            }
            else if(e.key == "ArrowLeft"){
                keyLeftPressed = true;
            }
            else if(e.key == " "){
                spacePressed = true;
                shoot();
            }
        }

    //fungsu untuk mengatur NAVIGASI GAME
        function keyUpHandler(e){
            if(e.key == "ArrowRight"){
                keyRightPressed = false;
            }
            else if(e.key == "ArrowLeft"){
                keyLeftPressed = false;
            }
            else if(e.key == " "){
                spacePressed = false;
            }
        }
    
    //mendeteksi adanya tabrakan antara alien, healtbox dan peluru
        function collision(a,b){
            return a.x < b.x + b.width &&
                a.x + a.width > b.x &&
                a.y < b.y + b.height &&
                a.y + a.height > b.y;
        }
    
    //mencegah default error
        function stoperror() {
            return true;
        }  
        window.onerror = stoperror;

    //fungsi untuk mengatur POP UP GAME OVER.
        function showGameOver(){
            gameOverPopup.style.display = "block";
            scoreDisplay.innerText = "Score: " + score;
            
        }
        
        function animate(){
            requestAnimationFrame(animate); 
            c.beginPath(); 
            c.clearRect(0, 0, canvas.width, canvas.height); 

            if (gameOver) {
                // Jika permainan berakhir, tampilkan popup "Game Over"
                showGameOver();
                return; // Hentikan animasi setelah permainan berakhir
            }

            if (keyRightPressed && plane.x < canvas.width - planeWidth / 2) {
                plane.x += 5; // speed pesawat
            }
            if (keyLeftPressed && plane.x > planeWidth / 2) {
                plane.x -= 5; // speed pesawat
            }

            plane.update();
  
            for (var i = 0; i < PeluruArray.length; i++){
                PeluruArray[i].update();
                if (PeluruArray[i].y < 0){
                    PeluruArray.splice(i, 1);
                }
            }
  
            for (var k = 0; k < alienArray.length; k++){
                alienArray[k].update();
                if(collision(alienArray[k], plane)){
                    health -= 1;
                    if(health == 0){
                        startGame();
                    }
                    alienArray.splice(k,1);
                }
                if (alienArray[k].y > canvasHeight){
                    alienArray.splice(k, 1);
                }
            }
  
            for(var j = alienArray.length-1; j >= 0; j--){
                for(var l = PeluruArray.length-1; l >= 0; l--){
                    if(collision(alienArray[j], PeluruArray[l])){
                        alienArray.splice(j, 1);
                        PeluruArray.splice(l, 1);
                        score++;
                    }
                }
            }
    
            for(var h = 0; h < healthBoxArray.length; h++){
                healthBoxArray[h].update();
            }

            for(var hh = healthBoxArray.length - 1; hh >= 0; hh--){
                for(var hhh = PeluruArray.length - 1; hhh >= 0; hhh--){
                    if(collision(healthBoxArray[hh], PeluruArray[hhh])){
                        healthBoxArray.splice(hh, 1);
                        PeluruArray.splice(hhh, 1);
                        health += 1;
                    }
                }
            } 
            c.font = "1em Arial";
            c.fillStyle = 'white';
            c.fillText("Health: " + health, 15, 25);  // mengatur posisi tulisan
            c.fillText("Score: " + score, canvasWidth - 100, 25); 
    
        }
        if (health <= 0) {
            gameOver = true; // Set gameOver menjadi true ketika permainan berakhir
        }

        animate();
    }
    startGame();
}; 