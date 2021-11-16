## BackEnd

## Stacks

- NodeJS
- MySQL
- ExpressJS
- Sequelize ORM
- Mocha
- Chai

## Book Cashier

- [x] Auth Signin
- [x] Management Categories
- [x] Management Product
- [x] Management Card
- [x] Management Transaction
- [x] Management Dashboard or Chart

## Requirement

For running this project please install nodejs and mysql.

## Getting Started to the development

Clone the repository :

```
git clone https://github.com/elfinsanjaya12/be-book-cashier/
```

Switch to the repo folder :

```
cd be-book-cashier
```

Install all the dependencies using `npm` or you can using `yarn` :

```
npm install or yarn install
```

Set configuration database like on your environtment system,to the config file on mode `development` in file `app/config/database.js` :

```
"development": {
    "username": "DATABASE_USER_NAME",
    "password": "DATABASE_PASSWORD",
    "database": "DATABASE_NAME",
    "host": "DATABASE_HOST",
    "dialect": "mysql"
  },
```

Run the server :

```
npm run start
```

You can now access the server at http://localhost:3000

## Link API

- [x] https://documenter.getpostman.com/view/2945224/UVC9hRSF
