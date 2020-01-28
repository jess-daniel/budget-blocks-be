## Default Logins:

`email: test@test.com`

`password: password`

# Information

## JWT

- Uses JWT web tokens to store user information and verifies the keys by using a JWT_SECRET environment variable (will need to create)
- JWT token contains user_id, and email


## (auth) **POST** /api/auth/register

 **Expected requst body:**

    {
        "email": "Yeet",
        "password": "Yeet"
    }

**Returns the id of the newly created user:201 Status**

    {
        "message": "success",
        "id": 1
    }

## (auth) **POST** /api/auth/login

**Expected request body:**

    {
        "email": "Yeet",
        "password": "Yeet"
    }

**Returns the token, id, and BankAccountLink status**

    {
        "id": 1,
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6Ikt5bGUiLCJpYXQiOjE1ODAyMzU0NzMsImV4cCI6MTU4MDI0OTg3M30.vOU1ZbHcLxOgCtD50Pu7JqHiudEc-0VYtDfbtXeqvlU",
        "message": "Welcome Kyle!",
        "LinkedAccount": false
    }

## (Plaid) **POST** /plaid/token_exchange

**Expected request body**

**The publicToken is what you get from the react-plaid-link**

    {
        "publicToken": "public-sandbox-b54b4ec6-877d-456f-a916-2c38542be274",
        "userid": 1
    }

**Returns confirmation that the AccessToken and Item(Plaid's term) has been inserted, and an array of transactions**

    {
        "AccessTokenInserted": 1,
        "ItemIdInserted": 1,
        "TransactionsInserted":[]
    }