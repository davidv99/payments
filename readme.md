# README

Pasos necesarios para poner en marcha la aplicación

### 1. Necesitas instalar

- Composer
- Nodejs
- angular cli
- Instalar postman

### 2. Actualizar dependencias

- En la carpeta del back correr el comando -> composer update
- En la carpeta del front correo el comando -> npm install

### 3. Configurar base de datos

- Crear base de datos y relacionar los datos en el archivo .env de la carpeta back
- Editar o eliminar migraciones ubicadas en la carpeta /back/database/migrations/
- Ejecutar las migraciones 'php artisan migrate'

### 4. Iniciar pruebas

- Debemos indicarle al front que la url de servicios es el virtualhost que creamos para nuestro proyecto del back, esto podemos modificarlo cambiando la línea (9) del archivo -> front/src/app/apirest.service.ts
- En la carpeta /back/collections, está la colección de servicios montados en postman, se pueden revisar los servicios creados por defecto

### 5. Crear permisos y roles

- En los servicios están específicados las opciones para crear roles y permisos, desde aquí se pueden crear los permisos, y los roles se pueden crear desde el postman o desde el sitio.
- Es importante tener en cuenta que los permisos se crearán con la siguiente nomenclatura (index_users), esto para usar un nombre estandar para reconocerlos en la base de datos, para mostrarlos en la vista debemos modificar el archivo Controller/Controller.php en donde podemos encontrar dos arrays (permissionsEs, permissionsEn), aquí podemos modificar los valores que serán visualizados por el usuario, esto nos permite poder tener los permisos en varios idiomas.
