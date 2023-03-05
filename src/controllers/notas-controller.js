/**
 * Nota
 * @typedef {Object} Nota
 * @property {number} id_nota identificador de la nota
 * @property {number} id_cliente identificador de cliente
 * @property {number} userid identificador del usuario
 * @property {"EN_PROCESO" | "ACEPTADO" | "ENTREGADA" | "POSPUESTO" | "CANCELADA"} status estado de la orden en ese momento
 * @property {string} creacion timestamp de creacion de la nota
 * @property {string} descripcion_nota descripcion de la nota de entrega
 * @property {string} fecha_entrega fecha de entrega del pedido se completa si el usuario pasa el pedido a ENTREGADA
 * @property {Array<NotaProducto>} productos lista de productos seleccionados
 * @property {number} [total_order] total de la orden
 */

const { Notification, dialog, BrowserWindow } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const TIME = require('../util-functions/time');
const { NotasProductosController } = require('./notas-productos-controller');
const { PdfController } = require('./pdf-controller');
const excelModule = require('../util-functions/excel');
const FILE = require('../util-functions/file');
const modelNota = require('../models/note');
const { ProductosController } = require('./productos-controllers');

/** Clase que gestiona las notas de entregas */
class NotasController {

	/** @type {?Database} */
	databaseInstance = null;

	/** Propiedad get database retorna una nueva instancia de la clase Database */
	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	/**
	 * Exporta los productos en un archivo de excel
	 */
	static exportarNotas() {

		return new Promise(( resolve, reject ) => {
			
			// colocar codigo aqui
			const notificacion = new Notification();
			const extensiones = ['.json', '.xls', '.xlsx']

			/** @type {Electron.SaveDialogOptions} */
			const opciones = { 
				title: 'Exportar Nota', 
				filters: [ 
					{ name: 'Nota excel', extensions: ['xls', 'xlsx'] },
					{ name: 'Nota json', extensions: ['json'] },
				], 
			};

			let path = '';
			let message = 'Cancelada';
			
			// 1.- crear la ventana de exportacion
			dialog.showSaveDialog( BrowserWindow.getFocusedWindow(), opciones )
				.then( respuesta => {
		
					// 2.- validar la cancelacion y el formato
					if ( respuesta.canceled ) {
						throw message;
					}

					let validacion = extensiones.some(( extension ) => { 
						return respuesta.filePath.includes( extension ); 
					});

					if ( validacion === false ) {
						message = 'La extensión del archivo no es valida';

						notificacion.title = 'Atención';
						notificacion.body = message;
		
						notificacion.show();

						throw message;
					}

					// si no lo colocamos no pasa la validacion
					path = respuesta.filePath;
					
					// 3.- realizar la consulta de las notas + productos asociados con la misma ( generar el SQL )
					return NotasController.obtenerNotasArray();
				})
				.then( consultaDB => {
					
					if ( path.includes( extensiones[0] ) ) {
						return excelModule.exportJSON( path, consultaDB );

					} 

					return excelModule.generarLibroNotasExcel( path, consultaDB );
				})
				.then( respuesta => {
					
					notificacion.body = respuesta;
					notificacion.title = 'Exito';
					
					notificacion.show();

					resolve( respuesta );
				}) 
				.catch( error => {
					
					console.log( error );

					reject( error );
				});

		});	
	}

