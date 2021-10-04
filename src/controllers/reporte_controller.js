const { Notification } = require('electron');
const CRUD = require('../database/CRUD');
const { Database } = require('../database/database');

class ReporteController {

	databaseInstance = null;

	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	static buscarNotasCategoria( periodo = null ){

		return new Promise( ( resolve, reject ) => {
			let sql = periodo ? CRUD.ObtenerTotalNotasPorCategoriaPeriodo : CRUD.ObtenerTotalNotasPorCategoriaGeneral;

			this.database.consult( sql, periodo, ( error , resultados ) => {

				if ( error ) {

					const notificacion = new Notification({
						title: 'Error !!',
						body: 'Error en la consulta'
					});

					notificacion.show();

					console.log( error );

				} else {

					let labels = [];
					let data = [];

					// console.log(resultados);

					if ( resultados.length > 0 ){

						for ( let obj of resultados ) {
							labels.push( obj.status );
							data.push( obj.total );
						}

						resolve({
							keys: labels,
							values: data,
							results: resultados
						});

						return;
					}

					// En caso de que la consulta venga vacia
					resolve( null );
				}
			});
		});
	}
}

module.exports = {
	ReporteController
}
