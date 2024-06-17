const { MongoClient } = require('mongodb');
const express = require ('express');
const app = express()
const port = 4000
const uri = "mongodb://127.0.0.1:27017";
const cors = require('cors');

app.use(cors());
app.use(express.json());
const client = new MongoClient(uri)


async function run() {
    try {
      // Connect to the MongoDB cluster
      console.log('connecting to Mongo Database...')
      await client.connect();
      console.log('MongoDB connected');
  
      const database = client.db('webdatabase');
      const usersCollection = database.collection('users');

      app.get('/api/users/all', async (req, res) => {
        try {
            const allUsers = await usersCollection.find().toArray()
            res.json(allUsers)
        } catch (err){
            res.status(500).json({message: err.message})
        }
      })

      app.get('/api/userskey/:publickey', async (req, res) => {
        const publickey = decodeURIComponent(req.params.publickey);
        console.log(`Received public key: ${publickey}`);
        
        try {
          const user = await usersCollection.findOne({ publicKey: publickey });
          console.log(`Query result for publicKey: ${JSON.stringify(user)}`); 
      
          if (user) {
            res.json(user);
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        } catch (err) {
          console.error(`Error fetching user by publicKey: ${err.message}`);
          res.status(500).json({ message: err.message });
        }
      });

      
      app.get('/api/userstype/:type', async (req, res) => {
        const type = req.params.type;
        console.log(type)
        try {
          const user = await usersCollection.findOne({ type: type });
          if (user) {
            res.json(user);
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });


      // Route to get user by username
      app.get('/api/users/:username', async (req, res) => {
        const username = req.params.username;
        console.log(username);
        try {
          const user = await usersCollection.findOne({ username: username });
          if (user) {
            res.json(user);
          } else {
            res.status(404).json({ message: 'User not found' });
          }
        } catch (err) {
          res.status(500).json({ message: err.message });
        }
      });

      app.post('/api/createUser', async (req, res) => {
        try {
          const newEntry = {
            username: req.body.username,
            type: req.body.type,
            publicKey: req.body.publicKey,
            signaturePublicKey: req.body.signaturePublicKey
          };
          const userExists = await usersCollection.findOne({username: newEntry.username})
          if (userExists) {
            res.status(400).send({message: 'User creation faled. User already exists'})
            return
          }
          const result = await usersCollection.insertOne(newEntry);
          res.json({message: 'success'});
        } catch (error) {
          console.error('Error inserting entry:', error);
          res.status(500).send({ message: 'Internal Server Error' });
        }
      });


  
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (err) {
      console.error(err);
    }
  }
  
  run().catch(console.error);