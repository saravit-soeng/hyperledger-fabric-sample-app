var express         = require('express');
var app             = express();
var bodyParser      = require('body-parser');
var path            = require('path')

var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

require('./routes')(app);

app.use('/', express.static('./client'));

app.listen(port, () => console.log("Server started on port:"+port));
