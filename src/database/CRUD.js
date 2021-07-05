const CRUD = Object.freeze({

	// users ...
	crearUsuario : "INSERT INTO usuarios (nombre, apellido, correo, area, password) VALUES (:nombre, :apellido, :correo, :area, :password);",
	listarUsuarios : "SELECT * FROM usuarios LIMIT :start, :limit;",
	obtenerTotalUsuarios : "SELECT COUNT(*) FROM usuarios;",
	editarRolUsuario : "UPDATE usuarios SET area = :area WHERE userid = :userid;",
	editarEstadoUsuario : "UPDATE usuarios SET estado = :estado WHERE userid = :userid;",
	buscarUsuario: "SELECT userid, nombre, apellido, correo, area, estado FROM usuarios WHERE nombre LIKE :search OR apellido LIKE :search OR correo LIKE :search OR area LIKE :search;",

	// login ...
	validarUsuario: "SELECT * FROM usuarios WHERE correo = :correo AND estado = TRUE;",

	// category ...
	crearCategoria : "INSERT INTO categorias (userid, nombre, descripcion, imagen) VALUES(:userid, :nombre, :descripcion, :imagen);",
	listarCategorias : "SELECT categorias.*, usuarios.nombre AS nombre_usuario, usuarios.apellido FROM categorias LEFT JOIN usuarios ON categorias.userid = usuarios.userid LIMIT :start, :limit;",
	obtenerTotalCategorias : "SELECT COUNT(*) FROM categorias;",
	editarCategoria : "UPDATE categorias SET nombre = :nombre, descripcion = :descripcion, imagen = :imagen WHERE categoriaid = :categoriaid;",
	activarCategoria: "UPDATE categorias SET activo = :activo WHERE categoriaid = :categoriaid",
	buscarCategoria: "SELECT userid, nombre, categoriaid, imagen FROM categorias WHERE nombre LIKE :search OR descripcion LIKE :search;",
	listadoCategoriasProductos: "SELECT nombre, categoriaid FROM categorias",

	//products ...
	crearProducto : "INSERT INTO productos (userid, categoriaid, nombre, descripcion, cantidad, precio, disponibilidad) VALUES( :userid, :categoriaid, :nombre, :descripcion, :cantidad, :precio, :disponibilidad );",
	listarProductos : "SELECT productos.*, usuarios.nombre AS nombre_usuario, categorias.nombre AS nombre_categoria, usuarios.apellido FROM productos LEFT JOIN usuarios ON productos.userid = usuarios.userid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid LIMIT :start, :limit;",
	obtenerTotalProductos : "SELECT COUNT(*) FROM productos;",
	editarProducto : "UPDATE productos SET categoriaid = :categoriaid, nombre = :nombre, descripcion = :descripcion, cantidad = :cantidad, precio = :precio, disponibilidad = :disponibilidad WHERE productoid = :productoid;",
	activarProducto : "UPDATE productos SET disponibilidad = :disponibilidad WHERE productoid = :productoid",
	buscarProducto : "SELECT productos.*, usuarios.nombre AS nombre_usuario, categorias.nombre AS nombre_categoria, usuarios.apellido FROM productos LEFT JOIN usuarios ON productos.userid = usuarios.userid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid WHERE productos.nombre LIKE :search OR productos.descripcion LIKE :search;",
	listarProductosActivos: "SELECT productos.*, usuarios.nombre AS nombre_usuario, categorias.nombre AS nombre_categoria, usuarios.apellido FROM productos LEFT JOIN usuarios ON productos.userid = usuarios.userid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid WHERE productos.disponibilidad = TRUE LIMIT :start, :limit;",

	// clientes ...
	crearCliente : "INSERT INTO clientes (nombre_cliente, direccion_entrega, rif, telefono_contacto) VALUES (:nombre_cliente, :direccion_entrega, :rif, :telefono_contacto);",
	listarClientes : "SELECT * FROM clientes LIMIT :start, :limit;",
	obtenerTotalClientes : "SELECT COUNT(*) FROM clientes;",
	editarCliente : "UPDATE clientes SET nombre_cliente = :nombre_cliente, direccion_entrega = :direccion_entrega, rif = :rif, telefono_contacto = :telefono_contacto WHERE id_cliente = :id_cliente;",
	buscarCliente: "SELECT * FROM clientes WHERE nombre_cliente LIKE :search OR rif LIKE :search;",

	// notas ...
	crearNota: "INSERT INTO notas( userid, descripcion_nota, id_cliente, fecha_entrega ) VALUES (:userid, :descripcion_nota, :id_cliente, :fecha_entrega);",
	listarNotas : "SELECT notas.id_nota, notas.descripcion_nota, notas.creacion, notas.status, usuarios.nombre AS nombre_usuario, usuarios.apellido AS apellido_usuario, clientes.nombre_cliente FROM notas LEFT JOIN usuarios ON notas.userid = usuarios.userid INNER JOIN clientes ON notas.id_cliente = clientes.id_cliente LIMIT :start, :limit;",
	obtenerTotalNotas : "SELECT COUNT(*) FROM notas;",
	editarNotas : "UPDATE notas SET categoriaid = :categoriaid, nombre = :nombre, descripcion = :descripcion, cantidad = :cantidad, precio = :precio, disponibilidad = :disponibilidad WHERE productoid = :productoid;",
	activarNotas : "UPDATE notas SET disponibilidad = :disponibilidad WHERE productoid = :productoid",
	buscarNotas : "SELECT notas.*, usuarios.nombre AS nombre_usuario, categorias.nombre AS nombre_categoria, usuarios.apellido FROM Notas LEFT JOIN usuarios ON productos.userid = usuarios.userid INNER JOIN categorias ON productos.categoriaid = categorias.categoriaid WHERE productos.nombre LIKE :search OR productos.descripcion LIKE :search;",
});

