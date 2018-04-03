"use strict";

var express = require("express");
var router = express.Router();
const i18n = require('../lib/i18nConfigure')();
const sessionAuth = require('../lib/sessionAuth');

const Anuncio = require("../models/Anuncio");
var appLib = require("../lib/appLib.js");

// Cargar libreria de validaciones
const { query, validationResult } = require("express-validator/check");

// cargamos objeto de upload
const upload = require('../lib/uploadConfig');

/* GET home page. */
router.get("/anuncios", async (req, res, next) => {
  try {
    // Get request parameters
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const tags = req.query.tags;
    const precio = req.query.precio;
    const skip = parseInt(req.query.skip);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;
    const fields = req.query.fields;

    // Build filter query with parameters
    const filtro = {};

     // Filtrar por nombre
    if (typeof nombre !== 'undefined') {
      // Se añade el nombre (por el que empiece) al filtro
      filtro.nombre = new RegExp('^' + nombre, "i");
    }

    // Filtrar por tipo de anuncio (true -> venta / false -> búsqueda)
    if (typeof venta !== 'undefined') {
      // Se añade el tipo de anuncio al filtro
      filtro.venta = venta;
    }

    // Filtrar por precio
    if (typeof precio !== 'undefined') {
      // Se filtra por precio
      filtro.precio = filtrarPrecio(precio);
    }

    // Filtrar por tags
    if (typeof tags !== 'undefined') {
      // Se introduce dentro de un vector el tag buscado
      filtro.tags = [tags];

      // Se comprueba si el tag está dentro de los tags de la base de datos
      filtro.tags = {$in: filtro.tags};
  }

    // Run query
    const docs = await Anuncio.list(filtro, sort, limit, skip);

    // Se le pasan los resultados a la vista
    res.locals.anuncios = docs;


    res.render("index", {
      title: "NodePop",
      docs: docs
    });

  } catch(err) {
    next(err);
    return;
  }  
});




// Incluir las rutas de la API para los tipos de tags
router.post("/enelbody", (req, res, next) => {
  console.log("req.body", req.body);
  res.send("ok");
});



// Función para filtrar por precio
function filtrarPrecio(precio) {

  // Rango entre x-y ( > x && < y )
  if (/^[0-9]+\-[0-9]+$/.test(precio)) {
    return {'$gte': parseInt(precio.split('-')[0]), '$lte': parseInt(precio.split('-')[1])};
  }

  // Rango entre x- ( > x )
  if (/^[0-9]+\-$/.test(precio)) {
    return {'$gte': parseInt(precio.match(/[0-9]+/))};
  }

  // Rango entre -y ( < y )
  if (/^-[0-9]+$/.test(precio)) {
      return {'$lte': parseInt(precio.match(/[0-9]+/))};
  }

  return parseInt(precio);
}

module.exports = router;