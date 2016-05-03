(function(){
  var app = angular.module("c.components.filters");
  app.directive("cConceptFilter", [function(){
    return{
      scope:{
        queries: "=",
        functions: "=",
      },
      replace: true,
      templateUrl: "app/scripts/components/filters/concept_template.html",
      controller: ["$scope", "c.data.Sweet", function($scope, Sweet){

        function loadTags(query){
          return Sweet.autocomplete(query);
        };

        function addQuery(){
          $scope.queries.push({
            tags: [ ]
          });
        };

        function removeQuery(index){
          $scope.queries.splice(index, 1);
        };

        $scope.loadTags = loadTags;
        $scope.addQuery = addQuery;
        $scope.removeQuery = removeQuery;

        $scope.functions = {
          addQuery: addQuery,
          removeQuery: removeQuery,
        };

        $scope.queries = [ ];

      }]
    };
  }]);
}());
