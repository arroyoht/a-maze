import { cellState } from '../Maze.js';

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

    step(){
        var currentCell = this.nextCell();

        if(!currentCell) return false;        

        var visitedNext = false;
        var direction = currentCell.directions.pop();

        while(direction && (!visitedNext || this.strategy === strategy.RANDOM)){
            
            var nextCellRow = currentCell.row + this.maze.dy[direction];
            var nextCellColumn = currentCell.column + this.maze.dx[direction];

            if(this.maze.isCellValid(nextCellRow, nextCellColumn)){
                visitedNext = true;

                this.maze.markCell(nextCellRow, nextCellColumn, cellState.TOUCHED);
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
            this.maze.markCell(currentCell.row, currentCell.column, cellState.DONE);
            this.stack.splice(this.stack.indexOf(currentCell), 1);
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