import {startBootstrapProcess,BootstrapState,BootStrapLoader} from './'
import express from 'express';
export function expressLoader(state: BootstrapState) {
    // create express app
    const app = express();
    // run application to listen on given port
    app.listen(5000);
    // here we can set the data for other loaders
    state.setData("express_app", app);
    state.shutDown(()=>{
        console.log("removing express App");
    })
}
export function winstonLoader(settings: BootstrapState) {
    // btw we can retrieve express app instance here to make some winston-specific manipulations on it
    const expressApp = settings.getData("express_app");
     console.log('expressApp From Winston ',expressApp);
}
startBootstrapProcess({
    loaders:[
        expressLoader as BootStrapLoader,
        winstonLoader as BootStrapLoader
    ]
}).then((bootstrapper)=>{
    bootstrapper.shutdown()
}).catch(e=>console.log("Something Went Wrong")
)