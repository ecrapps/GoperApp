GoperApp.controller('LoginController', ['$scope', '$state', 'LoginService', 'ToastService', '$log', function($scope, $state, LoginService, ToastService, $log) {
	
	//Data
	$scope.user = {};

	//Method
	$scope.login = function (user) {
		LoginService.checkLogin(user)
			.then(function mySuccess(response) {
		        if (response.data) {			        			
        			$state.go("home");
        			ToastService.displayToast('Login correct !');
        		} else {
        			ToastService.displayToast("Identifiant ou mot de passe incorrect !");
        		}
		    }, function myError(response) {
		    	$log.error("response error :", response);
			});
	}
}]);