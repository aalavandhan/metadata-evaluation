(function(){
  var app = angular.module("c.components.filters");
  app.directive("cMagnificationFilter", [function(){
    return{
      scope:{
        magnification: "=",
      },
      replace: true,
      templateUrl: "app/scripts/components/filters/magnification_template.html"
    };
  }]);
}());
