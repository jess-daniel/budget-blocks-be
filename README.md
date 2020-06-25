# Badges

[![Maintainability](https://api.codeclimate.com/v1/badges/48e243bd3d68a7d834b0/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/budget-blocks-be)
[![Test Coverage](https://api.codeclimate.com/v1/badges/48e243bd3d68a7d834b0/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/budget-blocks-be)

# API Documentation

#### Backend deployed at [Heroku](https://budget-blocks-production-new.herokuapp.com). <br>

## Getting started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm run server** to start the local server
- **npm test** to start server using testing environment

### Backend framework

Why did you choose this framework?

- PostGres - is an open-source, object-relational database management system (ORDBMS), it's persistent database as well as quality made it the correct choice for our application.
- Heroku - is the hosting application we are using to deploy our backend. Heroku makes deploying web apps simple and fast.
- Knex - Used to create data migration tables and seeds to continuously have a clean data set.
- Express - is a minimal, open source and flexible Node.js web app framework designed to make developing websites, web apps, & API's much easier.
- Nodemon - Used to run our backend locally for progressive testing before launching into the master branch of our product.
- Node.js -  is a platform built on Chrome's JavaScript runtime for easily building fast and scalable network applications. It uses an event-driven, non-blocking I/O model that makes it lightweight and efficient, perfect for data-intensive real-time applications that run across distributed devices.

### Backend Engineering Tech

- Okta - It's an enterprise-grade, identity management service, built for the cloud, but compatible with many on-premises applications. With [Okta](https://www.okta.com/), IT can manage any employee's access to any **application** or device.
- Plaid API - allows developers to integrate transaction and account data from most major financial institutions into third party applications. The data includes merchant names, street addresses, geo-coordinates, categories, and other info.

## Endpoints

In-depth endpoint documentation: [Here](https://documenter.getpostman.com/view/10984987/SztD57nm?version=latest#0f5ff3a7-d6b6-4324-bb4c-003c86bc064e)

#### User Routes
 | Method | Endpoint | Token Required | Description | Body | Params |
|---|---|---|---|---|---|
| GET | ```/api/users``` | Yes | Returns a list of all users | n/a | n/a | 
| POST | ```/api/users``` | Yes | Adds a user | Name, Email | n/a |
| PUT | ```/api/users/:userId``` | Yes | Updates a specific user's information | City, State, onboarding_complete: True/False | user_id
| DELETE | ```/api/users``` | Yes | Delete user by email | email | n/a                                   

#### Plaid Routes

 | Method | Endpoint | Token Required | Description | Body | Params |
|---|---|---|---|---|---| 
| GET | `/plaid/accessToken/:id` | No             | Returns the access_tokens associated with the user's id.| N/A | user_id
| GET | ```/plaid/accessToken``` | No  |  Returns all access tokens for every user. |
| GET | ```plaid/accessToken/:userId``` | No | Returns all access tokens connected to a specified user. | N/A | user_id
| GET | ```/plaid/userTransactions/:userId``` | Yes | Returns User's Transaction history up to 30 days to the day that the api is fired. Must have connected bank account to Plaid already. | access_token is retrieved based off of user_id | user_id
| GET | ```/plaid/userBalance/:userId``` | Yes | Returns User's current bank account balance as well as loan amounts and savings. Must have connected bank account to Plaid already. | access_token is retrieved based off of user_id | user_id
| POST | `/plaid/token_exchange/:id`       | Yes             | Exchanges PublicToken received by using the Plaid Link to connect to a bank account to retrieve the access token, must be connected to the user_id received from Okta| public_token | user_id
| DELETE | ```/plaid/accessToken/:userId``` | No  | Deletes a specific access token (aka bank account) for a specific user | bankId: access_token id | user_id
| DELETE | ```/plaid/accessToken/:userId/all``` | No  | Deletes access tokens (aka bank account) for a specific user | N/A | user_id

#### Budget Routes
 | Method | Endpoint | Token Required | Description | Body | Params |
|---|---|---|---|---|---|
| GET | ```/api/goals``` | No | Returns a list of all Budget Goals | N/A | N/A |
| GET | ```/api/goals/:user_id``` | No | Returns a list of Budget Goals for a specific user | N/A | user_id
| POST | ```/api/goals``` | No | Adds a user's goals table. Suggestion: Create table in income component, then use PUT request for other goals. | Income or One of the other goals | N/A |
| PUT | ```/api/goals/:user_id``` | No | Updates a specific user's goals (can update any number all are nullable) | food, housing, personal, income, giving, savings, debt, transfer, transportation | user_id



#### Income Route
 | Method | Endpoint | Token Required | Description | Body | Params |
|---|---|---|---|---|---|
| POST | ```/api/income``` | Yes | Adds a user's manually inputted monthly income amount. | income, user_id | N/A
## Actions

### Okta Actions

`findUserByEmail()`  -> Returns a user based off their email.

`addUser()` -> Inserts userInfo to add a user to the database.

`deleteUser()` -> Deletes a user based off their email.

`findAllUsers()` -> Finds all users in the database.

`updateUser()` -> Updates a user's info based off their city, state, onboarding_complete, and userId.

### Plaid Actions

`plaid_access()` -> Inserts the access_token and the user_id to the database for future plaid endpoints.

`findToken()` -> Inserts the access_token to the find the user it's associated with

`findTokensByUserId()` -> Seeks out the associated user_id to display the access_tokens that are connected to it.

`findAllTokens()` -> Finds all access_tokens in the database.

`deleteTokenByUserId()` -> Deletes a access_token based of the user_id and the access_token id.

`deleteAllTokensByUserId()` -> Deletes all access_tokens based of the user_id.

### Budget Actions

`findAll()` -> Finds all budget goals in the database.

`findById()` -> Finds all budget goals based on the user's user_id.

`add()` -> Adds a budget goals table based off of what goals data you insert into it.

`update()` -> Updates a user's budget goals based off of the changes and the user_id.

`remove()` -> Deletes a user's budget goals based off of their user_id.

### Income Actions

`addIncome()` -> Adds a user's income based off the value and the user_id.

`findIncomeById()` -> Find a user's income based off their user_id.

## Environment Variables

In order for the app to function correctly, the user must set up their own environment variables.

create a .env file that includes the following:

- APP_PORT - Sets the port for the app to run on
- PLAID_CLIENT_ID - Client key that was provided by [Plaid API](https://plaid.com/)
- PLAID_SECRET - Secret that was provided by [Plaid API](https://plaid.com/)
- PLAID_PUBLIC_KEY - Public key that was provided by [Plaid API](https://plaid.com/)
- PLAID_PRODUCTS - The products that we want to generate data from through the [Plaid API](https://plaid.com/)
- PLAID_COUNTRY_CODES - A list of country codes where [Plaid API](https://plaid.com/) will work from
- PLAID_ENV - Environment being used for [Plaid API](https://plaid.com/) IE: Sandbox, Development, Production
- ISSUER -  URL that is used for verification with [Okta](https://www.okta.com/)
- CLIENT_ID - ID assigned to each user/team that is needed for verification with [Okta](https://www.okta.com/)
- PG_PASSWORD - Secret password that belongs to each developer using [PostgreSQL](https://www.postgresql.org/)

## Contributing

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.

Please note we have a [code of conduct](./code_of_conduct.md). Please follow it in all your interactions with the project.

### Issue/Bug Request

**If you are having an issue with the existing project code, please submit a bug report under the following guidelines:**

- Check first to see if your issue has already been reported.
- Check to see if the issue has recently been fixed by attempting to reproduce the issue using the latest master branch in the repository.
- Create a live example of the problem.
- Submit a detailed bug report including your environment & browser, steps to reproduce the issue, actual and expected outcomes, where you believe the issue is originating from, and any potential solutions you have considered.

### Feature Requests

We would love to hear from you about new features which would improve this app and further the aims of our project. Please provide as much detail and information as possible to show us why you think your new feature should be implemented.

### Pull Requests

If you have developed a patch, bug fix, or new feature that would improve this app, please submit a pull request. It is best to communicate your ideas with the developers first before investing a great deal of time into a pull request to ensure that it will mesh smoothly with the project.

Remember that this project is licensed under the MIT license, and by submitting a pull request, you agree that your work will be, too.

#### Pull Request Guidelines

- Ensure any install or build dependencies are removed before the end of the layer when doing a build.
- Update the README.md with details of changes to the interface, including new plist variables, exposed ports, useful file locations and container parameters.
- Ensure that your code conforms to our existing code conventions and test coverage.
- Include the relevant issue number, if applicable.
- You may merge the Pull Request in once you have the sign-off of two other developers, or if you do not have permission to do that, you may request the second reviewer to merge it for you.

### Attribution

These contribution guidelines have been adapted from [this good-Contributing.md-template](https://gist.github.com/PurpleBooth/b24679402957c63ec426).

## Documentation

See [Frontend Documentation](https://github.com/Lambda-School-Labs/budget-blocks-fe/) for details on the frontend of our project.
Also, you can view the [iOS Documenation](https://github.com/Lambda-School-Labs/budget-blocks-ios) for details on the iOS application for the project.

# Information

## Postgres

- The backend is now running on Postgres, so things won't clear everytime the dev branch is commited to. In addition to that, you can create an account and sign up with plaid using user_good/pass_good just once now. No more re-creating accounts unless we need to wipe the DB.
