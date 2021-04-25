import {BootstrapState} from '../classes'
export interface BootStrapLoader {
    (options?: BootstrapState): Promise<any>|any;
}