angular.module("c.data")

.factory("c.data.Aggregator", ["c.data.Document", "$q",
  function(Document, $q){

    var getName = function(name){
      var mappings = {
        phones: "entities.phones",
        sweet: "entities.sweet",
        TIME: "entities.TIME",
        PERCENT: "entities.PERCENT",
        PERSON: "entities.PERSON",
        LOCATION: "entities.LOCATION",
        urls: "entities.urls",
        MONEY: "entities.MONEY",
        DATE: "entities.DATE",
        ORGANIZATION: "entities.ORGANIZATION",
        emails: "entities.emails",
        geo: "geo",
      };

      return mappings[name];
    };

    function Aggregator(type, entity){
      this.type = type;
      this.entity = getName(entity);
    };

    Aggregator.prototype.tokenization = function(tokenized){
      this.entityNameExtension = !tokenized ? '.name.raw' : '.name';
      this.fullEntityName = this.entity + this.entityNameExtension;
      return this;
    };

    Aggregator.prototype.useOccuranceCount = function(nested){
      this.nested = nested;
      return this;
    };

    Aggregator.prototype.setSourceFilter = function(f){
      this.sourceFilter = f;
      return this;
    };

    Aggregator.prototype.buildFilters = function(filterValues){
      var self = this,
          filterQuery = { }
          entityFullName = function(entity, fuzzy){
            return fuzzy ? entity + '.name' : entity + '.name.raw';
          };

      if(filterValues.length == 0){
        return this;
      };

      var orElement = function(v, fuzzyMatch){
        var dh = {};

        dh[entityFullName(getName(v.entity), v.fuzzy)] = v.string;

        return {
          "bool":{
            "must":[
              {
                "match": dh
              }
            ]
          }
        }
      };

      var andElement = function(orElements, entity){
        return {
          "nested": {
            "path": entity,
            "query": {
              "bool": {
                "should": orElements
              }
            }
          }
        };
      };

      var queryHash = _.map(filterValues, function(t){
        return andElement(_.map(t, orElement), getName(t[0].entity));
      });

      this.filter = {
        "bool": {
          "must": queryHash
        }
      };

      return this;
    };

    Aggregator.prototype.buildQuery = function(size){
      var self = this,
          aggregateQuery,
          nestedAggQuery;

      aggregateQuery = {
        "entity_name": {
          "terms": {
            "field": self.fullEntityName,
            "size" : size,
          }
        }
      };

      nestedAggQuery = {
        "entity_count": {
          "sum": {
            "field": self.entity + ".count"
          }
        }
      };

      if(self.nested){
        aggregateQuery.entity_name.aggs = nestedAggQuery;
      };

      this.query = aggregateQuery;

      return this;
    };

    Aggregator.prototype.overrideQuery = function(query){
      this.query = query;
      return this;
    };

    Aggregator.prototype.aggregate = function(parser){
      var self = this,
          finalQuery = {
            "docType": self.type,
            "aggs": {
              "entities": {
                "nested": {
                  "path": self.entity
                },
               "aggs": self.query
              }
            }
          };

      if(this.filter){
        finalQuery.query = this.filter;
      };

      if(this.sourceFilter){
        finalQuery._source = this.sourceFilter;
      };

      var agg = Document.aggregateEntity(finalQuery);

      return agg.$promise.then(function(response){
        function getSize(r){
          if(self.nested){
            return r.entity_count.value;
          } else {
            return r.doc_count;
          };
        };

        var tags  =_.map(response, parser || function(r){
          return {
            "text": r.key,
            "docCount": r.doc_count,
            "size": getSize(r),
          };
        });

        return tags;
      });
    };

    Aggregator.prototype.search = function(size){
      var self = this;
          finalQuery = {
            "docType": self.type,
            "size" : size,
          };


      if(this.filter){
        finalQuery.query = this.filter;
      };

      if(this.sourceFilter){
        finalQuery._source = this.sourceFilter;
      };

      return Document.search(finalQuery).$promise;
    };

    return Aggregator;
  }
]);
