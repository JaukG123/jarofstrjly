window.addEventListener("load", function(){
    //canvas
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 640;
    canvas.height = 540;
    ctx.fillStyle = '#9F75A2'
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let canvasPosition = canvas.getBoundingClientRect();

    //global variables
    let videoActive = true;

    let mouseOn = "";
    let mouseButton = "";
    let option1Clicked = false;
    let option2Clicked = false;
    let option3Clicked = false;

    let gameStarted = false;
    let gamePaused = false;
    let pauseTrue = true;

    let pedigreeActivate = false;
    let pedigreeResize = false;
    let releasePedigree = false;
    let homePedigree = true;

    let circle1X = 183;
    let circle2X = 271;
    let circle3X = 370;
    let circle4X = 461;
    let circleYPos = 475;
    let circleRadius = 41;
    let circle1guessed = false;
    let circle2guessed = false;
    let circle3guessed = false;
    let circle4guessed = false;
    let square1guessed = false;
    let guessed = false;
    let win = false;
    let lose = false;

    let info1Picked = false;
    let info2Picked = false;
    let info3Picked = false;
    let info4Picked = false;

    let genotype1 = false;
    let genotype2 = false;
    let genotype3 = false;
    let genotype4 = false;

    let frame = 0;

    //interaction - window resize; mouse
    window.addEventListener('resize', function(){
        canvasPosition = canvas.getBoundingClientRect();
    });
    const mouse = {
        x: 10,
        y: 10,
        width: 0.1,
        height: 0.1,
        clicked: false
    }
    canvas.addEventListener('mousemove', function(e){
        mouse.x = e.x - canvasPosition.left;
        mouse.y = e.y - canvasPosition.top;
        //if mouse on certain place, its on pedigree small
        if(mouse.x > 590 && mouse.x < 635 && mouse.y > 12 && mouse.y < 60){
            mouseOn = "pedigreeSmall";
            this.style.cursor = "pointer";
        //if mouse not on certain place & pedigree button has activated, it on pedigreezoom or big pedigree
        }else if((mouse.x > 115 && mouse.x < 635 && mouse.y > 12 && mouse.y < 535) && mouseOn !== "pedigreeSmall" && pedigreeActivate){
            mouseOn = "pedigreeZoom";
            this.style.cursor = "initial";
        }else{
            this.style.cursor = "initial";
            mouseOn = "";
        }
        if(pedigreeActivate){
            if(mouse.x < 585 && mouse.x > 438 && mouse.y < 92 && mouse.y > 50){
                mouseButton = "option1";
                this.style.cursor = "pointer";
            }else if(mouse.x < 585 && mouse.x > 438 && mouse.y < 145 && mouse.y > 102){
                mouseButton = "option2";
                this.style.cursor = "pointer";
            }else if(mouse.x < 585 && mouse.x > 438 && mouse.y < 197 && mouse.y > 155){
                mouseButton = "option3";
                this.style.cursor = "pointer";
            }else if(homePedigree){
                if(Math.sqrt((mouse.x - circle1X)**2 + (mouse.y - circleYPos)**2) <= circleRadius){
                    this.style.cursor = "pointer";
                    mouseButton = "circle1";
                }else if(Math.sqrt((mouse.x - circle2X)**2 + (mouse.y - circleYPos)**2) <= circleRadius){
                    this.style.cursor = "pointer";
                    mouseButton = "circle2";
                }else if(Math.sqrt((mouse.x - circle3X)**2 + (mouse.y - circleYPos)**2) <= circleRadius){
                    this.style.cursor = "pointer";
                    mouseButton = "circle3";
                }else if(Math.sqrt((mouse.x - circle4X)**2 + (mouse.y - circleYPos)**2) <= circleRadius){
                    this.style.cursor = "pointer";
                    mouseButton = "circle4";
                }else if(mouse.x >= 525 && mouse.x <= 603 && mouse.y >= 435 && mouse.y <= 516){
                    this.style.cursor = "pointer";
                    mouseButton = "square1";
                }else{
                    mouseButton = "";
                    if(mouseOn !== "pedigreeSmall"){this.style.cursor = "initial"};
                }  
            }else{
                mouseButton = "";
                if(mouseOn !== "pedigreeSmall"){this.style.cursor = "initial"};
            }  
        }
    });
    //Notices when you click on small pedigree thing
    canvas.addEventListener("click", function(){
        if(mouseOn === "pedigreeSmall" && !pedigreeActivate){
            pedigreeActivate = true;
        }else if(mouseOn !== "pedigreeZoom" && pedigreeActivate){
            pedigreeResize = true;
        }
        if(mouseButton === "option1"){
            option1Clicked = true;
            option2Clicked = false;
            option3Clicked = false;
        }else if(mouseButton == "option2"){
            option2Clicked = true;
            option1Clicked = false;
            option3Clicked = false;
        }else if(mouseButton == "option3"){
            option3Clicked = true;
            option1Clicked = false;
            option2Clicked = false;
        }else if(homePedigree){
            if(mouseButton === "circle1" && guessed === false){
                circle1guessed = true;
                guessed = true;
                lose = true;
            }else if(mouseButton === "circle2" && guessed === false){
                circle2guessed = true;
                guessed = true;
                win = true;
            }else if(mouseButton === "circle3" && guessed === false){
                circle3guessed = true;
                guessed = true;
                lose = true;
            }else if(mouseButton === "circle4" && guessed === false){
                circle4guessed = true;
                guessed = true;
                lose = true;
            }else if(mouseButton === "square1" && guessed === false){
                square1guessed = true;
                guessed = true;
                lose = true;
            }
        }else{
            option1Clicked = false;
            option2Clicked = false;
            option3Clicked = false;
        }
    });

    //actual game
    function startGame(){
        //handles all inputs
        class InputHandler{
            constructor(){
                this.keys = [];
                this.touchY = '';
                this.touchTreshold = 25;
                window.addEventListener('keydown', e=> {
                    if((    e.key === 'ArrowDown' || 
                            e.key === 'ArrowUp' || 
                            e.key === 'ArrowLeft' || 
                            e.key === 'ArrowRight') && 
                            this.keys.indexOf(e.key) === -1){
                            this.keys.push(e.key);
                    }
                });
                window.addEventListener('keyup', e => {
                    if(     e.key === 'ArrowDown' || 
                            e.key === 'ArrowUp' || 
                            e.key === 'ArrowLeft' || 
                            e.key === 'ArrowRight' ){
                            this.keys.splice(this.keys.indexOf(e.key), 1);
                            player.frameX = 0;
                    }
                });
            }
        }
        class GameCon{
            constructor(gameWidth, gameHeight){
                this.x = 0;
                this.y = 0;
                this.width = gameWidth;
                this.height = gameHeight;
                this.image = document.getElementById('win');
            }
            update(){
                if(win){
                    this.image = document.getElementById('win');
                }else if(lose){
                    this.image = document.getElementById('lose');
                }        
            }
            draw(context){
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
        }
       
        //VIDEO TIME
        class Video{
            constructor(gameWidth, gameHeight){
                this.width = gameWidth;
                this.height = gameHeight;
                this.x = 0;
                this.y = 0;
                this.video = document.getElementById('video');
                this.frameTimer = 0;
            }
            draw(context){
                context.drawImage(this.video, this.x, this.y, this.width, this.height);
            }
        }
        //handles background
        class Background{
            constructor(gameWidth, gameHeight){
                this.width = gameWidth;
                this.height = gameHeight;
                this.x = 0;
                this.y = 0;
                this.image = document.getElementById('backgroundImage');
            }
            draw(context){
                context.drawImage(this.image, 0, 0, this.width, this.height);
            }
        }
        //handles pedigree
        class Pedigree{
            constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 40;
                this.height = this.width;
                this.x = this.gameWidth - this.width - 10;
                this.y = 10;
                this.closeImageX = this.gameWidth - this.width - 15;
                this.closeImageY = 15;
                this.image = document.getElementById('pedigreeGuess');
            }
            update(){
                //actually makes the pedrigee zoom + the cha
                if(option1Clicked === true){
                    if(this.image !== document.getElementById('pedigreeGuess')){
                        this.image = document.getElementById('pedigreeGuess');
                        option1Clicked = false;
                        homePedigree = true;
                    }else{
                        this.image = document.getElementById('pedigreeA');
                        option1Clicked = false;
                        homePedigree = false;
                    }
                }else if(option2Clicked === true){
                    if(this.image !== document.getElementById('pedigreeB') && this.image !== document.getElementById('pedigreeC')){
                        this.image = document.getElementById('pedigreeB');
                        option2Clicked = false;
                        homePedigree = false;
                    }else{
                        this.image = document.getElementById('pedigreeA');
                        option2Clicked = false;
                        homePedigree = false;
                    }
                }else if(option3Clicked === true){
                    if(this.image !== document.getElementById('pedigreeC')){
                        this.image = document.getElementById('pedigreeC')
                        option3Clicked = false;
                        homePedigree = false;
                    }else{
                        this.image = document.getElementById('pedigreeB');
                        option3Clicked = false;
                        homePedigree = false;
                    }
                }
                if(this.height <= this.gameHeight - 30 && pedigreeActivate){
                    this.width += 10;
                    this.height += 10;
                    this.x = this.gameWidth - this.width - 10;
                }else if(pedigreeResize && this.height > this.gameHeight - 30){
                    pedigreeActivate = false;
                    pedigreeResize = false;
                    releasePedigree = true;
                }else if(!pedigreeActivate && releasePedigree && this.height >= 50){
                    this.width -= 10;
                    this.height -= 10;
                    this.x = this.gameWidth - this.width - 10;
                }else if(this.height <= 50){
                    pedigreeActivate = false;
                    releasePedigree = false;
                }
            }
            draw(context){
                //draws on the pedigree
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
                //draws on the x
                if(pedigreeActivate && this.height >= 400){
                    context.drawImage(document.getElementById('closeImage'), this.closeImageX, this.closeImageY, 40, 40);
                }
            }
        }
        class Genotypes{
            constructor(){
                this.x = 0;
                this.y = 0;
                this.width = 40;
                this.height = 40;
                this.image = document.getElementById('');
            }
            draw(context){
                context.drawImage(this.image, this.x, this.y, this.width, this.height);
            }
            update(){
               
            }
        }
        //handles player
        class Player{
            constructor(gameWidth, gameHeight){
                this.gameWidth = gameWidth;
                this.gameHeight = gameHeight;
                this.width = 32;
                this.height = 71;
                this.x = 450;
                this.y = this.gameHeight - this.height;
                this.frameX = 0;
                this.frameY = 0;
                this.speedX = 0;
                this.speedY = 0;
                this.image = document.getElementById('playerImage');
            }
           
            //handles impact of inputs: right & left arrows
            update(input, context){
                if(!(this.y < 0 && input.keys.indexOf('ArrowUp') > -1) && !(this.y + this.height > this.gameHeight && input.keys.indexOf('ArrowDown') > -1)){
                    if(this.speedY >= 0 && (this.y + this.height < this.gameHeight)){
                        if(input.keys.indexOf('ArrowDown') > -1){
                            this.speedY = 5;
                            this.frameY = 2;
                        }else if(input.keys.indexOf('ArrowUp') > -1){
                            this.speedY = -5;
                            this.frameY = 1;
                        }else{this.speedY = 0;}
                    }else if(this.speedY <= 0){
                        if(input.keys.indexOf('ArrowUp') > -1){
                            this.speedY = -5;
                            this.frameY = 1;
                        }else if(input.keys.indexOf('ArrowDown') > -1){
                            this.speedY = 5;
                            this.frameY = 2;
                        }else{this.speedY = 0;}
                    }
                }else{this.speedY = 0;}
                if(!(this.x <= 0 && input.keys.indexOf('ArrowLeft') > -1) && !(this.x + this.width >= this.gameWidth && input.keys.indexOf('ArrowRight') > -1)){
                    if(this.speedX >= 0 && (this.x + this.width < this.gameWidth)){
                        if(input.keys.indexOf('ArrowRight') > -1){
                            this.speedX = 5;
                            this.frameY = 3;
                        }else if(input.keys.indexOf('ArrowLeft') > -1){
                            this.speedX = -5;
                            this.frameY = 4;
                        }else{this.speedX = 0;}
                    }else if(this.speedX <= 0){
                        if(input.keys.indexOf('ArrowLeft') > -1){
                            this.speedX = -5;
                            this.frameY = 4;
                        }else if(input.keys.indexOf('ArrowRight') > -1){
                            this.speedX = 5;
                            this.frameY = 3;
                        }else{this.speedX = 0;}
                    }
                //handles impacts of inputs: Up and Down Arrows
                }else{this.speedX = 0;}
                if(!input.keys.length > 0){this.frameY = 0;}

                this.x += this.speedX;
                this.y += this.speedY;

                //collsion detection
                //bottom box
                if(this.y >= 285 && this.y <= 300 && (this.x >= 300 && this.x <= 400)) {
                    this.y -= 5;
                }
                if(this.x + this.width >= 300 && this.x <= 349 && (this.y > 291)){
                    this.x -= 5;
                }
                if(this.x + this.width >= 351 && this.x <= 400 && (this.y > 291)){
                    this.x += 5;
                }
               
                //Left Box
                if(this.x <= 225 && this.x >= 214 && ((this.y > 222 && this.y < 288) || (this.y + this.height > 222 && this.y + this.height < 288) || (this.y + this.height/2 > 220 && this.y + this.height/2 < 290))){
                    this.x += 5;
                }
                if(this.y <= 290 && this.y + this.height >= 251 && ((this.x < 225 || this.x + this.width < 225))){
                    this.y += 5;
                }
                if(this.y + this.height >= 220 && this.y <= 249 && ((this.x < 225 || this.x + this.height < 225))){
                    this.y -= 5;
                }

                //top box
                if(this.y < 220 && this.y > 214 && (this.x + this.width >= 363 && this.x <= 455)){
                    this.y += 5;
                }
                if(this.x + this.width >= 363 && this.x <= 400 && (this.y < 220)){
                    this.x -= 5;
                }
                if(this.x <= 455 && this.x + this.width >= 405 && (this.y < 220)){
                    this.x += 5;
                }

                //top genotype
                if(this.x + this.width > 78 && this.x < 147 && this.y + this.height > 28 && this.y < 88){
                    genotypes1.width = 400;
                    genotypes1.height = 400;
                    genotypes1.x = 80;
                    genotypes1.y = 80;
                    context.textAlign = 'left';
                    context.font = '25px Orbitron';
                    context.fillStyle = '#82FF9E';
                    context.fillText("THE THEIF'S GRANDFATHER IS 'Hh'", 90, 70);

                    info1Picked = true;
                    genotype1 = true;
                }else{
                    genotypes1.width = 40;
                    genotypes1.height = 40;
                    genotypes1.x = 78 + genotypes1.width/4;
                    genotypes1.y = 28 + genotypes1.height/6;
                }

                //right genotype
                if(this.x + this.width > 509 && this.x < 570 && this.y + this.height > 118 && this.y < 190){
                    genotypes2.width = 400;
                    genotypes2.height = 400;
                    genotypes2.x = 80;
                    genotypes2.y = 80;
                    context.textAlign = 'left';
                    context.font = '25px Orbitron';
                    context.fillStyle = '#82FF9E';
                    context.fillText("THE THEIF'S AUNT IS 'Ee'", 90, 70);

                    info2Picked = true;
                    genotype2 = true;
                }else{
                    genotypes2.width = 40;
                    genotypes2.height = 40;
                    genotypes2.x = 509 + genotypes2.width/5;
                    genotypes2.y = 118 + genotypes2.height/4;
                }
         
                //bottom genotype
                if(this.x + this.width > 0 && this.x < 100 && this.y + this.height > 470 && this.y < 540){
                    genotypes3.width = 400;
                    genotypes3.height = 400;
                    genotypes3.x = 80;
                    genotypes3.y = 80;
                    context.textAlign = 'left';
                    context.font = '25px Orbitron';
                    context.fillStyle = '#82FF9E';
                    context.fillText("THE THEIF IS NOT 'Bb'", 90, 70);

                    info3Picked = true;
                    genotype3 = true;
                }else{
                    genotypes3.width = 40;
                    genotypes3.height = 40;
                    genotypes3.x = 0 + genotypes3.width/2;
                    genotypes3.y = 470 + genotypes3.height/4;
                }

                //middle genotype
                if(this.x + this.width > 285 && this.x < 380 && this.y + this.height > 240 && this.y < 340){
                    genotypes4.width = 400;
                    genotypes4.height = 400;
                    genotypes4.x = 80;
                    genotypes4.y = 80;
                    context.textAlign = 'left';
                    context.font = '25px Orbitron';
                    context.fillStyle = '#82FF9E';
                    context.fillText("THE THEIF IS RECESSIVE 1+ TRAITS", 90, 70);

                    info4Picked = true;
                    genotype4 = true;
                }else{
                    genotypes4.width = 40;
                    genotypes4.height = 40;
                    genotypes4.x = 285 + genotypes4.width/2;
                    genotypes4.y = 240 + genotypes4.height/4;
                }


                //borders
                if(this.x < 0){this.x = 0.1;}
                if(this.x + this.width > this.gameWidth){this.x = this.gameWidth - this.width - 0.1;}
                if(this.y < 0){this.y = 0.1;}
                if(this.y + this.height > this.gameHeight){this.y = this.gameHeight - this.height - 0.1;}

                //sprite animation
                if(frame % 15 === 0){
                    if(this.frameY === 0 && this.frameX < 6){
                        this.frameX++;
                    }else if(this.frameY === 0 && this.frameX >= 6){
                        this.frameX = 0;
                    }else if(this.frameY === 1 && this.frameX < 8){
                        this.frameX++;
                    }else if(this.frameY === 1 && this.frameX >= 8){
                        this.frameX = 0;
                    }else if(this.frameY === 2 && this.frameX < 8){
                        this.frameX++;
                    }else if(this.frameY === 2 && this.frameX >= 8){
                        this.frameX = 0;
                    }else if(this.frameY === 3 && this.frameX < 6){
                        this.frameX++;
                    }else if(this.frameY === 3 && this.frameX >= 6){
                        this.frameX = 0;
                    }else if(this.frameY === 4 && this.frameX < 6){
                        this.frameX++;
                    }else if(this.frameY === 4 && this.frameX >= 6){
                        this.frameX = 0;
                    }
                }
            }
            draw(context){
                context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
            }
        }

        //creates classes
        const input = new InputHandler();
        const gameCon = new GameCon(canvas.width, canvas.height);
        const video = new Video(canvas.width, canvas.height);
        const background = new Background(canvas.width, canvas.height);
        const pedigree = new Pedigree(canvas.width, canvas.height);
        const player = new Player(canvas.width, canvas.height);
        const genotypes1 = new Genotypes();
        const genotypes2 = new Genotypes();
        const genotypes3 = new Genotypes();
        const genotypes4 = new Genotypes();
        genotypes1.image = document.getElementById('hAncGenotype');
        genotypes1.x = 78 + genotypes1.width/4;
        genotypes1.y = 28 + genotypes1.height/6;
        genotypes2.image = document.getElementById('eAncGenotype');
        genotypes2.x = 509 + genotypes2.width/5;
        genotypes2.y = 118 + genotypes2.height/4;
        genotypes3.image = document.getElementById('bGenotype');
        genotypes3.x = 0 + genotypes3.width/2;
        genotypes3.y = 470 + genotypes3.height/4;
        genotypes4.image = document.getElementById('nonDom');
        genotypes4.x = 285 + genotypes4.width/2;
        genotypes4.y = 240 + genotypes4.height/4;


        //animate function - allows movement w/ smooth visuals
        function animate(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            background.draw(ctx);
            genotypes4.draw(ctx);
            genotypes1.draw(ctx);
            genotypes2.draw(ctx);
            genotypes3.draw(ctx);
            player.draw(ctx);
            if(!videoActive){player.update(input, ctx);}
            pedigree.draw(ctx);
            if(!videoActive && (pedigreeActivate || releasePedigree)){pedigree.update();}
            if(videoActive){video.draw(ctx);}
            if(!(win || lose)){requestAnimationFrame(animate);}
            frame++;
        }
        function endGameAnimate(){
            if(win || lose){
                ctx.clearRect(0,0,canvas.width,canvas.height);
                gameCon.update();
                gameCon.draw(ctx);
            }
            requestAnimationFrame(endGameAnimate);
        }
        animate();
        endGameAnimate();

        setTimeout(function(){
            videoActive = false;
        }, 14800);
    }
    startGame();
});