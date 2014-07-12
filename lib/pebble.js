
function pebble (req, res) {
  var now = Date.now();
  var FORTY_MINUTES = 2400000;
  var TWENTY_FOUR_HOURS = 86400000;

  cgmData = [];
  // var earliest_data = now - FORTY_MINUTES;
  var earliest_data = now - (8 * 60 * 60 * 1000);
  function get_latest (err, collection) {
    collection.find({"date": {"$gte": earliest_data}}).sort({date:1}).sort({_id:1}).toArray(function(err, results) {
        if(err != null)
        {
          res.write(JSON.stringify(err));
          res.end();
        }
        if(results != null) {
            results.forEach(function(element, index, array) {
                var last = cgmData[cgmData.length];
                if (element) {
                    console.log(element, index);
                    var obj = {};
                    obj.sgv = element.sgv;
                    obj.bgdelta = last ? (last.sgv - element.sgv) : false;
                    obj.trend = element.trend;
                    obj.y = element.sgv;
                    obj.x = element.date;
                    obj.datetime = element.date;
                    cgmData.push(obj);
                }
            });
            cgmData.reverse( );
            var result = { status: [ {now:now}], bgs: cgmData};
            res.write(JSON.stringify(result));
            res.end( );
            console.log(collection, collection);
            // collection.db.close();
        }
    });
  }
  req.with_collection(get_latest);
}

pebble.pebble = pebble;
module.exports = pebble;

