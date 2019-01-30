const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);



function collide(arena, player) {
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type){
    switch(type){
        case 't':
            
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];

        case 'o':
        return [
            [2, 2],
            [2, 2],
        ];

        case 'z':
        return [
            [6, 6, 0],
            [0, 6, 6],
            [0, 0, 0],
        ];

        case 's':
        return [
            [0, 7, 7],
            [7, 7, 0],
            [0, 0, 0],
        ];

        case 'l':
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];

        case 'j':
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];

        case 'i':
        return [
            [0, 5, 0 ,0],
            [0, 5, 0, 0],
            [0, 5, 0 ,0],
            [0, 5, 0, 0],
        ];
        
    }
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect(x + offset.x,
                                 y + offset.y,
                                 1, 1);
            }
        });
    });
}

const arena = createMatrix(12, 20);

const player = {
    pos: {x: 5, y: 5},
    matrix: createPiece('t'),
};

function draw() {
    context.fillStyle = '#000';
    context.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(arena,{x:0,y:0});
    drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value !== 0) {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}
function playerDrop() {
   player.pos.y++;
   if (collide(arena, player)) {
       player.pos.y--;
       merge(arena, player);
       playerReset();
   }
   dropCounter = 0;
}


function playerMove(dir){
    player.pos.x += dir;
    if (collide(arena,player)){
        player.pos.x -= dir; 
    }
}

function playerReset(){
    const pieces = 'ilojtsz';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2|0) -
                    (player.matrix[0].length /2 | 0);
    if(collide(arena,player)){
        arena.forEach(row => row.fill(0));
    }
}

function playerRotate(dir){
    const pos = player.pos.x;
    let offset = 1;
    rotate(player.matrix,dir);
    while(collide(arena,player)){
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1: -1));
        if(offset > player.matrix[0].length){
            rotate(player.matrix, -dir);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix,dir){
    for(let y = 0; y < matrix.length; ++y){
        for(let x = 0; x < y; ++x){
            [
                matrix[x][y],
                matrix[y][x],
            ]
            =
            [
                matrix[y][x],
                matrix[x][y],
            ];

            if(dir > 0) {
                matrix.forEach(row => row.reverse());
            }
            else matrix.reverse();
    }
}
}

 let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;
    if (dropCounter > dropInterval) {
        playerDrop();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

const colors = [
    null,
    'purple',
    'yellow',
    'orange',
    'blue',
    'cyan',
    'green',
    'red'

]

//left.37 right.39 down.40 q.81 e.69
document.addEventListener('keydown', e => {
    switch(e.keyCode){
        case 37: //left
        playerMove(-1);
        break;
        
        case 39: //right
        playerMove(1);
        break;

        case 40: //down
        playerDrop();
        
        break;

        case 81: //Q rotate left
        playerRotate(-1);
        break;

        case 69: //E rotate right
        playerRotate(1);
        break;
    }
});

update();