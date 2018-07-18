export class Grid {
    constructor(rows, columns){
        this.columns = columns;
        this.rows = rows; 
        this.reset()
    }

    reset(){
        this.cells = Array(this.rows).fill().map(() => 
            Array(this.columns).fill().map(() => {
                return {value:0, state: 0};
            })
        );
    }
}