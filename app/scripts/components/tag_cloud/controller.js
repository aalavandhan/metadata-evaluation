(function(){
  var app = angular.module("c.components.tagCloud");
  app.controller("c.components.tagCloud.Controller", [
    "$scope", "c.util.services.StateHandler", "c.data.Aggregator", "$timeout",
    function($scope, StateHandler, Aggregator, $timeout){

      function normalizeTagSizes(tags){
        var maxSize = _.max(tags, function(t){ return t.size; }).size,
            nTags;

        nTags = _.map(tags, function(t){
          t.size = Math.tanh(t.size / maxSize) * (parseInt($scope.zoomLevel) * 150);
          return t;
        });

        return nTags;
      };

      function loadEntities(){
        if(!$scope.docType || !$scope.entity){
          return;
        };

        var tokenization = ($scope.tokenization != 'raw');
        var countType = ($scope.countType == 'occurrence');

        $scope.state.initiate();

        new Aggregator($scope.docType, $scope.entity)
              .tokenization(tokenization)
              .useOccuranceCount(countType)
              .buildQuery(1000)
              .aggregate()
              .then(function(response){
                $scope.rTags = response;
                $scope.tags = normalizeTagSizes($scope.rTags, 0);
                $scope.state.success();
              }, function(){
                $scope.state.fatal();
              });
      };

      function defineScope(){
        $scope.state = StateHandler.getInstance();
        $scope.tags = [ ];
        $scope.loadEntities = loadEntities;
        $scope.zoomLevel = '1';

        $timeout(function(){
          loadEntities();
        }, 500);
      };

      defineScope();
    }
  ]);
}());
