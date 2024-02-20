

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
        console.log("real close");
        ENEMIES[enemyid].ability(3);
    } else {
        ENEMIES[enemyid].ability(1);
    }
    let dx = (pc-ec);
    let dy = (pr-er);
    console.log("dx:", dx);
    console.log("dy:", dy);
    if(Math.abs(dx) > Math.abs(dy)) {
        console.log("ATTACK TO SIDES")
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
            console.log("ATTACK");
        } else {
            if(Math.abs(d.rows) <= ENEMIES[enemyid].movements) {
                console.log("in range of rows!")
                // move 1 row towards player
                moveEnemy(er + reduceToOne(d.rows), ec, enemyid);
            } else if (Math.abs(d.columns) <= ENEMIES[enemyid].movements) {
                console.log("in range of columns!")
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











class Grex {
    constructor(r, c, enemyid, name=generateName()) {
        this.name = name;
        this.type = "enemy";
        this.classname = "enemy";
        this.spriteid = "Grex";
        this.animate = false;
        this.animateid = "Grex";
        this.enemyid = enemyid;
        this.id = getID();
        this.row = r;
        this.column = c;
        this.ability1 = new Shell();
        this.ability3 = new Slice();
        this.hp = 3;
        this.maxMovements = 4;
        this.movements = 2;
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
































let enemies = { Seeker, Grex }