	/**
	 * Importa los productos en un archivo excel
	 */
	static importarNotas() {

		let message = 'Cancelada';

		/** metodo que muestra un mensaje de adventencia */
		const mostrarMensaje = () => {

			message = 'El orden de los campos importados son incorrectos';
				
			dialog.showErrorBox(
				'Error',
				(
					'Los campos en el archivo son incorrectos.\n\n' +
					'Consulta el manual para obtener más información\n' +
					'sobre como importar archivos.'
				)
			);
					
			throw message; 
		};
		
		return new Promise(( resolve, reject ) => {
			
			const notificacion = new Notification();
			const extensiones = ['.json', '.xls', '.xlsx'];

			/** @type {Electron.OpenDialogOptions} */
			const opciones = { 
				title: 'Importar Nota', 
				filters: [ 
					{ name: 'Nota excel', extensions: ['xls', 'xlsx'] },
					{ name: 'Nota json', extensions: ['json'] },
				], 
			};

			let path = '';

			// 1.- crear la ventana de importacion
			dialog.showOpenDialog( BrowserWindow.getFocusedWindow(), opciones )
				.then( respuestaVentana => {

					// 2.- validar la cancelacion y el formato
					if ( respuestaVentana.canceled ) {
						throw message;
					}

					path = respuestaVentana.filePaths[0];
					
					const validacion = extensiones.some( extension => path.includes( extension ) );

					if ( !validacion ) {
						message = 'La extensión del archivo no es valida';

						notificacion.title = 'Atención';
						notificacion.body = message;
		
						notificacion.show();

						throw message;
					}

					// 3.- importar el arhivo
					if ( path.includes( extensiones[0] ) ) {
						return FILE.readFilePromiseJSON( path, true );	
					}
					
					return excelModule.readFileExcelNotes( path );
				})
				.then( notas => {
					
					// testing de insertar notas
					console.log( notas );

					return;

					// 4.- validar los campos del archivo
					let validacion = notas.every( nota => modelNota.validate( nota ) );

					if ( !validacion ) {
						mostrarMensaje();
					}

					// 5.- verifica si las notas tengan status entregada 
					// si es asi asigna la fecha
					validacion = notas.some( nota => nota.status === 'ENTREGADA' );
					
					if ( validacion ) {

						notas = notas.map( nota => {
	
							if ( nota.status === 'ENTREGADA' ) {
								return { ...nota, fecha_entrega: TIME.dateToString() };
							}
	
							return nota;
						});
					}

					const arrayPromesas = notas.map( nota => NotasController.crearNota( nota, false ) );

					// ejecutamos cada promesa al momento de insertar
					return Promise.all( arrayPromesas );
				})
				.then(( _ ) => {

					notificacion.title = 'Exito';
					notificacion.body = 'Notas creadas con éxito';

					notificacion.show();

					resolve();
				})
				.catch( error => {

					console.log( error );
					
					reject( error );
				});
		});
	}

	/** Permite obtener un array de las notas con los productos */
	static obtenerNotasArray() {
		
		// esta es una promesa almecenada una posicion en memoria
		const obtenerNotasProductos = ( nota ) => new Promise (( resolve, reject ) => {
			
			// aqui hacemos la consulta a notas productos
			this.database.consult( CRUD.obtenerNotaProducto, { id_nota: nota.id_nota }, ( error, productos ) => {

				if ( error ) {

					reject( error );

					throw error;
				}
				
				resolve({ ...nota, productos: productos });
			});
		});

		return new Promise(( resolve, reject ) => {
			
			this.database.consult( CRUD.exportarNotas, null, async ( error, notas ) => { 

				if ( error ) {
					reject( error );

					throw error;
				}
						
				const arrayPromises = notas.map( nota => obtenerNotasProductos( nota ) );

				try {

					const notasProductos = await Promise.all( arrayPromises );

					// console.log(notasProductos);
					resolve( notasProductos );

				} catch ( error ) {

					console.log( error );
					
					reject( error );
				}

			});
		});
	}

