'use strict';

//Se carga el fichero de properties
let acceptedLanguages = require('../config/localConfig').languages;

//Se carga el módulo y se instancia
let i18n = new (require('i18n-2'))({
    // setup some locales - other locales default to the first locale
    locales: acceptedLanguages
});

//Función manejadora de los errores que muestra el error en el idioma indicado
function errorHandler(err, req, res, sta) {
    let lang = req.query.lang || req.lang || 'en';

    i18n.setLocale(lang);
    err.message = i18n.__(err.message);

    console.error(err); // eslint-disable-line no-console
    res.status(sta).json({success: false, error: err.message});
}

module.exports = errorHandler;