const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');
const { Database } = require('./database/database');
const { ENV } = require('./env');

const urlAssets = __dirname + '/views';

if ( ENV.DEV ) {
  require('electron-reload')( __dirname );
}

/** funcion principal para crear la ventana principal de electronJS */
function createWindow() {

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    });

    win.loadFile( urlAssets + '/login/login.html' );

    Database.connect();

    // win.webContents.openDevTools();
}


app.whenReady().then( createWindow );

//metodo para salir de la aplicacion cuando todas las ventanas estan cerradas

/* condicional pregunta cual es la plataforma actual, darwin significa Mac OS, win32 significa
windows sea 32 o 64 bits */

app.on('window-all-closed', () => {

    if ( process.platform !== 'darwin' ) {
        app.quit();
    }

    // close the connection
    Database.closeConnection();
});

//crea nueva ventana de navegador mientras la app esta activa y no hallan ventanas visibles
app.on('activate', () => {

    if ( BrowserWindow.getAllWindows().length === 0 ) {
        createWindow();
    }
});
