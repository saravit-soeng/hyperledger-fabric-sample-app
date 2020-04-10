# Hyperledger Fabric Sample App
Blockchain - Hyperledger Fabric based Tuna Fishing Sample App

## Prerequisite
Before running the application, make sure you have the following environment setup:
- Set up Ubuntu on VirtualBox with Vagrant (recommended Ubuntu v16.04 LTS)
- Set up Docker, Docker-Compose
- Install Golang
- Install Node, npm

## Blockchain Network
#### Go to network folder and run script for network configuration:
```bash
vagrant@vagrant: ./generate.sh
```
Before execute this command make sure you provide the execute permission to _*.sh_ file ( _chmod +x *.sh_ ) and make sure you understand 
the configuration in such files as below:
- crypto-config.yaml
- configtx.yaml
- cc-generate.sh

For more detail about network configuration, go to check in network folder

After running the script, it will generate the configuration from __crypto-config.yaml__ file and __configtx.yaml__ file. It will also generate 
the connection profile from __cc-generate.sh__ script for future use.

#### Start the fabric network

Go to tuna-app folder and run the script:
```bash
vagrant@vagrant: ./startFabric.sh
```
For more detail about the how to start the network check startNetwork.sh script in network and also check in startFabric.sh script file

After network started, run the two javascript to enroll admin and register user:
```bash
vagrant@vagrant: node enrollAdmin.js
vagrant@vagrant: node registerUser.js
```
Run the application with node: 
```bash
vagrant@vagrant: node server.js
```
Go to => http://localhost:8080

###### Screenshot:

