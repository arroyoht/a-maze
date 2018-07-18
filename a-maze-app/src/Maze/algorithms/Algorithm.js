import { GrowingTree, strategy } from './GrowingTree.js';

export class Algorithm {

    constructor(maze){
        this.runner = null;
        this.worker = new GrowingTree(maze, strategy.RANDOM);
        this.speed = 1;
    }

    startStep(callback){
        if(this.runner || this.worker.done) return;
        this.worker.step();
        if(this.isCallback(callback)) callback();
    }

    startRun(callback){
        if(this.runner || this.worker.done) this.reset();
        
        this.runner = setInterval(() => {
            if(!this.worker.step()) this.stop();
            if(this.isCallback(callback)) callback();
        }, this.speed);
    }

    stop(){
        clearInterval(this.runner);
        this.runner = null;
    }

    reset(){
        if(this.runner) this.stop();
        this.worker.reset();
    }

    isCallback(callback){
        return callback && typeof callback === "function";
    }
}