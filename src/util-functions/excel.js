/**
* Libreria de procesamiento de archivos excel
* @module excel
*/

const XLSX = require('xlsx');
const fs = require('fs');
const FILE = require('./file');

/**
 * Exporta el archivo en formato excel
 * @param {string} url path donde se exporta el archivo
 * @param {{[string]: any} | Array<{[string]: any}>} data informacion a mostrar en el excel
 * @returns {Promise<string>}
 */
function writeFileExcel( url, data ) {

  const manejador = function ( resolve, reject ) {
    
    try {
    
      // Generar la hoja y el libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet( data );
      const workbook = XLSX.utils.book_new();
      
      // fix headers 
      // XLSX.utils.sheet_add_aoa( worksheet, [["Id", "Name", "Gender"]], { origin: "A1" });
      
      XLSX.utils.book_append_sheet( workbook, worksheet, "data" );
      XLSX.writeFile( workbook, url );
      
      resolve('Archivo excel creado con exito');  
  
    } catch ( error ) { 

      reject( error );
    }
  };

  const promesa = new Promise( manejador );
  
  return promesa;
}

function generarLibroNotasExcel( url, data ) {

  const manejador = function ( resolve, reject ) {

    try{
       const workbook = XLSX.utils.book_new();
       
       for ( const nota of data ) {
        
         const { productos , ...nota_modificada } = nota;
         const worksheet = XLSX.utils.json_to_sheet([ nota_modificada ]);

         // console.log ("nota modificada: ", nota_modificada );

          if ( productos.length > 0 ){

            let row = 5;

            productos.forEach(( producto, index ) => {

              if ( index === 0 ) {

                // console.log( Object.keys( producto ) )

                XLSX.utils.sheet_add_aoa( 
                  worksheet, 
                  [ Object.keys( producto ) ], 
                  { origin: 'A' + row.toString() }
                );

                row++;
              }

              XLSX.utils.sheet_add_aoa( 
                worksheet, 
                [ Object.values( producto ) ], 
                { origin: 'A' + row.toString() }
              );

              row++;
            });                                     
          }
         
         XLSX.utils.book_append_sheet( workbook, worksheet, "detalle_nota_" +  nota.id_nota );
       }

       XLSX.writeFile( workbook, url );

       resolve('Archivo excel creado con exito'); 

    } catch ( error ) {
      reject( error );

    }

  }

  const promesa = new Promise( manejador );

  return promesa;
}


/**
 * Lee un archivo excel y devuelve un array con sus hojas correspondientes
 * @param {string} url path a leer el archivo
 * @returns {Promise<Array<{ nombre: string, contenido: Array<any> }>>}
 */
function readFileExcel( url ){

  const manejador = function( resolve, reject ) {
    
    try {

      let file = fs.readFileSync( url ); // buffer por defecto
      let resultado = XLSX.read( file );
      
      // arreglo de objetos con cada una de las hojas contenidas en el libro
      const hojas = [];
      
      // en Workbok estan cada una de las propiedades del libro
      // Sheets es el arreglo dentro de Workbook que contiene la informacion de cada hoja
      resultado.Workbook.Sheets.forEach( nombres => {
        
        let data = resultado.Sheets[ nombres.name ];
        let sheet = XLSX.utils.sheet_to_json( data );
        
        let hoja = {
          nombre: nombres.name,
          contenido: sheet
        };
        
        hojas.push( hoja );
      });
      
      //devolvemos las hojas
      resolve( hojas ); 
    
    } catch ( error ) { 
      
      reject( error );
    }
  }

  const promesa = new Promise( manejador );

  return promesa;
}

/**
 * Exporta valores a JSON
 * @param {string} url path donde se exporta el archivo
 * @param {{[string]: any} | Array<{[string]: any}>} data datos a transformar a JSON
 * @returns {Promise<string>}
 */
function exportJSON( url, data ) {
  
  const manejador = function( resolve, reject ) {
    
    if ( FILE.checkAsset( url, false ) ){
      FILE.deleteFileSync( url );
    }
        
    const result = JSON.stringify( data );

    FILE.appendFile( url, result, ( error ) => {
      
      if ( error ) {
        reject( error );
        return;
      }

      resolve('Archivo JSON creado con exito');
    });
  };

  return new Promise( manejador );
}

module.exports = {
  writeFileExcel,
  readFileExcel,
  exportJSON,
  generarLibroNotasExcel
}