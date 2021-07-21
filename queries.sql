

CREATE TABLE Users (
    userID INT(11) AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    PRIMARY KEY (userID)
);

CREATE TABLE Workouts (
    workoutID INT(11) AUTO_INCREMENT,
    `date` DATETIME NOT NULL,
    userID INT(11) NOT NULL,
    PRIMARY KEY (workoutID)
);

CREATE TABLE Categories (
    categoryID INT(11) AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (categoryID)
);

CREATE TABLE Equipment (
    equipmentID INT(11) AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255),
    PRIMARY KEY (equipmentID)
);

CREATE TABLE Exercises (
    exerciseID INT(11) AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (exerciseID)
);

CREATE TABLE WorkoutsExercises (
    workoutID INT(11),
    exerciseID INT(11),
    FOREIGN KEY (workoutID) REFERENCES Workouts (workoutID),
    FOREIGN KEY (exerciseID) REFERENCES Exercises (exerciseID)

);

CREATE TABLE ExercisesEquipment (
    exerciseID INT(11),
    equipmentID INT(11),
    FOREIGN KEY (exerciseID) REFERENCES Exercises (exerciseID),
    FOREIGN KEY (equipmentID) REFERENCES Equipment (equipmentID)
);



INSERT INTO Users (email, firstName, lastName) VALUES 
('osbornic@oregonstate.edu', 'Nick', 'Osborne'), 
('yangmat@oregonstate.edu','Matt','Yang');

INSERT INTO Exercises (name, description) VALUES
('Bench Press', 'A lift or exercise in which a weight is raised by extending the arms upward while lying on a bench'),
('Squat', 'An exercise in which a standing person lowers to a position in which the torso is erect and the knees are deeply bent and then rises to an upright position'),
('Push Up', 'A conditioning exercise performed in a prone position by raising and lowering the body with the straightening and bending of the arms while keeping the back straight and supporting the body on the hands and toes'),
('Pull Up','An exercise in which one hangs by the hands from a support (such as a horizontal bar) and pulls oneself up until the chin is level with the support'),
('Dead Lift', 'A lift in weight lifting in which the weight is lifted from the floor to hip level' ),
('Dip', ''),
('Overhead Press','');

INSERT INTO Equipment (name, description) VALUES
('barbell',''),
('dumbbell',''),
('pull up bar', ''),
('squat rack',''),
('bench',''),
('yoga ball',''),
('yoga mat',''),
('rowing machine', ''),
('kettlebell','');

INSERT INTO Workouts (date, userID) VALUES
('2021-08-21', 1),
('2021-08-21',2);

INSERT INTO WorkoutsExercises (workoutID,exerciseID) VALUES
(1,1),
(1,2),
(1,3),
(2,4),
(2,5),
(2,6);

INSERT INTO ExercisesEquipment (exerciseID,equipmentID) VALUES
(1,1),
(1,5),
(4,3),
(5,1);

