# Identity Service

### Running locally
- Set up your environment variables to contain both `DB_USERNAME` and
`DB_PASSWORD` to be able to connect to the DB, which are your PostgreSQL credentials:  
    - Either globally, at your machine level
    - Either local to the project, by creating a `local.env` file inside the `db` folder,
  docker is configured to pick that up. If you are using this method, please make sure
  to run `docker-compose --env-file local.env up` instead.
- Before doing anything else, go into the `db` folder and run `docker-compose up` -> this will create and start the PostgreSQL container for you.
- Run `mvn clean install` on both `deal-core` and here.
- At your first start, create a new running configuration with the active profile set to `startup` so that
sql data loads into your db.
- Afterwards, run it only with the default configuration.

### Documentation
- Open up `http://localhost:8001/swagger-ui.html` in your browser.


### Commiting
- Before commiting make sure to run `mvn clean install`, which will trigger both checkstyle 
and code coverage checks, which should pass before pushing.