	/**
	 * crea un registro de una nota de entrega
	 * @param  {Nota} nota instancia de la nota
	 * @param {boolean} [notificacion] muesta la notificacion para cada nota insertada
	 */
	static crearNota( nota, showNotificacion = true ) {

		return new Promise( async ( resolve, reject ) => {
			
			// nota tiene todas las propiedades del nota de entrega + productos, 
			// no puedes enviar todo eso por sino mostrara un error. si haces un log de nota te trae 
			// toda la informacion 
			
			// console.log( nota )
							
			// combinamos 2 consultas sql para crear la nota y obtener el ultimo registro
			const sql = ( CRUD.crearNota + " " + CRUD.ultimoRegistro );

			// Debes extraer sus propiedades y crear el objeto para cada consulta
			let nuevaNota = {
				userid: nota['userid'],
				status: nota['status'],
				descripcion_nota: nota['descripcion_nota'],
				id_cliente: nota['id_cliente'],
				fecha_entrega: nota['fecha_entrega'] ?? null
			};

			let arrayProductos = nota['productos'] ?? []; 
			
			// verificamos si llegan productos y validamos la cantidad seleccionada
			if ( arrayProductos.length > 0 ) {
				
				const arrayProductosPromise = arrayProductos.map( async producto => {
						
					if ( !producto.cantidad ) {
						return { 
							...producto, 
							cantidad: ( await ProductosController.obtenerProducto( 
									producto.productoid 
								)
							).cantidad
						}
					}

					return producto;
				})

				arrayProductos = await Promise.all( arrayProductosPromise );

				// console.log( arrayProductos );

				const validarCantidad = arrayProductos.every(( producto ) => {
					return producto['cantidad_seleccionada'] <= producto['cantidad']; 
				});

				if ( validarCantidad === false ) {
		
					dialog.showMessageBox( null, {
						type: 'warning',
						title: 'advertencia',
						message: 'la cantidad seleccionada no debe ser mayor a la cantidad disponible'
					});
		
					// throw new Error("La cantidad seleccionada no debe ser mayor a la cantidad disponible");
					
					reject("La cantidad seleccionada no debe ser mayor a la cantidad disponible");

					return;
				}
			}
			
			this.database.insert( sql, nuevaNota, ( error, results ) => {
	
				const notificacion = new Notification({ title: '', body: '' });
	
				if ( error ) {
	
					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'Error al crear Nota';
	
					notificacion.show();
	
					console.log( error );
	
					reject( error );

					return;
				}
	
				// verifica si existen productos en nota de entrega al momento de importar
				if ( arrayProductos.length === 0 ) {
					
					resolve('Nota insertada con exito');
					
					return;
				}

				// extraemos para obtener el ultimo registro
				const ultimoRegistro = results[1][0]; 

				// console.log( ultimoRegistro );

				arrayProductos = arrayProductos.map(( producto ) => {
					return {
						id_nota: ultimoRegistro['id_nota'],
						id_producto: producto['productoid'],
						cantidad_seleccionada: producto['cantidad_seleccionada'],
						cantidad: producto['cantidad'],
					};
				});

				arrayProductos.forEach(( notaProducto, index ) => {
						
					// callback de notificacion
					const callback = (index === (arrayProductos.length - 1)) ? 
						() => {
							
							if ( showNotificacion ) {
								notificacion['title'] = 'Éxito';
								notificacion['body'] = 'Nota creada con éxito';
				
								notificacion.show();
							}

							resolve('Nota + productos creada con exito');
						}
						: null

					NotasProductosController.insertarNotasProductos.call( 
						NotasProductosController.database, 
						notaProducto, 
						callback
					);
				});	
			});
		});
		
	}


