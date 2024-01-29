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
        this.hp = 3;
        this.maxMovements = 2;
        this.movements = 2;
        this.maxPower = 5;
        this.power = 5;
        this.selectedAbility = 0;
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
        console.log("player take damage - hp:", this.hp)
        if(this.hp <= 0) { this.delete = true }
    }

    startTurn () {
        console.log("enemy ai v0.0.1");
        endTurn(this.gameIndex);
    }

    beforeDelete () {
        addLog({ type: "death", name: this.name, content: ` died` })
    }
}