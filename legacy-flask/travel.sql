CREATE DATABASE if not exists travel;  #
use  travel;
#drop table if exists signup;
CREATE TABLE if not exists signup (id INTEGER Unique, U_name TEXT, user_name VARCHAR (35)
 , passwords VARCHAR (35) , email VARCHAR (35) , phone varchar(12));
 #SELECT * FROM signup;
 #CREATE TABLE if not exists class (class_name VARCHAR (35), price INTEGER(4));
 #INSERT INTO class (class_name, price) VALUES ("A", 100);
#INSERT INTO class (class_name, price) VALUES ("B", 50);
# INSERT INTO class (class_name, price) VALUES ("C", 30);
 
 
CREATE TABLE if not exists tour (typess VARCHAR (35), price INTEGER(4));
 INSERT INTO tour (typess, price) VALUES ("one", 100);
INSERT INTO tour (typess, price) VALUES ("two", 50);
SELECT * from tour;
 
 
 