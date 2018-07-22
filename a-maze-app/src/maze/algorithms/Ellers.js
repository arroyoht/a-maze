import { cellState } from '../Maze.js';

export class Ellers {

    constructor(maze) {
        this.maze = maze;
        this.reset();
    }

    reset() {
        this.maze.grid.reset();
        this.sets = [];
        this.done = false;
        this.currentCell = { row: 0, column: -1 };
        this.setStack = [];
    }

    connectSetVertically(set, row){
        var connected = false;

        var lastRow = set.filter(cell => cell.row === (row - 1));
        
        lastRow.forEach(cell => {
            this.maze.markCell(cell.row, cell.column, cellState.DONE);
            var newCell = {row: row, column: cell.column}
            if(this.createRandomConnection(newCell, cell, [newCell], this.maze.N)) connected = true;
        });

        if(!connected && lastRow.length > 0){
            var randomCell = lastRow[Math.floor(Math.random() * (lastRow.length - 1))];
            var newCell = {row: row, column: randomCell.column}
            this.createConnection(newCell, randomCell, [newCell], this.maze.N);
        }
    }

    step() {
        if(this.done) return false;

        var currentCell = this.currentCell;
        if(this.setStack.length > 0){
            this.connectSetVertically(this.setStack.pop(), this.currentCell.row);
        } else {
            currentCell = this.nextCell();
        }
        
        if (this.setStack.length === 0) {
            var currentSet = this.getCellSet(this.currentCell);

            if(this.maze.grid.rows - 1 === currentCell.row){
                this.maze.markCell(currentCell.row, currentCell.column, cellState.DONE);
            }
            else{
                this.maze.markCell(currentCell.row, currentCell.column, cellState.TOUCHED);
            }
            
            if (!currentSet) {
                currentSet = [currentCell];
                this.sets.push(currentSet);
            }

            var adjacentCell = { row: currentCell.row, column: currentCell.column - 1 };
            if (adjacentCell.column >= 0 && !this.belongsToSet(adjacentCell, currentSet)) {
                if(currentCell.row === (this.maze.grid.rows - 1)){
                    this.createConnection(currentCell, adjacentCell, currentSet, this.maze.W);
                } else {
                    this.createRandomConnection(currentCell, adjacentCell, currentSet, this.maze.W);
                }
            }
        }

        return true;
    }

    nextCell() {
        this.currentCell = { row: this.currentCell.row, column: this.currentCell.column + 1 };
        
        if (this.currentCell.column >= this.maze.grid.columns) {
            this.sets.forEach(set => this.setStack.push(set));

            this.currentCell = { row: this.currentCell.row + 1, column: 0 };
            if (this.currentCell.row >= this.maze.grid.rows) {
                this.currentCell = { row: 0, column: 0 };
                this.done = true;
            }
        }

        return this.currentCell;
    }

    createRandomConnection(currentCell, adjacentCell, set, direction) {
        var connect = Math.random() >= 0.5 ? true : false;
        if (connect) {
            this.createConnection(currentCell, adjacentCell, set, direction);
        }

        return connect;
    }

    createConnection(currentCell, adjacentCell, set, direction) {
        this.maze.carvePassage(currentCell.row, currentCell.column, adjacentCell.row, adjacentCell.column, direction);
        this.mergeSets(this.getCellSet(adjacentCell), set);
    }

    mergeSets(set, setToBeMerged) {
        var i = this.sets.indexOf(setToBeMerged);
        if(i >= 0){
            this.sets.splice(i, 1);
        }
        setToBeMerged.forEach(cell => set.push(cell));
    }

    getCellSet(cell) {
        for (var cellIndex in this.sets) {
            if (this.belongsToSet(cell, this.sets[cellIndex])) {
                return this.sets[cellIndex];
            }
        }

        return null;
    }

    belongsToSet(cell, set) {
        var belongs = false;

        for (var i = 0; i < set.length && !belongs; i++) {
            if (set[i].row === cell.row
                && set[i].column === cell.column) {
                belongs = true;
            }
        }

        return belongs;
    }
}
