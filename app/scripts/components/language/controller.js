(function(){
  var app = angular.module("c.components.language");
  app.controller("c.components.language.Controller", [ "$scope", "c.data.Language",
    "c.util.services.StateHandler",
    function($scope, Language, StateHandler){
      function defineScope(){
        $scope.data = [ ];

        var state = StateHandler.getInstance();
        state.initiate();

        Language.get().$promise.then(function(r){
          $scope.dump = r;

          $scope.contentTypes = _.chain(r)
                                 .keys()
                                 .filter(function(k){ return k[0] != "$"; })
                                 .sortBy()
                                 .value();

          $scope.selectedType = 'text-html';
          state.success();
        }, function(){
          state.fatal();
        });

        $scope.options =  {
          chart: {
            type: 'pieChart',
            height: 500,
            x: function(d){ return d.x; },
            y: function(d){ return d.y; },
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

      $scope.$watch("selectedType", function(nv){
        if(nv){
          $scope.data = $scope.dump[nv];
        }
      })

      defineScope();
    }
  ]);
}());
