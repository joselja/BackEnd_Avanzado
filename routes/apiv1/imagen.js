'use strict';
 
let express = require('express');// cargamos objeto de upload
let router = express.Router();

const upload = require('../../lib/uploadConfig');

const connectionPromise = require('../../lib/connectAMQP');



const q = 'tareas';


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
    console.log('nombre de archivo:', req.file.filename);
    res.json({ success: true, result: "ImagenSubida" });

    (async () => {
    const conn = await connectionPromise;
    const ch = await conn.createChannel();
    await ch.assertQueue(q, {
      durable: true // la cola sobrevive a reinicios
    });

    // mandar mensaje
    const resultado = ch.sendToQueue(q, new Buffer(JSON.stringify(req.file.path)), {
      persistent: true // el mensaje sobrevive a reinicios
    });
    console.log('Manda mensaje con imagen' + req.file.path);
    })().catch(err => { console.log(err); }); 
   
    
  });


module.exports = router;