class OrdersForm {
  constructor() {
    this.delivery = null;
  }

  getParamsUrl() {

    /*
      las expresiones regulares tienen una caracteristica que permite almacenar
      los valores hallados en objetos, agrupandolos para una mejor lectura, usando
      los grupos para ello.

      const regex = /(?<year>[0-9]{4})-(?<month>[0-9]{2})-(?<day>[0-9]{2})/;
      let date = '2021-06-09';

      console.log( query );
      console.log( date.match( regex ) );

      documentacion
      const regex = /^\?new=(?<new>true|false)&idDelivery=(?<idDelivery>[0-9]+)$/;
    */

    const query = location.search;
    const regex = /(?<idDelivery>[0-9]+)/;

    let match = query.match( regex );

    if ( match ) { // edit
      console.log('editar entrega', match['groups'].idDelivery );

      this.delivery = match['groups'].idDelivery;

      document.querySelector('#title').innerText = 'Editar entrega';

    } else { // new
      console.log('nueva entrega');

      document.querySelector('#title').innerText = 'Nueva entrega';
    }
  }
}


function back() {
  redirectTo('../orders.html');
}

const ordersForm = new OrdersForm();

document.addEventListener('DOMContentLoaded', ordersForm.getParamsUrl );
