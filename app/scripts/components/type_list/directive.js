(function(){
  var app = angular.module("c.components.typeList");
  app.directive("cTypeList", [function(){
    return{
      scope: {
        selected: "=",
        multiple: "=",
      },
      replace: true,
      templateUrl: "app/scripts/components/type_list/template.html",
      controller: "c.components.typeList.Controller",
    };
  }]);

}());
