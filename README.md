# Badges

[![Maintainability](https://api.codeclimate.com/v1/badges/48e243bd3d68a7d834b0/maintainability)](https://codeclimate.com/github/Lambda-School-Labs/budget-blocks-be)
[![Test Coverage](https://api.codeclimate.com/v1/badges/48e243bd3d68a7d834b0/test_coverage)](https://codeclimate.com/github/Lambda-School-Labs/budget-blocks-be)

# API Documentation

#### Backend deployed at [Heroku](https://lambda-budget-blocks.herokuapp.com/). <br>

## Getting started

To get the server running locally:

- Clone this repo
- **npm install** to install all required dependencies
- **npm run server** to start the local server
- **npm test** to start server using testing environment

### Backend framework

Why did you choose this framework?

- PostGres - Used this to deploy our backend to persist the data on Heroku
- Heroku - Used to host our app. Heroku makes deploying web apps simple and fast
- Knex - Used to create data migration tables and seeds to continuously have a clean data set

#### Okta Routes <-- in progress(ignore current endpoints in documentation)

| Method | Endpoint                        | Token Required | Description                                                                       |
| ------ | ------------------------------- | -------------- | --------------------------------------------------------------------------------- |
| POST   | `/api/auth/login`               | No             | Logs a user in and returns a JWT token and if they have a linked account to Plaid |
| POST   | `/api/auth/register`            | No             | Registers a new user and returns the user id                                      |
| GET    | `/api/users/categories/:userId` | Yes            | Returns the list of categories for that user                                      |
| PUT    | `/api/users/categories/:userId` | Yes            | Adds a new category for the user                                                  |
| PUT    | `/api/users/income/:userId`     | Yes            | Adds an income amount for the user                                                |
| PUT    | `/api/users/savinggoal/:userId` | Yes            | Adds a savings goal for the user                                                  |
| GET    | `api/users/`                    | Yes            | Gets a list of all the users                                                      |
| GET    | `api/users/user/:userId`        | Yes            | Gets the information for a specific user                                          |
| DELETE | `api/users/user/:userId`        | Yes            | Deletes the user from the user table.                                             

#### Plaid Routes

| Method | Endpoint                      | Token Required | Description                                                                                                       |
| ------ | ----------------------------- | -------------- | ----------------------------------------------------------------------------------------------------------------- |
| POST   | `/plaid/token_exchange`       | No             | Exchanges PublicToken received by using the Plaid Link to connect to a bank account to retrieve the access token, must be connected to the user_id received from Okta|
| GET    | `/plaid/items/:id` | No             | Returns the access_tokens associated with the user's id.                                                                  |

## Actions

`plaid_access()` -> Inserts the access_token and the user_id to the database for future plaid endpoints.

`findTokensByUserId()` -> Seeks out the associated user_id to display the access_tokens that are connected to it.

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
- PG_PASSWORD - Secret password that belongs to each developer using PG.
random''.join([random.SystemRandom().choice('abcdefghijklmnopqrstuvwxyz0123456789!@#\$%^&amp;\*(-*=+)') for i in range(50)])

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

See [Frontend Documentation](https://github.com/Lambda-School-Labs/budget-blocks-fe/) for details on the fronend of our project.
Also, you can view the [iOS Documenation](https://github.com/Lambda-School-Labs/budget-blocks-ios) for details on the iOS application for the project.

# Information

## Postgres

- The backend is now running on Postgres, so things won't clear everytime the dev branch is commited to. In addition to that, you can create an account and sign up with plaid using user_good/pass_good just once now. No more re-creating accounts unless we need to wipe the DB.

## (plaid) **POST** /plaid/token_exchange/:id

**Expected request body:**

    {
        "client_id": "{{client_id}}",
        "secret": "{{secret_key}}",
        "publicToken": "public-sandbox-64d2b25a-d7b0-44fd-82ba-d89735bad115" <-- example
    }

**Returns a status 200, user_id must be attached as the id parameters, stores access_token and user_id into database**

## (plaid) **GET** /plaid/accessToken/:id

**Expected request results example:**

    {
        "id": "1",
        "access_token": "Amnsdgni13224ion1312asf",
        "user_id": "1" 
    }

**Returns a status 200, retrieves the access_tokens associated with the user_id**
