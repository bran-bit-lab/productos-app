/** Clase que controla el componente de carga */
class LoadingComponent extends HTMLElement {
    constructor() {
        super();
        this.render = this.render.bind( this );
    }

    /** getter que observa las propiedades del componente 
     * @returns {Array<string>} retorna las propiedades observadas
    */
    static get observedAttributes() {
        return ['show'];
    }

    /**
     * permite establecer la propiedad show del loading
     * @param {string} show flag de carga
     * @example
     * const loadingComponent = document.querySelector('loading-component');
     * 
     * loadingComponent._show = 'true';  // setter
     * 
     * let flag = loadingComponent._show;  // getter return 'true'
     */
    set _show( show = 'false' ) {
        this.setAttribute( 'show', show );
    }

    /** 
     * Devuelve el estado de la propiedad show
     * @returns {string} retorna el valor del atributo
     */
    get _show() {
        return this.getAttribute('show');
    }

    /**
     * Escucha los cambios de las propiedades observadas
     * @param {string} name nombre de la propiedad 
     * @param {string} oldValue antiguo valor a modificar 
     * @param {string} newValue nuevo valor a modificar
     */
    attributeChangedCallback( name, oldValue, newValue ) {

        // console.log({ name, oldValue, newValue });
    
        if ( oldValue !== newValue ) {
          this[name] = newValue;
          
          this.render();
        }
    }

    /** Callback que conecta al DOM */
    connectedCallback() {
        this.innerHTML = (`
            <div class="back h-100 w-100 d-flex justify-content-center flex-column align-items-center position-fixed">
                <i class="fas fa-spinner fa-4x fa-pulse"></i>
                <p class="text-white m-0 pt-3">Cargando ...</p>   
            </div>
        `);
    }

    /** Muestra el loading en la vista */
    render() {
        this._show === 'true' ? this.style.display = '' : this.style.display = 'none';
    }
}

customElements.define('app-loading', LoadingComponent );