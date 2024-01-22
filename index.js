// import Player from "./player.js";


let matrix_wrapper = document.getElementById("matrix");

class Player {
    constructor(r,c) {
        this.row = r;
        this.column = c;
        this.hp = 3;
        this.projectiles = [];
        this.maxMovements = 2;
        this.movements = 2;
        this.maxPower = 5;
        this.power = 5;
    } 

    set(r, c) {
        this.row = r;
        this.column = c;
    }

    updateProjectiles () {
        this.projectiles.forEach(p => {
            p.update();
        })
    }

    drawProjectiles () {
        this.projectiles.forEach(p => { matrix[p.row][p.column].class.push("projectile") })
    }

    updateTurn () {
        this.movements = this.maxMovements;
        this.power = this.maxPower;
    }

    createProjectile () {
        let p = new projectile(this.row, this.column, -1, 0)
        this.projectiles.push(p)
    }

    move (r,c) {
        if(this.movements > 0) {
            this.set(r,c);
            this.movements -= 1;
            return true
        } else {
            return false
        }
    }
}

class projectile {
    constructor(r, c, deltaR, deltaC) {
        this.row = r;
        this.column = c;
        this.deltaR = deltaR;
        this.deltaC = deltaC;
    }

    update () {
        this.row = this.row + this.deltaR;
        this.column = this.column + this.deltaC;
    }
}

let keyEvent = (e) => {
    console.log(e.key);
    switch (e.key) {
        case "w":
            movePlayer(PLAYER.row-1, PLAYER.column);
            break;
        case "a":
            movePlayer(PLAYER.row, PLAYER.column-1);
            break;
        case "s":
            movePlayer(PLAYER.row+1, PLAYER.column);
            break;
        case "d":
            movePlayer(PLAYER.row, PLAYER.column+1);
            break;
        case " ":
            updateTurn();
            break
        case "f":
            PLAYER.createProjectile();
            break
        default:
            break;
    }
}

let makeMatrix = (n) => {
    class Cell {
        constructor (r, c) {
            this.row = r;
            this.cell = c;
            this.class = ["cell"];
            this.canEnter = true;
        }
    }

    let m = [];
    for(let i = 0; i < n; i ++) {
        let row = [];
        for(let j = 0; j < n; j++) {
            row.push(new Cell(i, j))
        }
        m.push(row)
    }
    return m;
}

let drawMatrix = (n) => {
    for(let i = 0; i < n; i++) {
        let row = document.createElement("div");
        row.id = `r${i}`;
        row.classList.add("row");
        for(let j = 0; j < n; j ++) {
            let cell = document.createElement("div");
            cell.id = `r${i}c${j}`;
            cell.classList.add("cell");
            row.appendChild(cell);
        }
        matrix_wrapper.appendChild(row);
    }
}


let compairMatrix = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            let cell = document.getElementById(`r${i}c${j}`);
            cell.className = matrix[i][j].class.join(" ");
        }
    }
}

let checkForBoundry = (r, c) => {
    if(matrix[r] == undefined) { return false }
    else if(matrix[r][c] == undefined) { return false }
    else if(!matrix[r][c].canEnter) { return false }
    else { return true }
}

let selectCell = (r, c) => {
    matrix[r][c].class.push("selected");
}

let unselectCell = (r, c) => {
    matrix[r][c].class.splice(matrix[r][c].class.indexOf("selected"),1)
}

let movePlayer = (r, c) => {
    if(checkForBoundry(r,c) && PLAYER.movements > 0) {
        unselectCell(PLAYER.row, PLAYER.column);
        selectCell(r, c);
        PLAYER.move(r,c);
    }
}



document.addEventListener("keydown", keyEvent)

let matrix = makeMatrix(11);
drawMatrix(11);
let PLAYER = new Player(10,5);
selectCell(PLAYER.row,PLAYER.column);
let turn = 1;


console.log(matrix);


matrix[5][5].canEnter = false;
matrix[5][5].class.push("barrier")

updateTurn = () => {
    PLAYER.updateTurn();
    PLAYER.updateProjectiles();
    PLAYER.drawProjectiles();
}

setInterval(() => {
    compairMatrix();
}, (1000/60))


// setTimeout(() => {
//     unselectCell(10,5)
// }, 3000);