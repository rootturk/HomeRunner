
# HomeRunner Message API

  

The HomeRunner Messaging API has been created to provide endpoints such as user registration, user login, sending messages, recording activities, viewing activities.

Please create .env file in your src folder.

```sh
API_PORT = 5001
MONGO_URI = "mongodb://mongodb_container:27017/homerunner"
TOKEN_KEY = "a4@$%"
```

Start the App With System

  

```sh

node index.js

```

Start The App with Docker

```sh

docker-compose-up

```

## API Endpoints
/api/user/register

```sh
{
	"username":"homerunner",
	"name":"HomeRunner Test",
	"password":"dockerize",
	"email":"homerunner@homerunner.com",
	"age":24
}
```
  /api/user/login
Request
```sh
{
	"username":"homerunner",
	"password":"dockerize"
}
```
Response
```sh
{
	"data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjI0YzM1ZTZlMDQ2NDlkY2JjZWVmNmZlIiwiZW1haWwiOiJha2luQGhvbWVydW5uZXIuY29tIiwidXNlcm5hbWUiOiJob21lcnVuIiwiaWF0IjoxNjQ5MTYyMjA3LCJleHAiOjE2NDkxODAyMDd9.7K1P5OFzs98h6EgOj2rSURajemPL02vKWWV7ZlSVunM",
	"msg": "Success",
	"code": 200
}
```
  
If you login after you need to 'x-access-token' parameter for authentication methods.

 POST - /api/message 
 Request
```sh
{
	"to":"rootturk",
	"message":"Merhaba nasilsiniz?"
}
```

 GET - /api/message 
 Request
```sh
{
 
}
```

 GET - /api/message 

 Response
 
```sh
{
    "data": [
        {
            "from": "homerunner",
            "messages": [
                {
                    "_id": "624cc06cc28983115ae8d837",
                    "sender_username": "homerunner",
                    "receiver_username": "homerunner",
                    "message": "Merhabalar Nasilsiniz?",
                    "created": "2022-04-05T22:18:51.964Z",
                    "__v": 0
                },
                {
                    "_id": "624cc1dcf800e36d0a629e07",
                    "sender_username": "homerunner",
                    "receiver_username": "homerunner",
                    "message": "Merhabalar Nasilsiniz?",
                    "created": "2022-04-05T22:25:30.337Z",
                    "__v": 0
                }
            ]
        }
    ],
    "msg": "Succeeded.",
    "status": 200
}
```

GET - /api/user/activity
Response
```sh
{
    "data": [
        {
            "_id": "624cc05ec28983115ae8d833",
            "username": "homerunner",
            "activity_type": 1,
            "ip_address": "::ffff:172.21.0.1",
            "created": "2022-04-05T22:18:51.956Z",
            "__v": 0
        },
        {
            "_id": "624cc06cc28983115ae8d839",
            "username": "homerunner",
            "activity_type": 6,
            "description": " Send Message to: homerunner",
            "ip_address": "::ffff:172.21.0.1",
            "created": "2022-04-05T22:18:51.956Z",
            "__v": 0
        },
        {
            "_id": "624cc1dcf800e36d0a629e09",
            "username": "homerunner",
            "activity_type": 6,
            "description": " Send Message to: homerunner",
            "ip_address": "::ffff:172.21.0.1",
            "created": "2022-04-05T22:25:30.318Z",
            "__v": 0
        },
        {
            "_id": "624cc1eef800e36d0a629e0d",
            "username": "homerunner",
            "activity_type": 6,
            "description": " Get All Message: ",
            "ip_address": "::ffff:172.21.0.1",
            "created": "2022-04-05T22:25:30.318Z",
            "__v": 0
        },
        {
            "_id": "624cc259f800e36d0a629e11",
            "username": "homerunner",
            "activity_type": 6,
            "description": " Get All Message: ",
            "ip_address": "::ffff:172.21.0.1",
            "created": "2022-04-05T22:25:30.318Z",
            "__v": 0
        }
    ],
    "msg": "Succeeded.",
    "status": 200
}
```

 POST - /api/user/block 
 Request
```sh
{
    "username":"homerunner"
}
```

 Response
```sh
{
    "msg": "Succeeded",
    "status": 200
}
```

 DELETE - /api/user/block 
 Request
```sh
{
    "username":"homerunner"
}
```

 Response
```sh
{
    "msg": "User removed succeeded.",
    "status": 200
}
```
## Tech & Methods

  
HomeRunner Message API uses a number of open source projects to work properly:
  

- [NodeJS] - evented I/O for the backend!

- [ExpressJS] - MVC Framework for NodeJS

- [Mocha] - Test Framework

- [Chai] - Test Framework

- [Winston] - Log Framework for NodeJS

- [MongoDB] - Fast & Scalable NoSQL database

- [JWT] - Token Based Authentication

  
  

## Main Goals

- (+) Users should be able to create an account and log in.

- (+) Users can message others as long as they know each other's usernames.

- (+) Users should be able to access their message history.

  

## Technical Requirements

- (+) Endpoints should follow REST principles.

- (+) Should be dockerized, and expected to run via docker-compose.

- (+) Source code should be uploaded to an online git repository (github, gitlab, etc.)

- (+) Should include unit tests.

- (+) NoSQL database should be preferred.

- (+) Should have structured logging with an appropriate log management solution. (ie. winston+es for nodejs

or serilog+es for dotnet)

  
## Optional Features

- (+) Can include functional tests and integration tests.

- (+) Users can block any sender’s username to stop receiving messages.

- (+) Users can view their own activity logs (ie. successful or invalid logins)

- Messaging can be real-time or can follow event-driven architecture.


## Future

- All endpoints will be placed under controller files. (userController, messageController) etc.
- Integration test
- Swagger integration.