const { Menu, dialog } = require('electron');

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
            /*{
                label: 'Aprender más',
                accelerator: 'F1',
                click: () => {
                    // importa la documentacion del usuario
                    console.log('test');
                }, 
            },*/
            // acerca de
            {
                label: 'Acerca de',
                accelerator: 'Ctrl+h',
                click: () => {
                    
                    const FILE = require('../../util-functions/file');
                    
                    try {
                        const message = FILE.readFile( '/user-interfaces/menu/acerca.txt' );
                        
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