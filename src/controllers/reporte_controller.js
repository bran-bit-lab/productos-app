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

        if ( results.length === 0 ) {

          console.log('no existen registros');

          resolve( false );

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

      const sql = period ? CRUD.ObtenerNotasPorVendedorPeriodo : CRUD.ObtenerNotasPorVendedorGeneral;

      this.database.consult( sql, period, ( error, results ) => {

        if ( error ) {

          console.log( error );

          reject( error );

          return;
        }

        if ( results.length === 0 ) {

          console.log('no existen registros');

          resolve( false );

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

        if ( results.length === 0 ) {

          console.log('no existen registros');

          resolve( false );

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

  static getQuantityMaxSeller( period = null ) {
    return new Promise(( resolve, reject ) => {

      const sql = period ? CRUD.ObtenerCantidadMaximaVendidaPeriodo : CRUD.ObtenerCantidadMaximaVendidaGeneral;

      this.database.consult( sql, period, ( error, results ) => {

        if ( error ) {

          console.log( error );

          reject( error );

          return;
        }

        if ( results.length === 0 ) {

          console.log('no existen registros');

          resolve( false );

          return;
        }

        // console.log( result );
        let keys = [];
        let values = [];

        // console.log( results );

        results.forEach(( item ) => {
          keys.push( item.nombre );
          values.push( item.cantidad_max_vendida );
        });

        resolve({ keys, values, results });
      });

    });
  }

  static getPeriodSell( period ) {
    return new Promise(( resolve, reject ) => {

      this.database.consult( CRUD.ObtenerCantidadVendidoAnual, period, ( error, results ) => {

        if ( error ) {

          console.log( error );

          reject( error );

          return;
        }

        const data = results[1];

        if ( data.length === 0 ) {

          console.log('no existen registros');

          resolve( false );

          return;
        }

        let keys = [];
        let values = [];

        data.forEach(( item ) => {
          keys.push( item.mes );
          values.push( item.total );
        });

        resolve({ keys, values, results: data });
      });
    })
  }
}

module.exports = { ReporteController };
