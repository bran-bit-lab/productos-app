const Tooltip = require('bootstrap/js/dist/tooltip');

class NavbarLoginComponent extends HTMLElement {
	constructor() {
		super();
	}

	/* props observed */
	static get observedAttributes() {
		return [];
	}

	connectedCallback() {
		fetch('components/navbar-login/navbar-login-component.html')
			.then( response => response.text() )
			.then( html => {
				this.innerHTML = html;
				this.render();
			})
			.catch( error => {
				console.error( error ); 
			});
	}

	attributeChangedCallback( name, oldValue, newValue ) {
	}

	render() {
		// inicializa los tooltips
		this.tooltips = Array.from( this.querySelectorAll('[data-bs-toggle="tooltip"]') );
		this.tooltips = this.tooltips.map(( element ) => new Tooltip( element ) );
		
		// console.log( getUserLogged() );
	}

	disconnectedCallback() {
	}
}

customElements.define('app-navbar', NavbarLoginComponent);
	