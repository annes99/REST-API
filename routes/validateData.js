'use strict';
const { check } = require('express-validator/check');

//How to make input validation simple and clean
//https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/

exports.validate = method => {
switch (method) {
    case 'course': {
        return [
            check('title')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Please provide a value for "title"'),
            check('description')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Please provide a value for "description"'),
        ];
    }
    case 'user': {
        return [
            check('firstName')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Please provide a value for "first name"'),
            check('lastName')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Please provide a value for "last name"'),
            check('emailAddress')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Please provide a value for "email address"')
                .isEmail()
                .withMessage('Please provide a valid "email address"'),
            check('password')
                .exists({ checkNull: true, checkFalsy: true })
                .withMessage('Please provide a value for "password"'),
        ];
    }
}
};