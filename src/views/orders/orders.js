const categorias = document.querySelector('#product-category');
const products = document.querySelector('#products');
const categorySearch = document.querySelector('#category-search');

function renderListCategory() {

	categorias.innerHTML = '';

	CATEGORIAS.forEach(( categoria ) => categorias.innerHTML += `
		<li>${ categoria.nombre }</li>
	`);
}

function renderCardPorducts() {
	
	products.innerHTML = '';

	PRODUCTOS.forEach(( product ) => products.innerHTML += `
		<div class="col-12 col-sm-6 col-lg-3 card-column">
			<div class="card p-0" style="width: 15rem;">
			  <img src="https://via.placeholder.com/150" class="card-img-top p-0">
			  <div class="card-body">
			    <p class="card-text">
			    	Some quick example text to build on the card title and make up the 
			    	bulk of the card's content.
			    </p>
				</div>
			</div>
		</div>
	`);
}

function searchPorductsByCategory( $event ) {

	$event.preventDefault();

	// tecla enter = 13
	if ( $event.keyCode !== 13 ) {
		return;
	
	}

	const rexp = /^[a-z\s]+$/;	
	let value = $event.target.value.trim().toLowerCase();

	if ( !rexp.test( value ) ) {
		console.log('El valor no coincide con los parametros de búsqueda');
		return;

	}

	console.log( value );
}

categorySearch.addEventListener('keyup', searchPorductsByCategory );

document.addEventListener('DOMContentLoaded', () => {
	renderListCategory();
	renderCardPorducts();
});
	