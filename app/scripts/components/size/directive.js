(function(){
  var app = angular.module("c.components.size");
  app.directive("cTypeSize", [function(){
    return{
      scope: { },
      replace: true,
      templateUrl: "app/scripts/components/size/template.html",
      controller: "c.components.size.Controller",
    };
  }]);

}());
