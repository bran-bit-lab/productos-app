const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const excelModule = require('../util_functions/excel');
const CRUD = require('../database/CRUD');


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
	 */
	static exportarProductos() {
		
		const extensiones = ['.json', '.xls', '.xlsx']
		const opciones = { 
			title: 'Exportar Archivo', 
			filters: [ 
				{ name: 'Archivo excel', extensions: ['.xls', '.xlsx'] },
				{ name: 'Archivo json', extensions: ['.json'] },
			], 
		};
		
		//  asi se consume
		dialog.showSaveDialog( null, opciones )
			.then( respuesta => {
				
				if ( respuesta.canceled === true ){
					return;
				}

				let validacion = extensiones.some(( extension ) => {
					// no es extensiones sino extension 
					return respuesta.filePath.includes( extension ); 
				});

				console.log({ respuesta, validacion });			

				// si la condicion es falsa arroja un throw
				// ...

				// luego procedes a crear el archivo desde excelModule con write
				// ...

			})
			.catch( error => {
				// capturamos el error aqui
				// mandamos una notificacion al usuario
				console.log( error );
			});
	}

	/**
	 * Importa los productos en un archivo excel
	 */
	static importarProductos() {
		console.log('importar productos desde product controller');
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
