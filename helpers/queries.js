exports.queries = {
  users: {
    select_all: 'SELECT userID, firstName, lastName, email FROM Users',
    find_by_id: 'SELECT userID, firstName, lastName, email FROM Users WHERE userID = ?'
  },
  workouts: {
    by_user_id: 'SELECT workoutID, date FROM Workouts WHERE userID = ?'
  }
}