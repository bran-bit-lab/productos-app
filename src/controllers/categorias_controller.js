const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { readFileImageAsync, copyFile } = require('../util_functions/file');
const PATH_PICTURES = require ('../env'); 

let dest = (   PATH_PICTURES['ENV']['PATH_PICTURES'] + 'categorias' );

class CategoriasController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static crearCategoria( categoria, usuario ) {

		let nuevaCategoria = {
			...categoria,
			userid: usuario.userid
		};
		
		let result = nuevaCategoria.imagen.split('.');
		let nuevoNombre = '/categoria.' + result[1]

		dest = dest + nuevoNombre;
		console.log( dest );

		try {
			copyFile( nuevaCategoria.imagen, dest );

		} catch (error) {
			console.log( error ) 
		}

		/*this.database.insert( CRUD.crearCategoria, nuevaCategoria, ( error ) => {

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

		});*/
	}

	static openImageDialog( win, callback ) {

		// se le pasa un objeto de configuracion

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

				// lee el archivo de imagen y lo devuelve al renderizado

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

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarCategorias, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					return reject( error );
				}
				//console.log( results );
				resolve( results );

			});

		});
	}

	static editarCategoria( categoria, usuario ) {

		console.log( categoria, usuario );

		/*this.database.update( CRUD.editarCategoria, categoria, ( error ) => {

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

  	}) */;
	}

}

module.exports = {
	CategoriasController
};
