# koa-ext-mime

koa-ext-mime is a koa middleware that overrides content negotiation in a koa context to prefer the uri extension over the accept header. The extension is stripped from the uri for further processing. The accepts method of the context is replaced with one that checks against the uri extension before delegating to the koa method if no match is found.

## Usage

```javascript
var ext = require('koa-ext-mime');

app.use(ext());
```

The module function accepts a configuration object per koa convention. The two options available at this point are prefix and extensionName. Prefix is added to the original path and prefix members of the context and defaults to 'original'. extensionName is the key at which the request extension is stored in the context and defaults to 'requestExtension'.
