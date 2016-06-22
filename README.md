# hwa

## Basic Usage

Launch a Windows 10 Hosted Web App pointing to `http://example.com`. Note that the protocol (e.g. `http://` or `https://`) is required:
```
hwa http://example.com
```

hwa will automatically detect if you are pointing to localhost and will require admin privileges for a loopback exemption.

Launch the Windows 10 Testbed App
```
hwa
```

## Programmatic access
There are two functions exported with `hwa`, `updateStartpage()` and `registerApp()`.

To update the manifest's startpage:
```
var hwa = require('hwa');
hwa.updateStartpage('http://example.com');
```

To launch the app:
```
hwa.registerApp();
```

To specify your own manifest:

```
var path = require('path');
var hwa = require('hwa');
hwa.registerApp(path.resolve('path/to/manifest'));
```

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
