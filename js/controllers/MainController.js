GoperApp.controller('MainController', ['$scope', '$translate', function ($scope, $translate) {

    //Data
    $scope.languageSvgPath = "assets/icons/fr_FR.svg";

    //Method

    $scope.changeLanguage = function(key, languageSvgPath) {
    	$translate.use(key);
    	$scope.languageSvgPath = languageSvgPath;
  	};
}]);