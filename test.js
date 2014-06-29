'use strict';

/* global describe */
/* global it */

var should = require('should');
var kem = require('./');
if (should) ;

describe('ext mime', function() {
  var middleware = kem();
  var oldAccepts = function(type) {
    return type === 'html' || type === 'text/html' ? 'html' : false;
  };

  it('should leave the original path and accepts function in place', function() {
    var ctx = { path: '/test/path.ext', accepts: oldAccepts };
    var gen = middleware.call(ctx, 1);
    gen.next();
    ctx.path.should.equal('/test/path');
    ctx.originalPath.should.equal('/test/path.ext');
    ctx.originalAccepts.should.equal(oldAccepts);
  });

  it('should only run once', function() {
    var ctx = { path: '/test/path.ext.foo', accepts: oldAccepts };
    var gen = middleware.call(ctx, 1);
    gen.next();
    gen = middleware.call(ctx, 1);
    gen.next();
    ctx.path.should.equal('/test/path.ext');
  });

  it('should prefer the ext mime over accept headers', function() {
    var ctx = { path: '/test/path.ext.json', accepts: oldAccepts };
    ctx.accepts('html').should.equal('html');
    ctx.accepts('json').should.equal(false);
    var gen = middleware.call(ctx, 1);
    gen.next();
    ctx.accepts('json').should.equal('json');
    ctx.accepts('html').should.equal('html');
  });
});
