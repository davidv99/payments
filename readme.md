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
- Ejecutar las migraciones 'php artisan migrate'

### 4. Iniciar pruebas

- Debemos indicarle al front que la url de servicios es el virtualhost que creamos para nuestro proyecto del back, esto podemos modificarlo cambiando la línea (9) del archivo -> front/src/app/apirest.service.ts
- En la carpeta /back/collections, está la colección de servicios montados en postman, se pueden revisar los servicios creados por defecto

### 5. Variables de entorno
- En el archivo app.php de la carpeta config (en el back) se debe agregar el backup de configuración de las variables de entorno con la siguiente nomenclatura por cada una de las variables que se especifican en el siguiente punto:
1. 'LOGIN_CREDENTIAL' => env('LOGIN_CREDENTIAL', 'XXXXX'),
- En el archivo .env se deben añadir las variables de entorno del para el funcionamiento del sitio con la siguiente nomenclatura:
1. LOGIN_CREDENTIAL=XXXXXXX
2. TRANKEY_CREDENTIAL=XXXXX
3. BASE_URL_SERVICE=XXXXXX
4. END_POINT=XXXXX
5. APP_URL=XXX
6. API_URL=XXXX
7. RETURN_URL=XXXX



