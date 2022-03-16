# BattleSheep

## Requirements

Our project requires :

* NodeJS + npm
* Docker + Docker Compose
* Any correct OS (sorry for Windows users...)

## How to run BattleSheep with docker

First of all, set up the `.env` file with the following pattern (change values between `<` and `>`) :

```env
# MySQL

MYSQL_HOST="db"
MYSQL_USERNAME="root"
MYSQL_PASSWORD="<db_password>"
DATABASE_NAME="battlesheep"

# NodeJS

APP_PORT=8080
START_CMD="node index.js"
SESSION_SECRET="<session_secret>"
```

* `SESSION_SECRET` should be a long string which contains a-z, A-Z letters and 0-9 numbers.
* `MYSQL_PASSWORD` should be a random generated password with special characters.

You must add a `pass.sql` file to the `db` folder which contains (`<db_password>` must contain the same value as `MYSQL_PASSWORD`) :
```sql
ALTER USER 'root' IDENTIFIED WITH mysql_native_password BY '<db_password>'; 
flush privileges;
```

Start the container :
```bash
npm i # To install all node modules
npm run docker-start
```

Stop the container :
```bash
npm run docker-stop
```
