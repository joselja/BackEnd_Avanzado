
'use strict';

const connectionPromise = require('../../lib/connectAMQP');
let Jimp = require("jimp");

const q = 'tareas';

// IIFE - Inmediatelly Invoked Function Expression
(async () => {

  // nos aseguramos de estar conectados
  const conn = await connectionPromise;

  // conectarnos a un canal
  const ch = await conn.createChannel();

  // conectar a una cola
  await ch.assertQueue(q, {});

  // le decimos al canal
  // cuantos mensajes puedo procesar
  // en paralelo
  ch.prefetch(1);

  await ch.consume(q, msg => {
    console.log(msg.content.toString());
    // procesamos el mensaje
    var origen = msg.content.toString().replace(/['"]+/g, '');
    var thumbnail = origen.replace('fotos', 'thumbnail');
    Jimp.read(msg.content.toString().replace(/['"]+/g, '')).then(function (lenna) {
      lenna.resize(100, 100)            // resize 
           .quality(60)                 // set JPEG quality 
           .greyscale()                 // set greyscale 
           .write(thumbnail); // save 
    ch.ack(msg);       
    }).catch(function (err) {
      console.error(err);
  });
  
    
  });

})().catch(err => { console.log(err); });