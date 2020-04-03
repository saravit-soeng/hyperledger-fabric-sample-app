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

/* queryTuna method
 * Used to view record of one particular Tuna
 * It takes one arguement - the key of tuna
 */
func (s *SmartContract) queryTuna(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments - expecting 1")
	}

	tunaAsBytes, _ := APIstub.GetState(args[0])
	if tunaAsBytes == nil {
		return shim.Error("Could find this tuna.")
	}
	return shim.Success(tunaAsBytes)
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

	i := 0
	for i < len(tuna) {
		tunaAsBytes, _ := json.Marshal(tuna[i])
		APIstub.PutState(strconv.Itoa(i+1), tunaAsBytes)
		i = i + 1
	}
	return shim.Success(nil)
}

/* recordTuna method
 * Used to add Tuna data to tuna records
 * Accept five argument - key, vessel, location, timestamp, holder
 */
func (s *SmartContract) recordTuna(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 5 {
		return shim.Error("Invalid number of arguments - expecting 5")
	}
	var tuna = Tuna{Vessel: args[1], Location: args[2], Timestamp: args[3], Holder: args[4]}
	tunaAsBytes, _ := json.Marshal(tuna)
	err := APIstub.PutState(args[0], tunaAsBytes)
	if err != nil {
		return shim.Error("Failed to record new tuna")
	}
	return shim.Success(nil)
}

/* queryAllTuna method
 * Used to access all Tuna records added to ledger
 * Accept five argument - key, vessel, location, timestamp, holder
 * This method does not get any arguments. Return JSON String containing results.
 */
func (s *SmartContract) queryAllTuna(APIstub shim.ChaincodeStubInterface) peer.Response {
	startKey := "0"
	endKey := "999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}

		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}

		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")
	fmt.Printf(" - queryAlTuna: \n%s\n", buffer.String())
	return shim.Success(buffer.Bytes())
}

/* changeTunaHolder method
 * Used to change Tuna Holder
 * Accept 2 argument - tuna key, and new holder name
 */
func (s *SmartContract) changeTunaHolder(APIstub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("Invalid number of arguments - expecting 2")
	}

	tunaAsBytes, _ := APIstub.GetState(args[0])
	if tunaAsBytes == nil {
		return shim.Error("Can not find the tuna record")
	}
	tuna := Tuna{}
	json.Unmarshal(tunaAsBytes, &tuna)
	tuna.Holder = args[1]

	tunaAsBytes, _ = json.Marshal(tuna)
	err := APIstub.PutState(args[0], tunaAsBytes)
	if err != nil {
		return shim.Error("Update failed.")
	}
	return shim.Success(nil)
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
