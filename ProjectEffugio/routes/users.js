const express = require('express');
const router = express.Router();
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
const data = require("../data");
const userData= data.users;

passport.use(new Strategy(
    function(username, password, cb) {
        console.log("user: pass:"+username+" "+password);
        userData.getUserbyUserId(username).then((user)=> {
          // if (err) { return cb(err); }
          //if (!user) { return cb(null, false); }
          if(!user){
            return cb(null, false, { message: 'Unknown User'});
          }
          userData.comparePassword(password, user.hashedPassword).then((isMatch)=>{
            // if(err) throw err;
            if(isMatch){
              return cb(null, user);
            } else {
              return cb(null, false, { message: 'Invalid password'});
            }
        });
      });
}));


passport.serializeUser(function(user, cb) {
    cb(null, user._id);
  });
  
passport.deserializeUser(function(id, cb) {
  userData.getUser(id).then((user)=> {
      
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

  /************************************************************************** */
  //For test
  /*userData.getAllUsers().then((result)=>{
    console.log("Got all users:: ");
    console.log(result);

    userData.getUser(result[0]._id).then((firstUser)=>{
      console.log("Got first users:: ");
      console.log(firstUser);
      userData.addConnection(result[0]._id,result[1]._id).then((updated)=>{
        console.log("Updated first users:: ");
        console.log(updated);
        userData.getConnections(updated._id).then((connections)=>{
          console.log("connections of id:: "+updated._id);
          console.log(connections);
          userToAdd={
            user_id:"",
            name:"Jamie Randall",
            hashedpassword:"",
            age:30,
            gender:"M",
            location:"Hoboken",
            occupation:"Fireman",
            orientation:"S",
            contact_info:"4567891234",
            location_pref:[],
            connections:[]
          }
          userData.addUser(userToAdd,"password").then((addedUser)=>{
            console.log("added new user");
            console.log(addedUser);
            userToAdd._id=addedUser._id;
            userData.removeConnection(result[0]._id,result[1]._id).then((rem)=>{
              console.log("removed:: ");
              console.log(rem);
              userData.getAllUsers().then((all)=>{
                console.log("Got first users:: ");
                console.log(all);
                userToAdd.name="Jamie Randall R"
                userData.updateUser(userToAdd).then((s)=>{
                  console.log("updated:: ");
                  console.log(s);
                  res.json(s);
                });
              });
            });
          });
          
        });
        
      });
      
    });
    
  });*/
  /************************************************************************** */
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
   console.log('You are authenticated');    
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