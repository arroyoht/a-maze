import { Subject } from 'rxjs';

export class Emmiter {

    constructor (){
        this.subjects = {};
    }

    createName(name){
        return '$' + name;
    }

    listen(name, handler){
        if(!this.isHandler(handler)) return;

        var eventName = this.createName(name);
        this.subjects[eventName] || (this.subjects[eventName] = new Subject());
        return this.subjects[eventName].subscribe(handler);
    }

    emit(name, data){
        var eventName = this.createName(name);
        this.subjects[eventName] || (this.subjects[eventName] = new Subject());
        this.subjects[eventName].next(data);
    }

    dispose(){
        var subjects = this.subjects;
        for (var prop in subjects) {
            if (subjects.hasOwnProperty(prop)) {
                subjects[prop].observers.forEach(observer => observer.unsubscribe());
            }
        }

        this.subjects = {};
    }

    isHandler(handler){
        return handler && typeof handler === "function";
    }
}