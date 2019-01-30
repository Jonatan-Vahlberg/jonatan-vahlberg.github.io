//Constants: canvas and radar
const canvasArea = document.querySelector('.canvasArea')
const canvas = document.querySelector('#canvas');
canvas.width = 425;
var images = [new Image(),new Image()];
images[0].src = 'media/backgrounds/over.png';
images[1].src = 'media/backgrounds/win.gif';
const buttons = document.querySelectorAll('.input');
const zDots = document.querySelectorAll('.zDot');
const cDots = document.querySelectorAll('.cDot');
const ctx = canvas.getContext('2d');

const outputText = document.querySelector('#outputText');

//Variables for animation and sound
var buttonPressed;
var walkAudio = new Audio('media/sound/gravel.mp3');
walkAudio.load();

var catSound = new Audio('media/sound/meow.mp3');
catSound.load();

var zombieSound = new Audio('media/sound/zombie.mp3');
zombieSound.load();
// var map = new Array(7).fill(new Array(7).fill());

//This is the game map

//Map for reading directions to generate the graphics can be messed around but escape should stay in place  that it is same with start
var map = [
    [4,4,3,3,2,2,3], //0 = Start 1 = House 
    [1,1,3,5,5,3,2], //2 = Lake 3 = Forrest
    [4,4,6,6,5,2,5], //4 = Backyard 5 = Plain
    [1,1,6,0,3,3,3], //6 = Road 7 = Escape
    [6,5,3,6,3,9,3], //8 = Tavern 9 = Forrest Dead
    [8,6,5,6,10,10,9], // 10 = Cemetary
    [11,6,6,7,6,6,9] // 11 = Tavern inner
];

//text telling you info about current area and if you have found a cat
var flavorText = [
    ['As you Stand in your house you feel determind to keep moving.'],//0
    ['Standing outside of this house completly abandond makes you feel small.',' As you are about to leave you notice one of your small kittens hiding in the bushes of the house'],//1
    ['The lake apears as a tinted galss mirror.',' Taking a look around you notice that close to the beach sits one of the kittens gigerly trying to clen sand out of its fur.'],//2
    ['The path keeps twisting as you are being led further and further into the verdant forrest.',' While walking past some colorful mushrooms you hear a meek sound coming from above and high up i one of the trees sits one of your kitttens'],//3
    ['Seeing the peoples backyards completly abandond with no activity makes you a little sad.',' in the left far edge of the backyard, in the shade of the fence sits one of your kittens avoiding the sun'],//4
    ['walking next to a tree you gaze upon the mighty hills hoping that your cats havent moved further in.',' As a stroke of luck lying next to the tree is one of your kittens exsausted from the long trip'],//5
    ['You were always warned to stay away from the roads as fast moving cars always ran trough here...seems there is no need to still be careful.',' It seems one of your kitttens shared the same thought proudly walking in the middle of the  road not a care in the world'],//6
    ['The fenceed of area lies in stark contrast to your otherwise lonesome town...it feels cold distant you should return once you find the rest of your kittens.',' After watching from a nerby bush ready to head out once more you feel something brush up on your leg its one of the kittens.'],//7
    ['Normally you woundn\'t be allowed to enter the tavern but desperate times call for desperate measures.',' As you take in the empty tavern a smell of ingrained cigaretts fill the area when turing around to leave your eye catches a ball of fur snacing down on a rat in the corner its one of your kittens.'],//8
    ['Taking one step into the deepest part of the forrest your nose i assulted with a stench emenating from some of the bushes, and you have the destinct feeling something or somebody is watching you.',' Sitting untop of a large stone with its back raised is one of your kittens trying to fend of a nearby snake.'],//9
    ['The cemetary really feels devoid of any life as you meander trough the tombstones you feel a strong chill.',' Sitting nearby a still lit gravelight is one of your kittens searching for a bit of warmth.'],//10
    ['The taverns backroom seems to be mostly empty save for a few kegs and a grate in the middle of the room.','You find one of your kittens calling out desperatly as they have gotten their paw stuck in  the grate.'],//11



]

