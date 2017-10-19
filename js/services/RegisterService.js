GoperApp.factory('RegisterService', function() {
	var fct = {};
	var user;

	fct.setUserConnected = setUserConnected;
	fct.getUserConnected = getUserConnected;

	function setUserConnected (userConnected) {
		user = userConnected;
	};

	function getUserConnected () {
		return user;
	};

	return fct;
});