const Modal = require('bootstrap/js/dist/modal');

class ModalComponent extends HTMLElement {
	
	modalInstance = null;
	shadowDom = null;

	constructor() {
		super();
		this.shadowDom = this.attachShadow({ mode: 'open' });
	}

	/* props observed */
	static get observedAttributes() {
		return ['open'];
	}

	get _open() {
		return this.getAttribute('open') === 'true';
	}

	set _open( value ) {
		this.setAttribute('open', value );
	}

	connectedCallback() {
		fetch('components/modal/modal-component.html')
			.then( response => response.text() )
			.then( html => {
				this.shadowDom.innerHTML = html;
				this.render();
			});
	}

	attributeChangedCallback( name, oldValue, newValue ) {
		
		if ( oldValue === newValue ) {
			return;
		}

		// controla la apertura y cierre del modal
		if ( this._open ) {
			this.modalInstance.show();

		} else {
			this.modalInstance.hide();

		}
	}

	render() {

		const template = this.shadowDom.querySelector('#modal');
		const templateFragment = template.content;


		this.shadowDom.appendChild( templateFragment.cloneNode( true ) );

		// modal instance
		this.modalInstance = new Modal( this.shadowDom.querySelector('.modal') );
		console.log( this.modalInstance );


		// buttons
		const buttons = this.querySelectorAll('.close');
		
		for ( const button of buttons ) {
			button.addEventListener('click', () => {
				this._open = false;
			});
		}

		this._open = false;
	}

	disconnectedCallback() { 
		this.modalInstance.dispose();
	}
}

customElements.define( 'app-modal', ModalComponent );
	