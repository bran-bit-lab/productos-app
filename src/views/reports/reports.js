const { remote } = require('electron');
const Chart = require('chart.js');
const { ReporteController } = remote.require('./controllers/reporte_controller');

class ReportsComponent {
  constructor() {

    // element html
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
    this.chart = null;

    // table
    this.table = this.canvasRow.querySelector('#table-data')

    // formState
    this.range = false;

    this.handleChangeBusiness = this.handleChangeBusiness.bind( this );
    this.setEvents();
  }

  set _range( range ) {
    this.range = range;
  }

  get _range() {
    return this.range;
  }

  setEvents() {
    this.form.addEventListener('submit', this.generateStadistics.bind( this ) );
  }

  handleChangeBusiness( $event ) {

    const { value } = event.target;

    // muestra el select dependiendo de la opcion seleccionada
    switch ( value ) {
      case 'delivery':

        this.clearFilter();
        showElement( this.deliveryQuestions );
        this.showPeriod('none');

        break;

      case 'product':

        this.clearFilter();
        showElement( this.productQuestions );
        this.showPeriod('none');


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
      this._range = true;

    } else {

      this.showPeriod('none');
      this._range = false;

    }

    this.deleteCharts();
  }

  clearFilter() {

    hideElement( this.deliveryQuestions );
    hideElement( this.productQuestions );

    this.showPeriod('none');
    this._range = false;
    this.table.innerHTML = '';

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

    this.validate( data, async () => {

      const keys = [];
      const values = [];

      this.canvasRow.style.display = 'flex';

      if ( data.products ) {

        // total de productos x categoria
        if ( data.question_products === 'total-product-category' ) {

          try {
            const response = await ReporteController.getTotalProductByCategory();
            this.renderTableCategories( response );
            this.createPieChart('#chart-model', response );

          } catch ( e ) {
              console.error( e );

          }
        }

      } else {  // delivery_note

        if ( data.question_delivery === 'quantity-general' ) {

          try {

            const response = await ReporteController.getTotalNotesBySeller();
            this.renderTableSellers( response );
            this.createBarChart('#chart-model', response );

          } catch (e) {
            console.error( e );

          }
        } else if ( data.question_delivery === 'quantity-period' ) {
           console.log( data );

        } else if ( data.question_delivery === 'delivery-general' ) {

          try {
            const response = await ReporteController.getTotalNotesByState();
            this.renderTableDeliveryState( response );
            this.createPieChart('#chart-model', response);

          } catch (e) {
            console.error( e );

          }

        }
      }
    });
  }

  createBarChart( idChart, objectModel ) {

    const canvas = document.querySelector( idChart );
    const { keys, values } = objectModel;
    const { backgroundColor, borderColor } = this.createRandomColor( values, 0.2 );

    // this.reziseElement( canvas );

    this.chart = new Chart( canvas, {
      type: 'bar',
      data: {
       labels: keys,
       datasets: [{
           label: '# de entregas realizadas',
           data: values,
           backgroundColor,
           borderColor,
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

  createPieChart( idChart, objectModel ) {

    // console.log( objectModel );

    const canvas = document.querySelector( idChart );
    const { keys, values } = objectModel;

    // se generan los colores aleatorios
    const { backgroundColor, borderColor } = this.createRandomColor( values, 0.2 );

    this.chart = new Chart( canvas, {
      type: 'pie',
      data: {
        labels: keys,
        datasets: [{
          data: values,
          backgroundColor,
          borderColor,
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

    if ( this.chart  ) {
      this.chart.destroy();
    }

    this.table.innerHTML = '';
    this.chart = null;
  }

  validate( data, callback ) {

    this.resetForm();

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
    if ( this._range ) {

      if ( data.from && data.to ) {

        const date1 = new Date( data.from );
        const date2 = new Date( data.to );

        if ( date1 >= date2 ) {

          renderErrors( this.errorFrom, 'La fecha de desde no debe ser mayor o igual a la fecha hasta' );
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



  reziseElement( canvas ) {

    if ( window.matchMedia('(min-width: 768px)').matches ) {
      canvas.parentNode.style.height = '30%';
      canvas.parentNode.style.width = '30%';

    } else {
      canvas.parentNode.style.height = '95%';
      canvas.parentNode.style.width = '95%';

    }
  }

  createRandomColor( values,  opacity = 1 ) {

    // return { backgroundColor: string[], borderColor: string[] }

    const min = 0;
    const max = 255;
    let backgroundColor = [];
    let borderColor = [];

    values.forEach(() => {

      let color = `rgba(
        ${ Math.floor( Math.random() * ( max - min ) ) + min },
        ${ Math.floor( Math.random() * ( max - min ) ) + min },
        ${ Math.floor( Math.random() * ( max - min ) ) + min },
        ${opacity}
      )`;

      // insertamos en el array
      backgroundColor.push( color );

      color = color.replace(/0.2/, 1);

      borderColor.push( color );
    });

    return { backgroundColor, borderColor };
  }

  // render tables
  renderTableCategories( response ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Nombre: </th>
            <th>Cantidad:</th>
          </tr>
        </thead>
        <tbody>
          ${
            response.results.map(( category ) => (`
              <tr class="text-center">
                <td>${ category.categoria }</td>
                <td>${ category.cantidad_productos }</td>
              </tr>
            `)).join('')
          }
        </tbody>
      </table>
    `);
  }

  renderTableSellers( response ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Nombre del vendedor: </th>
            <th>Cantidad vendida:</th>
          </tr>
        </thead>
        <tbody>
          ${
            response.results.map(( seller ) => (`
              <tr class="text-center">
                <td>${ seller.nombre_vendedor }</td>
                <td>${ seller.cantidad_notas }</td>
              </tr>
            `)).join('')
          }
        </tbody>
      </table>
    `);
  }

  renderTableDeliveryState( response ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Estado: </th>
            <th>Cantidad:</th>
          </tr>
        </thead>
        <tbody>
          ${
            response.results.map(( state ) => (`
              <tr class="text-center">
                <td>${ state.status }</td>
                <td>${ state.total }</td>
              </tr>
            `)).join('')
          }
        </tbody>
      </table>
    `);
  }
}

const reportsComponent = new ReportsComponent();
