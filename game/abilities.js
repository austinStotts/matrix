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
    constructor(r,c) {
        console.log(r,c)

        this.name = "wall";
        // this.owner = owner;
        this.blocksMovement = true;
        this.hp = 2;
        this.classname = "wall";
        this.type = "construct";
        this.id = getID();
        this.delete = false;
        this.canBeMoved = true;
        this.row = r;
        this.column = c;
        // this.sprite = null;

       
        let s = new Konva.Rect({
            x: matrix[r][c].canvas.x,
            y: matrix[r][c].canvas.y,
            width: 32,
            height: 32
        });
    
        s.fillPatternImage(images.wall);
        // matrix[r][c].canvas.sprite = sprite_;
        layer.add(s);
        this.sprite = s;
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

class Boolean_block {
    constructor(r, c, state=false) {
        this.name = "boolean block";
        this.blocksMovement = state ? true : false;
        this.mechanism_block = true;
        this.row = r;
        this.column = c;
        this.hp = 100;
        this.type = state ? "construct" : "mechanism";
        this.id = getID();
        this.delete = false;
        this.state = state;
        this.canBeMoved = true;
        this.classname = `boolean-block ${state ? "boolean-true" : "boolean-false"}`;
    }

    takeDamage (n) {
        this.hp -= n;
        console.log("Wall construct take damage - hp:", this.hp)
        if(this.hp <= 0) { this.delete = true }
    }

    switch () {
        this.state = !this.state;
        this.blocksMovement = this.state;
        this.classname = `boolean-block boolean-${this.state}`;
        this.state ? this.type = "construct" : this.type = "mechanism";
        if(checkIfEnemy(this.row, this.column) || checkIfPlayer(this.row, this.column)) {
            damagePlayers(this.row, this.column, 100);
        }
    }
}


class Switch {
    constructor(r,c) {
        this.name = "switch";
        this.row = r;
        this.column = c;
        this.blocksMovement = true;
        this.classname = "switch";
        this.type = "mechanism";
        this.id = getID();
        this.delete = false;
        this.state = false;
    }

    beforeDelete () {
        console.log("wall construct before delete", this.hp);
    }

    activate () {
        this.state = !this.state;
        this.sprite.destroy();
        markForUpdate(this.row, this.column);
        switchMatrix()
    }
}




class Reinforced_wall {
    constructor(r,c) {
        this.name = "reinforced wall";
        this.blocksMovement = true;
        this.hp = 3;
        this.classname = "reinforced-wall";
        this.type = "construct";
        this.id = getID();
        this.delete = false;
        this.canBeMoved = true;
        this.row = r;
        this.column = c;

        let s = new Konva.Rect({
            x: matrix[r][c].canvas.x,
            y: matrix[r][c].canvas.y,
            width: 32,
            height: 32
        });
    
        s.fillPatternImage(images.reinforced_wall);
        // matrix[r][c].canvas.sprite = sprite_;
        layer.add(s);
        this.sprite = s;
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
        this.id = "Shell";
        this.type = "projectile";
        this.damage = 1;
        this.cost = 2;
        this.info = "standard shell - travels forward until it hits something";
        this.damage_type = "standard";
        this.name = "shell";
        this.imagename = "shell";
        this.speed = 3;
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
        this.id = "Terraform_alpha";
        this.type = "construct";
        this.damage = 2;
        this.cost = 5;
        this.info = "forcibly arrange the earth to protect you - places 3x 2hp terraformations where it lands";
        this.damage_type = "standard";
        this.name = "terraform α";
        this.imagename = "terraform_alpha";
        this.speed = 10;
        this.maxDistance = -1;
        this.abilityClass = 2;
        this.allowClick = false;
        this.custom = false;

    }

    beforeDelete (cr,cc,pr,pc) {
        let _owner = this.owner;
        class Terraformation {
            constructor(r,c) {
                this.name = "terraformation α";
                this.classname = "terraformation-alpha";
                this.owner = _owner;
                this.hp = 2;
                this.blocksMovement = true;
                this.type = "construct";
                this.id = getID();
                this.delete = false;
                this.canBeMoved = true;
                this.row = r;
                this.column = c;
            }

            takeDamage (n) {
                this.hp -= n;
                if(this.hp <= 0) { this.delete = true }
            }

            beforeDelete () {
                console.log("terraformation construct before delete")
            }
        }

        if(checkIfEmpty(pr,pc)) {addToCell(pr, pc, new Terraformation(), false)}
        let s = findSides(pr, pc, cr-pr, cc-pc);
        if(checkIfEmpty(s.left[0], s.left[1])) { addToCell(s.left[0], s.left[1], new Terraformation(), false) }
        if(checkIfEmpty(s.right[0], s.right[1])) { addToCell(s.right[0], s.right[1], new Terraformation(), false) }

    }

}


class Terraform_beta {
    constructor() {
        this.id = "Terraform_beta";
        this.type = "construct";
        this.damage = 1;
        this.cost = 3;
        this.info = "forcibly arrange the earth to protect you - places 1x 1hp terraformation where it lands";
        this.damage_type = "standard";
        this.name = "terraform β";
        this.imagename = "terraform_beta";
        this.speed = 10;
        this.abilityClass = 2;
        this.maxDistance = -1;
        this.allowClick = false;
        this.custom = false;
    }

    beforeDelete (cr,cc,pr,pc) {
        let _owner = this.owner;
        class Terraformation {
            constructor(r,c) {
                this.name = "terraformation β";
                this.classname = "terraformation-beta";
                this.owner = _owner;
                this.hp = 2;
                this.blocksMovement = true;
                this.type = "construct";
                this.id = getID();
                this.delete = false;
                this.canBeMoved = true;
                this.row = r;
                this.column = c;
            }

            takeDamage (n) {
                this.hp -= n;
                if(this.hp <= 0) { this.delete = true }
            }

            beforeDelete () {
                console.log("terraformation construct before delete")
            }
        }
        
        addToCell(pr,pc, new Terraformation(), false)
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


        }
    }
}


