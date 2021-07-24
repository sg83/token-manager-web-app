const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const config = require('./../config');
const validation = require("../middleware/validation");
const userController = require("../controllers/userController");


/**
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: "Creates a new user"
 *     description: "This endpoint will create a new user"
 *     parameters:
 *     - name: "name"
 *       required: false
 *     - name: "email"
 *       in: "description"
 *       required: true
 *     - name: "password"
 *       in: "description"
 *       required: true
 *     responses:
 *       200:
 *         description: "User created"
 *       400:
 *         description: "Invalid request parameters"
 *       403:
 *         description: "Invalid JWT Token"
 *       500:
 *         description: "Failed to create user"
 */
router.post("/register", async (request, response) => {

    try{

        // Validate request body
        const { error } = validation.userRegisterRequestValidation(request.body);
        if (error) return response.status(400).send("Invalid request parameters");

        // Check if user already exists
        const userExists = await userController.checkUserExists(request.body.email);
        if (userExists) {
            console.error("register: User exists");
            return response.status(400).send("User exists");
        }

        // Generate password hash 
        const salt = await bcrypt.genSalt(config.PASSWORD_SALT);
        const passwordHash = await bcrypt.hash(request.body.password, salt);

        // Create user
        const user = await userController.createUser(request, passwordHash);
        if (!user) return response.status(401).send("User creation failed"); 

        response.status(200).json(
            {
                name: user.name, 
                email: user.email
            });
       
    } catch ( error ) {
        response.status(500).send("Failed to create user " + error);
    }
});



/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: "Validates user and generated a JWT token"
 *     description: "This endpoint will validate a user and return a JWT token"
 *     parameters:
 *     - name: "email"
 *       in: "description"
 *       required: true
 *     - name: "password"
 *       in: "description"
 *       required: true
 *     responses:
 *       200:
 *         description: "OK"
 *       400:
 *         description: "Invalid request parameters or User not found or Invalid password"
 *       403:
 *         description: "Invalid JWT Token"
 *       500:
 *         description: "Login failed"
 */
router.post("/login", async (request, response, next) => {
  
    try{

        // Validate request body
        const { error } = validation.userLoginRequestValidation(request.body);
        if (error) return response.status(400).send("Invalid request parameters");

        // Verify user email exists
        const user = await userController.checkUserExists(request.body.email);
        if (!user) {
            return response.status(400).send("User not found");
        }
 
        // Generate JWT Token and return
        const jwtToken = await userController.generateJWTToken( request, user, config.TOKEN_SECRET );
        if (!jwtToken) {
            return response.status(400).send("Invalid password");
        }

        response.header("auth-token", jwtToken).status(200).json(
            {
                idToken: jwtToken,
                expiresIn: config.JWT_TOKEN_EXPIRY.toString()
            });
      
    } catch ( error ) {
        console.error("Login failed");
        response.status(500).send("login failed " + error);
    }

});



/**
 * @swagger
 * /api/user/:email:
 *   delete:
 *     summary: "Deletes user"
 *     description: "This endpoint will delete a user"
 *     parameters:
 *     - name: "email"
 *       in: "description"
 *       required: true
 *     responses:
 *       200:
 *         description: "OK"
 *       400:
 *         description: "Invalid request parameters or User not found or Invalid password"
 *       403:
 *         description: "Invalid JWT Token"
 *       500:
 *         description: "Delete failed"
 */
router.delete("/:email", async (request, response, next) => {

    const user = await userController.deleteUser(request.params.email);
    if (!user) return response.status(200).send("User detele error");
    response.status(200).json(user);   

});


module.exports = router;