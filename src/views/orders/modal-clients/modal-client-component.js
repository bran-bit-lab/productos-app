// =============================
//  Modal client component
// =============================

async function openModalClients() {

  function setTableClients( clients ) {
     const tbody = modalClients.querySelector('#tbody-clients');

     if ( clients.length > 0 ) {
       tbody.innerHTML = clients.map(( client ) => (`
         <tr class="text-center">
           <td name="id_cliente">${ client.id_cliente }</td>
           <td name="nombre_cliente">${ client.nombre_cliente }</td>
           <td name="rif">${ client.rif }</td>
           <td>
            <input
              type="radio"
              class="form-check-input point"
              id="client_${ client.id_cliente }"
              name="client"
            />
           </td>
         </tr>
        `)).join('');

        for ( const input of tbody.querySelectorAll('input[type="radio"]') ) {
          input.addEventListener( 'change', handleChange );
        }

     } else {
       tbody.innerHTML = (`
         <tr class="text-center">
           <td colspan="6" class="text-danger">No existen clientes disponibles</td>
         </tr>
       `);

     }
  }

  function handleChange( $event ) {

    // obtenemos el row del segundo nivel
    const rowElement = $event.target.parentNode.parentNode;
    const submitButton = modalClients.querySelector('#submit-button');
    let row = null;

    // se transforma el nodo en un objeto js
    Array.from( rowElement.querySelectorAll('td') ).forEach(( element, index, array ) => {
      if ( index === ( array.length - 1 ) ) {
        return;
      }

      if ( element.getAttribute('name') === 'id_cliente' ) {
        row = { ...row, [element.getAttribute('name')]: +element.innerText };
        return;
      }

      row = { ...row, [element.getAttribute('name')]: element.innerText };
    });


    // console.log({ clientsSelected, row });

    clientsSelected = [];
    clientsSelected = clientsSelected.concat([ row ]);

    // activa el boton si el usuario selecciona un cliente
    if ( clientsSelected.length > 0 ) {
      submitButton.removeAttribute('disabled');
    }
  }

  try {

    let clients = await ClientesController.listarClientes(
      getPaginationStorage('clientsTable')
    );

    console.log( clients );
    setTableClients( clients );

    modalClientsInstance.toggle();

  } catch ( error ) {
    console.error( error );

  }
}


const modalClients = ordersForm.footer.querySelector('#modal-clients');
const modalClientsInstance = new Modal( modalClients, {
  backdrop: 'static'
});

modalClients.addEventListener('shown.bs.modal', () => {

  const submitButton = modalClients.querySelector('#submit-button');

  clientsSelected = [];
  submitButton.setAttribute('disabled', '');
})

console.log( modalClientsInstance );

module.exports = {
  openModalClients
}
