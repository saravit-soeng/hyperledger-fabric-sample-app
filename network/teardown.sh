#!/bin/bash

# Exit on first error, print all commands
set -e

# shut down docker containers
docker-compose -f docker-compose.yaml kill && docker-compose -f docker-compose.yaml down

# remove the local state
rm -f ~/.hfc-key-store/*

# remove chaincode docker images
docker rmi $(docker images dev-* -q)

echo "Your system is now clean"
