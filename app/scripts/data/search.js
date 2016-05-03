angular.module("c.data")

.factory("c.data.Search", ["$resource", "$q", "c.data.Document",
  function($resource, $q, Document){

    function Search(docType, size){
      this.type = docType;
      this.size = size;
    };

    Search.prototype.geoBoundsQuery = function(topLeft, bottomRight){
      this.query = {
        "bool" : {
          "must" : {
            "match_all" : {}
          },
          "filter" : {
            "geo_bounding_box" : {
              "locations" : {
                "top_left" : {
                  "lat" : topLeft.lat,
                  "lon" : topLeft.lng
                },
                "bottom_right" : {
                  "lat" : bottomRight.lat,
                  "lon" : bottomRight.lng
                }
              }
            }
          }
        }
      };

      return this;
    };

    Search.prototype.execute = function(){
      var self = this;
          finalQuery = {
            "docType": self.type,
            "size" : self.size,
            "query": self.query
          };

      return Document.count(finalQuery).$promise;
    };

    return Search;
  }
]);
