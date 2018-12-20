/*jshint esversion: 6 */
/**
 * Requires all the needed libaries to this application
 * @type {{_connectionListener, METHODS, STATUS_CODES, Agent, ClientRequest, globalAgent, IncomingMessage, OutgoingMessage, Server, ServerResponse, createServer, get, request}|*}
 */
const http = require("http");
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const pug = require('pug');
const methodOverride = require('method-override');
const app = express();

/**
 * Starts the mysql connection to the database
 * @type {Connection}
 */
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "db_node_stephan"
});

/**
 * Defines the view engine
 */
app.set('view engine', 'pug');

/**
 * Creates the connection and tells the application if the connection is made
 */
connection.connect(function (err) {
    if (err) throw err;
    console.log('You are now connected with mysql database...');
});

/**
 * Makes it able to use the methods put and delete
 */
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.set('views', __dirname + '/public/views/');

/**
 * Creates all the basic routing
 */
app.get('/tasks', function (req, res) {
    connection.query('SELECT * FROM tasks', function (error, results, fields) {
        res.render('tasks', {title: 'Taken', database: results});
        // if (error) throw error;
        // res.end(JSON.stringify(results));
    });
});

app.get('/task/:id', function (req, res) {
    connection.query('SELECT * FROM tasks WHERE id=?', [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.render('edit', {title: 'Edit', note: results});
        // res.end(JSON.stringify(results));
    });
});

app.post('/task', function (req, res) {
    let params = req.body;
    connection.query('INSERT INTO tasks SET ?', params, function (error, results, fields) {
        if (error) throw error;
        res.redirect('/');
    });
});

app.put('/task', function (req, res) {
    connection.query('UPDATE `tasks` SET `title`=? where `Id`=?', [req.body.title, req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.redirect('tasks');
        // res.end(JSON.stringify(results));
    });
});

app.delete('/task', function (req, res) {
    connection.query('DELETE FROM `tasks` WHERE `Id`=?', [req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.redirect('tasks');
    });
});

app.get('/', function (req, res) {
    res.render('index', {title: 'Home Page'});
});

//create app server
// const server = app.listen(10987);
app.listen(3333);