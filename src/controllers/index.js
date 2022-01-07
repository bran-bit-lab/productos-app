// index of requires

const { UsersController } = require('./users_controller');
const { CategoriasController } = require('./categorias_controller')
const { ProductosController } = require('./productos_controllers');
const { NotasController } = require('./notas_controller');
const { ClientesController } = require('./clientes_controller');
const { NotasProductosController } = require('./notas_productos_controller');
const { ReporteController } = require('./reporte_controller');

module.exports = {
    UsersController,
    CategoriasController,
    ProductosController,
    NotasController,
    ClientesController,
    NotasProductosController,
    ReporteController    
};