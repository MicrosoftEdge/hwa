# hwa

## Basic Usage

Launch a Windows 10 Hosted Web App pointing to `http://example.com`. Note that the protocol (e.g. `http://` or `https://`) is required:
```
hwa http://example.com
```

Launch a Windows 10 Hosted Web App pointing to `http://localhost:3000`:
```
hwa -lh 3000
```

Launch the Windows 10 Testbed App
```
hwa
```

## Programmatic access
There are two functions exported with `hwa`, `updateStartpage()` and `registerApp()`.

To update the manifest's startpage:
```
require('hwa');
hwa.updateStartpage('http://example.com');
```

To launch the app:
```
require('hwa');
hwa.registerApp(false);
```
