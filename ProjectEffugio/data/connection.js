const uuidv1 = require('uuid/v4');
const bluebird = require("bluebird");
const Promise = bluebird.Promise;
const mongoCollections = require("../config/mongoCollections");
const connectionList=mongoCollections.connection;
var ObjectID=require('mongodb').ObjectID;
var bcrypt = Promise.promisifyAll(require("bcrypt"));

let exportedMethods={
    async getConnectionByID(_id){
        if(!_id){
            throw 'you must provide an connection id to search'
        }

        const connectionCollection = connectionList();
    },
    async getConnectionByRequestorID(_userID){
        const connectionCollection = connectionList();
    },
    async getConnectionbyConnectorID(_userID){
        const connectionCollection = connectionList();

    },
    async getAllConnections(){
        const connectionCollection = connectionList();

    },
    async addConnection(connectionData){
        const connectionCollection = connectionList();

    },
    async deleteConnection(connectionID){
        const connectionCollection = connectionList();

    }




};

module.exports =  exportedMethods;