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
		
}


module.exports = {
	UsersController
};
