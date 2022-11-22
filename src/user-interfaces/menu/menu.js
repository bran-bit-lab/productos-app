const { Menu, dialog, ipcMain } = require('electron');

const { ProductosController, NotasController } = require('../../controllers');
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
            
            templateMenu.push({
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

    templateMenu.unshift( item );
    initMainMenu();
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
                    
                    const FILE = require('../../util_functions/file');
                    
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

// events listeners
ipcMain.on('show-file-menu', () => {

    // opcion archivo
    if ( templateMenu.findIndex( menu => menu.label === 'Archivo' ) === -1 ) {
        
        addMenuItem({
            label: 'Archivo',
            role: 'fileMenu',
            submenu:  [
                {
                    label: 'Exportar',
                    submenu: [
                        {
                            label: 'Productos',
                            click: ProductosController.exportarProductos,
                        },
                        {
                            label: 'Notas de entrega',
                            click: NotasController.exportarNotas,
                        },
                    ],
                },
                {
                    label: 'Importar',
                    submenu: [
                        {
                            label: 'Productos',
                            click: ProductosController.importarProductos,
                        },
                        {
                            label: 'Notas de entrega',
                            click: NotasController.importarNotas,
                        },
                    ],
                },
            ]
        });
    }
});

ipcMain.on('hide-file-menu', () => {
    hideMenuItem( templateMenu.find( menu => menu.label === 'Archivo' ) );
});

module.exports = {
    initMainMenu,
    addMenuItem
}