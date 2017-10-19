GoperApp.factory('AdminClientsService', ['$http', 'URL_TRAIN_API', function ($http, URL_TRAIN_API) {

    var url_api = "http://localhost/Ecr_api/public/index.php/Admin/";
	var factory = {};

    factory.getClients = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getClients" 
	    });
    }

    factory.getClientsInTask = function(idUser) {
        var data = {
            idUser : idUser
        };
        return $http({
            method : "GET",
            url : url_api + "getClientsInTask", 
            params: data
        });
    }

    return factory;
}]);