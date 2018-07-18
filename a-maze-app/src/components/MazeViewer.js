import React, { Component } from 'react';
import { Maze } from '../maze/Maze.js'
import { Runner } from '../maze/Runner.js';
import { GrowingTree, strategy } from '../maze/algorithms/GrowingTree.js'
import './MazeViewer.css';

class MazeViewer extends Component {

    constructor(props){
        super(props);
        this.height = props.height;
        this.width = props.width;
        this.cellSize = 10;

        this.maze = new Maze(this.height / this.cellSize, this.width / this.cellSize);
        this.runner = new Runner(new GrowingTree(this.maze, strategy.RANDOM));
    }

    render() {
        return (
            <div className="maze">
                <div className="title">
                    <h3>A-Maze</h3>
                </div>
                <canvas id="mazeCanvas" width={this.width} height={this.height}/>
                <div className="action">
                    <span className="btn">
                        <button onClick={this.runStep.bind(this)}> Step </button>
                    </span>
                    <span className="btn">
                        <button onClick={this.run.bind(this)}> Run </button>
                    </span>
                    <span className="btn">
                        <button onClick={this.pause.bind(this)}> Pause </button>
                    </span>
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.canvasContext = document.getElementById("mazeCanvas").getContext("2d");
        this.run();
    }

    setBackgroundColor(color){
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    run(){
        this.runner.startRun(this.drawMaze.bind(this));
    }

    runStep(){
        this.runner.startStep(this.drawMaze.bind(this));
    }

    pause(){
        this.runner.stop();
    }

    drawMaze(){
        this.setBackgroundColor('#111111');

        // Paint visited cells
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = '#3d9970';
        this.maze.grid.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                if(cell.state === 1){       
                    this.paintCell(i, j, cell);
                }
            });
        });
        this.canvasContext.fill();

        // Paint done cells
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = '#ad5203';
        this.maze.grid.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                if(cell.state === 2){     
                    this.paintCell(i, j, cell);
                }
            });
        });
        this.canvasContext.fill();

        // Render walls
        this.canvasContext.beginPath();
        this.maze.grid.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                this.renderCell(i, j, cell);
            });
        });
        this.canvasContext.stroke();
    }

    paintCell(row, column){
        var x = column * this.cellSize;
        var y = row * this.cellSize;
        var ctx = this.canvasContext;
        ctx.rect(x, y, this.cellSize, this.cellSize);
    }

    renderCell(row, column, cell) {
        var cellValue = cell.value;
        var ctx = this.canvasContext;
        var x = column * this.cellSize;
        var y = row * this.cellSize;

        ctx.strokeStyle = '#111111';
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
