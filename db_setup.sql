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
    `description` VARCHAR(255),
    PRIMARY KEY (equipmentID)
) ENGINE = InnoDB;

CREATE TABLE Exercises (
    exerciseID INT(11) AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE,
    `description` VARCHAR(255) NOT NULL,
    PRIMARY KEY (exerciseID)
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

INSERT INTO Exercises (name, description) VALUES
('Bench Press', 'A lift or exercise in which a weight is raised by extending the arms upward while lying on a bench'),
('Squat', 'An exercise in which a standing person lowers to a position in which the torso is erect and the knees are deeply bent and then rises to an upright position'),
('Push Up', 'A conditioning exercise performed in a prone position by raising and lowering the body with the straightening and bending of the arms while keeping the back straight and supporting the body on the hands and toes'),
('Pull Up','An exercise in which one hangs by the hands from a support (such as a horizontal bar) and pulls oneself up until the chin is level with the support'),
('Dead Lift', 'A lift in weight lifting in which the weight is lifted from the floor to hip level' ),
('Dip', 'A bodyweight exercise executed by grasping two parallel bars and lowering/raising the body by bending the elbows'),
('Overhead Press','A strength exercise in which a weight is pressed straight upwards from a racking position until the arms are locked out overhead');

INSERT INTO Equipment (name, description) VALUES
('barbell','A long metal bar to which disks of varying weights are attached at each end, used for weightlifting'),
('dumbbell','A short bar with a weight at each end, used typically in pairs for exercise or muscle-building'),
('pull up bar', 'A suspended horizontal bar from which one can perform a pull up exercise'),
('squat rack','A metal rack or cage consisting of support pillars with adjustable bars and hooks, using for supporting a barbell during heavy weightlifting exercises'),
('bench','A low, usually padded platform used in weight lifting'),
('yoga ball','A large ball for sitting or lying on while exercising'),
('yoga mat','A specially fabricated mat used to prevent hands and feet slipping while performing yoga'),
('rowing machine', 'An exercise machine with a sliding seat that mimics the motions of rowing a boat'),
('kettlebell','A large cast-iron ball-shaped weight with a single handle');

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

