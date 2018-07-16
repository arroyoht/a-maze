import React, { Component } from 'react';
import './Maze.css';

class Maze extends Component {

    constructor(props){
        super(props);
        this.height = props.height;
        this.width = props.width;

        this.cellSize = 10;

        // direction constants should be defined elsewhere
        // TODO: move this together with direction helper functions
        this.N = 0b1000;
        this.E = 0b0100;
        this.S = 0b0010;
        this.W = 0b0001;
    }

    render () {
        return (
            <div className="maze">
                <div className="title">
                    <h3>A-Maze</h3>
                </div>
                <canvas id="mazeCanvas" width={this.width} height={this.height}/>
                <div className="action">
                    <button  onClick={this.runBacktrackingMazeGenerator.bind(this)}> a-Maze me </button>
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.canvasContext = document.getElementById("mazeCanvas").getContext("2d");

        this.runBacktrackingMazeGenerator();
    }

    setBackgroundColor(color){
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    initializeMazeGrid(){
        this.grid = {
            columns: this.width / this.cellSize,
            rows: this.height / this.cellSize, 
        }

        this.grid.cells = Array(this.grid.rows).fill().map(() => Array(this.grid.columns).fill(0));
    }

    runBacktrackingMazeGenerator(){
        this.initializeMazeGrid();
        this.carvePassagesFrom(0, 0);
        this.drawMaze();
    }

    carvePassagesFrom(row, column){
        var directions = this.shuffle([this.N, this.E, this.S, this.W]);
        
        directions.forEach(direction => {    
                var cellRow = row + this.dy(direction);
                var cellColumn = column + this.dx(direction);

                if(this.isCellValid(cellRow, cellColumn)){
                    this.carvePassage(row, column, cellRow, cellColumn, direction);
                    this.carvePassagesFrom(cellRow, cellColumn);
                }
        });    
    }

    isCellValid(row, column){
        return (row >= 0 && row < this.grid.rows) &&
            (column >= 0 && column < this.grid.columns) &&
            this.grid.cells[row][column] === 0;
    }

    carvePassage(i, j, x, y, direction){
        this.grid.cells[i][j] |= direction;
        this.grid.cells[x][y] |= this.opposite(direction);
    }

    drawMaze(){
        this.setBackgroundColor('black');

        this.canvasContext.beginPath();

        this.grid.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                this.renderCell(i, j, cell);
            });
        });

        this.canvasContext.stroke();
    }

    renderCell(row, column, cellValue) {
        var ctx = this.canvasContext;
        var x = column * this.cellSize;
        var y = row * this.cellSize;

        ctx.strokeStyle = 'white'
        ctx.lineWidth = 1;

        // North wall
        if(!(cellValue & this.N)){
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.cellSize, y);
        }

        // East wall
        if(!(cellValue & this.E) && column === this.grid.columns - 1){
            ctx.moveTo(x + this.cellSize, y);
            ctx.lineTo(x + this.cellSize, y + this.cellSize);
        }

        // South wall
        if(!(cellValue & this.S) && row === this.grid.rows - 1){
            ctx.moveTo(x, y + this.cellSize);
            ctx.lineTo(x + this.cellSize, y + this.cellSize);
        }

        // West wall
        if(!(cellValue & this.W)){
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + this.cellSize);
        }
    }

    /**
     * Helper direction methods should be moved elsewhere
     * TODO: study better place/way to define these
     */

    /**
     * Get x increment required to move in the given direction in the maze
     */
    dx(direction){
        switch(direction){
            case this.E:
                return 1;
            case this.W:
                return -1;
            default:
                return 0;
        }
    }

    /**
     * Get y increment required to move in the given direction in the maze
     */
    dy(direction){
        switch(direction){
            case this.S:
                return 1;
            case this.N:
                return -1;
            default:
                return 0;
        }
    }

    /**
     * Get opposite direction from the one given
     */
    opposite(direction){
        switch(direction){
            case this.N:
                return this.S;
            case this.E:
                return this.W;
            case this.S:
                return this.N;
            case this.W:
                return this.E;
            default:
                return 0;
        }
    }

    /**
     * Shuffles the given array and returns
     */
    shuffle(array){
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

export default Maze;
