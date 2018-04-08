<h1>Práctica BackEnd Avanzado - KeepCoding Master</h1>

API de venta de artículos de segunda mano.

## Instalación
### Descarga del Backend
	$ git clone https://github.com/joselja/BackEnd_Avanzado
	$ npm install
	
### Instalación de la Base de Datos
	$ npm run-script installDB

### Carga de usuarios en la Base de Datos
	$ npm run-script installDBUsuarios

### Arrancar el API
	$ npm start

### Arrancar Consumidor cola RabbitMQ
    $ node ./routes/apiv1/consumer.js

## Operaciones disponibles para la web. http://localhost:3000/anuncios
- **Ejemplos de algunas operaciones**
	* **anuncios con precio superior a 1000 ** http://localhost:3000/anuncios?precio=1000-
	* **mostrar solo 3 anuncios** http://localhost:3000/anuncios?start=1&limit=3
	* **mostrar solo 3 anuncios del tag lifestyle** http://localhost:3000/anuncios?start=1&limit=3&tag=lifestyle

## Autenticación del API
- **Obtener token JWT** 
            Método POST. Se puede probar con la herramienta Postman mandando un método POST a la URL
            http://localhost:3000/apiv1/authenticate indicando en el body con la opción x-www-form-urlencoded y pasando
            los parámetros email="user@example.com" y password="1234".
            Devolverá un objeto JSON similar:
            {
               "sucess": true,
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWJiOTU1ZmRhNGFkNDEwYTNjODhmYzEiLCJpYXQiOjE1MjMxMzU3NTksImV4cCI6MTUyMzEzOTM1OX0.4jF48uxGNeJ61ro0aZLR3SKDfUmlWExCguCVnH7Ew4s"
            }
            http://localhost:3000/apiv1/anuncios?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWJiOTU1ZmRhNGFkNDEwYTNjODhmYzEiLCJpYXQiOjE1MjMxMzU3NTksImV4cCI6MTUyMzEzOTM1OX0.4jF48uxGNeJ61ro0aZLR3SKDfUmlWExCguCVnH7Ew4s
            Devolverá la lista de anuncios.

## Internacionalización
El FrontEnd es multiidioma, pulsando ES traduce a Español y EN a Ingles.
    http://localhost:3000/anuncios

## Subida de imagen con tarea en background
- **Subir imagen y guardarla en servidor** 
            Método POST. Se puede probar con la herramienta Postman mandando un método POST a la URL
            http://localhost:3000/apiv1/upload?token=token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWJiOTU1ZmRhNGFkNDEwYTNjODhmYzEiLCJpYXQiOjE1MjMyMTU2MzEsImV4cCI6MTUyMzIxOTIzMX0.Apef1ioJR3tbQcE4_nknZRO3no-P61bGjXoN1fxBHMw
            indicando en el body con la opción form-data y pasando el parámetro "imagen" con la imagen seleccionada.

            Cada imagen posee un thumbnail que se crea por el consumidor de la cola RabbitMQ y el módulo JIMP.
            Cada vez que se ejecuta el método POST con el parámetro imágen asociado a una foto se publica el mensaje en CloudAMQP y
            el consumidor procesa la imagen guardando el thumbnail 100x100 en la carpeta /public/thumbnail/.
            Es necesario arrancar en consumidor con el comando node ./routes/apiv1/consumer.js. El publicador va inmerso en el proceso de
            subir imágenes.

- **Recuperar imágenes súbidas:** 
            Petición GET para recuperar las rutas a las imágenes, pulsando en el link de la imagen se puede visualizar.
            Ejemplo:
            http://localhost:3000/apiv1/upload?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWJiOTU1ZmRhNGFkNDEwYTNjODhmYzEiLCJpYXQiOjE1MjMyMTU2MzEsImV4cCI6MTUyMzIxOTIzMX0.Apef1ioJR3tbQcE4_nknZRO3no-P61bGjXoN1fxBHMw

           
## Otras operaciones para el api. 
- **Lista de anuncios** - Búsqueda de anuncios, métodos GET.
                            http://localhost:3000/apiv1/anuncios?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWJiOTU1ZmRhNGFkNDEwYTNjODhmYzEiLCJpYXQiOjE1MjMxMzU3NTksImV4cCI6MTUyMzEzOTM1OX0.4jF48uxGNeJ61ro0aZLR3SKDfUmlWExCguCVnH7Ew4s
   
- **tags**:   Obtener todos los tags:
                http://localhost:3000/apiv1/tags?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YWJiOTU1ZmRhNGFkNDEwYTNjODhmYzEiLCJpYXQiOjE1MjMxMzY4NTIsImV4cCI6MTUyMzE0MDQ1Mn0.ZfKs7PpqI5KSYlhxpO1q7PIqWqnRfeBcEddjxXyU6UA
            
