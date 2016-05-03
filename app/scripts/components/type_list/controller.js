(function(){
  var app = angular.module("c.components.typeList");
  app.controller("c.components.typeList.Controller", [ "$scope", "c.data.Type",
    function($scope, Type){
      function defineScope(){
        $scope.formats = _.map(Type.get(), function(t){
          return { key: t }
        });

        $scope.loadSelectedList = function(){
          $scope.selected = _.chain($scope.formats)
                             .filter(function(f){
                               return f.$selected
                             })
                             .pluck("key")
                             .value();
        };

        $scope.select = function(f){
          $scope.selected = f;
        }
      };

      defineScope();
    }
  ]);
}());
