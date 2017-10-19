agGrid.initialiseAgGridWithAngular1(angular);

var GoperApp = angular.module('GoperApp', 
    [
        'ngMaterial',
        'ui.router',
        'ngMdIcons',
        'angularFileUpload',
        'pascalprecht.translate',
        'agGrid',
        'truncate'
    ]
);

GoperApp.constant('URL_TRAIN_API', (function() {
  var url = "http://localhost/Ecr_api/public/index.php/Goper/";
  return {
    URL_API: url
  }
})());


GoperApp.config(function($stateProvider, $urlRouterProvider, $translateProvider, $mdThemingProvider) {

    $translateProvider.useStaticFilesLoader({
        files: [
            {
                prefix : './i18n/content/locale-',
                suffix : '.json'
            }/*,
            {
                prefix : './i18n/dialogs/locale-',
                suffix : '.json'
            }*/
        ]
    });
    // Enable escaping of HTML
    $translateProvider.useSanitizeValueStrategy('escape');

    $translateProvider.registerAvailableLanguageKeys(['en_UK', 'fr_FR', 'ger_GER'], {
        'en': 'en_UK',
        'fr': 'fr_FR',
        'ger': 'ger_GER'
    });

    //set preferred lang
    $translateProvider.preferredLanguage('fr');


    // use the HTML5 History API
    // $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/login");
        

    $stateProvider
        .state('home', {
            url: '/home',
            views: {
                '': { 
                    templateUrl: 'views/Home.html' 
                },
                'toolbar@home': { 
                    templateUrl: 'views/Toolbar.html'
                },
                'sidenav@home': { 
                    templateUrl: 'views/Sidenav.html'
                }
            }
        })
        .state('home.dailyTrainTasks', {
            url: '/dailyTrainTasks',
            templateUrl: 'views/content/DailyTrainTasks.html'
        })
        .state('home.administration', {
            url: '/administration',
            templateUrl: 'views/content/Administration.html'
        })
        .state('home.history', {
            url: '/history',
            templateUrl: 'views/content/History.html',
        })
        .state('home.import', {
            url: '/import',
            templateUrl: 'views/content/Import.html',
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/Login.html'
        })

        $mdThemingProvider.theme('default')
            .primaryPalette('blue-grey', {
                'default': '700'
            })
            .accentPalette('pink');
});