// this map exsist to host the cats zombies and player positions att all times
var gameMap = new Array();
for(let i = 0; i < 7; i++){
    gameMap[i] = new Array(7)
}
//this function puts cats and a zombie in random boxes
var player = {
    x: 3,
    y: 3,
    score: 0,
    drunk: false,
}
//create cats and zombies  through basic object construction
function createCAZ(x,y,collected){
    this.x  = x;
    this.y  = y;
    this.collected  = collected;
}

var cats = new Array();

var zombies = new Array();
//Populates map with cats and zombies
populateGameMap();
function populateGameMap(){
    
    //while loops for placing cats
    let i = 0
    while(true){
        let x =   generateRandomNr(0,6); 
        let y = generateRandomNr(0,6);
        if(x == player.x && y == player.y ){
         continue;  
        }else{
            if(i == 0){
                //first Cat
                var cat = new createCAZ(x,y,false);
                cats.splice(0,1,cat);
                i++;
                
                continue;
            }else{
                //counter
                let c = 0;
                cats.forEach(cat => {
                    // checks if cats are placed on same tile
                    if(x == cat.x && y == cat.y){
                        //resets counter if so
                        c = 0;
                    }
                    else{
                        //adds to counter if not on ocupied space
                        c++;
                    }
                });
                if(i == 1 && c == 1) {
                    //second Cat
                    var cat = new createCAZ(x,y,false);
                    cats.push(cat);
                    i++;
                }else if(i == 2 && c ==2){
                    //Third Cat
                    var cat = new createCAZ(x,y,false);
                    cats.push(cat);
                    i++;
                    break;
                }
            }
        }

    }
    //Creating the first zombie
        let z =   generateRandomNr(0,4); 
        let x = 0;
        let y = 0;
        if(z == 0){
            x = 0;
            y = 0
        }else if( z == 1){
            x = 6;
            y = 0;
        }else if(z == 2){
            x = 6;
            y = 6;
        }else{
            x = 0;
            y = 6;
        }
        //placing the zombie in one of the four corners of the map
        var zombie = new createCAZ(x,y,false);
        zombies.push(zombie);
    
}
//Map for storing the objects containing images and image specs
var mapObject = new Array();
var rows = 7;
for(let i = 0; i < rows; i++){
    mapObject[i] = new Array(7);
}
populateMap();

/*This Function populates the game map with the backgrounds and the foreground items to then store in the mapObject Array
  This is all done beforehand in order to not have to render on the fly and slow down the process*/ 
