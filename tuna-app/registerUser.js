'use strict';

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var os = require('os');

var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var member_user = null;
var store_path = path.join(os.homedir(), '.hfc-key-store');
console.log('Store path: '+store_path);

// Create the key value store 
Fabric_Client.newDefaultKeyValueStore({
    path: store_path
}).then(state_store => {
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();

    var crypto_store = Fabric_Client.newCryptoKeyStore({path:store_path});
    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);

    fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', null, '', crypto_suite);
    return fabric_client.getUserContext('admin', true);
}).then(user_from_store => {
    if (user_from_store && user_from_store.isEnrolled()){
        console.log('Successfully loaded admin from persistence');
        admin_user = user_from_store;
    }else {
        throw new Error('Failed to get admin... run registerAdmin.js')
    }

    return fabric_ca_client.register({enrollmentID: 'user1', affiliation:'org1.department1'}, admin_user);
}).then(secret => {
    console.log('Successfully register user1 - secret: ' + secret);

    return fabric_ca_client.enroll({enrollmentID:'user1', enrollmentSecret: secret});
}).then(enrollment => {
    console.log('Successfully enrolled member user: "user1"');
    return fabric_client.createUser({
        username:'user1',
        mspid: 'Org1MSP',
        cryptoContent: {privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate}
    });
}).then(user=>{
    member_user = user;
    return fabric_client.setUserContext(member_user);
}).then(()=>{
    console.log('User1 was successfully registered and enrolled and is ready to interact with the fabric network'); 
}).catch(err => {
    console.error('Failed to register:'+err);
    if(err.toString.indexOf('Authorization') > -1){
        console.error('Authorization failures may be caused by have admin credentials from a previous CA instance.\n'+
        'Try again after deleting the content of the directory '+store_path);  
    }
});
