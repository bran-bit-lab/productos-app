const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron');

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

}


module.exports = {
	CategoriasController
};