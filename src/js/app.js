/**
 * Created by Estevao on 16/08/2015.
 */

var vip = angular.module('vip', ['ngCookies', 'ui.router']);

vip.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/home");

  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "views/home.html"
    })
    .state('portfolio', {
      url: "/portfolio",
      templateUrl: "views/portfolio.html"
    });
}]);

vip.factory('translations', ['$http', '$q', function($http, $q) {
  var translations = {
    en: {},
    cn: {},
    pt: {},
    es: {},
    it: {}
  };

  var cLang = 'en';

  for (var lg in translations) {
    if (translations.hasOwnProperty(lg)) {
      if (!angular.isUndefined(window.translations)) {
        (function(trnsl, abbrev) {
          translations[abbrev] = $q(function(resolve) {
            resolve(trnsl);
          });
        })(window.translations[lg], lg);
      } else {
        (function(abbrev) {
          translations[abbrev] = $http.get('translation/' + abbrev + '.yml').then(
            function(response) {
              return jsyaml.load(response.data);
            }
          );
        })(lg);
      }
    }
  }

  return {
    getTranslations: function(lang) {
      if (translations.hasOwnProperty(lang)) {
        return translations[lang];
      }
    }
  };
}]);

vip.controller('MainCtrl', ['$scope', 'translations', '$cookies', '$location', '$anchorScroll', function($scope, translations, $cookies, $location, $anchorScroll) {

  $scope.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  };

  $scope.translation = {};
  $scope.showMenu = false;

  if (!$cookies.get('language')) {
    var lang;
    if (!angular.isUndefined(window.navigator.languages) && !angular.isUndefined(window.navigator.languages[0])) {
      lang = window.navigator.languages[0];
    } else if (!angular.isUndefined(window.navigator.language)){
      lang = window.navigator.language;
    } else if (!angular.isUndefined(window.navigator.userLanguage)) {
      lang = window.navigator.userLanguage;
    } else {
      lang = 'en';
    }
    lang = lang.replace(/(.*)-.*/, '$1');
    $cookies.put('language', lang);
  }

  $scope.lang = $cookies.get('language');
  $scope.langs = [
    {abr: 'en', ext: "English", active: false},
    {abr: 'cn', ext: "简体中文", active: false},
    {abr: 'pt', ext: "Português", active: false},
    {abr: 'es', ext: "Castellano", active: false},
    {abr: 'it', ext: "Italiano", active: false}
  ];

  var loadTranslation = $scope.loadTranslation = function (lang) {
    translations.getTranslations(lang).then(
      function (trnsl) {
        $scope.translation = trnsl;
      }
    );
    for (var i = 0; i < $scope.langs.length; ++i) {
      $scope.langs[i].active = $scope.langs[i].abr === lang;
    }
    $cookies.put('language', lang);
    $scope.showMenu = false;
  };

  loadTranslation($scope.lang);

  $scope.t = function (idx) {
    //console.log(idx, $scope.translation.hasOwnProperty(idx));
    if ($scope.translation.hasOwnProperty(idx) && !angular.isUndefined($scope.translation[idx])) {
      return $scope.translation[idx];
    } else {
      return idx;
    }
  };
}]);

vip.controller('PortfolioCtrl', ['$scope', '$http', '$sce', function($scope, $http, $sce) {
  $scope.trustAsHtml = $sce.trustAsHtml;
  $scope.tiles = [];
  $http.get('data/portfolio.json').then(
    function(success) {
      $scope.tiles = success.data;
    },
    function(error) {
      console.log(error);
    }
  );
}]);