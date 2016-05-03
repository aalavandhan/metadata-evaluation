angular.module("c.data")

.factory("c.data.Language", ["$resource", "$q",
  function($resource, $q){
    var Resource = $resource(content.dataUrl("/data/language"), { id: "@id" },{
      get: {
        method: 'GET',
        url: content.dataUrl("/data/languages.json"),
        transformResponse: function(response){
          var d = JSON.parse(response);
          var clean = function(v){
           return _.map(v, function(v,k){ return { x: k, y: v } });
          };
          return _.reduce(d, function(m, v,k){ m[k] = clean(v); return m;}, { });
        },
        isArray: false
      }
    }),
    proto = Resource.prototype;


    return Resource;

  }
]);
