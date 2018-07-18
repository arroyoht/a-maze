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
            this.grid.cells[row][column].value === 0;
    }

    carvePassage(i, j, x, y, direction){
        this.grid.cells[i][j].value |= direction;
        this.grid.cells[x][y].value |= this.opposite[direction];
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

    getRandomCell(){
        return {
            directions: this.getRandomDirections(),
            row: Math.floor(Math.random() * (this.grid.rows - 1)),
            column: Math.floor(Math.random() * (this.grid.columns - 1))
        };
    }

    markCell(row, column, state){
        this.grid.cells[row][column].state = state;
    }
}

export const cellState = {
    UNTOUCHED: 0,
    TOUCHED: 1,
    DONE: 2
}