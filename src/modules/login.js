// app y BrowserWindow son objetos de electron
const { BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

function login( request ) {
  console.log( request );
}

function openHomeWindow() {
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  });
  
  const asset = url.format({
    protocol: 'file',
    slashes: true,
    pathname: path.join( __dirname, '../views/home/home.html' )
  });
  
  win.loadURL( asset );
}

// ===========================
//   Login Window
// ===========================
function openLoginWindow() {
  
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    center: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true
    }
  });
  
  const asset = url.format({
    protocol: 'file',
    slashes: true,
    pathname: path.join( __dirname, '../views/login/login.html' )
  });
  
  win.loadURL( asset );
}

module.exports = { 
  openLoginWindow,
  login,
  openHomeWindow 
};
