var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;

var assert = require('assert');

var url = 'mongodb://localhost:27017/angularjsdb';

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use(express.static(__dirname + '/public'));
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/style', express.static(__dirname + '/style'));
app.use('/script', express.static(__dirname + '/script'));

MongoClient.connect(url, function (err, database) {
    if (err) {
        console.log("Error in connection");
        console.log(err);
    } else {
        console.log("Connected");
        db = database;
//        console.log(db);
    }
});
// Establish connection to db
var db = new Db('angularjsdb', new Server('localhost', 27017));

app.get('/', function (req, res) {

//    res.sendFile('home.html', {'root': __dirname + '/templates'});
    res.redirect('/index.html');
});

app.post('/userinfo', function (req, res) {
    var type = req.body.type;
    var user_fname = req.body.user.firstname;
    var user_lname = req.body.user.lastname;
    var user_email = req.body.user.email;
    var user_id = req.body.user.id;
    var id = req.body.id;


    db.open(function (err, db) {

        assert.equal(null, err);

        // Fetch the collections
        var userColl = db.collection("users");

        if (type == 'getUsers') {

        } else if (type == 'save_user') {

            if (user_fname == '' || user_lname == '' || user_email == '') {
                data = {'success': false, 'message': 'Required fields missing, Please enter and submit'};
                res.send(JSON.stringify(data));

            } else {
                if (typeof user_id !== 'undefined' && user_id != '') {

                    var qry = "UPDATE users SET `firstname` = '" + user_fname + "', `lastname` = '" + user_lname + "', `email` = '" + user_email + "' WHERE `users`.`id` = " + user_id + "";
//                var query = connection.query(qry, function (error, rows, fields) {
//                    if (error) {
//                        data = {'success': false, 'message': error.message};
//                        res.send(JSON.stringify(data));
//
//                    } else {
//                        data = {'success': true, 'message': 'User updated successfully.', 'id': user_id};
//                        res.send(JSON.stringify(data));
//                    }
//                });
//                console.log(query.sql);

                } else {

                    // Write a record into users collection
                    userColl.insert({firstname: user_fname, lastname: user_lname, email: user_email}, function (err, result) {

                        if (err) {
                            data = {'success': false, 'message': 'Error in query'};
                            res.send(JSON.stringify(data));
                        } else {
                            data = {'success': true, 'data': result};
                            res.send(JSON.stringify(data));
                        }

                    });
                }
            }
        } else if (type == 'delete_user') {

            var qry = "DELETE FROM `users` WHERE `id` = " + id + "";
//        var query = connection.query(qry, function (error, rows, fields) {
//            if (error) {
//                data = {'success': false, 'message': 'Error in query'};
//                res.send(JSON.stringify(data));
//
//            } else {
//                data = {'success': true, 'message': 'User deleted successfully.'};
//                res.send(JSON.stringify(data));
//            }
//        });
//        console.log(query.sql);
        }
        db.close();
    });

});


app.listen(4000, function () {
    console.log('Node server running @http://localhost:4000');
});
