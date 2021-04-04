const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron');

class CategoriasController {

	databaseInstance = null; // esta es la variable con la instancia de database 

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static crearCategoria( categoria, usuario ) {

		// esto no va porque le dices al codigo que siempre va a tomar el 17
		//Me vuelo usuario
		// lo recibe por parametro desde el proceso renderizado
		// esa funcion no esta maquetada, tengo que hacertela pero podemos probar con una prueba
		// dame un momento
				
		let idUsuario = {
			...Categoria,
			userid: usuario.userid 
		}

		console.log( idUsuario )
		
		this.databaseInstance.insert( CRUD.crearCategoria, idUsuario, ( error ) => {
			
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

		});
	}

}


module.exports = {
	CategoriasController
};