GoperApp.controller('AdministrationController', ['$scope', function ($scope) {
    
    // DATAS
    var vm = this;
    $scope.setWidthAndHeight = setWidthAndHeight;

    vm.tabs = [
        {
            name : 'Tâches',
            templateUrl : 'views/content/administration/Tasks.html'
        },
    	{
    		name : 'Train ID',
    		templateUrl : 'views/content/administration/TrainId.html'
    	}
    ];

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var contentElement = document.querySelector('#contentElement');

    // METHODS
    function setWidthAndHeight(width, height, element) {
        if (width != '' && element !== null) {
            element.style.width = width;
        }
        if (height != '' && element !== null) {
            element.style.height = height;
        }
    }

    if (y > 870) {
        setWidthAndHeight('', '89%', contentElement);
    } else {
        setWidthAndHeight('', '85%', contentElement);
    }

}]);