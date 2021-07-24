'use strict';

const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const tokenController = require('../controllers/tokenController');
const userController = require('../controllers/userController');
const validation = require("../middleware/validation");


// Import Token model
const Token = require("../models/Tokens");

/**
 * @swagger
 * /api/token/generate:
 *   post:
 *     summary: "Generates a new API Token"
 *     description: "This endpoint will generate an API token and persist it"
 *     tags:
 *       - Token
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "name"
 *       in: "name"
 *       required: false
 *     - name: "description"
 *       in: "description"
 *       required: false
 *     responses:
 *       200:
 *         description: "API token generated"
 *       400:
 *         description: "Token generation error"
 *       403:
 *         description: "Invalid JWT Token"
 *       500:
 *         description: "Failed to generate API token"
 */
router.post("/generate", userController.requestAuthentication, async (request, response) => {

    const token = await tokenController.generateToken(request);
    if (!token) return res.status(400).send("Token generation error");
    response.status(200).json(
        {
            _id: token._id, 
            email: token.email,
            name: token.name,
            description: token.description,
            status: token.status,
            createdAt: token.createdAt,
            validTo: token.validTo
        });  

});

/**
 * @swagger
 * /api/token/:
 *   get:
 *     summary: "Get a list of API Tokens"
 *     description: "This endpoint will generate a list of all API tokens"
 *     tags:
 *       - Token
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     responses:
 *       200:
 *         description: "API token generated"
 *       400:
 *         description: "Invalid request parameters"
 *       403:
 *         description: "Invalid JWT Token"
 *       500:
 *         description: "Failed to get API tokens"
 */
router.get("/", userController.requestAuthentication, async (request, response) => {

    const tokens = await tokenController.listTokens(request);
    if (!tokens) return response.status(400).send("Token list generation error");
    response.status(200).json(tokens);   

});



/**
 * @swagger
 * /api/token/:tokenId:
 *   get:
 *     summary: "Get details of the API Token"
 *     description: "Individual API token details can be viewed using this endpoint."
 *     tags:
 *       - Token
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "tokenId"
 *       required: true
 *     responses:
 *       200:
 *         description: "API token details returned successfully"
 *       400:
 *         description: "Invalid request parameters"
 *       403:
 *         description: "Invalid JWT Token"
 *       404:
 *         description: "API token  Not Found"
 *       500:
 *         description: "Internal Server error"
 */
router.get("/:tokenId", userController.requestAuthentication, async (request, response, next) => {

    const token = await tokenController.getToken(request);
    if (!token) return response.status(400).send("Token details error");
    response.status(200).json(
        {
            _id: token._id, 
            email: token.email,
            name: token.name,
            status: token.status,
            createdAt: token.createdAt,
            validTo: token.validTo
        }); 

});



/**
 * @swagger
 * /api/token/:tokenId:
 *   delete:
 *     summary: "Delete the API Token"
 *     description: "API tokens can be deleted using this endpoint."
 *     tags:
 *       - Token
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "tokenId"
 *       required: true
 *     responses:
 *       200:
 *         description: "API token deleted"
 *       400:
 *         description: "Invalid request parameters"
 *       403:
 *         description: "Invalid JWT Token"
 *       404:
 *         description: "API token  Not Found"
 *       500:
 *         description: "Failed to delete API token"
 */
router.delete("/:tokenId", userController.requestAuthentication, async (request, response, next) => {

    // Validate request params
    const { error } = validation.tokenIdValidation(request.params);
    if (error) return response.status(400).send("Invalid request parameters");

    const token = await tokenController.deleteToken(request);
    if (!token) return response.status(400).send("Token details error");
    response.status(200).json(token);   

});



/**
 * @swagger
 * /api/token/:tokenId:
 *   patch:
 *     summary: "Update name and description of an API Token"
 *     description: "API tokens name and description can be updated using this endpoint."
 *     tags:
 *       - Token
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "name"
 *       required: false
 *     - name: "status"
 *       required: false
 *     - name: "description"
 *       required: false
 *     responses:
 *       200:
 *         description: "OK"
 *       400:
 *         description: "Invalid request parameters"
 *       403:
 *         description: "Invalid JWT Token"
 *       404:
 *         description: "Token not found"
 *       500:
 *         description: "Failed to get API token details"
 */
router.patch("/:tokenId", userController.requestAuthentication, async (request, response, next) => {

    // Validate request params
    const { error } = validation.tokenIdValidation(request.params);
    if (error) return response.status(400).send("Invalid request parameters");

    const token = await tokenController.patchToken(request);
    if (!token) return response.status(400).send("Token patch error");

    response.status(200).json(
        {
            _id: token._id, 
            email: token.email,
            name: token.name,
            status: token.status,
            createdAt: token.createdAt,
            validTo: token.validTo
        });

});



/**
 * @swagger
 * /api/token/:tokenId/validate:
 *   post:
 *     summary: "Validates an API Token"
 *     description: "API tokens can expire or can be maliciously created. This endpoint helps with validating the real ones."
 *     tags:
 *       - Token
 *     consumes:
 *     - "application/json"
 *     produces:
 *     - "application/json"
 *     parameters:
 *     - name: "tokenId"
 *       required: true
 *     responses:
 *       200:
 *         description: "Token valid"
 *       404:
 *         description: "Token inactive or Token expired or Token not found"
 *       500:
 *         description: "Operation failed"
 */
router.get("/validate/:tokenId", async (request, response) => {

    try {

        // Validate request params
        const { error } = validation.tokenIdValidation(request.params);
        if (error) return response.status(400).send("Invalid request parameters");

        var tokenCheck = await tokenController.isAPITokenActive(request.params.tokenId);

        var status=200;
        var message="";
        var token="";

        switch(tokenCheck) {
            case "TOKEN_NOT_FOUND":
            case null:
                status=404;
                message="not found";
                break;
            case "TOKEN_NOT_ACTIVE":
                status=404;
                message="inactive";
                break;
            case "TOKEN_EXPIRED":
                status=404;
                message="expired";
                break;
            case "OK":
                status=200;
                message="valid";
                token = await tokenController.getToken(request);
                break;
        }

        if (status == 200) {
            response.status(status).json(
                {
                    _id: token._id, 
                    email: token.email,
                    name: token.name,
                    status: token.status,
                    createdAt: token.createdAt,
                    validTo: token.validTo
                });
        } else {
            response.status(status).send();
        }

    } catch (err) {
      response.status(404).json({ message: err });
    }

});


module.exports = router;
