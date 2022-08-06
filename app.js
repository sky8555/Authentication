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
const User = mongoose.model('User', userSchema);

// var secret = "My Secret";
// userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/login', function (req, res) {
    res.render('login');
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
