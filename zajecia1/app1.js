const http = require("http")

const server = http.createServer((req,res)=>{

    res.writeHead(200,{"Content-type":"text/plain"});
    res.end("Hello from node server");
});

server.listen(3000,()=>{
    console.log("Server works: http://localhost:3000")

});