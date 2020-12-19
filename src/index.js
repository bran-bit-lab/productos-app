const { app, BrowserWindow } = require('electron')
const fs = require('fs');
//app y BrowserWindow son objetos de electron

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });
  
  checkAsset( __dirname + '/index.html');
  win.loadFile( __dirname + '/index.html' );
}

function checkAsset( url ) {
	fs.access(url, (err) => {
		console.log( __dirname );
		console.log(`${url} ${err ? 'does not exist' : 'exists'}`);
	});
}

app.whenReady().then(createWindow)

//metodo para salir de la aplicacion cuando todas las ventanas estan cerradas
/*condicional pregunta cual es la plataforma actual, darwin significa Mac OS, win32 significa 
windows sea 32 o 64 bits*/
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//crea nueva ventana de navegador mientras la app esta activa y no hallan ventanas visibles
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

