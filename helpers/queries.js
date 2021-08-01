exports.queries = {
  users: {
    select_all: 'SELECT userID, firstName, lastName, email FROM Users',
    find_by_id: 'SELECT userID, firstName, lastName, email FROM Users WHERE userID = ?',
    delete_by_id: 'DELETE FROM Users WHERE userID = ?',
    edit_by_id: 'UPDATE Users SET email = ?, firstName = ?, lastName = ? WHERE userID = ?',
    find_by_email: 'SELECT userID, firstName, lastName, email FROM Users WHERE email = ?',
    create: 'INSERT INTO Users(email, firstName, lastName) VALUES (?, ?, ?)'
  },
  workouts: {
    select_all: 'SELECT workoutID, date, description, userID FROM Workouts',
    find_by_id: 'SELECT workoutID, date, description, userID FROM Workouts WHERE workoutID = ?',
    delete_by_id: 'DELETE FROM Workouts WHERE workoutID = ?',
    edit_by_id: 'UPDATE Workouts SET date = ?, description = ?, userID = ? WHERE workoutID = ?',
    select_all_with_users: 'SELECT workoutID, date, description, email, firstName, lastName FROM Workouts INNER JOIN Users ON Workouts.userID = Users.userID',
    by_user_id: 'SELECT workoutID, date, description, userID FROM Workouts WHERE userID = ?',
    create: 'INSERT INTO Workouts(userID, date, description) VALUES (?, ?, ?)'
  },
  exercises: {
    select_all: 'SELECT exerciseID, name, categoryID FROM Exercises',
    find_by_id: 'SELECT exerciseID, name, categoryID FROM Exercises WHERE exerciseID = ?',
    delete_by_id: 'DELETE FROM Exercises WHERE exerciseID = ?',
    edit_by_id: 'UPDATE Exercises SET name = ?, categoryID = ? WHERE exerciseID = ?',
    by_workout_id: 'SELECT Exercises.name, Exercises.exerciseID FROM Exercises JOIN WorkoutsExercises ON Exercises.exerciseID = WorkoutsExercises.exerciseID JOIN Workouts ON WorkoutsExercises.workoutID = Workouts.workoutID WHERE Workouts.workoutID = ?',
    add_to_workout: 'INSERT INTO WorkoutsExercises(workoutID, exerciseID) VALUES (?, ?)',
    remove_from_workout: 'DELETE FROM WorkoutsExercises WHERE workoutID = ? AND exerciseID = ?',
    create: 'INSERT INTO Exercises(name, categoryID) VALUES (?, ?)'
  },
  equipment: {
    select_all: 'SELECT equipmentID, name FROM Equipment',
    find_by_id: '',
    by_exercise_id: 'SELECT Equipment.name, Equipment.equipmentID FROM Equipment JOIN ExercisesEquipment ON Equipment.equipmentID = ExercisesEquipment.equipmentID JOIN Exercises ON ExercisesEquipment.exerciseID = Exercises.exerciseID WHERE Exercises.exerciseID = ?',
    delete_by_id: '',
    add_to_exercise: 'INSERT INTO ExercisesEquipment(exerciseID, equipmentID) VALUES (?, ?)',
    remove_from_exercise: 'DELETE FROM ExercisesEquipment WHERE exerciseID = ? AND equipmentID = ?'
  },
  categories: {
    select_all: 'SELECT categoryID, name FROM Categories',
    find_by_id: 'SELECT categoryID, name FROM Categories WHERE categoryID = ?'
  }
}