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
  fs.writeFileSync(appxmanifest, buffer);
}

function registerApp(manifest) {
  if (os.platform() === 'win32') {
    var manifestloc = manifest || appxmanifest;
    var cwd = path.normalize(__dirname);
    //var guid = '122f1d07-66a9-427c-9fb4-80fa75b5d81a';
    var buffer = fs.readFileSync(manifestloc, 'utf8');
    var guid = buffer.match(/\bName="(.*?)"/)[1];
    var sp = buffer.match(/\bStartPage="(.*?)"/)[1];
    var script = '';
    if (sp.match(/https?:\/\/localhost:?\d*\/?$/)) {
      script = 'powershell -noprofile -ExecutionPolicy Bypass -Command "& {Start-Process PowerShell -ArgumentList \'-NoProfile -ExecutionPolicy Bypass -File "' +
      path.join(cwd,'AppxUtilities/StartLh.ps1') +
      ' ' + cwd + ' ' + guid + ' ' + manifestloc + '"\' -Verb Runas}";';
    } else {
      script = 'powershell -noprofile -ExecutionPolicy Bypass -Command "& {Start-Process PowerShell -ArgumentList \'-NoProfile -ExecutionPolicy Bypass -File "' +
      path.join(cwd, 'AppxUtilities/Start.ps1') +
      ' ' + cwd + ' ' + guid + ' ' + manifestloc + '"\'}";';
    }
    exec(script,
    function(err, stdout, stderr) {
      console.log('launching app...');
    });
  }
}

if (!module.parent) {
  main();
} else {
  module.exports = {updateStartPage: updateStartPage, registerApp: registerApp};
}
