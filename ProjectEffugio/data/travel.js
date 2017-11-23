const uuidv1 = require('uuid/v4');
const bluebird = require("bluebird");
const Promise = bluebird.Promise;
const mongoCollections = require("../config/mongoCollections");
const travelList=mongoCollections.travel;
var ObjectID=require('mongodb').ObjectID;
var bcrypt = Promise.promisifyAll(require("bcrypt"));


let exportedMethods={

async getAllTravel(){
    const travelConnection = travelList();

},
async getTravelByID(_id){
    const travelConnection = travelList();
},
async getIDByLocation(_location){
    const travelConnection = travelList();
},

async addTravelData(travelData){
    const travelConnection = travelList();
}


};

module.exports =  exportedMethods;