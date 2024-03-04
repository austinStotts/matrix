

let reduceToOne = (n) => {
    if(n == 0) { return -1 }
    else if(n > 0) { return 1 }
    else { return -1 }
}

let canHit = (er, ec, pr, pc) => {
    if(er == pr || ec == pc) { return true }
    else { return false }
}

let distanceFromPlayer = (er, ec, pr, pc) => {
    let rows = pr - er;
    let columns = pc - ec;
    return { rows, columns };
}

let moveToAttack = () => {

}

let attackPlayer = (er, ec, pr, pc, enemyid) => {
    let d = distanceFromPlayer(er, ec, pr, pc);
    if((Math.abs(d.rows) + Math.abs(d.columns)) < 3) {
        // console.log("real close");
        ENEMIES[enemyid].ability(3);
    } else {
        ENEMIES[enemyid].ability(1);
    }
    let dx = (pc-ec);
    let dy = (pr-er);
    // console.log("dx:", dx);
    // console.log("dy:", dy);
    if(Math.abs(dx) > Math.abs(dy)) {
        // console.log("ATTACK TO SIDES")
        if(dx > 0) {
            // move right
            ENEMIES[enemyid].useAbility(0, 1);
        } else if(dx < 0) {
            // move left
            ENEMIES[enemyid].useAbility(0, -1);
        } else {
            // dont move
        }
    } else {
        if(dy > 0) {
            // move down
            ENEMIES[enemyid].useAbility(1, 0);
        } else if(dy < 0) {
            // move up
            ENEMIES[enemyid].useAbility(-1, 0);
        } else {
            // dont move
        }
    }
}

let moveTowardsPlayer = (er, ec, pr, pc, enemyid) => {
    let d = distanceFromPlayer(er, ec, pr, pc);
    if(Math.ceil(Math.random()*4) > 1) {
        if(canHit(er, ec, pr, pc) || (Math.abs(d.rows) + Math.abs(d.columns)) < 3) {
            //attack
            // console.log("ATTACK");
        } else {
            if(Math.abs(d.rows) <= ENEMIES[enemyid].movements) {
                // console.log("in range of rows!")
                // move 1 row towards player
                moveEnemy(er + reduceToOne(d.rows), ec, enemyid);
            } else if (Math.abs(d.columns) <= ENEMIES[enemyid].movements) {
                // console.log("in range of columns!")
                // move 1 column towards player
                moveEnemy(er, ec + reduceToOne(d.columns), enemyid);
            } else {
                // out of range and cannot hit
                if(d.rows >= d.columns) {
                    moveEnemy(er + reduceToOne(d.rows), ec, enemyid);
                } else {
                    moveEnemy(er, ec + reduceToOne(d.columns), enemyid)
                }
            }
        }
    } else {
        if(d.rows >= d.columns) {
            moveEnemy(er + reduceToOne(d.rows), ec, enemyid);
        } else {
            moveEnemy(er, ec + reduceToOne(d.columns), enemyid);
        }
    }
}

class Seeker {
    constructor(r, c, enemyid, name=generateName()) {
        this.name = name;
        this.type = "enemy";
        this.classname = "enemy";
        this.spriteid = "Seeker";
        this.animate = true;
        this.animateid = "./sprites/seeker.png";
        this.enemyid = enemyid;
        this.fr = 16;
        this.id = getID();
        this.row = r;
        this.column = c;
        this.ability1 = new Shell();
        this.ability3 = new Slice();
        this.hp = 5;
        this.maxMovements = 2;
        this.movements = 1;
        this.maxPower = 5;
        this.power = 2;
        this.selectedAbility = 1;
        this.gameIndex = 1;

        this.ability1.owner = this.name;
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
                // let p = this.ability1.cell(this.row, this.column);
                // drawAbility(p, dr, dc, this.ability1.speed);
                calculateProjectile(this.ability1, this.row, this.column, dr, dc)
                this.power = this.power - this.ability1.cost;
                updateLabels();
                inputMethod = "movement";
            } else {
                inputMethod = "movement";
            }
        } else if(this.selectedAbility == 2) {
            console.log("a mistake was made")
        } else if(this.selectedAbility == 3) {
            if(this.power >= this.ability3.cost) {
                if(this.ability3.custom) {
                    let used = this.ability3.use(dr, dc);
                    if(used) {
                        addLog({ type: "ability", name: this.name, content: ` used ${this.ability3.name}` })
                        this.power = this.power - this.ability2.cost;
                        updateLabels();
                        inputMethod = "movement";
                        this.selectedAbility = 0;
                        removeGridlines();
                    } else {
                        
                    }
                } else {
                    addLog({ type: "ability", name: this.name, content: ` used ${this.ability3.name}` })
                    let p = this.ability3.cell(this.row, this.column, dr, dc);
                    drawAbility(p, dr, dc, this.ability3.speed);
                    this.power = this.power - this.ability3.cost;
                    updateLabels();
                    inputMethod = "movement";
                    this.selectedAbility = 0;
                    removeGridlines();
                }
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
        addLog({ type: "damage", name: this.name, content: ` took ${n} damage` })
        if(this.hp <= 0) { this.delete = true }
    }

    async startTurn () {
        console.log("enemy ai v0.0.1");
        if(this.hp > 0) {
            // move first
            for(let i = 0; i < this.maxMovements; i++) {
                moveTowardsPlayer(this.row, this.column, PLAYER.row, PLAYER.column, this.enemyid);
                await sleep(500);
                console.log(distanceFromPlayer(this.row, this.column, PLAYER.row, PLAYER.column));
                console.log("can hit player?: ", canHit(this.row, this.column, PLAYER.row, PLAYER.column));
            }

            // attack

            for(let i = 0; i < this.maxPower; i++) {
                attackPlayer(this.row, this.column, PLAYER.row, PLAYER.column, this.enemyid);
                await sleep(500);
            }

            endTurn(this.gameIndex);
        } else {
            endTurn(this.gameIndex);
        }



    }

    beforeDelete () {
        addLog({ type: "death", name: this.name, content: ` died` })
    }
}




