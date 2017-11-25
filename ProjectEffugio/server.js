var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
//var flash = require('express-flash');

var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


const configRoutes = require("./routes");
const static = express.static(__dirname + '/public');

// Init App
var app = express();
app.use("/public", static);

// View Engine
app.set('views', path.join(__dirname, 'views'));
  
const handlebarsInstance = exphbs.create({
    defaultLayout: 'main',
    // Specify helpers which are only registered on this instance.
    helpers: {
        asJSON: (obj, spacing) => {
            if (typeof spacing === "number")
                return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
        
            return new Handlebars.SafeString(JSON.stringify(obj));
        },
        /*select: (value, options) => {
            var select = document.createElement('select');
            select.innerHTML = options.fn(this);
            select.value = value;
            if (select.children[select.selectedIndex]){
                select.children[select.selectedIndex].setAttribute('selected', 'selected');
            }
            return select.innerHTML;
        }*/
        //NM - added a new helper for dropdown HTML elements to display database value and retain updated values by user
        select: (selected, options) => {
            return options.fn(this).replace(new RegExp(' value=\"' + selected + '\"'),'$& selected="selected"');
        }
    }
});
app.engine('handlebars', handlebarsInstance.engine);
app.set('view engine', 'handlebars');


// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
})); 
app.use(require('morgan')('combined'));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  /* res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); 
  res.locals.user = req.user || null; */
  next();
});  

// Set Port 
app.set('port', (process.env.PORT || 3000));
configRoutes(app);

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});