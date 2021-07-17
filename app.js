// This app was initialized using this guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
const express        = require('express');
const expressLayouts = require('express-ejs-layouts');
const session        = require('express-session');

const app = express();
PORT      = process.env.PORT || 3000;

app.use(expressLayouts);
app.set('layout', './main-layout');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(session({secret: 'ThisIsASecret'}));

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

// Sign out
app.get('/sign-out', (rea, res) => {
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

// Workouts detail
app.get('/workouts/:workout_id', (req, res) => {
    res.render('workouts/detail');
});

// Workouts edit
app.get('/workouts/:workout_id/edit', (req, res) => {
    res.render('workouts/detail');
});

/*
    LISTENER
*/
app.listen(PORT, function(){
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
