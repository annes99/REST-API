'use strict';

const express = require('express');
const { sequelize, models } = require('../db');
const authenticateUser = require('./authenticateUser');
const { validationResult } = require('express-validator/check');
const { validate } = require('./validateData');
const bcryptjs = require('bcryptjs');

// async handler middleware
//https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
const asyncMiddleware = require('express-async-handler');

// Get references to models.
const { User, Course } = models;

const router = express.Router();

/*** ROUTES FOR USERS ***/

// GET /api/users 200 - Returns the currently authenticated user
router.get('/users', authenticateUser, asyncMiddleware(async (req, res) => {
  const user = await req.currentUser;

  // Set status 200 OK, response filters out the following properties: password, createdAt, updatedAt
  return res.status(200).json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });

}));

// POST /api/users 201 - Creates a user, sets the Location header to "/", and returns no content
router.post('/users', validate('user'), asyncMiddleware(async (req, res) => {

  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  }

  // Get the user from the request body.
  const user = req.body;

  //Check if email address isn't already associated with an existing user
  const findUser = await User.findOne({
    where: {
      emailAddress: user.emailAddress
    }
  });

  if (!findUser) {
    // Hash the new user's password.
    user.password = bcryptjs.hashSync(user.password);

    // Creating new user
    User.create({
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      password: user.password
    });

    // Set status 201 Created, the Location header to "/" and end the response.
    return res.status(201).location('/').end();

  } else {
    // If user with provided email address already exists, set status 400 Bad Request with error message.
    return res.status(400).json({ message: `User with email address: ${user.emailAddress} already exists` });
  }

}));


/*** ROUTES FOR COURSES ***/

// GET /api/courses 200 - Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncMiddleware(async (req, res) => {
  const courses = await Course.findAll({
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]
  });

  return res.status(200).json({ courses });

}));


// GET /api/courses/:id 200 - Returns a the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncMiddleware(async (req, res) => {
  // find course by ID
  const course = await Course.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]

  });

  if (course) {
    return res.status(200).json({ course });
  } else {
    // If no course with provided ID is found set status 404 Not Found
    return res.status(404).json({ message: 'Page not found' });
  }

}));

// POST /api/courses 201 - Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', validate('course'), authenticateUser, asyncMiddleware(async (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  // If there are validation errors...
  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);

    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });

  } else {

    // Get the course from the request body.
    const course = await req.body;

    // Creating new course
    const newCourse = Course.create({
      title: course.title,
      description: course.description,
      estimatedTime: course.estimatedTime,
      materialsNeeded: course.materialsNeeded,
      userId: req.currentUser.id
    });
    // Set status 201 Created, the Location header to the URI for the course and end the response.
    return res.status(201).location(`api/courses/${newCourse.id}`).end();
  }
}));


// PUT /api/courses/:id 204 - Updates a course and returns no content
// route returns a 403 status code if the current user doesn't own the requested course
router.put('/courses/:id', validate('course'), authenticateUser, asyncMiddleware(async (req, res) => {
  // Attempt to get the validation result from the Request object.
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);
    // Return the validation errors to the client.
    return res.status(400).json({ errors: errorMessages });
  } else {
    // find course by ID
    const course = await Course.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: User,
        attributes: ['id', 'firstName', 'lastName', 'emailAddress']
      }]

    });

    // if course exists
    if (course) {
      // if course owner matches current user
      if (course.userId === req.currentUser.id) {
        // update course details in Courses table
        course.update();
        return res.status(204).end();

      } else {
        // Return a response with a 403 Client forbidden HTTP status code.
        return res.status(403).json({ message: 'Access Forbidden' });
      }
    } else {
      return res.status(404).json({ message: 'Page not found' });
    }
  }
}));

// DELETE /api/courses/:id 204 - Deletes a course and returns no content
// route returns a 403 status code if the current user doesn't own the requested course

router.delete('/courses/:id', authenticateUser, asyncMiddleware(async (req, res) => {

  // find course by ID
  const course = await Course.findOne({
    where: {
      id: req.params.id
    },
    include: [{
      model: User,
      attributes: ['id', 'firstName', 'lastName', 'emailAddress']
    }]

  });
  // if course with given ID exists
  if (course) {
    // if course owner ID matches current user ID
    if (course.userId === req.currentUser.id) {
      // delete course
      course.destroy();
      return res.status(204).end();

    } else {
      // Return a response with a 403 Client forbidden HTTP status code.
      return res.status(403).json({ message: 'Access Forbidden' });
    }
  } else {
    return res.status(404).json({ message: 'Page not found' });
  }
}));

module.exports = router;