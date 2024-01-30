// α β γ

let findSides = (r, c, dr, dc) => {
    if(Math.abs(dr) > 0) {
        return { left: [r, c-1], right: [r, c+1], center: [r, c] }
    } else {
        return { left: [r-1, c], right: [r+1, c], center: [r, c] }
    }
}

let checkIfEmpty = (r,c) => {
    let nChildren = Object.keys(matrix[r][c].children).length;
    if(nChildren <= 0) {
        return true;
    } else {
        return false;
    }
}

let isPlayerHere = (r, c) => {
    let playerFound = false;
    let playersFound = [];
    Object.keys(matrix[r][c].children).forEach(key => {
        if(matrix[r][c].children[key].type == "player") { playerFound = true; playersFound.push(matrix[r][c].children[key]) }
    })

    return {playerFound, playersFound};
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
        console.log("Wall construct take damage - hp:", this.hp)
        if(this.hp <= 0) { this.delete = true }
    }

    beforeDelete () {
        console.log("wall construct before delete", this.hp);
    }
}


class Projectile { // not doing anything
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
        this.info = "standard shell - travels forward until it hits something";
        this.damage_type = "standard";
        this.name = "shell";
        this.speed = 125;
        this.maxDistance = -1;
        this.abilityClass = 1;
        this.allowClick = false;
        this.custom = false;

    }

    cell (r, c) {
        let _owner = this.owner;
        let _damage = this.damage;
        return new class Shell_p {
            constructor () {
                this.owner = _owner;
                this.type = "projectile";
                this.classname = "shell";
                this.name = "shell"
                this.damage = _damage;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
            }

            beforeDelete () {
                console.log("shell projectile before delete")
            }
        }
    }
}



class Terraform_alpha {
    constructor() {
        this.type = "construct";
        this.damage = 2;
        this.cost = 5;
        this.info = "forcibly arrange the earth to protect you";
        this.damage_type = "standard";
        this.name = "terraform α";
        this.speed = 150;
        this.maxDistance = -1;
        this.abilityClass = 2;
        this.allowClick = false;
        this.custom = false;

    }

    cell (r, c) {
        let _owner = this.owner;
        let _damage = this.damage;
        let _name = this.name;
        return new class Terraform_p {
            constructor () {
                this.owner = _owner;
                this.type = "projectile";
                this.classname = "terraform-alpha";
                this.name = _name;
                this.damage = _damage;
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
                        this.name = "terraformation α";
                        this.classname = "terraformation-alpha";
                        this.owner = _owner;
                        this.hp = 2;
                        this.type = "construct";
                        this.id = getID();
                        this.delete = false;
                        this.dr = _dr;
                        this.dc = _dc;
                    }

                    takeDamage (n) {
                        this.hp -= n;
                        if(this.hp <= 0) { this.delete = true }
                    }

                    beforeDelete () {
                        console.log("terraformation construct before delete");
                    }
                }

                addToCell(_r - this.dr, _c - this.dc, new Terraformation(), false)
                let s = findSides(_r - this.dr, _c - this.dc, this.dr, this.dc);
                if(checkIfEmpty(s.left[0], s.left[1])) { addToCell(s.left[0], s.left[1], new Terraformation(), false) }
                if(checkIfEmpty(s.right[0], s.right[1])) { addToCell(s.right[0], s.right[1], new Terraformation(), false) }
                
            }
        }
    }
}


class Terraform_beta {
    constructor() {
        this.type = "construct";
        this.damage = 1;
        this.cost = 3;
        this.info = "forcibly arrange the earth to protect you";
        this.damage_type = "standard";
        this.name = "terraform β";
        this.speed = 150;
        this.abilityClass = 2;
        this.maxDistance = -1;
        this.allowClick = false;
        this.custom = false;
    }

    cell (r, c) {
        let _owner = this.owner;
        let _damage = this.damage;
        let _name = this.name;
        return new class Terraform_p {
            constructor () {
                this.owner = _owner;
                this.type = "projectile";
                this.classname = "terraform-beta";
                this.name = _name;
                this.damage = _damage;
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
                        this.name = "terraformation β";
                        this.classname = "terraformation-beta";
                        this.owner = _owner;
                        this.hp = 2;
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
                        console.log("terraformation construct before delete")
                    }
                }
                
                addToCell(_r - this.dr, _c - this.dc, new Terraformation(), false)
            }
        }
    }
}


