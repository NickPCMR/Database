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
    select_all: 'SELECT workoutID, date, description FROM Workouts',
    select_all_with_users: 'SELECT workoutID, date, description, email, firstName, lastName FROM Workouts INNER JOIN Users ON Workouts.userID = Users.userID',
    by_user_id: 'SELECT workoutID, date, description FROM Workouts WHERE userID = ?',
    create: 'INSERT INTO Workouts(userID, date) VALUES (?, ?)'
  }
}