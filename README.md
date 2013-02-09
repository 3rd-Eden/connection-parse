# connection-parse

Simple TCP connection string parser, and nothing more then that. It simply
transforms `1.1.1.1:1111` in to a simple parsed object. I seem to do this a lot
in most of my modules such as hashring, memcached and failover. So it makes
sense to extract this in to a small util.

## Installation

Install this module using `npm`:

```
npm install connection-parse --save
```

The `--save` automatically adds the package and version to your `package.json`.

## API

```js
var parse = require('connection-parse');

parse('1.1.1.1:1111')
parse('1.1.1.1:1111', '1.3.3.4:1345');
parse(['1.1.1.1:1111', '1.3.3.4:1345']);
parse({ '1.1.1.1:1111': 100 });

{
  servers: [{
    string: '1.1.1.1:1111',
    host: '1.1.1.1',
    port: 1111
  }],
  regular: ['1.1.1.1:1111'],
  weighted: {
    '1.1.1.1:1111': 100 // or 1 by default
  }
}
```

## License
