var express = require('express');
var moment = require('moment');
var router = express.Router();

var knex = require('knex')({
  client: 'pg',
  connection: {
    host     : '127.0.0.1',
    user     : 'grabarz',
    password : 'testpassword',
    database : 'digital_graveyard',
    port     :  5432,
  }
});


/* GET tweets. */
router.get(/^\/tweets\/([0-9]+)$/, function(req, res, next) {
  // REMEMBER TO ADD a constraint for when we run out of tweets to show.

  // keep the offset low for testing
  var offset = req.params[0] * 5;

  // super large value just in case.
  var first_timestamp = req.cookies.first_timestamp  || 99999999999999999;

  knex.select('name', 'username', 'time', 'time_inserted')
    .from ('core.tweets')
    .where('time_inserted', '<=', first_timestamp)
    .orderBy('time_inserted', 'desc')
    .limit(10)
    .offset(offset)

    .then(function (rows) {
      // check if this is the FIRST REQUEST

      if (offset === 0 && !req.cookies.first_timestamp) {
        res.cookie('first_timestamp', rows[0].time_inserted );
      }
      return rows;
    })

    .then(function (rows) {
      // convert the postgres timestamp into ms since epoch.

      rows.forEach( function(row, index, array) {
        row.time = moment(row.time).valueOf();
      });

      return rows;
    })

    .then(function (rows) {
      res.send(JSON.stringify(rows, null, 4));
    });

});


module.exports = router;
