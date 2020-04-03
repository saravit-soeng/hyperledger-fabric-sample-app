var Fabric_Client   = require('fabric-client');
var path            = require('path');
var util            = require('util');
var os              = require('os');

module.exports = (function() {
    return{
        get_all_tuna: function(req, res) {
            console.log('getting all tuna from database.');
            
            var fabric_client = new Fabric_Client();
            
            // setup the fabric network
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            channel.addPeer(peer);

            var member_user = null;
            var store_path = path.join(os.homedir(), '.hfc-key-store');
            console.log('Store path:'+store_path);
            var tx_id = null;

            Fabric_Client.newDefaultKeyValueStore({
                path:store_path
            }).then(state_store => {
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();

                var crypto_store = Fabric_Client.newCryptoKeyStore({path:store_path});
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                return fabric_client.getUserContext('user1', true)
            }).then(user_from_store => {
                if(user_from_store && user_from_store.isEnrolled()){
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                }else {
                    throw new Error('Failed to get user1... run registerUser.js');
                }

                const request = {
                    chaincodeId: 'tuna-chaincode',
                    txId:tx_id,
                    fcn:'queryAllTuna',
                    args:['']
                };

                return channel.queryByChaincode(request);
            }).then(query_responses => {
                // query_responses could have more than one result if there are multiple peers were used as targets
                if(query_responses && query_responses.length == 1) {
                    if(query_responses[0] instanceof Error){
                        console.error('error from query =', query_responses[0]);
                    }else{
                        res.json(JSON.parse(query_responses[0].toString()));
                    }
                }else {
                    console.log('No payloads were returned from query');
                }
            }).catch(err => {
                console.error('Failed to query: '+ err);          
            });
        },
        add_tuna: function(req, res) {

            var array       = req.params.tuna.split('_');
            var key         = array[0];
            var location    = array[1];
            var timestamp   = array[2];
            var holder      = array[3];
            var vessel      = array[4];

            var fabric_client = new Fabric_Client();
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            channel.addPeer(peer);
            var orderer = fabric_client.newOrderer('grpc://localhost:7050');
            channel.addOrderer(orderer);

            var member_user = null;
            var store_path = path.join(os.homedir(), '.hfc-key-store');
            var tx_id = null;
            
            Fabric_Client.newDefaultKeyValueStore({
                path:store_path
            }).then(state_store => {
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();

                var crypto_store = Fabric_Client.newCryptoKeyStore({path:store_path});
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                return fabric_client.getUserContext('user1', true)
            }).then(user_from_store => {
                if(user_from_store && user_from_store.isEnrolled()){
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                }else {
                    throw new Error('Failed to get user1... run registerUser.js');
                }

                tx_id = fabric_client.newTransactionID();

                const request = {
                    chaincodeId: 'tuna-chaincode',
                    txId: tx_id,
                    fcn: 'recordTuna',
                    args:[key, vessel, location, timestamp, holder],
                    chainId: 'mychannel'
                };

                return channel.sendTransactionProposal(request);
            }).then(results => {
                var proposalResponses = results[0];
                var proposal = results[1];
                let isProposalGood = false;
                if(proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200){
                    isProposalGood = true;
                    console.log('Transaction proposal was good');
                }else{
                    console.error('Transaction proposal was bad');                    
                }
                if(isProposalGood) {
                    var request = {
                        proposalResponses: proposalResponses,
                        proposal: proposal
                    };
                    var transaction_id_string = tx_id.getTransactionID();
                    var promises = [];

                    var sendPromise = channel.sendTransaction(request);
                    promises.push(sendPromise);

                    let event_hub = channel.newChannelEventHub('localhost:7051');
                    // event_hub.setPeerAddr('grpc://localhost:7053');

                    let txPromise = new Promise((resolve, reject) => {
                        let handle = setTimeout(() => {
                            event_hub.disconnect();
                            resolve({event_status:'TIMEOUT'});
                        }, 3000)
                        event_hub.connect();
                        event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
                            clearTimeout(handle);
                            event_hub.unregisterTxEvent(transaction_id_string);
                            event_hub.disconnect();

                            var return_status = {event_status:code, tx_id:transaction_id_string};
                            if(code !== 'VALID') {
                                console.error('The transaction was invalid, code='+code);   
                                resolve(return_status);                         
                            }else{
                                console.log('The transaction has been commited on peer, '+event_hub.getPeerAddr());
                                resolve(return_status);
                            }
                        }, err => {
                            reject(new Error('There was a problem with the eventhub ::'+err));
                        });
                    });
                    promises.push(txPromise);
                    return Promise.all(promises);
                }else {
                    console.error('failed to send the proposal');
                }
            }).then(results => {
                if(results && results[0] && results[0].status === 'SUCCESS') {
                    console.log('Successfully commited the change to the ledger by the peer');
                    res.send(tx_id.getTransactionID());
                }else{
                    console.log('Transaction faild to be committed to the ledger due to:'+results[1].event_status);                    
                }
    
            }).catch(err => {
                console.error('Failed to query: '+ err);          
            });
        },
        get_tuna: function(req, res) {
            var fabric_client = new Fabric_Client();
            var key = req.params.id;

            // setup the fabric network
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            channel.addPeer(peer);

            var member_user = null;
            var store_path = path.join(os.homedir(), '.hfc-key-store');
            console.log('Store path:'+store_path);
            var tx_id = null;

            Fabric_Client.newDefaultKeyValueStore({
                path:store_path
            }).then(state_store => {
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();

                var crypto_store = Fabric_Client.newCryptoKeyStore({path:store_path});
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                return fabric_client.getUserContext('user1', true)
            }).then(user_from_store => {
                if(user_from_store && user_from_store.isEnrolled()){
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                }else {
                    throw new Error('Failed to get user1... run registerUser.js');
                }

                const request = {
                    chaincodeId: 'tuna-chaincode',
                    txId:tx_id,
                    fcn:'queryTuna',
                    args:[key]
                };

                return channel.queryByChaincode(request);
            }).then(query_responses => {
                // query_responses could have more than one result if there are multiple peers were used as targets
                if(query_responses && query_responses.length == 1) {
                    if(query_responses[0] instanceof Error){
                        console.error('error from query =', query_responses[0]);
                        res.send('could not find the tuna');
                    }else{
                        res.send(query_responses[0].toString());
                    }
                }else {
                    console.log('No payloads were returned from query');
                    res.send('could not find the tuna');
                }
            }).catch(err => {
                console.error('Failed to query: '+ err); 
                res.send('could not find the tuna');         
            });
        },
        change_holder:function(req, res) {
            var array       = req.params.holder.split('-');
            var key         = array[0];
            var holder      = array[1];

            var fabric_client = new Fabric_Client();
            var channel = fabric_client.newChannel('mychannel');
            var peer = fabric_client.newPeer('grpc://localhost:7051');
            channel.addPeer(peer);
            var orderer = fabric_client.newOrderer('grpc://localhost:7050');
            channel.addOrderer(orderer);

            var member_user = null;
            var store_path = path.join(os.homedir(), '.hfc-key-store');
            var tx_id = null;
            
            Fabric_Client.newDefaultKeyValueStore({
                path:store_path
            }).then(state_store => {
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();

                var crypto_store = Fabric_Client.newCryptoKeyStore({path:store_path});
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                return fabric_client.getUserContext('user1', true)
            }).then(user_from_store => {
                if(user_from_store && user_from_store.isEnrolled()){
                    console.log('Successfully loaded user1 from persistence');
                    member_user = user_from_store;
                }else {
                    throw new Error('Failed to get user1... run registerUser.js');
                }

                tx_id = fabric_client.newTransactionID();
                console.log("===>"+key+" "+holder+" "+tx_id);
                const request = {
                    chaincodeId: 'tuna-chaincode',
                    txId: tx_id,
                    fcn: 'changeTunaHolder',
                    args:[key, holder],
                    chainId: 'mychannel'
                };

                return channel.sendTransactionProposal(request);
            }).then(results => {
                console.log("==>:"+results);
                
                var proposalResponses = results[0];
                var proposal = results[1];
                let isProposalGood = false;
                if(proposalResponses && proposalResponses[0].response && proposalResponses[0].response.status === 200){
                    isProposalGood = true;
                    console.log('Transaction proposal was good');
                }else{
                    console.error('Transaction proposal was bad');                    
                }
                if(isProposalGood) {
                    var request = {
                        proposalResponses: proposalResponses,
                        proposal: proposal
                    };
                    var transaction_id_string = tx_id.getTransactionID();
                    var promises = [];

                    var sendPromise = channel.sendTransaction(request);
                    promises.push(sendPromise);

                    let event_hub = channel.newChannelEventHub('localhost:7051');
                    // event_hub.setPeerAddr('grpc://localhost:7053');

                    let txPromise = new Promise((resolve, reject) => {
                        let handle = setTimeout(() => {
                            event_hub.disconnect();
                            resolve({event_status:'TIMEOUT'});
                        }, 3000)
                        event_hub.connect();
                        event_hub.registerTxEvent(transaction_id_string, (tx, code) => {
                            clearTimeout(handle);
                            event_hub.unregisterTxEvent(transaction_id_string);
                            event_hub.disconnect();

                            var return_status = {event_status:code, tx_id:transaction_id_string};
                            if(code !== 'VALID') {
                                console.error('The transaction was invalid, code='+code);   
                                resolve(return_status);                         
                            }else{
                                console.log('The transaction has been commited on peer, '+event_hub.getPeerAddr());
                                resolve(return_status);
                            }
                        }, err => {
                            reject(new Error('There was a problem with the eventhub ::'+err));
                        });
                    });
                    promises.push(txPromise);
                    return Promise.all(promises);
                }else {
                    console.error('failed to send the proposal');
                }
            }).then(results => {
                if(results && results[0] && results[0].status === 'SUCCESS') {
                    console.log('Successfully commited the change to the ledger by the peer');
                    res.send(tx_id.getTransactionID());
                }else{
                    console.log('Transaction faild to be committed to the ledger due to:'+results[1].event_status);                    
                }
    
            }).catch(err => {
                console.error('Failed to query: '+ err);          
            });
        }
    }
})();