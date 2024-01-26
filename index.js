












// _________________________________________________
// cell and damage calculations


let calculateDamage = (a, b) => {
    // a is dealing damage to b
    // constructs are resistant to standard damage
    console.log("A: ",a)
    console.log("B: ",b)
}

let calculateCell = (r, c) => {

    let projectiles = [];
    let constructs = [];
    let players = [];
    Object.keys(matrix[r][c].children).forEach(key => {

        if(matrix[r][c].children[key].type == "projectile") {
            projectiles.push(matrix[r][c].children[key]);
        } else if(matrix[r][c].children[key].type == "construct") {
            constructs.push(matrix[r][c].children[key]);
        } else if(matrix[r][c].children[key].type == "player") {
            players.push(matrix[r][c].children[key]);
        }
    })



    if(constructs.length > 0 && projectiles.length > 0) {
        constructs.forEach((construct, i) => {
            projectiles.forEach((projectile, i) => {
                if(construct.owner == projectile.owner) {
                    //do nothing
                } else {
                    construct.takeDamage(projectile.damage);
                }
            })
        })
    }

    if(players.length > 0 && projectiles.length > 0) {
        console.log(players)
        players.forEach((player, i) => {
            projectiles.forEach((projectile, i) => {
                if(player.name == projectile.owner) {
                    //do nothing
                } else {
                    player.takeDamage(projectile.damage);
                }
            })
        })
    }

    if(constructs.length > 0 || players.length > 0) {
        projectiles.forEach(p => { p.delete = true; })
    }
}
// _____________________________________________________





let matrix_wrapper = document.getElementById("matrix");


