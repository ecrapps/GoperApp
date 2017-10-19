GoperApp.controller('HistoryController', ['$scope', 'TaskService', function ($scope, TaskService) {
    
    // Data

    $scope.tasks = getTasks();
    
    //Method

    function getTasks (){
    	var tasks = TaskService.getTasks();
    	console.log('tasks : ', tasks)
    	return tasks;
    }
   
}]);