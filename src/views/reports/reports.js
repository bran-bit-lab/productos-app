// chart.js
const Chart = require('chart.js');

class ReportsComponent {
  constructor() {
    this.form = document.forms['form-estadistics'];
    this.productQuestions = this.form.querySelector('#product-questions');
    this.deliveryQuestions = this.form.querySelector('#delivery-questions');
    this.period = this.form.querySelector('#from-until');

    this.errorFrom = this.form.querySelector('#error-from');
    this.errorAreaBusiness = this.form.querySelector('#error-area-business');
    this.errorTo = this.form.querySelector('#error-to');

    // iterable
    this.errorsQuestions = this.form.querySelectorAll('.error-questions');

    // charts
    this.canvasRow = this.form.querySelector('#canvas-estadistics');
    this.chart1 = null;
    this.chart2 = null;

    // formState
    this.formState = false;
    this.range = false;

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
        this.range = false;

        break;

      case 'product':

        showElement( this.productQuestions );
        hideElement( this.deliveryQuestions );

        this.showPeriod('none');
        this.range = false;

        break;

      default:
        this.clearFilter();
        break;
    }
  }

  handleChangeQuestions( $event ) {

    const { value } = event.target;
    const regex = /period/g;

    if ( regex.test( value ) ) {

      this.showPeriod();
      this.range = true;

    } else {
      this.showPeriod('none');

    }

    this.deleteCharts();
  }

  clearFilter() {

    hideElement( this.deliveryQuestions );
    hideElement( this.productQuestions );

    this.showPeriod('none');
    this.range = false;

    this.deleteCharts();
  }

  showPeriod( value = 'flex' ) {

    if ( value === 'none' ) {

      for ( const input of this.period.querySelectorAll('input[type="date"]') ) {
        input.value = '';
      }

      this.resetForm();
    }

    this.period.style.display = value;
  }

  generateStadistics( $event ) {

    $event.preventDefault();

    this.deleteCharts();

    const formData = new FormData( this.form );

    // valores booleanos para la consulta
    const data = {
      delivery_note: formData.get('area-business') === 'delivery',
      products: formData.get('area-business') === 'product',
      question_delivery: formData.get('delivery-questions') || null,
      question_products: formData.get('product-questions') || null,
      from: formData.get('from') || null,
      to: formData.get('to') || null
    };

    this.validate( data, () => {

      this.canvasRow.style.display = 'flex';

      this.createBarChart('#test');
      this.createPieChart('#test2');
    });
  }

  createBarChart( idChart ) {

    const canvas = document.querySelector( idChart );
    canvas.parentNode.style.height = '100%';
    canvas.parentNode.style.width = '100%';

    this.chart1 = new Chart( canvas, {
      type: 'bar',
      data: {
       labels: ['rojo', 'azul', 'amarillo', 'verde', 'morado', 'naranja'],
       datasets: [{
           label: 'numero de votos',
           data: [12, 19, 20, 5, 2, 3],
           backgroundColor: [
               'rgba(255, 99, 132, 0.2)',
               'rgba(54, 162, 235, 0.2)',
               'rgba(255, 206, 86, 0.2)',
               'rgba(75, 192, 192, 0.2)',
               'rgba(153, 102, 255, 0.2)',
               'rgba(255, 159, 64, 0.2)'
           ],
           borderColor: [
               'rgba(255, 99, 132, 1)',
               'rgba(54, 162, 235, 1)',
               'rgba(255, 206, 86, 1)',
               'rgba(75, 192, 192, 1)',
               'rgba(153, 102, 255, 1)',
               'rgba(255, 159, 64, 1)'
           ],
           borderWidth: 1
       }]
     },
     options: {
       scales: {
         y: {
           beginAtZero: true
         }
       },
       responsive: true
     }
    });
  }

  createPieChart( idChart ) {

    const canvas = document.querySelector( idChart );

    this.chart2 = new Chart( canvas, {
      type: 'pie',
      data: {
        labels: ['rojo', 'azul', 'amarillo'],
        datasets: [{
          data: [30, 20, 50],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }]
      },
      options: {
       responsive: true
      }
    });
  }

  deleteCharts() {

    this.canvasRow.style.display = 'none';

    if ( ( this.chart1 && this.chart2 )  ) {
      this.chart1.destroy();
      this.chart2.destroy();

    } else if ( !this.chart1 && this.chart2 ) {
      this.chart2.destroy();

    } else if ( this.chart1 && !this.chart2 ) {
      this.chart1.destroy();

    }

    this.chart1 = null;
    this.chart2 = null;
  }

  validate( data, callback ) {

    this.resetForm();

    console.log( data );

    let errors = 0;

    if ( !data.delivery_note && !data.products ) {

      renderErrors( this.errorAreaBusiness, 'El campo es requerido' );
      errors++;

    }

    if ( !data.question_delivery && !data.question_products ) {

      for ( const element of this.errorsQuestions ) {
        renderErrors( element, 'El campo es requerido' );
      }

      errors++;
    }

    // valida si el rango de fechas esta activo
    if ( this.range ) {

      if ( data.from && data.to ) {

        const date1 = new Date( data.from );
        const date2 = new Date( data.to );

        if ( date1 >= date2 ) {

          renderErrors( this.errorFrom, 'La fecha de desde no debe ser mayor o igual a la fecha hasta' )
          errors++;
        }

      } else if ( data.from && !data.to ) {

        renderErrors( this.errorTo, 'La fecha hasta es requerida' );
        errors++;

      } else {

        renderErrors( this.errorFrom, 'La fecha desde es requerida' );
        errors++;

      }
    }

    if ( errors > 0 ) {
      return;
    }

    callback();
  }

  resetForm() {

    hideElement( this.errorTo );
    hideElement( this.errorFrom );
    hideElement( this.errorAreaBusiness );

    for ( const element of this.errorsQuestions ) {
      hideElement( element );
    }
  }
}

const reportsComponent = new ReportsComponent();
