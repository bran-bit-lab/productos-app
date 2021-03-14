const CRUD = Object.freeze({

	// users ...
	crearUsuario : "INSERT INTO usuarios (nombre, apellido, correo, area, password) VALUES (:nombre, :apellido, :correo, :area, :password) ;",	
	listarUsuarios : "SELECT * FROM usuarios LIMIT :start, :limit;",	
	obtenerTotalUsuarios : "SELECT COUNT(*) FROM usuarios;",
	editarRolUsuario : "UPDATE usuarios SET area = :area WHERE userid = :userid;",	
	editarEstadoUsuario : "UPDATE usuarios SET estado = :estado WHERE userid = :userid ;",
	buscarUsuario: "SELECT userid, nombre, apellido, correo, area FROM usuarios WHERE nombre LIKE :search OR apellido LIKE :search OR correo LIKE :search OR area LIKE :search;" 	

	// category ...
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
	id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
	userid int,
	FOREIGN KEY (userid) REFERENCES categorias(userid),
	nombre char(30),
	descripcion varchar(600)	
);

INSERT INTO productos(nombre, descripcion)
	VALUE("compresor mtz168", "monofasico, gas r404");

SELECT * FROM productos;

UPDATE productos
	SET descripcion = 'r22' WHERE id = 1;

DELETE FROM productos WHERE id = 1;

ALTER TABLE productos AUTO_INCREMENT=1;

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




