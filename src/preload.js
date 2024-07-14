import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    //notify: async (msg) => ipcRenderer.send('notify', msg),
    port: async () => ipcRenderer.invoke('port'),
    directories: async () => ipcRenderer.invoke('directories'),
});