let generateName = () => {
    names = ["tom", "bill", "roger", "fox", "zero", "gabby", "lenny", "gus", "arlo", "nora", "noland", "ethan", "paul"]
    return (names[Math.floor(Math.random()*names.length)])
}




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

    canAct () {
        let abilitiesAvailable = [];
        if(this.ability1.cost <= this.power) { abilitiesAvailable.push(1) }
        if(this.ability2.cost <= this.power) { abilitiesAvailable.push(2) }
        if(this.ability3.cost <= this.power) { abilitiesAvailable.push(3) }
        return abilitiesAvailable;
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
                addLog({ type: "ability", name: this.name, content: ` used ${this.ability1.name}` })
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
                addLog({ type: "ability", name: this.name, content: ` used ${this.ability2.name}` })
                let p = this.ability2.cell(PLAYER.row, PLAYER.column);
                drawAbility(p, dr, dc, this.ability2.speed);
                this.power = this.power - this.ability2.cost;
                updateLabels();
                inputMethod = "movement";
            } else {
                inputMethod = "movement";
            }
        } else if(this.selectedAbility == 3) {
            if(this.power >= this.ability3.cost) {
                addLog({ type: "ability", name: this.name, content: ` used ${this.ability3.name}` })
                let p = this.ability3.cell(PLAYER.row, PLAYER.column, dr, dc);
                drawAbility(p, dr, dc, this.ability3.speed);
                this.power = this.power - this.ability3.cost;
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

    move (r,c, cost) {
        if(this.movements >= cost) {
            this.set(r,c);
            this.movements -= cost;
            updateLabels();
            return true
        } else {
            return false
        }
    }

    takeDamage (n) {
        this.hp -= n;
        console.log("player take damage - hp:", this.hp)
        if(this.hp <= 0) { this.delete = true }
    }

    beforeDelete () {
        addLog({ type: "death", name: this.name, content: ` died` })
    }
}

let animatePlayerMove = (r, c) => {
    // let cell = document.getElementById(`r${r}c${c}`);
    // cell.classList.add("playermove");
    // setTimeout(() => {
    //     cell.classList.remove("playermove")
    // }, 300)
}





// _________________________________________________________
// log events

let logw = document.getElementById("info-log");
let anchor = document.getElementById("anchor");
let logid = 1;
let addLog = (log) => {
    let l = document.createElement("div");
    l.classList.add("log-row")
    l.innerHTML = `<span class="log-id ${logid % 2 == 0 ? "log-even" : "log-odd"}">${logid}</span><span class="log-player">${log.name}</span><span class="log-content ${log.type}">${log.content}</span>`
    logw.insertBefore(l, anchor);
    console.log(log)
    logid++;
}

logw.scroll(0, 100);

// ____________________________________________________________



// player inputs


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
            case "q":
                PLAYER.ability(3);
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
document.addEventListener("keydown", keyEvent);



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
        <div class="cordinates">X <span class="x-cord">${column}</span> Y <span class="y-cord">${row}</span> <span class="tile-label-tt ${matrix[row][column].tile.name}-tt"><span class="mc-tt">${matrix[row][column].tile.movementCost}</span>${matrix[row][column].tile.name}</span></div>
        <div class="cell-children-tt">${Object.keys(matrix[row][column].children).map((key) => { return (childFormatter(matrix[row][column].children[key])) }).join(`<div class="children-break-tt"></div>`)}</div>`
    e.target.parentElement.appendChild(t)
    // console.log(e)
}

let cellLeave = (e) => {
    let row = e.target.id.split("r")[1].split("c")[0];
    let column = e.target.id.split("r")[1].split("c")[1];
    let c = document.getElementById(`r${row}c${column}-tt`);
    e.target.parentElement.removeChild(c)
}

// ____________________________________________________
// ability boxes

let ab1 = document.getElementById("ab-1");
let ab2 = document.getElementById("ab-2");
let ab3 = document.getElementById("ab-3");

let classIndex = ["x", "F", "E", "Q"]

let formatAbility = (a) => {
    return (`
    <div class="ability-label"><span class="ability-label-name">${a.name}</span><span class="ability-label-class acc">${classIndex[a.abilityClass]}</span></div>
    <div class="ability-icon"></div>
    <div class="ability-data">
        <div class="ability-data-cost"><span class="ability-data-label">cost</span><span class="ability-data-value adc-${a.cost}">${a.cost}</span></div>
        <div class="ability-data-type"><span class="ability-data-label">type</span><span class="ability-data-value adv-text">${a.type}</span></div>
        <div class="ability-data-damage"><span class="ability-data-label">damage</span><span class="ability-data-value adc-${a.damage}">${a.damage}</span></div>
        <div class="ability-data-distance"><span class="ability-data-label">max distance</span><span class="ability-data-value">${a.maxDistance == -1 ? `<span class="infinity">∞</span>` : `<span class="max-distance-data">${a.maxDistance} </span>`}</span></div>
    </div>
    <div class="ability-info">${a.info}</div>
    `)
}

let createAbilityBox = (n, ability) => {
    if(n == 1) {
        ab1.innerHTML = formatAbility(ability);
    } else if (n == 2) {
        ab2.innerHTML = formatAbility(ability);
    } else if (n == 3) {
        ab3.innerHTML = formatAbility(ability);
    } else {
        console.log("invalid ability number")
    }
}

let showAvailableAbilities = () => {
    let options = PLAYER.canAct();
    ab1.classList.remove("available");
    ab2.classList.remove("available");
    ab3.classList.remove("available");
    options.forEach(n => {
        if(n == 1) {
            ab1.classList.add("available");
        } else if (n == 2) {
            ab2.classList.add("available");
        } else if (n == 3) {
            ab3.classList.add("available");
        } else {
            console.log("invalid ability number")
        }
    })
}


// __________________________________________________
// matrix creation and management

let makeMatrix = (n) => {
    class Cell {
        constructor (r, c) {
            this.row = r;
            this.cell = c;
            this.class = ["cell"];
            this.children = {};
            this.tile = new Plains();
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
            cell.addEventListener("mouseover", cellHover);
            cell.addEventListener("mouseleave", cellLeave);
            row.appendChild(cell);
        }
        matrix_wrapper.appendChild(row);
    }
}

// only job is to make the visual matrix match the actual matrix
let compairMatrix = () => { 
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            let cell = document.getElementById(`r${i}c${j}`);
            let classname = 'cell';
            Object.keys(matrix[i][j].children).forEach(key => {
                if(matrix[i][j].children[key].delete) {
                    // do nothing
                } else {
                    classname = classname + " " + matrix[i][j].children[key].classname;
                }
            })

            classname = classname + " " + matrix[i][j].tile.classname;

            cell.className = classname;
        }
    }
}

// delete all nodes that are to be deleted
let pruneMatrix = () => {
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            Object.keys(matrix[i][j].children).forEach(key => {
                if(matrix[i][j].children[key].delete) {
                    console.log("prune deleting: ", i, j)
                    matrix[i][j].children[key].beforeDelete();
                    delete matrix[i][j].children[key];
                }
            })
        }
    }
}

let drawAbility = (p, dr, dc, speed) => {    
    p.dr = dr;
    p.dc = dc;
    if(p.update != undefined) { p.update(dr, dc, p.row, p.column, p.id) }
    let x = setInterval(() => {
        pruneMatrix()
        let con = checkForBoundry(p.row + dr, p.column + dc);
        if(p != undefined) {
            if(!con || p.delete) { 
                p.delete = true;
                p.row = p.row + dr;
                p.column = p.column + dc;
                clearInterval(x); 
                pruneMatrix();
            } else {
                if(p.update != undefined) { p.update(dr, dc, p.row, p.column, p.id) }
                removefromCell(p.row, p.column, p.id);
    
    
                p.row = p.row + dr; 
                p.column = p.column + dc;
                
                
                addToCell(p.row, p.column, p);
            }
        }

    }, speed)
}

// i think i got the order of opper ations fixed...
// no more infinire loops
// now i want to finish moving all the abilities to the othe rjs file
// keep making new ones
// and make a log under the other info items to show what has happened

// add logs to all events

// ...
// the way this works now:
// or how i think it does
// everyframe the compair function runs to draw how the matrix looks
// every action should call the prune function to actually delete nodes that are marked for deletion


// add a check to the player move funtion that can change the cost of movement
// ex: ice or goo cells can slow you down or speed you up






let checkForBoundry = (r, c) => {

    if(matrix[r] == undefined) { return false }
    else if(matrix[r][c] == undefined) { return false }
    else if(!matrix[r][c].tile.allowsMovement) { return false }
    else { return true }

    // update to not allow players in cells with constructs
}

let cid = 1;
let getID = () => {
    cid += 1;
    return cid;
}

let removefromCell = (r, c, id) => {
    if(matrix[r]) {
        if(matrix[r][c]) {
            delete matrix[r][c].children[id];
        }
    }

}

let addToCell = (r, c, x, update=true) => {
    matrix[r][c].children[x.id] = x;
    calculateCell(r, c);
}

let movePlayer = (r, c) => {
    if(checkForBoundry(r,c) && PLAYER.movements >= matrix[r][c].tile.movementCost) {
        removefromCell(PLAYER.row, PLAYER.column, PLAYER.id);
        addToCell(r, c, PLAYER)
        PLAYER.move(r,c, matrix[r][c].tile.movementCost);
    }
}

let updateLabels = () => {
    document.getElementById("turn").innerText = turn;
    document.getElementById("hp").innerText = PLAYER.hp;
    document.getElementById("movements").innerText = PLAYER.movements;
    document.getElementById("power").innerText = PLAYER.power;
    showAvailableAbilities()
}

updateTurn = () => {
    turn += 1;
    PLAYER.updateTurn();
    console.log(matrix)
    updateLabels();
}





// _________________________________________________________
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// init and game loop

let matrix = makeMatrix(11);
drawMatrix(11);
let PLAYER = new Player(10,5,new Shell(), new Terraform_alpha(), new Slice());
let ENEMY = new Enemy(0, 5, new Shell(), new Shell(), new Shell());
let turn = 1;
let inputMethod = "movement"

// matrix[7][5].tile = new Frozen();

let w1 = new Wall("steve");
addToCell(5,5,w1);
addToCell(PLAYER.row, PLAYER.column, PLAYER);
addToCell(ENEMY.row, ENEMY.column, ENEMY);

createAbilityBox(1, PLAYER.ability1);
createAbilityBox(2, PLAYER.ability2);
createAbilityBox(3, PLAYER.ability3);

updateLabels();
setInterval(() => {
    // pruneMatrix();
    compairMatrix();
}, (1000/60))


// setTimeout(() => {
//     unselectCell(10,5)
// }, 3000);

// document.scrollingElement.scroll(0, 1);