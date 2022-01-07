const { remote } = require('electron');
const { ReporteController } = remote.require('./controllers');
const Chart = require('chart.js');
const render = require('./render-table-chart');

/** clase que controla las consultas estadisticas  */
class ReportsComponent {
  constructor() {

    // element html
    this.form = document.forms['form-estadistics'];
    this.loadingComponent = document.querySelector('loading-component');
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

    // diagrama
    this.chart = null;

    // table
    this.table = this.canvasRow.querySelector('#table-data');

    /**
     * estado del rango de fechas
     * @type {boolean}
     */
    this.range = false;

    this.handleChangeBusiness = this.handleChangeBusiness.bind( this );

    this.setEvents();
  }

  /** permite establecer el rango de fechas */
  set _range( range ) {
    this.range = range;
  }

  /** obtiene el estado del rango de fechas  */
  get _range() {
    return this.range;
  }

  /**  establece los eventos del formulario */
  setEvents() {
    this.form.addEventListener('submit', this.generateStadistics.bind( this ) );
  }

  /**
   * funcion que controla el select de la seccion a consultar
   * @param {*} $event evento de cambio 
   */
  handleChangeBusiness( $event ) {

    const { value } = $event.target;

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

  /**
   * funcion que controla el cambio del select de la consulta
   * @param {*} $event evento change 
   */
  handleChangeQuestions( $event ) {

    const { value } = $event.target;
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

  /** Limpia el filtro de busqueda  */
  clearFilter() {

    hideElement( this.deliveryQuestions );
    hideElement( this.productQuestions );

    this.showPeriod('none');
    this._range = false;
    this.table.innerHTML = '';

    this.deleteCharts();
  }

  /** funcion que muestra al usuario el formulario del periodo */
  showPeriod( value = 'flex' ) {

    if ( value === 'none' ) {

      for ( const input of this.period.querySelectorAll('input[type="date"]') ) {
        input.value = '';
      }

      this.resetForm();
    }

    this.period.style.display = value;
  }

  /**
   * Funcion que genera las estadisticas
   * @param {*} $event evento de envio de formulario
   */
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

    // console.log(data );

    this.validate( data, async () => {

      this.canvasRow.style.display = 'flex';

      if ( data.products ) {

        // total de productos x categoria
        if ( data.question_products === 'total-product-category' ) {

          try {
            
            let response = await ReporteController.buscarTotalProductosPorCategoria();
           
            if ( !response ) {
              render.renderTableCategories({ results: [] }, this.table );
              return;
            }

            render.renderTableCategories( response, this.table );

            this.createPieChart('#chart-model', response );

          } catch ( e ) {
              console.error( e );

          }

        // productos maximo vendidos
        } else if ( data.question_products === 'product-max-sold-general' ) {

          try {

            let response = await ReporteController.buscarCantidadMaximaVendida();

            if ( !response ) {
              render.renderTableProductQuantity({ results: [] }, this.table );
              return;
            }

            render.renderTableProductQuantity( response, this.table );
            this.createBarChart('#chart-model', response );

          } catch (e) {
            console.error( e );
          }

        // productos maximo vendidos periodo
        } else if ( data.question_products === 'product-max-sold-period' ) {

          try {

            let response = await ReporteController.buscarCantidadMaximaVendida({
              fecha_inicio: data.from,
              fecha_fin: data.to
           });

            if ( !response ) {
              render.renderTableProductQuantity({ results: [] }, this.table );
              return;
            }

            render.renderTableProductQuantity( response, this.table );
            this.createBarChart('#chart-model', response );

          } catch (e) {
            console.error( e );
          }

        // periodo de ventas anual
        } else if ( data.question_products === 'product-sold-general' ) {

          try {

            let response = await ReporteController.buscarCantidadProductosVendidosAnual();

            if ( !response ) {
              render.renderTablePeriodSeller({ results: [] }, this.table );
              return;
            }

            render.renderTablePeriodSeller( response, this.table );
            this.createLineChart('#chart-model', response );

          } catch (e) {
            console.error( e );
          }
        }

      } else {  // delivery_note

        // cantidad notas x vendedor
        if ( data.question_delivery === 'quantity-general' ) {

          try {

            let response = await ReporteController.buscarNotasVendidasPorVendedor();

            if ( !response ) {
              render.renderTableSellers({ results: [] }, this.table );
              return;
            }

            render.renderTableSellers( response, this.table );
            this.createBarChart('#chart-model', response );

          } catch (e) {
            console.error( e );

          }

        // cantidad notas x vendedor periodo
        } else if ( data.question_delivery === 'quantity-period' ) {

           try {
             
             let response = await ReporteController.buscarNotasVendidasPorVendedor({
               fecha_inicio: data.from,
               fecha_fin: data.to
            });

            if ( !response ) {
              render.renderTableSellers({ results: [] }, this.table );
              return;
            }

            render.renderTableSellers( response, this.table );
            this.createBarChart('#chart-model', response );

           } catch (e) {
             console.error( e );
           }

        // cantidad notas x estado
        } else if ( data.question_delivery === 'delivery-general' ) {

          try {

            let response = await ReporteController.buscarNotasCategoria();

            if ( !response ) {
              render.renderTableDeliveryState({ results: [] }, this.table );
              return;
            }

            render.renderTableDeliveryState( response, this.table );
            this.createPieChart('#chart-model', response );

          } catch (e) {
            console.error( e );

          }

        } else {

          try {

            let response = await ReporteController.buscarNotasCategoria({
              fecha_inicio: data.from + ' 00:00:00',
              fecha_fin: data.to + ' 23:59:59'
            });

            // console.log( response );

            if ( !response ) {
              render.renderTableDeliveryState({ results: [] }, this.table );
              return;
            }

            render.renderTableDeliveryState( response, this.table );
            this.createPieChart('#chart-model', response);

          } catch (e) {
            console.error( e );

          }
        }
      }
    });
  }

  /**
   * Permite maquetar y modelar un diagrama de barras
   * @param {string} idChart identificador dom del elemento
   * @param {Object} objectModel modelo del objeto
   * @param {Array<string>} objectModel.keys identificadores de las barras
   * @param {Array<number>} objectModel.values valores numericos para modelar los datos 
   */
  createBarChart( idChart, objectModel ) {

    const canvas = document.querySelector( idChart );
    const { keys, values } = objectModel;
    const { backgroundColor, borderColor } = this.createRandomColor( values, 0.2 );

    canvas.parentNode.style.width = '90%';

    this.chart = new Chart( canvas, {
      type: 'bar',
      data: {
       labels: keys,
       datasets: [{
           label: 'Cantidad',
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

  /**
   * Permite maquetar y modelar un diagrama de torta
   * @param {string} idChart identificador dom del elemento
   * @param {Object} objectModel modelo del objeto
   * @param {Array<string>} objectModel.keys identificadores de las barras
   * @param {Array<number>} objectModel.values valores numericos para modelar los datos 
   */
  createPieChart( idChart, objectModel ) {

    const canvas = document.querySelector( idChart );
    const { keys, values } = objectModel;

    canvas.parentNode.style.width = 'initial';

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

  /**
   * Permite maquetar y modelar un diagrama de lineas
   * @param {string} idChart identificador dom del elemento
   * @param {Object} objectModel modelo del objeto
   * @param {Array<string>} objectModel.keys identificadores de las barras
   * @param {Array<number>} objectModel.values valores numericos para modelar los datos 
   */
  createLineChart( idChart, objectModel ) {

    const canvas = document.querySelector( idChart );
    const { keys, values } = objectModel;
    const { backgroundColor, borderColor } = this.createRandomColor( values, 0.2 );

    canvas.parentNode.style.width = '100%';

    this.chart = new Chart( canvas, {
      type: 'line',
      data: {
        labels: keys,
        datasets: [{
          label: 'cantidad de productos',
          data: values,
          backgroundColor: backgroundColor[0],
          borderColor: borderColor[0],
          borderWidth: 1
        }]
      },
      options: {
       responsive: true
      }
    });
  }

  /** permite retirar el modelo del dom  */
  deleteCharts() {

    this.canvasRow.style.display = 'none';

    if ( this.chart  ) {
      this.chart.destroy();
    }

    this.table.innerHTML = '';
    this.chart = null;
  }

  /**
   * @param {Object} data objeto de validacion
   * @param {boolean} data.delivery_note flag que indica la consulta es de notas de entrega
   * @param {boolean} data.products flag que indica la consulta es de productos
   * @param {?string} data.question_delivery consulta realizada a notas de entrega
   * @param {?string} data.question_products consulta realizada a productos
   * @param {?string} data.from inicio de rango de fechas
   * @param {?string} data.to final de rango de fechas
   * @param {CallbackValidateForm} callback llamada de retorno con los datos para ser procesados por el controlador  
   */
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

  /** Limpia el fomrulario de consulta */
  resetForm() {

    hideElement( this.errorTo );
    hideElement( this.errorFrom );
    hideElement( this.errorAreaBusiness );

    for ( const element of this.errorsQuestions ) {
      hideElement( element );
    }
  }

  /**
   * 
   * @param {Array<number>} values valores numericos 
   * @param {number} opacity opacidad de la linea del chart 
   * @returns {{ backgroundColor: Array<string>, borderColor: Array<string> }}
   */
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

  /**  genera el reporte final de la aplicacion */
  async generateReport() {

    this.loadingComponent._show = 'true';
    
    try {

      let results = await Promise.all([ 
        ReporteController.buscarNotasCategoria(),
        ReporteController.buscarNotasVendidasPorVendedor(),
        ReporteController.buscarTotalProductosPorCategoria(),
        ReporteController.buscarCantidadMaximaVendida(),
        ReporteController.buscarCantidadProductosVendidosAnual()
      ]);

      // se asegura que las consultas existan antes 
      // de generar el reporte
      resultsFilter = results.filter(( data ) => data );
      
      await ReporteController.generarReporte( resultsFilter );

    } catch ( error ) {

      console.log( error );

    } finally {

      this.loadingComponent._show = 'false';
    } 
  }
}

/** @type {ReportsComponent} */
const reportsComponent = new ReportsComponent();
