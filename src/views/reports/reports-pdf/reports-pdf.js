const { ipcRenderer } = require('electron');
const Chart = require('chart.js');

/** Clase que controla la generacion de los archivos de Imagen estadisticos */
class ReportPDF {

    /** @type {?HTMLElement} */
    chartElement = null;

    /** El constructor inicializa el plugin para el fondo blando  */
    constructor() {
      
      /* se crea un plugin para colorear la salida de color negro a blanco */
      this.plugin = {
        id: 'white-background-plugin',

        beforeDraw: ( chart ) => {
          
          // console.log( chart );

          if ( chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor ) {
            
            const ctx = chart.ctx;

            // console.log( ctx.fillStyle, chart.config.options.chartArea.backgroundColor )
            // console.log( ctx );

            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
            ctx.fillRect( 0, 0, chart.width, chart.height );
          }
        }
      };

      Chart.register( this.plugin );
    }

    /**
     * Transforma un string codificado en base64 a datos buffer
     * @param {string} imgBase64  imagen codificada base64 
     * @returns {Uint8Array} retorna los datos en buffer 
     */
    transformBase64toArrayBuffer( imgBase64 ) {

        const BASE_64_MARKER = ';base64,';

        // indexOf permite obtener la posicion del puntero cuando consigue la coincidencia
        const base64Index = imgBase64.indexOf( BASE_64_MARKER ) + BASE_64_MARKER.length;
        imgBase64 = imgBase64.substring( base64Index );

        const raw = window.atob( imgBase64 );
        
        const bytes = new Uint8Array( raw.length );

        for ( let i = 0; i < raw.length; i++ ) {
          bytes[i] = raw.charCodeAt(i);
        }

        return bytes;
    }

    /**
     * Genera el diagrama estatico de barras
     * @param {ResponseReport} consult objeto estadistico de consulta 
     * @param {string} idChart identificador de elemento HTML
     * @returns {ResponseReport}  devuelve el objeto ResponseReport con las propiedades buffer y chart base64
     */
    createBarChart( consult, idChart ) {
    
        const canvas = document.querySelector( idChart );
        const { keys, values } = consult;
        const { backgroundColor, borderColor } = this.createRandomColor( values, 0.2 );
    
        canvas.parentNode.style.width = '90%';
    
        this.chartElement = new Chart( canvas, {
          type: 'bar',
          data: {
           labels: keys,
           datasets: [{
               label: 'cantidad',
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
           responsive: true,
           animation: false,
           chartArea: {
            backgroundColor: 'white'
           }
         }
        });
    
        // se genera la imagen base64
        let imgBase64 = this.chartElement.toBase64Image('image/jpeg', 1);
    
        return {
          ...consult,
          buffer: this.transformBase64toArrayBuffer( imgBase64 ), 
          // chart:  imgBase64  
        };
    }

    
    /**
     * Genera el diagrama estatico de lineas
     * @param {ResponseReport} consult objeto estadistico de consulta 
     * @param {string} idChart identificador de elemento HTML
     * @returns {ResponseReport}  devuelve el objeto ResponseReport con las propiedades buffer y chart base64
     */
    createLineChart( consult, idChart ) {
    
        const canvas = document.querySelector( idChart );
        const { keys, values } = consult;
        const { backgroundColor, borderColor } = this.createRandomColor( values, 0.2 );
    
        canvas.parentNode.style.width = '100%';
    
        this.chartElement = new Chart( canvas, {
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
            responsive: true,
            animation: false,
            chartArea: {
              backgroundColor: 'white'
            }
          }
        });
    
        // se genera la imagen base64
        let imgBase64 = this.chartElement.toBase64Image('image/jpeg', 1);
    
        return {
          ...consult,
          buffer: this.transformBase64toArrayBuffer( imgBase64 ), 
          // chart:  imgBase64  
        };
    }
    
    
    /**
     * Genera el diagrama estatico de pie
     * @param {ResponseReport} consult objeto estadistico de consulta 
     * @param {string} idChart identificador de elemento HTML
     * @returns {ResponseReport}  devuelve el objeto ResponseReport con las propiedades buffer y chart base64
     */
    createPieChart( consult, idChart ) {
    
        const canvas = document.querySelector( idChart );
        const { keys, values } = consult;
    
        canvas.parentNode.style.width = 'initial';

        // plugin que coloca el background en blanco
        
    
        // se generan los colores aleatorios
        const { backgroundColor, borderColor } = this.createRandomColor( values, 0.2 );
    
        this.chartElement = new Chart( canvas, {
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
           responsive: true,
           animation: false,
           chartArea: {
             backgroundColor: 'white'
           }
          }
        });
    
        // se genera la imagen base64
        let imgBase64 = this.chartElement.toBase64Image('image/jpeg', 1);
        
        return {
          ...consult,
          buffer: this.transformBase64toArrayBuffer( imgBase64 ), 
          // chart:  imgBase64  
        };
    }
    
    /**
     * 
     * @param {Array<number>} values valores numericos del diagrama 
     * @param {number} opacity opacidad del color 
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
}


ipcRenderer.on('consults', ( $event, consults ) => {
   
    const reportPDF = new ReportPDF();

    consults = consults.map(( consult ) => {
        
        switch ( consult.typeChart ) {
            case 'pie':
                
                consult = reportPDF.createPieChart( consult, '#canvas1' );
                reportPDF.chartElement.destroy();

                return consult;
            
            case 'bar': 

                consult = reportPDF.createBarChart( consult, '#canvas1' );
                reportPDF.chartElement.destroy();

                return consult;

            default:

                consult = reportPDF.createLineChart( consult, '#canvas1' );
                reportPDF.chartElement.destroy();

                return consult;
        }
    });
    
    ipcRenderer.send('receiveBuffer', consults );
});