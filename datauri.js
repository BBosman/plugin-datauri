var isWin = process && process.platform && process.platform.match(/^win/);
var browser = typeof window !== 'undefined';
var mime = browser ? null : System._nodeRequire('mime-types');
var fs = browser ? null : System._nodeRequire('fs');

function fromFileURL(address) {
  address = address.replace(/^(file|http|https):(\/+)?/i, '');
  address = address.replace(/^localhost(:\d+)?(\/+)/i, '');

  if (!browser) {
    if (!isWin) {
      address = '/' + address;
    } else {
      address = address.replace(/\//g, '\\');
    }
  }
    
  return address;
}

function base64_encode(file) {
  var bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString('base64');
}

function dataUri(address) {
  var type = mime.lookup(address);
  var data = base64_encode(address);
    
  return 'data:' + type + ';base64,' + data;
}

function getUri(address) {
  address = fromFileURL(address);

  return browser ? address : dataUri(address);
}

exports.translate = function(load) {
  load.metadata.format = 'amd';
  return 'def' + 'ine(function() {\nreturn "' + getUri(load.address) + '";\n});';
}