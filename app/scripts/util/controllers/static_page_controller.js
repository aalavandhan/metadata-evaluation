angular.module("c.util.controllers")

.controller("c.util.controllers.StaticPageController",["$scope", "$routeParams",
  function($scope, $routeParams){

    function init(){
      $scope.params = $routeParams;
    };

  init();

  }
]);
