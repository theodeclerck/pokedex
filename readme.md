first this project is a nodejs api with a db that both run into a docker

to run the project you have to run the docker-compose.yml file

you can edit the environment files which are in /config

in /src/database you can find the file that do the connection with the docker database

you can find the models in /src/model

you can find all routes in /src/routes

you can find middlewares in /src/middleware

in /src/index.js you can find the base file which call all the routes 

all routes are described in {container_ipaddress}:8000/api-docs

to access the routes you have to know the container ip address

to run the lint go to the package.json

tests and logs are in the todo list