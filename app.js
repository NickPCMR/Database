// This app was initialized using this guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const path = require('path');

const app = express();
PORT = process.env.PORT || 3000;

app.engine('ejs', ejsMate)
app.use(expressLayouts);
app.set('layout', './main-layout');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'));

app.use(session({ secret: 'ThisIsASecret' }));

/*
    ROUTES
*/

// Main index
app.get('/', (req, res) => {
    // if(!req.session.email){
    res.render('sign-in');
    // }
    // else{
    //     res.redirect('/workouts');
    // }
});

// Sign in
app.post('/sign-in', (req, res) => {
    res.redirect('/workouts');
});

// Sign up
app.get('/sign-up', (req, res) => {
    res.render('sign-up');
});

app.post('/sign-up', (req, res) => {
    res.redirect('/workouts');
});

// Sign out
app.get('/sign-out', (req, res) => {
    res.redirect('/');
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

// Add exercise to workout
app.post('/workouts/:workout_id/exercises/:exercise_id', (req, res) => {
    res.render('workouts/detail');
});

// Remove exercise from workout
app.delete('/workouts/:workout_id/exercises/:exercise_id', (req, res) => {
    res.render('workouts/detail');
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
    res.render('exercises/detail');
});

// Exercises detail
app.get('/exercises/:exercise_id', (req, res) => {
    res.render('exercises/detail');
});

// Exercises edit
app.get('/exercises/:exercise_id/edit', (req, res) => {
    res.render('exercises/edit');
});

app.put('/exercises/:exercise_id', (req, re) => {
    res.render('exercises/detail');
});

/*
    LISTENER
*/
app.listen(PORT, function () {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