function  populateMap(){

    //a for loop determening y corodinate
    for(let y = 0; y < map.length;y++){
        //a inner for loop determening x corodinate together becoming (y,x) of the map array; for example map[y][x] = n.
        for(let x = 0; x< map[0].length;x++){
            

            //Object constructor for items to be generated on the background of canvas;
           function itemObj(path,sX,sY,sWidth,sHeight,x,y,width,height) {
                this.path = path;
                this.sX = sX; //Starting source x pos
                this.sY = sY; //Starting source y pos
                this.sWidth = sWidth; // source width of item
                this.sHeight = sHeight;  // source height of item
                this.x = x; //x pos on canvas can be random
                this.y = y; // y pos on canvas can be random 
                this.width = width; // width on canvas
                this.height = height; // height on canvas 
            }
            let xP = 0; //  A random x pos placment for graphics
            let yP = 0;// A random yPos placment for Graphics
            let sX = 0; // A random number meant to determin the cutting point i a png file for getting  for example one tree variant
            let sY = 0;
            //A Switch selector for finding the necesary graphics;
            
            switch(map[y][x]){
                
                case 0:
                    //mat
                    xP = generateRandomNr(190,325);
                    yP = generateRandomNr(85,300)
                    
                    var item1 = new itemObj('media/sprites/mat.png',0,0,100,100,xP,yP,100,100);

                    //sign
                    xP = generateRandomNr(190,325);
                    yP = generateRandomNr(85,300)
                    var item2 = new itemObj('media/sprites/sign.png',0,0,100,100,xP,yP,100,100);

                    //controller
                    xP = generateRandomNr(190,384);
                    yP = generateRandomNr(85,360)
                    var item3 = new itemObj('media/sprites/controller.png',0,0,40,40,xP,yP,40,40);

                    createCell(y,x,'media/backgrounds/start.png',item1,item2,item3);
                break;
                case 1: //House background
                    //Function for making a cell populated with items exPlained Further down;
                    
                    //Cloud
                    xP = generateRandomNr(0,canvas.width-100);

                    var item1 = new itemObj('media/sprites/cloud.png',0,0,100,50,xP,10,100,50);
                    //house this is for generating a random house at fixed y.
                    xP = generateRandomNr(0,canvas.width-100);

                    //There are four house variants and this choses one of them and helps pic them out of thi png file
                    sX = generateRandomNr(0,4);  
                    var item2 = new itemObj('media/sprites/house.png',sX*100,0,100,128,xP,78,100,128);
                    //Lampost
                    xP = generateRandomNr(0,canvas.width-60);
                    var item3 = new itemObj('media/sprites/lampost.png',0,0,60,150,xP,56,60,150);

                    //Creating the cell
                    createCell(y,x,'media/backgrounds/house.png',item1,item2,item3);
                break;
                case 2: //Lake
                    //Function for making a cell populated with items exPlained Further down;
                    
                    //Fish
                    xP = generateRandomNr(0,365);
                    yP = generateRandomNr(135,368)
                    sX = generateRandomNr(0,4)
                    var item1 = new itemObj('media/sprites/fish.png',sX*45,0,45,32,xP,yP,45,32);

                    //Second Fish
                    xP = generateRandomNr(0,365);
                    yP = generateRandomNr(135,368)
                    sX = generateRandomNr(0,4)
                    var item2 = new itemObj('media/sprites/fish.png',sX*45,0,45,32,xP,yP,45,32);

                    //boat
                    xP = generateRandomNr(0,250);
                    yP = generateRandomNr(135,272)
                    var item3 = new itemObj('media/sprites/boat.png',0,0,175,128,xP,yP,175,128);

                    createCell(y,x,'media/backgrounds/lake.png',item1,item2,item3);

                break;
                case 3:
                     //Forrest

                    //Snake
                    xP = generateRandomNr(0,350);
                    yP = generateRandomNr(170,368);

                    var item1 = new itemObj('media/sprites/snake.png',0,0,75,32,xP,yP,75,32);
                    //mushroom
                    xP = generateRandomNr(0,380);
                    yP = generateRandomNr(170,355);
                    sX = generateRandomNr(0,4);  
                    var item2 = new itemObj('media/sprites/mushroom.png',sX*45,0,45,45,xP,yP,45,45);
                    //Stone
                    xP = generateRandomNr(0,canvas.width-75);
                    yP = generateRandomNr(170,325);
                    var item3 = new itemObj('media/sprites/stone.png',0,0,75,75,xP,yP,75,75);

                    //Creating the cell
                    createCell(y,x,'media/backgrounds/forrest.png',item1,item2,item3);
                
                break;
                case 4: //Backyard
                    //Hole
                    xP = generateRandomNr(100,245);
                    yP = generateRandomNr(150,325);

                    var item1 = new itemObj('media/sprites/hole.png',0,0,75,75,xP,yP,75,75);
                    //Woodpile
                    xP = generateRandomNr(0,325);
                    yP = generateRandomNr(236,300);
                    sX = generateRandomNr(0,4);  
                    var item2 = new itemObj('media/sprites/wood.png',sX*100,0,100,100,xP,yP,100,100);
                    //sand
                    xP = generateRandomNr(0,380);
                    yP = generateRandomNr(236,300);
                    sX = generateRandomNr(0,4);  
                    var item3 = new itemObj('media/sprites/sand.png',sX*45,0,45,45,xP,yP,45,45);

                    //Creating the cell
                    createCell(y,x,'media/backgrounds/backyard.png',item1,item2,item3);

                break;
                case 5: //Plain
                    //sun
                    xP = generateRandomNr(0,325);
                    yP = generateRandomNr(0,51);

                    var item1 = new itemObj('media/sprites/sun.png',0,0,100,100,xP,yP,100,100);
                    //Cloud
                    xP = generateRandomNr(0,300);
                    yP = generateRandomNr(0,51);
                    
                    var item2 = new itemObj('media/sprites/cloud.png',0,0,100,50,xP,yP,100,50);
                    //Tree
                    xP = generateRandomNr(0,380);
                    yP = generateRandomNr(236,300);
                    sX = generateRandomNr(0,4);  
                    var item3 = new itemObj('media/sprites/tree.png',sX*150,0,150,150,xP,210,150,150);

                    //Creating the cell
                    createCell(y,x,'media/backgrounds/plain.png',item1,item2,item3);
                break;
                case 6: // road
                    //signpost
                    xP = generateRandomNr(325,335);
                    yP = generateRandomNr(0,10);
                    sX = generateRandomNr(0,4); 
                    var item1 = new itemObj('media/sprites/signpost.png',sX*100,0,100,150,xP,yP,100,150);
                    //sign
                    xP = generateRandomNr(0,325);
                    yP = generateRandomNr(160,300);
                    
                    var item2 = new itemObj('media/sprites/sign.png',0,0,100,100,xP,yP,100,100);
                    //stone
                    xP = generateRandomNr(0,350);
                    yP = generateRandomNr(0,325);  
                    var item3 = new itemObj('media/sprites/stone_g.png',0,0,75,75,xP,yP,75,75);

                    //Creating the cell
                    createCell(y,x,'media/backgrounds/road.png',item1,item2,item3);
                break;
                case 7: //escape
                //lock
                
                    yP = generateRandomNr(90,261);
                    var item1 = new itemObj('media/sprites/lock.png',sX*100,0,44,32,223,yP,44,32);
                    //Zombie
                    xP = generateRandomNr(0,375);
                    
                    var item2 = new itemObj('media/sprites/zombie.png',0,0,50,100,xP,300,50,100);
                    //Safe Sign
                    xP = generateRandomNr(0,95);
                    yP = generateRandomNr(85,218);  
                    var item3 = new itemObj('media/sprites/safe.png',0,0,75,75,xP,yP,75,75);

                    //Creating the cell
                    createCell(y,x,'media/backgrounds/escape.png',item1,item2,item3);
                break;
                case 8: //Tavern start

                   //The poster has three places to stay and diffrent values depending
                   sX = generateRandomNr(0,3);
                    if(sX == 0){
                        var item1 = new itemObj('media/sprites/poster.png',0,0,90,115,35,245,90,115);
                    }else if(sX == 1){
                        var item1 = new itemObj('media/sprites/poster.png',0,0,90,115,165,245,96,115);
                    }else if(sX == 2){
                        var item1 = new itemObj('media/sprites/poster.png',0,0,90,115,300,245,90,115);
                    }
                    //Bar Stool
                    xP = generateRandomNr(0,345);
                    
                    var item2 = new itemObj('media/sprites/bar_stool.png',0,0,80,180,xP,220,80,180);
                    //liquer
                    xP = generateRandomNr(0,380);
                    sX = generateRandomNr(0,2);  
                    var item3 = new itemObj('media/sprites/liquer.png',sX*45,0,45,45,xP,165,45,45);
                    
                    //Creating the cell
                    createCell(y,x,'media/backgrounds/tavern.png',item1,item2,item3);
                break;
                case 9: // Dead Forrest

                    //Snake Dead
                    xP = generateRandomNr(0,350);
                    yP = generateRandomNr(170,368);

                    var item1 = new itemObj('media/sprites/snake_d.png',0,0,75,32,xP,yP,75,32);
                    //mushroom
                    xP = generateRandomNr(0,380);
                    yP = generateRandomNr(170,355);
                    sX = generateRandomNr(0,4);  
                    var item2 = new itemObj('media/sprites/mushroom_d.png',sX*45,0,45,45,xP,yP,45,45);
                    //Lampost
                    xP = generateRandomNr(0,canvas.width-75);
                    yP = generateRandomNr(170,325);
                    var item3 = new itemObj('media/sprites/stone_d.png',0,0,75,75,xP,yP);

                    //Creating the cell
                    createCell(y,x,'media/backgrounds/forrest_d.png',item1,item2,item3);
                break;
                case 10: //Cemetary
                    //Rose
                    xP = generateRandomNr(0,365);
                    var item1 = new itemObj('media/sprites/rose.png',0,0,60,60,xP,210,60,60);
                    //Gravelight
                    xP = generateRandomNr(0,365);
                    var item2 = new itemObj('media/sprites/gravelight.png',0,0,60,60,xP,210,60,60);
                    //stone
                    xP = generateRandomNr(0,350);
                    var item3 = new itemObj('media/sprites/stone_g.png',0,0,75,75,xP,255,75,75);
                    
                    //Creating the cell
                    createCell(y,x,'media/backgrounds/cemetary.png',item1,item2,item3);
                break;
                case 11: //Inner Tavern
                    //Grate
                    xP = generateRandomNr(145,325);
                    yP = generateRandomNr(150,300);
                    var item1 = new itemObj('media/sprites/grate.png',0,0,100,100,xP,yP,100,100);
                    //Barstool
                    xP = generateRandomNr(145,345);
                    yP = generateRandomNr(150,220);
                    var item2 = new itemObj('media/sprites/bar_stool.png',0,0,80,180,xP,yP,80,180);
                    //Keg
                    xP = generateRandomNr(145,335);
                    yP = generateRandomNr(150,250);
                    var item3 = new itemObj('media/sprites/barrel.png',0,0,90,150,xP,yP,90,150);
                    
                    //Creating the cell
                    createCell(y,x,'media/backgrounds/tavern_in.png',item1,item2,item3);
                break;
                default:
                    alert('error' +y + x);
                    return;
            }

        }

    }
}

