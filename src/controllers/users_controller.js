const bcrypt = require('bcryptjs');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');

class UsersController {

		static crearUsuario( usuario ) {

			const saltRounds = 10;
			const salt = bcrypt.genSaltSync( 10 ); 

			delete usuario['passwordConfirmation'];

			usuario['password'] = bcrypt.hashSync( usuario['password'], salt );

			const database = new Database();
			
			database.insert( CRUD.crearUsuario, usuario, ( error ) => {
  			
  			if ( error ) {
					throw error;  // mostrará el error en pantalla
				}

				console.log("data insertada");

				// se continua con el resto de la ejecucion ...
  		});
		}
}

module.exports = {
	UsersController
};
