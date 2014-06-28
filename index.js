'use strict';

var mime = require('mime');

module.exports = function(config) {
  var cfg = config || {};
  var prefix = cfg.prefix || 'original';
  var ext = cfg.extensionName || 'requestExtension';

  var accepts = function() {
    var re = mime.lookup(this[ext]);

    for (var i = 0; i < arguments.length; i++) {
      var t = arguments[i];
      if (this[ext] == t || re == t)
        return t;
    }
    return this[prefix + 'Accepts'].apply(this, arguments);
  };

  var middleware = function*(next) {
    // only one round, please
    if (!!this[ext]) return yield next;

    var m = this.path.match(/(.*)\.([^\/\.]*)$/);

    if (m) {
      this[prefix + 'Accepts'] = this.accepts;
      this.accepts = accepts;
      this[ext] = m[2].toLowerCase();
      this[prefix + 'Path'] = this.path;
      this.path = m[1];
    }

    yield next;
  };

  return middleware;
};
