const categorias = document.querySelector('#product-category');
const products = document.querySelector('#products');

function renderListCategory() {

	categorias.innerHTML = '';

	CATEGORIAS.forEach(( categoria ) => categorias.innerHTML += `
		<li>${ categoria.nombre }</li>
	`);
}

function renderCardPorducts() {
	
	products.innerHTML = '';

	PRODUCTOS.forEach(( product ) => products.innerHTML += `
		<div class="card p-0" style="width: 15rem;">
		  <img src="https://via.placeholder.com/150" class="card-img-top p-0">
		  <div class="card-body">
		    <p class="card-text">
		    	Some quick example text to build on the card title and make up the 
		    	bulk of the card's content.
		    </p>
			</div>
		</div>
	`);
}

document.addEventListener('DOMContentLoaded', () => {
	renderListCategory();
	renderCardPorducts();
});
	