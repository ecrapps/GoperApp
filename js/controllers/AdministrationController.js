GoperApp.controller('AdministrationController', ['$scope', function ($scope) {
    
    // Data
    var vm = this;

    vm.tabs = [
        {
            name : 'Tasks',
            templateUrl : 'views/content/administration/Tasks.html'
        },
    	{
    		name : 'Train ID',
    		templateUrl : 'views/content/administration/TrainId.html'
    	}
    ];
    // Methods

}]);