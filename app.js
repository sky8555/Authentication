const express = require('express');
const bodyParser = require('body-parser');  
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});


var secret = "MySecret";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);

app.get('/', function (req, res) {
    res.render('home');
});

//chained routes
app.route('/login')
.get(function (req, res) {
    res.render('login');
})
.post(function (req, res) {
    const userName = req.body.username;
    const passWord = req.body.password;
    User.findOne({email : userName}, function (err, foundUser) {
        if (err){
            console.log(err);
        } else {
            if(foundUser.password === passWord){
                res.render('secrets');
            } 
            else {
                res.status(401).send('Invalid username or password.');

            }
        }
    });
});
// chained route handlers
app.route('/register')
.get (function (req, res) {
    res.render('register');
})
.post (function (req, res) {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password 
    });
    newUser.save(function (err){
        if (err) { 
            console.log(err);
        } else {
            res.render('secrets');
        }
    });
}
);

app.listen(3000, function(req,res){
    console.log('Server running at http://localhost:3000');
});
