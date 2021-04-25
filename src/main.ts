import {BootStrapLoader,BootStrapConfigORLoaders} from './interfaces';
import {Bootstrap} from './classes'
export function startBootstrapProcess(config: BootStrapConfigORLoaders): Promise<Bootstrap>;
export function startBootstrapProcess(modules: BootStrapLoader[]): Promise<Bootstrap>;
export function startBootstrapProcess(configOrModules: BootStrapConfigORLoaders|BootStrapLoader[]): Promise<Bootstrap> {
    const bootstrapConfig: BootStrapConfigORLoaders = configOrModules instanceof Array ? { loaders: configOrModules } : configOrModules;
    return new Bootstrap()
        .config(bootstrapConfig.config!)
        .registerLoaders(bootstrapConfig.loaders!)
        .bootstrap();
}