![Sample pic](https://firebasestorage.googleapis.com/v0/b/fir-demo-b5359.appspot.com/o/pictures%2Fhlf_homepage.jpg?alt=media&token=5f3d9b1a-f6ce-445f-9e47-655064ce56cf)

## Chaincode

Sample chaincode of the application. For more detail go to check __tuna-chaincode.go__ in _chaincode_ folder
```go
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

// SmartContract structure
type SmartContract struct {
}

// Tuna Model structure
type Tuna struct {
	Vessel    string `json:"vessel"`
	Timestamp string `json:"timestamp"`
	Location  string `json:"location"`
	Holder    string `json:"holder"`
}

/*Init method
 *Called when the chaincode is instantiated by network
 *Best practice is to have any ledger initialization
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

/*Invoke method
 *Called when an application request to run the Smart Contract "tuna-chaincode"
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) peer.Response {

	function, args := APIstub.GetFunctionAndParameters()

	if function == "queryTuna" {
		return s.queryTuna(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "recordTuna" {
		return s.recordTuna(APIstub, args)
	} else if function == "queryAllTuna" {
		return s.queryAllTuna(APIstub)
	} else if function == "changeTunaHolder" {
		return s.changeTunaHolder(APIstub, args)
	}
	return shim.Error("Invalid Smart Contract function name.")
}

/* initLedger method
 * Used to add default data to tuna records
 * Default ledger in blockchain
 */
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) peer.Response {
	tuna := []Tuna{
		Tuna{Vessel: "923F", Location: "67.0006, -70.4576", Timestamp: "1504054225", Holder: "John"},
		Tuna{Vessel: "M23F", Location: "91.2345, -49.4576", Timestamp: "1504057825", Holder: "William"},
		Tuna{Vessel: "919K", Location: "89.0306, -60.1234", Timestamp: "1504064233", Holder: "Master"},
		Tuna{Vessel: "933F", Location: "67.0006, -74.6573", Timestamp: "1504074225", Holder: "Michael"},
		Tuna{Vessel: "N23F", Location: "47.0406, -55.4474", Timestamp: "1504084225", Holder: "Irina"},
		Tuna{Vessel: "424A", Location: "62.0106, -46.8943", Timestamp: "1504094225", Holder: "Cristiano"},
		Tuna{Vessel: "97A3", Location: "89.0106, -67.9803", Timestamp: "1504014225", Holder: "Leonel"},
		Tuna{Vessel: "JJ89", Location: "37.0806, -78.9576", Timestamp: "1504024225", Holder: "Steve"},
		Tuna{Vessel: "909T", Location: "97.0073, -74.4576", Timestamp: "1504034225", Holder: "Roger"},
		Tuna{Vessel: "008Z", Location: "79.9070, -72.4576", Timestamp: "1504044225", Holder: "Chris"},
	}

/* main function
 * start the chaincode in the container during the instantiation
 */
func main() {

	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new smart contract: %s", err)
	}
}

```

## Fabric Node SDK Client

__enrollAdmin.js__:

```javascript
/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'network', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function main() {
    try {

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('admin', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
}

main();

```

__registerUser.js__:
```javascript
/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', 'network', 'connection-org1.json');

async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (userExists) {
            console.log('An identity for the user "user1" already exists in the wallet');
            return;
        }

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (!adminExists) {
            console.log('An identity for the admin user "admin" does not exist in the wallet');
            console.log('Run the enrollAdmin.js application before retrying');
            return;
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: 'user1', role: 'client' }, adminIdentity);
        const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('user1', userIdentity);
        console.log('Successfully registered and enrolled admin user "user1" and imported it into the wallet');

    } catch (error) {
        console.error(`Failed to register user "user1": ${error}`);
        process.exit(1);
    }
}

main();

```

#### Sample code for connect to Blockchain network for submit the transaction

```javascript
const { FileSystemWallet, Gateway, DefaultEventHandlerStrategies} = require('fabric-network');
const path = require('path');
const fs   = require('fs');

const ccpPath = path.resolve(__dirname, '..', 'network', 'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

async function connectToNetwork(callback) {
    // Create a new file system based wallet for managing identities
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = new FileSystemWallet(walletPath);

    // Check to see if we've already enrolled user
    const userExists = await wallet.exists('user1');
    if(!userExists){
        console.log('And identity for the user "user1" does not exist in the wallet');
        console.log('Run registerUser.js application before trying');
        return;
    }

    // Create a new gateway for connecting to our peer node. 
    const gateway = new Gateway();
    await gateway.connect(
        ccp, 
        {
            wallet: wallet, 
            identity:'user1', 
            discovery:{enabled:true, asLocalhost:true}
        }
    );

    // Get the network(channel) our contract is deployed to
    const network = await gateway.getNetwork('mychannel');

    // Get the contract from the network
    const contract = network.getContract('tuna-chaincode');
    
    callback(contract);
}

module.exports = (function() {
    return{
        get_all_tuna: async function(req, res) {
            console.log('getting all tuna from database.');
            connectToNetwork(async contract => {
                try {
                    const result = await contract.submitTransaction('queryAllTuna');
                    res.json(JSON.parse(result.toString()));
                } catch (error) {
                    console.error('Failed to submit transaction: - '+error);
                    process.exit(1);
                }
            }); 
        },
        add_tuna: async function(req, res) {
            connectToNetwork(async contract => {
                try {
                    var array       = req.params.tuna.split('_');
                    var key         = array[0];
                    var location    = array[1];
                    var timestamp   = array[2];
                    var holder      = array[3];
                    var vessel      = array[4];
    
                    await contract.submitTransaction('recordTuna', key, vessel, location, timestamp, holder);
                    
                    console.log('Transaction has been submitted');
                    res.json({message:"Transaction has been submitted"});
                } catch (error) {
                    console.error(error);
                }
            });
        },
        change_holder: async function(req,res){
            connectToNetwork(async contract =>{
                try {
                    var array       = req.params.holder.split('-');
                    var key         = array[0];
                    var holder      = array[1];
    
                    await contract.submitTransaction('changeTunaHolder', key, holder);
                    console.log('Transaction has been submitted.');
                    res.json({message:"Transaction has been submitted"});    
                } catch (error) {
                    console.error(error); 
                } 
            });
        }
    }
})();

```
For more detail about how to implement the fabric client, go to check in _tuna-app_ folder in the directory.

#### Enjoy your life!

## Reference
- https://github.com/hyperledger/fabric-samples
- https://hyperledger-fabric.readthedocs.io/en/release-1.4/whatis.html
- https://medium.com/swlh/hyperledger-chapter-1-foundation-7ad5bd94d452













