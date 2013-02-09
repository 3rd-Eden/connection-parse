'use strict';

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
    servers = Object.keys(args).map(address);
  } else {
    servers = [args].map(address);
  }

  return {
      servers: servers
    , weights: 'object' !== typeof args || Array.isArray(args)
        ? servers.reduce(function weights(memo, server) {
            memo[server.string] = 1;
            return memo;
          }, {})
        : args
    , regular: servers.map(function regular(server) {
        return server.string;
      })
  };
}

/**
 * Transforms the server in to an Object containing the port number and the
 * hostname.
 *
 * @param {Mixed} server
 * @returns {Object}
 * @api private
 */
function address(server) {
  if ('string' !== typeof server) {
    server.string = server.host +':'+ server.port;
    return server;
  }

  var pattern = server.split(':');

  return {
      host: pattern[0]
    , port: +pattern[1]
    , string: server
  };
}

// Attach the address parser before we expose the module
parse.address = address;

/**
 * Expose the module
 */
module.exports = parse;
