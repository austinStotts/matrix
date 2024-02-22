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
        this.hp = 4;
        this.bonusHP = 0;
        this.projectiles = [];
        this.maxMovements = 2;
        this.bonusMovements = 0;
        this.movements = 2;
        this.maxPower = 5;
        this.bonusPower = 0;
        this.power = 5;
        this.selectedAbility = 0;
        this.gameIndex = 0;

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
        this.movements = this.maxMovements + this.bonusMovements;
        this.power = this.maxPower + this.bonusPower;
        this.hp = this.hp + this.bonusHP;
        this.bonusMovements = 0;
        this.bonusPower = 0;
        this.bonusHP = 0;
    }

    ability (x) {
        this.selectedAbility = x;
        showSelectedAbility(x);
        if(PLAYER[`ability${PLAYER.selectedAbility}`]) {
            if(PLAYER[`ability${PLAYER.selectedAbility}`].allowClick) {
                PLAYER[`ability${PLAYER.selectedAbility}`].showGridLines(this.row, this.column)
                // showGridLines(this.row, this.column)
            }
        }
        inputMethod = "ability";
        updateLabels();
    }

    useAbility (dr, dc) {
        if(this.selectedAbility == 1) {
            if(this.power >= this.ability1.cost) {
                if(this.ability1.custom) {
                    let used = this.ability1.use(dr, dc);
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
            if(this.power >= this.ability2.cost) {
                if(this.ability2.custom) {
                    let used = this.ability2.use(dr, dc);
                    if(used) {
                        addLog({ type: "ability", name: this.name, content: ` used ${this.ability2.name}` })
                        updateLabels();
                        inputMethod = "movement";
                        this.selectedAbility = 0;
                        removeGridlines();
                    } else {
                        
                    }
                } else {
                    // let p = this.ability2.cell(PLAYER.row, PLAYER.column);
                    // drawAbility(p, dr, dc, this.ability2.speed);
                    addLog({ type: "ability", name: this.name, content: ` used ${this.ability2.name}` });
                    calculateProjectile(this.ability2, this.row, this.column, dr, dc)
                    this.power = this.power - this.ability2.cost;
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
                    let p = this.ability3.cell(PLAYER.row, PLAYER.column, dr, dc);
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
        showSelectedAbility(this.selectedAbility);
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
        // console.log("player take damage - hp:", this.hp)
        if(this.hp <= 0) { this.delete = true }
    }

    startTurn () {

    }

    endTurn () {
        endTurn(this.gameIndex);
    }

    beforeDelete () {
        addLog({ type: "death", name: this.name, content: ` died` })
    }
}