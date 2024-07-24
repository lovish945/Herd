create database project;
use project;
create table users (email varchar(30) primary key,pwd varchar(30) , utype varchar(20),status int );
select * from users;
update users set status=0 where email='aman';
drop table iprofile;
create table iprofile (email varchar(50) primary key, pwd varchar(30), picpath varchar(50),fname varchar(200),lname varchar(20),iname varchar(20), fields varchar(20),address varchar(50),city varchar(400),state varchar(200),dob date,gender varchar(20),youtube varchar(200),facebook varchar(20),other varchar(50));
select * from iprofile;
create table events (rid int primary key auto_increment,email varchar(50),events varchar(20),doe date,tos time,city varchar(20),venue varchar(30));
select * from events;
drop table events;
drop table evn;

