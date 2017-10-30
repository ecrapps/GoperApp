GoperApp.controller('HomeController', ['$scope', '$mdSidenav', '$state', function($scope, $mdSidenav, $state) {	

	$scope.toggleLeft = buildToggler('left');

    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    $scope.menus = [
        {
            name  : 'NAVIGATION.DAILY_TASK_TRAIN',
            title : 'MENU.DAILY_TASK_TRAIN_TITLE',
            state : 'home.dailyTrainTasks'
        },
    	{
    		name  : 'NAVIGATION.HISTORY',
    		title : 'MENU.HISTORY_TITLE',
            state : 'home.history'
    	},    	
    	{
    		name  : 'NAVIGATION.IMPORT',
    		title : 'MENU.IMPORT_TITLE',
            state : 'home.import'
    	},
    	{
    		name  : 'NAVIGATION.ADMINISTRATION',
    		title : 'MENU.ADMINISTRATION_TITLE',
            state : 'home.administration'
    	}
    ];

    if($state.current.name === "home"){
        $state.go('home.dailyTrainTasks');
    }
}]);