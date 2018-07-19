import React, { Component } from 'react';
import { Maze } from '../maze/Maze'
import { Runner } from '../maze/Runner';
import { GrowingTree, strategy } from '../maze/algorithms/GrowingTree'
import './MazeViewer.css';

class MazeViewer extends Component {

    constructor(props){
        super(props);
        this.height = parseInt(props.height);
        this.width = parseInt(props.width);
        this.cellSize = parseInt(props.cellSize);

        this.options = props.options || {}; 
        let colors = this.options.colors || {};

        this.colors = {
            touched: colors.touched || '#3D9970',
            untouched: colors.untouched || '#111111',
            done: colors.done || '#AD5203',
            background: colors.background || '#111111',
            wall: colors.wall || '#111111'
        }

        this.maze = new Maze(this.height / this.cellSize, this.width / this.cellSize);
        this.runner = new Runner(new GrowingTree(this.maze, strategy.NEWEST));
    }

    render() {
        return (
            <div className="maze">
                <div className="title section">
                    <h4>A-Maze</h4>
                </div>
                <canvas id="mazeCanvas" width={this.width} height={this.height} className="demo-card-wide mdl-card mdl-shadow--2dp" />
                <div className="action section">
                    <span className="btn">
                        <button onClick={this.runStep.bind(this)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl">
                            <i className="material-icons">skip_next</i>
                        </button>
                    </span>
                    <span className="btn">
                        <button onClick={this.run.bind(this)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl">
                            <i className="material-icons">play_arrow</i>
                        </button>
                    </span>
                    <span className="btn">
                        <button onClick={this.pause.bind(this)} className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect mdl">
                            <i className="material-icons">pause</i>
                        </button>
                    </span>
                    <span className="btn">
                        <button onClick={this.record.bind(this)} style={{'background-color': '#ff4136'}} className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect mdl">
                            <i className="material-icons">fiber_manual_record</i>
                        </button>
                    </span>
                </div>
                <div className="control-panel section">
                    <form action="#">
                        <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded is-dirty">
                            <select className="mdl-textfield__input" type="text" id="sample1">
                                <option value="1">Growing Tree</option>
                            </select>
                            <label className="mdl-textfield__label" for="sample3">Algorithm</label>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    componentDidMount(){
        this.canvas = document.getElementById("mazeCanvas")
        this.canvasContext = this.canvas.getContext("2d");

        this.runner.onUpdate(this.drawMaze.bind(this));        

        this.run();
    }

    run(){
        this.runner.startRun();
    }

    runStep(){
        this.runner.startStep();
    }

    pause(){
        this.runner.stop();
    }

    // If possible, record in multiple formats
    record(){
        var image = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        window.location.href = image;
    }

    setBackgroundColor(color){
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
    }

    drawMaze(){
        this.setBackgroundColor(this.colors.background);

        // Paint visited cells
        this.canvasContext.beginPath();
        this.canvasContext.fillStyle = this.colors.touched;
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
        this.canvasContext.fillStyle = this.colors.done;
        this.maze.grid.cells.forEach((row, i) => {
            row.forEach((cell, j) => {
                if(cell.state === 2){     
                    this.paintCell(i, j, cell);
                }
            });
        });
        this.canvasContext.fill();

        // Render walls
        this.canvasContext.strokeStyle = this.colors.wall;
        this.canvasContext.lineWidth = 1;

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

        this.canvasContext.rect(x, y, this.cellSize, this.cellSize);
    }

    renderCell(row, column, cell) {
        var cellValue = cell.value;
        var ctx = this.canvasContext;
        var x = column * this.cellSize;
        var y = row * this.cellSize;

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
