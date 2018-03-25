'use strict';

const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class LoginController {
    // GET /
    index(req, res, next) {
      res.locals.email = '';
      res.locals.error = '';
      res.render('login');
    }

    //POST /
    async post(req, res, next) {
      const email = req.body.email;
      const password = req.body.password;
      
      res.locals.error = '';
      res.locals.email = email;
      
      
      const user = await Usuario.findOne({ email: email });

      if (!user || !await bcrypt.compare(password, user.password)) {
          res.locals.error = 'Credenciales incorrectas';
          res.render('login');
          return;
      }

      req.session.authUser = { _id: user._id };//dentro de la sesion apunto el id del usuario, para saber que esta sesión está autenticada.
      //Usuario encontrado y validado           
      res.redirect('/anuncios');
    }


    // POST /loginJWT
    async postLoginJWT(req, res, next) {
        const email = req.body.emmail;
        const password = req.body.password;

        const user = await Usuario.findOne({ email: email });

        if (!user || !await bcrypt.compare(password, user.password)) {
            res.json({success: false, error: 'Wrong credentials'});
            return;
        }
        //el usuario esta y coincide la password.
        jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        }, (err, token) => {
            if (err) {
                next(err);
                return;
            }
            res.json({ sucess: true, token: token});
        });
    }
}
module.exports = new LoginController();