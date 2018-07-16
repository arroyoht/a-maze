import { Grid } from './Grid.js';

export class Maze {

    constructor(rows, columns){
        this.N = 0b1000;
        this.E = 0b0100;
        this.S = 0b0010;
        this.W = 0b0001;

        this.dx = {};
        this.dx[this.N] = 0;
        this.dx[this.E] = 1;
        this.dx[this.S] = 0;
        this.dx[this.W] = -1;

        this.dy = {};
        this.dy[this.N] = -1;
        this.dy[this.E] = 0;
        this.dy[this.S] = 1;
        this.dy[this.W] = 0;

        this.opposite = {};
        this.opposite[this.N] = this.S;
        this.opposite[this.E] = this.W;
        this.opposite[this.S] = this.N;
        this.opposite[this.W] = this.E;

        this.grid = new Grid(rows, columns);
    }

    isCellValid(row, column){
        return (row >= 0 && row < this.grid.rows) &&
            (column >= 0 && column < this.grid.columns) &&
            this.grid.cells[row][column] === 0;
    }

    carvePassage(i, j, x, y, direction){
        this.grid.cells[i][j] |= direction;
        this.grid.cells[x][y] |= this.opposite[direction];
    }

    getRandomDirections(){
        var array = [this.N, this.E, this.S, this.W];

        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    /* Backtracker Algorithm */

    stack = [];

    recursiveBacktracker(callback){
        this.grid.reset();
        this.carvePassagesFrom(0, 0);
        callback();
    }

    carvePassagesFrom(row, column){
        var directions = this.getRandomDirections();

        directions.forEach(direction => {    
            var cellRow = row + this.dy[direction];
            var cellColumn = column + this.dx[direction];

            if(this.isCellValid(cellRow, cellColumn)){
                this.carvePassage(row, column, cellRow, cellColumn, direction);
                this.carvePassagesFrom(cellRow, cellColumn);
            }
        });    
    }

    backtracker(callback){
        this.grid.reset();

        this.stack.push({
            directions: this.getRandomDirections(),
            row: 0,
            column: 0
        });

        var interval = setInterval(() => {
            this.step();
            callback();
            
            if(this.stack.length === 0) clearInterval(interval);
        }, 1);
    }

    step(){
        var currentCell = this.stack[this.stack.length - 1];
        var direction = currentCell.directions.pop();
        var visitedNext = false;
        
        while(direction && !visitedNext){
            
            var nextCellRow = currentCell.row + this.dy[direction];
            var nextCellColumn = currentCell.column + this.dx[direction];

            if(this.isCellValid(nextCellRow, nextCellColumn)){
                
                visitedNext = true;
                
                this.carvePassage(currentCell.row, currentCell.column, nextCellRow, nextCellColumn, direction);
                
                this.stack.push({
                    directions: this.getRandomDirections(),
                    row: nextCellRow,
                    column: nextCellColumn
                });
            }
            else {
                direction = currentCell.directions.pop();
            }
        }

        if(!direction){
            this.stack.pop();
        }
    }
}