#!/bin/bash

# pass the new version of chaincode as argument ex: 1.1, 1.2, 2.0, .....

docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer chaincode install -n tuna-chaincode -v $1 -p github.com/tuna-app

sleep 10

docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer chaincode upgrade -o orderer1.example.com:7050 -o orderer2.example.com:7050 -o orderer3.example.com:7050 -C mychannel -n tuna-chaincode -v $1 -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"