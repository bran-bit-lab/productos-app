// web components ( componente de busqueda )
class SearchBarComponent extends HTMLElement {

  constructor() {
    super();

    this.handleChangeInput = this.handleChangeInput.bind( this );

    // reglas al desarrollar componentes personalizados:

    /*
       1.- Una llamada sin parámetros a super () debe ser la primera declaración en
       el cuerpo del constructor, para establecer la cadena de prototipos correcta y
       este valor antes de ejecutar cualquier código adicional.

       2.- Una declaración de retorno no debe aparecer en ningún lugar dentro del cuerpo del constructor,
       a menos que sea un retorno anticipado simple (devolver o devolver esto).

       3.- El constructor no debe utilizar los métodos document.write () o document.open ().

       4.- Los atributos y elementos secundarios del elemento no deben inspeccionarse, ya que en el caso
       de que no se actualice ninguno estará presente, y depender de las actualizaciones hace que el
       elemento sea menos utilizable.

       5.- El elemento no debe obtener ningún atributo o hijo, ya que esto viola las expectativas de los consumidores
       que utilizan los métodos createElement o createElementNS.

       6.- En general, el trabajo debe posponerse a connectedCallback tanto como sea posible, especialmente el trabajo
       que implica la obtención de recursos o la renderización. Sin embargo, tenga en cuenta que se puede llamar a
       connectedCallback más de una vez, por lo que cualquier trabajo de inicialización que sea realmente
       único necesitará una protección para evitar que se ejecute dos veces.

       7.- En general, el constructor debe usarse para configurar el estado inicial y los valores predeterminados,
       y para configurar detectores de eventos y posiblemente una raíz oculta.

       8.- Varios de estos requisitos se verifican durante la creación del elemento, ya sea directa o indirectamente,
       y no seguirlos dará como resultado un elemento personalizado que el analizador o las API DOM no pueden instanciar.
       Esto es cierto incluso si el trabajo se realiza dentro de una microtarea iniciada por el constructor,
       ya que un punto de control de microtareas puede ocurrir inmediatamente después de la construcción.
    */
  }

  handleChangeInput( $event ) {

    let event = new CustomEvent('search', {
      detail: {
        from: this.from,
        value: $event.target.value
      },
      bubbles: true,
      cancel: true
    });

    this.dispatchEvent( event );
  }

  connectedCallback() {

    this.from = this.getAttribute('from') || '';

    this.appendChild( this.getHtml() );

    this.querySelector('input').addEventListener('input', this.handleChangeInput );
  }

  disconnectedCallback() {
    this.querySelector('input').removeEventListener('input', this.handleChangeInput );
  }

  getHtml() {
    
    let range = document.createRange();
    let nodeHTML = range.createContextualFragment(
      (`
        <div class="row justify-content-end">
          <div class="form-group w-25 p-0">
            <input type="text" placeholder="Buscar ..." class="form-control form-control-sm" />
          </div>
        </div>
      `)
    );

    return nodeHTML;
  }
}

customElements.define('search-bar-component', SearchBarComponent );
