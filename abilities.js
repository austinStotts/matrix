class Projectile {
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

class Shell {
    constructor() {
        this.type = "projectile"
        this.damage = "2"
        this.info = "standard shell: travels forward until it hits something"
        this.damage_type = "standard"
    }

    use (r,c,dr,dc) {
        let p = new Projectile(r,c,dr,dc)
    }
}

// module.exports = {Shell}