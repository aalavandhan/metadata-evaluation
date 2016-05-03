(function(){
  var app = angular.module("c.components.sizeDist");
  app.directive("cSizeDist", [function(){
    return{
      scope: { },
      replace: true,
      templateUrl: "app/scripts/components/size_dist/template.html",
      controller: "c.components.sizeDist.Controller",
      link: function($scope, elem, attrs){ }
    };
  }]);

}());
