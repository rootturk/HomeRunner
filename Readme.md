# HomeRunner Message API

The HomeRunner Messaging API has been created to provide endpoints such as user registration, user login, sending messages, recording activities, viewing activities.


Start the APP With System

```sh
node index.js
```
Start API with Docker
```sh
docker-compose-up
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
-  (+) Users should be able to create an account and log in.
-  (+) Users can message others as long as they know each other's usernames.
-  (+) Users should be able to access their message history.

## Technical Requirements
- (+) Endpoints should follow REST principles.
- (+) Should be dockerized, and expected to run via docker-compose.
- (+) Source code should be uploaded to an online git repository (github, gitlab, etc.)
- (+) Should include unit tests.
- (+) NoSQL database should be preferred.
- (+) Should have structured logging with an appropriate log management solution. (ie. winston+es for nodejs
or serilog+es for dotnet)

## Optional Features
-  (+) Can include functional tests and integration tests.
-  (+) Users can block any sender’s username to stop receiving messages.
-  (+) Users can view their own activity logs (ie. successful or invalid logins)
-  Messaging can be real-time or can follow event-driven architecture.

## Future
- all endpoints will be placed under controller files. (userController, messageController) etc.
- integration test