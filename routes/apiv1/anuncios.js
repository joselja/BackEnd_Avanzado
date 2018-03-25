'use strict';

let DEBUG_TRACE = require('../../config/localConfig').DEBUG_TRACE;

let express = require('express'); 
let router = express.Router();

let mongoose = require('mongoose'); //Mongoose
let Anuncio = mongoose.model('Anuncio');

let errorHandler = require('../../lib/error'); //Manejador de errores
let anuncioFiltro =  require('../../lib/anuncioFilter'); //Manenador de Filtro de Anuncio


//Documentos Anuncio
router.get('/', function (req, res) {
    //ordenación
    let sort = req.query.sort || null;
    //paginación
    let limit = parseInt(req.query.limit) || null;
    let skip = parseInt(req.query.start) || null;
    

    //filtro de la consulta
    let filter = anuncioFiltro(req);

    if (DEBUG_TRACE) {
        console.log('***** ANUNCIOS *****');// eslint-disable-line no-console
        console.log('filter.nombre', filter.nombre);// eslint-disable-line no-console
        console.log('filter.venta', filter.venta);// eslint-disable-line no-console
        console.log('filter.precio', filter.precio);// eslint-disable-line no-console
        console.log('filter.tags', filter.tags);// eslint-disable-line no-console
        console.log('sort', sort);// eslint-disable-line no-console
        console.log('limit', limit);// eslint-disable-line no-console
        console.log('skip', skip);// eslint-disable-line no-console
        console.log('filter', filter);// eslint-disable-line no-console
    }

    //La búsqueda de los anuncios se realizará con las siguientes condiciones:
    //Se ordenan por el campo indicado en el parámetro sort
    //Se muestran los documentos del parámetro limit
    //Se salta los documentos del parámetro skip
    Anuncio.list(filter, sort, limit, skip, function (err, anuncios) {
        if (err) {
            return errorHandler(new Error('Internal server error. DB_FETCH_ERROR'), req, res, 500);
        }   
        console.log('anuncios', anuncios);// eslint-disable-line no-console
        if (anuncios.length === 0) {
            console.log('error');// eslint-disable-line no-console
            return errorHandler(new Error('Internal server error. NO_DATA_FOUND'), req, res, 500);
        }

        //JSON de respuesta con los documentos de la BBDD
        res.json({success: true, anuncios: anuncios});
    });
});


// POST /
// Añadir un anuncio
router.post('/', (req, res, next) => {
    console.log(req.body);// eslint-disable-line no-console
  
    const data = req.body;
    
    // creamos documento de agente en memoria
    const anuncio = new Anuncio(data);
    
    // lo persistimos en la base de datos
    anuncio.save((err, anuncioGuardado) => { // .save es método de instancia
        if (err) {
            next(err);
            return;
        }
        res.json({ success: true, result: anuncioGuardado });
    });
});
  

module.exports = router;