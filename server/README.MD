
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
        "message": "Welcome Yeet!",
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
        "ItemIdInserted": 1
    }

## (Plaid) **GET** /plaid/transactions/:userID

**This is no longer a post request,now you just pass the userID as a param in the url**


*When we implement the restricitve middleware, thers a chance it'll change to a get request and we'll get the user id from the authorization header token*

**Returns the list of transactions for that user**

    {
        "categories":[
            {
                "id": 10,
                "name": "Payment",
                "email": "Yeet",
                "transactions": [
                    {
                        "id": 2,
                        "name": "AUTOMATIC PAYMENT - THANK",
                        "amount": 2078.5,
                        "payment_date": "2019-01-30",
                        "category_id": 10,
                        "user_id": 1
                    },
                    {
                        "id": 5,
                        "name": "CREDIT CARD 3333 PAYMENT *//",
                        "amount": 25,
                        "payment_date": "2019-01-21",
                        "category_id": 10,
                        "user_id": 1
                    }
                ]
            },
        ],
        "accounts":[
            {
            "account_id": "BzkA8AKZagFaW6p68rqBtjbbePxMjMFwpoRrl",
            "balances": {
                "available": 100,
                "current": 110,
                "iso_currency_code": "USD",
                "limit": null,
                "unofficial_currency_code": null
            },
            "mask": "0000",
            "name": "Plaid Checking",
            "official_name": "Plaid Gold Standard 0% Interest Checking",
            "subtype": "checking",
            "type": "depository"
            },
            {
            "account_id": "3eJoaoXb6DFxwaLab6rBfaJJv5BEaEFqjyvzL",
            "balances": {
                "available": 200,
                "current": 210,
                "iso_currency_code": "USD",
                "limit": null,
                "unofficial_currency_code": null
            },
            "mask": "1111",
            "name": "Plaid Saving",
            "official_name": "Plaid Silver Standard 0.1% Interest Saving",
            "subtype": "savings",
            "type": "depository"
            }
        ]
    }

## (User) **GET** /api/users/categories/param

**You just pass the userID as a param in the url**

    {
        example: /api/users/categories/1(userid)
    }

**Returns the list of categories for that user**

    [
        {
            "id": 1,
            "name": "Bank Fees",
            "email": "yeet",
            "budget": null
        },
        {
            "id": 2,
            "name": "Cash Advance",
            "email": "yeet",
            "budget": null
        }
    ]

## (User) **PUT** /api/users/categories/param

**While hitting the endpoint, put the userid as a parameter on the end, then send the following object**

    {
        example: /api/users/categories/1(userid)
    }

    {    
        "categoryid": 1,
        "budget": 320
    }

**Returns the following object**

    {
        "userid": "1",
        "categoryid": 20,
        "amount": 320,
        "status": "true"
    }

## (User) **PUT** /api/users/income/:param

**While hitting the endpoint, put the userid as the parameter on the end, then pass the following object**

    {
        example: /api/users/income/1(userid)
    }

    {
	    "income":3100
    }

**Returns the id of the updated record**

    {
        "id":1
    }

## (User) **PUT** /api/users/savinggoal/:param

**While hitting the endpoint, put the userid as the parameter on the end, then pass the following object**


    {
        example: /api/users/savinggoal/1(userid)
    }

    {
	    "saving_goal":205
    }

**Returns the id of the updated record**

    {
        "id":1
    }

## (User) **GET** /api/users/user/:param

**While hitting the endpoint, put the userid as the parameter on the end**

    {
        example: /api/users/user/1
    }

**Returns the following object**

    {
        "user": {
            "id": 1,
            "email": "Yeet",
            "income": 4200,
            "saving_goal": 205
        }
    }