class Terraform_gamma {
    constructor() {
        this.id = "Terraform_gamma";
        this.type = "construct";
        this.damage = 1;
        this.cost = 2;
        this.info = "forcibly arrange the earth to protect you - places 1x 1hp terraformation where it lands";
        this.damage_type = "standard";
        this.name = "terraform γ";
        this.imagename = "terraform_gamma";
        // this.name = "terraform y";
        this.speed = 10;
        this.maxDistance = 5;
        this.abilityClass = 2;
        this.allowClick = false;
        this.custom = false;

    }

    
    // update () {
    //     this.distance += 1;
    //     if(this.distance >= this.maxDistance) {
    //         this.delete = true;
    //     }
    // }

    beforeDelete (cr,cc,pr,pc) {
        let _owner = this.owner;
        class Terraformation {
            constructor(r,c) {
                this.name = "terraformation γ";
                this.classname = "terraformation-gamma";
                this.owner = _owner;
                this.hp = 1;
                this.blocksMovement = true;
                this.type = "construct";
                this.id = getID();
                this.delete = false;
                this.canBeMoved = true;
                this.row = r;
                this.column = c;
            }

            takeDamage (n) {
                this.hp -= n;
                if(this.hp <= 0) { this.delete = true }
            }

            beforeDelete () {
                console.log("terraformation construct before delete")
            }
        }
        
        addToCell(pr,pc, new Terraformation(), false)


    }


}





class Slice {
    constructor() {
        this.id = "Slice";
        this.type = "spell";
        this.damage = 2;
        this.cost = 3;
        this.info = "cutting attack forward - deals damage 3 cells wide & 1 cell in front of you";
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
        this.id = "Meteor_cryo";
        this.type = "construct";
        this.damage = 1;
        this.cost = 4;
        this.info = "call upon a meteor to alter the battlefield - leaves a 1hp constuct where it lands and alters the surrounding tiles to be frozen";
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
            PLAYER.power = PLAYER.power - PLAYER.ability2.cost;
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

    showGridLines (r, c) {
        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                if(i == r || j == c) {
                    matrix[i][j].children.gridlines = new Gridline();
                } 
            }
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
                this.blocksMovement = true;
                this.hp = 1;
                this.name = _name;
                this.damage = _damage;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
                this.maxDistance = 5;
                this.distance = 0;
                this.canBeMoved = true;
            }

            takeDamage (n) {
                this.hp -= n;
                console.log("Wall construct take damage - hp:", this.hp)
                if(this.hp <= 0) { this.delete = true }
            }

