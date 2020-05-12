const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./config/database');

db.authenticate().then(() => console.log('Ühendatud'))
.catch(err => console.log('viga', err));

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use('/gigs',  require('./routes/gigs'));

app.get('/', (req, res) => res.render('index'));
app.listen(5000);