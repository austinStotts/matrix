export default class Player {
    constructor(r,c) {
        this.row = r;
        this.column = c;
        this.hp = 3;
    } 

    set(r, c) {
        this.row = r;
        this.column = c;
    }
}