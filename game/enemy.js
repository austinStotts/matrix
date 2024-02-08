let attackPlayer = (y1, x1, y2, x2) => {
    let dx = (x2-x1);
    let dy = (y2-y1);
    if(dx > dy) {
        if(dx > 0) {
            // move right
            ENEMY.useAbility(0, 1);
        } else if(dx < 0) {
            // move left
            ENEMY.useAbility(0, -1);
        } else {
            // dont move
        }
    } else {
        if(dy > 0) {
            // move down
            ENEMY.useAbility(1, 0);
        } else if(dy < 0) {
            // move up
            ENEMY.useAbility(-1, 0);
        } else {
            // dont move
        }
    }
}

let moveTowardsPlayer = (y1, x1, y2, x2) => {
    let dx = (x2-x1);
    let dy = (y2-y1);

    if(dx > dy) {
        if(dx > 0) {
            // move right
            moveEnemy(y1, x1+1);
        } else if(dx < 0) {
            // move left
            moveEnemy(y1, x1-1);
        } else {
            // dont move
        }
    } else {
        if(dy > 0) {
            // move down
            moveEnemy(y1+1, x1);
        } else if(dy < 0) {
            // move up
            moveEnemy(y1-1, x1);
        } else {
            // dont move
        }
    }
}

class Enemy {
    constructor(r, c, a1, a2, a3, name=generateName()) {
        this.name = name;
        this.type = "player";
        this.classname = "enemy";
        this.id = getID();
        this.row = r;
        this.column = c;
        this.ability1 = a1;
        this.ability2 = a2;
        this.ability3 = a3;
        this.hp = 5;
        this.maxMovements = 3;
        this.movements = 1;
        this.maxPower = 5;
        this.power = 2;
        this.selectedAbility = 1;
        this.gameIndex = 1;

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
                let p = this.ability3.cell(PLAYER.row, PLAYER.column);
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
        addLog({ type: "damage", name: this.name, content: ` took ${n} damage` })
        console.log("player take damage - hp:", this.hp)
        if(this.hp <= 0) { this.delete = true }
    }

    async startTurn () {
        console.log("enemy ai v0.0.1");

        // move first
        for(let i = 0; i < this.maxMovements; i++) {
            moveTowardsPlayer(this.row, this.column, PLAYER.row, PLAYER.column);
            await sleep(500);
        }

        // attack

        for(let i = 0; i < this.maxPower; i++) {
            attackPlayer(this.row, this.column, PLAYER.row, PLAYER.column);
            await sleep(500);
        }

        endTurn(this.gameIndex);
    }

    beforeDelete () {
        addLog({ type: "death", name: this.name, content: ` died` })
    }
}