import { Emmiter } from './Emmiter';

export class Runner {

    events = {
        FINISH: 'finish',
        UPDATE: 'update'
    }

    constructor(worker){
        this.runnerId = null;
        this.worker = worker;
        this.emmiter = new Emmiter();
        this.speed = 1;
    }

    startStep(){
        if(this.runnerId || this.worker.done) return;
        this.worker.step();
        this.emmiter.emit(this.events.UPDATE);
    }

    startRun(){
        if(this.runnerId || this.worker.done) this.reset();
        
        this.runnerId = setInterval(() => {
            if(!this.worker.step()) {
                this.stop();
                this.emmiter.emit(this.events.FINISH);
            } else { this.emmiter.emit(this.events.UPDATE); }
        }, 
        this.speed);
    }

    stop(){
        clearInterval(this.runnerId);
        this.runnerId = null;
    }

    reset(){
        if(this.runnerId) this.stop();
        this.worker.reset();
    }

    onUpdate(callback){
        return this.emmiter.listen(this.events.UPDATE, callback);
    }

    onFinish(callback){
        return this.emmiter.listen(this.events.FINISH, callback);
    }
}