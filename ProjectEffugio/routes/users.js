const express = require('express');
const router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const userData = require("../data");

passport.use(new Strategy(
    function(username, password, cb) {
        console.log("user: pass:"+username+" "+password);
        userData.users.findByUsername(username, function(err, user) {
        if (err) { return cb(err); }
        //if (!user) { return cb(null, false); }
        if(!user){
          return cb(null, false, { message: 'Unknown User'});
        }
        userData.users.comparePassword(password, user.hashedPassword, function(err, isMatch){
          if(err) throw err;
          if(isMatch){
            
            return cb(null, user);
          } else {
            return cb(null, false, { message: 'Invalid password'});
          }
        });
      });
}));


passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });
  
passport.deserializeUser(function(id, cb) {
userData.users.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
});


router.get('/login',
function(req, res) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {      
    res.render('users/login', { message: req.flash('error') });    
    
  }else{
    res.redirect('/profile');  
  }
});
/* router.get("/profile",(req, res) => {
  console.log("user"+req.user);
    res.render("users/profile", {});
}); */
router.get('/profile',
require('connect-ensure-login').ensureLoggedIn("/"),
function(req, res){
  res.render('users/profile', { user: req.user});
});
router.get('/dashboard',
require('connect-ensure-login').ensureLoggedIn("/"),
function(req, res){
  res.render('users/dashboard', { user: req.user});
});
router.post('/login',
passport.authenticate('local', {successRedirect:'/dashboard', failureRedirect:'/login',failureFlash: true}),
function(req, res) {
   // console.log('You are authenticated');    
    res.redirect('/profile');
});

router.get('/logout',function(req, res){
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/login');
});
// Register
router.get('/register', function(req, res){
	res.render('users/register');
});
// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('users/register',{
			errors:errors
		});
	} else {
		var newUser = {
			name: name,
			email:email,
			username: username,
			password: password
		};

	/* 	User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		}); */

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});
module.exports = router;