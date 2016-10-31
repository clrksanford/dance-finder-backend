require('dotenv').config({silent: true});

var mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION);

var Upcoming = require('./models/upcoming');

const cheerio = require('cheerio');
const axios = require('axios');

// BUILD LIST OF STATES FROM GITHUB USER mshafrir
axios.get('https://gist.githubusercontent.com/mshafrir/2646763/raw/8b0dbb93521f5d6889502305335104218454c2bf/states_titlecase.json')
  .then(function(response) {
    var stateArray = [];
    response.data.forEach(function(item) {
      stateArray.push(item.abbreviation);
      return stateArray;
    });

    var linksArray = [];
    stateArray.forEach(function(item) {
      var link = 'http://www.contradancelinks.com/schedule_' + item + '.html';
      linksArray.push(link);
    });

    linksArray.forEach(function(item) {
      axiosCall(item);
    });
  });

// BUILD DANCE ITEMS FOR UPCOMING DANCES ON ONE STATE PAGE
function axiosCall(item) {

  axios.get(item)
    .then(function(response) {
      var goodString = response.data.replace("<BR><BR>\n<DD>", "<BR><BR></DD>\n<DD>");

      let $ = cheerio.load(goodString, {
        ignoreWhitespace: true,
        lowerCaseTags: true
      });

      $('dd').each(function(i,dd) {
        var text = $(this).text();
        var [startDate, rest] = text.split(' Dance Series: ');
        startDate = new Date(startDate);

        var [danceSeries, rest] = rest.split(' Location: ');
        var [location, rest] = rest.split(' Caller(s): ');
        var [callers, rest] = rest.split(' Band(s)/Musician(s): ');
        var [bands, rest] = rest.split(' Note: ');

        var [start,end] = item.split('/schedule_');
        var state = end.split('.')[0];

        var upcomingDanceEntry = new Upcoming({
          series: danceSeries,
          callers: callers,
          date: startDate,
          location: location,
          state: state
        });

        console.log(upcomingDanceEntry);

        // upcomingDanceEntry.save(function(err) {
        //   if(err) {
        //     console.log(err);
        //   } else {
        //     console.log('Success!', upcomingDanceEntry);
        //   }
        // });
      });
    });
}
