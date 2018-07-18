export class Runner {

    constructor(worker){
        this.runnerId = null;
        this.worker = worker;
        this.speed = 1;
    }

    startStep(callback){
        if(this.runnerId || this.worker.done) return;
        this.worker.step();
        if(this.isCallback(callback)) callback();
    }

    startRun(callback){
        if(this.runnerId || this.worker.done) this.reset();
        
        this.runnerId = setInterval(() => {
            if(!this.worker.step()) this.stop();
            if(this.isCallback(callback)) callback();
        }, this.speed);
    }

    stop(){
        clearInterval(this.runnerId);
        this.runnerId = null;
    }

    reset(){
        if(this.runnerId) this.stop();
        this.worker.reset();
    }

    isCallback(callback){
        return callback && typeof callback === "function";
    }
}