// ENEMY PATHFINDING

let trimPaths = (sortedPath) => {
    let trimmedPaths = [];
    trimmedPaths.push(sortedPath[0]);
    for(let i = 1; i < sortedPath.length; i++) {
        let isNew = true;
        for(let j = 0; j < trimmedPaths.length; j++) {
            let p = trimmedPaths[j][trimmedPaths[j].length-1];
            let s = sortedPath[i][sortedPath[i].length-1];
            if(s[0] == p[0] && s[1] == p[1]) {
                isNew = false;
            }
        }
        if(isNew) {
            trimmedPaths.push(sortedPath[i])
        }
    }
    return trimmedPaths
}

let findAbsDistance = (r1,c1,r2,c2) => {
    let rows = r2 - r1;
    let columns = c2 - c1;
    return Math.abs(rows) + Math.abs(columns);
}

let findClosestPath = (paths, pr, pc) => {
    return trimPaths(paths.sort((a,b) => {
        return findAbsDistance(a[a.length-1][0], a[a.length-1][1], pr, pc) - findAbsDistance(b[b.length-1][0], b[b.length-1][1], pr, pc)
    }))
}

let pickPath = (paths) => {
    console.log(paths);
    let top25 = paths.slice(0, Math.floor(paths.length/4));
    let r = Math.floor(Math.random() * top25.length);
    console.log(r)
    return top25[r]
}

let walkPath = async (path, enemyid) => {
    for(let i = 1; i < path.length; i++) {
        moveEnemy(path[i][0], path[i][1], enemyid);
        await sleep(100);
    }
}

let canEnter = (r,c) => {
    if(matrix[r]) {
        if(matrix[r][c]) {
            if(!checkForConstruct(r,c) && !checkIfPlayer(r,c) && !checkIfEnemy(r,c)) {
                return true;
            }
        }
    }
    return false;
}

let totalMovementCost = (path) => {
    let total = 0;
    for(let i = 1; i < path.length; i++) {
        total = total + matrix[path[i][0]][path[i][1]].tile.movementCost;
    }
    return total;
}

// need to account for movement costs
let findBestPath = (er, ec, pr, pc, enemyid) => { // returns an array of all possible paths

    let maxMoves = ENEMIES[enemyid].maxMovements;
    let paths = [];

    let loop = (path) => {
        let d = distanceFromPlayer(path[path.length-1][0], path[path.length-1][1], pr, pc);
        if(path.length >= maxMoves+1 || totalMovementCost(path) >= maxMoves) {
            paths.push(path);
            return
        } 
        else if (Math.abs(d.rows) + Math.abs(d.columns) < 2) {
            paths.push(path);
            return
        }
        else {
            // down > left > up > right
            let r = path[path.length-1][0];
            let c = path[path.length-1][1];
            if(canEnter(r+1,c)) { //down
                loop([...path,[r+1,c]]);
            }
            if(canEnter(r,c-1)) { //left
                loop([...path,[r,c-1]]);
            }
            if(canEnter(r-1,c)) { //up
                loop([...path,[r-1,c]]);
            }
            if(canEnter(r,c+1)) {// right
                loop([...path,[r,c+1]]);
            }
            return
        }
    }

    loop([[er,ec]]);
    let possiblePaths = findClosestPath(paths, pr, pc);
    let finalPath = pickPath(possiblePaths);
    console.log(finalPath);
    walkPath(finalPath, enemyid);
}




