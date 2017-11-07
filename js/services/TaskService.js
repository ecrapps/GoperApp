GoperApp.factory('TaskService', ['$http', 'URL_TRAIN_API', function($http, URL_TRAIN_API) {
	
	var url_api = URL_TRAIN_API.URL_API;
	var factory = {};

	factory.getDailyTasks = function(idUser) {
		var data = {
			idUser : idUser
		}

		return $http({
        	method : "GET",
        	url : url_api + "getDailyTasks",
        	params : data 
	    });
	}

	factory.getHistoryDailyTasks = function(idUser) {
		var data = {
			idUser : idUser
		}
		
		return $http({
        	method : "GET",
        	url : url_api + "getHistoryDailyTasks" ,
        	params : data 
	    });
	}

	factory.getTasks = function() {
		return $http({
        	method : "GET",
        	url : url_api + "getTasks" 
	    });
	}

	factory.getTask = function(idTask) {
		var data = {
			idTask : idTask
		}

		return $http({
        	method : "GET",
        	url : url_api + "getTask" ,
        	params : data
	    });
	}

	factory.updateTaskCheck = function(task) {
		var data = {
			taskId : task.id,
			taskIsChecked : task.checked
		}

		return $http({
        	method : "POST",
        	url : url_api + "updateTaskCheck" ,
        	data : data
	    });
	}

	return factory;
}]);