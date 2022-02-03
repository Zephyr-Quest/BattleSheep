CREATE TABLE users(
    id INT PRIMARY KEY AUTO_INCREMENT, 
    username VARCHAR(20),
    password VARCHAR(255)
);

ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY 'password'; 

flush privileges;