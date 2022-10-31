/**
 * @file index.js es el punto de entrada de la aplicacion.
 * @author bran-bit-lab
 * @author gabmart1995
 * @see <a href="https://github.com/bran-bit-lab">Brandon Silva (bran-bit-lab)</a>
 * @see <a href="https://gabmart1995.github.io">Gabriel Martinez (gabmart1995)</a>
 */

'use strict'

const { app, BrowserWindow } = require('electron');
const path = require('path');
const { Database } = require('./database/database');
const { ENV } = require('./env');

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
        },
        show: false
    });

    // carga los datos
    win.loadFile( path.join( ENV.PATH_VIEWS, 'login', 'login.html' ) );

    win.once('ready-to-show', () => {
        win.show();
        Database.connect();
    });

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
