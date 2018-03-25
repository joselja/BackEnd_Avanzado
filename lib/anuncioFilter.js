'use strict';

const DEBUG_TRACE = require('../config/localConfig').DEBUG_TRACE;

function anuncioFiltro(req) {
    //Parámetros de filtro
    let nombre = req.query.nombre;
    let venta = req.query.venta;
    let precio = req.query.precio || null;
    let tag = req.query.tag;

    let filter = {};

    if (DEBUG_TRACE) {
        console.log('#***** ANUNCIO FILTRO *****#');// eslint-disable-line no-console
        console.log('#***** ANTES DEL PARSING *****#');// eslint-disable-line no-console
        console.log('filter.nombre', filter.nombre);// eslint-disable-line no-console
        console.log('filter.venta', filter.venta);// eslint-disable-line no-console
        console.log('filter.precio', filter.precio);// eslint-disable-line no-console
        console.log('filter.tags', filter.tags);// eslint-disable-line no-console
    }

    //Validar parámetro nombre
    if (typeof nombre !== 'undefined') {
        filter.nombre = new RegExp('^' + nombre, 'i');
    }

    //Validar parámetro venta
    if (typeof venta !== 'undefined') {
        filter.venta = venta;
    }

    //Validar parámetro precio
    if (precio !== null) {
        let rango;

        //Se comprueba si el usuario ha introducido un rango de precios
        if (precio.indexOf('-') >= 0) {
            //se separan los límites del rango de precios
            rango = precio.split('-');

            //Si los dos elementos están vacíos no se aplicará el filtro por precio
            if (rango[0] === '' && rango[1] !== '') {
                //1º elemento vacio. Solo se buscarán elementos que tengan un precio <= al indicado por el segundo elemento
                filter.precio = { '$lte': parseInt(rango[1]) };
            } else if (rango[0] !== '' && rango[1] === '') {
                //2º elemento vacio. Solo Se buscarán elementos que tengan un precio >= al indicado por el primer elemento
                filter.precio = { '$gte': parseInt(rango[0]) };
            } else if (rango[0] !== '' && rango[1] !== '') {
                //No existen elementos vacíos. Se buscaran aquellos con precio >= primer elemento & <= segundo elemento
                filter.precio = { '$gte': parseInt(rango[0]), '$lte': parseInt(rango[1]) };
            }
        } else {
            //No hay rango de precios, se añade directamente al filtro el precio recibido
            filter.precio = precio;
        }
    }

    //Validación parámetro tag
    if (typeof tag !== 'undefined') {
        filter.tags = { '$all': [tag] };
    }

    if (DEBUG_TRACE) {
        console.log('#***** ANUNCIO FILTRO *****#');// eslint-disable-line no-console
        console.log('#***** DESPUES DEL PARSING *****#');// eslint-disable-line no-console
        console.log('filter.nombre', filter.nombre);// eslint-disable-line no-console
        console.log('filter.venta', filter.venta);// eslint-disable-line no-console
        console.log('filter.precio', filter.precio);// eslint-disable-line no-console
        console.log('filter.tags', filter.tags);// eslint-disable-line no-console
    }

    //Se retorna el filtro formado
    return filter;
}

module.exports = anuncioFiltro;