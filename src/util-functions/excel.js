/**
* Libreria de procesamiento de archivos excel
* @module excel
*/

const XLSX = require('xlsx');
const fs = require('fs');
const FILE = require('./file');
const console = require('console');

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
      
      XLSX.utils.book_append_sheet( workbook, worksheet, nombreHoja );
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
 * Genera el libro de notas en formato excel
 * @param {string} url ruta que almacena el archivo
 * @param {Array<Object<string, any>>} data 
 * @returns {Promise<string>}
 */
function generarLibroNotasExcel( url, data ) {

  const manejador = function ( resolve, reject ) {

    try {
       const workbook = XLSX.utils.book_new();

       for ( const nota of data ) {
        
         const { productos , ...nota_modificada } = nota;
         const worksheet = XLSX.utils.json_to_sheet([ nota_modificada ]);

         // console.log ("nota modificada: ", nota_modificada );

          if ( productos.length > 0 ) {

            let row = 5;

            productos.forEach(( producto, index ) => {

              // añade el encabezado en la primera linea
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
         
         XLSX.utils.book_append_sheet( workbook, worksheet, ( "detalle_nota_" + nota.id_nota ));
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
 * @returns {Promise<Array<any>>}
 */
function readFileExcelProducts( url ) {

  const manejador = function( resolve, reject ) {
    
    /** @type {XLSX.ParsingOptions}  */
    const opciones = { cellDates: true };

    try {

      let archivo = fs.readFileSync( url ); // buffer por defecto
      
      // habiltamos la lectura de fechas con cellDates
      let resultado = XLSX.read( archivo, opciones );
      
      // transformamos a un array de objetos cada respuesta para estandarizar
      let respuesta = [];

      // arreglo de objetos con cada una de las hojas contenidas en el libro
      /** @type {Array<{ nombre: string, contenido: Array<any> }>} */
      const hojas = [];
      
      // en Workbok estan cada una de las propiedades del libro
      // Sheets es el arreglo dentro de Workbook que contiene la información de cada hoja
      resultado.SheetNames.forEach( nombre => {
        
        let data = resultado.Sheets[ nombre ];
        let sheet = XLSX.utils.sheet_to_json( data );
        let hoja = { nombre: nombre, contenido: sheet };
        
        hojas.push( hoja );
      });      

      // recorremos las hojas y contatenamos los valores al array
      hojas.forEach( hoja => respuesta = respuesta.concat( hoja.contenido ) );

      // resultado del parsing
      // console.log({ hojas, respuesta });

      // devolvemos la informacion
      resolve( respuesta ); 

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
 * @returns {Promise<Array<any>>}
 */
 function readFileExcelNotes( url ) {

  const manejador = function( resolve, reject ) {
  
    /** @type {XLSX.ParsingOptions}  */
    const opciones = { cellDates: true };

    try {

      const { transformarData } = require('./transformers');

      let archivo = fs.readFileSync( url ); // buffer por defecto
      
      // habiltamos la lectura de fechas con cellDates
      let resultado = XLSX.read( archivo, opciones );
      
      // transformamos a un array de objetos cada respuesta para estandarizar
      let respuesta = [];
 
      // en Workbok estan cada una de las propiedades del libro
      // Sheets es el arreglo dentro de Workbook que contiene la información de cada hoja
      resultado.SheetNames.forEach( nombre => {
        
        const data = resultado.Sheets[ nombre ];

        nota = transformarData( data );
        respuesta.push( nota );
        
        // console.log( nota );
      });    
      
      // console.log( respuesta );
      
      // devolvemos la informacion
      resolve( respuesta ); 

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
  readFileExcelProducts,
  readFileExcelNotes,
  exportJSON,
  generarLibroNotasExcel
}