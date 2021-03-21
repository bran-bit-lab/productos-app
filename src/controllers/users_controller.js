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

					return resolve({
						totalPaginas: Math.ceil( totalPaginas ),
						totalRegistros: totalRegistros
					}); 
				
				});

			});
		}	
			

		static async listarUsuarios( pagination ) {

			return new Promise(( resolve, reject ) => {

				pagination = { start: pagination[0], limit: pagination[1] };

				this.database.consult( CRUD.listarUsuarios, pagination, ( error, results ) => {

					if ( error ) {

						console.log( error );
						
						reject( error );
					}

					resolve( results );
				});

			});
		}

		static async cambiarRolUsuarios( usuario ) {

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

					notificacion['title'] = 'Actualizacion exitosa!!';
					notificacion['body'] = 'Usuario actualizado con exito';

					notificacion.show();
	  	});
		}

		static async cambiarEstadoUsuarios( usuario ) {

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

				notificacion['title'] = 'Actualizacion exitosa!!';
				notificacion['body'] = 'Usuario actualizado con exito';

				notificacion.show();
	  	});
		}

		static async buscarUsuarios( usuario ) {

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
						
						reject( error );
					}

					resolve( results );
				});

			});
		}

		static async login( usuario ) {
			
			//1.- si el usuario existe dentro de la bd 
			//2.- si existe el usuario pero que este activo

			console.log( usuario ) 
		
				const saltRounds = 10;
				const salt = bcrypt.genSaltSync( 10 );

				usuario['password'] = bcrypt.hashSync( usuario['password'], salt );

				console.log (usuario);
				
				return new Promise (( resolve, reject )=> {

					this.database.find( CRUD.validarUsuario, usuario, ( error, results ) => {

						const notificacion = new Notification({
							title: '',
							body: ''
						});


						if ( error ) {

							console.log( error );
							
							reject( error );
						}	
							
						if ( results.length === 0 ) {
							// length devuelve la cantidad de elementos en una matriz
							// sino lo encuentra muestra la notificacion

							notificacion['title'] = 'Error!!';
							notificacion['body'] = 'No se encontro el usuario';

							console.log("usuario no encontrado")
							
							notificacion.show();

							reject();

						} else {

							console.log("usuario encontrado")

							// bcrypt.compareSync ( usuario['password'] ,  results ) ; //  cierto 
							// bcrypt.compareSync ( " not_bacon " ,  hash ) ; //  falso 
							/*hay que coincidir las contraseñas cifradas*/
							//3.- si las contraseñas cifradas concuerdan
							
						}

					
						console.log( results );

					});
				
				});

		}	
		
}


module.exports = {
	UsersController
};
