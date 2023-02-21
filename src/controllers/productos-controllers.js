const { Notification, dialog, BrowserWindow } = require('electron');

const { Database } = require('../database/database'); 
const ProductModel = require('../models/product');
const CRUD = require('../database/CRUD');

const excelModule = require('../util-functions/excel');
const fileModule = require('../util-functions/file');


/** clase que gestiona los productos */
class ProductosController {

	/** @type {?Database} */
	databaseInstance = null;

	/** Propiedad get database retorna una nueva instancia de la clase Database */
	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	/**
	 * Exporta los productos en un archivo de excel
	 * @returns {Promise<string>}
	 */
	static exportarProductos() {

		return new Promise(( resolve, reject ) => {

			// almacena una instancia de notificacion al usuario
			const notificacion = new Notification();
			const extensiones = ['.json', '.xls', '.xlsx']
			
			/** @type {Electron.SaveDialogOptions} */
			const opciones = { 
				title: 'Exportar Archivo', 
				filters: [ 
					{ name: 'Archivo excel', extensions: ['xls', 'xlsx'] },
					{ name: 'Archivo json', extensions: ['json'] },
				], 
			};
	
			let path = '';
			
			//  asi se consume
			dialog.showSaveDialog( BrowserWindow.getFocusedWindow(), opciones )
				.then( respuesta => {
					
					let message = 'Cancelada';

					if ( respuesta.canceled ) {
					
						// abortamos la ejecucion del resto de promesas
						// pasamos al catch
						throw message;
					}
	
					// validamos que el archivo cumpla con una de las 
					// extensiones
					let validacion = extensiones.some(( extension ) => { 
						return respuesta.filePath.includes( extension ); 
					});
	
					// console.log({ respuesta, validacion });			
	
					if ( validacion === false ) {
						message = 'La extensión del archivo no es valida';

						notificacion.title = 'Atención';
						notificacion.body = message;
	
						notificacion.show();
						
						// abortamos la ejecucion del resto de promesas
						// pasamos al catch
						throw message;
					}
	
					// asignamos el path al scope superior
					path = respuesta.filePath;
	
					return ProductosController.obtenerTotalProductosExportar();
				})
				.then( consultaDB => {
					
					// aqui obtienes la respuesta de la BD de datos
					// console.log({ path }); 
	
					// validamos si es un JSON
					if ( path.includes( extensiones[0] ) ) {
						return excelModule.exportJSON( path, consultaDB );
					}
					
					// aqui obtienes las respuesta de la promesa path y 
					// arreglo de objetos de la data del sql
					return excelModule.writeFileExcel( path, consultaDB, 'ordenes' );
				})
				.then( respuestaArchivo => {
	
					console.log( respuestaArchivo );
					
					notificacion.body = respuestaArchivo;
					notificacion.title = 'Exito';
					
					notificacion.show();

					resolve( respuestaArchivo );
				})
				.catch( error => {
					console.log( error );

					reject( error );
				});
		});
	}

	/**
	 * Importa los productos en un archivo excel
	 * @returns {Promise<void>}
	 */
	static importarProductos() {

		/** funcion que muestra el alert de campos incorrectos */
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
					title: 'Importar Archivo', 
					filters: [ 
						{ name: 'Archivo excel', extensions: ['xls', 'xlsx'] },
						{ name: 'Archivo json', extensions: ['json'] },
					], 
			};
	
			let path = '';
			let message = 'Cancelada';
	
