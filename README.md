# ICook server
This ICook server was built using RESTful architecture, PostgreSQL, knex, and express. Authentication and cross-site scripting were addressed during development to ensure client and server security. Upon registration, the server also checks the users' input for password strength and usernames' availability before entering the new user into the database.

## Links
Live: https://icook.nphiukhao.now.sh \
Client repo: https://github.com/nphiukhao/ICook-App-client

Example endpoints include:\
/login\
/register\
/add\
/all\
/auth/login\
/delete/id\
/ingred\
/recipe/id\
/time/limit

## Tech
Built using: Express, Knex, PostgreSQL, Node.js\
Tested using: mocha, chai
