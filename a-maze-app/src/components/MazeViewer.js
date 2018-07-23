import React, { Component } from 'react';
import { Maze } from '../maze/Maze'
import { Runner } from '../maze/Runner'; 
import { GrowingTree, strategy } from '../maze/algorithms/GrowingTree'
import { Ellers } from '../maze/algorithms/Ellers'
import { Kruskal } from '../maze/algorithms/Kruskal'
import { Controls } from './Controls';
import './MazeViewer.css';

class MazeViewer extends Component {

    constructor(props){
        super(props);
        this.height = parseInt(props.height, 10);
        this.width = parseInt(props.width, 10);
        this.cellSize = parseInt(props.cellSize, 10);
        this.record = false;

        this.options = props.options || {}; 
        let colors = this.options.colors || {};

        this.colors = {
            touched: colors.touched || '#3D9970',
            untouched: colors.untouched || '#111111',
            done: colors.done || '#AD5203',
            background: colors.background || '#111111',
            wall: colors.wall || '#111111'
        }
        
        this.state = {
            algorithm: '0'
        };

    }

    render() {
        return (
            <div style={{display: 'flex'}}>
                <div className="maze">
                    <div className="title section">
                        <h4>A-Maze</h4>
                    </div>
                    <div className="control-panel section">
                        <form action="#">
                            <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-upgraded is-dirty">
                                <select value={this.state.algorithm} onChange={this.onAlgorithmChange.bind(this)} className="mdl-textfield__input" type="text" id="sample1">
                                    <option value="0">Kruskal's</option>
                                    <option value="1">Growing Tree - Random</option>
                                    <option value="2">Growing Tree - Newest</option>
                                    <option value="3">Eller's</option>
                                </select>
                                <label className="mdl-textfield__label" for="sample3">Algorithm</label>
                            </div>
                        </form>
                    </div>
                    <div className="viewer-body">
                        <canvas id="mazeCanvas" width={this.width} height={this.height} className="demo-card-wide mdl-card mdl-shadow--2dp" />    
                        <Controls step={this.runStep.bind(this)}
                            play={this.run.bind(this)}
                            pause={this.pause.bind(this)}
                            record={this.startRecording.bind(this)} >
                        </Controls>
                    </div>
                </div>
            </div>
        );
    }

    onAlgorithmChange(e){
        this.setState({algorithm: e.target.value});
    }

    componentDidUpdate(prevProps, prevState){
        if(prevState.algorithm !== this.state.algorithm){
            this.setAlgorithm(); 
        }
    }

    setAlgorithm(){
        if(this.runner) this.runner.destroy();

        this.maze = new Maze(this.height / this.cellSize, this.width / this.cellSize);

        switch(this.state.algorithm){
            case '0':
                this.runner = new Runner(new Kruskal(this.maze));
                break;
            case '1':
                this.runner = new Runner(new GrowingTree(this.maze, strategy.RANDOM));
                break;
            case '2': 
                this.runner = new Runner(new GrowingTree(this.maze, strategy.NEWEST));
                break;
            case '3': 
                this.runner = new Runner(new Ellers(this.maze));
                break;
            default:
                this.runner = new Runner(new GrowingTree(this.maze, strategy.NEWEST));
                break;
        }

        this.runner.onUpdate(this.drawMaze.bind(this));    
        this.runner.onFinish(this.finish.bind(this));     
        this.run();
    }

    componentDidMount(){
        this.canvas = document.getElementById("mazeCanvas")
        this.canvasContext = this.canvas.getContext("2d");     
        
        this.encoder = new window.GIFEncoder();
        this.encoder.setRepeat(0);
        this.encoder.setFrameRate(500);    

        this.setAlgorithm();
    }

    run(){
        if(this.record) this.encoder.start();

        this.runner.startRun();
    }

    runStep(){
        this.runner.startStep();
    }

    pause(){
        if(this.record){
            this.record = false;
            this.encoder.finish();
            this.encoder.download("maze.gif");
        }

        this.runner.stop();
    }

    finish(){
        if(this.record){
            this.record = false;
            this.encoder.finish();
            this.encoder.download("maze.gif");
        }
    }

    // If possible, record in multiple formats
    startRecording(){
        this.record = true;
        this.run();
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

        if(this.record) this.encoder.addFrame(this.canvasContext);
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
