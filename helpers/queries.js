exports.queries = {
  users: {
    select_all: 'SELECT userID, firstName, lastName, email FROM Users',
    find_by_id: 'SELECT userID, firstName, lastName, email FROM Users WHERE userID = ?',
    delete_by_id: 'DELETE FROM Users WHERE userID = ?',
    find_by_email: 'SELECT userID, firstName, lastName, email FROM Users WHERE email = ?',
    create: 'INSERT INTO Users(email, firstName, lastName) VALUES (?, ?, ?)'
  },
  workouts: {
    by_user_id: 'SELECT workoutID, date FROM Workouts WHERE userID = ?'
  }
}