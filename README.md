# PRODUCTOS APP

Software construido en electronJS enfocado a la control y gestion de notas de entrega, utilizando Electron Forge

#### Requisitos:
- Nodejs >= 12.0.0
- Servicio de base de datos MySQL o MariaDB para la conexion a BD.

Una vez clonado el proyecto ejecuta el comando `npm install` para construir los
modulos de node.

Para ejecutar el programa en modo de desarrollo `npm start`
Para exportar la aplicacion `npm run package`
Para crear binarios de la aplicacion `npm run make`

Para mas documentacion de despliuegue consultar https://www.electronforge.io/

### Recomendacion: limpiar antes el cache antes de construir los modules de node

- verificar si existe data en cache: `npm cache verify`
- limpiar con el comando `npm cache clean -f`

### Recursos para desarrolladores (documentación)

Si necesitas mas información, la documentación de los modulos es generado con JSDoc utilizando el comando
`npm run docs` creando una carpeta con los archivos puedes visualizarlo desde el navegador

### Modelo de Base de datos
La base de datos de desarrollo es el archivo `bd_productosapp.sql` importalo en tu gestor y configura los 
parametros de conexion de usuarios dentro del `users-productos-app.ini` .