module.exports = CRUD;

//Ventas

//CRUD usuario

/*CREATE TABLE usuarios (
	userid int PRIMARY KEY AUTO_INCREMENT,
	nombre char(30),
	apellido char(30),
	correo char(30),
	password char(30),
	area char(30)
);

INSERT INTO usuarios(nombre, apellido, correo, password, area)
	VALUE("Gabriel", "Martinez", "prueba6@prueba.com", "123456", "Ventas");

SELECT id, name, apellido, correo, area  FROM usuarios;

SELECT * FROM usuarios;

UPDATE usuarios
	SET correo = 'modificacion@prueba.com', password='654321' WHERE userid = 0;

DELETE FROM usuarios WHERE userid = 0;

ALTER TABLE usuarios AUTO_INCREMENT=0;

//CRUD Categorias

CREATE TABLE categorias (
	id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	userid int,
	FOREIGN KEY (userid) REFERENCES usuarios(userid),
	nombre char(30),
	descripcion varchar(600)
);

INSERT INTO categorias(nombre, descripcion)
	VALUE("Suministros", "Instalacion y mantenimiento de aire acondicionado");

SELECT * FROM categorias;

UPDATE categorias
	SET descripcion = 'cambio de tipo de suministros' WHERE id = 1;

DELETE FROM categorias WHERE id = 1;



ALTER TABLE categorias AUTO_INCREMENT= 1;

//CRUD Productos

CREATE TABLE productos (
	productoid int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	userid int NOT NULL,
	categoriaid int NOT NULL,
	nombre char(30),
	descripcion varchar(600),
	FOREIGN KEY (categoriaid) REFERENCES categorias(categoriaid),
	FOREIGN KEY (userid) REFERENCES usuarios(userid)
);

INSERT INTO productos(nombre, descripcion)
	VALUE("compresor mtz168", "monofasico, gas r404");

SELECT * FROM productos;

ALTER TABLE productos
	ADD COLUMN precio DECIMAL (12,2);

UPDATE productos
	SET descripcion = 'r22' WHERE id = 1;

DELETE FROM productos WHERE id = 1;

//CRUD Notas

CREATE TABLE notas (
	nro int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	userid int,
	FOREIGN KEY (userid) REFERENCES usuarios(userid),
	cliente char(50),
	status char(30)
);

ALTER TABLE notas ADD creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

INSERT INTO notas(cliente, status)
	VALUE("Casa L", "Entregada");

SELECT * FROM notas;

UPDATE notas
	SET status = 'Cancelada' WHERE nro = 1;

DELETE FROM notas WHERE nro = 1;

ALTER TABLE notas AUTO_INCREMENT=1;*/
