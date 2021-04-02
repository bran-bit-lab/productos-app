const CATEGORIAS = [
	{
		id: 1,
		nombre: 'Lacteos',
		descripcion: 'Bebidas lacteas, helados, yogures ...',
		userId: 1,
		activo: true
	},
	{
		id: 2,
		nombre: 'Carnes',
		descripcion: 'Carnes de res, Cerdo ...',
		userId: 1,
		activo: true
	},
	{
		id: 3,
		nombre: 'Jugos',
		descripcion: 'Jugos de fruta pera, manzana ...',
		userId: 2,
		activo: true
	},
	{
		id: 4,
		nombre: 'Dulces',
		descripcion: 'Galletas, chocolates ...',
		userId: 2,
		activo: true
	},
	{
		id: 5,
		nombre: 'Cereales',
		descripcion: 'Harina de trigo, maiz ...',
		userId: 1,
		activo: true
	},
	{
		id: 6,
		nombre: 'Verduras',
		descripcion: 'Ensalada cesar, pepino ...',
		userId: 1,
		activo: true
	},
];

const PRODUCTOS = [
	{
		id: 1,
		nombre: 'Harina pan',
		descripcion: 'harina de maiz',
		precioUnitario: 1.5,
		disponible: true,
		cantidad: 10,
		categoriaId: 5
	},
	{
		id: 2,
		nombre: 'Caramelos Lokino',
		descripcion: 'caramelos',
		precioUnitario: 0.5,
		disponible: true,
		cantidad: 20,
		categoriaId: 4
	},
	{
		id: 3,
		nombre: 'Ensalada Cesar',
		descripcion: 'ensalada para tu familia',
		precioUnitario: 0.2,
		disponible: false,
		cantidad: 0,
		categoriaId: 6
	},
	{
		id: 4,
		nombre: 'Ensalada Rica',
		descripcion: 'Ensalada cesar, pepino ...',
		precioUnitario: 0.1,
		disponible: true,
		cantidad: 23,
		categoriaId: 6
	},
	{
		id: 5,
		nombre: 'Arroz',
		descripcion: 'Arroz saborizado ...',
		precioUnitario: 0.5,
		disponible: true,
		cantidad: 78,
		categoriaId: 5
	},
	{
		id: 6,
		nombre: 'Mantequilla',
		descripcion: 'Mantequilla, margarina ...',
		precioUnitario: 0.15,
		disponible: false,
		cantidad: 0,
		categoriaId: 1
	},
	{
		id: 7,
		nombre: 'Mantequilla',
		descripcion: 'Mantequilla, margarina ...',
		precioUnitario: 0.15,
		disponible: false,
		cantidad: 0,
		categoriaId: 1
	},
	{
		id: 8,
		nombre: 'Mantequilla',
		descripcion: 'Mantequilla, margarina ...',
		precioUnitario: 0.15,
		disponible: true,
		cantidad: 20,
		categoriaId: 1
	},
];