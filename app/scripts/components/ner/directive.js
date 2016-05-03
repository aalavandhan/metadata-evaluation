(function(){
  var app = angular.module("c.components.ner");
  app.directive("cNer", [function(){
    return{
      scope: { },
      replace: true,
      templateUrl: "app/scripts/components/ner/template.html",
      controller: "c.components.ner.Controller",
    };
  }]);

}());