class Terraform_gamma {
    constructor() {
        this.type = "construct";
        this.damage = 1;
        this.cost = 2;
        this.info = "forcibly arrange the earth to protect you";
        this.damage_type = "standard";
        this.name = "terraform γ";
        // this.name = "terraform y";
        this.speed = 150;
        this.maxDistance = 5;
        this.abilityClass = 2;
        this.allowClick = false;
        this.custom = false;

    }

    cell (r, c) {
        let _owner = this.owner; 
        let _damage = this.damage;
        let _name = this.name;
        return new class Terraform_p {
            constructor () {
                this.owner = _owner;
                this.type = "projectile";
                this.classname = "terraform-gamma";
                this.name = _name;
                this.damage = _damage;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
                this.maxDistance = 5;
                this.distance = 0;
            }

            update () {
                this.distance += 1;
                if(this.distance >= this.maxDistance) {
                    this.delete = true;
                }
            }

            beforeDelete () {
                let _owner = this.owner;
                let _r = this.row;
                let _c = this.column;
                let _dr = this.dr;
                let _dc = this.dc;
                class Terraformation {
                    constructor() {
                        this.name = "terraformation γ";
                        this.classname = "terraformation-gamma";
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
                        console.log("terraformation construct before delete")
                    }
                }
                
                addToCell(_r - this.dr, _c - this.dc, new Terraformation(), false)
            }
        }
    }
}



class Slice {
    constructor() {
        this.type = "spell";
        this.damage = 2;
        this.cost = 3;
        this.info = "cutting attack forward";
        this.damage_type = "slice";
        this.name = "slice";
        // this.name = "terraform y";
        this.speed = 50;
        this.maxDistance = 0;
        this.abilityClass = 3;
        this.custom = false;
        this.allowClick = false;
    }

    cell (r, c, dr, dc) {
        let _owner = this.owner; 
        let _damage = this.damage;
        let _name = this.name;
        let sides = findSides(r+dr, c+dc, dr, dc)
        console.log(sides)
        return new class Slice_p {
            constructor () {
                this.owner = _owner;
                this.type = "spell";
                this.classname = "slice";
                this.name = _name;
                this.damage = _damage;
                this.id = getID();
                this.sides = sides;
                this.delete = false;
                this.maxDistance = 0;
                this.distance = 0;
            }

            update (dr, dc, r, c, id) {
                let _o = this.owner;
                class SliceHit {
                    constructor() {
                        this.owner = _o;
                        this.id = getID();
                        this.type = "projectile";
                        this.damage = 2;
                        this.delete = false;
                        this.classname = "slice"
                    }

                    beforeDelete () {}
                }

                
                
                let x = new SliceHit();
                if(checkForBoundry(this.sides.left[0], this.sides.left[1])) { addToCell(this.sides.left[0], this.sides.left[1], x); }
                setTimeout(() => {
                    removefromCell(this.sides.left[0], this.sides.left[1], x.id);
                    let y = new SliceHit();
                    if(checkForBoundry(this.sides.center[0], this.sides.center[1])) { addToCell(this.sides.center[0], this.sides.center[1], y); }
                    setTimeout(() => {
                        removefromCell(this.sides.center[0], this.sides.center[1], y.id);
                        let z = new SliceHit();
                        if(checkForBoundry(this.sides.right[0], this.sides.right[1])) { addToCell(this.sides.right[0], this.sides.right[1], z); }
                        setTimeout(() => {
                            removefromCell(this.sides.right[0], this.sides.right[1], z.id);
                        }, 50)
                    }, 50)
                }, 50)




                
                // matrix[r][c].children[id].delete = true;
            }

            beforeDelete () {

            }
        }
    }
}

