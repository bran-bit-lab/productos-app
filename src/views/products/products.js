// require ambito global

const { remote } = require('electron');
const { CategoriasController, ProductosController } = remote.require('./controllers');
const Tab = require('bootstrap/js/dist/tab');
const Modal = require('bootstrap/js/dist/modal');
const ProductsTableComponent = require('./products-table/products-table-component');
const CategoryTableComponent = require('./categories-table/categories-table-component');

class ProductsComponent {

	constructor() {
		this.setHtml = this.setHtml.bind( this );

		this.loading = document.querySelector('app-loading');
		this.productsElement = document.querySelector('#products');
		this.categoriesElement = document.querySelector('#category');

		// this.loading._show = 'true';

		this.setHtml(() => {

			productsTableComponent = new ProductsTableComponent();
			
			openModalNewProduct = require('./products-form/products-form').openModalNewProduct;
			openModalEditProduct = require('./products-form/products-form').openModalEditProduct;
			handleChangeQuantity = require('./products-form/products-form').handleChangeQuantity;
			resetFormProducts = require('./products-form/products-form').resetFormProducts;

			categoryTableComponent = new CategoryTableComponent();

			openModalNewCategory =  require('./categories-form/categories-form').openModalNewCategory;
			resetForm = require('./categories-form/categories-form').resetForm;
			openModalEditCategory = require('./categories-form/categories-form').openModalEditCategory;

			ModalConfirmComponent = require('../shared/modal-confirm/modal-confirm-component');

			// inciamos los eventos del exportador
			this.exportElement = document.querySelector('app-export');
			this.exportElement.addEventListener('export-data', event => {
				
				const { nameEvent } = event.detail;

				if ( nameEvent === 'import-file' ) {
					this.importProducts();
					return;
				}

				this.exportProducts();
			});

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
			fetch('products/categories-form/categories-form.html').then( resp => resp.text() ),
			fetch('shared/modal-confirm/modal-confirm-component.html').then( resp => resp.text() ),
			fetch('products/products-form/products-form.html').then( resp => resp.text() ),
		])
		.then( async htmlArray => {

			footer.innerHTML = htmlArray.join('');

			this.productsElement.innerHTML = await fetch('products/products-table/products-table-component.html').then( resp => resp.text() );
			this.categoriesElement.innerHTML = await fetch('products/categories-table/categories-table-component.html').then( resp => resp.text() )

			callback();	
		})
		.catch( error => console.error( error ) )
		.finally(() => setTimeout( () => this.loading._show = 'false', 1000 ) );
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

	importProducts() {
		console.log('import products');
	}

	exportProducts() {
		console.log('export products');
	}
}
/** @type {ProductsComponent}  */
const productsComponent = new ProductsComponent();

// modules dynamic load in html (no delete)

/** @type {ProductsTableComponent} */
let productsTableComponent;
let openModalNewProduct, openModalEditProduct, handleChangeQuantity, resetFormProducts;

/** @type {CategoryTableComponent} */
let categoryTableComponent;
let openModalNewCategory, resetForm, openModalEditCategory;

let ModalConfirmComponent;

// binding active function
let closeModalConfirm;
