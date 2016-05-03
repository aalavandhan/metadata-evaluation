(function(){
  var app = angular.module("c.components.filters");
  app.directive("cDocTypeFilter", [function(){
    return{
      scope:{
        documentType: "=",
      },
      replace: true,
      templateUrl: "app/scripts/components/filters/doc_type_template.html",
      controller: ["$scope", "$timeout", function($scope, $timeout){
        $scope.documentType = 'application-pdf';
      }]
    };
  }]);
}());
