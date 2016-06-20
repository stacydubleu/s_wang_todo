/*Using Express/PostgreSQL, create a ToDo app. The ToDo app should provide a view that allows a user to add ToDo items and check them off when they are finished.
* You will need a database with a todo table
* Make sure your view has a clear user interface (this can be simple)
* Feel free to push this further (ajax calls, apis,...)
Use appropriate git commits, push to GitHub, and submit your link*/

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// body-parser for url encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// postgres db setup
var promise = require('bluebird');
var options = {
    promiseLib: promise
};
var pgp = require('pg-promise')(options);
// create an instance of the database
var db = pgp('postgres://localhost:5432/todolist');

/*  "/users/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */

app.get('/', function(req,res,next){
    db.any('SELECT * FROM lists')
        .then(function (data) {
      res.render('index', { data:data});
    })
    .catch(function (err) {
      return next(err);
    });
});


app.get('/list/:id', function(req, res, next) {
    var listID = parseInt(req.params.id);
     //db.one expects a single row
   db.one('SELECT * FROM lists WHERE id = $1', listID)
     .then(function (data) {
      res.render('show', {lists:data.lists} );
     })
     .catch(function (err) {
       return next(err);
     });
});

app.post('/',function(req,res,next){
  var newList = req.body;
  // expects no rows
  db.none('INSERT INTO lists(title) VALUES(${listname})',
    req.body)
  .then(function(){
    res.redirect('/');
  })
  .catch(function (err){
    return next(err);
  }); 
});

app.listen(3000, function(){
    console.log('listening on port 3000')
})