angular.module("c.data")

.factory("c.data.Metadata", ["$resource", "$q",
  function($resource, $q){
    // var cleanRequest = function(request, headers){
    //   var excludeKeys = [ "docType" ];
    //   var filtered = _.filter(_.keys(request), function(k){ return !_.include(excludeKeys, k) });
    //   var nR = { };
    //   _.each(filtered, function(key){
    //     nR[key] = request[key];
    //   });
    //   return angular.toJson(nR);
    // };

    var parseResponse = function(r){
      r = r.aggregations.l1.buckets;
      return _.reduce(r, function(m, d){
        m[d.key] = {
          'values' : d.l2.buckets,
          'doc_count': d.doc_count,
          'key': d.key
        };
        return m;
      }, { });
    };


    var Resource = $resource("http://104.236.190.155:9200/polar2/:id", { id: "@id" },{
      search: {
        method: 'POST',
        url: "http://104.236.190.155:9200/polar2/_search"
      },
      stats: {
        method: 'GET',
        url: "http://104.236.190.155:9200/polar2/_stats"
      }
    }),
    proto = Resource.prototype;


    Resource.fetchCrawlerData = function(){
      var deferred = $q.defer();
      Resource.search({
        "aggs" : {
          "l1" : {
            "terms" : { "field" : "crawl.domain",  "size" : 50 },
            "aggs":{
              "l2": {
                "terms": { "field": "content-type",  "size" : 50 }
              }
            }
          }
        },
        "size": 0
      }).$promise.then(function(response){
        deferred.resolve(parseResponse(response));
      }, function(r){
        deferred.reject(r);
      });

      return deferred.promise;
    };


    Resource.fetchPageTilteData = function(){
      var deferred = $q.defer();
      Resource.search({
        "aggs" : {
          "l1" : {
            "terms" : { "field": "tika-metadata.title", "size": 5 }
          }
        },
        "size": 0
      }).$promise.then(function(response){
        var r = response.aggregations.l1.buckets;
        total = response.hits.total;
        r = _.map(r, function(x){ x.norm = x.doc_count / total; return x; });
        deferred.resolve(r);
      }, function(r){
        deferred.reject(r);
      });
      return deferred.promise;
    };

    Resource.fetchParserData = function(){
      var deferred = $q.defer();
      Resource.search({
        "aggs" : {
          "l1" : {
            "terms" : { "field": "content-type",  "size" : 50 },
            "aggs":{
              "l2": {
                "terms": { "field": "tika-metadata.X-Parsed-By",  "size" : 50 }
              }
            }
          }
        },
        "size": 0
      }).$promise.then(function(response){
        deferred.resolve(parseResponse(response));
      }, function(r){
        deferred.reject(r);
      });

      return deferred.promise;
    };

    Resource.fetchNERData = function(){
      var deferred = $q.defer();
      var normalize = function(r){
        return [{
          key: 'OPEN NLP',
          values: [{
            label: "opennlp-max",
            value: r["opennlp-max"].value
          },{
            label: "opennlp-average",
            value: r["opennlp-average"].value
          }]
        },{
          key: 'CORE NLP',
          values: [{
            label: "corenlp-max",
            value: r["corenlp-max"].value
          },{
            label: "corenlp-average",
            value: r["corenlp-average"].value
          }]
        },{
          key: 'NLTK',
          values: [{
            label: "nltk-max",
            value: r["nltk-max"].value
          },{
            label: "nltk-average",
            value: r["nltk-average"].value
          }]
        },{
          key: 'OVERLAP',
          values: [{
            label: "opennlp-corenlp-max",
            value: r["opennlp-corenlp-max"].value
          },{
            label: "opennlp-corenlp-average",
            value: r["opennlp-corenlp-average"].value
          },{
            label: "corenlp-nltk-max",
            value: r["corenlp-nltk-max"].value
          },{
            label: "corenlp-nltk-average",
            value: r["corenlp-nltk-average"].value
          },{
            label: "nltk-opennlp-max",
            value: r["nltk-opennlp-max"].value
          },{
            label: "nltk-opennlp-average",
            value: r["nltk-opennlp-average"].value
          },{
            label: "union-max",
            value: r["union-max"].value
          },{
            label: "union-average",
            value: r["union-average"].value
          }]
        }];
      };
      Resource.search({
        "aggs" : {
          "nltk-max" : { "max" : { "field" : "ner.overlap.nltk" } },
          "nltk-average" : { "avg" : { "field" : "ner.overlap.nltk" } },
          "opennlp-max" : { "max" : { "field" : "ner.overlap.opennlp" } },
          "opennlp-average" : { "avg" : { "field" : "ner.overlap.opennlp" } },
          "corenlp-max" : { "max" : { "field" : "ner.overlap.corenlp" } },
          "corenlp-average" : { "avg" : { "field" : "ner.overlap.corenlp" } },

          "union-average" : { "avg" : { "field" : "ner.overlap.union" } },
          "union-max" : { "max" : { "field" : "ner.overlap.union" } },
          "opennlp-corenlp-average" : { "avg" : { "field" : "ner.overlap.opennlp-corenlp" } },
          "opennlp-corenlp-max" : { "max" : { "field" : "ner.overlap.opennlp-corenlp" } },
          "corenlp-nltk-average" : { "avg" : { "field" : "ner.overlap.corenlp-nltk" } },
          "corenlp-nltk-max" : { "max" : { "field" : "ner.overlap.corenlp-nltk" } },
          "nltk-opennlp-average" : { "avg" : { "field" : "ner.overlap.nltk-opennlp" } },
          "nltk-opennlp-max" : { "max" : { "field" : "ner.overlap.nltk-opennlp" } }
        },
        "size": 0
      }).$promise.then(function(response){
        deferred.resolve(normalize(response.aggregations));
      }, function(r){
        deferred.reject(r);
      });
      return deferred.promise;
    };

    Resource.fetchMeasurementData = function(){
      var deferred = $q.defer();

      var parseResponse = function(r){
        var m = r.aggregations.l1.buckets;

        return _.chain(m)
          .map(function(e){
            return  {
              label: e.key,
              values: {
                Q1: (e.stat.avg + ( e.stat.std_deviation_bounds.lower * 0.5 )) / e.stat.max,
                Q2: e.stat.avg / e.stat.max,
                Q3: (e.stat.avg + ( e.stat.std_deviation_bounds.upper * 0.5 )) / e.stat.max,
                whisker_low: e.stat.min / e.stat.max,
                whisker_high: e.stat.max / e.stat.max,
                norm: e.stat.max
              }
            }
          })
          .filter(function(e){
            return e.label != "XXX"
          })
          .value();
      };

      Resource.search({
        "aggs" : {
          "l1" : {
            "terms" : { "field": "measurements.unit", "size": 15 },
            "aggs": {
              "stat" : { "extended_stats" : { "field" : "measurements.value", "sigma" : 1 } }
            }
          }
        },
        "size": 0
      }).$promise.then(function(response){
        deferred.resolve(parseResponse(response));
      }, function(r){
        deferred.reject(r);
      });

      return deferred.promise;
    };

    Resource.datasetSize = function(){
      var deferred = $q.defer();
      Resource.search({
        "aggs" : {
          "l1" : {
            "sum" : { "field": "size" }
          }
        },
        "size": 0
      }).$promise.then(function(response){
        deferred.resolve({
          'size': response.aggregations.l1.value,
          'doc_count': response.hits.total
        });
      }, function(r){
        deferred.reject(r);
      });
      return deferred.promise;
    };

    Resource.metadataSize = function(){
      var deferred = $q.defer();
      Resource.stats().$promise.then(function(response){
        deferred.resolve({
          'size': response['_all']['primaries']['store']['size_in_bytes'],
          'doc_count': response['_all']['primaries']['docs']['count']
        });
      }, function(r){
        deferred.reject(r);
      });
      return deferred.promise;
    };


    return Resource;
  }
]);
