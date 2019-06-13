'use strict';

const bcryptjs = require('bcryptjs');
const auth = require('basic-auth');
const asyncMiddleware = require('express-async-handler');
const { models } = require('../db');
const { User } = models;

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */

const authenticateUser = asyncMiddleware(async (req, res, next) => {
    let message = null;

    // Get the user's credentials from the Authorization header.
    const credentials = auth(req);

    if (credentials) {
        // Find user whose `Username (email address)` matches the credentials `name` property.
        const user = await User.findOne({
            where: {
                emailAddress: credentials.name
            }
        });

        if (user) {
            const authenticated = bcryptjs
                .compareSync(credentials.pass, user.password);

            // If the passwords match
            if (authenticated) {
                console.log(`Authentication successful for Username: ${user.emailAddress}`);

                // Store the user on the Request object.
                req.currentUser = user;
            } else {
                message = `Incorrect password for Username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for Username: ${credentials.name}`;
        }
    } else {
        message = 'Authorization header not found';
    }
    // If user authentication failed
    if (message) {
        console.warn(message);
        // Return a response with a 401 Unauthorized HTTP status code
        res.status(401).json({ message: 'Access Denied' });
    } else {
        // User authentication succeeded
        next();
    }
});

module.exports = authenticateUser;