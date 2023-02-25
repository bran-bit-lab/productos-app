/**
*  User
* @typedef {Object} User
* @property {number} [userid] identificador del usuario
* @property {string} nombre nombre del usuario
* @property {string} apellido apellido del usuario
* @property {string} correo correo del usuario
* @property {string} password contrasena del usuario
* @property {string} password_confirmation confirmacion de contrasena
*/

const bcrypt = require('bcryptjs');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron');

/** Clase estatica controlador de usuarios */
class UsersController {

	/**
	 * Instancia de Database
	 * @type {?Database}
	 */
	databaseInstance = null;

	/** Propiedad get database retorna una nueva instancia de la clase Database */
	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	/**
	* Crea un registro de usuario en la base de datos
	* @param {User} usuario
	* @example
	* await Database.crearUsuario({
	* 	nombre: 'ryan',
	* 	apellido: 'dohl',
	* 	correo: 'ryandohl@test.com'
	* 	password: '1234678'
	* 	passwordConfirmation: '12345678'
	* });
	*
	*/
	static crearUsuario( usuario ) {

		const saltRounds = 10;
		const salt = bcrypt.genSaltSync( 10 );

		delete usuario['passwordConfirmation'];

		usuario['password'] = bcrypt.hashSync( usuario['password'], salt );

		this.database.insert( CRUD.crearUsuario, usuario, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				console.log( error );
				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al crear usuario';

				notificacion.show();

				return;
			}

			notificacion['title'] = 'Registro exitoso!!';
			notificacion['body'] = 'Usuario creado con exito';

			notificacion.show();

  		});
	}

	/**
	* Obtiene el total de los usuarios
	* @returns {Promise<{ totalPaginas: number, totalRegistros: number }>}
	*/
	static obtenerTotalUsuarios() {

		return new Promise( ( resolve, reject ) => {

			this.database.getTotalRecords( CRUD.obtenerTotalUsuarios, ( error, resultado ) => {

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
	 * Lista los usuarios en forma paginada
	 * @param  {Array<number>} pagination array de numeros de la paginacion
	 * @returns {Promise<Array<User>>} Retorna una promesa con el arreglo de usuarios
	 */
	static listarUsuarios( pagination ) {

		return new Promise(( resolve, reject ) => {

			pagination = { start: pagination[0], limit: pagination[1] };

			this.database.consult( CRUD.listarUsuarios, pagination, ( error, results ) => {

				if ( error ) {

					console.log( error );

					return reject( error );
				}

				resolve( results );
			});

		});
	}

	/**
	 * Cambia el rol del usuario
	 *
	 * @param {Object} usuario  usuario a cambiar
	 * @param {number} usuario.userid identificador del usuario
	 * @param {string} usuario.rol rol del usuario
	 */
	static cambiarRolUsuarios( usuario ) {

		this.database.update( CRUD.editarRolUsuario, usuario, ( error ) => {

			const notificacion = new Notification({
				title: 'Exito',
				body: 'Usuario actualizado'
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar usuario';

				notificacion.show();

				console.log( error );

				return;
			}

			notificacion.show();
  	});
	}


	/**
	 * Permite cambiar el estado del usuario en la aplicación
	 *
	 * @param  {Object} usuario objeto de consulta
	 * @param {number} usuario.userid identificador del usuario
	 * @param {boolean} usuario.estado nuevo estado del usuario para acceder a la aplicación
	 */
	static cambiarEstadoUsuarios( usuario ) {

		this.database.update( CRUD.editarEstadoUsuario, usuario, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				//throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar usuario';

				notificacion.show();

				console.log( error );

				return;
			}

  	});
	}

	/**
	 * Permite buscar usuarios en la BD
	 * @param  {Object} usuario Usuario a buscar
	 * @param {string} usuario.search cadena de busqueda del usuario
	 * @return {Promise<Array<User>>}  devuelve una promesa con los resultados encontrados
	 * @example
	 * let users = await UsersController.buscarUsuarios({ search: '%' + search + '%' });
	 */
	static buscarUsuarios( usuario ) {

		return new Promise(( resolve, reject ) => {

			this.database.find( CRUD.buscarUsuario, usuario, ( error, results ) => {

				const notificacion = new Notification({
					title: '',
					body: ''
				});

				if ( error ) {

					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'No se encontro el usuario';

					notificacion.show();

					console.log( error );

					return reject( error );
				}

				resolve( results );
			});

		});
	}

	/**
	 * Login de la aplicación
	 *
	 * @promise login
	 * @reject {Error|string}
	 * @fulfill {User}
	 *
	 * @param  {Object} usuario Objeto de inicio de sesion
	 * @param {string} usuario.correo correo del usuario
	 * @param {string} usuario.password contraseña del usuario
	 *
	 * @returns {Promise<User>}  retorna una promesa con el usuario logeado
	 */
	static login( usuario ) {

		// 1.- si el usuario existe dentro de la bd
		// 2.- si existe el usuario pero que este activo
		// 3.- verificar las contraseñas

		return new Promise (( resolve, reject ) => {

			this.database.find( CRUD.validarUsuario, usuario, ( error, results ) => {

				const notificacion = new Notification({
					title: '',
					body: ''
				});

				if ( error ) {

					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'Error en buscar usuario';

					notificacion.show();

					// console.log( error );

					return reject( error );
				}

				if ( results.length === 0 ) {

					// length devuelve la cantidad de elementos en una matriz
					// sino lo encuentra muestra la notificacion

					notificacion['title'] = 'Atención!!';
					notificacion['body'] = 'Credenciales inválidas';

					// console.log("usuario no encontrado");

					notificacion.show();

					reject('credenciales inválidas');

				} else {

					const [ user ] = results;

					const passwordDB = user['password'];

					// compareSync devuelve un boleano el resultado de la comparación
					const match = bcrypt.compareSync( usuario['password'], passwordDB );

					if ( !match ) {

						notificacion['title'] = 'Atención!!';
						notificacion['body'] = 'Credenciales inválidas';

						notificacion.show();

						// console.log("clave invalida");

						reject('credenciales invalidas');

					} else {

						// console.log("usuario valido");

						// Se elimina la propiedad password del objeto results para la vista

						delete user['password'];
						delete user['estado'];

						resolve( user );
					}
				};

			});

		});

	}

	/**
	 * Actualiza el perfil del usuario logeado
	 *
	 * @param  {User} perfil perfil del usuario logeado
	 * @return {Promise<User>}        Una promesa con los datos del perfil actualizados
	 */
	static actualizarPerfil( perfil ) {

		return new Promise(( resolve, reject ) => {

			const saltRounds = 10;
			const salt = bcrypt.genSaltSync( 10 );

			delete perfil['passwordConfirmation'];

			perfil['password'] = bcrypt.hashSync( perfil['password'], salt );

			this.database.update( CRUD.actualizarPerfil, perfil, ( error ) => {

				let notificacion = new Notification({
					title: '',
					body: ''
				});

				if ( error ) {

					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'Error al actualizar perfil';

					console.log( error );

					notificacion.show();

					return reject( error );
				}

				notificacion['title'] = 'Exito';
				notificacion['body'] = 'Perfil del usuario actualizado';

				notificacion.show();

				delete perfil['password'];

				resolve( perfil );
			});
		});
	}
}

module.exports = {
	UsersController
};