let grexAttackPlayer = (er, ec, pr, pc, enemyid) => {
    let d = distanceFromPlayer(er, ec, pr, pc);
    if((Math.abs(d.rows) + Math.abs(d.columns)) < 3) {
        console.log("real close");
        ENEMIES[enemyid].ability(3);
        let dx = (pc-ec);
        let dy = (pr-er);
        // console.log("dx:", dx);
        // console.log("dy:", dy);
        if(Math.abs(dx) > Math.abs(dy)) {
            // console.log("ATTACK TO SIDES")
            if(dx > 0) {
                // move right
                ENEMIES[enemyid].useAbility(0, 1);
            } else if(dx < 0) {
                // move left
                ENEMIES[enemyid].useAbility(0, -1);
            } else {
                // dont move
            }
        } else {
            if(dy > 0) {
                // move down
                ENEMIES[enemyid].useAbility(1, 0);
            } else if(dy < 0) {
                // move up
                ENEMIES[enemyid].useAbility(-1, 0);
            } else {
                // dont move
            }
        }
    }
}




class Grex {
    constructor(r, c, enemyid, name=generateName()) {
        this.name = name;
        this.type = "enemy";
        this.classname = "enemy";
        this.spriteid = "Grex";
        this.fr = 8;
        this.animate = true;
        this.animateid = "Grex";
        this.enemyid = enemyid;
        this.id = getID();
        this.row = r;
        this.column = c;
        this.ability3 = new Slice();
        this.hp = 3;
        this.maxMovements = 4;
        this.movements = 4;
        this.maxPower = 5;
        this.power = 2;
        this.selectedAbility = 1;
        this.gameIndex = 1;

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

        if(this.power >= this.ability3.cost) {
            if(this.ability3.custom) {
                let used = this.ability3.use(dr, dc);
                if(used) {
                    addLog({ type: "ability", name: this.name, content: ` used ${this.ability3.name}` })
                    this.power = this.power - this.ability2.cost;
                    updateLabels();
                    inputMethod = "movement";
                    this.selectedAbility = 0;
                    removeGridlines();
                } else {
                    
                }
            } else {
                addLog({ type: "ability", name: this.name, content: ` used ${this.ability3.name}` })
                let p = this.ability3.cell(this.row, this.column, dr, dc);
                drawAbility(p, dr, dc, this.ability3.speed);
                this.power = this.power - this.ability3.cost;
                updateLabels();
                inputMethod = "movement";
                this.selectedAbility = 0;
                removeGridlines();
            }
        } else {
            inputMethod = "movement";
        }
    
    }