            beforeDelete () {

            }
        }
    }
}


class Meteor_fire {
    constructor() {
        this.id = "Meteor_fire";
        this.type = "construct";
        this.damage = 1;
        this.cost = 4;
        this.info = "call upon a meteor to alter the battlefield - leaves a 1hp constuct where it lands and alters the surrounding tiles to be lava";
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
            PLAYER.power = PLAYER.power - PLAYER.ability2.cost;
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

    showGridLines (r, c) {
        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                if(i == r || j == c) {
                    matrix[i][j].children.gridlines = new Gridline();
                } 
            }
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
                this.blocksMovement = true;
                this.hp = 1;
                this.name = _name;
                this.damage = _damage;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
                this.maxDistance = 5;
                this.distance = 0;
                this.canBeMoved = true;
            }

            takeDamage (n) {
                this.hp -= n;
                console.log("Wall construct take damage - hp:", this.hp)
                if(this.hp <= 0) { this.delete = true }
            }

            beforeDelete () {

            }
        }
    }
}


class Focus {
    constructor() {
        this.id = "Focus";
        this.type = "spell";
        this.damage = 0;
        this.cost = 3;
        this.info = "end turn and gain +2 power next turn";
        this.damage_type = "none";
        this.name = "focus";
        // this.name = "terraform y";
        this.speed = 50;
        this.maxDistance = 0;
        this.abilityClass = 3;
        this.custom = true;
        this.allowClick = false;
    }


    use (r, c) {
        PLAYER.endTurn();
        // PLAYER.bonusMovements = 1;
        PLAYER.bonusPower = 2;
        return true;
    }

    beforeDelete () {

    }
}

class Rest {
    constructor() {
        this.id = "Rest";
        this.type = "spell";
        this.damage = 0;
        this.cost = 3;
        this.info = "end turn and gain +2 movement next turn";
        this.damage_type = "none";
        this.name = "rest";
        // this.name = "terraform y";
        this.speed = 50;
        this.maxDistance = 0;
        this.abilityClass = 3;
        this.custom = true;
        this.allowClick = false;
    }


    use (r, c) {
        PLAYER.endTurn();
        PLAYER.bonusMovements = 2;
        // PLAYER.bonusPower = 1;
        return true;
    }

    beforeDelete () {

    }
}

class Heal {
    constructor() {
        this.id = "Heal";
        this.type = "spell";
        this.damage = 0;
        this.cost = 3;
        this.info = "end turn and gain +1 hp next turn";
        this.damage_type = "none";
        this.name = "heal";
        // this.name = "terraform y";
        this.speed = 50;
        this.maxDistance = 0;
        this.abilityClass = 3;
        this.custom = true;
        this.allowClick = false;
    }


    use (r, c) {
        PLAYER.endTurn();
        PLAYER.bonusHP = 1;
        // PLAYER.bonusMovements = 2;
        // PLAYER.bonusPower = 1;
        return true;
    }

    beforeDelete () {

    }
}

class Shotgun {
    constructor() {
        this.id = "Shotgun";
        this.type = "projectile";
        this.damage = 2;
        this.cost = 5;
        this.info = "damage in a V shape forward - goes through constructs";
        this.damage_type = "standard";
        this.name = "shotgun";
        this.imagename = "shotgun";
        this.speed = 3;
        this.maxDistance = 3;
        this.abilityClass = 1;
        this.allowClick = false;
        this.custom = true;

    }

