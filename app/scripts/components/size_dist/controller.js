(function(){
  var app = angular.module("c.components.sizeDist");
  app.controller("c.components.sizeDist.Controller", [ "$scope", "c.data.Size", "c.util.services.StateHandler",
    function($scope, Size, StateHandler){
      function defineScope(){
        $scope.types = [ ];
        $scope.data = [ ];
        $scope.state = StateHandler.getInstance();

        $scope.state.initiate();

        $scope.dump = Size.aggregate();

        $scope.dump.$promise.then(function(response){
          $scope.state.success();
          loadData($scope.dump);
        }, function(){
          $scope.state.fatal();
        });

        $scope.buckets = Size.buckets;

        $scope.options = {
            chart: {
            type: 'multiBarChart',
            height: 450,
            margin : {
              top: 20,
              right: 20,
              bottom: 45,
              left: 145
            },
            clipEdge: true,
            duration: 500,
            stacked: true,
            xAxis: {
              axisLabel: 'Size buckets',
              showMaxMin: false,
              tickFormat: function(d){
                return d3.format(',f')(d);
                }
            },
            yAxis: {
              axisLabel: 'Frequency',
              axisLabelDistance: 50,
              tickFormat: function(d){
                return d3.format(',.1f')(d);
              }
            }
          }
        };
      }

      function loadData(dump){
        $scope.data = [ dump['all'] ]
      };

      $scope.$watch("types", function(nv){
        if(nv && nv.length > 0){
          var dump = $scope.dump;

          $scope.data = _.reduce(nv, function(m, v){
            m.push(dump[v])
            return m;
          }, [ dump['all'] ]);
        };
      });


      defineScope();
    }
  ]);
}());
