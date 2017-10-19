GoperApp.factory('AdminTasksService', ['$http', 'URL_TRAIN_API', function($http, URL_TRAIN_API) {
    
    var url_api = URL_TRAIN_API.URL_API;
    var factory = {};

    factory.getTasks = function() {
    	return $http({
        	method : "GET",
        	url : url_api + "getTasks" 
	    });
    }

    factory.createTask = function(newTask) {
    	var data = {
            taskName : newTask.name,
            taskDelay : newTask.taskDelay,
	        taskType : newTask.type
	    };
    	return $http({
        	method : "POST",
        	url : url_api + "createTask", 
        	data: data
	    });
    }

    factory.updateTask = function(task, idTask) {
        var data = {
            taskName : task.name,
            taskDelay : task.taskDelay,
            taskType : task.type,
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "updateTask", 
            data: data
        });
    }

    factory.deleteTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "deleteTask", 
            data: data
        });
    }

    factory.getTaskTypes = function (idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "GET",
            url : url_api + "getTaskTypes", 
            params: data
        });
    }

    factory.deleteTrainTask = function(idTrain, idTask) {
        var data = {
            idTrain : idTrain,
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "deleteTrainTask", 
            data: data
        });
    }

    factory.associateTrainTask = function(idTrain, idTask) {
        var data = {
            idTrain : idTrain,
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "associateTrainTask", 
            data: data
        });
    }

    factory.getTrainsInTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "GET",
            url : url_api + "getTrainsInTask", 
            params: data
        });
    }

    factory.deleteClientTask = function(idClient, idTask) {
        var data = {
            idClient : idClient,
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "deleteClientTask", 
            data: data
        });
    }

    factory.associateClientTask = function(idClient, idTask) {
        var data = {
            idClient : idClient,
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "associateClientTask", 
            data: data
        });
    }

    factory.getClientsInTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "GET",
            url : url_api + "getClientsInTask", 
            params: data
        });
    }

    factory.deleteCommonTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "deleteCommonTask", 
            data: data
        });
    }

    factory.associateCommonTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "associateCommonTask", 
            data: data
        });
    }

    factory.deleteCancellationTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "deleteCancellationTask", 
            data: data
        });
    }

    factory.associateCancellationTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "associateCancellationTask", 
            data: data
        });
    }

    factory.deleteMdTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "deleteMdTask", 
            data: data
        });
    }

    factory.associateMdTask = function(idTask) {
        var data = {
            idTask : idTask
        };
        return $http({
            method : "POST",
            url : url_api + "associateMdTask", 
            data: data
        });
    }

    return factory;
}]);