

const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const passport = require('passport');
const initalizePassport = require('./passport-config');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('express-flash')
const session = require('express-session');
const initialze = require('./passport-config');
const mysql = require('mysql');
const flashh = require('connect-flash');
var sql;


var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "todolist",
    multipleStatements: true
  });
  db.connect();


const app = express();
const jsonParser = express.json();

const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(passport.initialize())
app.use(session({
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));
app.use(flash());



//listen for requests

app.listen(3000);

app.use(express.static(__dirname + '/public')); 


app.get('/index.html', (req, res) => {
    res.sendFile('./index.html', {root: __dirname});
})

app.get('/login.html', (req, res) => {
    res.sendFile('./login.html', {root: __dirname});
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect:'/index.html',
    failureFlash: true
}))

app.get('/signup.html', (req, res) => {
    res.sendFile('./signup.html', {root: __dirname});
})

app.post('/signup', urlencodedParser, async (req,res)=>{


    try{
        const hashedPassword = await bcrypt.hash(req.body.password, 10);


        var sql = "select * from info where email = ?";
        var values = [[req.body.name, req.body.email, hashedPassword]];
        var user_email = [[req.body.email]];

        db.query(sql, [user_email],function (err,result, fields){
            if (err) throw err;
            var not_unique = result.length;

            sql = "INSERT INTO info (Name, email, password) VALUES ?"

            
            if(not_unique == 0){
                db.query(sql, [values],function (err,result, fields){
                    if (err) throw err;
                    console.log("Number of records inserted: " + result.affectedRows);
                })    
            }
            else{
                console.log("duplicate");
            }
        })

        res.redirect('/login.html')
    }
    catch{
        res.redirect('/signup.html')
    }
    console.log(req.body.password);
})

app.use((req, res) => {
    res.sendFile('./404.html', {root: __dirname});
})


// method used to make sure the users email does not already exist in the database
function checker(req){
    var already_Exists = 0;
    db.connect(function(err,result){
        if(err) throw err;
        console.log("Connected!");
        var sql = "select * from info where email = ?"
        

        db.query(sql, [user_email], function(err, result){
            if(err) throw err;
            already_Exists = result.length;
            console.log('goes here');
            
        })
        return already_Exists;
         
    })
}
