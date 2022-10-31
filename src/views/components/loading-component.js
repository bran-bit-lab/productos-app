/** Clase que controla el componente de carga */
class LoadingComponent extends HTMLElement {
    constructor() {
        super();

        this.show = this._show;

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
        
        // console.log('conectado');

        this.innerHTML = (`
            <div class="back h-100 w-100 d-flex justify-content-center align-items-center position-fixed">
                <div class="cont">
                    <i class="fas fa-spinner fa-3x fa-pulse"></i>
                </div>
            </div>
        `);
    }

    /** Muestra el loading en la vista */
    render() {
        this._show === 'true' ? this.style.display = '' : this.style.display = 'none';
    }


    /**
    * Reajusta el tamano del loading para que ocupe todo el ancho de la body
    */
    setSizeLoading( resize = false ) {

        if ( resize ) {

            const body = document.querySelector('body');
            
            body.style.height = '100%';
    
            const size = {
              height: body.offsetHeight.toString() + 'px',
              width: body.offsetWidth.toString() + 'px'
            };
            
            this.style.height = size.height;
            this.style.width = size.width;
        }
      }
}

customElements.define('loading-component', LoadingComponent );