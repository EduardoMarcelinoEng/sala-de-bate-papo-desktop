const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow = null;
let nickname = null
app.on('ready', ()=>{
    mainWindow = new BrowserWindow({
        height: 600,
        width: 600,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadURL(`file://${__dirname}/app/index.html`);
});

ipcMain.on('change-page', (event, name)=>{
    nickname = name;
    mainWindow.loadURL(`file://${__dirname}/app/chat.html`);
    mainWindow.resizable = true;
});

ipcMain.on('get-nickname', (event)=>{
    mainWindow.send('get-nickname', nickname);
});