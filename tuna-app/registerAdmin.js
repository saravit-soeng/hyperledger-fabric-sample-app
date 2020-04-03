'use strict';

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');

var path = require('path');
var os = require('os');

var fabric_client = new Fabric_Client();
var fabric_ca_client = null;
var admin_user = null;
var store_path = path.join(os.homedir(), '.hfc-key-store');
console.log('Store path:'+store_path);

// create the key value store
Fabric_Client.newDefaultKeyValueStore({
    path:store_path
}).then(state_store => {
    fabric_client.setStateStore(state_store);
    var crypto_suite = Fabric_Client.newCryptoSuite();
    var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});

    crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);

    var tlsOptions = {
        trustedRoots:[],
        verify: false
    };

    fabric_ca_client = new Fabric_CA_Client('http://localhost:7054', tlsOptions, 'ca.org1.example.com', crypto_suite);

    return fabric_client.getUserContext('admin', true);
}).then(user_from_store => {
    if(user_from_store && user_from_store.isEnrolled()){
        console.log("Successfully loaded admin from persistence");
        admin_user = user_from_store;
        return null;
    }else {
        return fabric_ca_client.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        }).then(enrollment => {
            console.log('Sucessfully enrolled admin user: "admin" ');
            return fabric_client.createUser({
                username:'admin',
                mspid:'Org1MSP',
                cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
            })
        }).then(user => {
            admin_user = user;
            return fabric_client.setUserContext(admin_user);
        }).catch(err => {
            console.error('Failed to enroll and persist admin. Error:'+err.stack ? err.stack : err);
            throw new Error('Failed to enroll admin'); 
        })
    }
}).then(()=>{
    console.log('Assigned the admin user to the fabric client :: '+admin_user.toString());
}).catch(err => {
    console.error('Failed to enroll admin: '+err);   
});
