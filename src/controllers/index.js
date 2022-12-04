// index of requires

const { UsersController } = require('./users-controller');
const { CategoriasController } = require('./categorias-controller')
const { ProductosController } = require('./productos-controllers');
const { NotasController } = require('./notas-controller');
const { ClientesController } = require('./clientes-controller');
const { NotasProductosController } = require('./notas-productos-controller');
const { ReporteController } = require('./reporte-controller');

module.exports = {
    UsersController,
    CategoriasController,
    ProductosController,
    NotasController,
    ClientesController,
    NotasProductosController,
    ReporteController    
};