const { app } = require('electron');
const { openLoginWindow } = require('./modules/login/login');

app.whenReady().then( openLoginWindow );

//metodo para salir de la aplicacion cuando todas las ventanas estan cerradas

/* condicional pregunta cual es la plataforma actual, darwin significa Mac OS, win32 significa 
windows sea 32 o 64 bits */

app.on('window-all-closed', () => {
 
  if (process.platform !== 'darwin') {
    app.quit();
  }

});

//crea nueva ventana de navegador mientras la app esta activa y no hallan ventanas visibles
app.on('activate', () => {
  
  if ( BrowserWindow.getAllWindows().length === 0 ) {
    createWindow();
  }
});
