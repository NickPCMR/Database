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
    const description = req.body.description;
    
    if(userId && date) {
        workouts_create_query = queries.workouts.create;
        
        db.pool.query(workouts_create_query, [userId, date, description], (error, results, fields) => {
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
    let data = { locals: {} };
    if(req.query.success) {
        data.locals.success = req.query.success;
    }
    
    if(req.query.error) {
        data.locals.error = req.query.error;
    }

    const workoutId = req.params.workout_id;

    workout_query = queries.workouts.find_by_id;

    db.pool.query(workout_query, [workoutId], (error, rows, _fields) => {
        if(!error) {
            if(rows.length > 0) {
                data.locals.workout = rows[0];
                
                exercises_by_workout_query = queries.exercises.by_workout_id;
                
                db.pool.query(exercises_by_workout_query, [workoutId], (error, rows, _fields) => {
                    if(!error) {
                        data.locals.workoutExercises = rows;
                        
                        all_exercises_query = queries.exercises.select_all;
                        
                        db.pool.query(all_exercises_query, (error, rows, _fields) => {
                            if(!error) {
                                data.locals.allExercises = rows;
                                
                                res.render('workouts/detail', data);
                            } else {
                                data.locals.error = error;
                                res.status(500);
                                res.render('500', data);
                            }
                        });
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

// Workouts edit
app.get('/workouts/:workout_id/edit', (req, res) => {
    let data = { locals: {} };
    if(req.query.error) {
        data.locals.error = req.query.error;
    }

    const workoutId = req.params.workout_id;

    workout_query = queries.workouts.find_by_id;

    db.pool.query(workout_query, [workoutId], (error, rows, _fields) => {
        if(!error) {
            if(rows.length > 0) {
                data.locals.workout = rows[0];
                let year = data.locals.workout.date.getFullYear();
                let day = data.locals.workout.date.getDate();
                let month = data.locals.workout.date.getMonth() + 1;
                
                if(day < 10) {
                    day = `0${day}`;
                }
                
                if(month < 10) {
                    month = `0${month}`
                }
                
                const formattedDate = `${year}-` + `${month}-` + `${day}`;
                data.locals.workout.formattedDate = formattedDate;
                
                users_query = queries.users.select_all;
                
                db.pool.query(users_query, (error, rows, _fields) => {
                    if(!error) {
                        data.locals.users = rows;
                        res.render('workouts/edit', data);
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

app.post('/workouts/:workout_id/edit', (req, res) => {
    let data = { locals: {} };
    
    const workoutId = req.params.workout_id;
    const userId = req.body.userId;
    const date = req.body.date;
    const description = req.body.description;
    
    if(userId && date) {
        workout_edit_query = queries.workouts.edit_by_id;
        
        db.pool.query(workout_edit_query, [date, description, userId, workoutId], (error, results, fields) => {
            if(!error) {
                res.redirect(`/workouts/${workoutId}?success=${encodeURIComponent('Workout updated successfully')}`);
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
});

// Add exercise to workout
app.post('/workouts/:workout_id/exercises', (req, res) => {
    let data = { locals: {} };
    
    const workoutId = req.params.workout_id;
    const exerciseId = req.body.exerciseId;
    
    if(workoutId && exerciseId) {
        add_exercise_query = queries.exercises.add_to_workout;
        
        db.pool.query(add_exercise_query, [workoutId, exerciseId], (error, results, fields) => {
            if(!error) {
                res.redirect(`/workouts/${workoutId}?success=${encodeURIComponent('Exercise added successfully')}`);
            } else if(error.message.match(/Duplicate entry/)){
                res.status(400);
                res.redirect(`/workouts/${workoutId}?error=${encodeURIComponent('Exercise already added to workout')}`);
            } else {
                data.locals.error = error;
                res.status(500);
                res.render('500', data);
            }
        });
    } else {
        res.status(400);
        res.redirect(`/workouts/${workoutId}?error=${encodeURIComponent('Workout ID and Exercise ID are required')}`);
    }
});

// Remove exercise from workout
app.delete('/workouts/:workout_id/exercises/:exercise_id', (req, res) => {
    let data = { locals: {} };
    const workoutId = req.params.workout_id;
    const exerciseId = req.params.exercise_id;
    
    remove_exercise_query = queries.exercises.remove_from_workout;
    
    db.pool.query(remove_exercise_query, [workoutId, exerciseId], (error, rows, _fields) => {
        if(!error) {
            res.sendStatus(204);
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
});

// Workouts delete
app.delete('/workouts/:workout_id', (req, res) => {
    let data = { locals: {} };
    const workoutId = req.params.workout_id;
    
    workout_delete_query = queries.workouts.delete_by_id;
    
    db.pool.query(workout_delete_query, [workoutId], (error, rows, _fields) => {
        if(!error) {
            res.sendStatus(204);
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
});

///////////////
// Exercises //
///////////////

// Exercises index
app.get('/exercises', (req, res) => {
    let data = { locals: {} };
    if(req.query.success) {
        data.locals.success = req.query.success;
    }
    
    exercises_query = queries.exercises.select_all;
    
    db.pool.query(exercises_query, (error, rows, _fields) => {
        if(!error) {
            data.locals.exercises = rows;
            res.render('exercises/index', data);
        } else {
            data.locals.error = error;
            res.status(500);
            res.render('500', data);
        }
    });
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
    let data = { locals: {} };
    if(req.query.success) {
        data.locals.success = req.query.success;
    }
    
    if(req.query.error) {
        data.locals.error = req.query.error;
    }

    const exerciseId = req.params.exercise_id;

    exercise_query = queries.exercises.find_by_id_with_category;

    db.pool.query(exercise_query, [exerciseId], (error, rows, _fields) => {
        if(!error) {
            if(rows.length > 0) {
                data.locals.exercise = rows[0];
                
                equipment_by_exercise_query = queries.equipment.by_exercise_id;
                
                db.pool.query(equipment_by_exercise_query, [exerciseId], (error, rows, _fields) => {
                    if(!error) {
                        data.locals.exerciseEquipment = rows;
                        
                        all_equipment_query = queries.equipment.select_all;
                        
                        db.pool.query(all_equipment_query, (error, rows, _fields) => {
                            if(!error) {
                                data.locals.allEquipment = rows;
                                
                                res.render('exercises/detail', data);
                            } else {
                                data.locals.error = error;
                                res.status(500);
                                res.render('500', data);
                            }
                        });
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

// Remove equipment from exercise
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