class Meteor_cryo {
    constructor() {
        this.type = "construct";
        this.damage = 1;
        this.cost = 4;
        this.info = "call upon a meteor to alter the battlefield";
        this.damage_type = "standard";
        this.name = "meteor cryo";
        this.speed = 150;
        this.maxDistance = -1;
        this.abilityClass = 2;
        this.custom = true;
        this.allowClick = true;

    }

    use (r, c) {
        if(r == PLAYER.row || c == PLAYER.column) {
            let playerCheck = isPlayerHere(r,c)
            if(playerCheck.playerFound) {
                playerCheck.playersFound.forEach(player => { player.takeDamage(this.damage) })
            } else {
                addToCell(r,c,this.cell());
            }
            if(checkForBoundry(r-1,c)) { matrix[r-1][c].tile = new Frozen() }
            if(checkForBoundry(r,c-1)) { matrix[r][c-1].tile = new Frozen() }
            if(checkForBoundry(r+1,c)) { matrix[r+1][c].tile = new Frozen() }
            if(checkForBoundry(r,c+1)) { matrix[r][c+1].tile = new Frozen() }
            return true;
        } else {
            return false;
        }
    }

    cell (r, c) {
        let _owner = this.owner; 
        let _damage = this.damage;
        let _name = this.name;
        return new class Meteor_p {
            constructor () {
                this.owner = _owner;
                this.type = "construct";
                this.classname = "meteor_cryo";
                this.hp = 1;
                this.name = _name;
                this.damage = _damage;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
                this.maxDistance = 5;
                this.distance = 0;
            }

            beforeDelete () {

            }
        }
    }
}


class Meteor_fire {
    constructor() {
        this.type = "construct";
        this.damage = 1;
        this.cost = 4;
        this.info = "call upon a meteor to alter the battlefield";
        this.damage_type = "standard";
        this.name = "meteor fire";
        this.speed = 150;
        this.maxDistance = -1;
        this.abilityClass = 2;
        this.custom = true;
        this.allowClick = true;

    }

    use (r, c) {
        if(r == PLAYER.row || c == PLAYER.column) {
            let playerCheck = isPlayerHere(r,c)
            if(playerCheck.playerFound) {
                playerCheck.playersFound.forEach(player => { player.takeDamage(this.damage) })
            } else {
                addToCell(r,c,this.cell());
            }
            if(checkForBoundry(r-1,c)) { matrix[r-1][c].tile = new Lava() }
            if(checkForBoundry(r,c-1)) { matrix[r][c-1].tile = new Lava() }
            if(checkForBoundry(r+1,c)) { matrix[r+1][c].tile = new Lava() }
            if(checkForBoundry(r,c+1)) { matrix[r][c+1].tile = new Lava() }
            return true;
        } else {
            return false;
        }
    }

    cell (r, c) {
        let _owner = this.owner; 
        let _damage = this.damage;
        let _name = this.name;
        return new class Meteor_p {
            constructor () {
                this.owner = _owner;
                this.type = "construct";
                this.classname = "meteor_fire";
                this.hp = 1;
                this.name = _name;
                this.damage = _damage;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
                this.maxDistance = 5;
                this.distance = 0;
            }

            beforeDelete () {

            }
        }
    }
}


class Gridline {
    constructor() {
        this.type = "visualaid"
        this.allowsMovement = true;
        this.classname = "gridlines"
        this.name = "gridline"
        this.hp = "";
    }
}

class Plains {
    constructor() {
        this.type = "tile"
        this.allowsMovement = true;
        this.movementCost = 1;
        this.classname = "plains"
        this.name = "plains"
        this.dot = 0;
    }
}

class Frozen {
    constructor() {
        this.type = "tile"
        this.allowsMovement = true;
        this.movementCost = 2;
        this.classname = "frozen"
        this.name = "frozen"
        this.dot = 0;
    }
}

class Lava {
    constructor() {
        this.type = "tile"
        this.allowsMovement = true;
        this.movementCost = 2;
        this.classname = "lava"
        this.name = "lava"
        this.dot = 1;
        this.decay = 1;
        this.currentDecay = 0;
        this.maxDecay = 3;
    }
}

let abilities = [Shell, Terraform_alpha, Terraform_beta, Terraform_gamma, Slice, Meteor_cryo, Meteor_fire]