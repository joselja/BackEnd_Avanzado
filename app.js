var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const jwtAuth = require('./lib/jwtAuth');

const conn = require('./lib/mongoConnection');

//conectamos la BBDD
require('./lib/mongoConnection');

//Carga el modelo de anuncios
require('./models/Anuncio');
//Carga el modelo de usuarios
require('./models/Usuario');



var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html'); //decimos a express que use extensión html
app.engine('html', require('ejs').__express);

app.locals.title = 'Nodeapi';

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//Middleware de estáticos
app.use(express.static(path.join(__dirname, 'public')));


const loginController = require('./routes/loginController');



//middlewares del API
app.use('/apiv1/anuncios', jwtAuth(), require('./routes/apiv1/anuncios'));

app.use('/apiv1/authenticate', loginController.postLoginJWT);

app.use('/apiv1/tags', jwtAuth(), require ('./routes/apiv1/tags'));

//app.use('/apiv1/upload', uploadConfig);


app.use(async (req, res, next) => {
    try {
      // si el usuario está logado, cargamos en req.user el objeto de usuario desde la base de datos
      // para que los siguientes middlewares lo puedan usar
      req.user = req.session.authUser ? await Usuario.findById(req.session.authUser._id) : null;
      next();
    } catch(err) {
      next(err);
      return;
    }
  });

//middlewares aplicación Web


app.use(function (req, res, next) {
    next();
});

app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use ('/images', express.static (__dirname + '/public/images'));





// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });
  
  // error handler
  app.use(function(err, req, res, next) {
  
    if (err.array) { // validation error
      err.status = 422;
      const errInfo = err.array({ onlyFirstError: true })[0];
      err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
    }
  
    res.status(err.status || 500);
  
    // si es una petición de API, respondemos con JSON
    if (isAPI(req)) {
      res.json({ success: false, error: err.message });
      return;
    }
  
    // Respondo con una página de error
  
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.render('error');
  });
  
  function isAPI(req) {
    return req.originalUrl.indexOf('/apiv') === 0;
  }


module.exports = app;