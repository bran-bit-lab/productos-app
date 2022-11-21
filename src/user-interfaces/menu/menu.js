const { Menu, dialog, ipcMain } = require('electron');
const { ENV } = require('../../env');

/**
 * Funcion que inicializa el menu principal
 * @param {boolean} dev - entorno de desarrollo
 */
function initMainMenu() {
    
    // añadimos las opciones de desarrollador
    // si el entorno es de desarrollo
    if ( ENV.DEV ) {

        // si ya esta agragado el elemento ventana no cargamos la opcion
        if ( templateMenu.findIndex( menu => menu.label === 'Ventana' ) === -1 ) {
            
            templateMenu.unshift({
                label: 'Ventana',
                role: 'window',
                submenu: [
                    {
                        role: 'toggleDevTools',
                    }
                ]
            });

        }

    }

    // creamos el menu
    const menu = Menu.buildFromTemplate( templateMenu );
    Menu.setApplicationMenu( menu );
}

/**
 * Añade un nuevo elemento al menu
 * @param {Electron.Menu} item - Elemento del menu a añadir 
 */ 
function addMenuItem( item ) {

    // creamos la opcion si no existe
    if ( !item ) {
        
        templateMenu.unshift({
            label: 'Archivo',
            role: 'fileMenu',
            submenu:  [
                {
                    label: 'exportar productos',
                    click: () => {
                        console.log('exportar productos');
                    }
                },
                {
                    label: 'exportar notas de entrega',
                    click: () => {
                        console.log('exportar notas de entrega');
                    }
                }
            ]
        });

        initMainMenu();
    }
}

function hideMenuItem( item ) {
    
    if ( item ) {
        templateMenu = templateMenu.filter( menu => menu !== item );
        initMainMenu();
    }
}

/** @type {Array<Electron.MenuItemConstructorOptions | Electron.MenuItem>} */
let templateMenu = [
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

// events listeners
ipcMain.on('show-export-menu', () => {
    addMenuItem( templateMenu.find( menu => menu.label === 'Archivo' ) );
});

ipcMain.on('hide-export-menu', () => {
    hideMenuItem( templateMenu.find( menu => menu.label === 'Archivo' ) );
});

module.exports = {
    initMainMenu,
    addMenuItem
}