// function generateCat(xMin, xMax, yMin, yMax, width, height){
//     let xP = generateRandomNr(xMin,xMax);
//     let yP = generateRandomNr(yMin,yMax);
//     return new itemObj('media/sprites/cat.png',0,0,330,340,xP,yP,width,height);
// }

//a function for returning a random number between min and max.
function generateRandomNr(min, max){
    var n = Math.floor(Math.random()*(max - min)+ min);
    return n;
}

//this function makes sure to load all the images beforehand and adds it to its respektive place in the array mapObject
// 4 images and thre images spesifications such as width height and more
//canvas has to preload the images or they wont render as such i do it before the game starts
function createCell(y,x,back,item1,item2,item3){
    
    var background = new Image();
    background.src = back;

    var image1 = new Image();
    image1.src = item1.path;
    
    var image2 = new Image();
    image2.src = item2.path;
    
    var image3 = new Image();
    image3.src = item3.path;

    var mapBackground = {
        background: background,
        image1: image1,
        image1Specs: item1,
        image2: image2,
        image2Specs: item2,
        image3: image3,
        image3Specs: item3,
    }
    
    mapObject[y].splice(x,1,mapBackground);
}

//draws the graphics out to the canvas from mapObject array depending on player placement
function drawAll(){
    
    ctx.drawImage(mapObject[player.y][player.x].background,0,0,canvas.width,canvas.height);
    let temp1 = mapObject[player.y][player.x].image1Specs;
    
    ctx.drawImage(mapObject[player.y][player.x].image1,temp1.sX,temp1.sY,temp1.sWidth,temp1.sHeight,temp1.x,temp1.y,temp1.width,temp1.height);
    let temp2 = mapObject[player.y][player.x].image2Specs; 
    ctx.drawImage(mapObject[player.y][player.x].image2,temp2.sX,temp2.sY,temp2.sWidth,temp2.sHeight,temp2.x,temp2.y,temp2.width,temp2.height);
    let temp3 = mapObject[player.y][player.x].image3Specs; 
    ctx.drawImage(mapObject[player.y][player.x].image3,temp3.sX,temp3.sY,temp3.sWidth,temp3.sHeight,temp3.x,temp3.y,temp3.width,temp3.height);
    outputText.innerHTML = flavorText[map[player.y][player.x]][0];
}

