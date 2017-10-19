GoperApp.factory('AdminTrainIdService', ['$http', 'URL_TRAIN_API', function($http, URL_TRAIN_API) {
	var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

    factory.getTrainIds = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getTrainIds" 
	    });
    }

    factory.createTrainId = function(newTrainId) {
    	var data = {
            trainIdName : newTrainId.name,
	        trainIdMd : newTrainId.isMD
	    };
    	return $http({
        	method : "POST",
        	url : url_api + "createTrainId", 
        	data: data
	    });
    }

    factory.updateTrainId = function(trainId, idTrainId) {
        var data = {
            trainIdName : trainId.name,
            trainIdMd : trainId.isMD,
            idTrainId : idTrainId
        };
        return $http({
            method : "POST",
            url : url_api + "updateTrainId", 
            data: data
        });
    }

    factory.deleteTrainId = function(idTrainId) {
        var data = {
            idTrainId : idTrainId
        };
        return $http({
            method : "POST",
            url : url_api + "deleteTrainId", 
            data: data
        });
    }

    return factory;
}]);