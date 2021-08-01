SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Users,
Workouts,
Categories,
Equipment,
Exercises,
WorkoutsExercises,
ExercisesEquipment;

CREATE TABLE Users (
    userID INT(11) AUTO_INCREMENT,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (userID)
) ENGINE = InnoDB;

CREATE TABLE Workouts (
    workoutID INT(11) AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `description` VARCHAR(255),
    userID INT(11) NOT NULL,
    PRIMARY KEY (workoutID),
    FOREIGN KEY (userID)
        REFERENCES Users (userID)
        ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE Categories (
    categoryID INT(11) AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (categoryID)
) ENGINE = InnoDB;

CREATE TABLE Equipment (
    equipmentID INT(11) AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    PRIMARY KEY (equipmentID)
) ENGINE = InnoDB;

CREATE TABLE Exercises (
    exerciseID INT(11) AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    categoryID int(11),
    PRIMARY KEY (exerciseID),
    FOREIGN KEY (categoryID)
    REFERENCES Categories (categoryID)
    ON DELETE SET NULL
) ENGINE = InnoDB;

CREATE TABLE WorkoutsExercises (
    workoutID INT(11),
    exerciseID INT(11),
    FOREIGN KEY (workoutID) REFERENCES Workouts (workoutID),
    FOREIGN KEY (exerciseID) REFERENCES Exercises (exerciseID)

) ENGINE = InnoDB;

CREATE TABLE ExercisesEquipment (
    exerciseID INT(11),
    equipmentID INT(11),
    FOREIGN KEY (exerciseID) REFERENCES Exercises (exerciseID),
    FOREIGN KEY (equipmentID) REFERENCES Equipment (equipmentID)
) ENGINE = InnoDB;



INSERT INTO Users (email, firstName, lastName) VALUES 
('osbornic@oregonstate.edu', 'Nick', 'Osborne'), 
('yangmat@oregonstate.edu','Matt','Yang');

INSERT INTO Categories (name) VALUES
('Strength'),
('Calisthenics'),
('Cardio'),
('Flexibility');

INSERT INTO Exercises (name, categoryID) VALUES
('Bench Press',1),
('Squat', 1),
('Push Up', 2),
('Pull Up', 2),
('Dead Lift', 1),
('Dip', 2),
('Overhead Press', 1),
('Running', 3),
('Swimming',3),
('Yoga',4),
('Stretching',4);

INSERT INTO Equipment (name) VALUES
('barbell'),
('dumbbell'),
('pull up bar'),
('squat rack'),
('bench'),
('yoga ball'),
('yoga mat'),
('rowing machine'),
('kettlebell');

INSERT INTO Workouts (date, description, userID) VALUES
('2021-08-21','Bench Press 150 lbs',1),
('2021-08-21','Push Ups 20 reps',2);

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

