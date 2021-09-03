
const { Notification, dialog, BrowserWindow } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const TIME = require('../util_functions/time');
const { NotasProductosController } = require('./notas_productos_controller');
const { PdfController } = require('./pdf_controller');
const FILE = require('../util_functions/file')

class NotasController {

	databaseInstance = null;


	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static crearNota( nota ) {

		// nota tiene todas las propiedades del nota de entrega + productos, no puedes enviar todo eso
		// por que mostrarar un error si haces un log de nota te trae toda la informacion debes extraer
		// sus propiedades y crear el objeto para cada consulta

		// console.log( nota );

		let nuevaNota = {
			userid: nota['userid'],
			status: nota['status'],
			descripcion_nota: nota['descripcion_nota'],
			id_cliente: nota['id_cliente'],
			fecha_entrega: nota['fecha_entrega']
		};

		let arrayProductos = nota['productos']; // aqui te trae toda la info de los producto aqui esta la cantidad

		const validarCantidad = arrayProductos.every(( producto ) => producto['cantidad_seleccionada'] <= producto['cantidad']);

		if ( validarCantidad === false ){

			dialog.showMessageBox (null, {
				type: 'warning',
				title: 'advertencia',
				message: 'la cantidad seleccionada no debe ser mayor a la cantidad disponible'
			});

			// throw new Error("La cantidad seleccionada no debe ser mayor a la cantidad disponible");

			return;
		}

		this.database.insert( CRUD.crearNota, nuevaNota, async ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear Nota';

				notificacion.show();

				console.log(error);

				throw error;
			}

			try {
				// recuerda que obtener id nota es un metodo estatico se invoca nombre_clase.metodo()
				let ultimoRegistro = await NotasController.obtenerIdNota();

				// aqui se filtro lo campos excluyendo la cantidad
				//console.log ( arrayProductos );

				arrayProductos = arrayProductos.map(( producto ) => {
					return {
						id_nota: ultimoRegistro['id_nota'],
						id_producto: producto['productoid'],
						cantidad_seleccionada: producto['cantidad_seleccionada'],
						cantidad: producto['cantidad']
					};
				});

				arrayProductos.forEach(( notaProducto ) => {
						NotasProductosController.insertarNotasProductos.call( NotasProductosController.database, notaProducto );
				});

				notificacion['title'] = 'Éxito';
				notificacion['body'] = 'Nota creada con éxito';

				notificacion.show();

			} catch ( error ) {
				console.error( error );

				throw error;
			}

		});
	}

	static obtenerIdNota() {

		return new Promise( ( resolve, reject ) => {

			this.database.consult( CRUD.ultimoRegistro, null, ( error, resultado ) => {

				const  notificacion = new Notification({
					title: 'Error en obtener los registros',
					body: 'No se pudo obtener el registro'
				});

				if ( error ) {

					notificacion.show();
					console.log( error );

					reject( error );

					return;
				}

				const ultimoRegistro = resultado[0];

				// el resolve es el valor de vuelta asignado
				resolve( ultimoRegistro );
			});
		});

	}

	static obtenerNota( idNota ) {

		return new Promise(( resolve, reject ) => {

			this.database.consult( CRUD.obtenerNota, { id_nota: idNota }, ( error, resultadoNota ) => {

				if ( error ) {
					console.log( error );

					reject( error );

					return;
				}

				let nota = resultadoNota[0];

				// newDate parsea la fecha para pasar a la funcion dateSpanish la cual la envia en formato español
				// si existe la fecha de entrega

				if ( nota['fecha_entrega'] ) {
					nota['fecha_entrega'] = TIME.dateToString( new Date( nota['fecha_entrega'] ) );
				}

				this.database.consult( CRUD.obtenerNotaProducto, 	{ id_nota: idNota }, ( error, resultadoNotaProducto ) => {

					if ( error ) {
						console.log( error );

						reject( error );

						return;
					}

					// console.log( ">>>>>>>", { nota, resultadoNotaProducto }, "<<<<<<<" );

					resolve({
						...nota,
						productos: resultadoNotaProducto,
						total_order: NotasController.calcularTotalNotas( resultadoNotaProducto )
					});

				});
			});
		});

	}

	static calcularTotalNotas( arrayNotaProducto ) {

		const reducer = ( accumulator, currentValue ) => {
			return accumulator = accumulator + ( currentValue['cantidad_seleccionada'] * currentValue['precio'] );
		}

		return Number.parseFloat( arrayNotaProducto.reduce(reducer, 0).toFixed(2) );
	}

	static obtenerTotalNotas() {

		return new Promise( ( resolve, reject ) => {

			this.database.getTotalRecords( CRUD.obtenerTotalNotas, ( error, resultado ) => {

				const notificacion = new Notification({
					title: 'Error en obtener los registros',
					body: 'No se pudo obtener el total de registros'
				});

				if ( error ) {

					notificacion.show();

					console.log( error );

					reject( error );

					return;
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

	static listarNotas( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarNotas, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					reject( error );

					return;
				}

				resolve( results );
			});

		});
	}

	static buscarNota( search ) {

		return new Promise(( resolve, reject ) => {

				// console.log( CRUD.buscarNotas );

				this.database.find( CRUD.buscarNotas, search, ( error, results ) => {

					const notificacion = new Notification({
						title: '',
						body: ''
					});

					if ( error ) {

						// throw error;

						notificacion['title'] = 'Error!!';
						notificacion['body'] = 'Error al buscar Nota';

						notificacion.show();

						console.log( error );

						reject( error );

						return;
					}

					resolve( results );
				});
		});
	}

	static mostrarAlerta( type = 'info', title, message ) {
		dialog.showMessageBox( null, {
			message,
			type,
			title
		});
	}

	static actualizarNota( nota ) {

		let notaActualizada = {
			userid: nota['userid'],
			status: nota['status'],
			descripcion_nota: nota['descripcion_nota'],
			id_cliente: nota['id_cliente'],
			fecha_entrega: nota['fecha_entrega'],
			id_nota: nota['id_nota']
		};

		let arrayProductos = nota['productos'];

		const validarCantidad = arrayProductos.every(( producto ) => producto['cantidad_seleccionada'] <= producto['cantidad']);

		if ( validarCantidad === false ) {

			dialog.showMessageBox (null, {
				type: 'warning',
				title: 'advertencia',
				message: 'la cantidad seleccionada no debe ser mayor a la cantidad disponible'
			});

			// throw new Error("La cantidad seleccionada no debe ser mayor a la cantidad disponible");

			return;
		}

		// actualiza la nota
		this.database.update( CRUD.editarNotas, notaActualizada, ( error ) => {

			if ( error ) {

					console.log( error );

					// throw error;

					return;
			}

			let idNota = nota['id_nota'];

			// consulta el array desde la BD y la compara
			this.database.consult( CRUD.listarNotasProductos, { id_nota : idNota }, ( error, results ) => {

					if ( error ) {

						console.log( error );

						throw error;

						return;
					}

					const notaProductoDB = results;

					arrayProductos.forEach(( notaProducto, idx ) => {

						let index = notaProductoDB.findIndex(( notaProductoDB ) => {
							return notaProducto['id_NP'] === notaProductoDB['id_NP'];
						});

						// callback de notificacion se ejecuta en el ultimo ciclo
						let callback = ( idx === ( arrayProductos.length - 1 ) ) ?
							() => {
								const notificacion = new Notification({
									title: 'Exito !!',
									body: 'Nota actualizada con exito'
								});

								notificacion.show();
							} : null;

						if ( index === -1 ) {

							// crea la nota si no esta en el array
							NotasProductosController.insertarNotasProductos.call(
								NotasProductosController.database,
								{
									id_nota: idNota,
									cantidad_seleccionada: notaProducto['cantidad_seleccionada'],
									id_producto: notaProducto['productoid'],
									cantidad: notaProducto['cantidad']
								},
								callback
							);

						} else {

							// si existe actualiza el valor de cantidad_seleccionada y actualiza notas_productos + producto
							let cantidadBD = notaProductoDB[index]['cantidad_seleccionada'];
							let cantidadActualizada = notaProducto['cantidad_seleccionada'];

							let sumaAlgebraica = ( cantidadBD - cantidadActualizada );

							NotasProductosController.actualizarNotasProductos( notaProducto, sumaAlgebraica, callback );
						}
				});

			});

		});
	}

	static generarPDFNota( idNota ) {

		const pdfController = new PdfController(); // creas un objeto PDF controller

		const options = {
			title : 'Guardar Archivo',
			buttonLabel : 'Guardar' ,
			filters : [{ name: 'pdf', extensions: ['pdf'] }],
			defaultPath: FILE.getHomePath()
		};

		dialog.showSaveDialog( null, options )
			.then( async ( response ) => {

				/*	Documentación
				*  response == { canceled: boolean,  filePath: string }
				*/

				if ( response.canceled ) {
					return;
				}

				const data = await pdfController.createPdf();

				FILE.writeFile( response.filePath, data, ( error ) => {

					const notification = new Notification({
						title: 'Éxito',
						body: 'Documento generado con éxito'
					});

					if ( error ) {

						console.log( error );

						notification['title'] = 'Error!!';
						notification['body'] = 'Error al guardar archivo';

						notificacion.show();

						// throw error;

						return;
					}

					notification.show();

					// console.log( 'documento guardado' );
				});
			})
			.catch( ( error ) => {
				console.log( error );
			});
	}
}

module.exports = { NotasController };
