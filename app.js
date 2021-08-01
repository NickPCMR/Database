// This app was initialized using this guide: https://github.com/osu-cs340-ecampus/nodejs-starter-app

/*
    SETUP
*/
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const ejsMate = require('ejs-mate');
const path = require('path');
const bodyParser = require('body-parser');

const db = require('./database/dbcon.js');
const queryHelper = require('./helpers/queries.js');
const queries = queryHelper.queries;

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
// TODO
app.get('/search', (req, res) => {
    res.render('search');
});

// TODO
app.post('/search', (req, res) => {
    res.render('search-results');
});

///////////
// USERS //
///////////

// Users index
app.get('/users', (req, res) => {
    let data = { locals: {} };
    if(req.query.success) {
        data.locals.success = req.query.success;
    }
    
    users_query = queries.users.select_all;
    
    db.pool.query(users_query, (error, rows, _fields) => {
        data.locals.users = rows;
        
        res.render('users/index', data);
    });
});

// Users new
app.get('/users/new', (req, res) => {
    res.render('users/new');
});

app.post('/users/new', (req, res) => {
    let data = { locals: {} };
    if(req.query.error) {
        data.locals.error = req.query.error;
    }
    
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    
    if(email && firstName && lastName) {
        create_query = queries.users.create;
        
        db.pool.query(create_query, [email, firstName, lastName], (error, results, _fields) => {
            if(!error) {
                const userId = results.insertId;
                res.redirect(`/users/${userId}?success=${encodeURIComponent('User created successfully')}`);
            } else if(error.message.match(/Duplicate entry/)){
                res.status(400);
                data.locals.error = "Email is already taken.";
                res.render('users/new', data);
            } else {
                data.locals.error = error;
                res.status(500);
                res.render('500', data);
            }
        });
    } else {
        res.status(400);
        res.render('users/new', { locals: { error: 'Email, First Name and Last Name are required.' } });
    }
});

// Users detail
app.get('/users/:user_id', (req, res, next) => {
    let data = { locals: {} };
    if(req.query.success) {
        data.locals.success = req.query.success;
    }
    
    const userId = req.params.user_id;
    
    user_query = queries.users.find_by_id;
    workouts_query = queries.workouts.by_user_id;
    
    db.pool.query(user_query, [userId], (error, rows, _fields) => {
        if(!error) {
            if(rows.length > 0) {
                data.locals.user = rows[0];
                
                db.pool.query(workouts_query, [userId], (error, rows, _fields) => {
                    if(!error) {
                        data.locals.workouts = rows;
                        
                        res.render('users/detail', data);
                    } else {
                        data.locals.error = error;
                        res.status(500);
                        res.render('500', data);
                    }
                });
            } else {
                res.status(404);
                res.render('404');
            }
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
});

// Users edit
app.get('/users/:user_id/edit', (req, res) => {
    let data = { locals: {} };
    
    const userId = req.params.user_id;
    
    user_query = queries.users.find_by_id;
    
    db.pool.query(user_query, [userId], (error, rows, _fields) => {
        if(!error) {
            if(rows.length > 0) {
                data.locals.user = rows[0];
                
                res.render('users/edit', data);
            } else {
                res.status(404);
                res.render('404');
            }
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
});

app.post('/users/:user_id/edit', (req, res) => {
    let data = { locals: {} };
    
    const userId = req.params.user_id;
    
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    
    const userData = {
        userID: userId,
        email: email,
        firstName: firstName,
        lastName: lastName
    };
    
    if(email && firstName && lastName) {
        user_edit_query = queries.users.edit_by_id;
        
        db.pool.query(user_edit_query, [email, firstName, lastName, userId], (error, rows, _fields) => {
            if(!error) {
                find_by_id_query = queries.users.find_by_id;
                
                db.pool.query(find_by_id_query, [userId], (error, rows, _fields) => {
                    if(!error) {
                        res.redirect(`/users/${rows[0].userID}?success=${encodeURIComponent('User updated successfully')}`);
                    } else {
                        data.locals.error = error;
                        res.status(500);
                        res.render('500', data);
                    }
                });
            } else if(error.message.match(/Duplicate entry/)){
                res.status(400);
                data.locals.error = "Email is already taken.";
                data.locals.user = userData;
                res.render('users/edit', data);
            } else {
                data.locals.error = error;
                res.status(500);
                res.render('500', data);
            }
        });
    } else {
        res.status(400);
        data.locals.error = 'Email, First Name and Last Name are required';
        data.locals.user = userData;
        res.render('users/edit', data);
    }
});

// Users delete
app.delete('/users/:user_id', (req, res) => {
    let data = { locals: {} };
    const userId = req.params.user_id;
    
    user_delete_query = queries.users.delete_by_id;
    
    db.pool.query(user_delete_query, [userId], (error, rows, _fields) => {
        if(!error) {
            res.sendStatus(204);
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
});

//////////////
// Workouts //
//////////////

// Workouts index
app.get('/workouts', (req, res) => {
    let data = { locals: {} };
    if(req.query.success) {
        data.locals.success = req.query.success;
    }
    
    workouts_query = queries.workouts.select_all_with_users;
    
    db.pool.query(workouts_query, (error, rows, _fields) => {
        if(!error) {
            data.locals.workouts = rows;
            res.render('workouts/index', data);
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
});

// Workouts new
app.get('/workouts/new', (req, res) => {
    let data = { locals: {} };
    
    users_query = queries.users.select_all;
    
    db.pool.query(users_query, (error, rows, _fields) => {
        if(!error) {
            if(rows.length > 0) {
                data.locals.users = rows;
                res.render('workouts/new', data);
            } else {
                res.redirect(`/users/new?error=${encodeURIComponent("Must create a user before creating a workout")}`);
            }
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
});

app.post('/workouts/new', (req, res) => {
    let data = { locals: {} };
    
    const userId = req.body.userId;
    const date = req.body.date;
    
    if(userId && date) {
        workouts_create_query = queries.workouts.create;
        
        db.pool.query(workouts_create_query, [userId, date], (error, results, fields) => {
            if(!error) {
                const workoutId = results.insertId;
                res.redirect(`/workouts/${workoutId}?success=${encodeURIComponent('Workout created successfully')}`);
            } else {
                data.locals.error = error;
                res.status(500);
                res.render('500', data);
            }
        });
    } else {
        res.status(400);
        res.render('workouts/new', { locals: { error: 'User and Date are required' } });
    }
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
