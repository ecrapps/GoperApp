GoperApp.factory('IdSessionService',
	function() {
		var fct = {};

		fct.setIdSession = setIdSession;
		fct.getIdSession = getIdSession;

		function setIdSession (idSession) {
			localStorage.setItem('idSession', idSession);
		};

		function getIdSession () {
			return localStorage.getItem('idSession');
		};

		return fct;
	}
);