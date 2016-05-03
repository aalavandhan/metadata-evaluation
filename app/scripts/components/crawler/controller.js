(function(){
  var app = angular.module("c.components.crawler");
  app.controller("c.components.crawler.Controller", [ "$scope", "c.data.Metadata",
    "c.util.services.StateHandler",
    function($scope, Metadata, StateHandler){

      function loadCrawlerData(){
        var state = StateHandler.getInstance();
        state.initiate();

        Metadata.fetchCrawlerData().then(function(r){
          $scope.dump = r;
          $scope.domains = _.keys(r);
          $scope.selectedDomain = $scope.domains[0];
          state.success();
        }, function(){
          state.fatal();
        });
      };

      function loadTitleData(){
        var state = StateHandler.getInstance();
        state.initiate();

        Metadata.fetchPageTilteData().then(function(r){
          $scope.titles = r
          state.success();
        }, function(){
          state.fatal();
        });
      };

      function defineScope(){
        $scope.data = [ ];
        loadCrawlerData();
        loadTitleData();

        $scope.options =  {
          chart: {
            type: 'pieChart',
            height: 500,
            x: function(d){ return d.key; },
            y: function(d){ return d.doc_count; },
            showLabels: true,
            duration: 500,
            labelThreshold: Infinity,
            labelSunbeamLayout: false,
            legend: {
              margin: {
                top: 5,
                right: 35,
                bottom: 5,
                left: 0
              }
            }
          }
        };

      };

      $scope.$watch("selectedDomain", function(nv){
        if(nv){
          $scope.data = $scope.dump[nv].values;
        }
      })

      defineScope();
    }
  ]);
}());
