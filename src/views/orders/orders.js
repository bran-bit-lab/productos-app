// =========================
// Carga de modulos JS
// =========================

const { remote } = require('electron');
const { showLog } = remote.require('./util_functions/time');
const { NotasController } = remote.require('./controllers');
const deliveryNotes = document.querySelector('#delivery-note');

/** Clase de tabla notas de entrega */
class OrdersTableComponent {

	constructor() {

		this.deliveryNotes = [];
		this.loading = document.querySelector('app-loading');
		this.deliveryTable = document.querySelector('#tbody-delivery-notes');
		this.searchComponent = document.querySelector('search-bar-component');
		this.pagination = document.querySelector('#pagination-delivery');
		this.page = 1;

		// events
		this.setEvents();
		this.getAll();

		setTimeout( () => this.loading._show = 'false', 1000 );
	}

	/** establece los eventos */
	setEvents() {
		this.searchComponent.addEventListener('search', this.searchDeliveryNote.bind( this ) );

		this.pagination.addEventListener('pagination', ( $event ) => {
			this.page = $event.detail.page;
			this.getAll( $event.detail.value );
		});

		// inciamos los eventos del exportador
		this.exportElement = document.querySelector('app-export');
		this.exportElement.addEventListener('export-data', event => {
			const { nameEvent } = event.detail;

			if ( nameEvent === 'import-file' ) {
				this.importNotes();
				return;
			}

			this.exportNotes();
		});
	}

	/**
	 * obtiene todas las notas
	 * @param  {Array<number>} pagination paginacion
	 */
	async getAll( pagination = [0,10] ) {

		try {

			this.deliveryNotes = await NotasController.listarNotas( pagination );
			const totalOrders = await NotasController.obtenerTotalNotas();

			setPaginationStorage('notesTable', { pagination });

			// console.log( totalOrders );
			this.render( totalOrders.totalPaginas, totalOrders.totalRegistros );
		}

		catch ( error ) {

			console.error( error );
		}

	}

	/** redirecciona al formulario de notas al crear una nota */
	createDeliveryNote() {
		redirectTo('orders/orders-form/orders-form.html');
	}


	/**
	 * redirecciona al formulario de notas pasandole el id de la nota
	 * @param  {number} idDelivery identificador de la nota
	 */
	editDeiliveryNote( idDelivery ) {
		redirectTo('orders/orders-form/orders-form.html?idDelivery=' + idDelivery )
	}

	/**
	 * Busca las notas en la BD.
	 * @param {*} $event evento de formulario
	*/
	async searchDeliveryNote( $event ) {

		const search = $event.detail.value;
		const rexp = /^[\w-\d\s]+$/;

		if ( search.length === 0 ) {

		  let { pagination } = JSON.parse( sessionStorage.getItem('notesTable') );

		  this.getAll( pagination );

		  return;
		}

		if ( !rexp.test( search ) ) {

		  console.log('no concuerda con expresion regular');

		  return;
		}

		this.deliveryNotes = await NotasController.buscarNota({ search: '%' + search + '%' });

		console.log( this.deliveryNotes );

		this.render( null, null, true );
	}


	/**
	 * Genera el archivo pdf de la nota de entrega
	 * @param  {number} idDeliveryNote identificador de la nota
	 */
	showPDF( idDeliveryNote ) {
		NotasController.generarPDFNota( idDeliveryNote );
	}


	/**
	 * establece las filas de la tabla de notas
	 * @param  {Note} deliveryNote instancia de la nota
	 * @param  {number} index indice de la tabla
	 */
	setRows( deliveryNote, index ) {

		return (`
			<tr class="text-center">
				<td>${ deliveryNote.id_nota }</td>
				<td>${ deliveryNote.descripcion_nota }</td>
				<td>${ this.getName( deliveryNote.nombre_usuario, deliveryNote.apellido_usuario ) }</td>
				<td>${ deliveryNote.nombre_cliente }</td>
				<td>${ deliveryNote.status }</td>
				<td>
				<button
					type="button"
					onclick="ordersTableComponent.editDeiliveryNote( ${ deliveryNote.id_nota } )"
					class="btn btn-primary btn-sm"
				>
					<i class="fas fa-edit"></i>
				</button>
				<button
					type="button"
					onclick="ordersTableComponent.showPDF( ${ deliveryNote.id_nota } )"
					class="btn btn-secondary btn-sm"
				>
					<i class="far fa-file-pdf"></i>
				</button>
				</td>
			</tr>
		`);
	}

	/**
	 * obtiene el nombre del usuario
	 *
	 * @param  {string} name   nombre del usuario
	 * @param  {string} surname apellido del usuario
	 * @returns {string} obtiene el nombre concatenado
	 */
	getName( name = '', surname = '' ) {

		if ( name.length > 0 && surname.length > 0 ) {
			return name + ' ' + surname;
		}

		return 'No disponible'
	}


	/**
	 * renderiza la tabla notas de entrega
	 *
	 * @param  {?number} totalPages  total de paginas
	 * @param  {?number} totalRegisters total de registros
	 * @param  {boolean} search flag de actualizacion de paginacion
	 */
	render( totalPages = 0, totalRegisters = 0, search = false ) {

		if ( !search ) {

			this.deliveryTable.innerHTML = '';
			this.pagination._limit = totalPages;
			this.pagination._registers = totalRegisters;
			this.pagination._page = this.page;
		}

		if ( this.deliveryNotes.length > 0 ) {

			this.deliveryTable.innerHTML = this.deliveryNotes.map(
				this.setRows.bind( this )
			).join('');

		} else {

			this.deliveryTable.innerHTML = (`
				<tr class="text-center">
					<td colspan="8" class="text-danger">
							No existen registros de notas de entregas disponibles
					</td>
				</tr>
			`);
		}
	}

	importNotes() {
		console.log('import notes');
	}

	exportNotes() {
		console.log('export notes');
	}
}

/** @type {OrdersTableComponent} */
const ordersTableComponent = new OrdersTableComponent();
