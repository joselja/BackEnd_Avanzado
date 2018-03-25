#!/bin/bash

#Se pasa la utilidad ESLint a las carpetas lib, models, routes y archivo app.js

echo "***** Ejecutando control de calidad de código Proyecto *****"
echo "Si hay errores se dejaran en los archivos siguientes:"
echo "test_folder_lib.txt"
echo "test_folder_models.txt"
echo "test_folder_routes"
echo "app_js.txt"
./node_modules/.bin/eslint ./lib/** > ./test/test_folder_lib.txt
./node_modules/.bin/eslint ./models/** > ./test/test_folder_models.txt
./node_modules/.bin/eslint ./routes/apiv1/** > ./test/test_folder_routes.txt
./node_modules/.bin/eslint app.js > ./test/test_app_js.txt
