'use strict';

var app = angular.module('application',[]);
var last_id = null;

app.controller('appController', function($scope, appFactory) {
    $scope.queryAllTuna = function() {
        appFactory.queryAllTuna(function(data) {
            var array = [];
            for (var i = 0; i<data.length; i++) {
                data[i].Record.Key = parseInt(data[i].Key);
                array.push(data[i].Record);
            }
            array.sort((a,b)=>{
                return parseFloat(a.Key) - parseFloat(b.Key);
            });
            $scope.all_tuna = array;
            last_id = $scope.all_tuna[$scope.all_tuna.length-1].Key;
            console.log($scope.all_tuna);
        });
    }
    $scope.recordTuna = function(){
        appFactory.recordTuna($scope.tuna, function(response){
            console.log("Response:"+JSON.stringify(response));
            let object = JSON.parse(JSON.stringify(response));
            
            if(object.status == 200) {
                $scope.queryAllTuna();
            }
        })
    }
    $scope.changeHolder = function(){
        appFactory.changeHolder($scope.holder, function(response){
            console.log(JSON.stringify(response));
            $scope.queryAllTuna();
        })
    }
});

app.factory('appFactory', function($http) {
    var factory = {};

    factory.queryAllTuna = function(callback) {
        $http.get('/get_all_tuna').then( response => {
            callback(response.data);
            console.log(response);            
        }, err => {
            console.log("error:"+err);            
        });
    }

    factory.recordTuna = function(data, callback){
        data.location = data.longtitude +", " + data.latitude;
        data.id = last_id+1;
        console.log("===>id:"+data.id);
        
        console.log("==>dt:"+data.timestamp);
        data.timestamp = (new Date(data.timestamp)).getTime() / 1000;
        
        var tuna = data.id + "_" + data.location + "_" + data.timestamp + "_" + data.holder + "_" + data.vessel;
        console.log("==>:"+tuna);
        $http.get("/add_tuna/"+tuna).then(response => {
            callback(response);
        }, err => {
            console.error("Error:"+err);
        });
    }

    factory.changeHolder = function(data, callback) {
        var holder = data.id + "-" + data.name;

        console.log("Holder: "+holder);
        

        $http.get('/change_holder/'+holder).then( response => {
            callback(response.data);         
        }, err => {
            console.log("error:"+JSON.stringify(err));            
        });
    }

    return factory;
});