angular.module("c.data")

.factory("c.data.Sweet", ["$resource", "$q",
  function($resource, $q){


    var Resource = $resource("http://104.236.190.155:9200/sweet/concept/", { },{
      query: {
        method: 'POST',
        url: "http://104.236.190.155:9200/sweet/_suggest",
        transformResponse: function(response, headers){
          var response = JSON.parse(response);
          return _.map(response['concept-suggest'][0].options, function(e){
            return { text: e.text }
          });
        },
        cached: true,
        isArray: true
      }
    }),
    proto = Resource.prototype;

    Resource.autocomplete = function(q){
      return Resource.query({
        "concept-suggest" : {
          "text" : q,
          "completion" : {
            "field" : "suggest",
            "size": 10
          }
        }
      }).$promise;
    }

    return Resource;
  }
]);
