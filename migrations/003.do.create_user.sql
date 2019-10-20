create table users (
    id serial primary key,
    user_name text not null unique,
    password text not null,
    date_modified timestamp default now() not null
); 