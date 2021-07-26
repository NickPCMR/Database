--++--++--++--++--++--++--++--++--++--++--++--++
-- Example queries for Workout App operations --
--++--++--++--++--++--++--++--++--++--++--++--++

-- Note: the ':' character in all of the following queries denotes a variable
-- placeholder and will be replaced by actual data in the real implementation.

-----------
-- Users --
-----------

-- User create
INSERT INTO Users(email, firstName, lastName)
VALUES (:email, :firstName, :lastName);

-- User find/sign-in
SELECT userID, email, firstName, lastName
FROM Users
WHERE email = :email;

--------------
-- Workouts --
--------------

-- Workouts owned by user, descending order by date, limit to 5
SELECT workoutID, `date`
FROM Workouts
WHERE userID = :userID
ORDER BY `date` DESC
LIMIT 5;

-- Workout by workoutID and guard against users seeing non-owned workouts by
-- also selecting by userID foreign key for the requesting user.
SELECT `date`
FROM Workouts
WHERE userID = :userID
AND workoutID = :workoutID;

-- All associated exercises for the given workout
SELECT ExerciseID, name
FROM Exercises
WHERE workoutID = :workoutID;

-- Edit an existing workout
UPDATE Workouts
SET `date` = :date
WHERE workoutID = :workoutID;

-- Create a workout
INSERT INTO Workouts(`date`, userID)
VALUES (:date, :userID);

-- Add an exercise association to the given workout
INSERT INTO WorkoutsExercises(workoutID, exerciseID)
VALUES (:workoutID, :exerciseID);

-- Remove an exercise association from the given workout
DELETE FROM WorkoutsExercises
WHERE workoutID = :workoutID
AND exerciseID = :exerciseID;

-- Get associated exercises for the given workout
SELECT Exercises.name, Exercises.exerciseID
FROM Exercises
JOIN WorkoutsExercises
ON Exercises.exerciseID = WorkoutsExercises.exerciseID
JOIN Workouts
ON WorkoutsExercises.workoutID = Workouts.workoutID
WHERE Workouts.workoutID = :workoutID;

-- Search workouts by date
SELECT workoutID, `date`
FROM Workouts
WHERE `date` = :date
LIMIT 5;

---------------
-- Exercises --
---------------

-- Select id and name of the 5 most popular exercises descending order from most
-- (they appear in the most workouts).
-- Query source: https://stackoverflow.com/questions/12235595/find-most-frequent-value-in-sql-column
SELECT exerciseID, name
FROM Exercises
WHERE exerciseID IN (
  SELECT exerciseID
  FROM WorkoutsExercises
  GROUP BY exerciseID
  ORDER BY COUNT(exerciseID) DESC
)
LIMIT 5;

-- Exercise by exerciseID
SELECT `name`, `description`
FROM Exercises
WHERE exerciseID = :exerciseID;

-- Edit an existing exercise
UPDATE Exercises
SET `name` = :name, `description` = :description, categoryID = :categoryID
WHERE exerciseID = :exerciseID;

-- Create an exercise
INSERT INTO Exercises(`name`, `description`, categoryID)
VALUES (:name, :description, :categoryID);

-- Add an equipment association to the given exercise
INSERT INTO ExercisesEquipment(exerciseID, equipmentID)
VALUES (:exerciseID, :equipmentID);

-- Remove an equipment association from the given exercise
DELETE FROM ExercisesEquipment
WHERE exerciseID = :exerciseID
AND equipmentID = :equipmentID;

-- Get associated equipment for the given exercise
SELECT Equipment.name, Equipment.equipmentID
FROM Equipment
JOIN ExercisesEquipment
ON Equipment.equipmentID = ExercisesEquipment.equipmentID
JOIN Exercises
ON ExercisesEquipment.exerciseID = Exercises.exerciseID
WHERE Exercises.exerciseID = :exerciseID;

-- Select exercises by categoryID
SELECT `name`, exerciseID
FROM Exercises
WHERE categoryID = :categoryID

-- Search Exercises
SELECT `name`, exerciseID
FROM Exercises
WHERE `name` LIKE "%:search-term%"
LIMIT 5;

---------------
-- Equipment --
---------------

-- Select id and name of the 5 most popular pieces of equipment descending order
-- from most (they appear in the most exercises).
-- Query source: https://stackoverflow.com/questions/12235595/find-most-frequent-value-in-sql-column
SELECT equipmentID, name
FROM Equipment
WHERE equipmentID IN (
  SELECT equipmentID
  FROM ExercisesEquipment
  GROUP BY equipmentID
  ORDER BY COUNT(equipmentID) DESC
)
LIMIT 5;

-- Exercise by equipmentID
SELECT `name`, `description`
FROM Equipment
WHERE equipmentID = :equipmentID;

-- Edit existing equipment
UPDATE Equipment
SET `name` = :name, `description` = :description
WHERE equipmentID = :equipmentID;

-- Create equipment
INSERT INTO Equipment(`name`, `description`)
VALUES (:name, :description);

-- Search Equipment
SELECT `name`, equipmentID
FROM Equipment
WHERE `name` LIKE "%:search-term%"
LIMIT 5;

----------------
-- Categories --
----------------

-- Select name and categoryID of all categories
SELECT `name`, categoryID
FROM Categories;

-- Category by categoryID
SELECT `name`
FROM Categories
WHERE categoryID = :categoryID;

-- Edit existing category
UPDATE Categories
SET `name` = :name
WHERE categoryID = :categoryID;

-- Create category
INSERT INTO Categories(`name`)
VALUES (:name);

-- Search Categories
SELECT `name`
FROM Categories
WHERE `name` LIKE "%:search-term%"
LIMIT 5;

