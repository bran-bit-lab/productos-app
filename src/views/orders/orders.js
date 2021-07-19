// =========================
// Carga de modulos JS
// =========================

const { remote } = require('electron');
const { readFileAssets } = remote.require('./util_functions/file');
const { showLog } = remote.require('./util_functions/time');
const { NotasController } = remote.require('./controllers/notas_controller');
const deliveryNotes = document.querySelector('#delivery-note');

class OrdersTableComponent {

	constructor() {

		this.deliveryNotes = [];
		this.deliveryTable = document.querySelector('#tbody-delivery-notes');
		this.searchComponent = document.querySelector('search-bar-component');
		this.pagination = document.querySelector('#pagination-delivery');
		this.page = 1;

		// events
		this.setEvents();
		this.getAll();
	}

	setEvents() {
		this.searchComponent.addEventListener('search', this.searchDeliveryNote.bind( this ) );

		this.pagination.addEventListener('pagination', ( $event ) => {
			this.page = $event.detail.page;
			this.getAll( $event.detail.value );
		});
	}

	async getAll( pagination = [0,10] ) {

		try {

			this.deliveryNotes = await NotasController.listarNotas( pagination );

			const totalOrders = await NotasController.obtenerTotalNotas();

			setPaginationStorage('notesTable', { pagination });

			console.log( totalOrders );
			this.render( totalOrders.totalPaginas, totalOrders.totalRegistros );
		}

		catch ( error ) {

			console.error( error );
		}

	}

	createDeliveryNote() {
		redirectTo('./orders-form/orders-form.html');
	}

	editDeiliveryNote( idDelivery ) {
		redirectTo('./orders-form/orders-form.html?idDelivery=' + idDelivery )
	}

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

	showPDF( idDeliveryNote ) {
		// codigo que genera el PDF al usuario
	}

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

	getName( name = '', surname = '' ) {

		if ( name.length > 0 && surname.length > 0 ) {
			return name + ' ' + surname;
		}

		return 'No disponible'
	}

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
}

const ordersTableComponent = new OrdersTableComponent();