    use (dr,dc) {
        let cells = [];
        let distance = 1;
        let width = 1;
        let cr = PLAYER.row + dr;
        let cc = PLAYER.column + dc;
        let dir = getDirection(dr, dc);
        while(distance <= this.maxDistance) {
            
            let l = (Math.floor(width/2)* -1);
            let r = Math.abs(l);
            console.log("l:",l,"w:",width,"r:",r);

            // do middle
            cells.push([cr,cc]);
            // do left
            for(let i = 1; i <= Math.abs(l); i++) {
                switch (dir) {
                    case "up":
                        cells.push([cr, cc-i]);
                        break
                    case "down":
                        cells.push([cr, cc+i]);
                        break
                    case "left":
                        cells.push([cr+i, cc]);
                        break
                    case "right":
                        cells.push([cr-i, cc]);
                        break
                }
            }
            // do right
            for(let i = 1; i <= Math.abs(r); i++) {
                switch (dir) {
                    case "up":
                        cells.push([cr, cc+i]);
                        break
                    case "down":
                        cells.push([cr, cc-i]);
                        break
                    case "left":
                        cells.push([cr-i, cc]);
                        break
                    case "right":
                        cells.push([cr+i, cc]);
                        break
                }
            }


            cr = cr + dr;
            cc = cc + dc;
            width = width + 2;
            distance++;
        }

        let newCells = [];
        for(let f = 0; f < cells.length; f++) {
            if(checkForBoundry(cells[f][0], cells[f][1])) {
                newCells.push(cells[f])
                damageConstructs(cells[f][0], cells[f][1], this.damage);
                damagePlayers(cells[f][0], cells[f][1], this.damage);
                if(matrix[cells[f][0]][cells[f][1]].mechanism) {
                    matrix[cells[f][0]][cells[f][1]].mechanism.activate()
                }
                matrix[cells[f][0]][cells[f][1]].children.shotgunpath = new ShotgunSpread();
                setTimeout(() => {
                    delete matrix[cells[f][0]][cells[f][1]].children.shotgunpath;
                }, 1000)
            } 
        }


        console.log(matrix)

        let d1 = [];
        let d2 = []

        let r1 = PLAYER.row;
        let c1 = PLAYER.column;

        let r2 = newCells[newCells.length-1][0];
        let c2 = newCells[newCells.length-1][1];

        let r3 = newCells[newCells.length-3][0];
        let c3 = newCells[newCells.length-3][1];

        // console.log(r2, c2, r3, c3)

        d1.push({x: matrix[r1][c1].canvas.x+16, y: matrix[r1][c1].canvas.y});
        d1.push({x: matrix[r2][c2].canvas.x+16, y: matrix[r2][c2].canvas.y});

        d2.push({x: matrix[r1][c1].canvas.x+16, y: matrix[r1][c1].canvas.y});
        d2.push({x: matrix[r3][c3].canvas.x+16, y: matrix[r3][c3].canvas.y});

        // console.log(d1, d2)
        for(let k = 1; k < 10; k++) {
            
            let p1 = new Konva.Path({
                x: 0,
                y: 0,
                stroke: 'red',
            });
            layer.add(p1);


            var p = "M" + d1[0].x + " " + d1[0].y;
            for (var i = 1; i < d1.length; i = i + 1){
            p = p + " L" + d1[i].x + " " + d1[i].y;
            }
            p1.setData(p);

            let p2 = new Konva.Path({
                x: 0,
                y: 0,
                stroke: 'red',
            });
            layer.add(p2);

            var p = "M" + d2[0].x + " " + d2[0].y;
            for (var i = 1; i < d2.length; i = i + 1){
            p = p + " L" + d2[i].x + " " + d2[i].y;
            }
            p2.setData(p);


            
            setTimeout(() => {
                p1.destroy();
                p2.destroy();
                
            }, 200)
        }



        pruneMatrix();
        return true;
    }

    beforeDelete () {

    }
}


class Leap {
    constructor() {
        this.id = "Leap";
        this.type = "spell";
        this.damage = 0;
        this.cost = 4;
        this.info = "move anywhere in a 5 cell area";
        this.damage_type = "none";
        this.name = "leap";
        // this.name = "terraform y";
        this.speed = 50;
        this.maxDistance = 5;
        this.abilityClass = 3;
        this.custom = true;
        this.allowClick = true;
    }


    use (r, c) {
        let d = distanceFromPlayer(r,c,PLAYER.row, PLAYER.column);
        if((Math.abs(d.rows) + Math.abs(d.columns)) < 5) {
            if(checkForBoundry(r,c) && !checkIfPlayer(r,c) && !checkForConstruct(r,c) && !checkIfEnemy(r,c)) {
                markForUpdate(PLAYER.row, PLAYER.column); 
                removefromCell(PLAYER.row, PLAYER.column, PLAYER.id);
                addToCell(r, c, PLAYER);
                PLAYER.set(r,c);
                updateLabels();
                markForUpdate(r,c); 
                checkForRelic(r,c);
            }
        } 
        return true;
    }

