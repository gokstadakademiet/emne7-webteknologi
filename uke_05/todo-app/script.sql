create database todo;
use todo;

create table users (
    id int primary key auto_increment,
    username varchar(255) not null,
    password varchar(255) not null
);

create table tasks (
    id int primary key auto_increment,
    user_id int not null,
    title varchar(255) not null,
    description text,
    due_date date,
    is_done boolean not null default false,
    created_at timestamp not null default current_timestamp,
    updated_at timestamp not null default current_timestamp on update current_timestamp,
    foreign key (user_id) references users(id)
);