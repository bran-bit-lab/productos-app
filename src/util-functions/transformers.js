/**
* Modulo de transformaciones de datos
* @module transformers
*/

const CELLS = new Map([ 
    [1, 'A'], [2, 'B'], [3, 'C'], [4, 'D'], [5, 'E'], [6, 'F'], [7, 'G'],
    [8, 'H'], [9, 'I'], [10, 'J'], [11, 'K'], [12, 'L'], [13, 'M'],
    [14, 'N'], [15, 'O'], [16, 'P'], [17, 'Q'], [18, 'R'], [19, 'S'],
    [20, 'T'], [21, 'U'], [22, 'V'], [23, 'W'], [24, 'X'], [25, 'Y'],
    [26, 'Z'],
  ]);
  
  /**
   * Transforma la data recibida en formato personalizado de notas
   * @param {XLSX.WorkSheet} data hoja de datos de excel
   * @returns {{}}
   */
  function transformarData( data ) {
    
    let resultado = {
      descripcion_nota: '',
      fecha_entrega: null,
      userid: 0,
      id_cliente: 0,
      status: 'ACEPTADO',
      productos: []
    };
  
    let producto = {
      cantidad_seleccionada: 0,
      productoid: 0
    };
  
    // tomamos los valores de la fila 2
    for ( let columna = 1; columna <= CELLS.size; columna++ ) {
  
      // verificamos que las filas y columnas tengan sus datos correspondientes
      if ( (!CELLS.get( columna )) || (!data[CELLS.get( columna ) + '2']) ) {
        continue;
      }
  
      let value = data[CELLS.get( columna ) + '2'].v;
  
      switch ( columna ) {
        case 1:
          resultado.descripcion_nota = value;
          break;
  
        case 2:
          resultado.userid = value;
          break;
  
        case 3:
          resultado.status = value;
          break;
        
        case 4:
          resultado.id_cliente = value;
          break;
  
        case 5:
          resultado.fecha_entrega = value;
          break;
  
        default:
          continue;
      }
    }
    
    // bucle de productos puedes insertar hasta 10000
    for ( let fila = 6; fila <= 10000; fila++ ) {
      
      let cell = 'A' + fila.toString(); 
           
      if ( !data[cell] ) {
        continue;
      }
  
      for ( let columna = 1; columna <= CELLS.size; columna++ ) {
        
        // verificamos que las filas y columnas tengan sus datos correspondientes
        if ( (!CELLS.get( columna )) || (!data[CELLS.get( columna ) + fila.toString()]) ) {
          continue;
        }
  
        let value = data[CELLS.get( columna ) + fila.toString()].v;
  
          switch ( columna ) {
            case 1:
              producto.productoid = value;
              break;
  
            case 2:
              producto.cantidad_seleccionada = value;
              break;
  
            default:
              continue;
          }
  
      }
  
      // añade los elementos al array
      resultado.productos.push( producto );
  
      // limpiamos el producto
      producto = {};
    }
  
    return resultado;
  }

module.exports = { transformarData };