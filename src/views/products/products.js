// require ambito global

const { remote } = require('electron');
const { readFileAssets, readFileImageAsync } = remote.require('./util_functions/file');
const { CategoriasController } = remote.require('./controllers/categorias_controller');
const { ProductosController } = remote.require('./controllers/productos_controllers');

const productsElement = document.querySelector('#products');
const categoriesElement = document.querySelector('#category');
const footer = document.querySelector('#footer');

// load tables
productsElement.innerHTML = readFileAssets( '/products/products-table/products-table-component.html' );
categoriesElement.innerHTML = readFileAssets( '/products/categories-table/categories-table-component.html' );

// load modals
footer.innerHTML = readFileAssets('/products/categories-form/categories-form.html');
footer.innerHTML += readFileAssets( '/shared/modal-confirm/modal-confirm-component.html' );
footer.innerHTML += readFileAssets('/products/products-form/products-form.html');

const Tab = require('bootstrap/js/dist/tab');
const Modal = require('bootstrap/js/dist/modal');

const ProductsTableComponent = require('./products-table/products-table-component');
const { openModalNewProduct, openModalEditProduct, handleChangeQuantity, resetFormProducts } = require('./products-form/products-form');

const CategoryTableComponent = require('./categories-table/categories-table-component');
const { openModalNewCategory, openImageDialog, resetForm, openModalEditCategory } = require('./categories-form/categories-form');

const ModalConfirmComponent = require('../shared/modal-confirm/modal-confirm-component');

class ProductsComponent {

	constructor() {
		this.setHtml = this.setHtml.bind( this );
	}

	changeView( view = 'products' ) {

		const elementsCategory = document.querySelectorAll('.category');
		const elementsProducts = document.querySelectorAll('.products');

		switch ( view ) {

			case 'category': {  // cuando cambias realiza la consulta

				elementsCategory.forEach( ( elementHTML ) => showElement( elementHTML ) );
				elementsProducts.forEach( ( elementHTML ) => hideElement( elementHTML ) );

				// se hace la consulta antes de renderizar

				categoryTableComponent.getAll( null, getPaginationStorage('categoriesTable') );

				break;
			}

			default: {

				elementsProducts.forEach( ( elementHTML ) => showElement( elementHTML ) );
				elementsCategory.forEach( ( elementHTML ) => hideElement( elementHTML ) );

				productsTableComponent.getAll( null, getPaginationStorage('productsTable') )

				break;
			}
		}
	}

	setHtml( path ) {

		const tabList = Array.from( document.querySelectorAll('#products_list button') );

		tabList.forEach( this.setOptionsTabs.bind( this ) );

		this.changeView();
	}


	setOptionsTabs( elementTab ) {

		let tabTrigger = new Tab( elementTab );

		elementTab.addEventListener('click', ( $event ) => {

			let nameTab = elementTab.getAttribute('aria-name');

			tabTrigger.show();

			this.changeView( nameTab );

			$event.preventDefault();
		});
	}

}

const productsComponent = new ProductsComponent();
const productsTableComponent = new ProductsTableComponent();
const categoryTableComponent = new CategoryTableComponent();

// binding active function
let closeModalConfirm = null;

// custom Events
document.addEventListener('DOMContentLoaded', productsComponent.setHtml );

// search-bar
for ( let element of document.querySelectorAll('search-bar-component') ) {

	element.addEventListener('search', ( $event ) => {

		if ( $event.detail.from  === 'categories' ) {
			categoryTableComponent.searchCategories.call( categoryTableComponent, $event.detail.value )

		} else {
			productsTableComponent.searchProducts.call( productsTableComponent, $event.detail.value )

		}
	});
}

// pagination
for ( let element of document.querySelectorAll('pagination-component') ) {

	element.addEventListener('pagination', ( $event ) => {

		if ( $event.detail.from === 'categories' ) {
			categoryTableComponent.getAll( null, $event.detail.value, $event.detail.page );

		} else {
			productsTableComponent.getAll( null, $event.detail.value, $event.detail.page );

		}
	});
}
