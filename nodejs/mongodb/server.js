var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({extended: true})); // support encoded bodies

app.use(express.static(__dirname + '/public'));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'angularjs'
});

connection.connect(function (error) {
    if (!!error) {
        console.log('Error');
    } else {
        console.log('Connected');
    }
});
app.use('/node_modules', express.static(__dirname + '/node_modules'));
app.use('/style', express.static(__dirname + '/style'));
app.use('/script', express.static(__dirname + '/script'));

app.get('/', function (req, res) {

//    res.sendFile('home.html', {'root': __dirname + '/templates'});
    res.redirect('/index.html');
});

app.post('/userinfo', function (req, res) {
    var type = req.body.type;

    if (type == 'getUsers') {
        connection.query('select * from users', function (error, rows, fields) {
            if (!!error) {
                data = {'success': false, 'message': 'Error in query'};
                res.send(JSON.stringify(data));

            } else {
                data = {'success': true, 'data': rows};
                res.send(JSON.stringify(data));
            }
        });
    } else if (type == 'save_user') {

        var user_fname = req.body.user.firstname;
        var user_lname = req.body.user.lastname;
        var user_email = req.body.user.email;
        var user_id = req.body.user.id;

        if (user_fname == '' || user_lname == '' || user_email == '') {
            data = {'success': false, 'message': 'Required fields missing, Please enter and submit'};
            res.send(JSON.stringify(data));

        } else {
            if (typeof user_id !== 'undefined' && user_id != '') {

                var qry = "UPDATE users SET `firstname` = '" + user_fname + "', `lastname` = '" + user_lname + "', `email` = '" + user_email + "' WHERE `users`.`id` = " + user_id + "";
                var query = connection.query(qry, function (error, rows, fields) {
                    if (error) {
                        data = {'success': false, 'message': error.message};
                        res.send(JSON.stringify(data));

                    } else {
                        data = {'success': true, 'message': 'User updated successfully.', 'id': user_id};
                        res.send(JSON.stringify(data));
                    }
                });
                console.log(query.sql);

            } else {


                var user = {firstname: user_fname, lastname: user_lname, email: user_email};
                connection.query("INSERT INTO users SET ?", user, function (error, response) {
                    if (error) {
                        data = {'success': false, 'message': error.message};
                        res.send(JSON.stringify(data));
                    } else {
                        data = {'success': true, 'message': 'User inserted successfully.', 'id': response.insertId};
                        res.send(JSON.stringify(data));
                    }
                });
            }
        }
    } else if (type == 'delete_user') {
        var id = req.body.id;
        var qry = "DELETE FROM `users` WHERE `id` = " + id + "";
        var query = connection.query(qry, function (error, rows, fields) {
            if (error) {
                data = {'success': false, 'message': 'Error in query'};
                res.send(JSON.stringify(data));

            } else {
                data = {'success': true, 'message': 'User deleted successfully.'};
                res.send(JSON.stringify(data));
            }
        });
        console.log(query.sql);
    }

});


app.listen(3000, function () {
    console.log('Node server running @http://localhost:3000')
});