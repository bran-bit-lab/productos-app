// =========================
// Carga de modulos JS
// =========================

const { remote } = require('electron');
const { readFileAssets } = remote.require('./util_functions/file');
const deliveryNotes = document.querySelector('#delivery-note');

class OrdersTableComponent {
	constructor() {

		this.deliveryNotes = new Array(10).fill({
			id: 0,
			name: 'test',
			description: 'prueba de desarrollo',
			created_by: 'Gabriel Martinez',
			order_by: 'Cliente 1',
			state: 'Entregado'
		});

		this.deliveryTable = document.querySelector('#tbody-delivery-notes');
		this.searchComponent = document.querySelector('search-bar-component');

		// events
		this.searchComponent.addEventListener('search', this.searchDeliveryNote );
	}

	getAll() {
		this.render();
	}

	createDeliveryNote() {
		redirectTo('./orders-form/orders-form.html');
	}

	editDeiliveryNote( idDelivery ) {
		redirectTo('./orders-form/orders-form.html?idDelivery=' + idDelivery )
	}

	searchDeliveryNote( $event ) {
		let value = $event.detail.value;
		console.log( value );
	}

	showPDF( idDeliveryNote ) {
		// codigo que genera el PDF al usuario
	}

	setRows( deliveryNote, index ) {
		return (`
			<tr class="text-center">
				<td>${ index + 1 }</td>
				<td>${ deliveryNote.name }</td>
				<td>${ deliveryNote.description }</td>
				<td>${ deliveryNote.created_by }</td>
				<td>${ deliveryNote.order_by }</td>
				<td>${ deliveryNote.state }</td>
				<td>
				<button
					type="button"
					onclick="ordersTableComponent.editDeiliveryNote( ${ index + 1 } )"
					class="btn btn-primary btn-sm"
				>
					<i class="fas fa-edit"></i>
				</button>
				<button
					type="button"
					onclick="ordersTableComponent.showPDF( ${ index + 1 } )"
					class="btn btn-secondary btn-sm"
				>
					<i class="far fa-file-pdf"></i>
				</button>
				</td>
			</tr>
		`);
	}

	render( search = false ) {

		if ( !search ) {

			this.deliveryTable.innerHTML = '';

			let paginationElement = document.querySelector('pagination-component');

			paginationElement._limit = 1;
			paginationElement._registers = this.deliveryNotes.length;
			paginationElement._page = 1;
		}

		if ( this.deliveryNotes.length > 0 ) {

			this.deliveryTable.innerHTML = this.deliveryNotes.map( this.setRows ).join('');

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
ordersTableComponent.render();


console.log( window.history );
