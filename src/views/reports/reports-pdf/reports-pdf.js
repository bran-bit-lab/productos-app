const { ipcRenderer } = require('electron');
const Chart = require('chart.js');

class ReportPDF {

    chartElement = null;

    /**
     * Transforma un string codificado en base64 a datos buffer
     * @param {string} imgBase64  imagen codificada base64 
     * @returns {Uint8Array} retorna los datos en buffer 
     */
    transformBase64toArrayBuffer( imgBase64 ) {
        
        const bytes = new Uint8Array( imgBase64.length );

        for ( let i = 0; i < imgBase64.length; i++ ) {
          bytes[i] = imgBase64.charCodeAt(i);
        }

        return bytes.buffer;
    }

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
           animation: false
         }
        });
    
        // se genera la imagen base64
        let imgBase64 = this.chartElement.toBase64Image('image/jpeg', 1);
    
        return {
          ...consult,
          buffer: this.transformBase64toArrayBuffer( imgBase64 ), 
          chart:  imgBase64  
        };
    }

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
           animation: false
          }
        });
    
        // se genera la imagen base64
        let imgBase64 = this.chartElement.toBase64Image('image/jpeg', 1);
    
        return {
          ...consult,
          buffer: this.transformBase64toArrayBuffer( imgBase64 ), 
          chart:  imgBase64  
        };
    }
    
    createPieChart( consult, idChart ) {
    
        const canvas = document.querySelector( idChart );
        const { keys, values } = consult;
    
        canvas.parentNode.style.width = 'initial';
    
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
           animation: false
          }
        });
    
        // se genera la imagen base64
        let imgBase64 = this.chartElement.toBase64Image('image/jpeg', 1);
        
        return {
          ...consult,
          buffer: this.transformBase64toArrayBuffer( imgBase64 ), 
          chart:  imgBase64  
        };
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