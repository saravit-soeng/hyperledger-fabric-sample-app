#!/bin/bash

export FABRIC_CFG_PATH=$PWD
echo $FABRIC_CFG_PATH
CHANNEL_NAME=mychannel

# remove previous crypto material and config transaction
rm -rf config/*
rm -rf crypto-config/*

# generate crypto material
cryptogen generate --config=./crypto-config.yaml
if [ "$?" -ne 0 ]; then
    echo "Failed to generate crypto material"
    exit 1
fi

./ccp-generate.sh

# generate genesis block for orderer
configtxgen -profile SampleDevModeKafka -outputBlock ./config/genesis.block
if [ "$?" -ne 0 ]; then
    echo "Failed to generate orderer genesis block"
    exit 1
fi

# generate channel configuration transaction
configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./config/channel.tx -channelID $CHANNEL_NAME
if [ "$?" -ne 0 ]; then
    echo "Failed to generate channel configuration"
    exit 1
fi

# generate anchor peer transaction for org1
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./config/Org1MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org1MSP
if [ "$?" -ne 0 ]; then
    echo "Failed to generate anchor peer update for Org1MSP"
    exit 1
fi

# generate anchor peer transaction for org2
configtxgen -profile TwoOrgsChannel -outputAnchorPeersUpdate ./config/Org2MSPanchors.tx -channelID $CHANNEL_NAME -asOrg Org2MSP
if [ "$?" -ne 0 ]; then
    echo "Failed to generate anchor peer update for Org2MSP"
    exit 1
fi

echo "Generate success!"