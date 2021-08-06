--++--++--++--++--++--++--++--++--++--++--++--++
-- Example queries for Workout App operations --
--++--++--++--++--++--++--++--++--++--++--++--++

-- Note: the ':' character in all of the following queries denotes a variable
-- placeholder and will be replaced by actual data in the real implementation.

-----------
-- Users --
-----------

-- Select All
SELECT userID, firstName, lastName, email
FROM Users;

-- Find by id
SELECT userID, firstName, lastName, email
FROM Users
WHERE userID = :userID;

-- Delete by id
DELETE FROM Users
WHERE userID = :userID;

-- Update by id
UPDATE Users
SET email = :email, firstName = :firstName, lastName = :lastName
WHERE userID = :userID;

-- Find by email
SELECT userID, firstName, lastName, email
FROM Users
WHERE email = :email;

-- Create
INSERT INTO Users(email, firstName, lastName)
VALUES (:email, :firstName, :lastName);

-- Search
SELECT userID, firstName, lastName, email
FROM Users
WHERE firstName
LIKE "%:searchText%"
OR lastName LIKE "%:searchText%"
OR email LIKE  "%:searchText%";

--------------
-- Workouts --
--------------

-- Select all
SELECT workoutID, `date`, description, userID
FROM Workouts;

-- Find by id
SELECT workoutID, `date`, description, userID
FROM Workouts
WHERE workoutID = :workoutID;

-- Delete by id
DELETE FROM Workouts
WHERE workoutID = :workoutID;

-- Update by id
UPDATE Workouts
SET `date` = :date, description = :description, userID = :userID
WHERE workoutID = :workoutID;

-- Select all with users
SELECT workoutID, `date`, description, email, firstName, lastName
FROM Workouts
INNER JOIN Users
ON Workouts.userID = Users.userID;

-- Select by userID
SELECT workoutID, `date`, description, userID
FROM Workouts
WHERE userID = :userID;

-- Create
INSERT INTO Workouts(userID, `date`, description)
VALUES (:userID, :date, :description);

-- Search
SELECT workoutID, `date`
FROM Workouts
WHERE `date`
LIKE "%:searchText%"
OR description LIKE "%:searchText%";

---------------
-- Exercises --
---------------

-- Select all
SELECT exerciseID, name, categoryID
FROM Exercises;

-- Find by id
SELECT exerciseID, name, categoryID
FROM Exercises
WHERE exerciseID = :exerciseID;

-- Delete by id
DELETE FROM Exercises
WHERE exerciseID = :exerciseID;

-- Edit by id
UPDATE Exercises
SET name = :name, categoryID = :categoryID
WHERE exerciseID = :exerciseID;

-- Select by workout id
SELECT Exercises.name, Exercises.exerciseID
FROM Exercises
JOIN WorkoutsExercises ON Exercises.exerciseID = WorkoutsExercises.exerciseID
JOIN Workouts ON WorkoutsExercises.workoutID = Workouts.workoutID
WHERE Workouts.workoutID = :workoutID;

-- Add exercise <=> workout relationship
INSERT INTO WorkoutsExercises(workoutID, exerciseID)
VALUES (:workoutID, :exerciseID);

-- Remove exercise <=> workout relationship
DELETE FROM WorkoutsExercises
WHERE workoutID = :workoutID
AND exerciseID = :exerciseID;

-- Create
INSERT INTO Exercises(name, categoryID)
VALUES (:name, :categoryID);

-- Select by category id
SELECT exerciseID, name
FROM Exercises
WHERE categoryID = :categoryID;

-- Select by equipment id
SELECT Exercises.exerciseID, Exercises.name
FROM Exercises
JOIN ExercisesEquipment ON Exercises.exerciseID = ExercisesEquipment.exerciseID
JOIN Equipment on ExercisesEquipment.equipmentID = Equipment.equipmentID
WHERE Equipment.equipmentID = :equipmentID;

-- Search
SELECT exerciseID, name
FROM Exercises
WHERE name LIKE "%:searchText%";

---------------
-- Equipment --
---------------

-- Select all
SELECT equipmentID, name
FROM Equipment;

-- Find by id
SELECT equipmentID, name
FROM Equipment
WHERE equipmentID = :equipmentID;

-- Delete by id
DELETE FROM Equipment
WHERE equipmentID = :equipmentID;

-- Edit by id
UPDATE Equipment
SET name = :name
WHERE equipmentID = :equipmentID;

-- Add equipment <=> exercise relationship
INSERT INTO ExercisesEquipment(exerciseID, equipmentID)
VALUES (:exerciseID, :equipmentID);

-- Remove equipment <=> exercise relationship
DELETE FROM ExercisesEquipment
WHERE exerciseID = :exerciseID
AND equipmentID = :equipmentID;

-- Create
INSERT INTO Equipment (name)
values (:name);

-- Select by exercise id
SELECT Equipment.name, Equipment.equipmentID
FROM Equipment
JOIN ExercisesEquipment ON Equipment.equipmentID = ExercisesEquipment.equipmentID
JOIN Exercises ON ExercisesEquipment.exerciseID = Exercises.exerciseID
WHERE Exercises.exerciseID = :exerciseID;

-- Search
SELECT equipmentID, name
FROM Equipment
WHERE name LIKE "%:searchText";

----------------
-- Categories --
----------------

-- Select all
SELECT categoryID, name
FROM Categories;

-- Find by id
SELECT categoryID, name
FROM Categories
WHERE categoryID = :categoryID;

-- Delete by id
DELETE FROM Categories
WHERE categoryID = :categoryID;

-- Edit by id
UPDATE Categories
SET name = :name
WHERE categoryID = :categoryID;

-- Create
INSERT INTO Categories (name)
VALUES (:name);

-- Search
SELECT categoryID, name
FROM Categories
WHERE name LIKE "%:searchText%";
