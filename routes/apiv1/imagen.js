'use strict';
 
let express = require('express');// cargamos objeto de upload
let router = express.Router();

const upload = require('../../lib/uploadConfig');

let fs = require('fs');



router.get('/', function(req, res, next) {
    fs.readdir('./public/fotos/', function(err, files) {  
       var pagina='<!doctype html><html><head></head><body>';
       for(var x=0;x<files.length;x++) {
          pagina+='<a href="/fotos/'+files[x]+'">"/fotos/'+files[x]+'"</a><br>';
         }  
       res.send(pagina);
    });
 });


router.post('/', upload.single('imagen'), (req, res, next) => {

    console.log('upload:', req.file);
    res.json({ success: true, result: "ImagenSubida" });

    
  });


module.exports = router;