# Mascot Mayhem
by QuadLazer

## Project Description
Mascot Mayhem is a browser-based multiplayer card game based around the different football team mascots of universities in the US. The game was developed using the Phaser Node.js framework and tested using the Chai service. The multiplayer functionality is delivered through a client-server framework. Leaderboard and achievements features are included and implemented using an ElephantSQL database.

## Play Game
Access the game here: https://mpcards-h6fr.onrender.com/

## Build Game
1. Clone the repo
```console
git clone https://github.com/QuadLazer/mpcards.git
```
2. Copy FirebaseConfig.js to ./mpcards/client/src/helpers/plugins/FirebaseConfig.js
3. Copy noshare.js to ./mpcards/server/noshare.js
4. Install necessary packages in the frontend
```console
cd mpcards/client
npm ci
```
5. Install necessary packages in the backend
```console
cd ../server
npm ci
```
6. Open three terminals
Terminal 1 - Database server
```console
cd mpcards/server
npm run dbstart
```
Terminal 2 - Socket server
```console
cd mpcards/server
npm start
```
Terminal 3 - Run the game
```console
cd mpcards/client
npm start
```
Open a second browser window in incognito mode or on a different browser and use the address http://http://localhost:8080/ to emulate a second player.

To run the backend suite of tests, make sure there are no active database connections.
Open a *powershell* terminal and type:
```console
cd mpcards/server
$env:NODE_ENV="test"
npm test
```

## Team Members
Wes Ahearn (wejama)
Seth Paul (sethyboy20)
John Scharff
Syed Mahdi (5yM01)
