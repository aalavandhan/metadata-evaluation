(function(){
  var app = angular.module("c.components.measurement");
  app.directive("cMeasurement", [function(){
    return{
      scope: { },
      replace: true,
      templateUrl: "app/scripts/components/measurement/template.html",
      controller: "c.components.measurement.Controller",
    };
  }]);

}());
