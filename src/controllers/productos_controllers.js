const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { readFileImageAsync, copyFile, deleteImageSync } = require('../util_functions/file');

class ProductosController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static get urlImage() {
		return this.setUrlImage || ( this.setUrlImage = new CategoriasController().setUrlImage );
	}

	static crearProducto( producto, categoria, usuario ) {

		let nuevoProducto = {
			...product,
			userid: usuario['userid']
		};

		if ( nuevoProducto['imagen'] && nuevoProducto['imagen'].length > 0 ) {
			nuevaProducto['imagen'] = this.urlImage( nuevoProducto['imagen'] );
		}

		this.database.insert( CRUD.crearProducto, nuevoProducto, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear producto';

				notificacion.show();

				return;
			}

			notificacion['title'] = 'Éxito';
			notificacion['body'] = 'Producto creado con éxito';

			notificacion.show();

		});
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

	static obtenerTotalProductos() {

		return new Promise( ( resolve, reject ) => {

			this.database.getTotalRecords( CRUD.obtenerTotalProductos, ( error, resultado ) => {

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

	static listarProductos( pagination, usuario ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarProductos, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					return reject( error );
				}

				// console.log( results );
				resolve( results );
			});

		});
	}

	static editarProducto( producto, usuario, imagenRegistrada ) {

		//console.log( categoria, imagenRegistrada, "imagen_registrada" );

		let change = producto['imagen'].length > 0 && imagenRegistrada !== producto['imagen'];
		
		if ( change == true && (imagenRegistrada.length > 0) ){

			deleteImageSync ( imagenRegistrada );

			producto['imagen'] = this.urlImage( producto['imagen'] );
			console.log(producto['imagen']);

		} else {
			producto['imagen'] = this.urlImage( producto['imagen'] );

		};

		this.database.update( CRUD.editarProducto, producto, ( error ) => {

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

				notificacion['title'] = 'Exito!!';
				notificacion['body'] = 'Categoria Actualizada';

				notificacion.show();

  		});
	}

	setUrlImage( urlImagen ) {

		try {

			// aqui se cambia el nombre se le pasa un timestamp
			let nuevoNombreImagen = `categorias/${ Date.now() }.${ urlImagen.split('.')[1] }`;

			let resultadoUrl = copyFile( urlImagen, nuevoNombreImagen );

			// se devuelve el string preformateado del copyFile
			return resultadoUrl;

		} catch ( error ) {
			console.log( error );

			throw error;
		}
	}

}