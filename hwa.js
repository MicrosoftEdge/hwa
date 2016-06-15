#! /usr/bin/env node

'use strict';
var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;

var appxmanifest = path.join(__dirname, 'AppxManifest.xml');

function main() {
  if (argv.lh || argv.localhost) {
    var port = argv.lh || argv.localhost;
    updateStartPage('http://localhost:' + port);
  } else {
    var startpage = argv._[0] || 'http://alx.lu/Testbed';
    updateStartPage(startpage);
  }
  registerApp();
}

function updateStartPage(sp) {
  var buffer = fs.readFileSync(appxmanifest, 'utf8');
  buffer = buffer.replace(/(\bStartPage=")([^"])*(?=")/, '$1' + sp);
  buffer = buffer.replace(/(\bMatch=")([^"])*(?=")/, '$1' + sp);
  fs.writeFileSync(appxmanifest, buffer);
}

function registerApp(manifest) {
  if (os.platform() === 'win32') {
    var manifestloc = manifest || appxmanifest;
    var cwd = path.normalize(__dirname);
    var buffer = fs.readFileSync(manifestloc, 'utf8');
    var guid = buffer.match(/\bName="(.*?)"/)[1];
    var sp = buffer.match(/\bStartPage="(.*?)"/)[1];
    var isLocalhost = sp.match(/https?:\/\/localhost:?\d*\/?$/); 
    
    var script = 'powershell -noprofile -noninteractive -ExecutionPolicy Bypass -File "'
                  + path.join(cwd, 'AppxUtilities/' + (isLocalhost ? 'StartLh.ps1' : 'Start.ps1')) + '"'
                  + ' "' + cwd + '" "' + guid + '" "' + manifestloc + '"';
    return new Promise(function (resolve, reject) {
      exec(script, function(err, stdout, stderr) {
        if (err) {
          return reject(err);
        }

        resolve(stdout);
      });
    });
  }
}

if (!module.parent) {
  main();
} else {
  module.exports = {updateStartPage: updateStartPage, registerApp: registerApp};
}
