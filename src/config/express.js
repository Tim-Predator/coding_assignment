const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');
const cors = require('cors');
const helmet = require('helmet');
const busboy = require('connect-busboy');
const error = require('../api/middlewares/error');
const vars = require('./vars');
//const swaggerUi = require('swagger-ui-express');
//const swaggerDocument = require('../../swagger.json');

const app = express();

//disable header information
app.disable('x-powered-by');

//handle file upload
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024,
    limits: {
      fileSize: 2000 * 1024 * 1024,
    }
  }))

// log incoming request
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length]'));

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

// parse body params and attache them to req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// gzip compression
app.use(compress());

// lets you use HTTP verbs such as PUT or DELETE
// in places where the client doesn't support it
app.use(methodOverride());

// secure apps by setting various HTTP headers
app.use(helmet());

//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//routes for handling api call
const routes = require('../api/routes');
app.use('/', routes);

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);
// error handler, send stacktrace only during development
app.use(error.handler);
// catch 404 and forward to error handler
app.use(error.notFound);


module.exports = app;