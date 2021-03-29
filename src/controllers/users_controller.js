const bcrypt = require('bcryptjs');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron');

class UsersController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

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

	static cambiarRolUsuarios( usuario ) {

		this.database.update( CRUD.editarRolUsuario, usuario, ( error ) => {

			const notificacion = new Notification({
				title: '',
				body: ''
			});

			if ( error ) {

				// throw error;  // mostrará el error en pantalla

				notificacion['title'] = 'Error!!';
				notificacion['body'] = 'Error al actualizar usuario';

				notificacion.show();

				console.log( error );

				return;
			}

  		});
	}

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
		
}


module.exports = {
	UsersController
};
