class ReportsComponent {
  constructor() {
    this.form = document.forms['form-estadistics'];
    this.productQuestions = this.form.querySelector('#product-questions');
    this.deliveryQuestions = this.form.querySelector('#delivery-questions');
    this.period = this.form.querySelector('#from-until');

    this.handleChangeBusiness = this.handleChangeBusiness.bind( this );
    this.setEvents();
  }

  setEvents() {
    this.form.addEventListener('submit', this.generateStadistics.bind( this ) );
  }

  handleChangeBusiness( $event ) {

    const { value } = event.target;

    // muestra el select dependiendo de la opcion seleccionada
    switch ( value ) {
      case 'delivery':
        showElement( this.deliveryQuestions );
        hideElement( this.productQuestions );
        this.showPeriod('none');
        break;

      case 'product':
        showElement( this.productQuestions );
        hideElement( this.deliveryQuestions );
        this.showPeriod('none');
        break;

      default:
        this.clearFilter();
        break;
    }
  }

  handleChangeQuestions( $event ) {

    const { value } = event.target;

    // muestra el select dependiendo de la opcion seleccionada
    if ( value === 'delivery-period' || value === 'product-period' ) {
      this.showPeriod();

    } else {
      this.showPeriod('none');

    }
  }

  clearFilter() {

    hideElement( this.deliveryQuestions );
    hideElement( this.productQuestions );
    this.showPeriod('none');

    for ( const input of this.period.querySelectorAll('input[type="date"]') ) {
      input.value = '';
    }
  }

  showPeriod( value = 'flex' ) {
    this.period.style.display = value;
  }

  generateStadistics( $event ) {

    $event.preventDefault();

    const formData = new FormData( this.form );

    // valores booleanos para la consulta
    const data = {
      delivery_note: formData.get('area-business') === 'delivery',
      products: formData.get('area-business') === 'product',
      question: '',
      until: '',
      to: ''
    };

    console.log( data );
  }
}

const reportsComponent = new ReportsComponent();
