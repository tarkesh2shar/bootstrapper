export interface ShutdownHandler {
    (): Promise<any>|any;
}