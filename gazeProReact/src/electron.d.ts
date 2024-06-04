export interface ElectronAPI {
    ipcRenderer: {
        send: (channel: string, data?: any) => void;
        on: (channel: string, listener: (event: any, ...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
        invoke: (channel: string, ...args: any[]) => Promise<any>;
    };
}

declare global {
    interface Window {
        electron: ElectronAPI;
    }
}