    showGridLines (r, c) {
        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                let d = distanceFromPlayer(i,j,r,c);
                if((Math.abs(d.rows) + Math.abs(d.columns)) < 5) {
                    matrix[i][j].children.gridlines = new Gridline();
                } 
            }
        }
    }

    beforeDelete () {

    }

    
}



class Mine {
    constructor() {
        this.id = "Mine";
        this.type = "construct";
        this.damage = 3;
        this.cost = 4;
        this.info = "set mine at feet - then detonate from anywhere - setting the mine cost 4 power & detonating it cost 1 power";
        this.damage_type = "none";
        this.name = "mine";
        // this.name = "terraform y";
        this.speed = 50;
        this.maxDistance = 0;
        this.abilityClass = 2;
        this.custom = true;
        this.state = "mine";
        this.mr = null;
        this.mc = null;
        this.minecon = null;
    }


    use (r, c) {
        console.log(r,c);
        if(this.state == "mine") {
            PLAYER.power = PLAYER.power - PLAYER.ability2.cost;
            this.mr = PLAYER.row;
            this.mc = PLAYER.column;
            this.placeSprite(PLAYER.row, PLAYER.column);
            let x = this.cell(PLAYER.row, PLAYER.column);
            this.minecon = x;
            addToCell(PLAYER.row, PLAYER.column, x);
            this.state = "detonate";
            this.cost = 1;
            this.info = "detonate mine - deals damage in 1 cell radius"
            createAbilityBox(2, PLAYER.ability2);
        } 
        
        else if(this.state == "detonate") {
            PLAYER.power = PLAYER.power - PLAYER.ability2.cost;
            this.mr = this.minecon.row;
            this.mc = this.minecon.column;
            this.explode();
            this.sprite.destroy();
            this.state = "mine";
            this.cost = 4;
            this.info = "set mine at feet - then detonate from anywhere";
            createAbilityBox(2, PLAYER.ability2);
        } 
        
        else {
            console.log("error in mine state")
        }
        return true;
    }

    async explode () {
        class MineExplosion {
            constructor() {
                this.id = getID();
                this.type = "projectile";
                this.damage = 3;
                this.delete = false;
                this.classname = "slice"
            }

            beforeDelete () {}
        }
        
        let cords = [
            [this.mr,this.mc],
            [this.mr-1,this.mc],
            [this.mr-1,this.mc+1],
            [this.mr,this.mc+1],
            [this.mr+1,this.mc+1],
            [this.mr+1,this.mc],
            [this.mr+1,this.mc-1],
            [this.mr,this.mc-1],
            [this.mr-1,this.mc-1],
        ]
        for(let i = 0; i < cords.length; i++) {
            await sleep(50)
            let x = new MineExplosion();
            if(checkForBoundry(cords[i][0], cords[i][1])) { 
                addToCell(cords[i][0], cords[i][1], x); 
                if (checkIfPlayer(cords[i][0], cords[i][1]) || checkIfEnemy(cords[i][0], cords[i][1])) {
                    // damagePlayers(cords[i][0], cords[i][1], 3);
                }
            }
            setTimeout(() => {
                removefromCell(cords[i][0], cords[i][1], x.id);
            },50)
            
        }
    }

    placeSprite (r,c) {
        let sprite_ = new Konva.Rect({
            x: matrix[r][c].canvas.x,
            y: matrix[r][c].canvas.y,
            width: 32,
            height: 32
        });
    
        sprite_.fillPatternImage(images.mine);
        // matrix[r][c].canvas.sprite = sprite_;
        this.sprite = sprite_;
        layer.add(sprite_);
    }

    cell (r, c) {
        let s = this.sprite;
        return new class Mine_p {
            constructor () {
                this.type = "construct";
                this.classname = "mine";
                this.blocksMovement = false;
                this.hp = "x";
                this.name = "mine";
                this.damage = 0;
                this.id = getID();
                this.row = r;
                this.column = c;
                this.delete = false;
                this.maxDistance = 0;
                this.distance = 0;
                this.canBeMoved = true;
                this.sprite = s;
            }

            takeDamage (n) {

            }

            beforeDelete () {

            }
        }
    }



    beforeDelete () {

    }
}



