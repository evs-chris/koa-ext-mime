'use strict';

var mime = require('mime');
var path = require('path');

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

    var pext = path.extname(this.path);
    // get everything before the ext
    if (pext.length > 0) {
      this[prefix + 'Accepts'] = this.accepts;
      this.accepts = accepts;
      this[ext] = pext.slice(1);
      this[prefix + 'Path'] = this.path;
      this.path = this.path.slice(0, this.path.length - pext.length);
    }

    yield next;
  };

  return middleware;
};
