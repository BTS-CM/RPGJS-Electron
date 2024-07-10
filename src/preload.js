import { ipcRenderer, contextBridge } from 'electron';

contextBridge.exposeInMainWorld('electron', {
    //notify: async (msg) => ipcRenderer.send('notify', msg),
});
