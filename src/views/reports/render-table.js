// render tables
function renderTableCategories( response ) {

  if ( response.results.length === 0 ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Nombre: </th>
            <th>Cantidad:</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center">
            <td colspan="2" class="text-danger">
              No existen registros disponibles
            </td>
          </tr>
        </tbody>
      </table>
    `);

    return;
  }

  this.table.innerHTML = (`
    <table class="table table-responsive table-striped">
      <thead>
        <tr class="text-center">
          <th>Nombre: </th>
          <th>Cantidad:</th>
        </tr>
      </thead>
      <tbody>
        ${
          response.results.map(( category ) => (`
            <tr class="text-center">
              <td>${ category.categoria }</td>
              <td>${ category.cantidad_productos }</td>
            </tr>
          `)).join('')
        }
      </tbody>
    </table>
  `);
}

function renderTableSellers( response ) {

  if ( response.results.length === 0 ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Nombre del vendedor: </th>
            <th>Cantidad vendida:</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center">
            <td colspan="2" class="text-danger">
              No existen registros disponibles
            </td>
          </tr>
        </tbody>
      </table>
    `);

    return;
  }

  this.table.innerHTML = (`
    <table class="table table-responsive table-striped">
      <thead>
        <tr class="text-center">
          <th>Nombre del vendedor: </th>
          <th>Cantidad vendida:</th>
        </tr>
      </thead>
      <tbody>
        ${
          response.results.map(( seller ) => (`
            <tr class="text-center">
              <td>${ seller.nombre_vendedor }</td>
              <td>${ seller.cantidad_notas }</td>
            </tr>
          `)).join('')
        }
      </tbody>
    </table>
  `);
}

function renderTableDeliveryState( response ) {

  if ( response.results.length === 0 ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Estado: </th>
            <th>Cantidad:</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center">
            <td colspan="2" class="text-danger">
              No existen registros disponibles
            </td>
          </tr>
        </tbody>
      </table>
    `);

    return;
  }

  this.table.innerHTML = (`
    <table class="table table-responsive table-striped">
      <thead>
        <tr class="text-center">
          <th>Estado: </th>
          <th>Cantidad:</th>
        </tr>
      </thead>
      <tbody>
        ${
          response.results.map(( state ) => (`
            <tr class="text-center">
              <td>${ state.status }</td>
              <td>${ state.total }</td>
            </tr>
          `)).join('')
        }
      </tbody>
    </table>
  `);
}

function renderTableProductQuantity( response ) {

  if ( response.results.length === 0 ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Producto: </th>
            <th>Max cantidad vendida:</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center">
            <td colspan="2" class="text-danger">
              No existen registros disponibles
            </td>
          </tr>
        </tbody>
      </table>
    `);

    return;
  }

  this.table.innerHTML = (`
    <table class="table table-responsive table-striped">
      <thead>
        <tr class="text-center">
          <th>Producto: </th>
          <th>Cantidad maxima vendida:</th>
        </tr>
      </thead>
      <tbody>
        ${
          response.results.map(( product ) => (`
            <tr class="text-center">
              <td>${ product.nombre }</td>
              <td>${ product.cantidad_max_vendida }</td>
            </tr>
          `)).join('')
        }
      </tbody>
    </table>
  `);
}

function renderTablePeriodSeller( response ) {

  if ( response.results.length === 0 ) {

    this.table.innerHTML = (`
      <table class="table table-responsive table-striped">
        <thead>
          <tr class="text-center">
            <th>Mes: </th>
            <th>Cantidad vendida:</th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center">
            <td colspan="2" class="text-danger">
              No existen registros disponibles
            </td>
          </tr>
        </tbody>
      </table>
    `);

    return;
  }

  this.table.innerHTML = (`
    <table class="table table-responsive table-striped">
      <thead>
        <tr class="text-center">
          <th>Mes:</th>
          <th>Cantidad vendida:</th>
        </tr>
      </thead>
      <tbody>
        ${
          response.results.map(( item ) => (`
            <tr class="text-center">
              <td>${ item.mes }</td>
              <td>${ item.total }</td>
            </tr>
          `)).join('')
        }
      </tbody>
    </table>
  `);
}

module.exports = {
  renderTableSellers,
  renderTableCategories,
  renderTablePeriodSeller,
  renderTableDeliveryState,
  renderTableProductQuantity
};
