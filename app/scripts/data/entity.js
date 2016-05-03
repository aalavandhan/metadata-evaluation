angular.module("c.data")

.factory("c.data.Entity", ["c.data.Aggregator", "$q", "c.data.Search",
  function(Aggregator, $q, Search){

    function Entity(){ };


    Entity.getValidDates = function(docType, e, queries){

      var deferred = $q.defer();


      var queryObj = _.map(queries, function(q){
        return _.map(q.tags, function(t){ return t.text.split("-").join(" ") });
      });

      var filters = _.map(queryObj, function(q){
        return _.map(q, function(r){
          return { entity: 'sweet', string: r }
        });
      });

      var validYearsFrom = function(dates){
        return _.chain(dates)
          .filter(function(d){
            var num = parseInt(d.text);
            return !isNaN(num) && num >= 1900 && num <= 2050;
          })
          .map(function(d){
            d.year = parseInt(d.text)
            return d;
          })
          .sortBy(function(d){
            return d.text;
          })
          .value();
      };

      new Aggregator(docType, "DATE")
          .tokenization(true)
          .useOccuranceCount(true)
          .buildFilters(filters)
          .buildQuery(1000)
          .aggregate()
          .then(function(response){
            deferred.resolve(validYearsFrom(response));
          }, function(){
            deferred.reject();
          });

      return deferred.promise;

    };

    Entity.getLocationsByYear = function(docType, year, size, queries){
      var deferred = $q.defer();

      var queryObj = _.map(queries, function(q){
        return _.map(q.tags, function(t){ return t.text.split("-").join(" ") });
      });

      var filters = _.map(queryObj, function(q){
        return _.map(q, function(r){
          return { entity: 'sweet', string: r }
        });
      });

      filters.push([{ entity: 'DATE', string: year.toString(), fuzzy: true }]);

      new Aggregator(docType, "geo")
            .setSourceFilter('locations')
            .buildFilters(filters, true)
            .overrideQuery({
              "entity_name": {
                 "terms": {
                    "field": "geo.name.raw",
                    "size": size,
                 },
                 "aggs": {
                    "lat": {
                       "max": {
                          "field": "geo.location.lat"
                       }
                    },
                   "lon": {
                       "max": {
                          "field": "geo.location.lon"
                       }
                    }
                 }
              }
            })
            .aggregate(function(r){
              return {
                name: r.key,
                size: r.doc_count,
                lat: r.lat.value,
                lon: r.lon.value,
              }
            })
            .then(function(response){
              deferred.resolve(response);
            }, function(){
              deferred.reject();
            });

      return deferred.promise;
    };


    Entity.getCountDocumentWithinRegions = function(docType, coords){
      var deferred = $q.defer();
      new Search(docType, 0)
            .geoBoundsQuery(coords[1], coords[3])
            .execute().then(function(response){
              deferred.resolve(response);
            }, function(){
              deferred.reject();
            });

      return deferred.promise;
    };

    return Entity;
  }
]);
