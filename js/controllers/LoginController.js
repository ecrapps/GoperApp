GoperApp.controller('LoginController', ['$scope', '$state', 'LoginService', 'ToastService', '$log', 'IdSessionService', 
	function($scope, $state, LoginService, ToastService, $log, IdSessionService) {
	
		//Data
		$scope.user = {};

		//Methods
		$scope.login = function (user) {
			LoginService.checkLogin(user)
				.then(function mySuccess(response) {
			        if (response.data.loginSucceed) {
	        			$state.go("home");
	        			ToastService.displayToast('Login correct !');
	        			IdSessionService.setIdSession(response.data.user);
	        		} else {
	        			ToastService.displayToast("Identifiant ou mot de passe incorrect !");
	        		}
			    }, function myError(response) {
			    	$log.error("response error :", response);
				});
		}
}]);