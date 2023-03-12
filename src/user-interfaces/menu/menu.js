const { resolve } = require('path');
const { Menu, dialog, BrowserWindow } = require('electron');
const { ENV } = require('../../env');
const FILE = require('../../util-functions/file');

/**
 * Funcion que inicializa el menu principal
 * @param {boolean} dev - entorno de desarrollo
 */
function initMainMenu( dev ) {
    
    // añadimos las opciones de desarrollador
    // si el entorno es de desarrollo
    if ( dev ) {

        // si ya esta agragado el elemento ventana no cargamos la opcion
        templateMenu.unshift({
            label: 'Ventana',
            role: 'window',
            submenu: [
                { role: 'reload', },
                { role: 'forceReload', },
                { type: 'separator', },
                { role: 'toggleDevTools',},
            ]
        });
    }

    // creamos el menu
    const menu = Menu.buildFromTemplate( templateMenu );
    Menu.setApplicationMenu( menu );
}

/** @type {Array<Electron.MenuItemConstructorOptions | Electron.MenuItem>} */
const templateMenu = [
    {
        label: 'Ayuda',
        role: 'help',
        submenu: [
            // documentacion
            {
                label: 'Aprender más',
                accelerator: 'F1',
                click: () => {

                    // creacion de una ventana modal
                    const url = resolve( ENV.PATH_DOCUMENTS, 'manual-usuario-productos-app.pdf' );
                    const parentWindow = BrowserWindow.getFocusedWindow();
                    const modalWindow = new BrowserWindow({
                        parent: parentWindow,
                        title: 'Manual de usuario',
                        modal: true,
                        show: false,
                        height: 600,
                        width: 400,
                    });

                    // oculta el menu al usuario
                    modalWindow.setMenuBarVisibility( false )

                    // carga el pdf
                    modalWindow.loadFile( url );

                    modalWindow.once('ready-to-show', () => {
                        modalWindow.show();
                    });
                }, 
            },
            // acerca de
            {
                label: 'Acerca de',
                accelerator: 'Ctrl+h',
                click: () => {
                    
                    try {
                        const message = FILE.readFile( resolve( ENV.PATH_DOCUMENTS, 'acerca.txt' ), true );
                        
                        dialog.showMessageBox( null, {
                            title: 'Acerca de',
                            message 
                        });
                    
                    } catch ( error ) {
                        throw error;
                    }
                }, 
            },
        ]
    },
];

module.exports = {
    initMainMenu,
}