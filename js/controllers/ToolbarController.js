GoperApp.controller('ToolbarController', ['$scope', 'RegisterService', 
	function($scope, RegisterService) {
	
		//Data
		$scope.user = RegisterService.getUserConnected();
}]);