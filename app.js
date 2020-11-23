const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');;
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());

let routes = require('./routes')
routes(app);

//register menu routes auth
app.use('/auth', require('./middleware'));

app.listen(3001);