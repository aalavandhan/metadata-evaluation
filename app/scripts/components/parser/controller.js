(function(){
  var app = angular.module("c.components.parser");
  app.controller("c.components.parser.Controller", [ "$scope", "c.data.Metadata", "$q",
    "c.util.services.StateHandler",
    function($scope, Metadata, $q, StateHandler){
      function loadStats(){
        var state = StateHandler.getInstance();
        state.initiate();

        $q.all([ Metadata.datasetSize(), Metadata.metadataSize() ]).then(function(r){
          $scope.statData =  [{
            key: "Dataset size",
            y: r[0].size / ( 1024 * 1024 )
          },{
            key: "Metadata size",
            y: r[1].size / ( 1024 * 1024 )
          }];
          state.success();
        }, function(){
          state.fatal();
        });

        $scope.statOptions = {
          chart: {
            type: 'pieChart',
            height: 450,
            donut: true,
            x: function(d){ return d.key; },
            y: function(d){ return d.y; },
            showLabels: true,

            pie: {
              startAngle: function(d) { return d.startAngle/2 -Math.PI/2 },
              endAngle: function(d) { return d.endAngle/2 -Math.PI/2 }
            },
            duration: 500,
            legend: {
              margin: {
                top: 5,
                right: 70,
                bottom: 5,
                left: 0
              }
            }
          }
        };

      };

      function defineScope(){
        $scope.data = [ ];

        var state = StateHandler.getInstance();
        state.initiate();

        Metadata.fetchParserData().then(function(r){
          $scope.dump = r;
          $scope.contentTypes = _.keys(r);
          $scope.selectedType = $scope.contentTypes[0];
          state.success();
        }, function(){
          state.fatal();
        });

        $scope.options =  {
          chart: {
            type: 'discreteBarChart',
            height: 500,
            width: 500,
            x: function(d){ return d.key; },
            y: function(d){ return d.doc_count; },
            showValues: true,
            duration: 500,
            "xAxis": {
              "axisLabel": "Parsers"
            },
            "yAxis": {
              "axisLabel": "Count",
              "axisLabelDistance": -10
            },
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

        loadStats();
      };

      $scope.$watch("selectedType", function(nv){
        if(nv){
          $scope.data = [ $scope.dump[nv] ];
        }
      })

      defineScope();
    }
  ]);
}());
