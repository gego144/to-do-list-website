const LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
var sql;


var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "todolist",
    multipleStatements: true
  });
  db.connect();

const customFields = {
    usernameField: 'email',
    passwordField: 'password'
}

const verifyCallback = (username, password, done) => {
          user_exists = userName_Checker(username), function (err, user) {
            if (err) { return done(err); }
            if (userName_Checker(username) == false) {
                console.log('wrong user');
              return done(null, false, { message: 'Incorrect username.' });
            }
            if (password_finder(username, password)) {
                console.log('wrong pass');
              return done(null, false, { message: 'Incorrect password.' });
            }
            console.log('wtf');
            return done(null, user);
          };  
      ;

}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});


passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});


// function that checks to see if the users email is in the database
function userName_Checker(email_name){
    
    var sql = "select * from info where email = ?";
    var user_email = [[email_name]];

    db.query(sql, [user_email],function (err,result){
        if (err) throw err;
        var not_unique = result.length;
        if(not_unique == 0){
            return false;
        }
        else{
            return true;
        }
    }
    )}


// function that checks to see if the password in the database matches with the email
function password_finder(email_name, pass){
    var sql = "SELECT password FROM info WHERE email = ?";
    var user_email = [[email_name]];
    db.query(sql, [user_email],function (err,result){
        if (err) throw err;
        
        bcrypt.compare(result, pass, function(err, res){
            if(err){ throw err};
            if(res){
                return true;
            }
            else{
                return false;
            }
        })
    }
)}


module.exports = verifyCallback;
