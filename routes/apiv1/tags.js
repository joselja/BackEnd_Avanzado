'use strict';

let express = require('express');
let router = express.Router();
let Anuncio = require ('../../models/Anuncio.js');

let errorHandler = require ('../../lib/error.js').error;

//Recuperar solo los tags
router.get('/', function(req, res) {
    Anuncio.listaTags( function(err, lista) {
        if (err) {
            return errorHandler(err,res);
        }
        res.json({ok:true, data: lista});
    });
});
module.exports = router;