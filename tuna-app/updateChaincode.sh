#!/bin/bash

# pass the new version of chaincode as argument ex: 1.1, 1.2, 2.0, .....
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer chaincode install -n tuna-chaincode -v $1 -p github.com/tuna-app

sleep 10

docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    cli peer chaincode upgrade -o orderer1.example.com:7050 --tls --cafile $ORDERER_CA -C mychannel -n tuna-chaincode -v $1 -c '{"Args":[""]}' -P "OR ('Org1MSP.peer','Org2MSP.peer')"