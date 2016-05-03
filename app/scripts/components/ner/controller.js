(function(){
  var app = angular.module("c.components.ner");
  app.controller("c.components.ner.Controller", [ "$scope", "c.data.Metadata",
    "c.util.services.StateHandler",
    function($scope, Metadata, StateHandler){
      function defineScope(){
        $scope.data = [ ];

        var state = StateHandler.getInstance();
        state.initiate();

        Metadata.fetchNERData().then(function(r){
          $scope.data = r;
          state.success();
        }, function(){
          state.fatal();
        });

        $scope.options =   {
          chart: {
            type: 'multiBarHorizontalChart',
            height: 550,
            x: function(d){return d.label; },
            y: function(d){return d.value; },
            "margin": {
              "top": 20,
              "right": 20,
              "bottom": 45,
              "left": 150
            },
            showControls: true,
            showValues: true,
            duration: 500,
            xAxis: {
              showMaxMin: true
            },
            yAxis: {
              axisLabel: 'Values',
              tickFormat: function(d){
                return d3.format(',.2f')(d);
              }
            }
          }
        };

      };

      defineScope();
    }
  ]);
}());
