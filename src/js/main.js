const Config = require("./Config.js");
const path = require("path");
const { app, BrowserWindow, ipcMain, globalShortcut } = require("electron");

let win;


function createWindow()
{
    win = new BrowserWindow({
        width: Config.DEFAULT_WINDOW_SIZE[0],
        height: Config.DEFAULT_WINDOW_SIZE[1],
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        }
    });

    win.setResizable(false);
    win.removeMenu();
    if (Config.SHOW_DEV_CONSOLE) win.webContents.openDevTools();
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

    if (Config.RELOAD_ENABLED)
    {
        globalShortcut.register(Config.RELOAD_BUTTON, () =>
        {
            win.reload();
        });
    }
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