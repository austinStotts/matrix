// import Player from "./player.js";
// import { Shell } from "./abilities.js";

class Projectile {
    constructor(r, c, deltaR, deltaC, name, a) {
        this.name = name;
        this.row = r;
        this.column = c;
        this.deltaR = deltaR;
        this.deltaC = deltaC;
        this.ability = a;
    }

    update () {
        if(checkForBoundry(this.row + this.deltaR, this.column + this.deltaC)) {
            removeClass(this.row, this.column, this.name)
            this.row = this.row + this.deltaR;
            this.column = this.column + this.deltaC;
            // matrix[this.row][this.column].children[Object.keys(matrix[this.row][this.column].children).length] = 
            return true;
        } else {
            removeClass(this.row, this.column, this.name)
            return false;
        }

    }
}

class Shell {
    constructor() {
        this.type = "projectile";
        this.damage = 2;
        this.cost = 2;
        this.info = "standard shell: travels forward until it hits something";
        this.damage_type = "standard";
        this.name = "shell";
        this.speed = 200;

    }

    cell (r, c) {
        let _owner = this.owner; 
        return new class Shell_p {
            constructor () {
                this.owner = _owner;
                this.type = "projectile";
                this.classname = "shell";
                this.name = "shell"
                this.dmg = 2;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
            }

            beforeDelete () {
                console.log(this.row, this.column)
            }
        }
    }
}

class Terraform {
    constructor() {
        this.type = "projectile";
        this.damage = 1;
        this.cost = 3;
        this.info = "forable arrand the eath to protect you";
        this.damage_type = "standard";
        this.name = "terraform";
        this.speed = 150;

    }

    cell (r, c) {
        let _owner = this.owner; 
        return new class Terraform_p {
            constructor () {
                this.owner = _owner;
                this.type = "projectile";
                this.classname = "terraform";
                this.name = "terraform"
                this.dmg = 1;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false
            }

            beforeDelete () {
                let _owner = this.owner;
                let _r = this.row;
                let _c = this.column;
                let _dr = this.dr;
                let _dc = this.dc;
                class Terraformation {
                    constructor() {
                        this.name = "terraformation";
                        this.classname = "terraformation";
                        this.owner = _owner;
                        this.hp = 1;
                        this.type = "construct";
                        this.id = getID();
                        this.delete = false;
                        this.rd = _dr;
                        this.dc = _dc;
                    }

                    takeDamage (n) {
                        this.hp -= n;
                        if(this.hp <= 0) { this.delete = true }
                    }

                    beforeDelete () {
                        console.log("terraformation delete")
                    }
                }
                console.log(_r, _c)
                addToCell(_r - this.dr, _c - this.dc, new Terraformation(), false)
            }
        }
    }
}

class Wall {
    constructor() {
        this.name = "wall";
        this.hp = 2;
        this.classname = "wall";
        this.type = "construct";
        this.id = getID();
        this.delete = false;
    }

    takeDamage (n) {
        this.hp -= n;
        if(this.hp <= 0) { this.delete = true }
    }

    beforeDelete () {
        console.log(this.row, this.column);
    }
}













let calculateDamage = (a, b) => {
    // a is dealing damage to b
    // constructs are resistant to standard damage
    console.log("A: ",a)
    console.log("B: ",b)
}

let calculateCell = (r, c) => {
    // 3 types of things can be in a cell
    // player
    // projectile
    // construct

    // when function is called on a cell
    // check cell children to see what should happen
    
    // if constuct and projetile are in the cell > damage the construct and destroy the projectile
    
    // if player is in the cell > damage the player and destroy the projectile

    // the move function should not allow players to be in the same cell as constructs


    let projectiles = [];
    let constructs = [];
    let players = [];
    Object.keys(matrix[r][c].children).forEach(key => {

        if(matrix[r][c].children[key].type == "projectile") {
            projectiles.push(matrix[r][c].children[key]);
        } else if(matrix[r][c].children[key].type == "construct") {
            constructs.push(matrix[r][c].children[key]);
        } else if(matrix[r][c].children[key].type == "players") {
            players.push(matrix[r][c].children[key]);
        }
    })


    if(constructs.length > 0 && projectiles.length > 0) {
        let total = 0;
        projectiles.forEach(projectile => {
            console.log(projectile.owner)
            total += projectile.dmg;
        })
        constructs.forEach(construct => {
            // console.log("total damage: ", total)
            
            projectiles.forEach(projectile => {
                // console.log(projectile.owner)
                if(construct.owner == projectile.owner) {
                    //do nothing
                } else {
                    construct.takeDamage(projectile.dmg)
                }
            })
        })
    }

    if(constructs.length > 0) {
        projectiles.forEach(p => { p.delete = true; })
    }


}






