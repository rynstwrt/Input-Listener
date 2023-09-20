const { contextBridge, ipcRenderer } = require("electron");

const API_NAME = "listenToAudioInputAPI";


contextBridge.exposeInMainWorld(API_NAME, {
    getStartStopText: () => { return ipcRenderer.invoke("get-start-stop-text"); } // Communicate renderer -> main
});