//Function detecting and calculating moves of player and all zombies currently in game 
function move(buttonPressed){
    // document.querySelector('.canvasArea').classList.add('fadeOut');

    //checks wich button was pressed using each buttons unique IDs: UP DOWN LEFT RIGHT MISC
    if(buttonPressed.id == 'UP'){
        player.y--;
        drawAll();
        
    }else if(buttonPressed.id == 'LEFT'){
        player.x--;
        drawAll();
    }else if(buttonPressed.id == 'RIGHT'){
        player.x++;
        drawAll();
    }else if(buttonPressed.id == 'DOWN'){
        player.y++;
        drawAll();
    }else if(buttonPressed.id == 'MISC'){ // ´Start of the game
        if(buttonPressed.value == 'Again?'){
            location.reload();
        } 
            
        drawAll();
        buttonPressed.style.display = 'none';
        document.getElementById('LEFT').style.display = 'initial';
        document.getElementById('RIGHT').style.display = 'initial';
        document.getElementById('UP').style.display = 'initial';
        document.getElementById('DOWN').style.display = 'initial';
        return;
    }



    //After player moves all zombies move and this forEach loops decides they're pathfinding 
    zombies.forEach(zombie =>{
        let moveorNot = generateRandomNr(0,9); //moves if number is not greater than set number in if statement bellow
            if(moveorNot <= 5){
            
            //if zombie is both on a higher column and a higher row
            if(zombie.x > player.x && zombie.y > player.y){
                let decide = generateRandomNr(0,1);
                if(decide == 0){
                    zombie.x--;
                }
                else{
                    
                    zombie.y--;
                    
                }
            }
            //if the zombie is on both a lower row and column
            else if(zombie.x < player.x && zombie.y < player.y){
                let decide = generateRandomNr(0,1);
                if(decide == 0){
                    zombie.x++;
                }
                else{
                    zombie.y++;
                }
            }
             //If on the same row or collumn
             else if(zombie.x == player.x || zombie.y == player.y){
                //if the row is either higher or lower
                if(zombie.x == player.x){
                    if(zombie.y > player.y){
                        zombie.y--;    
                    }   
                    else{
                        zombie.y++;
                    }
                }else{
                    if(zombie.x > player.x){
                        zombie.x--;    
                    }else{
                        zombie.x++
                    }
                }
            }
                    
            //if zombie is on a lower column and higher row        
            else if(zombie.x < player.x && zombie.y > player.y){
                let decide = generateRandomNr(0,1);
                if(decide == 0){
                    zombie.x++;

                }
                else{
                    zombie.y--;

                }
                
                
            }
            //if zombie is on a higher column and a lower row
            else if(zombie.x > player.x && zombie.y < player.y){
                let decide = generateRandomNr(0,1);
                if(decide == 0){
                    zombie.x--;

                }
                else{
                    zombie.y++;

                }

            }
            //if zombie is either on a higher collumn or a higher row This one goes mostly unused as it is coverd by others
            else if((zombie.x > player.x && !(zombie.y > player.y))||(!(zombie.x > player.x) && zombie.y > player.y) ){

                if(zombie.x > player.x){
                    zombie.x--;
                }else if(zombie.y > player.y){
                    zombie.y--;
                }
                
            }
            //If on the same row or collumn
            else if(zombie.x == player.x || zombie.y == player.y){
                //if the row is either higher or lower
                console.log('test 6');
                if(zombie.x == player.x){
                    if(zombie.y > player.y){
                        let decide = generateRandomNr(0,1);
                        if(decide == 0){
                            zombie.y--;
                            
                        }else{
                            //nothing happens
                        }
                    }else{
                        let decide = generateRandomNr(0,1);
                        if(decide == 0){
                            zombie.y++;
                            
                        }else{
                            //nothing happens
                        }
                    }}
                    // If the collumn is either higher or lower
                }else if(zombie.y == player.y){
                    console.log('test 7');
                    if(zombie.x > player.x){
                        let decide = generateRandomNr(0,1);
                        if(decide == 0){
                            zombie.x--;
                            
                        }else{
                            //nothing happens
                        }
                    }else{
                        let decide = generateRandomNr(0,1);
                        if(decide == 0){
                        zombie.x++;
                        
                    }else{
                        //nothing happens
                    }
                }
            

        }
         //if zombie is either on a  lower collumn or a lower row 
         else if((zombie.x < player.x && !(zombie.y < player.y))||(!(zombie.x > player.x) && zombie.y < player.y) ){
            console.log('test 10');
             if(zombie.x < player.x){
                 zombie.x--;
                }else if(zombie.y < player.y){
                    zombie.y--;
                }
            }

            //Map placement is mostly for testing purposes
            mapPlacement()
            console.table(gameMap);
        }else{
            //no movement this turn
            //still print out map i console
            mapPlacement();
            console.table(gameMap);

        }
        });
       
function mapPlacement(){
    for(let y = 0; y < gameMap.length;y++){
        //a inner for loop determening x corodinate together becoming (y,x) of the map array; for example map[y][x] = n.
        for(let x = 0; x< gameMap[0].length;x++){
            if(y == player.y && x == player.x){
                gameMap[y][x] = 'Player';
            }
            else{

                zombies.forEach(zombie =>{
                    // if(gameMap[y][x] == 'Zombie'){
                        
                    // }else{

                        if(y == zombie.y && x == zombie.x){
                            gameMap[y][x] = 'Zombie';
                        }else{

                            gameMap[y][x] = 'X';
                        }
                    // }
                });
                
            }
        }
    }
}
    //Checks firstly if you have reached the edge of the game map then checks for collisions
    //Secondly if a zombie has reached you Thirdly if you have collected a cat
    checkCoords();
    
    //sets The radars checks the zombie radar extra due to bug not showing zombie position at certain times dont know how efective but here it is
    setRadar(zombies,'Z');
    setRadar(cats,'C');
    setRadar(zombies,'Z');
}

