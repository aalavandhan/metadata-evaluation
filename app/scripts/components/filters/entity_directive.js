(function(){
  var app = angular.module("c.components.filters");
  app.directive("cEntityFilter", [function(){
    return{
      scope:{
        entity: "=",
      },
      replace: true,
      templateUrl: "app/scripts/components/filters/entity_template.html"
    };
  }]);
}());
