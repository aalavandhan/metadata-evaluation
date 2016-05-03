'use strict';

/**
 * @ngdoc overview
 * @name metadataEvaluationApp
 * @description
 * # metadataEvaluationApp
 *
 * Main module of the application.
 */
angular
  .module('metadataEvaluationApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'angular-table',
    'c.components',
    'c.sections',
    'c.util',
    'ui.bootstrap',
    'infinite-scroll',
    'nemLogging',
    'ui-leaflet'
  ])
  .config(function ($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'app/scripts/sections/home/index.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .when('/size', {
        templateUrl: 'app/scripts/sections/home/size.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .when('/crawler', {
        templateUrl: 'app/scripts/sections/home/crawler.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .when('/parser', {
        templateUrl: 'app/scripts/sections/home/parser.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .when('/language', {
        templateUrl: 'app/scripts/sections/home/language.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .when('/ner', {
        templateUrl: 'app/scripts/sections/home/ner.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .when('/measurement', {
        templateUrl: 'app/scripts/sections/home/measurement.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .when('/about', {
        templateUrl: 'app/scripts/sections/home/about.html',
        controller: 'c.util.controllers.StaticPageController',
      })

      .otherwise({
        redirectTo: '/'
      });
  })

  .config(["$httpProvider", function ($httpProvider) {
    $httpProvider.interceptors.push(["$window", "$rootScope", "$q",
      function ($window, $rootScope, $q) {
        return {
          // response: function(response) {
          //   return response
          // }
        };
    }]);
  }]);
