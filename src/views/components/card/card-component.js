class CardComponent extends HTMLElement {
	constructor() {
		super();
		this.shadowDom = this.attachShadow({ mode: 'open' });
	}

	/* props observed */
	static get observedAttributes() {
		return [];
	}

	get _color() {
		return this.getAttribute('color');
	}

	set _color( value ) {
		this.setAttribute('color', value);
	}

	get _colorText() {
		return this.getAttribute('color-text');
	}

	set _colorText( value = 'black' ) {
		this.setAttribute('color-text', value);
	}

	connectedCallback() {
		fetch('components/card/card-component.html')
			.then( response => response.text() )
			.then( html => {
				this.shadowDom.innerHTML = html;
				this.render();
			})
			.catch( error => console.error( error ) );
	}

	attributeChangedCallback( name, oldValue, newValue ) {
	}

	render() {

		const template = this.shadowDom.querySelector('#card');
		const templateFragment = template.content;
		
		this.shadowDom.appendChild( templateFragment.cloneNode( true ) );

		if ( this.hasAttribute('color') ) {
			this.shadowDom.querySelector('.card-body').style.background = this._color;
		}

		if ( this.hasAttribute('color-text') ) {
			this.shadowDom.querySelector('.card-body h4').style.color = this._colorText;
		}
	}

	disconnectedCallback() {
	}
}

customElements.define('app-card', CardComponent);
	