#! /usr/bin/env node

'use strict';
var argv = require('yargs').argv;
var path = require('path');
var fs = require('fs');
var os = require('os');
var exec = require('child_process').exec;

var appxmanifest = path.join(__dirname, 'AppxManifest.xml');

if (argv.lh || argv.localhost) {
  var port = argv.lh || argv.localhost;
  updateStartPage('http://localhost:' + port);
  registerApp(true);
} else {
  var startpage = argv._[0] || 'http://alx.lu/Testbed';
  //console.log(startpage);
  updateStartPage(startpage);
  registerApp(false);
}

function updateStartPage(sp) {
  var buffer = fs.readFileSync(appxmanifest, 'utf8');
  buffer = buffer.replace(/(\bStartPage=")([^"])*(?=")/, '$1' + sp);
  fs.writeFileSync(appxmanifest, buffer);
}

function registerApp(lh) {
  if (os.platform() === 'win32') {
    var cwd = path.normalize(__dirname);
    var guid = '122f1d07-66a9-427c-9fb4-80fa75b5d81a';

    var script = 'powershell -noprofile -ExecutionPolicy Bypass -Command "& {Start-Process PowerShell -ArgumentList \'-NoProfile -ExecutionPolicy Bypass -File "' +
      path.join(cwd, 'AppxUtilities/Start.ps1') +
      ' ' + cwd + ' ' + guid + ' ' + appxmanifest + '"\'}";';
    if (lh) {
      script = 'powershell -noprofile -ExecutionPolicy Bypass -Command "& {Start-Process PowerShell -ArgumentList \'-NoProfile -ExecutionPolicy Bypass -File "' +
        path.join(cwd,'AppxUtilities/StartLh.ps1') +
        ' ' + cwd + ' ' + guid + ' ' + appxmanifest + '"\' -Verb Runas}";';
    }

    exec(script,
    function(err, stdout, stderr) {
      console.log('launching app');
    });
  }
}
