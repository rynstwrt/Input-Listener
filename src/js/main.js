const Config = require("./Config.js");
const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");

let win;


function createWindow()
{
    win = new BrowserWindow({
        width: Config.DEFAULT_WINDOW_SIZE[0],
        height: Config.DEFAULT_WINDOW_SIZE[1],
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            // contextIsolation: false
        }
    });

    if (Config.SHOW_DEV_CONSOLE)
        win.webContents.openDevTools();

    win.removeMenu();
    win.loadFile("../index.html");
}


app.whenReady().then(() =>
{
    createWindow();

    app.on("activate", () =>
    {
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});


app.on("window-all-closed", () =>
{
   if (process.platform !== "darwin")
       app.quit();
});


ipcMain.handle("get-start-stop-text", async () =>
{
    return [Config.START_BUTTON_TEXT, Config.STOP_BUTTON_TEXT];
});