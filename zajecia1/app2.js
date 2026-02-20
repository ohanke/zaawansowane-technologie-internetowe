//routing

const http = require("http")

const server = http.createServer((req, res) => {

    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "Content-type": "text/plain" });
        res.end("Hello from node server");
    }

    else if (req.url === "/api" && req.method === "GET"){
        res.writeHead(200, { "Content-type": "application/json" });
        res.end(JSON.stringify({message:"Hello API page"}));
    }

    else{
        res.writeHead(404);
        res.end("Error 404: Not exists");
    }

});

server.listen(3000, () => {
    console.log("Server works: http://localhost:3000")

});