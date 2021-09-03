## PRODUCTOS APP

Software construido en electronJS, utilizando Electron Forge

#### Requisitos:
- nodeJS >= 12.1.13

Una vez clonado el proyecto ejecuta el comando `npm install` para construir los
modulos de node.

Para ejecutar el programa en modo de desarrollo `npm start`
Para exportar la aplicacion `npm run package`
Para crear binarios de la aplicacion `npm run make`


Para mas documentacion de despliuegue consultar https://www.electronforge.io/


### ATENCI�N limpiar el cache antes de construir los modules de node

- verificar si existe data en cache: `npm cache verify`
- limpiar con el comando `npm cache clean -f`
