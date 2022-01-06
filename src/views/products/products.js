// require ambito global

const { remote } = require('electron');
const { CategoriasController, ProductosController } = remote.require('./controllers');
const Tab = require('bootstrap/js/dist/tab');
const Modal = require('bootstrap/js/dist/modal');

class ProductsComponent {

	constructor() {
		this.setHtml = this.setHtml.bind( this );

		this.productsElement = document.querySelector('#products');
		this.categoriesElement = document.querySelector('#category');

		this.setHtml(() => {

			ProductsTableComponent = require('./products-table/products-table-component');
			productsTableComponent = new ProductsTableComponent();
			
			openModalNewProduct = require('./products-form/products-form').openModalNewProduct;
			openModalEditProduct = require('./products-form/products-form').openModalEditProduct;
			handleChangeQuantity = require('./products-form/products-form').handleChangeQuantity;
			resetFormProducts = require('./products-form/products-form').resetFormProducts;

			CategoryTableComponent = require('./categories-table/categories-table-component');
			categoryTableComponent = new CategoryTableComponent();

			openModalNewCategory =  require('./categories-form/categories-form').openModalNewCategory;
			resetForm = require('./categories-form/categories-form').resetForm;
			openModalEditCategory = require('./categories-form/categories-form').openModalEditCategory;

			ModalConfirmComponent = require('../shared/modal-confirm/modal-confirm-component');

			this.setTabs();
		});

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

	setTabs() {

		// inicializamos los tabs
		const tabList = Array.from( document.querySelectorAll('#products_list button') );

		tabList.forEach( this.setOptionsTabs.bind( this ) );

		this.changeView();
	}

	setHtml( callback ) {

		Promise.all([
			fetch('./categories-form/categories-form.html').then( resp => resp.text() ),
			fetch('../shared/modal-confirm/modal-confirm-component.html').then( resp => resp.text() ),
			fetch('./products-form/products-form.html').then( resp => resp.text() ),
		]).then( async htmlArray => {

			footer.innerHTML = htmlArray.join('');

			this.productsElement.innerHTML = await fetch('./products-table/products-table-component.html').then( resp => resp.text() );
			this.categoriesElement.innerHTML = await fetch('./categories-table/categories-table-component.html').then( resp => resp.text() )

			callback();
		}).catch( error => console.error( error ) );
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

// modules dynamic load in html (no delete)
let ProductsTableComponent;
let productsTableComponent;
let openModalNewProduct, openModalEditProduct, handleChangeQuantity, resetFormProducts;


let CategoryTableComponent;
let categoryTableComponent;
let openModalNewCategory, resetForm, openModalEditCategory;

let ModalConfirmComponent;

// binding active function
let closeModalConfirm;
