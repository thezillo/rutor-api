(function() {

  var request = require("request");
  var cheerio = require("cheerio");

  var urls = [
    'http://tor-ru.net/'
  ];

  this.search = function(args, callback) {

    var key, requestUri;

    var parameters = {
      page: 0,
      category: args.category,
      searchMethod:000,
      order: 0,
      query: encodeURIComponent(args.query)
    };

    requestUri = this.createRequestUri(parameters);

    var that = this;

    request(requestUri, function(err, res, body) {

      var result;

      if (err) {
        callback(err);
        return false;
      }


      if (res.statusCode !== 200) {
        callback(new Error("Unsafe status code ( " + res.statusCode + ")  when making request to " + requestUri));
        return false;
      }

      try {
        result = that.parse(body);
      } catch (e) {
        callback(e);
        return false;
      }

      callback(null, result);

    });


  };

  this.parse = function(html){

    var results = [];

    var $ = cheerio.load(html);

    $("#index tr").each(function(i, elem) {

      if($(elem).attr('class') === 'backgr') return true;

      var td = $(elem).find('td'),
          date     = $(td.get(0)),
          link     = date.next(),
          comments = link.next(),
          size     = td.length == 4 ? link.next() : comments.next(),
          peers    = size.next();

      results.push({
        date     : date.text(),
        magnet   : $(link.find('a').get(1)).attr('href'),
        title    : $(link.find('a').get(2)).text(),
        size     : size.html().replace('&#xA0;',' '),
        seeds    : parseInt($(peers).find('span.green').text()),
        peers    : parseInt($(peers).find('span.red').text()),
        url      : this.getBaseUri + $(link.find('a').get(2)).attr('href')
      });
    });


    return results;
  }

  this.createRequestUri = function(args) {

    var key, uri = this.getBaseUri();

    for (key in args) {

      uri = uri + args[key] + "/";

    }

    return uri;

  };

  this.getBaseUri = function() {

    return urls[0] + "search/";

  };

  module.exports = this;

})();