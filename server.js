var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dateFormat = require('dateformat');
var morgan = require('morgan');
var app = express();
var port = process.env.PORT || 4000;
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var passport = require('passport');
var flash = require('connect-flash');
var mysql = require('mysql');

require('./config/passport')(passport);
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');  
app.use(express.static('public'));
app.use(session({
 secret: 'nguyenkhai',
 resave: true,
 saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/admin/admin.js')(app, passport);
require('./routes/user/user.js')(app, passport);
require('./routes/site/danhmuc.js')(app);
require('./routes/site/tin.js')(app);
require('./routes/site/extends.js')(app);

app.listen(port);
console.log("Server is running on port: "+port+"");