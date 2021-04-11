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

		this.database.insert( CRUD.crearCategoria, nuevaCategoria, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear categoria';

				notificacion.show();

				return;
			}

			notificacion['title'] = 'Éxito';
			notificacion['body'] = 'Categoria creado con éxito';

			notificacion.show();

		});
	}

	static openImageDialog( win, callback ) {

		// se abre la ventana desde el main process

		// dialog es una clase de electron que permite abrir ventana
		// emergentes que son usadas para abrir archivos guardar  archivos

		// se le pasa un objeto de configuracion

		const config = Object.freeze({
			properties: ['openFile'],  // tipo
			title: 'Abrir imagen',  // titulo de la ventana
			buttonLabel: 'Seleccionar',  // boton de confirmar
			filters: [
				{ name: 'Imágenes .jpg .png', extensions: [ 'jpg', 'png', 'jpeg' ] }
			]  // extensiones de archivos, solamente imagenes
		});

		dialog.showOpenDialog( win, config )   // esto es la tercera forma de ejecutar la promesa 
			.then( result => {

				// seleccionas el archivo y ejecuta este callback

				// result es un objeto con las propiedades canceled: bool filesPaths es un
				// array donde se guarda el archivo en tu pc

				if ( result.canceled ) {
					return;
				} 

				// lee el archivo de imagen y lo devuelve al renderizado

				// se llama este metodos
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

	static obtenerTotalCategorias() {

		return new Promise( ( resolve, reject ) => {

			this.database.getTotalRecords( CRUD.obtenerTotalCategorias, ( error, resultado ) => {
				
				const notificacion = new Notification({
					title: 'Error en obtener los registros',
					body: 'No se pudo obtener el total de registros'
				});

				if ( error ) {

					notificacion.show();

					console.log( error );

					return reject( error );
				}
				
				const totalRegistros = resultado[0]['COUNT(*)'];

				let totalPaginas = ( totalRegistros / 10 );

				resolve({
					totalPaginas: Math.ceil( totalPaginas ),
					totalRegistros: totalRegistros
				}); 
			
			});

		});
	}	

	static listarCategorias( pagination, usuario ) {

		// aqui va a traer el path cuando consulta la bd
		console.log( pagination );
		

		return new Promise(( resolve, reject ) => {

			// aqui se hace l consulta  // se manda como array
			pagination = { start: pagination[0], limit: pagination[1], };

			console.log( pagination );
			this.database.consult( CRUD.listarCategorias, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );
					
					return reject( error );
				}
/*
				if ( results[] ) {
					console.log()
				} 

				// aqui se lee el archivo
				readFileImageAsync( result.filePaths[0], ( imgObject ) => callback( imgObject ) );
*/

				resolve( results );

				console.log( results );
			});

		});
	}

	static editarCategorias( categoria ) { //

		this.database.update( CRUD.editarCategoria, categoria, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar categoria';

				notificacion.show();

				console.log( error );

				return;
			}

  		});
	}

}


module.exports = {
	CategoriasController
};
