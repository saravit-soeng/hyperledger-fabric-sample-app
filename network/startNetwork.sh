#!/bin/bash
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer1.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export BYFN_CA1_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org1.example.com/ca && ls *_sk)
export BYFN_CA2_PRIVATE_KEY=$(cd crypto-config/peerOrganizations/org2.example.com/ca && ls *_sk)

echo $BYFN_CA1_PRIVATE_KEY
echo $BYFN_CA2_PRIVATE_KEY

docker-compose -f docker-compose.yaml down
docker-compose -f docker-compose.yaml up -d

if [ "$?" -ne 0 ]; then
    echo "Failed to start network"
    exit 1
fi
echo "--- Network started ---"

# wait for Hyperledger Fabric to start
# incase of errors when running later commands, issue export FABRIC_START_TIMEOUT=<larger number>
sleep 30

# Create the channel
docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
    cli peer channel create -o orderer1.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/channel.tx --tls --cafile $ORDERER_CA
if [ "$?" -ne 0 ]; then
    echo "Failed to create channel"
    exit 1
fi
echo "--> Created channel"

# Join channel in Org1
docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
    cli peer channel join -b mychannel.block
if [ "$?" -ne 0 ]; then
    echo "Failed to join channel"
    exit 1
fi
echo " - Peer0-Org1 joined channel."


docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer1.org1.example.com:7051" \
    cli peer channel join -b mychannel.block
if [ "$?" -ne 0 ]; then
    echo "Failed to join channel"
    exit 1
fi
echo " - Peer1-Org1 joined channel."


# Join channel Org2
docker exec \
    -e "CORE_PEER_LOCALMSPID=Org2MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer0.org2.example.com:7051" \
    -e "CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/server.crt" \
    -e "CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/server.key"  \
    -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
    cli peer channel join -b mychannel.block
if [ "$?" -ne 0 ]; then
    echo "Failed to join channel"
    exit 1
fi
echo " - Peer0-Org2 joined channel."


docker exec \
    -e "CORE_PEER_LOCALMSPID=Org2MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer1.org2.example.com:7051" \
    -e "CORE_PEER_TLS_CERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/server.crt" \
    -e "CORE_PEER_TLS_KEY_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/server.key"  \
    -e "CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/peers/peer1.org2.example.com/tls/ca.crt" \
    cli peer channel join -b mychannel.block
if [ "$?" -ne 0 ]; then
    echo "Failed to join channel"
    exit 1
fi
echo " - Peer1-Org2 joined channel."


# Update Anchor Peer for Org1
docker exec \
    -e "CORE_PEER_LOCALMSPID=Org1MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer0.org1.example.com:7051" \
    cli peer channel update -o orderer1.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/Org1MSPanchors.tx --tls --cafile $ORDERER_CA
if [ "$?" -ne 0 ]; then
    echo "Failed to update anchor peer"
    exit 1
fi
echo "--> Updated anchor peer for org1"

# Update Anchor Peer for Org2
docker exec \
    -e "CORE_PEER_LOCALMSPID=Org2MSP" \
    -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp" \
    -e "CORE_PEER_ADDRESS=peer0.org2.example.com:7051" \
    cli peer channel update -o orderer1.example.com:7050 -c mychannel -f /etc/hyperledger/configtx/Org2MSPanchors.tx --tls --cafile $ORDERER_CA
if [ "$?" -ne 0 ]; then
    echo "Failed to update anchor peer"
    exit 1
fi
echo "--> Updated anchor peer for org2"