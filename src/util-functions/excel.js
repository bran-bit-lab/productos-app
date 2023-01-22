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
 * @param {string} [nombreHoja] nombre de la hoja
 * @returns {Promise<string>}
 */
function writeFileExcel( url, data, nombreHoja = 'data' ) {

  const manejador = function ( resolve, reject ) {
    
    try {
    
      // Generar la hoja y el libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet( data );
      const workbook = XLSX.utils.book_new();
      
      // fix headers 
      // XLSX.utils.sheet_add_aoa( worksheet, [["Id", "Name", "Gender"]], { origin: "A1" });
      
      XLSX.utils.book_append_sheet( workbook, worksheet, nombreHoja);
      XLSX.writeFile( workbook, url );
      
      resolve('Archivo excel creado con exito');  
  
    } catch ( error ) { 

      reject( error );
    }
  };

  const promesa = new Promise( manejador );
  
  return promesa;
}

/**
 * Exporta el archivo en formato excel
 * @param {string} url path donde se exporta el archivo
 * @param {{[string]: any} | Array<{[string]: any}>} data informacion a mostrar en el excel
 * @param {string} [nombreHoja] nombre de la hoja
 * @returns {Promise<string>}
 */
function writeNotesProductsExcel( url, data, nombreHoja = 'data' ) {
  
  const manejador = function ( resolve, reject ) {
    
    try {

      // creamos una copia de las notas sin la prop de productos
      let notes = data.map( note  => {

        // utilizamos el spread operator en el lado izquierdo
        // para eliminar propiedades cuando las extraemos
        let { productos, ...notaActualizada } = note;

        return notaActualizada
      });

      // Generar la hoja y el libro de trabajo
      const worksheet = XLSX.utils.json_to_sheet( notes );
      const workbook = XLSX.utils.book_new();
      
      XLSX.utils.book_append_sheet( workbook, worksheet, nombreHoja );
      
      // por cada nota validamos si existen productos se anaden paginas de detalle al libro
      data.forEach( nota => {

        if ( nota.productos.length > 0 ) {

          const worksheetProduct = XLSX.utils.json_to_sheet( nota.productos );
          
          XLSX.utils.book_append_sheet( workbook, worksheetProduct, (`detalle_nota_${nota.id_nota}`) );
        }

      });
      
      XLSX.writeFile( workbook, url );
      
      resolve('Archivo excel creado con exito');  
  
    } catch ( error ) { 

      console.log( error );

      reject( error );
    }
  };
  
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
    
    /** @type {XLSX.ParsingOptions}  */
    const opciones = {
      cellDates: true
    };

    try {

      let file = fs.readFileSync( url ); // buffer por defecto
      
      // habiltamos la lectura de fechas con cellDates
      let resultado = XLSX.read( file, opciones );
      
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
  writeNotesProductsExcel,
  readFileExcel,
  exportJSON
}