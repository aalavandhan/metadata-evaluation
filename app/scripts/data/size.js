angular.module("c.data")

.factory("c.data.Size", ["$resource", "$q",
  function($resource, $q){
    var Resource = $resource(content.dataUrl("/data/size"), { id: "@id" },{
      cluster: {
        method: 'GET',
        url: content.dataUrl("/data/size/clusters.csv"),
        transformResponse: function(response){
          var lines = response.split("\n");
          lines.pop();
          return {
            data: _.reduce(lines, function(m, d){
              var parts = d.replace(/\"/g, '').split(",");
              m[parts[0]] = parts.slice(1, parts.length)
              return m;
            }, { }),
          }

        }
      },
      summary: {
        method: 'GET',
        url: content.dataUrl("/data/size/summary"),
        transformResponse: function(response){
          var parts = response.split("--------");
          parts.pop();

          return {
            data: _.map(parts, function(p){
              var d = p.split("\n");
              d = _.filter(d, function(x){ return x != "" });
              return {
                key: d[0],
                summary: {
                  min: d[1],
                  max: d[6],
                  mean: d[4],
                  median: d[3],
                }
              };
            })
          };
        }
      },
      aggregate: {
        method: 'GET',
        url: content.dataUrl("/data/size/size.json"),
        transformResponse: function(response){
          buckets = Resource.buckets;

          var parseTypeDist = function(t, v){
            var maxSizeCount = _.max(v, function(v, k){ return v; });
            return _.map(v, function(v, k){
              var key = parseInt(k);
              return {
                key: t,
                x: key,
                size: buckets[key],
                label: "("+ buckets[key] + "," + (buckets[key + 1] || 'Inf') + "\]",
                y: v
              }
            });
          };

          var sumCounts = function(x, y){
            return _.reduce(_.range(buckets.length), function(m, v){
                m[v] = (parseInt(x[v]) || 0) + (parseInt(y[v]) || 0)
                return m;
             }, { });
          };

          var d = JSON.parse(response);
          var res = _.chain(d)
           .keys()
           .map(function(t){ return { key:t, values: parseTypeDist(t, d[t]) }; })
           .reduce(function(m, t){ m[t.key] = t; return m; }, { })
           .value();

          var acc = _.reduce(_.values(d), sumCounts, { });

          res['all'] = {
            key: 'all',
            values: parseTypeDist('all', acc)
          };

          return res;
        }
      }
    }),
    proto = Resource.prototype;

    Resource.buckets = [0, 4, 32, 256, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 1048576, 8388608, 67108864];

    return Resource;

  }
]);
