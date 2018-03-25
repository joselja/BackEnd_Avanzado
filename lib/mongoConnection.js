'use strict';

let database = require('../config/localConfig').database;
let mongoose = require('mongoose'); 
let db = mongoose.connection;

//Se indica la librería de promesas que se utilizará
mongoose.Promise = global.Promise;

db.on('error', console.log.bind(console)); // eslint-disable-line no-console

db.once('open', function () {
    console.log('Conectado a mongodb.'); // eslint-disable-line no-console
});

//Se establece la conexión
mongoose.connect(database);
 
module.exports = db;