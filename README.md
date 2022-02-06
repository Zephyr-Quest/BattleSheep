# BattleSheep

## How to run BattleSheep with docker

First of all, set up the `.env` file. Rename the `.env.example` file to `.env` and change values between `<` and `>` :

* `SESSION_SECRET` should be a long string which contains a-z, A-Z letters and 0-9 numbers.
* `MYSQL_PASSWORD` should be a random generated password with special characters.

Start the container :

```bash
npm run docker-start
```

Stop the container :

```bash
npm run docker-stop
```