let generateName = () => {
    names = ["tom", "bill", "roger", "fox", "zero", "gabby", "lenny", "gus", "arlo", "nora", "noland", "ethan", "paul"]
    return (names[Math.floor(Math.random()*names.length)])
}



let matrix_wrapper = document.getElementById("matrix");



class Player {
    constructor(r, c, a1, a2, a3, name=generateName()) {
        this.name = name;
        this.type = "player";
        this.classname = "player";
        this.id = getID();
        this.row = r;
        this.column = c;
        this.ability1 = a1;
        this.ability2 = a2;
        this.ability3 = a3;
        this.hp = 3;
        this.projectiles = [];
        this.maxMovements = 2;
        this.movements = 2;
        this.maxPower = 5;
        this.power = 5;
        this.selectedAbility = 0;

        this.ability1.owner = this.name;
        this.ability2.owner = this.name;
        this.ability3.owner = this.name;
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
        this.projectiles.forEach(p => { matrix[p.row][p.column].class.push(p.name) })
    }

    updateTurn () {
        this.movements = this.maxMovements;
        this.power = this.maxPower;
    }

    ability (x) {
        this.selectedAbility = x;
        inputMethod = "ability"
    }

    useAbility (dr, dc) {
        if(this.selectedAbility == 1) {
            if(this.power >= this.ability1.cost) {
                let p = this.ability1.cell(PLAYER.row, PLAYER.column);
                drawAbility(p, dr, dc, this.ability1.speed);
                this.power = this.power - this.ability1.cost;
                updateLabels();
                inputMethod = "movement";
            } else {
                inputMethod = "movement";
            }
        } else if(this.selectedAbility == 2) {
            if(this.power >= this.ability2.cost) {
                let p = this.ability2.cell(PLAYER.row, PLAYER.column);
                drawAbility(p, dr, dc, this.ability2.speed);
                this.power = this.power - this.ability2.cost;
                updateLabels();
                inputMethod = "movement";
            } else {
                inputMethod = "movement";
            }
        } 
        else {
            console.log("invalid ability selected: ", this.selectedAbility)
        }
    }

    move (r,c) {
        if(this.movements > 0) {
            this.set(r,c);
            this.movements -= 1;
            updateLabels()
            return true
        } else {
            return false
        }
    }

    beforeDelete () {
        console.log(this.row, this.column)
    }
}

let animatePlayerMove = (r, c) => {
    // let cell = document.getElementById(`r${r}c${c}`);
    // cell.classList.add("playermove");
    // setTimeout(() => {
    //     cell.classList.remove("playermove")
    // }, 300)
}

let keyEvent = (e) => {
    if(inputMethod == "movement") {
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
                PLAYER.ability(1);
                break
            case "e":
                PLAYER.ability(2);
                break
            default:
                break;
        }
    } else if(inputMethod == "ability") {
        switch (e.key) {
            case "w":
                PLAYER.useAbility(-1, 0);
                break;
            case "a":
                PLAYER.useAbility(0, -1);
                break;
            case "s":
                PLAYER.useAbility(1, 0);
                break;
            case "d":
                PLAYER.useAbility(0, 1);
                break;
            default:
                break;
        }
    }

}

let makeMatrix = (n) => {
    class Cell {
        constructor (r, c) {
            this.row = r;
            this.cell = c;
            this.class = ["cell"];
            this.canEnter = true;
            this.children = {};
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

let childFormatter = (node) => {
    return (`<div class="child-line-tt"><span class="child-type-tt ${node.type}-tt">${node.type}</span> <span class="child-name-tt">${node.name}</span> <span class="child-hp-tt">${node.hp}</span></div>`)
}

let cellHover = (e) => {
    // console.log(matrix)
    let t = document.createElement("div");
    let row = e.target.id.split("r")[1].split("c")[0];
    let column = e.target.id.split("r")[1].split("c")[1];
    t.id = `r${row}c${column}-tt`
    t.classList.add("cell-tooltip");
    t.style.left = (e.target.offsetLeft + 32) + "px";
    t.style.top = (e.target.offsetTop) + "px";
    // console.log(Object.keys(matrix[row][column].children))
    t.innerHTML = `
        <div class="cordinates">X <span class="x-cord">${column}</span> Y <span class="y-cord">${row}</span></div>
        <div class="cell-children-tt">${Object.keys(matrix[row][column].children).map((key) => { return (childFormatter(matrix[row][column].children[key])) }).join("<br>")}</div>`
    e.target.parentElement.appendChild(t)
    // console.log(e)
}

let cellLeave = (e) => {
    let row = e.target.id.split("r")[1].split("c")[0];
    let column = e.target.id.split("r")[1].split("c")[1];
    let c = document.getElementById(`r${row}c${column}-tt`);
    e.target.parentElement.removeChild(c)
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
            cell.addEventListener("mouseover", cellHover);
            cell.addEventListener("mouseleave", cellLeave);
            row.appendChild(cell);
        }
        matrix_wrapper.appendChild(row);
    }
}


let compairMatrix = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            // calculateCell(i, j)
            let cell = document.getElementById(`r${i}c${j}`);
            let classname = 'cell';
            Object.keys(matrix[i][j].children).forEach(key => {
                if(matrix[i][j].children[key].delete) {
                    matrix[i][j].children[key].beforeDelete();
                    removefromCell(i, j, matrix[i][j].children[key].id);
                    
                } else {
                    classname = classname + " " + matrix[i][j].children[key].classname;
                }
                
            })

            cell.className = classname;
        }
    }
}

