(function(){
  var app = angular.module("c.components.size");
  app.controller("c.components.size.Controller", [ "$scope", "c.data.Size", "$uibModal", "c.util.services.StateHandler",
    function($scope, Size, $uibModal, StateHandler){
      function defineScope(){

        $scope.cState = StateHandler.getInstance();
        $scope.sState = StateHandler.getInstance();

        $scope.cState.initiate();
        $scope.sState.initiate();

        Size.cluster().$promise.then(function(r){
          $scope.clusteredSizes = r.data;
          $scope.cState.success();
        });

        Size.summary().$promise.then(function(r){
          $scope.clusterSummary = r.data;

          $scope.config = {
            itemsPerPage: $scope.clusterSummary.length,
          };

          $scope.sState.success();
        });
      };

      $scope.isClusterable = function(type){
        return $scope.clusteredSizes[type] != null;
      };

      $scope.openChart = function(type){
        $uibModal.open({
          animation: $scope.animationsEnabled,
          templateUrl: 'app/scripts/components/size/size_chart.html',
          controller: 'c.util.controllers.modal.Controller',
          size: 'md',
          resolve: {
            data: function(){
              return {
                key: type,
                value: $scope.clusteredSizes[type],
              };
            }
          }
        });
      };

      defineScope();
    }
  ]);
}());
