angular.module("c.data")

.factory("c.data.Document", ["$resource", "$q",
  function($resource, $q){
    var cleanRequest = function(request, headers){
      var excludeKeys = [ "docType" ];
      var filtered = _.filter(_.keys(request), function(k){ return !_.include(excludeKeys, k) });
      var nR = { };
      _.each(filtered, function(key){
        nR[key] = request[key];
      });
      return angular.toJson(nR);
    };


    var Resource = $resource("http://104.236.190.155:9200/polar/:docType/:id", { 'docType': "@docType", id: "@id" },{
      get: {
        method: 'GET',
        url: "http://104.236.190.155:9200/polar/:docType/:id",
        transformRequest: cleanRequest,
        transformResponse: function(response, headers){
          var response = JSON.parse(response);
          return response._source;
        },
        cached: true
      },
      count: {
        method: 'POST',
        url: "http://104.236.190.155:9200/polar/:docType/_search",
        isArray: false,
        transformRequest: cleanRequest,
        transformResponse: function(response, headers){
          var response = JSON.parse(response);
          return {
            count: response.hits.total
          };
        }
      },
      search: {
        method: 'POST',
        url: "http://104.236.190.155:9200/polar/:docType/_search",
        isArray: true,
        transformRequest: cleanRequest,
        transformResponse: function(response, headers){
          var response = JSON.parse(response);
          return _.pluck(response.hits.hits, "_source");
        }
      },
      aggregateEntity: {
        method: 'POST',
        url: "http://104.236.190.155:9200/polar/:docType/_search?size=0",
        isArray: true,
        transformRequest: cleanRequest,
        transformResponse: function(response, headers){
          var response = JSON.parse(response);
          return response.aggregations.entities.entity_name.buckets;
        }
      }
    }),
    proto = Resource.prototype;

    proto.displayType = function(){
      var typeParts = this['mime-type'].split("-").splice(1);
      return typeParts.join("-");
    };

    proto.isJournal = function(){
      return !_.isEmpty(this.journal);
    };

    proto.getAuthors = function(){
      return _.chain(this.journal.authors)
       .pluck("name")
       .filter(function(n){ return n })
       .value();
    };

    proto.getAffiliations = function(){
      return _.chain(this.journal.authors)
       .pluck("affiliations")
       .flatten()
       .filter(function(n){ return n })
       .value();
    };

    proto.getEntities = function(name){
      return _.chain(this.entities[name])
       .pluck('name')
       .value();
    };

    proto.isEntityPresent = function(name){
      return !_.isEmpty(this.entities[name]);
    };

    proto.isImage = function(){
      return this['mime-type'].split("-")[0] == "image";
    };

    proto.getURL = function(){
      var parts = this['local-path'].split("/")
      return "http://sng.usc.edu/polar/" + this['mime-type'] + "/" + parts.slice(-2).join("/")
    };

    return Resource;
  }
]);
