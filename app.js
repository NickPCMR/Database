// This app was initialized using this guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const ejsMate = require('ejs-mate');
const path = require('path');
const bodyParser = require('body-parser');

const mysql = require('./helpers/dbcon.js');

const app = express();
PORT = process.env.PORT || 3000;

app.engine('ejs', ejsMate)

app.use(expressLayouts);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('layout', './main-layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

/*
    ROUTES
*/

// Main index
app.get('/', (req, res) => {
    res.render('index');
});

// Search
app.get('/search', (req, res) => {
    res.render('search');
});

app.post('/search', (req, res) => {
    res.render('search-results');
});

///////////
// USERS //
///////////

// Users index
app.get('/users', (req, res, next) => {
    let data = { locals: {} };
    
    query = 'SELECT userID, firstName, lastName, email FROM Users';
    
    mysql.pool.query(query, (error, rows, _fields) => {
        data.locals.users = rows;
        
        res.render('users/index', data);
    });
});

// Users new

// Users detail
app.get('/users/:user_id', (req, res, next) => {
    let data = { locals: {} };
    const userId = req.params.user_id;
    
    user_query = 'SELECT userID, firstName, lastName, email FROM Users WHERE userID = ?';
    workouts_query = 'SELECT workoutID, date FROM Workouts WHERE userID = ?';
    
    mysql.pool.query(user_query, [userId], (error, rows, _fields) => {
        console.log(rows)
        if(rows.length > 0) {
            data.locals.user = rows[0];
            
            mysql.pool.query(workouts_query, [userId], (error, rows, _fields) => {
                data.locals.workouts = rows;
                console.log(data);
                
                res.render('users/detail', data);
            });
        } else {
            res.status(404);
            res.render('404');
        }
    });
});

//////////////
// Workouts //
//////////////

// Workouts index
app.get('/workouts', (req, res) => {
    res.render('workouts/index');
});

// Workouts new
app.get('/workouts/new', (req, res) => {
    res.render('workouts/new');
});

app.post('/workouts/new', (req, res) => {
    res.redirect('workouts/index')
})

// Workouts detail
app.get('/workouts/:workout_id', (req, res) => {
    res.render('workouts/detail');
});

// Workouts edit
app.get('/workouts/:workout_id/edit', (req, res) => {
    res.render('workouts/edit');
});

app.post('/workouts/:workout_id/edit', (req, res) => {
    res.redirect('/workouts/1');
});

// Add exercise to workout
app.post('/workouts/:workout_id/exercises', (req, res) => {
    res.redirect('/workouts/1');
});

// Remove exercise from workout
app.delete('/workouts/:workout_id/exercises/:exercise_id', (req, res) => {
});

///////////////
// Exercises //
///////////////

// Exercises index
app.get('/exercises', (req, res) => {
    res.render('exercises/index');
});

// Exercises new
app.get('/exercises/new', (req, res) => {
    res.render('exercises/new');
});

app.post('/exercises/new', (req, res) => {
    res.redirect('/exercises/1');
});

// Exercises detail
app.get('/exercises/:exercise_id', (req, res) => {
    res.render('exercises/detail');
});

// Exercises edit
app.get('/exercises/:exercise_id/edit', (req, res) => {
    res.render('exercises/edit');
});

app.post('/exercises/:exercise_id', (req, re) => {
    res.redirect('/exercises/1');
});

// Add equipment to exercise
app.post('/exercises/:exercise_id/equipment', (req, res) => {
    res.redirect('/exercises/1');
});

// Remove exercise from workout
app.delete('/exercises/:exercise_id/equipment/:equipmentid', (req, res) => {
});

///////////////
// Equipment //
///////////////

// Equipment index
app.get('/equipment', (req, res) => {
    res.render('equipment/index');
});

// Equipment new
app.get('/equipment/new', (req, res) => {
    res.render('equipment/new');
});

app.post('/equipment/new', (req, res) => {
    res.redirect('/equipment/1');
});

// Equipment detail
app.get('/equipment/:equipment_id', (req, res) => {
    res.render('equipment/detail');
});

// Equipment edit
app.get('/equipment/:equipment_id/edit', (req, res) => {
    res.render('equipment/edit');
});

app.post('/equipment/:equipment_id', (req, re) => {
    res.redirect('/equipment/1');
});

////////////////
// Categories //
////////////////

// Categories index
app.get('/categories', (req, res) => {
    res.render('categories/index');
});

// Categories new
app.get('/categories/new', (req, res) => {
    res.render('categories/new');
});

app.post('/categories/new', (req, res) => {
    res.redirect('/categories/1');
});

// Categories detail
app.get('/categories/:category_id', (req, res) => {
    res.render('categories/detail');
});

// Categories edit
app.get('/categories/:category_id/edit', (req, res) => {
    res.render('categories/edit');
});

app.post('/categories/:category_id/edit', (req, res) => {
    res.redirect('/categories/1');
});

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
