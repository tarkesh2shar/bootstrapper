import {BootstrapState} from '../'
export interface BootStrapLoader {
    (options?: BootstrapState): Promise<any>|any;
}