class Erupt {
    constructor() {
        this.id = "Erupt";
        this.type = "projectile";
        this.damage = 2;
        this.cost = 5;
        this.info = "deals damage to all tiles in a line forward - goes through constructs";
        this.damage_type = "standard";
        this.name = "erupt";
        this.imagename = "erupt";
        this.speed = 3;
        this.maxDistance = -1;
        this.abilityClass = 1;
        this.allowClick = false;
        this.custom = true;

    }

    async use (dr, dc, ir, ic) {

        class Eruption {
            constructor() {
                this.id = getID();
                this.type = "projectile";
                this.damage = 2;
                this.delete = false;
                this.classname = "slice"
            }

            beforeDelete () {}
        }

        let cr = ir + dr;
        let cc = ic + dc;

        let cells = [];
        let loop = true;
        while(loop) {
            if(matrix[cr]) {
                if(matrix[cr][cc]) {
                    cells.push([cr,cc]);
                } else {
                    loop = false;
                }
            } else {
                loop = false;
            }
            cr += dr;
            cc += dc;
        }

        console.log(cells);

        for(let i = 0; i < cells.length; i++) {
            await sleep(50);
            let x = new Eruption();
            if(checkForBoundry(cells[i][0], cells[i][1])) { 
                addToCell(cells[i][0], cells[i][1], x); 
                if (checkIfPlayer(cells[i][0], cells[i][1])) {
                    console.log("PLAYER IN CELL")
                    // damagePlayers(cells[i][0], cells[i][1], x.damage);
                } else if(checkIfEnemy(cells[i][0], cells[i][1])) {
                    console.log("ENEMY IN CELL");
                    damagePlayers(cells[i][0], cells[i][1], x.damage);
                } else if (checkForConstruct(cells[i][0], cells[i][1])) {
                    console.log("CONSTRUCT IN CELL");
                    damageConstructs(cells[i][0], cells[i][1], x.damage)
                } else if(matrix[cells[i][0]][cells[i][1]].mechanism) {
                    matrix[cells[i][0]][cells[i][1]].mechanism.activate()
                }
            }
            setTimeout(() => {
                removefromCell(cells[i][0], cells[i][1], x.id);
            },50)
            
        }

        pruneMatrix();
        updateCanvas()
        return true;
    }
}



class Push {
    constructor () {
        this.id = "Push";
        this.type = "projectile";
        this.damage = 1;
        this.cost = 3;
        this.info = "moves everything 1 cell";
        this.damage_type = "standard";
        this.name = "push";
        this.imagename = "push";
        this.speed = 3;
        this.maxDistance = -1;
        this.abilityClass = 1;
        this.allowClick = false;
        this.custom = true;
    }

