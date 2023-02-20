const CRUD = Object.freeze({
	// users ...
	crearUsuario : "INSERT INTO usuarios (nombre, apellido, correo, area, password) VALUES (:nombre, :apellido, :correo, :area, :password);",
	listarUsuarios : "SELECT * FROM usuarios ORDER BY userid DESC LIMIT :start, :limit;",
	obtenerTotalUsuarios : "SELECT COUNT(*) FROM usuarios;",
	editarRolUsuario : "UPDATE usuarios SET area = :area WHERE userid = :userid;",
	editarEstadoUsuario : "UPDATE usuarios SET estado = :estado WHERE userid = :userid;",
	buscarUsuario: "SELECT userid, nombre, apellido, correo, area, estado FROM usuarios WHERE nombre LIKE :search OR apellido LIKE :search OR correo LIKE :search OR area LIKE :search;",
	actualizarPerfil: "UPDATE usuarios SET nombre = :nombre, apellido = :apellido, correo = :correo, password = :password WHERE userid = :userid",

	// login ...
	validarUsuario: "SELECT * FROM usuarios WHERE correo = :correo AND estado = TRUE;",

	// category ...
	crearCategoria : "INSERT INTO categorias (userid, nombre, descripcion, imagen) VALUES(:userid, :nombre, :descripcion, :imagen);",
	listarCategorias : "SELECT categorias.*, usuarios.nombre AS nombre_usuario, usuarios.apellido FROM categorias LEFT JOIN usuarios ON categorias.userid = usuarios.userid ORDER BY categoriaid DESC LIMIT :start, :limit;",
	obtenerTotalCategorias : "SELECT COUNT(*) FROM categorias;",
	editarCategoria : "UPDATE categorias SET nombre = :nombre, descripcion = :descripcion, imagen = :imagen WHERE categoriaid = :categoriaid;",
	activarCategoria: "UPDATE categorias SET activo = :activo WHERE categoriaid = :categoriaid",
	buscarCategoria: "SELECT categorias.*, usuarios.nombre AS nombre_usuario, usuarios.apellido FROM categorias LEFT JOIN usuarios ON categorias.userid = usuarios.userid WHERE categorias.nombre LIKE :search OR descripcion LIKE :search;",
	listadoCategoriasProductos: "SELECT nombre, categoriaid FROM categorias WHERE activo = TRUE;",

	// products ...
	crearProducto : "INSERT INTO productos (userid, categoriaid, nombre, descripcion, cantidad, precio, disponibilidad) VALUES( :userid, :categoriaid, :nombre, :descripcion, :cantidad, :precio, :disponibilidad );",
	listarProductos : "SELECT productos.*, usuarios.nombre AS nombre_usuario, categorias.nombre AS nombre_categoria, usuarios.apellido FROM productos LEFT JOIN usuarios ON productos.userid = usuarios.userid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid ORDER BY productoid DESC LIMIT :start, :limit;",
	obtenerTotalProductos : "SELECT COUNT(*) FROM productos;",
	editarProducto : "UPDATE productos SET categoriaid = :categoriaid, nombre = :nombre, descripcion = :descripcion, cantidad = :cantidad, precio = :precio, disponibilidad = :disponibilidad WHERE productoid = :productoid;",
	actualizarCantidadProducto : "UPDATE productos SET cantidad = cantidad + (:suma_algebraica) WHERE productoid = :productoid",
	cantidadProducto : "UPDATE productos SET cantidad = :cantidad WHERE productoid = :productoid;",
	activarProducto : "UPDATE productos SET disponibilidad = :disponibilidad WHERE productoid = :productoid",
	buscarProducto : "SELECT productos.*, usuarios.nombre AS nombre_usuario, categorias.nombre AS nombre_categoria, usuarios.apellido FROM productos LEFT JOIN usuarios ON productos.userid = usuarios.userid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid WHERE productos.nombre LIKE :search OR productos.descripcion LIKE :search;",
	listarProductosActivos: "SELECT productos.*, usuarios.nombre AS nombre_usuario, categorias.nombre AS nombre_categoria, usuarios.apellido FROM productos LEFT JOIN usuarios ON productos.userid = usuarios.userid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid WHERE productos.disponibilidad = TRUE AND productos.cantidad > 0 ORDER BY productoid DESC LIMIT :start, :limit;",
	obtenerTotalProductosActivos: "SELECT COUNT(*) FROM productos WHERE disponibilidad = TRUE AND cantidad > 0;",
	exportarProductos: "SELECT productos.*, categorias.nombre AS nombre_categoria FROM productos INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid;",
	importarProductos: "INSERT INTO productos (userid, categoriaid, nombre, descripcion, cantidad, precio, disponibilidad) VALUES :values;",

	// clientes ...
	crearCliente : "INSERT INTO clientes (nombre_cliente, direccion_entrega, rif, telefono_contacto) VALUES (:nombre_cliente, :direccion_entrega, :rif, :telefono_contacto);",
	listarClientes : "SELECT * FROM clientes ORDER BY id_cliente DESC LIMIT :start, :limit;",
	obtenerTotalClientes : "SELECT COUNT(*) FROM clientes;",
	editarCliente : "UPDATE clientes SET nombre_cliente = :nombre_cliente, direccion_entrega = :direccion_entrega, rif = :rif, telefono_contacto = :telefono_contacto WHERE id_cliente = :id_cliente;",
	buscarCliente: "SELECT * FROM clientes WHERE nombre_cliente LIKE :search OR rif LIKE :search;",
	obtenerCliente: "SELECT * FROM clientes WHERE id_cliente = :id_cliente",

	// notas ...
	crearNota: "INSERT INTO notas( userid, status, descripcion_nota, id_cliente, fecha_entrega ) VALUES (:userid, :status, :descripcion_nota, :id_cliente, :fecha_entrega);",
	listarNotas : "SELECT notas.id_nota, notas.descripcion_nota, notas.creacion, notas.status, usuarios.nombre AS nombre_usuario, usuarios.apellido AS apellido_usuario, clientes.nombre_cliente FROM notas LEFT JOIN usuarios ON notas.userid = usuarios.userid INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente ORDER BY notas.id_nota DESC LIMIT :start, :limit;",
	ultimoRegistro: "SELECT * FROM notas ORDER BY id_nota DESC LIMIT 0, 1;",
	obtenerTotalNotas : "SELECT COUNT(*) FROM notas;",
	editarNotas : "UPDATE notas SET status = :status, descripcion_nota = :descripcion_nota, fecha_entrega = :fecha_entrega, id_cliente = :id_cliente WHERE id_nota = :id_nota;",
	buscarNotas : "SELECT notas.id_nota, notas.descripcion_nota, notas.creacion, notas.status, usuarios.nombre AS nombre_usuario, usuarios.apellido AS apellido_usuario, clientes.nombre_cliente FROM notas LEFT JOIN usuarios ON notas.userid = usuarios.userid INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente WHERE clientes.nombre_cliente LIKE :search OR notas.descripcion_nota LIKE :search;",
	exportarNotas : "SELECT notas.id_nota, notas.descripcion_nota, notas.creacion, notas.status, CONCAT( usuarios.nombre, ' ', usuarios.apellido ) AS creado_por, clientes.nombre_cliente FROM notas LEFT JOIN usuarios ON notas.userid = usuarios.userid INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente ORDER BY notas.id_nota ASC;",
	importarNotas: "INSERT INTO notas( userid, status, descripcion_nota, id_cliente, fecha_entrega ) VALUES :values;",
	// exportarNotasOLD: "SELECT notas.id_nota, notas.descripcion_nota, notas.creacion, notas.status, usuarios.nombre AS nombre_usuario, usuarios.apellido AS apellido_usuario, clientes.nombre_cliente FROM notas LEFT JOIN usuarios ON notas.userid = usuarios.userid INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente ORDER BY notas.id_nota ASC;",
	
	// notas_productos ...
	crearNotaProducto: "INSERT INTO notas_productos( id_nota, id_producto, cantidad_seleccionada ) VALUES ( :id_nota, :id_producto, :cantidad_seleccionada );",
	obtenerNotaProducto: "SELECT notas_productos.id_NP, notas_productos.cantidad_seleccionada, categorias.nombre AS nombre_categoria, usuarios.nombre AS nombre_usuario, usuarios.apellido, productos.* FROM notas_productos INNER JOIN productos ON notas_productos.id_producto = productos.productoid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid INNER JOIN usuarios ON usuarios.userid = productos.userid WHERE notas_productos.id_nota = :id_nota;",

	// exportar Notas:
	exportarNotas: "SELECT notas.id_nota, notas.descripcion_nota, notas.creacion, notas.status, CONCAT( usuarios.nombre, ' ', usuarios.apellido ) AS creado_por, clientes.nombre_cliente FROM notas LEFT JOIN usuarios ON notas.userid = usuarios.userid INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente ORDER BY notas.id_nota ASC",
	exportarNotasProducto: "SELECT notas_productos.id_NP, notas_productos.cantidad_seleccionada, categorias.nombre AS nombre_categoria, productos.nombre AS nombre_producto, productos.precio FROM notas_productos INNER JOIN productos ON notas_productos.id_producto = productos.productoid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid INNER JOIN usuarios ON usuarios.userid = productos.userid WHERE notas_productos.id_nota = :id_nota;",

	// Listado de productos asociados a la nota
	obtenerNota: "SELECT notas.*, clientes.* FROM notas INNER JOIN clientes ON clientes.id_cliente = notas.id_cliente  WHERE id_nota = :id_nota;",
	eliminarNotaProducto: "DELETE FROM notas_productos WHERE id_NP = :id_NP;",
	listarNotasProductos: "SELECT * FROM notas_productos  WHERE id_nota = :id_nota;",
	actualizarNotaProducto: "UPDATE notas_productos SET cantidad_seleccionada = :cantidad_seleccionada WHERE id_NP = :id_NP",

	// consultas de agrupacion estadisticas
	ObtenerTotalProductosPorCategoria: "SELECT c.nombre AS categoria, SUM( p.cantidad ) AS cantidad_productos FROM productos p INNER JOIN categorias c ON  c.categoriaid = p.categoriaid GROUP BY categoria LIMIT 10;",
	ObtenerCantidadMaximaVendidaGeneral: "SELECT p.nombre AS nombre, MAX( np.cantidad_seleccionada ) AS cantidad_max_vendida FROM notas_productos np INNER JOIN productos p ON np.id_producto = p.productoid INNER JOIN notas n ON n.id_nota = np.id_nota WHERE n.status = 'ENTREGADA' GROUP BY p.nombre, np.cantidad_seleccionada ORDER BY cantidad_seleccionada DESC LIMIT 10;",
	ObtenerCantidadMaximaVendidaPeriodo: "SELECT p.nombre AS nombre, MAX( np.cantidad_seleccionada ) AS cantidad_max_vendida FROM notas_productos np INNER JOIN productos p ON np.id_producto = p.productoid INNER JOIN notas n ON n.id_nota = np.id_nota WHERE n.status = 'ENTREGADA' AND  n.fecha_entrega BETWEEN :fecha_inicio AND :fecha_fin GROUP by nombre ORDER BY cantidad_seleccionada DESC LIMIT 10;",
	ObtenerNotasPorVendedorGeneral: "SELECT CONCAT( u.nombre, ' ', u.apellido ) as nombre_vendedor, COUNT( n.id_nota ) as cantidad_notas FROM usuarios u INNER JOIN notas n ON n.userid = u.userid  WHERE n.status = 'ENTREGADA' GROUP BY nombre_vendedor  ORDER BY cantidad_notas DESC LIMIT 6;",
	ObtenerNotasPorVendedorPeriodo: "SELECT CONCAT( u.nombre, ' ', u.apellido ) as nombre_vendedor, COUNT( n.id_nota ) as cantidad_notas FROM usuarios u INNER JOIN notas n ON n.userid = u.userid  WHERE n.status = 'ENTREGADA' AND  n.fecha_entrega BETWEEN :fecha_inicio AND :fecha_fin GROUP BY nombre_vendedor  ORDER BY cantidad_notas DESC;",
	ObtenerTotalNotasPorCategoriaGeneral: "SELECT status, COUNT( id_nota ) AS total FROM notas GROUP BY status ORDER BY total DESC",
	ObtenerTotalNotasPorCategoriaPeriodo: "SELECT status, COUNT( id_nota ) AS total FROM notas WHERE creacion BETWEEN :fecha_inicio AND :fecha_fin GROUP BY status ORDER BY total DESC",
	ObtenerCantidadVendidoAnual: "SET lc_time_names = 'es_VE'; SELECT MONTHNAME( n.creacion ) AS mes, SUM( np.cantidad_seleccionada ) as total FROM notas_productos np INNER JOIN notas n ON np.id_nota = n.id_nota WHERE YEAR( n.fecha_entrega ) = YEAR( NOW() ) GROUP BY mes ORDER BY mes DESC;",
});

module.exports = CRUD;