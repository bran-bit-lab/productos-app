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
                    console.log('test');
                }, 
            },
            // acerca de
            {
                label: 'Acerca de',
                click: () => {
                    dialog.showMessageBox(null, {
                        title: 'Acerca de',
                        message: (`
            ©Products-App 

Todos los derechos reservados 2022

Equipo de Trabajo:

Gabriel Martínez  (gabmart1995)
Brandon Silva     (bran-bit-lab) 
`)
                    }); 
                }, 
            },
        ]
    },
];

module.exports = {
    initMainMenu,
    addMenuItem
}