			dialog.showOpenDialog( BrowserWindow.getFocusedWindow(), opciones )
				.then( respuestaVentana => {
	
					if ( respuestaVentana.canceled ) {
						
						// abortamos la ejecucion del resto de promesas
						// pasamos al catch
						throw message;
					}	
	
					path = respuestaVentana.filePaths[0];
					
					let validacion = extensiones.some(( extension ) => path.includes( extension ));
	
					if ( validacion === false ) {
						message = 'La extension del archivo no es valida';
	
						notificacion.title = 'Atención';
						notificacion.body = message;
	
						notificacion.show();
						
						// abortamos la ejecucion del resto de promesas
						// pasamos al catch
						throw message;
					}	
	
					// validamos si es un JSON
					if ( path.includes( extensiones[0] ) ) {
						return fileModule.readFilePromiseJSON( path, true );
					}

					return excelModule.readFileExcel( path );	
					
				})
				.then( data => {

					const validacion = data.every( product => ProductModel.validate( product ) );
					
					// console.log( validate );  

					if ( validacion === false ) {
						mostrarMensaje();
					}
							
					return ProductosController.insertarArrayProductos( 
						CRUD.importarProductos, 
						data 
					);
				})
				.then( respuesta => {
					
					// console.log( respuesta );

					const notificacion = new Notification({
						title: 'Éxito',
						body: 'Productos importados con éxito'
					});

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
	 * Inserta un array de productos en la BD
	 * @param {string} sql consulta SQL
	 * @param {Array<Product>} productos array de productos
	 * @returns {Promise<string>}
	 */
	static insertarArrayProductos( sql, productos ) {
	
		return new Promise(( resolve, reject ) => {
			
			// 1. transformar los valores a string dentro de un arreglo usando map
			let dataProductos = productos.map(( producto ) => {

				if ( !this.database._mysqlAPI ) {
					return '';
				}

				// este es el values SQL que se va a concatenar
				return ("(" +
					this.database._mysqlAPI.escape( producto.userid ) + ", " +
					this.database._mysqlAPI.escape( producto.categoriaid ) + ", " + 
					this.database._mysqlAPI.escape( producto.nombre )  + ", " + 
					this.database._mysqlAPI.escape( producto.descripcion )  + ", " + 
					this.database._mysqlAPI.escape( producto.cantidad )  + ", " + 
					this.database._mysqlAPI.escape( producto.precio )  + ", " + 
					this.database._mysqlAPI.escape( producto.disponibilidad ) +	
				")");
			});

			// 2. Se transforma el array en string
			dataProductos = dataProductos.join(',');

			/**
			 * Se decide reemplazar values pasar directamente la cadena sql porque el segundo 
			 * parametro escapa el valor del string y manda los valores entre comillados
			 *
			 * 3. se sustituye manualmente el valor con String.replace
 			*/
			sql = sql.replace(':values', dataProductos );

			// 4. se manda a la BD con el parametro data en null
			this.database.insert( sql, null, ( error ) => {

				if ( error ) {

					reject( error );

					return;
				}
				
				resolve('Productos importados con éxito');
			});
		});

	}

	/**
	 * Añade un nuevo producto
	 *
	 * @param  {Product} producto instancia del producto
	 * @param  {User} usuario usuario logeado
	 */
	static crearProducto( producto, usuario ) {

		let nuevoProducto = {
			...producto,
			userid: usuario['userid']
		};

		// console.log( nuevoProducto );

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

	/**
	* Obtiene el total de los productos
	* @returns {Promise<{ totalPaginas: number, totalRegistros: number }>}
	*/
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
	* Obtiene el total de los productos para exportar
	* @returns {Promise<Array<Product>>}
	*/
	static obtenerTotalProductosExportar() {
		
		return new Promise(( resolve, reject ) => {
			this.database.consult( CRUD.exportarProductos, ( error, resultados ) => {
					
				// lo capturamos en el catch
				if ( error ) {
					reject({
						error: 'Error en la consulta BD',
						detail: error
					});

					return
				}

				// console.log( resultados );

				// aqui no puedo retorna la promesa porque el then no se ejeucuta
				// porque este return es el callback
				resolve( resultados );
			});
		});
	}

	/**
	* Obtiene el total de los productos disponibles
	* @returns {Promise<{ totalPaginas: number, totalRegistros: number }>}
	*/
	static obtenerTotalProductosActivos() {

		return new Promise(( resolve, reject ) => {
			this.database.getTotalRecords( CRUD.obtenerTotalProductosActivos, ( error, resultado ) => {

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
	 * Listar productos
	 *
	 * @param  {Array<number>} pagination array de paginacion
	 * @return {Promise<Array<Product>>}  devuelve una promesa con los productos paginados
	 */
	static listarProductos( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarProductos, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					reject( error );

					return;
				}

				// console.log( results );
				resolve( results );
			});

		});
	}

	/**
	 * Listar productos activos
	 *
	 * @param  {Array<number>} pagination array de paginacion
	 * @return {Promise<Array<Product>>}  devuelve una promesa con los productos disponibles paginados
	 */
	static listarProductosActivos( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarProductosActivos, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					reject( error );

					return;
				}

				// console.log( results );
				resolve( results );
			});

		});
	}


	/**
	 * Lista las categorias
	 * @return {Promise<Array<Category>>}  devuelve una promesa devolviendo el listado de categorias
	 */
	static listarCategorias() {

		return new Promise(( resolve, reject ) => {

			this.database.consult( CRUD.listadoCategoriasProductos, ( error, results ) => {

				if ( error ) {
					console.log( error );

					reject( error );
				}

				resolve( results );
			})
		})
	}

	/**
	 * edita un producto
	 *
	 * @param  {Product} producto instancia del producto
	 * @param  {User} usuario usuario logeado
	 */
	static editarProducto( producto, usuario ) {

		// console.log (producto, "<-- log del producto");

		this.database.update( CRUD.editarProducto, producto, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar producto';

				notificacion.show();

				console.log( error );

				return;
			}

				notificacion['title'] = 'Exito!!';
				notificacion['body'] = 'Producto Modificado';

				notificacion.show();
  		});
	}


	/**
	 * edita la cantidad del producto
	 *
	 * @param  {Object} productoActualizado objecto del producto actualizado
	 * @param {number} productoActualizado.productoid identificador del producto
	 * @param {number} productoActualizado.sumaAlgebraica resultado de la suma algebraica
	 * @param  {callback} callback  callback de respuesta al finalizar la actualizacion del producto
	 */
	static editarCantidadProducto( productoActualizado, callback = null ) {

		this.database.update( CRUD.actualizarCantidadProducto, productoActualizado, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				console.log( error );

				notificacion['title'] = 'Error !!';
				notificacion['body'] = 'Error al actualizar la nota';

				notificacion.show();

				// throw error;

				return;
			}

			if ( callback ) {
				callback();
			}

			// console.log('  producto actualizado  ');

  	});
	}


	/**
	 * activa o desactiva la disponibilidad del producto
	 *
	 * @param  {Object} producto
	 * @param {number} producto.productoid  identificador de producto
	 * @param {boolean} producto.disponibilidad disponibilidad de producto
	 */
	static activarProducto( producto ) {

		//console.log (producto, "<-- log del producto");

		this.database.update( CRUD.activarProducto, producto, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar producto';

				notificacion.show();

				console.log( error );

				return;
			}

			notificacion['title'] = 'Exito!!';
			notificacion['body'] = 'Producto Modificado';

			notificacion.show();
  		});
	}


	/**
	 * Permite buscar clientes en la BD
	 * @param  {Object} search producto a buscar
	 * @param {string} search.search cadena de busqueda del producto
	 * @return {Promise<Array<Product>>}  devuelve una promesa con los resultados encontrados
	*/
	static buscarProducto( search ) {

		return new Promise(( resolve, reject ) => {

				this.database.find( CRUD.buscarProducto, search, ( error, results ) => {

					const notificacion = new Notification({
						title: '',
						body: ''
					});

					if ( error ) {

						// throw error;  // mostrará el error en pantalla

						notificacion['title'] = 'Error!!';
						notificacion['body'] = 'Error al buscar Producto';

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
	 * Obtiene una instancia de un producto
	 * @param {number} idProduct 
	 * @returns {Promise<Product>}
	 */
	static obtenerProducto( idProduct ) {
		return new Promise(( resolve, reject ) => {
			
			this.database.consult(CRUD.obtenerProducto, { productoid: idProduct }, ( error,  results ) => {

				if ( error ) {
					console.log( error );
					reject( error );

					return;
				}

				// console.log( results );

				const [ result ] = results;

				resolve( result );
			});
		});
	}

}

/**
 * Product
 * @typedef {Object} Product
 * @property {number} [productoid] identificador de producto
 * @property {number} userid identificador de usuario
 * @property {number} categoriaid identificador de categoria
 * @property {string} nombre nombre del producto
 * @property {string} descripcion descripcion de producto
 * @property {number} precio precio del producto
 * @property {number} cantidad cantidad de productos
 * @property {boolean} disponibilidad disponibilidad de producto
 */

module.exports = { ProductosController };
