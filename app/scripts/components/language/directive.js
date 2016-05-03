(function(){
  var app = angular.module("c.components.language");
  app.directive("cLanguage", [function(){
    return{
      scope: { },
      replace: true,
      templateUrl: "app/scripts/components/language/template.html",
      controller: "c.components.language.Controller",
    };
  }]);

}());
