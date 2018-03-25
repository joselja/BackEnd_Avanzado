//Script para inicializar la Base de Datos de NodePopdb
'use strict';


var connection = 'localhost:27017';
var database = 'nodepopdb';
var anuncios = 'anuncios';


print('***** START INICIALIZATION DATABASE :', database, '##');
print('***** Configuring connection');

//Database's Host
var conn = new Mongo(connection);
//Database's name
var db = conn.getDB(database);
print('***** Connection finished\n');

print('***** Deleting Database records: ', database);
//Delete all records in Database
db.dropDatabase();
print('***** Deleting finished\n');

print('***** Inicialization database: ', database);
//Create Database
db.getSiblingDB(database);
print('***** Create finished\n');

print('***** Creating collections', anuncios);
db.createCollection(anuncios);

print('***** Collections finished\n');

print('***** Loading data');

print('***** Preparing file of', anuncios);
var fileInsertAnunciosDB = cat('./config/anuncios.json');

//Parsing to JSON file's content
var anuncios_json = JSON.parse(fileInsertAnunciosDB);

//Inserting docs in database
print('***** Loading data of', anuncios);
db.anuncios.insert(anuncios_json);
print('***** File Loaded');
print('***** Creating index', anuncios);
db.anuncios.ensureIndex({nombre:1});
db.anuncios.ensureIndex({venta:1});
db.anuncios.ensureIndex({precios:1});
db.anuncios.ensureIndex({tags:1});
print('***** Index created\n');


print('**** Database initialization is finished ****');