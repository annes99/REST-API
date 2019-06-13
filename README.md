# REST API

> A REST API using Express. The API will provide a way for users to administer a school database containing information about courses: users can interact with the database by retrieving a list of courses, as well as adding, updating and deleting courses in the database.

## Features

* Requires users to create an account and log-in to make changes to the database
* Uses the bcryptjs npm package to hash the user's password
* Implemented validations within your route handlers with express-validator
* Use the basic-auth npm package to parse the Authorization header to set up permissions to require users to be signed in

## Technologies

* JavaScript
* SQL
* ORM Sequelize
* Node.js
* Express
* npm

## Getting Started

To get up and running with this project, run the following commands from the root of the folder that contains this README file.

First, install the project's dependencies using `npm`.

```
npm install

```

Second, seed the SQLite database.

```
npm run seed
```

And lastly, start the application.

```
npm start
```

To test the Express server, browse to the URL [http://localhost:5000/](http://localhost:5000/).

## Status

Project is: _COMPLETED_

## Inspiration

Treehouse Techdegree: FSJS project 9 - REST API
