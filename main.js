const ALIVE_COLOR = "Black";
const DEAD_COLOR = "White";
const INTERVAL_COLOR = "Gray";
const CELL_INTERVAL = 0.5;
const CELL_SIZE = 10 + CELL_INTERVAL*2;
const CELL_COUNT = 60;
let fps = 10;
let ctx = null;
let stop  = true;
let cell_list = null;

document.addEventListener("keypress",function (e){
    if(e.key == " "){
        switchStop();
    }
    if(e.key == "r"){
        reset();
    }
    if(e.key == "c"){
        clearcell();
    }
});
//fix Misalignment with html
document.addEventListener("click", function (e) {
    let canvas = document.getElementById('life_game');
    let rect = canvas.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    x = parseInt(x / CELL_SIZE);
    y = parseInt(y / CELL_SIZE);
    cell_list[x][y].isAlive = !cell_list[x][y].isAlive;
    for (let i in cell_list) {
        for (let j in cell_list[i]) {
            cell_list[i][j].draw();
        }
    }
});

function clearcell(){
    cell_list = [];
    for (let i = 0; i < CELL_COUNT; i++){
        cell_list[i] = [];
        for(let j = 0; j < CELL_COUNT; j++){
            cell_list[i][j] = new Cell(i*CELL_SIZE, j*CELL_SIZE,false);
        }
    }
}

function switchStop(){
    stop = !stop;
}

class Cell{
    constructor(x, y,isAlive = false){
        this.x = x;
        this.y = y;
        this.isAlive = isAlive;
    }
    draw(){
        ctx.fillStyle = this.isAlive ? ALIVE_COLOR : DEAD_COLOR;
        ctx.fillRect(this.x+CELL_INTERVAL, this.y+CELL_INTERVAL, CELL_SIZE-CELL_INTERVAL*2, CELL_SIZE-CELL_INTERVAL*2);

        ctx.fillStyle = INTERVAL_COLOR;
        ctx.fillRect(this.x,this.y,CELL_INTERVAL,CELL_SIZE);
        ctx.fillRect(this.x,this.y,CELL_SIZE,CELL_INTERVAL);
        ctx.fillRect(this.x+CELL_SIZE-CELL_INTERVAL,this.y,CELL_INTERVAL,CELL_SIZE);
        ctx.fillRect(this.x,this.y+CELL_SIZE-CELL_INTERVAL,CELL_SIZE,CELL_INTERVAL);
    }
}

function reset(){
    cell_list = [];
    for (let i = 0; i < CELL_COUNT; i++){
        cell_list[i] = [];
        for(let j = 0; j < CELL_COUNT; j++){
            cell_list[i][j] = new Cell(i*CELL_SIZE, j*CELL_SIZE,[true,false][Math.floor(Math.random()*2)]);
        }
    }
}

function changeFPS(){
    const new_fps = document.getElementById("fpsInput");
    fps = parseInt(new_fps.value);
    console.log("changed" + new_fps.value+fps);

}

function getAliveCount(x, y){
    let alive_count = 0;
    x = parseInt(x);
    y = parseInt(y);
    for (var i = -1; i <= 1; i++){
        for (var j = -1; j <= 1; j++){
            if (i == 0 && j == 0) continue;
            if (x+i < 0 || x+i >= CELL_COUNT || y+j < 0 || y+j >= CELL_COUNT) continue;
            if (cell_list[x+i][y+j].isAlive) alive_count++;
        }
    }
    return alive_count;
}

function update(){
    ctx = document.getElementById('life_game').getContext('2d');
    for (let i in cell_list) {
        for (let j in cell_list[i]) {
            cell_list[i][j].draw();
        }
    }
    if (!stop) {
        let next_gen_list = [];
        for (let i in cell_list) {
            next_gen_list[i] = [];
            for (let j in cell_list[i]) {
                next_gen_list[i][j] = new Cell(i * CELL_SIZE, j * CELL_SIZE, false);
            }
        }
        for (let i in cell_list) {
            for (let j in cell_list[i]) {
                let alive_count = getAliveCount(i, j);
                if (cell_list[i][j].isAlive) {
                    if (alive_count == 2 || alive_count == 3) {
                        next_gen_list[i][j].isAlive = true;
                    }
                } else {
                    if (alive_count == 3) {
                        next_gen_list[i][j].isAlive = true;
                    }
                }
            }
        }
        for (let i in cell_list) {
            for (let j in cell_list[i]) {
                cell_list[i][j].isAlive = next_gen_list[i][j].isAlive;
            }
        }
    }
    setTimeout(update,1000/fps);
}

function main(){
    reset();
    update();
}
window.onload = function (){
    main();
}