    move (r,c, cost) {
        if(this.movements >= cost) {
            matrix[this.row][this.column].tile = new Mercury();
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
        addLog({ type: "damage", name: this.name, content: ` took ${n} damage` })
        if(this.hp <= 0) { this.delete = true }
    }

    async startTurn () {
        
        console.log("enemy ai v0.0.1");
        if(this.hp > 0) {
            // move first
            findBestPath(this.row, this.column, PLAYER.row, PLAYER.column, this.enemyid);

            // attack
            for(let i = 0; i < this.maxPower; i++) {
                grexAttackPlayer(this.row, this.column, PLAYER.row, PLAYER.column, this.enemyid);
                await sleep(500);
            }

            endTurn(this.gameIndex);
        } else {
            endTurn(this.gameIndex);
        }



    }

    beforeDelete () {
        addLog({ type: "death", name: this.name, content: ` died` })
    }


}














let sortLeaps = (leaps, pr, pc) => {
    leaps.sort((a,b) => {
        return (findAbsDistance(a[0], a[1], pr, pc) - findAbsDistance(b[0], b[1], pr, pc))
    })
    return leaps;
}

let getPossibleLeaps = (r,c) => {
    let leaps = [];
    for(let i = 0; i < matrix.length; i++) {
        for(let j = 0; j < matrix[i].length; j++) {
            let d = distanceFromPlayer(i,j,r,c);
            if((Math.abs(d.rows) + Math.abs(d.columns)) < 5) {
                if(checkForBoundry(i,j) && !checkIfPlayer(i,j) && !checkForConstruct(i,j) && !checkIfEnemy(i,j)) {
                    leaps.push([i,j])
                }
            } 
        }
    }
    return leaps;
}



let caageAttackEnemy = (er, ec, pr, pc, enemyid) => {
    // console.log("real close");
    ENEMIES[enemyid].ability(1);
    let dx = (pc-ec);
    let dy = (pr-er);
    // console.log("dx:", dx);
    // console.log("dy:", dy);
    if(Math.abs(dx) > Math.abs(dy)) {
        // console.log("ATTACK TO SIDES")
        if(dx > 0) {
            // move right
            ENEMIES[enemyid].useAbility(0, 1);
        } else if(dx < 0) {
            // move left
            ENEMIES[enemyid].useAbility(0, -1);
        } else {
            // dont move
        }
    } else {
        if(dy > 0) {
            // move down
            ENEMIES[enemyid].useAbility(1, 0);
        } else if(dy < 0) {
            // move up
            ENEMIES[enemyid].useAbility(-1, 0);
        } else {
            // dont move
        }
    }
}



class Caage {
    constructor(r, c, enemyid, name=generateName()) {
        this.name = name;
        this.type = "enemy";
        this.classname = "enemy";
        this.spriteid = "Caage";
        this.animate = false;
        this.animateid = "Caage";
        this.enemyid = enemyid;
        this.id = getID();
        this.row = r;
        this.column = c;
        this.ability1 = new Erupt();
        this.ability3 = new Leap();
        this.hp = 3;
        this.maxMovements = 0;
        this.movements = 0;
        this.maxPower = 5;
        this.power = 5;
        this.selectedAbility = 1;
        this.gameIndex = 1;
        this.state = "erupt";

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
                if(this.ability1.custom) {
                    let used = this.ability1.use(dr, dc, this.row, this.column);
                    if(used) {
                        addLog({ type: "ability", name: this.name, content: ` used ${this.ability1.name}` })
                        this.power = this.power - this.ability1.cost;
                        updateLabels();
                        inputMethod = "movement";
                        this.selectedAbility = 0;
                        removeGridlines();
                    } else {
                        
                    }
                } else {
                    addLog({ type: "ability", name: this.name, content: ` used ${this.ability1.name}` });
                    calculateProjectile(this.ability1, this.row, this.column, dr, dc)
                    // let p = this.ability1.cell(PLAYER.row, PLAYER.column);
                    // drawAbility(p, dr, dc, this.ability1.speed);
                    this.power = this.power - this.ability1.cost;
                    updateLabels();
                    inputMethod = "movement";
                    this.selectedAbility = 0;
                    removeGridlines();
                }
            } else {
                inputMethod = "movement";
                this.selectedAbility = 0;
                removeGridlines();
            }
        } else if(this.selectedAbility == 2) {
            console.log("this is not good")
        } else if(this.selectedAbility == 3) {
            if(this.power >= this.ability3.cost) {
                if(this.ability3.custom) {
                    let used = this.ability3.use(dr, dc, this.row, this.column);
                    if(used) {
                        addLog({ type: "ability", name: this.name, content: ` used ${this.ability3.name}` })
                        this.power = this.power - this.ability2.cost;
                        updateLabels();
                        inputMethod = "movement";
                        this.selectedAbility = 0;
                        removeGridlines();
                    } else {
                        
                    }
                } else {
                    addLog({ type: "ability", name: this.name, content: ` used ${this.ability3.name}` })
                    let p = this.ability3.cell(this.row, this.column, dr, dc);
                    drawAbility(p, dr, dc, this.ability3.speed);
                    this.power = this.power - this.ability3.cost;
                    updateLabels();
                    inputMethod = "movement";
                    this.selectedAbility = 0;
                    removeGridlines();
                }
            } else {
                inputMethod = "movement";
                this.selectedAbility = 0;
                removeGridlines();
            }
        } 
        else {
            console.log("invalid ability selected: ", this.selectedAbility)
        }
        updateLabels();
    
    }

    move (r,c, cost) {
        if(this.movements >= cost) {
            matrix[this.row][this.column].tile = new Mercury();
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
        addLog({ type: "damage", name: this.name, content: ` took ${n} damage` })
        if(this.hp <= 0) { this.delete = true }
    }

    async startTurn () {

        // add delay to moves and what not so its not so instant
        // add the grex random top 25% thing to the pathing so its not so exact
        if(this.hp > 0) {
            console.log("caage ai v1");

            if(this.state == "erupt") {
                await sleep(500);
                attackPlayer(this.row, this.column, PLAYER.row, PLAYER.column, this.enemyid);
                this.state = "leap";
            } else if (this.state = "leap") {
                await sleep(500);
                let l = sortLeaps(getPossibleLeaps(this.row, this.column), PLAYER.row, PLAYER.column);
                markForUpdate(ENEMIES[this.enemyid].row, ENEMIES[this.enemyid].column); 
                removefromCell(ENEMIES[this.enemyid].row, ENEMIES[this.enemyid].column, ENEMIES[this.enemyid].id);
                addToCell(l[0][0], l[0][1], ENEMIES[this.enemyid]);
                ENEMIES[this.enemyid].set(l[0][0], l[0][1]);
                updateLabels();
                markForUpdate(l[0][0], l[0][1]); 

                this.state = "erupt";
                
            } else {
                console.log("error");
            }
        }   
        await sleep(500);
        endTurn(this.gameIndex);
        
    }

    beforeDelete () {
        addLog({ type: "death", name: this.name, content: ` died` })
    }


}





































let enemies = { Seeker, Grex, Caage }

