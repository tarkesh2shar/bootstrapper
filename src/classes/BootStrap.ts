import {BootStrapLoader,BootstrappedAppConfig,BootstrapState} from '../';
export class Bootstrap {
    private bootstrappedAppConfig?: BootstrappedAppConfig;
    private loaders: BootStrapLoader[] = [];
    private bootstrapCurrentState?: BootstrapState;
    //Load Configurations ok?
    config(config: BootstrappedAppConfig): this {
        if(config)
            this.bootstrappedAppConfig = config;
        return this;
    }
    //Set Loaders
        registerLoaders(loaders: BootStrapLoader[]): this;
        registerLoaders(...loaders: BootStrapLoader[]): this;
        registerLoaders(loaders: any): this {
            ((loaders as BootStrapLoader[]) || []).forEach(loader => {
                if (loader instanceof Array) {
                    this.loaders.push(...loader);
                } else {
                    this.loaders.push(loader);
                }
            });
            return this;
        }

     //BootStrapProcess//
        bootstrap(): Promise<this> {
            this.bootstrapCurrentState = new BootstrapState();
            const bootstrapTime = +new Date();
    
            return this.generateLogo()
                .then(logo => {
                    if (logo) console.log(logo);
                    return this.createBootstrapTimeout();
                }).then(() => {

                    return this.runInSequence<BootStrapLoader,any>(this.loaders, (loader) => {
                        //Pass the BootstrapState to all loaders ...
                        const loaderResult = loader(this.bootstrapCurrentState);
                        return loaderResult instanceof Promise ? loaderResult : Promise.resolve();
                    });
                }).then(() => {
                    if (this.bootstrappedAppConfig && this.bootstrappedAppConfig.showBootstrapTime)
                        console.log(`Application is up and running. It took ${+new Date() - bootstrapTime - (this.bootstrappedAppConfig.bootstrapTimeout || 0)} ms to bootstrap the app.`);
                    return this;
                })
        }

        //ShutDownHandlers
        shutdown(): Promise<this> {
            if (!this.bootstrapCurrentState)
                throw new Error("Error while Shutdown, No BootstrapState Detected");
    
            return this.runInSequence(this.bootstrapCurrentState.getShutdownHandlers(), handler => {
                const handlerResult = handler();
                return handlerResult instanceof Promise ? handlerResult : Promise.resolve();
            }).then(() => this);
        }
        //access To BootStrap State
        get settings(): BootstrapState {
            if (!this.bootstrapCurrentState)
                throw new Error("No Bootstrap State Found");
            return this.bootstrapCurrentState;
        }
        //Run in Sequence
        private runInSequence<T, U>(collection: T[], callback: (item: T) => Promise<U>): Promise<U[]> {
            const results: U[] = [];
            return collection.reduce((promise, item) => {
                return promise.then(() => {
                    return callback(item);
                }).then(result => {
                    results.push(result);
                });
            }, Promise.resolve()).then(() => {
                return results;
            });
        }
        //Generate Logo On terminal if showLogo set to true
        private generateLogo(): Promise<string> {
            return new Promise((ok, fail) => {
                if (!this.bootstrappedAppConfig || !this.bootstrappedAppConfig.logo)
                    return ok("Generate Logo failed --> Framework config not set");
    
                try {
                    const asciiArt = require("ascii-art");
                    asciiArt.font(this.bootstrappedAppConfig.logo, "Doom", (_:any,logo: string) => ok(logo));
                } catch (err) {
                    throw new Error("ascii-art Not Installed ");
                }
            });
        }
       // Timeout 
        private createBootstrapTimeout(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                if (!this.bootstrappedAppConfig || !this.bootstrappedAppConfig.bootstrapTimeout)
                    return resolve();
    
                setTimeout(resolve, this.bootstrappedAppConfig.bootstrapTimeout);
            });
        }
}