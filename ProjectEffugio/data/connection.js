const uuidv1 = require('uuid/v4');
const bluebird = require("bluebird");
const Promise = bluebird.Promise;
const mongoCollections = require("../config/mongoCollections");
const connectionList=mongoCollections.connection;
var ObjectID=require('mongodb').ObjectID;
var bcrypt = Promise.promisifyAll(require("bcrypt"));

let exportedMethods={
    async getConnectionById(_id){
        if(!_id){
            throw 'you must provide an connection id to search';
        }

        const connectionCollection = await connectionList();
	    const listOfConnections = await connectionCollection.find({_id: _id}).limit(1).toArray();
	    if (listOfConnections.length ===0) return null;
	    return listOfConnections[0];
    },
    async getConnectionByRequestorId(requestor_id){
	    if(!requestor_id) throw 'provide an requestor id'
        const connectionCollection = await connectionList();
	    const listOfConnections = await connectionCollection.find({requestor_id: requestor_id}).toArray();
	    if (listOfconnections.length ===0) return null;
	    return listOfConnections;
	
    },
    async getConnectionbyConnectedId(connected_id){
	    if(!connector_id) throw 'provide an connector id'
        const connectionCollection = await connectionList();
	    const listOfConnections = await connectionCollection.find({connector_id: connector_id}).toArray();
	    if (listOfconnections.length ===0) return null;
	    return listOfConnections;

    },
    async getAllConnections(){
        const connectionCollection = await connectionList();
	    const listOfConnections = await connectionCollection.find().toArray();
	    connections = [];


	    for(var val of listOfConnections){
	        oneConnection={};
	        oneConnection._id = val._id;
	        oneConnection.requestor_id = val.requestor_id;
	        oneConnection.connected_id = val.connected_id;
	        oneConnection.status = val.status;
	        oneConnection.location_id = val.location_id;
	        oneConnection.date_initiated = val.date_initiated;

	        connections.push(oneConnection);
	    }

	    return connections;
    },
    async addConnection(connectionData){
        const connectionCollection = await connectionList();

	    const newConnection = {
	        _id: uuidv1(),
	        requestor_id: connectionData.requestor_id,
	        connected_id: connectionData.connected_id,
	        status: connectionData.status,
	        location_id: connectionData.location_id,
	        date_initiated: connectondata.date_initiated
	    };

	    console.log(newConnection);
	    const newInsertInformation = await connectionCollection.insertOne(newConnection);
	    const newId = newInsertedInformation.insertedId;
	    console.log("inserted: "+newId);
	    return await this.getConnetionById(newId);

    },
    async removeConnection(_id){
	    if(!_id) throw 'provide an id to delete';
        const connectionCollection = await connectionList();
	    const deletionInfo = await connectionCollection.removeOne({ _id: _id});
	    if (deletionInfo.deletedCount ===0){
	        throw `Could not delete user with id of ${_id}`;
	    }
    }




};

module.exports =  exportedMethods;
