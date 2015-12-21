var browser = typeof window !== 'undefined';

if (!browser) {
  var isWin = process.platform.match(/^win/);
  var fs = System._nodeRequire('fs');
  var mime = System._nodeRequire('mime-types')

  function fromFileURL(address) {
    address = address.replace(/^file:(\/+)?/i, '');

    if (!isWin)
      address = '/' + address;
    else
      address = address.replace(/\//g, '\\');

    return address;
  }
  
  function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
  }
  
  exports.translate = function (load) {
    var rootURL = load.rootURL || fromFileURL(load.baseURL);
    var type = mime.lookup(rootURL);
    var data = base64_encode(rootURL);

    load.metadata.format = 'amd';
    
    return 'def' + 'ine(function() {\nreturn "data:' + type + ';base64,' + data+ '";\n});';
  }  
} else {
  exports.translate = function(load) {
    load.metadata.format = 'amd';

    return 'def' + 'ine(function() {\nreturn "' + load.address + '";\n});';
  }
}