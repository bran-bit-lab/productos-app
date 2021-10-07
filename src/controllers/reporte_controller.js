const { Notification, dialog } = require('electron');
const CRUD = require('../database/CRUD');
const { Database } = require('../database/database');

/** clase que gestiona los reportes */
class ReporteController {

	/** @type {?Database} */
	databaseInstance = null;

	/** Propiedad get database retorna una nueva instancia de la clase Database */
	static get database() {
		return this.databaseInstance || ( this.databaseInstance = new Database() );
	}

	/**
	 * Busca la totalidad de notas por categoria
	 *
	 * @param  {?Object} periodo periodo de búsqueda
	 * @param {string} periodo.from fecha de incio de búsqueda
	 * @param {string} periodo.to fecha de final de búsqueda
	 * @returns {Promise<(ResponseReport | null)>}
	 * Retorna una promesa con un objeto que contiene los valores preparados para el modelo y la tabla.
	 * Si no hay registros devuelve null.
	 */
	static buscarNotasCategoria( periodo = null ) {

		return new Promise(( resolve, reject ) => {

			const sql = periodo ? CRUD.ObtenerTotalNotasPorCategoriaPeriodo : CRUD.ObtenerTotalNotasPorCategoriaGeneral;

			this.database.consult( sql, periodo, ( error, resultados ) => {

				if ( error ) {

					const notificacion = new Notification({
						title: 'Error !!',
						body: 'Error en la consulta'
					});

					notificacion.show();

					console.log( error );

					return;
				}

				// console.log( resultados );

				if ( resultados.length > 0 ) {

					let labels = [];
					let data = [];

					for ( let obj of resultados ) {
						labels.push( obj.status );
						data.push( obj.total );
					}

					resolve({ keys: labels, values: data, results: resultados });

					return;
				}

				// En caso de que la consulta venga vacia
				resolve( null );
			});
		});
	}

	/**
	 * Busca la totalidad de notas vendidas por vendedor
	 *
	 * @param  {?Object} periodo periodo de búsqueda
	 * @param {string} periodo.from fecha de incio de búsqueda
	 * @param {string} periodo.to fecha de final de búsqueda
	 * @returns {Promise<(ResponseReport | null)>}
	 * Retorna una promesa con un objeto que contiene los valores preparados para el modelo y la tabla.
	 * Si no hay registros devuelve null.
	*/
	static buscarNotasVendidasPorVendedor( periodo = null ) {
	}


	/**
	 * Busca la totalidad de productos por categoria
	 *
	 * @returns {Promise<(ResponseReport | null)>}
	 * Retorna una promesa con un objeto que contiene los valores preparados para el modelo y la tabla.
	 * Si no hay registros devuelve null.
	 */
	static buscarTotalProductosPorCategoria() {
	}

	/**
	 * Busca la totalidad maxima vendida de cada producto
	 *
	 * @param  {?Object} periodo periodo de búsqueda
	 * @param {string} periodo.from fecha de incio de búsqueda
	 * @param {string} periodo.to fecha de final de búsqueda
	 * @returns {Promise<(ResponseReport | null)>}
	 * Retorna una promesa con un objeto que contiene los valores preparados para el modelo y la tabla.
	 * Si no hay registros devuelve null.
	*/
	static buscarCantidadMaximaVendida( periodo = null ) {
	}

	/**
	 * Busca la totalidad de productos vendidos en el anio actual
	 *
	 * @returns {Promise<(ResponseReport | null)>}
	 * Retorna una promesa con un objeto que contiene los valores preparados para el modelo y la tabla.
	 * Si no hay registros devuelve null.
	 */
	static buscarCantidadProductosVendidosAnual() {
	}

	/** Genera el PDF del reporte */
	static generateReport() {
	}

	/**
	 * funcion que permite ordenar los meses del anio segun el calendario
	 *
	 * @param  {Array<Object>} mounths recibe el array de meses del anio
	 * @returns {Array<{ id: number, mes: string, total: number }>} devuelve el listado de los meses y el total ordenados
	 */
	static orderMounths( resultados ) {

		const arrayMounth = [
			{ id: 1, name: 'enero' },
			{ id: 2, name: 'febrero' },
			{ id: 3, name: 'marzo' },
			{ id: 4, name: 'abril' },
			{ id: 5, name: 'mayo' },
			{ id: 6, name: 'junio' },
			{ id: 7, name: 'julio' },
			{ id: 8, name: 'agosto' },
			{ id: 9, name: 'septiembre' },
			{ id: 10, name: 'octubre' },
			{ id: 11, name: 'noviembre' },
			{ id: 12, name: 'diciembre' }
		];

		// transforma a instancias de arrayMounth
		let order = resultados.map(( mounth ) => {

			let find = arrayMounth.find(( mon ) => mon.name === mounth.mes );

			return {
				id:  find.id,
				mes: find.name,
				total: mounth.total
			};
		});

		// console.log( order );

		// ordena con los valores
		order = order.sort(( value, nextValue ) => {

			if ( value.id > nextValue.id ) {
				return 1;

			} else if ( value.id < nextValue.id ) {
				return -1;

			} else {
				return 0;
			}
		});

		// console.log( order );
		return order;
	}
}

/**
 * ResponseReport
 * @typedef {Object} ResponseReport
 * @property {Array<string>} keys  listado de los nombres usados en el modelo estaditico
 * @property {Array<number>} values listado de valores usados en el modelo estaditico
 * @property {Array<Object>} results listado de la consulta para generar la tabla
 */

module.exports = {
	ReporteController
};
