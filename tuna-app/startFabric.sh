#!/bin/bash

set -e

if [ ! -d ~/.hfc-key-store/ ]; then
    mkdir ~/.hfc-key-store/
fi

cd ../network
./startNetwork.sh

docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer chaincode install -n tuna-chaincode -v 1.0 -p github.com/tuna-app
docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer chaincode instantiate -o orderer1.example.com:7050 -o orderer2.example.com:7050 -o orderer3.example.com:7050 -C mychannel -n tuna-chaincode -v 1.0 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"
sleep 10
docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer chaincode invoke -o orderer1.example.com:7050 -o orderer2.example.com:7050 -o orderer3.example.com:7050 -C mychannel -n tuna-chaincode -c '{"function":"initLedger","Args":[""]}'


# ----- Command for install and upgrade , query, invoke the chaincode --------------

# peer chaincode invoke -o orderer1.example.com:7050 -o orderer2.example.com:7050 -o orderer3.example.com:7050 -C mychannel -n tuna-chaincode -c '{"function":"changeTunaHolder","Args":["1", "Nana"]}'

# peer chaincode invoke -o orderer1.example.com:7050 -o orderer2.example.com:7050 -o orderer3.example.com:7050 -C mychannel -n tuna-chaincode -c '{"function":"queryTuna","Args":["1"]}'

# peer chaincode install -n tuna-chaincode -v 1.1 -p github.com/tuna-app

# peer chaincode instantiate -o orderer1.example.com:7050 -o orderer2.example.com:7050 -o orderer3.example.com:7050 -C mychannel -n tuna-chaincode -v 1.1 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

# peer chaincode upgrade -o orderer1.example.com:7050 -o orderer2.example.com:7050 -o orderer3.example.com:7050 -C mychannel -n tuna-chaincode -v 1.1 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"