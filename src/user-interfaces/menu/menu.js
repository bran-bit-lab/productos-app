const { Menu, dialog } = require('electron');
/**
 * Funcion que inicializa el menu principal
 * @param {Array<Electron.MenuItemConstructorOptions | Electron.MenuItem>} [mainMenuTemplate] - array de opciones del menu
 */
function initMainMenu( mainMenuTemplate = templateMenu ) {
    const menu = Menu.buildFromTemplate( mainMenuTemplate );
    Menu.setApplicationMenu( menu );
}

/**
 * Añade un nuevo elemento al menu
 * @param {Electron.Menu} item - Elemento del menu a añadir 
 */ 
function addMenuItem( item ) {
    templateMenu.unshift( item );
    initMainMenu();
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
                    // importa la documentacion del usuario
                    console.log('test');
                }, 
            },
            // acerca de
            {
                label: 'Acerca de',
                accelerator: 'Ctrl+h',
                click: () => {
                    const fs = require('fs');
                    const path = require('path');

                    fs.readFile( 
                        path.join( __dirname, 'acerca.txt' ), 
                        { encoding: 'utf-8' }, 
                        ( error, message ) => {

                            if ( error )  {
                                throw error;
                            }

                            dialog.showMessageBox(null, {
                                title: 'Acerca de',
                                message 
                            });
                        }
                    );
                }, 
            },
        ]
    },
];

module.exports = {
    initMainMenu,
    addMenuItem
}