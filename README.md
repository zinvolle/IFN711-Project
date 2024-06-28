Install systems;
    Ganache: https://archive.trufflesuite.com/ganache/
    MongoDB: https://www.mongodb.com/try/download/community

Sign up for service:
    Pinata (https://www.pinata.cloud/)

To get the app working you'll need to do:
    Create a .env file in the react-frontend dir and enter the Pinata JWT under 'REACT_APP_JWT' and the gateway URL under 'REACT_APP_GATEWAY_URL'.
    Download all dependencies in react-frontend dir using 'npm i'
    Download all dependencies in express-backend dir using 'npm i'
    Start the react server in frontend dir using 'npm start'
    Start the backend server in backend dir using 'node index.js'
    Open Ganache Server
    Open 'mongod' (the MongoDB server)
    Enjoy!

To seed the mongod server with test data do:
    Run database by launching 'mongod.exe'
    Run node.js in backend dir (only required once)
    If you see "Seeding Successful" it means you're good!