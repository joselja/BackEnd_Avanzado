'use strict';

let DEBUG_TRACE = require('../config/localConfig').DEBUG_TRACE;
let configTags = require('../config/localConfig');
let mongoose = require('mongoose'); 

const anuncioSchema = mongoose.Schema ({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: {
        type: [String],
        enum: ['work','lifestyle','motor','mobile']
    }
});

anuncioSchema.statics.list = function (filter, sort, limit, skip, result) {
    //busqueda de anuncios que cumplan con la condición
    let query = Anuncio.find(filter);
    //Ordenar anuncios por parámetro sort
    query.sort(sort);
    //Mostrar solo los anuncios del parámetro limit
    query.limit(limit);
    //Saltar tantos documentos como parámetro skip
    query.skip(skip);
    
    if (DEBUG_TRACE) {
        console.log('***** ANUNCIO.LIST *****');// eslint-disable-line no-console
        console.log('query', query);// eslint-disable-line no-console
    }

    //Se ejecuta la consulta
    return query.exec(result);
};

//Recuperar los Tags
anuncioSchema.statics.listaTags = function(cb) {
    //Lista de tags existentes ['work', 'mobile', 'motor', 'lifestyle']
    var tags=configTags.tags;
    for (var i=0; i<tags.length;i++) {
        return cb(null, tags);
    }
};

//creamos el modelo de anuncios
const Anuncio = mongoose.model('Anuncio', anuncioSchema);

//exportamos el modelo
module.exports = Anuncio;