function checkCoords(){
    //by checking each in a seperate if else statement it is easier to display correctily in corners

    //Left Edge of playing field
    if(player.x == 0){
        document.getElementById('LEFT').style.display = 'none';
        //sets left button to none
    }else{
        document.getElementById('LEFT').style.display = 'initial';
    }
    //Right Edge of playing field
    if(player.x == 6){
        document.getElementById('RIGHT').style.display = 'none';
    }else{
        document.getElementById('RIGHT').style.display = 'initial';
    }
    //Top Edge of playing field
    if(player.y == 0){
        document.getElementById('UP').style.display = 'none';
    }else{
        document.getElementById('UP').style.display = 'initial';
    }
    //Bottom Edge of playing field
    if(player.y == 6){
        document.getElementById('DOWN').style.display = 'none';
    }else{
        document.getElementById('DOWN').style.display = 'initial';
    }
    //Checks for collision with zombie
    zombies.forEach(zombie => {
        //if after player and zombie move both are ocupying same space player dies and game is over 
        if(player.x == zombie.x && player.y == zombie.y){
            // location.reload();
            ctx.drawImage(images[0],0,0);
            zombieSound.play();
            buttons.forEach(button => {
                if(!(button.id == 'MISC')){
                    button.style.display = 'none';
                }else{
                    button.style.display = 'initial';
                    button.value = 'Again?';
                }

            });
            return;
        }else {
            //if not zombie then cat 
            cats.forEach(cat => {
                //if a player ocupies same space as cat the player score is increased
                if(cat.x == player.x && cat.y == player.y && cat.collected == false){
                    //this removes the cat from the radar and makes it inpossible to pickup again
                    outputText.innerHTML += flavorText[map[player.y][player.x]][1];
                    cat.collected = true;
                    catSound.play();
                    player.score++;
                    document.querySelector('.score').innerHTML = 'Cats Saved: '+player.score;

                    //for each cat saved a zombie spawns on a random tile making the game that much harder
                    zombies.push(new createCAZ(generateRandomNr(0,6),generateRandomNr(0,6),false));
                    
                }
            });
        }

    });
    //this checks for if player has reached the escape tile with all three cats and only then can you escape
    if(player.x == 3 && player.y == 6 && player.score == 3){
        ctx.drawImage(images[1],0,0);
            buttons.forEach(button => {
                if(!(button.id == 'MISC')){
                    button.style.display = 'none';
                }else{
                    button.style.display = 'initial';
                    button.value = 'Again?';
                }

            });
    }
}

