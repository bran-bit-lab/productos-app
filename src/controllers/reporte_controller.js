const { Notification, dialog, BrowserWindow, ipcMain } = require('electron');
const CRUD = require('../database/CRUD');
const { Database } = require('../database/database');
const FILE = require('../util_functions/file');
const TIME = require('../util_functions/time');
const { ENV } = require('../env');
const { PdfController } = require('./pdf_controller');

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

					reject( error );

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

					resolve({ 
						typeChart: 'pie', 
						keys: labels, 
						values: data, 
						results: resultados,
						name_consult: 'buscarNotasCategoria'
					});

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

		return new Promise(( resolve, reject ) => {

			const sql =  periodo ? CRUD.ObtenerNotasPorVendedorPeriodo : CRUD.ObtenerNotasPorVendedorGeneral;

			this.database.consult( sql, periodo, ( error, resultados ) => {

				if ( error ) {

					const notificacion = new Notification({
						title: 'Error',
						body: 'Error de la consulta !!'
					});

					notificacion.show();

					console.log( error );

					reject( error );

					return;
				}

				if ( resultados.length > 0 ) {

					let values = [];
					let data = [];

					for ( let obj of resultados ) {
						values.push( obj.cantidad_notas );
						data.push( obj.nombre_vendedor );
					}

					resolve({ 
						typeChart: 'bar', 
						keys: data, 
						values, 
						results: resultados,
						name_consult: 'buscarNotasVendidasPorVendedor'
					});

					return;
				}

				resolve( null );
			});
		});
	}


	/**
	 * Busca la totalidad de productos por categoria
	 *
	 * @returns {Promise<(ResponseReport | null)>}
	 * Retorna una promesa con un objeto que contiene los valores preparados para el modelo y la tabla.
	 * Si no hay registros devuelve null.
	 */
	static buscarTotalProductosPorCategoria() {

		return new Promise(( resolve, reject ) => {

			this.database.consult( CRUD.ObtenerTotalProductosPorCategoria, null, ( error, resultados ) => {

				if ( error ) {

					const notificacion = new Notification({
						title: 'Error',
						body: 'Error de la consulta !!'
					});

					notificacion.show();

					console.log( error );

					reject( error );

					return;
				}

				if ( resultados.length > 0 ) {

					let values = [];
					let data = [];

					for ( let obj of resultados ) {
						data.push( obj.categoria );
						values.push( obj.cantidad_productos );
					}

					resolve({ 
						typeChart: 'pie', 
						keys: data, 
						values,
						results: resultados,
						name_consult: 'buscarTotalProductosPorCategoria'
					});

					return;
				}

				resolve( null );
			});
		});
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
			
		return new Promise(( resolve, reject ) => {
			
			const sql = periodo ? CRUD.ObtenerCantidadMaximaVendidaPeriodo : CRUD.ObtenerCantidadMaximaVendidaGeneral;

			this.database.consult( sql, periodo, ( error, resultados ) => {
				
				if ( error ) {

					const notificacion = new Notification({
						title: 'Error',
						body: 'Error de la consulta !!'
					});

					notificacion.show();

					console.log( error );

					reject( error );

					return;
				}

				if ( resultados.length > 0 ) {

					let values = [];
					let data = [];

					for ( let obj of resultados ) {
						data.push( obj.nombre );
						values.push( obj.cantidad_max_vendida );
					}

					resolve({ 
						typeChart: 'bar', 
						keys: data, 
						values, 
						results: resultados, 
						name_consult: 'buscarCantidadMaximaVendida'
					});

					return;
				}

				resolve( null );
			});
		});
	}

	/**
	 * Busca la totalidad de productos vendidos en el anio actual
	 *
	 * @returns {Promise<(ResponseReport | null)>}
	 * Retorna una promesa con un objeto que contiene los valores preparados para el modelo y la tabla.
	 * Si no hay registros devuelve null.
	 */
	static buscarCantidadProductosVendidosAnual() {
		return new Promise(( resolve, reject ) => {
			
			this.database.consult( CRUD.ObtenerCantidadVendidoAnual, null, ( error, queries ) => {

				if ( error ) {
					
					const notificacion = new Notification({
						title: 'Error',
						body: 'Error en el consulta en la BD!!'
					});

					notificacion.show();

					console.log( error );

					reject( error );

					return;
				}

				const resultados = ReporteController.ordenarMeses( queries[1] );

				if ( resultados.length > 0 ) {
					
					let values = [];
					let data = [];

					for ( let obj of resultados ) {
						data.push( obj.mes );
						values.push( obj.total );
					}

					resolve({ 
						typeChart: 'line', 
						keys: data, 
						values, 
						results: resultados, 
						name_consult: 'buscarCantidadProductosVendidosAnual'
					});

					return;
				}

				resolve( null );
			});
		});
	}

	/**
	 * Permite ordenar los meses del año, según el calendario
	 *
	 * @param  {Array<Object>} resultados array de los resultaods de la base de datos
	 * @returns {Array<{ id: number, mes: string, total: number }>} devuelve el listado de los meses y el total ordenados
	 */
	static ordenarMeses( resultados ) {

		const arrayMeses = [
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

		// transforma a instancias de arrayMeses
		let order = resultados.map(( mounth ) => {

			let find = arrayMeses.find(( mon ) => mon.name === mounth.mes );

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

	/**
	 * Funcion que genera el reporte estadistico
	 * @param {Array<ResponseReport>} consults consultas generadas
	 * @returns {Promise<void>} retorna una promesa que se resolvera cuando finalice el reporte
	 */
	static generarReporte( consults ) {

		return new Promise(( resolve, reject ) => {

			const pdfController = new PdfController(); // creas un objeto PDF controller
			
			// genera la fecha del reporte
			let date = TIME.dateSpanish();

			const options = {
				title : 'Guardar Archivo',
				buttonLabel : 'Guardar' ,
				filters : [{ name: 'pdf', extensions: ['pdf'] }],
				defaultPath: FILE.getHomePath('reporte_' + date )
			};

			const notificacion = new Notification({
				title: 'Éxito',
				body: 'Documento generado con éxito'
			});

			dialog.showSaveDialog( null, options )
				.then( async ( response ) => {
					
					/*	Documentación
					*  response == { canceled: boolean,  filePath: string }
					*  extensions = 'extensiones permitidas'
					*/

					const extensions = ['.pdf'];

					if ( response['canceled'] ) {

						reject({ error: 'cancelled' });

						return;
					}

					// verifica la extension del archivo que sea pdf
					if ( !response['filePath'].includes( extensions[0] ) ) {

						notificacion['title'] = 'Error !!';
						notificacion['body'] = 'Extension del archivo no valida';

						notificacion.show();

						// console.log( response['filePath'] );

						reject({ error: 'extension not valid' });

						return;
					}
				
					consults = await ReporteController.getImageBuffer( consults );
					
					// console.log( consults );

					const data = await pdfController.crearReporte( consults );

					if( FILE.checkAsset( response['filePath'], false ) ){
						FILE.deleteFileSync( response['filePath'] );
					}

					FILE.appendFile( response['filePath'], data, ( error ) => {

						if ( error ) {

							console.log( error );

							notificacion['title'] = 'Error!!';
							notificacion['body'] = 'Error al guardar archivo';

							notificacion.show();

							// throw error;

							reject({ error });

							return;
						}

						notificacion.show();

						resolve();
					});
				})
				.catch(( error ) => {
					console.log( error );

					reject( error );
				});
		});
	}

	/**
	 * Obtiene los datos de las imagenes antes de ser generados en el PDF
	 * @param {Array<ResponseReport>} consults  listado de consultas estadisticas
	 * @returns {Promise<Array<ResponseReport>>} Devuelve el mismo listado pero con los datos en buffer de las imagenes
	 * cargados para el diseno PDF
	 */
	static getImageBuffer( consults ) {

		return new Promise(( resolve ) => {

			/**
			 * Para obtener los datos en buffer se necesita que todas las estadisticas
			 * esten conectadas al DOM para ello se crea una ventana modal nueva para poder generar los elementos 
			 * y registrar las imagenes en el buffer.
			 */
	
			let window = new BrowserWindow({
				width: 400,
				height: 300,
				show: false,
				webPreferences: {
					nodeIntegration: true
				}
			});
	
			window.loadFile( FILE.formatUrl( ENV.PATH_VIEWS, 'reports/reports-pdf/reports-pdf.html' ) );
	
			const contents = window.webContents;
			
			// entrada al dom oculto
			
			contents.on('did-finish-load', () => {
				contents.send( 'consults', consults );
			});
	
			// recibe los datos en el buffer
			ipcMain.on('receiveBuffer', ( $event, consultsWindow ) => {
				
				// se valida la instancia de window
				if ( window ) {

					window.close();

					// se limpia la variable de la ventana una vez cerrada para evitar sobrecarga de memoria
					window = null;
				}

				// console.log( consultsWindow );

				resolve( consultsWindow );
			});	
		});
	}
}

/**
 * ResponseReport
 * @typedef {Object} ResponseReport
 * @property {Array<string>} keys  listado de los nombres usados en el modelo estaditico
 * @property {Array<number>} values listado de valores usados en el modelo estaditico
 * @property {Array<Object>} results listado de la consulta para generar la tabla
 * @property {string} typeChart tipo de diagrama usado para generar los reporte
 * @property {string} name_consult nombre de la consulta
 * @property {Uint8Array} [buffer] datos en bruto de la imagen, este campo se usa al dibujar en el PDF
 * @property {string} [chart] imagen base64 del diagrama
 */

module.exports = {
	ReporteController
};
