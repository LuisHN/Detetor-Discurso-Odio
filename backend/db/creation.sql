CREATE DATABASE IF NOT EXISTS HATE_DETECTOR;
use HATE_DETECTOR
CREATE TABLE IF NOT EXISTS strings
(
    id int auto_increment,
    string varchar(255) not null,
    clientHash varchar(255) not null,
    classification int,
    deleted int default 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    updated_at    DATETIME on UPDATE CURRENT_TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      constraint strings_pk
            primary key (id)
);


CREATE TABLE IF NOT EXISTS classification
(
    id INT auto_increment,
    string VARCHAR(255) NOT NULL,
    classification_1 INT,
    classification_2 INT,
    classification_3 INT,
    classification_4 INT,
    needClassification INT DEFAULT 1,
    deleted INT DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    updated_at    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          constraint strings_pk
            primary key (id)
);


CREATE TABLE IF NOT EXISTS database_ORIG
(
    id INT auto_increment,
    string VARCHAR(255) NOT NULL,
    clientHash VARCHAR(255),
    classified   INT DEFAULT 0,
    deleted   INT DEFAULT 0,
    created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    updated_at    DATETIME on UPDATE CURRENT_TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          constraint strings_pk
            primary key (id)
);