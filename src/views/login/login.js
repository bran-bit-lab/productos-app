const form = document.forms['login-form'];

form.addEventListener('submit', ( $event ) => {
	
	$event.preventDefault();

	let formData = new FormData( form );
	let data = {};

	console.log( data );
});