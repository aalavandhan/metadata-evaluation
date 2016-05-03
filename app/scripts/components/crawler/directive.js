(function(){
  var app = angular.module("c.components.crawler");
  app.directive("cCrawler", [function(){
    return{
      scope: { },
      replace: true,
      templateUrl: "app/scripts/components/crawler/template.html",
      controller: "c.components.crawler.Controller",
    };
  }]);

}());