	/**
	 * Funcion que obtiene el ultimo id de nota registrado
	 *
	 * @return {Promise<Nota>}  retorna una promesa que devuelve la utlima nota registada
	 * @example
	 * let utlimoRegistro = await NotasController.obtenerUlitmaNota();
	 */
	static obtenerUltimaNota() {

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


	/**
	 * Obtiene la nota desde la BD.
	 *
	 * @param  {number} idNota identificador de la nota
	 * @return {Promise<Nota>}  retorna una promesa con la nota solicitada
	 */
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

				this.database.consult( CRUD.obtenerNotaProducto, { id_nota: idNota }, ( error, resultadoNotaProducto ) => {

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


	/**
	 * Calcula el total de la nota.
	 *
	 * @param  {Array<NotaProducto>} arrayNotaProducto array de nota producto
	 * @return {number} retorna el calculo total de la orden
	 */
	static calcularTotalNotas( arrayNotaProducto ) {

		const reducer = ( accumulator, currentValue ) => {
			return accumulator = accumulator + ( currentValue['cantidad_seleccionada'] * currentValue['precio'] );
		}

		return Number.parseFloat( arrayNotaProducto.reduce(reducer, 0).toFixed(2) );
	}

	/**
	 * Obtiene el total de las notas
	 * @returns {Promise<{ totalPaginas: number, totalRegistros: number }>} 
	 * un objeto con las prpiedades antes mencionadas
	 */
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


	/**
	 * Lista las notas en forma paginada
	 *
	 * @param  {Array<number>} pagination description
	 * @return {Promise<Array<Nota>>}  devuelve una promesa que contiene un arreglo de notas
	 */
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

	/**
	 * Buscar notas en la BD
	 *
	 * @param  {Object} search objeto de busqueda
	 * @param {string} search.search busqueda de la nota
	 * @return {Promise<Array<Nota>>}   devuelve una promesa que contiene un arreglo de notas
	 */
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

	/**
	 * muestra una alerta al usuario desde el proceso principal
	 * @param  {string} type tipo de alerta
	 * @param  {string} title titulo de la alerta
	 * @param  {string} message  mensaje al usuario
	 *
	 */
	static mostrarAlerta( type = 'info', title, message ) {
		dialog.showMessageBox( null, { message, type, title });
	}

	/**
	 * actualiza la nota
	 * @param  {Nota} nota instancia de la nota
	 */
	static actualizarNota( nota ) {

		let notaActualizada = {
			userid: nota['userid'],
			status: nota['status'],
			descripcion_nota: nota['descripcion_nota'],
			id_cliente: nota['id_cliente'],
			fecha_entrega: nota['fecha_entrega'],
			id_nota: nota['id_nota']
		};

		let arrayProductos = nota['productos'] ?? [];

		if ( arrayProductos.length > 0 ) {

			const validarCantidad = arrayProductos.every(( producto ) => { 
				
				let total = producto['cantidad_seleccionada'] + producto['cantidad'];
	
				return producto['cantidad_seleccionada'] <= total; 
			});
	
			if ( validarCantidad === false ) {
	
				dialog.showMessageBox( null, {
					type: 'warning',
					title: 'advertencia',
					message: 'la cantidad seleccionada no debe ser mayor a la cantidad disponible'
				});
	
				// throw new Error("La cantidad seleccionada no debe ser mayor a la cantidad disponible");
	
				return;
			}
		}

		// actualiza la nota
		this.database.update( CRUD.editarNotas, notaActualizada, ( error ) => {

			if ( error ) {

				console.log( error );

				// throw error;

				return;
			}

			let idNota = nota['id_nota'];

			// consulta el array desde la BD y por cada elemento la compara
			this.database.consult( CRUD.listarNotasProductos, { id_nota : idNota }, ( error, results ) => {

				if ( error ) {

					console.log( error );

					// throw error;

					return;
				}

				const notaProductoDB = results;

				arrayProductos.forEach(( notaProducto, idx ) => {

					// verifica si el elemento esta en la BD
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


	/**
	 * Genera el PDF de la nota de entrega
	 * @param  {number} idNota identificador de la nota
	 */
	static generarPDFNota( idNota ) {

		const pdfController = new PdfController(); // creas un objeto PDF controller

		const options = {
			title : 'Guardar Archivo',
			buttonLabel : 'Guardar' ,
			filters : [{ name: 'pdf', extensions: ['pdf'] }],
			defaultPath: FILE.getHomePath()
		};

		const notification = new Notification({
			title: 'Éxito',
			body: 'Documento generado con éxito'
		});

		dialog.showSaveDialog( null, options )
			.then( async ( response ) => {

				/*	Documentación
				*  response == { canceled: boolean,  filePath: string }
				*  extensions = 'extensiones permitidas'
				*/

				const extensions = ['.pdf'];

				if ( response['canceled'] ) {
					return;
				}

				// verifica la extension del archivo que sea pdf
				if ( !response['filePath'].includes( extensions[0] ) ) {

					notification['title'] = 'Error !!';
					notification['body'] = 'Extension del archivo no valida';

					notification.show();

					// console.log( response['filePath'] );

					return;
				}
				
				if( FILE.checkAsset( response['filePath'], false ) ){
					FILE.deleteFileSync( response['filePath'] );
				}

				const nota = await NotasController.obtenerNota( idNota );
				const data = await pdfController.createPdf( nota );

				FILE.appendFile( response['filePath'], data, ( error ) => {

					if ( error ) {

						console.log( error );

						notification['title'] = 'Error!!';
						notification['body'] = 'Error al guardar archivo';

						notification.show();

						// throw error;

						return;
					}

					notification.show();
				});
			})
			.catch( ( error ) => {

				notification['title'] = 'Error !!';
				notification['body'] = 'Error al abrir ventana guardar';

				notification.show();

				console.log( error );
			});
	}

	static obtenerNotasArray() {
		
		// promesa de notas productos
		const promesaNotaProductos = ( nota ) => new Promise(( resolve, reject ) => {
			
			this.database.consult( CRUD.exportarNotasProducto, { id_nota: nota.id_nota }, ( error, productos ) => {
						
				if ( error ) {
					console.log( error );
					
					reject( error );

					throw error;
				}

				// asigna cada producto al arreglo padre
				resolve({ ...nota, productos });
			});
		});

		return new Promise(( resolve, reject ) => {
			
			this.database.consult( CRUD.exportarNotas, null, async ( error, notas ) => {
				
				if ( error ) {

					console.log( error );
					
					reject( error );

					throw error;
				}
				
				const arrayPromises = notas.map( nota => promesaNotaProductos( nota ) );

				try {
					const notasProductos = await Promise.all( arrayPromises );
					
					resolve( notasProductos );

				} catch ( error )  {

					console.log( error );

					reject( error );
				}
			});
		});
	}
}

module.exports = { NotasController };
