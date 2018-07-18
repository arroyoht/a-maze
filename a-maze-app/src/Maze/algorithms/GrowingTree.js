export class GrowingTree {
    
    constructor(maze, strategy){
        this.maze = maze;
        this.strategy = strategy;
        this.reset();
    }

    reset(){
        this.maze.grid.reset();
        this.stack = [this.maze.getRandomCell()];
        this.done = false;
    }

    // TODO: Refine
    step(){
        var currentCell = this.nextCell();

        if(!currentCell) return false;

        var direction = currentCell.directions.pop();
        var visitedNext = false;
        
        while(direction && (!visitedNext || this.strategy === strategy.RANDOM)){
            
            var nextCellRow = currentCell.row + this.maze.dy[direction];
            var nextCellColumn = currentCell.column + this.maze.dx[direction];

            if(this.maze.isCellValid(nextCellRow, nextCellColumn)){
                
                this.maze.grid.cells[nextCellRow][nextCellColumn].state = 1;
                visitedNext = true;
                
                this.maze.carvePassage(currentCell.row, currentCell.column, nextCellRow, nextCellColumn, direction);
                
                this.stack.push({
                    directions: this.maze.getRandomDirections(),
                    row: nextCellRow,
                    column: nextCellColumn
                });
            }
            else {
                direction = currentCell.directions.pop();
            }
        }

        if(!direction){
            this.maze.grid.cells[currentCell.row][currentCell.column].state = 2;
            if(this.strategy === strategy.NEWEST){
                this.stack.pop();
            }
            else {
                this.stack.splice(this.stack.indexOf(currentCell), 1);
            }
        }

        return true;
    }

    nextCell(){
        if(this.stack.length === 0){
            this.done = true;
            return null;
        }

        if(this.strategy === strategy.NEWEST){
            return this.stack[this.stack.length - 1];
        }
        else {
            let randomIndex = Math.floor(Math.random() * (this.stack.length - 1));
            return this.stack[randomIndex];
        }
    }
}

export const strategy = {
    NEWEST: 1,
    RANDOM: 2
};