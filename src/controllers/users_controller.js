const bcrypt = require('bcryptjs');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');
const { Notification } = require('electron')


class UsersController {
		

		static crearUsuario( usuario ) {

			const saltRounds = 10;
			const salt = bcrypt.genSaltSync( 10 ); 

			delete usuario['passwordConfirmation'];

			usuario['password'] = bcrypt.hashSync( usuario['password'], salt );

			const database = new Database();
			
			database.insert( CRUD.crearUsuario, usuario, ( error ) => {
  			
				const notificacion = new Notification({
					title:'',
					body:''
				});
	  			
	  			if ( error ) {
					//throw error;  // mostrará el error en pantalla
						
					notificacion['title'] = 'Error!!';
					notificacion['body'] = 'Error al crear usuario';
						
					notificacion.show();
					return;
				}

					notificacion['title'] = 'Registro exitoso!!';
					notificacion['body'] = 'Usuario creado con exito';
						
					notificacion.show();
					
					console.log("data insertada");
					// se continua con el resto de la ejecucion ...
	  		});
		}

		static async listarUsuarios() {

			const database = new Database();

			try{
				
				let respond = await database.consult(CRUD.listarUsuarios);
				
				console.log(respond);
				
				return respond;

			} catch( error ){
				
				throw error;

			};
		}
}








module.exports = {
	UsersController
};
