// chart.js
const Chart = require('chart.js');

class ReportsComponent {
  constructor() {
    this.form = document.forms['form-estadistics'];
    this.productQuestions = this.form.querySelector('#product-questions');
    this.deliveryQuestions = this.form.querySelector('#delivery-questions');
    this.period = this.form.querySelector('#from-until');

    // charts
    this.canvasRow = this.form.querySelector('#canvas-estadistics');
    this.chart1 = null;
    this.chart2 = null;

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

    this.canvasRow.style.display = 'none';
    this.chart1 = null;
    this.chart2 = null;

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

    this.canvasRow.style.display = 'flex';

    this.createBarChart('#test');
    this.createPieChart('#test2');
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

    console.log( this.chart2 );
  }
}

const reportsComponent = new ReportsComponent();
