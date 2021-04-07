const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { readFileImageAsync } = require('../util_functions/file');

class CategoriasController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static crearCategoria( categoria, usuario ) {
				
		let nuevaCategoria = {
			...categoria,
			userid: usuario.userid 
		}

		console.log( nuevaCategoria );
		
		/*
		this.database.insert( CRUD.crearCategoria, nuevaCategoria, ( error ) => {
			
			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear categoria';

				notificacion.show();
				
				return;
			}

			notificacion['title'] = 'Éxito';
			notificacion['body'] = 'Categoria creado con éxito';											

			notificacion.show();

		}); */
	}

	static openImageDialog( win, callback ) {

		// se abre la ventana desde el main process

		const config = Object.freeze({ 
			properties: ['openFile'], 
			title: 'Abrir imagen',
			buttonLabel: 'Seleccionar',
			filters: [
				{ name: 'Imágenes .jpg .png', extensions: [ 'jpg', 'png', 'jpeg' ] }
			]
		});

		dialog.showOpenDialog( win, config )
			.then( result => {
			
				if ( result.canceled ) {
					return;
				}

				readFileImageAsync( result.filePaths[0], ( imgObject ) => callback( imgObject ) );
			})
			.catch( error => {
				
				console.log( error );

				const notificacion = new Notification({
					title: 'Error',
					body: 'Error al cargar archivo'
				});

				notificacion.show();				
			});
	}

}


module.exports = {
	CategoriasController
};