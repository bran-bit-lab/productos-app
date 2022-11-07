class ModalComponent extends HTMLElement {
	
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

		this[name] = newValue;

		// console.log({ name, oldValue, newValue });
		console.log( this._open );

		// controla la apertura y cierre del modal
		if ( this._open ) {
			const modalContainer = this.shadowDom.querySelector('.modal-container');

			console.log(modalContainer);			


            if ( modalContainer.classList.contains('fade-animation-in') ) {
                modalContainer.classList.replace('fade-animation-out', 'fade-animation-in');
                
            } else {
                modalContainer.classList.add('fade-animation-in');
                
            }
            
            modalContainer.style.display = 'flex';

		} else {
			

            if ( modalContainer.classList.contains('fade-animation-out') ) {
                modalContainer.classList.replace('fade-animation-in', 'fade-animation-out');
            
            } else {
                modalContainer.classList.add('fade-animation-out');
            }
            
            setTimeout(() => {
                modalContainer.style.display = 'none';
            }, 150 );
		}
	}

	render() {

		const template = this.shadowDom.querySelector('#modal');
		const templateFragment = template.content;

		this.shadowDom.appendChild( templateFragment.cloneNode( true ) );

		this._open = true;
	}

	disconnectedCallback() { 
	}
}

customElements.define( 'app-modal', ModalComponent );
	