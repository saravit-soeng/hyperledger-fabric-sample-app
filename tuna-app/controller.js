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