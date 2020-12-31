// app y BrowserWindow son objetos de electron
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

function checkAsset( url ) {
  
  fs.access(url, (err) => {
    console.log(`${url} ${err ? 'does not exist' : 'exists'}`);
  });
}

function createWindow () {
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  win.loadFile( __dirname + path.join('/views/login/index.html') );
}


app.whenReady().then( createWindow );

//metodo para salir de la aplicacion cuando todas las ventanas estan cerradas

/* condicional pregunta cual es la plataforma actual, darwin significa Mac OS, win32 significa 
windows sea 32 o 64 bits */

app.on('window-all-closed', () => {
 
  if (process.platform !== 'darwin') {
    app.quit()
  }

});

//crea nueva ventana de navegador mientras la app esta activa y no hallan ventanas visibles
app.on('activate', () => {
  
  if ( BrowserWindow.getAllWindows().length === 0 ) {
    createWindow()
  }
});

