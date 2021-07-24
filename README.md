# token-manager-web-app
# Overview
The web service  facilitates the API token generation and validation for
the API tokens.  An API token is a 6 to 12 digit alphanumeric string that token
admins can share with customers.

## Installations and Pre-requisites:
Install MongoDB, Angular CLI, Node

Before you proceed clone the github repo.

```$ git clone git@https://github.com/sg83/token-manager-web-app.git ```
## Run Application

1. #### Start MongoDB
```
$cd token-manager-web-app/server
$mongod --dbpath ./data

```
1. #### Start server
```
$cd token-manager-web-app/server
$npm install
$npm start
$npm run start
```
The server runs on port 3080

2. #### Start client
```
$cd token-manager-web-app/client
$npm install -g @angular/cli
$ng serve
```
The client runs on port 4200

## Instructions for using the web service

Open your local browser and verify the newly deployed web service is working by accessing http://localhost:4200

1. #### Create admin user

Create admin user using any REST client like Postman.
For Example:
```
Email: admin123@test.com
Password:admin12345
Name: Administrator
```
On successful completion a user will be created and the same user can be used to
login to the web service.

2. #### Login into the web service

Login in using following registered admin credentials:
```
Email: admin123@test.com
Password:admin12345
```
3. #### Go to Dashboard for managing tokens.

List of tokens will be displayed on dashboard page with details such as validity, status, name.
New token can be generated using 'Create' button.

![image](https://user-images.githubusercontent.com/20791882/126858492-734c5528-758e-4e53-b597-3ee9d0b3dbfc.png)

4. #### Revoke/Enable selected token from the list
Admin can select a token by clicking 'Select' button and enable, revoke or delete it.

![image](https://user-images.githubusercontent.com/20791882/126858620-f0f9c582-54d5-4ad5-a828-9b3df04c8adc.png)

5. #### Logout
Admin can logout using 'Logout' button.

6. #### Token Validation
Any user or customer can use 'Token Validation' option to check the validity of specific token.

![image](https://user-images.githubusercontent.com/20791882/126858740-c706f2b9-56ef-4899-9623-b63b9f869213.png)


## REST API documentation

* The swagger docs for the rest api can be accessed by the link
http://localhost:3030/docs

* #### List of token endpoints

| Request|  Endpoint                    |  Description                         |
| ------ | ---------------------------- | ------------------------------------ |
| POST   | ​/api​/token​/generate          | Generates a new API Token            |
| GET    | /api​/token​/                  | Get a list of API Tokens             |
| GET    | /api​/token​/:tokenId          | Get details of the API Token         |
| DELETE | /api​/token​/:tokenId          | Delete the API Token                 |
| PATCH  | /api​/token​/:tokenId          | Update status of a API Token         |
| POST   | /api​/token​/validate/:tokenId | Validates an API Token               |

* #### List of user endpoints

| Request|  Endpoint                    |  Description                         |
|--------|------------------------------|--------------------------------------|
| POST   | /api​/user​/register           | Creates a new user                   |
| POST   | /api​/user​/login              | Validates user & returns a JWT token |
| DELETE | ​/api​/user​/:email             | Deletes user                         |


## Testing instructions

Run the `Chai` base tests using the following commmand

`npm run test`
