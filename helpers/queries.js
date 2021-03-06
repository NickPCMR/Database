exports.queries = {
  users: {
    select_all: 'SELECT userID, firstName, lastName, email FROM Users',
    find_by_id: 'SELECT userID, firstName, lastName, email FROM Users WHERE userID = ?',
    delete_by_id: 'DELETE FROM Users WHERE userID = ?',
    edit_by_id: 'UPDATE Users SET email = ?, firstName = ?, lastName = ? WHERE userID = ?',
    find_by_email: 'SELECT userID, firstName, lastName, email FROM Users WHERE email = ?',
    create: 'INSERT INTO Users(email, firstName, lastName) VALUES (?, ?, ?)',
    search: {
      query: 'SELECT userID, firstName, lastName, email FROM Users WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ?',
      fields_count: 3
    }
  },
  workouts: {
    select_all: 'SELECT workoutID, date, description, userID FROM Workouts',
    find_by_id: 'SELECT workoutID, date, description, userID FROM Workouts WHERE workoutID = ?',
    delete_by_id: 'DELETE FROM Workouts WHERE workoutID = ?',
    edit_by_id: 'UPDATE Workouts SET date = ?, description = ?, userID = ? WHERE workoutID = ?',
    select_all_with_users: 'SELECT workoutID, date, description, email, firstName, lastName FROM Workouts INNER JOIN Users ON Workouts.userID = Users.userID',
    by_user_id: 'SELECT workoutID, date, description, userID FROM Workouts WHERE userID = ?',
    create: 'INSERT INTO Workouts(userID, date, description) VALUES (?, ?, ?)',
    search: {
      query: 'SELECT workoutID, date FROM Workouts WHERE date LIKE ? OR description LIKE ?',
      fields_count: 2
    }
  },
  exercises: {
    select_all: 'SELECT exerciseID, name, categoryID FROM Exercises',
    find_by_id: 'SELECT exerciseID, name, categoryID FROM Exercises WHERE exerciseID = ?',
    delete_by_id: 'DELETE FROM Exercises WHERE exerciseID = ?',
    edit_by_id: 'UPDATE Exercises SET name = ?, categoryID = ? WHERE exerciseID = ?',
    by_workout_id: 'SELECT Exercises.name, Exercises.exerciseID FROM Exercises JOIN WorkoutsExercises ON Exercises.exerciseID = WorkoutsExercises.exerciseID JOIN Workouts ON WorkoutsExercises.workoutID = Workouts.workoutID WHERE Workouts.workoutID = ?',
    add_to_workout: 'INSERT INTO WorkoutsExercises(workoutID, exerciseID) VALUES (?, ?)',
    remove_from_workout: 'DELETE FROM WorkoutsExercises WHERE workoutID = ? AND exerciseID = ?',
    create: 'INSERT INTO Exercises(name, categoryID) VALUES (?, ?)',
    by_category_id: 'SELECT exerciseID, name FROM Exercises WHERE categoryID = ?',
    for_equipment_id: 'SELECT Exercises.exerciseID, Exercises.name FROM Exercises JOIN ExercisesEquipment ON Exercises.exerciseID = ExercisesEquipment.exerciseID JOIN Equipment on ExercisesEquipment.equipmentID = Equipment.equipmentID WHERE Equipment.equipmentID = ?',
    search: {
      query: 'SELECT exerciseID, name FROM Exercises WHERE name LIKE ?',
      fields_count: 1
    }
  },
  equipment: {
    select_all: 'SELECT equipmentID, name FROM Equipment',
    find_by_id: 'SELECT equipmentID, name FROM Equipment WHERE equipmentID = ?',
    delete_by_id: 'DELETE FROM Equipment WHERE equipmentID = ?',
    edit_by_id: 'UPDATE Equipment SET name = ? WHERE equipmentID = ?',
    add_to_exercise: 'INSERT INTO ExercisesEquipment(exerciseID, equipmentID) VALUES (?, ?)',
    remove_from_exercise: 'DELETE FROM ExercisesEquipment WHERE exerciseID = ? AND equipmentID = ?',
    create: 'INSERT INTO Equipment (name) values (?)',
    by_exercise_id: 'SELECT Equipment.name, Equipment.equipmentID FROM Equipment JOIN ExercisesEquipment ON Equipment.equipmentID = ExercisesEquipment.equipmentID JOIN Exercises ON ExercisesEquipment.exerciseID = Exercises.exerciseID WHERE Exercises.exerciseID = ?',
    search: {
      query: 'SELECT equipmentID, name FROM Equipment WHERE name LIKE ?',
      fields_count: 1
    }
  },
  categories: {
    select_all: 'SELECT categoryID, name FROM Categories',
    find_by_id: 'SELECT categoryID, name FROM Categories WHERE categoryID = ?',
    delete_by_id: 'DELETE FROM Categories WHERE categoryID = ?',
    edit_by_id: 'UPDATE Categories SET name = ? WHERE categoryID = ?',
    create: 'INSERT INTO Categories (name) VALUES (?)',
    search: {
      query: 'SELECT categoryID, name FROM Categories WHERE name LIKE ?',
      fields_count: 1
    }
  }
}