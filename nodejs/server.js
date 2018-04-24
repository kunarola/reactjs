var http = require('http');
var fs = require('fs');
var path = require('path');

http.createServer((req, res) => {
    if (req.url === "/") {
        fs.readFile('./public/index.html', 'UTF-8', function (err, html) {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(html);
        });
    } else if (req.url.match("\.css$")) {
        var cssPath = path.join(__dirname, 'public', req.url);
        var fileReadstream = fs.createReadStream(cssPath, 'URF-8');
        fileReadstream.writeHead(200, {"Content-Type": "text/html"});
        fileReadstream.pipe(res);

    } else if (req.url.match("\.png$")) {
        var imagePath = path.join(__dirname, 'public', req.url);
        var fileReadstream = fs.createReadStream(imagePath);
        fileReadstream.writeHead(200, {"Content-Type": "text/html"});
        fileReadstream.pipe(res);
    } else {
        res.writeHead('404', {'Content-Type': 'text/html'});
        res.write('Page not found');
        res.end();
    }
    console.log(req.url);
}).listen(3000);

/*
 http.createServer((req, res) => {
 res.writeHead(200, { 'Content-Type': 'text/html' });
 res.write('Hello from server');
 res.end();
 
 }).listen(3000);
 */