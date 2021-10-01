const { Notification, dialog } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { readFileImageAsync, copyFile, deleteImageSync } = require('../util_functions/file');

/** clase que gestiona las categorias */
class CategoriasController {

	/** @type {Database|null} */
	databaseInstance = null;

	/** Propiedad get database retorna una nueva instancia de la clase Database */
	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	/**
	 * Añade una nueva categoria
	 *
	 * @param  {Category} categoria instancia de categoria
	 * @param  {User} usuario  instancia de usuario
	 */
	static crearCategoria( categoria, usuario ) {

		let nuevaCategoria = {
			...categoria,
			userid: usuario['userid']
		};

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
			notificacion['body'] = 'Categoria creada con éxito';

			notificacion.show();

		});
	}


	/**
	 * activar categoria
	 *
	 * @param  {Object} categoria
	 * @param {number} categoriaid identificador de categoria
	 * @param {boolean} activo flag de disponibilidad de categoria
	 */
	static activarCategoria( categoria ) {

		this.database.update( CRUD.activarCategoria, categoria, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				console.log( error );

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear categoria';

				notificacion.show();

				return;
			}

			notificacion['title'] = 'Éxito';
			notificacion['body'] = 'Categoria actualizada con éxito';

			notificacion.show();
		});
	}

	/**
	* Obtiene el total de los categorias
	* @returns {Promise<{ totalPaginas: number, totalRegistros: number }>}
	*/
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

	/**
	 * Listar categorias
	 *
	 * @param  {Array<number>} pagination array de paginacion
	 * @return {Promise<Array<Category>>}  devuelve una promesa con los categorias paginados
	 */
	static listarCategorias( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarCategorias, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					return reject( error );
				}

				// console.log( results );
				resolve( results );
			});

		});
	}

	/**
	 * edita una categoria
	 *
	 * @param  {Category} categoria instancia de la categoria
	 * @param  {User} usuario usuario logeado
	 * @param {string| null} [imagenRegistrada] imagen registrada por el usuario
	 */
	static editarCategoria( categoria, usuario, imagenRegistrada ) {

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

				notificacion['title'] = 'Exito!!';
				notificacion['body'] = 'Categoria Actualizada';

				notificacion.show();

  		});
	}

	/**
	 * Permite buscar categorias en la BD
	 * @param  {Object} search producto a buscar
	 * @param {string} search.search cadena de busqueda del producto
	 * @return {Promise<Array<Category>>}  devuelve una promesa con los resultados encontrados
	*/
	static buscarCategoria( search ) {

		return new Promise(( resolve, reject ) => {

				this.database.find( CRUD.buscarCategoria, search, ( error, results ) => {

					const notificacion = new Notification({
						title: '',
						body: ''
					});

					if ( error ) {

						// throw error;  // mostrará el error en pantalla

						notificacion['title'] = 'Error!!';
						notificacion['body'] = 'Error al buscar categoria';

						notificacion.show();

						console.log( error );

						return reject( error );

					}

					return resolve( results );
				});
		});
	}

}

/**
 * Category
 * @typedef {Object} Category
 * @property {number} [categoriaid] identificador de categoria
 * @property {number} userid identificador de usuario
 * @property {string} nombre nombre de la categoria
 * @property {boolean} activo flag si indica que la categoria esta disponible
 * @property {string} [imagen] string base64 de la imagen
 */

module.exports = {
	CategoriasController
};
