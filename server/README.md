# DWF22PBS_holyways_api

# Usage

```
npm start

//creating database
npx sequelize db:create

//creating table
npx sequelize db:migrate

```

#### Endpoint Route:

##### Auth

| Name     | Endpoint Route                        |
| -------- | ------------------------------------- |
| login    | http://localhost:9000/api/v1/login    |
| register | http://localhost:9000/api/v1/register |

##### User

| Name         | Endpoint Route                        |
| ------------ | ------------------------------------- |
| results user | http://localhost:9000/api/v1/users    |
| delete user  | http://localhost:9000/api/v1/user/:id |
| update user  | http://localhost:9000/api/v1/user/:id |

##### Fund

| Name         | Endpoint Route                        |
| ------------ | ------------------------------------- |
| results fund | http://localhost:9000/api/v1/funds    |
| detail fund  | http://localhost:9000/api/v1/fund/:id |
| create fund  | http://localhost:9000/api/v1/fund/    |
| update fund  | http://localhost:9000/api/v1/fund/:id |
| delete user  | http://localhost:9000/api/v1/fund/:id |

##### User Donate

| Name               | Endpoint Route                                    |
| ------------------ | ------------------------------------------------- |
| update user donate | http://localhost:9000/api/v1/fund/:fundid/:userid |
