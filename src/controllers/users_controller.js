const bcrypt = require('bcrypt');


class UsersController {
		
		static crearUsuario(usuario) {
						
			const saltRounds = 10;
			const salt = bcrypt.genSaltSync(saltRounds);

			delete usuario['passwordConfirmation'];

			usuario['password'] = bcrypt.hashSync( usuario['password'], salt );

			console.log(usuario);
		}
}


module.exports = {
	UsersController
};