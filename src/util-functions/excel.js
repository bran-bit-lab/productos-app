/**
* Libreria de procesamiento de archivos excel
* @module excel
*/

const XLSX = require('xlsx');
const fs = require('fs');
const FILE = require('./file');

const CELLS = new Map([ 
  [1, 'A'], [2, 'B'], [3, 'C'], [4, 'D'], [5, 'E'], [6, 'F'], [7, 'G'],
  [8, 'H'], [9, 'I'], [10, 'J'], [11, 'K'], [12, 'L'], [13, 'M'],
  [14, 'N'], [15, 'O'], [16, 'P'], [17, 'Q'], [18, 'R'], [19, 'S'],
  [20, 'T'], [21, 'U'], [22, 'V'], [23, 'W'], [24, 'X'], [25, 'Y'],
  [26, 'Z'],
]);

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

  const transformarNota = function( data ) {

    let nota = {};

    // empezamos a recorrer las filas y columnas del archivo
    // para establecer las keys del objeto nota
    for ( let fila = 1; fila <= 10000; fila++ ) {

      let rowData = data['A' + fila]; 
      
      // comprueba si el valor de la fila contiene valor
      if ( !rowData ) {
        continue;
      }
      
      // encabezado de tabla
      if ( rowData.v === 'descripcion_nota' ) {

        for ( let columna = 1; columna <= CELLS.size; columna++ ) {

          // verificamos que las filas y columnas tengan sus datos correspondientes
          if ( (!CELLS.get( columna )) || (!data[CELLS.get( columna ) + fila.toString()]) ) {
            continue;
          }
          
          // obtenemos el valor
          const value = data[CELLS.get( columna ) + fila.toString()].v;
          nota = { ...nota, [value]: undefined };
        }

      }
      
      if ( rowData.v === 'productoid' ) {
        
        // añadimos la propiedad productos
        nota = { ...nota, productos: [] };
        let producto = {};

        for ( let columna = 1; columna <= CELLS.size; columna++ ) {

          // verificamos que las filas y columnas tengan sus datos correspondientes
          if ( (!CELLS.get( columna )) || (!data[CELLS.get( columna ) + fila.toString()]) ) {
            continue;
          }
          
          // obtenemos el valor
          const value = data[CELLS.get( columna ) + fila.toString()].v;

          producto = { ...producto, [value]: undefined };

          console.log({ 
            cell: CELLS.get( columna ) + fila.toString(), 
            value: data[CELLS.get( columna ) + fila.toString()].v, 
          }); 
        }

        // console.log( producto );
        // asignamos los productos
        nota = { ...nota, productos: [ ...nota.productos, producto ] };
      }

    }

    return nota;
  }

  const manejador = function( resolve, reject ) {
    
    /** @type {XLSX.ParsingOptions}  */
    const opciones = { cellDates: true };

    try {

      let archivo = fs.readFileSync( url ); // buffer por defecto
      
      // habiltamos la lectura de fechas con cellDates
      let resultado = XLSX.read( archivo, opciones );
      
      // transformamos a un array de objetos cada respuesta para estandarizar
      let respuesta = [];
 
      // en Workbok estan cada una de las propiedades del libro
      // Sheets es el arreglo dentro de Workbook que contiene la información de cada hoja
      resultado.SheetNames.forEach( nombre => {
        
        let data = resultado.Sheets[ nombre ];
        respuesta.push( transformarNota( data ) );
      });      

      // recorremos las hojas y contatenamos los valores al array
      // hojas.forEach( hoja => respuesta = respuesta.concat( hoja.contenido ) );

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