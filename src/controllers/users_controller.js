const bcrypt = require('bcryptjs');
const Database = require('../database/database');
const crud = require('../database/CRUD');
console.log(crud);

class UsersController {

		static crearUsuario( usuario ) {

			const saltRounds = 10;
			const salt = bcrypt.genSaltSync ( 10 ) ; 

			delete usuario['passwordConfirmation'];

			usuario['password'] = bcrypt.hashSync( usuario['password'], salt );

			const database = new Database.Database();
			//console.log( database );

			database.insertar(crud.crearUsuario, usuario, ( error ) => {
  				
  				if (error) {
  					throw error;
  				}
  				
  				console.log("data insertada", 'desde crearUsuario controlador');
  			});
		}
}

module.exports = {
	UsersController
};
