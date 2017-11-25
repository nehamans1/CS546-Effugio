const MongoClient = require("mongodb").MongoClient;
const uuidv1 = require('uuid/v4');
const users="usersData";
const travel="travelData";
const connections="connectionsData";

const settings = {
    mongoConfig: {
        serverUrl: "mongodb://localhost:27017/",
        database: "effugio"
    }
};

var makeDoc = function(user_id, name,hashedPassword,age,gender,location,occupation,orientation,
    contact_info,email) {
    return {
        _id: uuidv1(),
        user_id:user_id,
        name:name,
        hashedPassword:"",
        age:age,
        gender:gender,
        location:location,
        occupation:occupation,
        orientation:orientation,
        contact_info:contact_info,
        email:email,
        location_pref:[],
        connections:[]
        
    }
};

var addLocationPreference = function(user, location_id, budget_range) {
    var newLocationPref = {
        location_id: location_id,
        budget_range: budget_range
    };

    user.location_pref.push(newLocationPref);
};

var addConnection = function(user, connection_id) {
    

    user.connections.push(connection_id);
};

let fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
let _connection = undefined

function runSetup() {
    console.log("Inside connect");
    return MongoClient.connect(fullMongoUrl)
        .then(function(db) {
            return db.collection(users).drop().then(function() {
                return db;
            }, function() {
                // We can recover from this; if it can't drop the collection, it's because
                // the collection does not exist yet!
                return db;
            });
        }).then(function(db) {
            // We've either dropped it or it doesn't exist at all; either way, let's make 
            // a new version of the collection
            return db.createCollection(users);
        }).then(function(userCollection) {
            
            

            

            var userJack=makeDoc("jack_d","Jack Dawson","",25,"M","NJ","Teacher","s","9176567143","fake1@email.com");
            userJack.hashedPassword="$2a$16$mEbkQxGZt3a/qidjcCb6O..ah9yyDlGRj2lWpSK/ebQJJjSp1ISmS";
            addLocationPreference(userJack,"1234",1);
            addLocationPreference(userJack,"4321",2);
            addLocationPreference(userJack,"5678",1);

            var userRose=makeDoc("rose_d","Rose Dewitt","",25,"F","NY","Dancer","s","9136567143","fake2@email.com");
            addLocationPreference(userRose,"1234",1);
            addLocationPreference(userRose,"4321",2);
            
            // we can use insertMany to insert an array of documents!
            return userCollection.insertOne(userJack).then(function(jackUser) {

                var userRose=makeDoc("rose_d","Rose Dewitt","",25,"F","NY","Dancer","s","9136567143","fake2@email.com");
                addLocationPreference(userRose,"1234",1);
                addLocationPreference(userRose,"4321",2);
                
                addConnection(userRose,jackUser.insertedId);
                
                return userCollection.insertOne(userRose).then(function(){
                          return userCollection.find().toArray();
                    });
            });
        });
}


var exports = module.exports = runSetup;