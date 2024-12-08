Instructions for Adding Players and Teams via API
Important: Please follow these steps in order to ensure everything works correctly.

ALL files are in assets folder
Add Players:
Copy the contents of combined_players.json and send a POST request to http://localhost:8080/player/createMany.
This request will create all the necessary players required for forming teams.

Create Indian Team:
Copy the contents of india_players.json and send a POST request to http://localhost:8080/team.
This request will create the Indian team.

Create Bangladesh Team:
Copy the contents of bangladesh_players.json and send a POST request to http://localhost:8080/team.
This request will create the Bangladesh team.
By following these steps in the specified order, you will successfully add players and create teams in your application.

use .env.example to create .env file

Create user with {username, password} using POST request at http://localhost:8080/admin/create route
and then you can login using that username and password for admin.