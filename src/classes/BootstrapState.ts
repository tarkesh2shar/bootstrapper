import {ShutdownHandler} from '../interfaces';
export class BootstrapState{
    private data:{[key:string]:any} = {}; 
    private shutdownHandlers:ShutdownHandler[]=[];
    setData(key:string,value:any):this {
        this.data[key]=value;
        return this;
    }
    getData(key:string):any{
        return this.data[key];
    }
    shutDown(handler:ShutdownHandler):this{
        this.shutdownHandlers.push(handler);
        return this;
    }
    getShutdownHandlers(): ShutdownHandler[] {
        return this.shutdownHandlers.map(handlers => handlers);
    }
}
