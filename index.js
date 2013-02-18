'use strict';

/**
 * Parser extensions, so extra values or default values can be added to the
 * returned values.
 *
 * @type {Array}
 * @private
 */
var extensions = {};

/**
 * Parse the server argument to a uniform format.
 *
 * @param {Mixed} args
 * @returns {Object}
 * @api private
 */
function parse(args) {
  var servers;

  if (arguments.length > 1) {
    servers = Array.prototype.slice.call(arguments, 0).map(address);
  } else if (Array.isArray(args)) {
    servers = args.map(address);
  } else if ('object' === typeof args) {
    servers = Object.keys(args).map(function generate(server) {
      return address(server, args[server]);
    });
  } else {
    servers = [args].map(address);
  }

  // Setup the data structure that we are going to return
  var data = {
      servers: servers
    , length: servers.length
    , weights: servers.reduce(function reduce(memo, server) {
        memo[server.string] = server.weight;
        return memo;
      }, {})
    , regular: servers.map(function regular(server) {
        return server.string;
      })
  };

  // Reduce the parsed values to simple list
  Object.keys(extensions).forEach(function extensions(key) {
    data[key] = servers.reduce(function reduce(memo, server) {
      memo[server.string] = server[key];
      return memo;
    }, {});
  });

  return data;
}

/**
 * Add a extra parser to connection-parser.
 *
 * @param {Function} parser
 * @api public
 */
parse.extension = function extension(name, parser) {
  if (name in extensions) return parse;

  extensions[name] = parser;
};

/**
 * Transforms the server in to an Object containing the port number and the
 * hostname.
 *
 * @param {Mixed} server
 * @returns {Object}
 * @api private
 */
function address(server, weight) {
  if ('string' !== typeof server) {
    server.string = server.host +':'+ server.port;
    server.weight = +server.weight || 1;

    return server;
  }

  // Parse down the value's even further
  var pattern = server.split(':')
    , data = {
          host: pattern[0]
        , port: +pattern[1]
        , string: server
        , weight: +weight || 1
      };

  // Iterate over the extensions for the last piece of crushing
  Object.keys(extensions).forEach(function each(key) {
    var parser = extensions[key]
      , res = parser(data);

    if (res) data = res;
  });

  return data;
}

// Attach the address parser before we expose the module
parse.address = address;

/**
 * Expose the module
 */
module.exports = parse;
