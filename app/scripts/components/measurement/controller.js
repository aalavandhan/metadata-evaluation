(function(){
  var app = angular.module("c.components.measurement");
  app.controller("c.components.measurement.Controller", [ "$scope", "c.data.Metadata",
    "c.util.services.StateHandler",
    function($scope, Metadata, StateHandler){

      function loadTypes(){
        var state = StateHandler.getInstance();
        state.initiate();

        Metadata.fetchParserData().then(function(r){
          $scope.contentTypes = _.keys(r);
          $scope.contentTypes.push('NONE');
          $scope.selectedType = 'NONE';
          state.success();
        }, function(){
          state.fatal();
        });
      };

      function loadDomains(){
        var state = StateHandler.getInstance();
        state.initiate();

        Metadata.fetchCrawlerData().then(function(r){;
          $scope.domains = _.keys(r);
          $scope.domains.push('NONE');
          $scope.selectedDomain = 'NONE';
          state.success();
        }, function(){
          state.fatal();
        });
      };

      function loadMeasurements(){

        var state = $scope.state = StateHandler.getInstance();
        state.initiate();

        var selectedDomain = $scope.selectedDomain != 'NONE' ? $scope.selectedDomain : null;
        var selectedType   = $scope.selectedType   != 'NONE' ? $scope.selectedType   : null;

        Metadata.fetchMeasurementData(selectedDomain, selectedType).then(function(r){
          $scope.data = r;
          state.success();
        }, function(){
          state.fatal();
        });

      };


      function defineScope(){
        $scope.data = [ ];

        loadDomains();
        loadTypes();
        loadMeasurements();

        $scope.loadMeasurements = loadMeasurements;

        $scope.options = {
          chart: {
            type: 'boxPlotChart',
            height: 550,
            margin : {
              top: 20,
              right: 20,
              bottom: 60,
              left: 75
            },
            x: function(d){ return d.label; },
            y: function(d){return d.values.mean; },
            maxBoxWidth: 75,
            xAxis: {
              axisLabel: 'Normalized range'
            },
            yAxis: {
              axisLabel: 'Units',
              tickFormat: function(d){
                return d3.format(',.2f')(d);
              }
            },
            // tooltipContent:function(key, x, y, e, graph){
            //   return 'TestA';
            // },
            useInteractiveGuideline: false,
            tooltip: {
              contentGenerator: function (e) {
                var series = e.series[0];
                if (series.value === null || !e.data) return;

                var rows =
                  "<tr>" +
                    "<td class='key'>" + 'Mean - SD: ' + "</td>" +
                    "<td class='x-value'>" + d3.format(',.2f')(e.data.values.Q1 * e.data.values.norm) + "</td>" +
                  "</tr>" +

                  "<tr>" +
                    "<td class='key'>" + 'Mean: ' + "</td>" +
                    "<td class='x-value'>" + d3.format(',.2f')(e.data.values.Q2 * e.data.values.norm) + "</td>" +
                  "</tr>" +

                  "<tr>" +
                    "<td class='key'>" + 'Mean + SD: ' + "</td>" +
                    "<td class='x-value'>" + d3.format(',.2f')(e.data.values.Q3 * e.data.values.norm) + "</td>" +
                  "</tr>" +

                  "<tr>" +
                    "<td class='key'>" + 'Max: ' + "</td>" +
                    "<td class='x-value'>" + d3.format(',.2f')(e.data.values.norm) + "</td>" +
                  "</tr>" +

                  "<tr>" +
                    "<td class='key'>" + 'Min: ' + "</td>" +
                    "<td class='x-value'>" + d3.format(',.2f')(e.data.values.whisker_low * e.data.values.norm) + "</td>" +
                  "</tr>";

                var header =
                  "<thead>" +
                    "<tr>" +
                      "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                      "<td class='key'><strong>" + e.key + "</strong></td>" +
                    "</tr>" +

                  "</thead>";

                return "<table>" +
                    header +
                    "<tbody>" +
                      rows +
                    "</tbody>" +
                  "</table>";
              }
            }
            // yDomain: [0, 500]
          }
        };

      };

      defineScope();
    }
  ]);
}());
