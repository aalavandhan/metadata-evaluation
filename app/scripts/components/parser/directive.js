(function(){
  var app = angular.module("c.components.parser");
  app.directive("cParser", [function(){
    return{
      scope: { },
      replace: true,
      templateUrl: "app/scripts/components/parser/template.html",
      controller: "c.components.parser.Controller",
    };
  }]);

}());
