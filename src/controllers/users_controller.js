const bcrypt = require('bcryptjs');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron')

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
					title:'',
					body:''
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

					console.log("data insertada");
	  		});
		}


		static obtenerTotalUsuarios() {

			return new Promise( ( resolve, reject ) => {

				this.database.getTotalRecords( CRUD.obtenerTotalUsuarios, ( error, resultado ) => {
					const notificacion = new Notification({
						title: 'Error en registros',
						body: 'No se pudo obtener el total de registros'
					});

					if ( error ) {

						notificacion.show();

						console.log( error );

						return reject({
							totalPaginas: 0
						});
					}
					
					const totalRegistros = resultado[0]['COUNT(*)'];

					let totalPaginas = (totalRegistros / 10 );

					return resolve({
						totalPaginas: Math.ceil(totalPaginas),
						totalRegistros: totalRegistros
					}); 
				});
			});
		}	
			

		static async listarUsuarios( pagination ) {

			try {

				let response = await this.database.consult( CRUD.listarUsuarios, pagination );

				return response;

			} catch ( error ) {

				console.log( error );

				return [];
			};
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

					console.log("actualizacion realizada");
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

					console.log("actualizacion realizada");
	  	});
		}
}


module.exports = {
	UsersController
};
