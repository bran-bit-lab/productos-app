const { Notificacion } = require('electron');
const { Database } = require('../database/database');
const CRUD = require('../database/CRUD');

class ReporteController {

  databaseInstance = null;

  static get database() {
    return this.databaseInstance || ( this.databaseInstance = new Database() );
  }

  static getTotalProductByCategory() {
    return new Promise(( resolve, reject ) => {

      this.database.consult( CRUD.ObtenerTotalProductosPorCategoria, null, ( error, results ) => {

        if ( error ) {

          console.log( error );

          reject( error );

          return;
        }

        // console.log( result );
        let keys = [];
        let values = [];

        results.forEach(( item ) => {
          keys.push( item.categoria );
          values.push( item.cantidad_productos );
        });

        resolve({ keys, values, results });
      });
    });
  }

  static getTotalNotesBySeller( period = null ) {
    return new Promise(( resolve, reject ) => {

      this.database.consult( CRUD.ObtenerNotasPorVendedorGeneral, period, ( error, results ) => {

        if ( error ) {

          console.log( error );

          reject( error );

          return;
        }

        // console.log( result );
        let keys = [];
        let values = [];

        results.forEach(( item ) => {
          keys.push( item.nombre_vendedor );
          values.push( item.cantidad_notas );
        });

        resolve({ keys, values, results });
      });
    });
  }

  static getTotalNotesByState( period = null ) {
    return new Promise(( resolve, reject ) => {

      const sql = period ? CRUD.ObtenerTotalNotasPorCategoriaPeriodo : CRUD.ObtenerTotalNotasPorCategoriaGeneral;

      this.database.consult( sql, period, ( error, results ) => {

        if ( error ) {

          console.log( error );

          reject( error );

          return;
        }

        // console.log( result );
        let keys = [];
        let values = [];

        results.forEach(( item ) => {
          keys.push( item.status );
          values.push( item.total );
        });

        resolve({ keys, values, results });
      })
    });
  }
}

module.exports = { ReporteController };