let drawAbility = (p, dr, dc, speed) => {
    // console.log(p)
    p.dr = dr;
    p.dc = dc;
    let x = setInterval(() => {
        let con = checkForBoundry(p.row + dr, p.column + dc);
        // compairMatrix();
        // console.log(matrix[p.row][p.column].children)
        if(!con || p.delete) { 
            // p.beforeDelete()
            // removefromCell(p.row, p.column, p.id);
            p.delete = true;
            p.row = p.row + dr;
            p.column = p.column + dc;
            // compairMatrix();
            clearInterval(x); 
        } else {
            removefromCell(p.row, p.column, p.id);
            p.row = p.row + dr;
            p.column = p.column + dc;
            addToCell(p.row, p.column, p);
            calculateCell(p.row, p.column)
        }
    }, speed)
}

// whats happening:
// when a projectile is to be deleted
// as in, it went to the boundry or is hit another cell with something in it
// i want to run a beforeDelete method to do things
// but this often leads to infinite loops of adding a construct to the cell
// only to be destroyed by the projectile that created it and so on. 
// i also dont like how currently you cannot stack constructs... because they have to be in the same cell to interact

let checkForBoundry = (r, c) => {

    if(matrix[r] == undefined) { return false }
    else if(matrix[r][c] == undefined) { return false }
    else if(!matrix[r][c].canEnter) { return false }
    else { return true }

    // update to not allow players in cells with constructs
}

let cid = 1;
let getID = () => {
    cid += 1;
    return cid;
}

let removefromCell = (r, c, id) => {
    delete matrix[r][c].children[id];
    compairMatrix()
}

let addToCell = (r, c, x, update=true) => {
    matrix[r][c].children[x.id] = x;
    calculateCell(r, c);
    update ? compairMatrix() : null;
}

let movePlayer = (r, c) => {
    if(checkForBoundry(r,c) && PLAYER.movements > 0) {
        removefromCell(PLAYER.row, PLAYER.column, PLAYER.id);
        animatePlayerMove(PLAYER.row, PLAYER.column)
        addToCell(r, c, PLAYER)
        PLAYER.move(r,c);
    }
}

let updateLabels = () => {
    document.getElementById("turn").innerText = turn;
    document.getElementById("hp").innerText = PLAYER.hp;
    document.getElementById("movements").innerText = PLAYER.movements;
    document.getElementById("power").innerText = PLAYER.power;
}



document.addEventListener("keydown", keyEvent)

let matrix = makeMatrix(11);
drawMatrix(11);
let PLAYER = new Player(10,5,new Shell(), new Terraform(), new Shell());
let ENEMY = new Player(0, 5, new Shell(), new Shell(), new Shell());
let turn = 1;
let inputMethod = "movement"


let w1 = new Wall("steve");
addToCell(5,5,w1);
addToCell(PLAYER.row, PLAYER.column, PLAYER);
addToCell(ENEMY.row, ENEMY.column, ENEMY);

console.log(matrix);


// matrix[5][5].canEnter = false;
matrix[5][5].class.push("barrier")

updateTurn = () => {
    turn += 1;
    PLAYER.updateTurn();
    PLAYER.updateProjectiles();
    PLAYER.drawProjectiles();
    updateLabels();
}

updateLabels();
setInterval(() => {
    compairMatrix();
}, (1000/60))


// setTimeout(() => {
//     unselectCell(10,5)
// }, 3000);