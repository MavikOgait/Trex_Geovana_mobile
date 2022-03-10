var trex, trex_running, edges, trexMortin;
var groundImage, ground, groundInvisible;
var Nuvenzinha, nuvemImage, nuvenzinhaGroup;
var cacto, cacto1, cacto2, cacto3, cacto4, cacto5, cacto6, cactoGroup;
var PLAY = 1;
var FIM = 0;
var gameState = PLAY;
var gameOver, gameOverImg;
var restart, restartImg;
var jumpSound, checkpointSound, dieSound;
var score = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trexMortin = loadAnimation("trex_collided.png");
  groundImage = loadImage("ground2.png");
  nuvemImage = loadImage("cloud.png");
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage ("restart.png")
  jumpSound = loadSound ("C16-Adicionar_jump.mp3")
  dieSound = loadSound ("C16-Adicionar_die.mp3")
  checkpointSound = loadSound ("C16-Adicionar_checkPoint.mp3")
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
  //criando o trex
  trex = createSprite(50,height/3,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("dead", trexMortin)
  edges = createEdgeSprites();
  
  //adicione dimensão e posição ao trex
  trex.scale = 0.5;
  trex.x = 50

  //criar chão
  ground = createSprite(width/2,height/2,width,2); 
 ground.addImage(groundImage)
  
 //criar chão invisivel
 groundInvisible = createSprite(width/2,height/2 +65,width,125);
 groundInvisible.visible = false

 //imagem do game over
 gameOver = createSprite(width/2,height/3- 50);
gameOver.addImage(gameOverImg)
gameOver.scale = 0.5
gameOver.visible = false

//imagem do restart
restart = createSprite(width/2,height/3);
restart.addImage(restartImg)
restart.scale = 0.5
restart.visible = false

 //criar grupo
 cactoGroup = new Group();
 nuvenzinhaGroup = new Group();
 
 trex.setCollider("rectangle",0,0,trex.width,trex.height);
}


function draw(){
  //definir a cor do plano de fundo 
  background("white");

  textSize(20);
  fill("black")
  text("pontos: " + score, width*0.7, 50)
  
  if (gameState == PLAY) {
    
     //pontuação
     score = score + Math.round(getFrameRate()/60) 

    if (score > 0 && score%100 == 0) {

      checkpointSound.play()
      
    }
      //movimento d chão
      ground.velocityX = -7
      
      //chão infinito
     if (ground.x < width*0.2){
       ground.x = ground.width/2
    }

      //pular quando tecla de espaço for pressionada
     if(keyDown("space") && trex.y > height/3 +50){
       trex.velocityY = -10;
       jumpSound.play()
    }
      
     //gravidade do t-rex
    trex.velocityY = trex.velocityY + 0.7;

    //utilizando a função criar nuvens 
   CriarNuvens();

    //utilizando a função criar obstaculos e nuvens
  CriarObstaculos();
  
    if (cactoGroup.isTouching(trex)){
      
      dieSound.play()
      gameState = FIM;
    }
    }

  
  else if (gameState == FIM){
   
    gameOver.visible = true
    restart.visible = true
    ground.velocityX = 0
    
    cactoGroup.setLifetimeEach(-1)
    nuvenzinhaGroup.setLifetimeEach(-1)

    trex.VelocityY = 0

    //mudar animação
    trex.changeAnimation("dead", trexMortin)

   //definir tempo de vida pra nunca serem destruidos
    cactoGroup.setVelocityXEach(0)
    nuvenzinhaGroup.setVelocityXEach(0)

    if (mousePressedOver(restart)) {
      reset()
    }
  }

 //impedir que o trex caia
 trex.collide(groundInvisible)

 if((touches.length > 0 || keyDown("SPACE")) && trex.y  >=  height/3 -50) {
  jumpSound.play( )
  trex.velocityY = -10;
   touches = [];
}



if(touches.length>0 || mousePressedOver(restart)) {      
  reset();
  touches = []
}

  drawSprites();
}

function CriarNuvens() {
 
  if (frameCount %60 == 0) {

  Nuvenzinha = createSprite(width-200,height/2,40,10)
  Nuvenzinha.velocityX = -4;
  Nuvenzinha.addImage(nuvemImage)
  Nuvenzinha.scale = 0.7
  //altura aleatoria
  Nuvenzinha.y = Math.round(random(10,height/3));

  //ajuste de profundidade
  Nuvenzinha.depth = trex.depth
  trex.depth = trex.depth + 1
 
  //tempo de vida das nuvens
  Nuvenzinha.lifetime = width+40;

  //add ao grupo
  nuvenzinhaGroup.add(Nuvenzinha);
  }
}

function CriarObstaculos() {
 
  if (frameCount %100 == 0) {
 cacto = createSprite(width+20,height/2-12,20,30);
 cacto.velocityX = -7
 cacto.scale = 0.5
 
 //gerar cactos aleatorios
  var num = Math.round(random(1, 6));


   switch(num) {
  case 1: cacto.addImage (cacto1)
  break
  case 2: cacto.addImage (cacto2)
  break 
  case 3: cacto.addImage (cacto3)
  break
  case 4: cacto.addImage (cacto4)
  break
  case 5: cacto.addImage (cacto5)
  break
  case 6: cacto.addImage (cacto6)
  break
  default:
    break
  }
   
  //add ao grupo
   cactoGroup.add(cacto)

  cacto.lifetime = width +40;
  }
}

function reset() {
  gameState = PLAY 
  gameOver.visible = false
  restart.visible = false
  cactoGroup.destroyEach()
  nuvenzinhaGroup.destroyEach()
  trex.changeAnimation("running", trex_running)
  score = 0
}