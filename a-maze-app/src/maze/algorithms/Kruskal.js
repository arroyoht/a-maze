import { cellState, cell } from '../Maze.js';

export class Kruskal {

    constructor(maze){
        this.maze = maze;
        this.reset();
    }

    reset(){
        this.maze.grid.reset();
        this.setsId = 0;
        this.done = false;
        this.getEdgeList();
    }

    getEdgeList(){
        this.edges = [];
        this.cells = [];
        for(var i = 0; i < this.maze.grid.rows; i++){
            if(!this.cells[i]) this.cells[i] = []
            for(var j = 0; j < this.maze.grid.columns; j++){
                this.cells[i].push(this.setsId);
                if(i > 0) this.edges.push({row: i, column: j, direction: this.maze.N});
                if(j > 0) this.edges.push({row: i, column: j, direction: this.maze.W});
            }
        }

        this.edges = this.randomize(this.edges);
    }

    step(){
        var connected = false;

        while(!connected){
            var currentCell = this.nextCell();

            if(!currentCell) return false;

            var adjacentCell = this.maze.walk(currentCell.row, currentCell.column, currentCell.direction);
            adjacentCell.direction = this.maze.opposite[currentCell.direction];

            if(adjacentCell.row >= 0 && adjacentCell.column >= 0){
                this.maze.markCell(adjacentCell.row, adjacentCell.column, cellState.DONE);
                this.maze.markCell(currentCell.row, currentCell.column, cellState.DONE);
                
                if(this.cells[currentCell.row][currentCell.column] !== this.cells[adjacentCell.row][adjacentCell.column]){
                    connected = true;
                    if(this.cells[currentCell.row][currentCell.column] === 0){
                        this.connectCells(adjacentCell, currentCell);
                    }
                    else{
                        this.connectCells(currentCell, adjacentCell);
                    }
                }
                else if(this.cells[currentCell.row][currentCell.column] === 0 && this.cells[adjacentCell.row][adjacentCell.column] === 0){
                    connected = true;
                    this.maze.markCell(adjacentCell.row, adjacentCell.column, cellState.TOUCHED);
                    this.maze.markCell(currentCell.row, currentCell.column, cellState.TOUCHED);
                    
                    this.setsId++
                    this.maze.carvePassage(currentCell.row, currentCell.column, adjacentCell.row, adjacentCell.column, currentCell.direction);
                    this.cells[currentCell.row][currentCell.column] = this.setsId;
                    this.cells[adjacentCell.row][adjacentCell.column] = this.setsId;
                }
            }
        }

        return true;
    }

    nextCell(){
        if(this.edges.length === 0) {
            this.done = true;
            return null;
        }

        return this.edges.pop();
    }

    connectCells(currentCell, adjacentCell){
        this.maze.carvePassage(currentCell.row, currentCell.column, adjacentCell.row, adjacentCell.column, currentCell.direction);
        if(this.cells[adjacentCell.row][adjacentCell.column] === 0){
            this.cells[adjacentCell.row][adjacentCell.column] = this.cells[currentCell.row][currentCell.column];
        }
        else {
            this.mergeSets(this.cells[currentCell.row][currentCell.column], this.cells[adjacentCell.row][adjacentCell.column]);
        }
    }

    mergeSets(setId, setToBeMergedId){
        this.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                if(this.cells[i][j] === setToBeMergedId) this.cells[i][j] = setId;
            })
        });
    }

    randomize(array){
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
}