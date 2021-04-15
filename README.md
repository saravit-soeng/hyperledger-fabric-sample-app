# Blockchain & Hyperledger Fabric Concepts
Blockchain is a specific form or subset of distributed ledger technologies, which constructs a chronological chain of blocks, hence the name ‘block-chain’. 
At a technical level, a blockchain can be defined as an immutable ledger for recording transactions, maintained within a distributed network of mutually untrusting peers.

Blockchain frameworks include the following four building blocks:
- A shared ledger: append-only distributed system of record shared across business network
- Cryptography: ensuring appropriate visibility, transactions are secured, authenticated, and verifiable.
- Trust systems or consensus: Transactions are endorsed by relevant participants
- Business rules or smart contracts: business terms embedded in transactions and executed with transactions.

A distributed ledger is a type of data structure which resides across multiple computer devices, generally spread across locations or regions.

A block refers to a set of transactions that are bundled together and added to chain at the same time.

Transactions: the record of an event, cryptographically secured with a digital signature, that is verified, ordered, and bundled together into blocks, form the transactions in the blockchain.

Cryptography has a key role to play both in the security, as well as in the immutability of the transactions recorded on blockchains. For blockchain technologies, cryptography is used to prove that a transaction was created by the right person. It is also used to link transactions into a block in a tamper-proof way, as well as create the links between blocks, to form a blockchain.

Timestamping is another key feature of blockchain technology. Each block is timestamped, with each new block referring to the previous block. Combined with cryptographic hashes, this timestamped chain of blocks provides an immutable record of all transactions in the network, from the very first (or genesis) block.

A block commonly consists of four pieces of metadata:
- The reference to the previous block
- The proof of work, also known as a nonce
- The timestamp
- The Merkle tree root of for the transactions included in this block

Consensus is a process whereby the computers that are part of the network synchronize the data on the blockchain. A consensus algorithm, hence, does two things: it ensures that the data on the ledger is the same for all the nodes in the network, and, in turn, prevents malicious actors from manipulating the data.

There are a number of consensus mechanisms or algorithms:
- Proof of Work
- Proof of Stake
- Proof of Elapsed Time
- Simplified Byzantine Fault Tolerance
- Practical Byzantine Fault Tolerance (PBFT)

Smart Contracts are simply computer programs that execute predefined actions when certain conditions within the system are met. Smart contracts - A language of transactions that changes the ledger state.

Blockchain vs. Databases:
- A blockchain is a write-only data structure, where new entries get appended onto the end of the ledger. There are no administrator permissions within a blockchain that allow editing or deleting of data. Blockchain is designed for decentralized applications.
- In a relational database, data can be easily modified or deleted. There are database administrators who may make changes to any part of the data and/or its structure. Relational databases are designed for centralized applications, where a single entity controls the data.

Blockchain type:
- Permissioned blockchain (the different Hyperledger blockchain framework): is also known as private blockchain, requires pre-verification of the participating parties within the network, and these parties are usually known to each other.
- Permissionless blockchain (like Bitcoin or Ethereum): is also known as a public blockchain because anyone can join the network.

Hyperledger frameworks:
- Iroha
- Sawtooth
- Fabric
- Indy
- Burrow

Blockchain is best suited for business applications where one or more of the the conditions apply:
- There is a need for a shared common database
- The parties involved with the process have conflicting incentives, or do not have trust among the participants
- There are multiple parties involved or writers to a database
- There are currently trusted third parties involved in the process that facilitate interactions between multiple parties who must trust the third party.
- Cryptocurrency is currently being used or should be used.
- Data for a business process is being entered into many different databases along the lifecycle of the process.
- There are uniform rules governing participants in the system
- Decision making of the parties is transparent, rather than confidential
- There is a need for an objective, immutable history or log of facts for parties’ reference
- Transaction frequency does not exceed 10,000 transactions per second.

Hyperledger Fabric Elements:
- Channels: are data partitioning mechanisms that allow transaction visibility for stakeholders only. Each channel is an independent chain of transaction blocks containing only transactions for that particular channel.
- Chaincode (Smart Contract): It encapsulates both the asset definitions and the business logic (or transactions) for modifying those assets. Transaction invocations result in changes to the ledger.
- Ledger contains the current world state of the network and a chain of transaction invocations. A shared, permissioned ledger is an append-only system of records and serves as a single source of truth.
- Network is the collection of data processing peers that form a blockchain network
- Ordering service is a collection of nodes that orders transaction into a block
- World State reflects the current data about all the assets in the network. This data is stored in a database for efficient access. Current supported databases are LevelDB and CouchDB.
- Membership Service Provider (MSP) manages identity and permissioned access for clients and peers.

A Hyperledger Fabric transaction involves three types of nodes: 
- The committing peer is the node that maintains the ledger and state. The committing peer is the party that commits transactions and may hold the smart contract or chaincode. 
- The endorsing peer is a specialized committing peer that can grant or deny endorsement of a transaction proposal. The endorsing peer has to hold the smart contract.
- The ordering nodes (service) communicate with the committing and peer nodes; their main function is to approve the inclusion of transaction blocks into the ledger. Unlike the committing peer and endorsing peer, the ordering nodes do not hold the smart contract or the ledger