//radar function takes in a creatures array namely the: cats, zombies arrays and a group: string for determining wich group has ben sent
function setRadar(creatures,group){
    //array for storring creature radar positions in
    var radarPos = new Array();

    //loop over the creatures: zombies/cats
    creatures.forEach(creature => {
        var pX = player.x;
        var pY = player.y;
        let xCounter = 0;
        let yCounter = 0;
        //radar starts counting to spaces on top of player and heads two spaces bellow the player
        for(let y = pY-2; y <= pY+2; y++){
            xCounter = 0;

            //if standing close to a wall it skips rows on top or bellow the game area
            if(y< 0 || y > 6){
                yCounter++;
            }
            else{
                //radar starts counting two spaces left of player and heads two spaces right of the player
                for(let x = pX-2; x <= pX+2; x++){
                    //breaks for one iteration if loop is  going outside of the boundries of map in x axle
                    if(x < 0 || x > 6){
                        xCounter++;
                    }else{
                        //if the iterated x and y corresponds to a creature saves his position in counter variables 
                        if(x == creature.x && y== creature.y){
                            if(!creature.collected){
                                
                                console.log('creature is at : '+x+' '+y)
                                console.log('COUNTERS '+yCounter+' '+xCounter);
                                var creaturePos = {
                                    x: xCounter,
                                    y: yCounter,
                                };

                                //pushes the radar position to array
                                radarPos.push(creaturePos);
                                console.table(radarPos);
                            }
                        }
                        xCounter++;
                    }
                }
                yCounter++;
            }
        }
    });

    //if radar has picked up any creature of a certain kind during this function call
    if(radarPos.length > 0){
        //checks position outputs a blip in the form of a previusly loaded img to the selected radar and still sends the group in order to determin group type
        checkPositions(radarPos,group);
        //then for safty resets the array
        radarPos = new Array();
    }else{
        //if radar is empty set all blips to none
        if(group == 'Z'){
            zDots.forEach(dot => dot.style.display= 'none');

        }else if(group == 'C'){
            cDots.forEach(dot => dot.style.display= 'none');
        }
    }
}
//the sole function for outputing the radar blips on the radar itself 
function checkPositions(radarPos,group){
    //part of a string for locating the correct blip 
    var classNameY = '';
    var classNameX = '';
    if(group == 'Z'){
        //this first makes all blips in group none in order to not leave trailing blips
        zDots.forEach(dot => dot.style.display= 'none');
    }else if(group == 'C'){
        cDots.forEach(dot => dot.style.display= 'none');
    }
    //for each position in radarPos array check the y and x counter in order to determin position i grid layout of blip
    radarPos.forEach( pos => {
        console.log('test');
        switch(pos.y){
            case 0: classNameY = 'zeroY'; break;
            case 1: classNameY = 'oneY'; break;
            case 2: classNameY = 'twoY'; break;
            case 3: classNameY = 'threeY'; break;
            case 4: classNameY = 'fourY'; break;
        }

        switch(pos.x){
            case 0: classNameX = 'zeroX'; break;
            case 1: classNameX = 'oneX'; break;
            case 2: classNameX = 'twoX'; break;
            case 3: classNameX = 'threeX'; break;
            case 4: classNameX = 'fourX'; break;
        }

        //puts together the search string for the queryselector in bottom of function
        if(group == 'Z'){
            var fullClass = '.zDot.'+classNameY+'.'+ classNameX;
        }else if(group == 'C'){
            var fullClass = '.cDot.'+classNameY+'.'+ classNameX;
        }
        // console.log(document.querySelector(fullClass));
        //this finds the selected blip and makes it visible
        document.querySelector(fullClass).style.display = 'initial';
    });

}

function endAnimate(){

    if(this.classList.contains('fadeOut')){
        this.classList.remove('fadeOut');
        this.classList.add('fadeIn');
        move(buttonPressed);

    }else if(this.classList.contains('fadeIn')){
        this.classList.remove('fadeIn');
        buttons.forEach(button => {
            if(!(button.id == 'MISC')){
                button.style.opacity = 1;
            }
        });
        walkAudio.pause();
        walkAudio.currentTime = 1;


    }
}

function startAnimate(){
    canvasArea.classList.add('fadeOut')
    buttonPressed = this;
    buttons.forEach(button => {
        if(!(button.id == 'MISC')){
            button.style.opacity = 0;
        }
    });
    walkAudio.play();

}
//adding eventlisteners onclick to all buttons and starting the move function if it is a arrow button
buttons.forEach(button => button.addEventListener('click',startAnimate));
canvasArea.addEventListener('animationend',endAnimate);