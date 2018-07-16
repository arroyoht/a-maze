import React, { Component } from 'react';
import { Maze } from '../Maze/Maze.js'
import './MazeViewer.css';

class MazeViewer extends Component {

    constructor(props){
        super(props);
        this.height = props.height;
        this.width = props.width;
        this.cellSize = 10;

        this.maze = new Maze(this.height / this.cellSize, this.width / this.cellSize);
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

    runBacktrackingMazeGenerator(){
        this.maze.backtracker(this.drawMaze.bind(this));
    }

    drawMaze(){
        this.setBackgroundColor('black');

        this.canvasContext.beginPath();

        this.maze.grid.cells.forEach((row, i) => {
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
        if(!(cellValue & this.maze.N)){
            ctx.moveTo(x, y);
            ctx.lineTo(x + this.cellSize, y);
        }

        // East wall
        if(!(cellValue & this.maze.E) && column === this.maze.grid.columns - 1){
            ctx.moveTo(x + this.cellSize, y);
            ctx.lineTo(x + this.cellSize, y + this.cellSize);
        }

        // South wall
        if(!(cellValue & this.maze.S) && row === this.maze.grid.rows - 1){
            ctx.moveTo(x, y + this.cellSize);
            ctx.lineTo(x + this.cellSize, y + this.cellSize);
        }

        // West wall
        if(!(cellValue & this.maze.W)){
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + this.cellSize);
        }
    }
}

export default MazeViewer;