Roles within a Hyperledger Fabric Network:
- Clients: are applications that act on behalf of a person to propose transactions on the network.
- Peers: maintains the state of network and a copy of the ledger. There are two different types of peers: endorsing and committing peers. However, there is an overlap between endorsing and committing peers, in that endorsing peers are a special kind of committing peers. All peers commit blocks to the distributed ledger.
- Endorsers simulate and endorse transactions
- Committers verify endorsements and validate transaction results, prior to committing transactions to the blockchain.
- Ordering service: accepts endorsed transactions, orders them into a block, and delivers the block to the committing peers.

In Hyperledger Fabric, consensus is made up of three distinct steps:
- Transaction endorsement
- Ordering
- Validation and commitment

Channels allow organizations to utilize the same network, while maintaining separation between multiple blockchains. Only the members of the channel on which the transaction was performed can see the specifics of the transaction.

LevelDB vs. CouchDB:
- LevelDB is the default key/value state database for Hyperledger Fabric, and simply stores key/value pairs.
- CouchDB is an alternative to LevelDB. Unlike LevelDB, CouchDB stores JSON objects. CouchDB is unique in that it supports keyed, composite, key range, and full data-rich queries.

Membership Service Provider, or MSP, is a component that defines the rules in which identities are validated, authenticated, and allowed access to a network.

Is Blockchain Network Trustable? If So, Why?
- Blockchain is a peer-to-peer network that has its consensus algorithm. The main reason behind its trustworthiness is how it stores and deals with data. It uses cryptographic algorithms to ensure that the data is protected against any third-party malicious actor. This means only the entity that owns the data will be able to access it.
- Also, the data stored in the blockchain can be traced anytime, which brings in transparency. One more thing that makes blockchain trustworthy is the data integrity feature. With this feature, data cannot be changed after it is written.

What is the difference between Ethereum and Bitcoin Blockchain?
- The main difference is how they are trying to solve the industry problem. Conceptually, bitcoin is a digital currency, whereas Ethereum is about smart contracts. Ethereum is also energy efficient as it uses Proof-of-Stake (PoS) consensus algorithm compared to bitcoin’s Proof-of-Work (PoW). This also makes Ethereum more scalable compared to bitcoin.

The blockchain ecosystem has four main components:
- Node application
- Shared ledger
- Consensus algorithms
- Virtual machine

There are many key features of blockchain. They include the following:
- Blockchain as a data structure: Blockchain can act as a data structure and store different types of data, including identity information, insurance, medical, and so on.
- Immutability: The data, once stored in the blockchain, is immutable. This gives the blockchain tamper detection property as well.
- Data protection: As the owner of the data is the source peer itself, data protection is completely dependent on the source. The absence of third-party actors also means that it is secure and offers the best data protection
- Decentralized ledger technology: Decentralized ledger technology is the most important feature of a blockchain. It can be used by a private organization or public in a variety of use-cases.
- Better user anonymity: Users are relatively hidden compared to other traditional networks.
- Double spending: Blockchain solves double-spending problems using consensus algorithms and distributed ledger technology.

Benefits of blockchain include the following –
- Improved transparency
- Increased security
- Better traceability
- Increased speed and efficiency
- Reduced costs

There are six key principles that blockchain can ensure proper safety and allow organizations to create appropriate transactional records:
- Auditing
- Securing applications
- Database security
- Digital workforce training
- Proper testing methods
- Continuity planning.

What Is the Difference Between Proof-Of-Stake (Pos) And Proof-Of-Work (Pow)?
- The difference between the two most popular consensus algorithms, PoW, and PoS, is how they operate. PoW is energy-hungry, whereas PoS isn’t. Other key differences include the need for huge computation power in PoW compared to no or less computation power in PoS. PoS is also cost-effective and offers a faster completion time when compared to PoW.

What Is Hyperledger?
- Hyperledger is an open-source collaborative effort to improve blockchain. It offers an enterprise-grade framework.

Business areas where blockchain can be applied and purpose:
- Banking:
	- Supply chain and trade finance
	- Know your customer
	- Transaction banking, payments, and digital currencies
- Financial Markets:
	- Post trade
	- Unlisted securities and private equity funds
	- Reference data
	- Cross currency payments
	- Mortgages
- Retail:
	- Supply chain
	- Loyalty programs
	- Information sharing (supplier - retailer)
- Manufacturing:
	- Supply chain
	- Product parts
	- Maintenance tracking
- Insurance:
	- Complex risks coverage
	- Group Benefits
	- Parametric Insurance
	- Asset usage history
	- Claims filling
- Healthcare:
	- Mediated health data exchange
	- Clinical trial management
	- Outcome based contracts
	- Medicine supply chain

Difficulties in applying blockchain to business:
- Rising cost of blockchain implementation
- Low scalability
- Insufficient knowledge-base on Blockchain
- Difficulty in transitioning from legacy networks
- Lack of technology partners
- Low data privacy
- Security issues
- Lack of regulations 
- No Interoperability of enterprise Blockchain Platforms

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

#### Enjoy blockchain!

## Reference
- https://github.com/hyperledger/fabric-samples
- https://hyperledger-fabric.readthedocs.io/en/release-1.4/whatis.html
- https://medium.com/swlh/hyperledger-chapter-1-foundation-7ad5bd94d452