    async use (dr, dc, ir, ic) {
        console.log("\nPUSHING");
        let cr = ir + dr;
        let cc = ic + dc;
        let cells = [];
        let running = true;
        while (running) {
            if(!checkForBoundry(cr, cc)) {
                running = false;
                console.log("found boundry")
            } else {
                cells.push([cr,cc])
            }
            cr += dr;
            cc += dc;
        }
        // console.log(cells)
        let pushing = false;
        let cellsTraveled = [];
        let toPush = [];
        for(let i = 0; i < cells.length; i++) {
            let r = [cells[i][0]][0];
            let c = [cells[i][1]][0];
            
            if(checkForAllConstructs(r, c)) {
                console.log("CONSTRUCT AT", r,c);
                toPush.push([r,c]);
                pushing = true;
            } else if(checkIfEnemy(r,c)) {
                console.log("ENEMY AT", r,c);
                toPush.push([r,c]);
                pushing = true;
            } else {
                if(pushing) {
                    console.log("NOTHING TO KEEP PUSHING");
                    console.log(toPush);
                    break
                } else {
                    
                }
            }
            if(!pushing) { cellsTraveled.push([r,c]) }
        }

        // console.log(cellsTraveled)
        animateProjectile(cellsTraveled, dr, dc, "push", 7)

        // deal 1 damage to the first cell
        if(checkForAllConstructs(toPush[0][0], toPush[0][1])) {
            damageConstructs(toPush[0][0],toPush[0][1], 1);
        } else if(checkIfEnemy(toPush[0][0], toPush[0][1])) {
            damagePlayers(toPush[0][0],toPush[0][1], 1);
        }


        // go backwards and move everything 1 cell
        for(let i = toPush.length-1; i >= 0; i--) {
            await sleep(200);
            let nr = toPush[i][0] + dr;
            let nc = toPush[i][1] + dc;
            if(!checkForBoundry(nr,nc)) {
                console.log("CANNOT MOVE! BOUNDRY");
                damageConstructs(toPush[i][0], toPush[i][1], 1);
                damagePlayers(toPush[i][0], toPush[i][1], 1);
            } else if(checkForAllConstructs(nr,nc)) {
                console.log("CANNOT MOVE! CONSTRUCT", nr,nc);
                damageConstructs(toPush[i][0], toPush[i][1], 1);
                damagePlayers(toPush[i][0], toPush[i][1], 1);
            } else {
                if(checkForAllConstructs(toPush[i][0], toPush[i][1])) {
                    let node = matrix[toPush[i][0]][toPush[i][1]].children;
                    Object.keys(node).forEach(child => {
                        // console.log(node[child])
                        let cell1 = matrix[node[child].row][node[child].column];
                        let cell2 = matrix[nr][nc];
                        if(node[child].type == "construct") {
                            // console.log("\n\nPUSHING A CONSTRUCT");
                            // console.log("OLD SPRITE", cell1);
                            // console.log("NEW SPRITE", cell2);
                            if(node[child].sprite != undefined) {
                                // console.log("FOUND A SPRITE IN CELL1")
                                // console.log(node[child].sprite.attrs);
                                node[child].sprite.absolutePosition({ x: matrix[nr][nc].canvas.x, y: matrix[nr][nc].canvas.y })
                                // console.log(node[child].sprite.attrs);
                                // console.log(node[child].sprite);
                    
                            }

                            matrix[nr][nc].children[child] = node[child];
                            matrix[nr][nc].children[child].row = nr;
                            matrix[nr][nc].children[child].column = nc;
                            delete node[child];
                        }
                    })
                } else if(checkIfEnemy(toPush[i][0], toPush[i][1])) {
                    console.log("MOVING AN ENEMY");
                    let node = matrix[toPush[i][0]][toPush[i][1]].children;
                    Object.keys(node).forEach(child => {
                        console.log(node[child])
                        if(node[child].type == "enemy") {
                            forceMoveEnemy(node[child].row + dr, node[child].column + dc, node[child].enemyid);
                        }
                    })
                    
                }
            }
            
        }
        pruneMatrix()



        return true;
    }
}



// new spell class abilities:
// leap - move anywhere on the matrix - ends turn and lowers movement and power next turn
// advance - move forward until you hit something
// heal - turn power into hp - cost goes up every use
// expend - turn 1 power into 1 movement


class Gridline {
    constructor() {
        this.type = "visualaid"
        this.allowsMovement = true;
        this.classname = "gridlines"
        this.name = "gridline"
        this.hp = "";
    }
}

class ShotgunSpread {
    constructor() {
        this.type = "visualaid"
        this.allowsMovement = true;
        this.classname = "shotgun-spread"
        this.name = "shotgunspread"
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

class Cracked_earth {
    constructor() {
        this.type = "tile"
        this.allowsMovement = true;
        this.movementCost = 1;
        this.classname = "cracked-earth"
        this.name = "cracked earth"
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

class Mercury {
    constructor() {
        this.type = "tile"
        this.allowsMovement = true;
        this.movementCost = 2;
        this.classname = "mercury"
        this.name = "mercury"
        this.dot = 2;
        this.decay = 1;
        this.currentDecay = 0;
        this.maxDecay = 3;
    }
}

class Plains_pool {
    constructor() {
        this.type = "tile"
        this.allowsMovement = true;
        this.movementCost = 4;
        this.classname = "plains-pool"
        this.name = "plains pool"
    }
}

class Granite {
    constructor() {
        this.type = "tile"
        this.allowsMovement = true;
        this.movementCost = 1;
        this.classname = "granite"
        this.name = "granite"
    }
}






let abilities = [Shell, Terraform_alpha, Terraform_beta, Terraform_gamma, Slice, Meteor_cryo, Meteor_fire, Focus, Shotgun, Rest, Heal, Leap, Mine, Erupt, Push];
let tiles = {Plains, Frozen, Lava, Mercury, Granite, Cracked_earth, Plains_pool}
let worldconstructs = {Wall, Reinforced_wall, Boolean_block}
let mechanisms = {Switch}