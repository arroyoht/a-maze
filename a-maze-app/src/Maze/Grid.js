export class Grid {

    constructor(rows, columns){
        this.columns = columns;
        this.rows = rows; 
        this.cells = Array(this.rows).fill().map(() => Array(this.columns).fill(0));
    }

    reset(){
        this.cells = Array(this.rows).fill().map(() => Array(this.columns).fill(0));
    }
}