var MongoClient = require('mongodb').MongoClient
//http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#findOne

var state = {
  client: null,
  db: null
}

const options = {
  useNewUrlParser: true,
  keepAlive: 1, 
  connectTimeoutMS: 30000, 
  reconnectTries: 30, 
  reconnectInterval: 5000
}

//url and database must be separated in the mongo 3.x.x
//connect to database
exports.connect = function(mongo_url, database, done) {
  if (state.db) return done()
  MongoClient.connect(mongo_url, options, (err, client) => {
    if (err) {
      console.log(err, "Mongodb Error");
      return done(err);
    } else {
      var db = client.db(database);
      state.client = client;
      state.db = db
      done();
    }
  })
}

//get the db connection
exports.get = function() {
  return state.db
}

//close the db connection not required 
//we can now close in a client : 
exports.close = function(done) {
  if (state.db) {
    client.close(function(err, result) {
      state.client = null
      state.db = null
      state.mode = null
      done(err)
    })
  }
}